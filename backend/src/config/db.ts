import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/yelpCamp");
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}
