import { NextResponse } from 'next/server';
import { generateAIPrediction } from '@/lib/mock-data-extended';

export async function GET() {
  const prediction = generateAIPrediction();
  return NextResponse.json(prediction);
}

