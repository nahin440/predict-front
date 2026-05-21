import { MongoClient, Db, Collection } from 'mongodb';

const MONGODB_URI = "mongodb+srv://preedict:EcsyQ60wspFtrMKY@cluster0.slbhc.mongodb.net/?appName=Cluster0";
const DATABASE_NAME = "xau_dashboard";
const COLLECTION_NAME = "predictions";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DATABASE_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getPredictionsCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection(COLLECTION_NAME);
}