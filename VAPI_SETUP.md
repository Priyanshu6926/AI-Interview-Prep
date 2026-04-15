# Vapi.ai Setup & Configuration Guide

This guide covers everything you need to know to set up Vapi for real-time voice interviews.

## 1. Introduction
Vapi handles the WebRTC voice connection, speech-to-text, LLM prompt orchestration, and text-to-speech generation. We use Vapi to offload the latency and complex socket logic required for a real-time conversational agent.

## 2. Account Creation
1. Go to [Vapi.ai](https://vapi.ai) and sign up for an account.
2. Once logged in, navigate to the **Dashboard**.

## 3. API Keys
1. In the Vapi Dashboard, go to **API Keys**.
2. You will see both a **Public Key** and a **Private Key**.
   - **Public Key**: Used in the frontend SDK (React) to initiate calls securely.
   - **Private Key**: Used in the backend to manage assistants, fetch transcripts, and configure webhooks securely.

## 4. Assistant Setup
1. Go to the **Assistants** tab in the Vapi dashboard.
2. Click **Create Assistant**.
3. Choose **Blank Template**.
4. In the configuration:
   - **Transcriber**: Deepgram is the default (and highly recommended for accuracy).
   - **Voice**: Choose an adequate TTS voice (e.g., ElevenLabs / PlayHT depending on your tier, or default built-in).

## 5. Model Configuration
Under the **Model** section of your new Assistant:
1. **Provider**: Select `Google`.
2. **Model**: Select `gemini-1.5-pro` (or `gemini-1.5-flash` for lower latency).
3. **System Prompt**: This will be dynamically overridden by our frontend/backend to pass the candidate's exact role and tech stack, but you can set a default here:
   > "You are a professional technical interviewer. Ask one question at a time. If the candidate gives a vague answer, push back and ask for details."

## 6. Environment Variables
Add the keys to your respective `.env` files.

**Backend (`backend/.env`)**:
```env
VAPI_PRIVATE_KEY=your_private_api_key_here
```

**Frontend (`frontend/interview-prep-ai/.env`)**:
```env
VITE_VAPI_PUBLIC_KEY=your_public_api_key_here
VITE_VAPI_ASSISTANT_ID=your_assistant_id_here
```
*(You can find the Assistant ID at the top of your specific Assistant's configuration page).*

## 7. Next Steps: Frontend SDK
We will integrate `@vapi-ai/web` in the React frontend to initialize sessions:
```javascript
import Vapi from "@vapi-ai/web";
const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);
vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID);
```
