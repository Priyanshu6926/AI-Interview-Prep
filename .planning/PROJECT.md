# AI-Powered Mock Interview System

## What This Is

A full-stack application for AI-driven interview preparation with an advanced real-time voice feature. It enables users to have interactive, realistic voice mock interviews with an AI that asks dynamic questions, pushes back on vague answers, and gives robust post-interview feedback.

## Core Value

Providing an authentic, high-pressure, real-time voice interview simulation that evaluates and improves both technical knowledge and communication skills.

## Requirements

### Validated

- ✓ User Authentication (JWT-based)
- ✓ Core backend structure and Express API routing
- ✓ System database schema (User, Session, Question via MongoDB / Mongoose)
- ✓ Basic UI components and styling in React + TailwindCSS

### Active

- [ ] Create detailed, step-by-step documentation for Vapi account setup, assistant creation, API keys, and model configuration
- [ ] Build interview creation flow (Role, Experience, Tech Stack, Question count)
- [ ] Integrate Vapi frontend SDK to manage real-time speech-to-text / text-to-speech voice sessions
- [ ] Develop AI prompt to ensure the AI asks one question at a time, waits for answers, pushes back on vagueness, and simulates real pressure
- [ ] Build automated post-interview feedback system (Communication, Technical, Problem-solving, Confidence scores + Strengths, Weaknesses)
- [ ] Store voice interview session outputs and structured feedback back into the MongoDB database
- [ ] Build UI components for the live interview and feedback screens

### Out of Scope

- [ ] Video interview integration — Focus is purely on high-quality real-time voice and text feedback to ensure low latency and reduced complexity.

## Context

The existing project is a MERN stack application (Node.js, Express, React, Vite) that currently handles standard AI generation via Google's Gemini SDK. The key new addition is elevating the realism using Vapi for conversational voice interaction. 
The user requires a *production-ready* modular implementation and extremely detailed instructions for Vapi setup from scratch, anticipating a beginner's level of familiarity with Vapi.

## Constraints

- **Tech Stack**: Must use the existing MERN stack (Node.js, Express, MongoDB, React, Vite, Tailwind CSS).
- **Architecture**: Must be clean and modular; UI components should be reusable.
- **Documentation**: A detailed setup guide is mandatory; no Vapi configuration steps can be skipped.
- **Asynchrony**: Voice transcriptions and AI processing must handle asynchronous database updates properly.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Vapi for real-time voice | Mandated by user; provides excellent real-time WebRTC and LLM orchestration out-of-the-box | — Pending |
| Standardize on Gemini | The project already uses `@google/genai` so keeping Gemini with Vapi reduces stack variations, though OpenAI is an easy alternative | — Pending |

---
*Last updated: 2026-04-15 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
