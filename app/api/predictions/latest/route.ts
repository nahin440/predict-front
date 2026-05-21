import { NextResponse } from 'next/server';
import { getPredictionsCollection } from '@/lib/mongodb';


export async function GET() {
  try {
    const collection = await getPredictionsCollection();
    
    const latest = await collection
      .find({})
      .sort({ server_time: -1 })
      .limit(1)
      .toArray();

    if (latest.length === 0) {
      return NextResponse.json({ prediction: null });
    }

    return NextResponse.json({
      prediction: {
        ...latest[0],
        _id: latest[0]._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching latest prediction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest prediction' },
      { status: 500 }
    );
  }
}