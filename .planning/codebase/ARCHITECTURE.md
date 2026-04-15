# Architecture

## Pattern
The application follows a standard Client-Server architecture with a RESTful API backend and a Single Page Application (SPA) frontend.

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
