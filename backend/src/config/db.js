import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
dotenv.config({ path: path.join(root, ".env") });
dotenv.config({ path: path.join(root, ".env.local"), override: true });

// Use Google DNS so Atlas hostnames resolve (fixes querySrv ENOTFOUND when router DNS fails)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in .env");
  }

  cached.promise = mongoose.connect(uri).then((m) => m);
  cached.conn = await cached.promise;
  console.log("MongoDB connected:", cached.conn.connection.host);
  return cached.conn;
};

export default connectDB;
