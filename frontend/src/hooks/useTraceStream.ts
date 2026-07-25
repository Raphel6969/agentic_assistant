"use client";

import { useEffect, useState, useRef } from "react";
import type { TraceEvent, Task, Domain } from "@/lib/types";

const PLANNER_URL = process.env.NEXT_PUBLIC_PLANNER_URL || "http://localhost:8000";
const PLANNER_WS_URL = process.env.NEXT_PUBLIC_PLANNER_WS_URL || "ws://localhost:8000";

export function useTraceStream() {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TraceEvent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const startTask = async (description: string, domain: Domain = "trip", budget: number = 500) => {
    setIsLoading(true);
    setError(null);
    setEvents([]);
    setSelectedEvent(null);

    try {
      const resp = await fetch(`${PLANNER_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          domain,
          budget_ceiling: budget,
        }),
      });

      if (!resp.ok) {
        throw new Error(`Failed to start task: HTTP ${resp.status}`);
      }

      const data = await resp.json();
      const newTask: Task = {
        task_id: data.task_id,
        status: data.status,
        domain: domain,
        description: data.description,
        budget_ceiling: data.budget_ceiling,
        budget_spent: 0,
        created_at: new Date().toISOString(),
      };

      setCurrentTask(newTask);

      // Connect WebSocket
      connectWebSocket(data.task_id);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Failed to connect to planner service";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWebSocket = (taskId: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = `${PLANNER_WS_URL}/ws/tasks/${taskId}/trace`;
    console.log("Connecting WS:", wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event: MessageEvent) => {
      try {
        const traceEvent: TraceEvent = JSON.parse(event.data);
        setEvents((prev: TraceEvent[]) => {
          if (prev.some((e) => e.event_id === traceEvent.event_id)) {
            return prev;
          }
          return [...prev, traceEvent];
        });

        if (traceEvent.cost_estimate) {
          setCurrentTask((prevTask: Task | null) => {
            if (!prevTask) return null;
            return {
              ...prevTask,
              budget_spent: (prevTask.budget_spent || 0) + (traceEvent.cost_estimate || 0),
            };
          });
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    ws.onerror = (err: Event) => {
      console.error("WebSocket error:", err);
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    currentTask,
    events,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    error,
    startTask,
  };
}
