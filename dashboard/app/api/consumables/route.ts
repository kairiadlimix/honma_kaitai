import { NextResponse } from 'next/server';
import { calculateConsumableSummaries } from '@/lib/mock-consumables';

export async function GET() {
  try {
    const summaries = calculateConsumableSummaries();
    return NextResponse.json(summaries);
  } catch (error) {
    console.error('Error fetching consumables:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consumables' },
      { status: 500 }
    );
  }
}

