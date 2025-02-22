import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!; // Ensure this is set in .env

let isConnected = false; // Track connection status

export async function dbConnect() {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const connection = await mongoose.connect(MONGO_URI);
    isConnected = connection.connections[0].readyState === 1;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}
