# WhatsApp Clone

A full-stack WhatsApp-like messaging application with message sending, receiving, and status updates.  
Built with React (frontend), Node.js/Express (backend), and MongoDB for data storage.

---

## Live Demos

- **Frontend (Vercel):** [https://whats-app-clone-ten-fawn.vercel.app/](https://whats-app-clone-ten-fawn.vercel.app/)  
- **Backend (Render):** [https://whatsapp-clone-1-zto7.onrender.com](https://whatsapp-clone-1-zto7.onrender.com)  

---

## GitHub Repository

[https://github.com/1Alraza/WhatsApp_Clone](https://github.com/1Alraza/WhatsApp_Clone)

---

## Features

- Fetch and display WhatsApp-like conversations grouped by contact
- Show chat window with messages sorted oldest to newest
- Send new text messages and save to MongoDB
- Receive incoming messages and update message status (sent, delivered, read)
- Responsive UI with sidebar toggle on mobile
- Backend API with REST endpoints for sending and fetching messages
- MongoDB integration with Mongoose schema
- Environment variable configuration for flexibility

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB Atlas cluster or local MongoDB
- npm or yarn

### Environment Variables

Create a `.env` file in your backend root folder with these variables:

```bash
MONGO_URI=your_mongodb_connection_string
PORT=3000
MY_WA_ID=918329446654
FRONTEND_URL=https://whats-app-clone-ten-fawn.vercel.app/
```

**MONGO_URI**: MongoDB connection string  
**PORT**: Backend server port  
**MY_WA_ID**: Your WhatsApp ID used for sending messages  
**FRONTEND_URL**: Frontend URL allowed for CORS  

---

## Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd client
npm install
```

---

## Running Locally

### Backend
```bash
npm run dev
```
The backend will start on http://localhost:3000 (or the specified port).

### Frontend
```bash
npm run dev
```
The frontend will start on http://localhost:5173 by default.

Make sure to update `VITE_BACKEND_URL` in the frontend `.env` file or `.env.local` to:

```bash
VITE_BACKEND_URL=http://localhost:3000
```

---

## Processing Payload Data

You can process existing WhatsApp webhook payload JSON files saved under the `/payloads` directory by running:

```bash
node processPayloads.js
```

This script will:
- Connect to MongoDB
- Read all JSON payload files in the `/payloads` directory
- Parse and save incoming messages and status updates into MongoDB

---

## API Endpoints

| Method | Endpoint        | Description                                      | Request Body / Query Params |
|--------|----------------|--------------------------------------------------|-----------------------------|
| GET    | /api/messages  | Fetch all messages or filter by WhatsApp ID (wa_id) | Optional query param: wa_id |
| POST   | /api/send      | Send a new message                                | `{ to: string, text: string, contactName?: string }` |

---

## Project Structure

```bash
├── backend
│   ├── controllers
│   │   └── userController.js       # API logic to get/send messages
│   ├── models
│   │   └── Message.js              # Mongoose schema for messages
│   ├── routers
│   │   └── router.js               # Express router for API endpoints
│   ├── processPayloads.js          # Script to process payload JSON files
│   ├── server.js                   # Express app entry point
│   └── .env                        # Environment variables
├── client                          # React frontend app
│   ├── src
│   │   ├── components              # ConversationList, ChatWindow, SendMessageInput
│   │   └── App.jsx                 # Main React app component
│   ├── vite.config.js              # Vite config
│   └── .env                        # Frontend environment variables
├── payloads                        # JSON webhook payload files (for processing)
└── README.md
```

---

## Technologies Used

- **Frontend:** React, Axios, Tailwind CSS, Vite  
- **Backend:** Node.js, Express, Mongoose (MongoDB)  
- **Database:** MongoDB Atlas  
- **Deployment:** Vercel (frontend), Render (backend)  

---

## Notes

- Make sure your MongoDB cluster allows connections from your backend IP or `0.0.0.0/0` for testing.
- The backend enables CORS only for the frontend URL specified in `.env`.
- Payload JSON files should follow the WhatsApp webhook payload structure.
