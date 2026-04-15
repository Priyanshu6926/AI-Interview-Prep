---
wave: 1
depends_on: []
files_modified:
  - "VAPI_SETUP.md"
  - "backend/models/Interview.js"
autonomous: true
---

# Plan: Phase 1 - Vapi Config & DB Prep

**Goal:** Ensure Vapi environment is properly documented and backend is ready for session data.
**Requirements mapped:** VAPI-01, VAPI-02, VAPI-03, ARCH-03

## Tasks

```xml
<task>
  <description>Create comprehensive Vapi Setup Guide</description>
  <read_first>
    - .planning/PROJECT.md
    - .planning/research/SUMMARY.md
  </read_first>
  <action>
    Create a new file `VAPI_SETUP.md` in the project root.
    Populate it with a detailed, beginner-friendly Markdown guide including:
    1. Introduction and Vapi overview.
    2. How to create an account on Vapi.ai and get Public/Private API Keys.
    3. Step-by-step instructions to create an Assistant via the dashboard.
    4. Model configuration instructions (setting provider to Google, model to Gemini 1.5 Pro / Flash).
    5. Instructions for adding `VAPI_PUBLIC_KEY` and `VAPI_PRIVATE_KEY` to the appropriate `.env` files (frontend and backend).
    6. Brief mention of frontend SDK setup to handle speech-to-text / text-to-speech WebRTC logic.
  </action>
  <acceptance_criteria>
    - `VAPI_SETUP.md` is present in the root directory.
    - File contains Markdown headers `## Account Creation`, `## API Keys`, `## Assistant Setup`, and `## Environment Variables`.
  </acceptance_criteria>
</task>

<task>
  <description>Create Interview Mongoose Schema</description>
  <read_first>
    - backend/models/Session.js
    - backend/models/User.js
  </read_first>
  <action>
    Create `backend/models/Interview.js`.
    Define a Mongoose schema `interviewSchema` with the following paths:
    - `userId`: ObjectId ref to User (required)
    - `role`: String (required)
    - `experienceLevel`: String (required)
    - `techStack`: Array of Strings
    - `transcript`: Array of Objects (each containing `role` (user or assistant) and `message`)
    - `scores`: Object containing `communication`, `technical`, `problemSolving`, and `overall` (Numbers)
    - `feedback`: String (detailed feedback)
    - `strengths`: Array of Strings
    - `weaknesses`: Array of Strings
    - `vapiCallId`: String (unique identifier for the call)
    - `createdAt` and `updatedAt` timestamps (via `{ timestamps: true }`)
    Export the model via `module.exports = mongoose.model('Interview', interviewSchema);`.
  </action>
  <acceptance_criteria>
    - `backend/models/Interview.js` exists.
    - File contains `mongoose.model('Interview'` and defines `scores.communication` logic.
  </acceptance_criteria>
</task>
```

## Verification
- **must_haves**: 
  - VAPI documentation covers account setup, keys, Gemini integration, and env vars.
  - The `Interview` collection is structured to capture individual score blocks effectively.
