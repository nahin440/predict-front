import { NextRequest, NextResponse } from 'next/server';
import { getPredictionsCollection } from '../../../lib/mongodb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
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

    const serializedPredictions = predictions.map((pred: any) => ({
      ...pred,
      _id: pred._id.toString(),
    }));

    return NextResponse.json({
      predictions: serializedPredictions,
      total,
      limit,
      skip,
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}