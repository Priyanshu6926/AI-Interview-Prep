<!-- GSD:project-start source:PROJECT.md -->
## Project

**AI-Powered Mock Interview System**

A full-stack application for AI-driven interview preparation with an advanced real-time voice feature. It enables users to have interactive, realistic voice mock interviews with an AI that asks dynamic questions, pushes back on vague answers, and gives robust post-interview feedback.

**Core Value:** Providing an authentic, high-pressure, real-time voice interview simulation that evaluates and improves both technical knowledge and communication skills.

### Constraints

- **Tech Stack**: Must use the existing MERN stack (Node.js, Express, MongoDB, React, Vite, Tailwind CSS).
- **Architecture**: Must be clean and modular; UI components should be reusable.
- **Documentation**: A detailed setup guide is mandatory; no Vapi configuration steps can be skipped.
- **Asynchrony**: Voice transcriptions and AI processing must handle asynchronous database updates properly.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Overview
## Backend
- **Runtime**: Node.js
- **Framework**: Express (`express^5.1.0`)
- **Database**: MongoDB with Mongoose (`mongoose^8.14.1`)
- **Authentication**: JWT (`jsonwebtoken^9.0.2`), bcryptjs (`bcryptjs^3.0.2`)
- **Storage/File Uploads**: multer (`multer^1.4.5-lts.2`)
- **Others**: cors, dotenv
## Frontend
- **Framework**: React (`react^19.1.0`) with Vite
- **Styling**: TailwindCSS (`@tailwindcss/vite^4.1.5`)
- **Routing**: React Router (`react-router-dom^7.5.3`)
- **State Management**: React Context (`src/context/userContext.jsx`)
- **HTTP Client**: Axios (`axios^1.9.0`)
- **Icons/UI**: react-icons, framer-motion, react-hot-toast
- **Markdown Handling**: react-markdown, react-syntax-highlighter, remark-gfm
- **Dates**: moment
## Configuration Files
- Backend: `backend/package.json`, `backend/.env`
- Frontend: `frontend/interview-prep-ai/package.json`, `frontend/interview-prep-ai/vite.config.js`, `frontend/interview-prep-ai/eslint.config.js`
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Code Style
- **JavaScript**: CommonJS on the backend (using `require()`) and ES Modules on the frontend (using `import`).
- **React**: Functional components with hooks.
- **Styling**: Tailwind CSS utility classes format, configured via Vite plugin.
## Error Handling
- Callbacks/Promises wrapped appropriately in backend routes to handle external errors (e.g., from Gemini or MongoDB).
- Status codes are typically returned in response JSON.
- Frontend uses `react-hot-toast` for displaying notifications/errors to the user.
## Patterns
- MVC pattern on the backend (Models, Controllers, Routes).
- Component-driven architecture on the frontend.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern
## Data Flow
- Client sends HTTP requests (managed by Axios).
- Backend Express API receives requests.
- Controllers process business logic (e.g. AI interactions in `aiController.js`, authentication in `authController.js`).
- State is persisted to MongoDB via Mongoose Models.
## Abstractions
- **Controllers**: Grouped by domain (Auth, Question, Session, AI).
- **Models**: Defines schemas (User, Question, Session) matching the controllers.
- **Routes**: Expose API endpoints combining proper middleware and controllers.
- **Frontend Pages/Components**: UI logic is split into pages (`Auth`, `Home`, `InterviewPrep`) and shared components (Buttons, Modals, Drawers).
## Entry Points
- Backend: `backend/server.js` starts the Express server.
- Frontend: `frontend/interview-prep-ai/src/main.jsx` mounts the React application.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.agent/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
