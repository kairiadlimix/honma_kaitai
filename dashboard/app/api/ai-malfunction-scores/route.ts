import { NextResponse } from 'next/server';
import { generateAIMalfunctionScores } from '@/lib/mock-data-extended';

export async function GET() {
  const scores = generateAIMalfunctionScores();
  return NextResponse.json(scores);
}

