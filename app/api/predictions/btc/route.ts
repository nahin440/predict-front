import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://preedict:EcsyQ60wspFtrMKY@cluster0.slbhc.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  try {
    await client.connect();
    const db = client.db("btc_dashboard");
    const collection = db.collection("btc_predictions");
    const predictions = await collection.find({})
      .sort({ server_time: -1 })
      .limit(limit)
      .toArray();
    return NextResponse.json({ predictions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch BTC history" }, { status: 500 });
  } finally {
    await client.close();
  }
}