import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  console.log("MongoDB connected:", cached.conn.connection.host);
  return cached.conn;
};

export default connectDB;
