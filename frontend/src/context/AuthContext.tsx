"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, name?: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PLANNER_URL = process.env.NEXT_PUBLIC_PLANNER_URL || "http://localhost:8000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("maestro_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, name?: string) => {
    try {
      const resp = await fetch(`${PLANNER_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "demo", name }),
      });
      const userData: User = await resp.json();
      setUser(userData);
      localStorage.setItem("maestro_user", JSON.stringify(userData));
    } catch (e) {
      // Fallback local user creation
      const userData: User = {
        user_id: "user_marco",
        name: name || "Marco",
        email: email,
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
        token: "maestro_token_local",
      };
      setUser(userData);
      localStorage.setItem("maestro_user", JSON.stringify(userData));
    }
  };

  const guestLogin = async () => {
    try {
      const resp = await fetch(`${PLANNER_URL}/auth/guest`, { method: "POST" });
      const userData: User = await resp.json();
      setUser(userData);
      localStorage.setItem("maestro_user", JSON.stringify(userData));
    } catch (e) {
      const userData: User = {
        user_id: "user_marco",
        name: "Marco",
        email: "marco@maestro.ai",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
        token: "maestro_token_guest",
      };
      setUser(userData);
      localStorage.setItem("maestro_user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("maestro_user");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
