# Tech Stack

## Overview
This is a full-stack application for AI-driven interview preparation.

## Backend
- **Runtime**: Node.js
- **Framework**: Express (`express^5.1.0`)
- **Database**: MongoDB with Mongoose (`mongoose^8.14.1`)
- **Authentication**: JWT (`jsonwebtoken^9.0.2`), bcryptjs (`bcryptjs^3.0.2`)
- **Storage/File Uploads**: multer (`multer^1.4.5-lts.2`)
- **Others**: cors, dotenv

## Frontend
- **Framework**: React (`react^19.1.0`) with Vite
- **Styling**: TailwindCSS (`@tailwindcss/vite^4.1.5`)
- **Routing**: React Router (`react-router-dom^7.5.3`)
- **State Management**: React Context (`src/context/userContext.jsx`)
- **HTTP Client**: Axios (`axios^1.9.0`)
- **Icons/UI**: react-icons, framer-motion, react-hot-toast
- **Markdown Handling**: react-markdown, react-syntax-highlighter, remark-gfm
- **Dates**: moment

## Configuration Files
- Backend: `backend/package.json`, `backend/.env`
- Frontend: `frontend/interview-prep-ai/package.json`, `frontend/interview-prep-ai/vite.config.js`, `frontend/interview-prep-ai/eslint.config.js`
