import { MongoClient, type Db } from "mongodb";
import { env } from "../config/env.js";

// Cache the client across invocations (important on Vercel serverless).
let clientPromise: Promise<MongoClient> | null = null;

export async function getDb(): Promise<Db> {
  if (!clientPromise) {
    clientPromise = new MongoClient(env.mongoUri).connect().catch((err) => {
      clientPromise = null; // allow retry on next request
      throw err;
    });
  }
  const client = await clientPromise;
  return client.db(env.mongoDb);
}
