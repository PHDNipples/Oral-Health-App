# Oral Health App

A MERN stack web application for oral health management, designed to be extended to a mobile app.

## Structure
- `backend/`: Node.js + Express API
- `frontend/`: React web client
- `mobile/`: React Native mobile client

## Getting Started
1. Install dependencies in each folder
2. Set up environment variables in `.env`
3. Run backend and frontend servers

## Production deployment

The supported production path is:

- **Frontend:** Render Static Site: `https://oral-health-app-frontend.onrender.com`
- **Backend:** Render Web Service: `https://oral-health-app.onrender.com`
- **Database:** MongoDB Atlas, reachable only by the Render service

Configure these deployment values before publishing:

- Frontend Render service: `VITE_API_URL=https://oral-health-app.onrender.com`
- Backend Render service: `NODE_ENV=production`, `FRONTEND_ORIGINS=https://oral-health-app-frontend.onrender.com`, `MONGO_URI`, `JWT_SECRET`, and Firebase Admin credentials

The frontend build fails if `VITE_API_URL` is missing or is not HTTPS in production. The backend fails to start in production if `FRONTEND_ORIGINS` is missing or contains a non-HTTPS origin. Local development may leave `VITE_API_URL` empty and use the Vite proxy to `http://localhost:5000`.

After changing the Render variables, redeploy both services. Verify `https://oral-health-app.onrender.com/api/health` and an authenticated API request from `https://oral-health-app-frontend.onrender.com`. Do not deploy the frontend through GitHub Pages; it is not the supported production path for this application API.
