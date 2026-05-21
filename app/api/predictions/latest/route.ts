import { NextResponse } from 'next/server';
import { getPredictionsCollection } from '../../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'CDN-Cache-Control': 'no-cache',
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