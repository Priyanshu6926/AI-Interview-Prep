# Roadmap

**3 phases** | **9 requirements mapped** | All v1 requirements covered ✓

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Vapi Config & DB Prep | Document Vapi and prep DB | VAPI-01, VAPI-02, VAPI-03, ARCH-03 | 1. Documentation generated. 2. Interview Schema created. |
| 2 | Core Voice Agent | Build AI prompt & Frontend Voice SDK | ARCH-01, UI-01, UI-02 | 1. Frontend starts/stops Vapi. 2. AI follows strict conversational rules. |
| 3 | Post-Interview Feedback | Sync transcript and display metrics | ARCH-02, UI-03 | 1. Vapi payload saved to DB. 2. UI displays robust categorized feedback. |

### Phase Details

**Phase 1: Vapi Config & DB Prep**
Goal: Ensure Vapi environment is properly documented and backend is ready for session data.
Requirements: VAPI-01, VAPI-02, VAPI-03, ARCH-03
Success criteria:
1. Detailed Markdown guide exists for creating the assistant.
2. `Interview` schema accurately reflects all score fields.

**Phase 2: Core Voice Agent**
Goal: Actual real-time voice interview handles start to finish on the frontend.
Requirements: ARCH-01, UI-01, UI-02
Success criteria:
1. User can input Role/Tech Stack.
2. Microphone permissions work and Vapi SDK connects successfully.
3. AI pushes back on vague responses.

**Phase 3: Post-Interview Feedback**
Goal: Show the user how they performed.
Requirements: ARCH-02, UI-03
Success criteria:
1. Vapi post-call webhook correctly updates MongoDB.
2. User sees Communication/Technical scores and strengths/weaknesses on their dashboard.
