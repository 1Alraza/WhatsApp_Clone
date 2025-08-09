// processPayloads.js
import fs from 'fs/promises';
import path from 'path';
import { savePayload } from './savePayload.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

async function processAllPayloads() {
  const payloadDir = path.resolve('./payloads');
  try {
    const files = await fs.readdir(payloadDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        console.log(`Processing file: ${file}`);

        const filePath = path.join(payloadDir, file);
        const data = await fs.readFile(filePath, 'utf-8');
        const payload = JSON.parse(data);

        await savePayload(payload);
      }
    }
    console.log('Finished processing all payload files');
  } catch (error) {
    console.error('Error processing payloads:', error);
  }
}

(async () => {
  await connectDB();
  await processAllPayloads();
  mongoose.connection.close();
})();
