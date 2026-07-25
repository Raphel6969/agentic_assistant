/**
 * Main page — 5-panel layout shell.
 * Phase 0: structural skeleton with correct proportions.
 * Phase 3: full Flight Recorder, detail panel, and animations wired in.
 */
export default function Home() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "var(--header-height) 1fr var(--input-bar-height)",
        gridTemplateColumns: "var(--sidebar-width) 1fr",
        height: "100vh",
        overflow: "hidden",
        background: "var(--color-base)",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header
        className="glass"
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 12,
          borderBottom: "var(--glass-border)",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 15,
            background: "linear-gradient(135deg, var(--color-indigo), var(--color-emerald))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          Agentic Assistant
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Phase 0 — Scaffold
        </span>
      </header>

      {/* ── Left Sidebar ───────────────────────────────────────────────── */}
      <aside
        className="glass"
        style={{
          gridRow: "2 / 3",
          borderRight: "var(--glass-border)",
          padding: 16,
          overflowY: "auto",
        }}
      >
        <p style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
          Sidebar — Phase 3
        </p>
      </aside>

      {/* ── Flight Recorder (main stage) ───────────────────────────────── */}
      <main
        style={{
          gridRow: "2 / 3",
          overflowY: "auto",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
          Flight Recorder trace timeline will appear here — Phase 3
        </p>
      </main>

      {/* ── Chat Input Bar ─────────────────────────────────────────────── */}
      <footer
        className="glass"
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 12,
          borderTop: "var(--glass-border)",
        }}
      >
        <input
          type="text"
          placeholder="Plan a 3-day trip to Paris under $800…"
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            outline: "none",
            transition: "border-color var(--duration-fast) var(--ease-standard)",
          }}
        />
        <button
          style={{
            background: "var(--color-indigo)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-md)",
            padding: "10px 20px",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </footer>
    </div>
  );
}
