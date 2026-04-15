# Concerns & Technical Debt

## Security
- `backend/uploads/` directory takes user uploads. Needs careful validation to prevent arbitrary file execution.
- Ensure `.env` is properly ignored (it's currently present in `backend/.env`, meaning environment variables are local).
- No formal input validation middleware like `joi` or `express-validator` configured.

## Performance
- The use of `nodemon` in dev is fine, but needs a solid production build process.
- No caching mechanism is described. Depending on the size of responses from Google Gemini, this could cause latency or quota hits.

## Technical Debt
- Lack of an automated testing framework (Jest, Mocha) makes regressions harder to catch. Manual test scripts like `test_gemini.js` are not scalable.
- Error handling on backend needs a centralized error-handling middleware.
- Missing TypeScript. Type safety would benefit both backend controllers and frontend props.
