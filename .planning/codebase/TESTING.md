# Testing

## Frameworks
- `mongodb-memory-server` is in the `package.json` for backend, suggesting it is used for in-memory DB testing.
- Manual test scripts present in backend:
  - `db_test_direct.js`
  - `dns_test.js`, `dns_test2.js`
  - `test_db.js`, `test_gemini.js`

## Coverage
There are no formal testing frameworks like Jest or Mocha configured in `package.json`. Tests seem to be manual scripts verifying database and API functionality.
