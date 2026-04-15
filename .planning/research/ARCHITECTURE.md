# Research: Architecture

## Core Patterns
- Frontend initiates Vapi SDK session by providing an Assistant ID and user context.
- Vapi manages the real-time WebRTC voice session directly with the user.
- Vapi communicates with the AI Provider (Gemini) using standard prompts.
- Webhooks or Vapi's end-of-call report API is used to send the transcript and structured feedback back to the Backend.
- Backend saves the session in MongoDB and updates the user's dashboard.
