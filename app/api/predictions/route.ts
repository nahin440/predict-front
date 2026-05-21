import { NextResponse } from 'next/server';
import { getPredictionsCollection } from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100');
  const skip = parseInt(searchParams.get('skip') || '0');

  try {
    const collection = await getPredictionsCollection();
    
    const predictions = await collection
      .find({})
      .sort({ server_time: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments();

    const serializedPredictions = predictions.map((pred) => ({
      ...pred,
      _id: pred._id.toString(),
    }));

    // Add cache-control headers to prevent caching
    return NextResponse.json({
      predictions: serializedPredictions,
      total,
      limit,
      skip,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}