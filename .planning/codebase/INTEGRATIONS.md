# External Integrations

## AI Provider
- **Google Gemini**: The backend integrates with Google's Gemini models using the official `@google/genai` SDK (`^0.12.0`). This is used heavily for generating interview questions, scoring, and providing feedback.
  - Used in: `backend/controllers/aiController.js`

## Databases
- **MongoDB**: The primary database used for storing users, sessions, and questions. Expected to connect via Mongoose.

## Tools
- **Test Database**: `mongodb-memory-server` implies in-memory database usage for tests.
