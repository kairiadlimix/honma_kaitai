import { NextResponse } from 'next/server';
import { calculateCostSummary, calculateMonthlyCosts } from '@/lib/mock-cost';

export async function GET() {
  try {
    const summary = calculateCostSummary();
    const monthlyCosts = calculateMonthlyCosts();
    return NextResponse.json({
      summary,
      monthlyCosts,
    });
  } catch (error) {
    console.error('Error fetching cost data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cost data' },
      { status: 500 }
    );
  }
}

