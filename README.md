# HR Workflow Designer — WorkflowHR

A production-quality **HR Workflow Designer** built with React + React Flow that allows HR administrators to visually create, configure, and test internal workflows such as employee onboarding, leave approval, and document verification.

![WorkflowHR](https://img.shields.io/badge/React-18-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![React Flow](https://img.shields.io/badge/React_Flow-v11-ff6b6b) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-v3-38bdf8)

---

## 🎯 Overview

This project is a mini HR Workflow Designer module demonstrating:

- **Deep knowledge of React and React Flow** — Custom nodes, positioning, edge management
- **Modular, scalable front-end architecture** — Clean separation of concerns
- **Mock API integration** — Separate Node.js backend with REST endpoints
- **Configurable nodes with custom edit forms** — Dynamic forms for 5 node types
- **Workflow simulation/testing** — Graph validation + step-by-step execution sandbox

---

## 🏗 Architecture

```
Tredence-Project/
├── frontend/                    # Next.js 14 App Router
│   └── src/
│       ├── app/                 # Next.js pages and global styles
│       ├── components/
│       │   ├── canvas/          # WorkflowCanvas (React Flow)
│       │   ├── nodes/           # 5 custom node components + registry
│       │   ├── forms/           # Dynamic configuration forms
│       │   ├── panels/          # Sidebar, NodeEditor, Simulation, Toolbar
│       │   └── WorkflowDesigner.tsx  # Main client component
│       ├── hooks/               # Custom React hooks
│       ├── store/               # Zustand state management
│       ├── lib/                 # API client & utilities
│       └── types/               # TypeScript interfaces
│
├── backend/                     # Express.js (Node.js) — separate server
│   └── src/
│       ├── routes/              # API route handlers
│       ├── data/                # Mock data (JSON)
│       ├── services/            # Simulation engine
│       └── index.js             # Server entry point
│
└── README.md
```

### Key Design Decisions

1. **Separate Backend** — The Node.js backend runs independently on port `4000`. The frontend connects via `NEXT_PUBLIC_API_URL` environment variable. This allows deploying the backend anywhere and just updating the URL.

2. **Zustand over Context API** — Chosen for its minimal boilerplate, excellent performance (no unnecessary re-renders), and built-in support for undo/redo patterns via history stack management.

3. **Custom CSS Design System** — While Tailwind is used for utility classes, a comprehensive custom CSS design system (`globals.css`) provides consistent node styling, panel animations, form components, and React Flow overrides. This ensures visual consistency and easy theming.

4. **Dynamic Form Registry** — Each node type maps to a specific form component. Adding a new node type requires only: (a) a new form component, (b) adding to the form registry, (c) adding type config. This scales well.

5. **Client-side Fallback** — If the backend is unavailable, the app gracefully degrades with fallback mock data for automations and client-side simulation, ensuring the demo always works.

6. **Dagre Auto-Layout** — Topological auto-layout using the dagre graph library for clean top-to-bottom arrangement of workflow nodes.

---

## 🚀 How to Run

### Prerequisites
- Node.js 18+
- npm

### 1. Start the Backend

```bash
cd backend
npm install
npm start
```

The API server starts at `http://localhost:4000`. Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/automations` | List automation actions |
| GET | `/api/automations/:id` | Get specific automation |
| POST | `/api/simulate` | Run workflow simulation |
| POST | `/api/simulate/validate` | Validate workflow structure |
| GET | `/api/templates` | List workflow templates |
| GET | `/api/templates/:id` | Get template details |

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:3000`.

### Configuration

To point the frontend to a different backend URL, edit `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

---

## ✅ Features Implemented

### Core Requirements

| Feature | Status |
|---------|--------|
| React Flow canvas with drag-and-drop | ✅ |
| 5 custom node types (Start, Task, Approval, Automated, End) | ✅ |
| Drag nodes from sidebar | ✅ |
| Connect nodes with edges | ✅ |
| Select node to edit | ✅ |
| Delete nodes/edges | ✅ |
| Node configuration forms with required fields | ✅ |
| Dynamic forms (key-value pairs, API-driven dropdowns) | ✅ |
| Mock API layer (Express.js) | ✅ |
| GET /automations endpoint | ✅ |
| POST /simulate endpoint | ✅ |
| Workflow testing/sandbox panel | ✅ |
| Graph validation (cycles, connectivity, start/end presence) | ✅ |
| Step-by-step execution timeline | ✅ |
| Clean folder structure | ✅ |
| TypeScript type safety | ✅ |
| README with architecture documentation | ✅ |

### Bonus Features

| Feature | Status |
|---------|--------|
| Export/Import workflow as JSON | ✅ |
| Workflow templates (Onboarding, Leave, Docs) | ✅ |
| Undo/Redo with keyboard shortcuts | ✅ |
| MiniMap with node coloring | ✅ |
| Zoom controls + Fit View | ✅ |
| Auto-layout (dagre algorithm) | ✅ |
| Validation errors/warnings display | ✅ |
| Client-side fallback when backend is down | ✅ |

---

## 🎨 Node Types

| Type | Color | Icon | Fields |
|------|-------|------|--------|
| **Start** | 🟢 Emerald | Play | Title, Metadata (key-value) |
| **Task** | 🔵 Blue | Clipboard | Title*, Description, Assignee, Due Date, Custom Fields |
| **Approval** | 🟡 Amber | CheckCircle | Title, Approver Role (dropdown), Auto-approve Threshold |
| **Automated** | 🟣 Purple | Zap | Title, Action (API dropdown), Dynamic Parameters |
| **End** | 🔴 Rose | Flag | End Message, Summary Toggle |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 14 (App Router) |
| Canvas/Flow | React Flow (@xyflow/react) v12 |
| State Management | Zustand |
| Styling | Tailwind CSS v4 + Custom CSS |
| Icons | Lucide React |
| TypeScript | Full type safety |
| Auto-layout | Dagre |
| Backend | Express.js (Node.js) |
| API Format | REST (JSON) |

---

## 🧪 Simulation Engine

The backend simulation engine (`services/simulator.js`) implements:

1. **Graph Validation** — Checks for:
   - Start/End node presence
   - Cycle detection (DFS-based)
   - Orphan node detection
   - Invalid connections (incoming to Start, outgoing from End)

2. **Topological Sort** — Kahn's algorithm for determining execution order

3. **Step Simulation** — Each node type has configured:
   - Duration ranges (min/max)
   - Failure probability
   - Status messages

---

## 💡 What I Would Add With More Time

- **Conditional branching** — Support for if/else logic in the workflow (e.g., approval → approved/rejected paths)
- **Node version history** — Track changes to individual node configurations
- **Real-time collaboration** — WebSocket-based multi-user editing
- **Workflow versioning** — Save and compare workflow versions
- **Advanced validation** — More sophisticated graph analysis (reachability, completeness)
- **Storybook** — Component documentation and isolated testing
- **E2E tests** — Playwright/Cypress tests for drag-and-drop workflows
- **Custom edge labels** — Show conditions on edge connections
- **Dark mode** — Full dark theme toggle

---

## 🎓 Assumptions

1. No authentication or persistent storage is needed (as per requirements)
2. The backend is a mock API — no real email sending, JIRA integration, etc.
3. Simulation results are randomized to demonstrate the UI, not production-ready
4. The workflow is a DAG (Directed Acyclic Graph) — cycles are treated as errors
5. One Start node is expected as the primary entry point (multiple are warned)
6. The frontend works with fallback data even if the backend is not running

---

*Built for the Tredence Studio — AI Agents Engineering Internship Case Study*
