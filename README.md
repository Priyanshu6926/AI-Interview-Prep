# Interview Prep AI

Interview Prep AI is a full-stack interview coaching app with JWT auth, AI-generated role-based sessions, pinned questions, lecture resources, and a responsive learning dashboard inspired by the provided hero design.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- AI: Gemini via `@google/generative-ai` with deterministic fallback responses for local development
- Bonus UX: Web Speech API voice reader, curated lecture library, readiness scoring endpoint
- Extensions: PDF resume parsing, Monaco-based coding lab, and WebRTC mock interview rooms

## Project Structure

```text
client/   React frontend
server/   Express API and Mongo models
```

## Environment Variables

Create these files before running:

### `/server/.env`

```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/interview-prep-ai
JWT_SECRET=replace-with-a-strong-secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=
```

### `/client/.env`

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

## Run Locally

```bash
npm install
npm run dev:server
npm run dev:client
```

The server seeds curated lectures automatically at startup.

## Implemented Features

1. JWT authentication with register/login flows
2. Role and experience based interview session generation
3. AI-backed questions, answers, explanations, and readiness scoring
4. Accordion-style Q&A dashboard with pinning support
5. Curated lectures page for React, system design, and behavioral prep
6. Web Speech API audio reader for question + answer playback
7. MongoDB persistence for users and sessions
8. Landing page and dashboard UI aligned to the supplied design direction
9. Resume-aware session generation using uploaded PDF resumes
10. Stored voice practice attempts with readiness trend tracking
11. Monaco coding lab with runnable sample checks
12. Peer mock rooms with REST-backed WebRTC signaling and AI prompt queues

## Notes

- Resume upload currently accepts PDF files up to 5 MB.
- Speech recognition depends on browser support and works best in Chrome or Edge.
- Mock rooms use browser WebRTC with polling-based signaling backed by the Express API.
