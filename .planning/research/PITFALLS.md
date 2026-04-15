# Research: Pitfalls

## Common Mistakes
1. LLM Latency: Deeply contextual LLMs take too long to reply to voice.
   *Prevention*: Keep system prompts optimized, use faster models (Gemini Flash) for voice interaction.
2. WebHook synchronization: Attempting to handle the voice streaming through your own simple backend.
   *Prevention*: Use Vapi's client SDK directly on the frontend for WebRTC to avoid middleman latency. Use backend only for pre-call setup and post-call data sync.
