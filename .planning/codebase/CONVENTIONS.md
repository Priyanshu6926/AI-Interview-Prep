# Conventions

## Code Style
- **JavaScript**: CommonJS on the backend (using `require()`) and ES Modules on the frontend (using `import`).
- **React**: Functional components with hooks.
- **Styling**: Tailwind CSS utility classes format, configured via Vite plugin.

## Error Handling
- Callbacks/Promises wrapped appropriately in backend routes to handle external errors (e.g., from Gemini or MongoDB).
- Status codes are typically returned in response JSON.
- Frontend uses `react-hot-toast` for displaying notifications/errors to the user.

## Patterns
- MVC pattern on the backend (Models, Controllers, Routes).
- Component-driven architecture on the frontend.
