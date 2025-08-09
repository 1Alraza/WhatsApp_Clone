// server.js
import express from 'express';
import router from './routers/router.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json()); // Parse JSON requests
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, // Allow requests from the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // allow cookies
})); // Enable CORS

app.use('/api', router); // Route to get and send messages

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri) // Connect to MongoDB
      .then(() => console.log('MongoDB Atlas connected successfully'))
      .catch(err => console.error('Error connecting to MongoDB Atlas:', err.message));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
