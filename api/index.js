// Serverless function entrypoint for Vercel
// This file lives at /api/index.js so Vercel's @vercel/node builder picks it up.
// It imports the Express app from the backend directory and ensures DB is ready.

// Import the DB helpers and Express app from backend
import { connectDB, seedDefaultVendors } from '../backend/dbHelper.js';
import app from '../backend/server.js';

// Ensure DB is connected before handling requests (runs once per cold start)
let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await connectDB();
    seedDefaultVendors();
    dbInitialized = true;
  }
}

// Wrap the Express app to ensure DB is ready
const handler = async (req, res) => {
  await ensureDB();
  return app(req, res);
};

export default handler;
