import fs from 'fs/promises';
import path from 'path';
import { savePayload } from './savePayload.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Connect to MongoDB
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

async function processAllPayloads() {
  const payloadDir = path.resolve('./payloads'); // Directory containing payload JSON files
  try {
    const files = await fs.readdir(payloadDir); // Get all files

    for (const file of files) {
      if (file.endsWith('.json')) { // Process only .json files
        console.log(`Processing file: ${file}`);

        const filePath = path.join(payloadDir, file);
        const data = await fs.readFile(filePath, 'utf-8'); // Read file content
        const payload = JSON.parse(data); // Convert JSON to object

        await savePayload(payload); // Save to DB
      }
    }
    console.log('Finished processing all payload files');
  } catch (error) {
    console.error('Error processing payloads:', error);
  }
}

(async () => {
  await connectDB(); // Connect to DB
  await processAllPayloads(); // Process payloads
  mongoose.connection.close(); // Close DB connection
})();
