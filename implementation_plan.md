# Maestro Functional Refactor Plan

**Goal**: Resolve UI and functional defects across Maestro platform:
- Unreadable white text in Voice Widget bento box.
- Greeting "hi" triggers unwanted trip booking with $500 budget.
- Generic placeholder responses for code prompts (e.g., for‑loops).
- Several UI buttons and bento cards are non‑functional or unnecessary.
- Voice input workflow should be reliable and visually clear.

## User Review Required
> [!IMPORTANT]
> The changes involve backend prompt routing (planner) and extensive UI refactor. Please confirm you are okay with a breaking change to the `/startTask` API signature (default budget removed) and UI redesign.

## Resolved Questions
> [!NOTE]
> 1. The voice widget will wait for a button click to start listening to prevent accidental triggers.
> 2. We will implement a dedicated "Generate Code" modal for better focus.
> 3. Required buttons are confirmed as: "New Task", "Run Code", "Voice Input", and "Clear Chat".

## Proposed Changes
---
### Backend (Planner Service)
#### 1. Prompt Intent Classification Enhancements
- Extend **detect_prompt_domain** to recognise greetings (`hi`, `hello`, `hey`) and map them to `Intent.GREETING`.
- Add a new enum `Intent` with values: `GREETING`, `CODE`, `TRIP`, `LOOP`, `DEFAULT`.
- Update `/startTask` handler to **only** create a trip task when `Intent.TRIP` is detected; otherwise return a friendly greeting response without allocating a budget.
- Remove default `$500` budget from the API; require explicit budget when creating a trip task.

#### 2. Code Generation Flow
- When `Intent.CODE` or `Intent.LOOP` is detected, route the request to the **code executor** module.
- Ensure the response contains actual code (e.g., a proper Python `for` loop) instead of placeholder text.
- Add unit tests for greeting handling and code generation.

### Frontend (Next.js)
#### 1. Voice Widget UI
- Update **VoiceWidget.tsx** styles: set text color to `var(--color-text-primary)` and background to a semi‑transparent dark card to guarantee readability.
- Add a microphone button with a clear tooltip; clicking toggles listening.
- Ensure the generated transcript appears in a scrollable container.

#### 2. Bento Box Refactor
- Replace the current static bento card with a **functional component** that accepts `title`, `description`, `onClick` props.
- Wire up onClick handlers for:
  - "Generate Code" → opens a modal with a text editor.
  - "Run Loop" → sends a predefined loop request.
  - "New Task" → opens the task creation dialog.
- Remove unused placeholder cards.

#### 3. Button Clean‑up & New Actions
- Consolidate action buttons into a **toolbar** component:
  - `New Task`
  - `Run Code`
  - `Voice Input`
  - `Clear Chat`
- Implement the `Clear Chat` handler to reset the chat session via `/auth/guest` or a dedicated endpoint.

#### 4. Code Display Component
- Create **CodeBlock.tsx** using Prism.js for syntax highlighting.
- Integrate it into the chat view so that generated code appears with copy‑to‑clipboard.

#### 5. Global CSS Adjustments
- Ensure all text inside frosted cards uses `color: var(--color-text-primary)`.
- Add a utility class `.text-dark` as fallback for dark backgrounds.

### Tests & Verification
- Run **pytest** for planner changes (expect all existing tests + new ones to pass).
- Run `npm run test` (if any) and `npm run type-check` for the frontend.
- Manual QA steps:
  1. Say "hi" → UI shows friendly greeting, no trip task created.
  2. Use voice input to say a code request → generated code appears correctly.
  3. Click each toolbar button and confirm expected behavior.

## Verification Plan
- **Automated**: `pytest` (backend) and `tsc --noEmit` (type safety).
- **Manual**: Open `http://localhost:3000`, test greeting, voice input, code generation, and button actions.
- **Visual**: Confirm no white‑on‑white text; all text readable.

---
---

## UI Layout Redesign

- **Top Tab Bar**: Responsive tabs – **Dashboard**, **Tasks**, **Tools**, **Config**.
  - *Dashboard*: Shows main overview (productivity ring, quick stats, Add Task button).
  - *Tasks*: Opens a modal window listing all tasks (title, budget, status). Selecting a task loads its chat history within the modal for continued planning or conversation.
  - *Tools*: Displays bento‑style cards for each provided tool (Voice Input, Generate Code, Run Loop, etc.).
  - *Config*: Placeholder panel for future settings.

- **Responsive Design**: Use CSS grid/flex with breakpoints; tabs collapse to a hamburger menu on small screens. Modal dialogs are scroll‑able and mobile‑friendly.

- **New Components**:
  - `TabBar.tsx` – handles navigation and responsive collapse.
  - `TaskModal.tsx` – modal with task list and embedded chat component.
  - `ToolBentoGrid.tsx` – layout for tool cards.
  - `ConfigPanel.tsx` – empty placeholder.

*Implementation will be done in multiple commits, each scoped to a component for easy review.*
