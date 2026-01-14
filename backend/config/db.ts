import mongoose from "mongoose";

const DATABASE = process.env.MONGO_DATABASE;

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(DATABASE!);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}
