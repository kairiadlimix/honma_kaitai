import { NextResponse } from 'next/server';
import { calculateMachineSummaries } from '@/lib/mock-data-extended';

export async function GET() {
  try {
    const summaries = calculateMachineSummaries();
    return NextResponse.json(summaries);
  } catch (error) {
    console.error('Error fetching machines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch machines' },
      { status: 500 }
    );
  }
}

