# Project Structure

The repository is organized into a monorepo-style structure with separate `backend` and `frontend` directories.

## Backend Structure
`backend/`
- `config/`: Configuration files (e.g., DB connection).
- `controllers/`: Request handling logic (`aiController.js`, `authController.js`, etc.).
- `middlewares/`: Express middlewares (authentication, validation).
- `models/`: Mongoose schemas (`Question.js`, `Session.js`, `User.js`).
- `routes/`: Express route definitions.
- `uploads/`: Local directory for uploaded files.
- `utils/`: Reusable utilities.

## Frontend Structure
`frontend/interview-prep-ai/`
- `src/assets/`: Static assets.
- `src/components/`: Reusable UI components (`Cards/`, `Inputs/`, `Modal.jsx`, `Drawer.jsx`).
- `src/context/`: React context providers (`userContext.jsx`).
- `src/pages/`: Route-level components (`Auth/`, `Home/`, `InterviewPrep/`).
- `src/utils/`: Frontend helper functions.

## Naming Conventions
- Backend: camelCase for files (`aiController.js`), PascalCase for models (`User.js`).
- Frontend: PascalCase for components/pages (`App.jsx`, `Modal.jsx`, `cards/`), camelCase or lowercase for directories.
