# Research Summary

## Key Findings
- Vapi is the optimal choice for real-time WebRTC voice orchestration, removing handling complexity from the backend.
- The standard pattern is: setup on backend -> Vapi frontend SDK for transport -> Server webhook for final transcript and score storage.
- Using Gemini via Vapi provides the conversational context. We must implement a strict system prompt to handle follow-up question pushback.
