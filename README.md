# ✳ Orcheon — Autonomous Agentic AI Workspace Engine

> An enterprise-grade autonomous AI workspace assistant that decomposes high-level instructions into explicit 6-State FSM sub-tasks, routes intent via a **Dual-Engine Intent Classifier**, enforces hard budget ceilings using a **Rust Policy Solver**, fan-outs tool execution across a **Go MCP Gateway**, and presents full step-by-step control via a **Human-in-the-Loop Plan Inspector**.

🌐 **Live Deployed Web Workbench**: [https://orcheon-ai.onrender.com/](https://orcheon-ai.onrender.com/)

---

## 🚀 Key Features & Differentiators

### 1. 🏛️ Dual-Engine Intent Router
- **Conversational Knowledge Branch**: Informational Q&A (e.g., *"Who is Lincoln?"*, *"What date is it today?"*, *"How does quantum computing work?"*) is routed directly to the Dynamic LLM Engine for instant synthesis. **Zero fake task clutter!**
- **Actionable Execution Branch**: Complex requests (*"Plan a trip to Paris under $600"*, *"Write a Python Fibonacci script"*) are routed to the 6-State FSM Execution Engine.

### 2. 🛡️ Human-in-the-Loop Plan Inspector
- **FSM Step Decomposition**: Every task breaks down into 3 inspectable sub-steps (e.g. *Step 1: Search flights*, *Step 2: Reserve hotel*, *Step 3: Fetch weather forecast*).
- **Interactive Approval Gating**: Solution generation and tool execution are strictly gated until the user clicks **`✓ Approve & Execute All`**.
- **Granular Controls**: Edit parameters on the fly or skip specific tool execution steps.

### 3. 💬 Interactive In-Task Conversational Assistant
- **Opinion & Trade-Off Analysis**: Ask follow-up questions directly inside active task cards (*"Which flight option is better in your opinion?"* → AI compares direct vs layover pricing).
- **Live Parameter Adjustments**: Say *"Change date to Sept 20"* → Orcheon acknowledges the change and updates the flight search parameters dynamically.

### 4. 💳 Agentic Commerce Protocol (ACP) & Financial Token Audit
- **ACP Financial Audit Widget**: Real-time tracking of budget ceilings, spent funds, remaining funds, and redeemed payment tokens (`acp_spt_4092_01`).
- **Simulated ACP Merchant Checkout**: Complete flight & hotel bookings with simulated payment tokens.

### 5. 📦 1-Click Artifact Exporters
- Download generated Python scripts directly as `.py` files.
- Export travel itineraries as beautifully formatted `.md` Markdown files.
- Export full audit logs and execution traces as raw `.json` files.

### 6. ✈️ Multi-Stop & Multi-City Travel Planner
- Configure multi-leg flight itineraries (e.g., `BOM → PAR → HND`).
- Select hotel stay durations (1 to 14 nights) and budget allocations.

### 7. 🦀 Deterministic Rust Policy Core & Go MCP Tool Gateway
- **Rust Solver (:8090)**: Enforces hard budget ceilings and 3-tier security permissions (`Read-Only`, `Reversible`, `Irreversible`) in **< 5ms**.
- **Go MCP Gateway (:8080)**: Hosts MCP tool servers with Goroutine fan-out, circuit breaker protection, and automatic fallback caches.

### 8. 🎨 Cyber-Glass High-Contrast Theme System
- Full **Light & Dark Mode** support with curated high-contrast slate palettes (`#0F172A`, `#1E293B`, `#F8FAFC`).

---

## 🌐 Real vs. Seeded Demo Integrations

> 💡 **API Key Note for Evaluators / Judges**: Live commercial flight/hotel booking APIs require enterprise subscriptions and restricted OAuth credentials. Orcheon seamlessly integrates real unauthenticated REST APIs for live data and uses realistic seeded mocks for booking engines so it functions 100% out of the box with zero API key friction!

| Integration | Type | Source / Protocol |
|---|---|---|
| **7-Day Weather Forecast** | Real Live REST API | [Open-Meteo REST API](https://open-meteo.com) (Zero auth required) |
| **Global Public Holidays** | Real Live REST API | [Nager.Date REST API](https://date.nager.at) (Zero auth required) |
| **Live Currency Exchange** | Real Live REST API | [Frankfurter REST API](https://frankfurter.app) (Zero auth required) |
| **Merchant Checkout** | ACP Standard Simulation | Agentic Commerce Protocol (`Checkout` + `SharedPaymentToken`) |
| **Flight & Hotel Search** | Seeded Mocks | Seeded reproducible data for zero-key evaluation |

---

## ☁️ Deployment on Render (1-Click Blueprint)

Orcheon includes a native [`render.yaml`](render.yaml) blueprint specification for instant deployment from GitHub to Render.

### Option A: 1-Click Render Blueprint (Recommended)
1. Fork or push this repository to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect `render.yaml` and provision all 4 microservices (`orcheon-frontend`, `orcheon-planner`, `orcheon-gateway`, `orcheon-solver`).
6. Add your `GROQ_API_KEY` or `GEMINI_API_KEY` in the Environment tab and click **Deploy**!

### Option B: Docker Container Deployment
Each service contains its own standalone `Dockerfile`:
- `frontend/Dockerfile`
- `planner/Dockerfile`
- `gateway/Dockerfile`
- `solver/Dockerfile`

---

## 💻 Local Development Setup

### 1. Environment Configuration
```bash
cp .env.example .env
# Add your GROQ_API_KEY (from https://console.groq.com) or GEMINI_API_KEY
```

### 2. Run All Services with Docker Compose
```bash
docker compose up --build
```
Access the Workbench at **`http://localhost:3000`**.

### 3. Service Ports Topology

| Service | Language / Stack | Port | Endpoint |
|---|---|---|---|
| **Frontend Workbench** | Next.js 14 / React 18 | `3000` | `http://localhost:3000` |
| **FastAPI Planner & FSM** | Python 3.12 / FastAPI | `8000` | `http://localhost:8000` |
| **Go MCP Tool Gateway** | Go 1.23 | `8080` | `http://localhost:8080` |
| **Rust Policy Solver** | Rust 1.85 / Tokio | `8090` | `http://localhost:8090` |
| **PostgreSQL Database** | Postgres 16 | `5432` | `postgresql://postgres:postgres@localhost:5432/airline_db` |

---

## 🧪 Testing & Verification

```bash
# Python Planner FSM & Intent Tests
cd planner && pytest

# Go MCP Gateway Fan-out Tests
cd gateway && go test ./...

# Rust Policy Solver Guardrail Tests
cd solver && cargo test

# Frontend TypeScript Type Check
cd frontend && npm run type-check
```

---

## 📜 Architecture & Decisions
- See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for data flow and trace schemas.
- See [DECISIONS.md](DECISIONS.md) for Architectural Decision Records (ADRs 1–4).
