import { NextResponse } from 'next/server';
import { mockMonthlyOperationRates } from '@/lib/mock-data';
import { MonthlyOperationRate } from '@/types';

export async function GET() {
  try {
    // 環境変数でモックデータを使用するか判定
    const useMockData = process.env.USE_MOCK_DATA === 'true';

    if (useMockData) {
      return NextResponse.json(mockMonthlyOperationRates);
    }

    // TODO: 実際のデータソース（Google Sheets、kintone等）から取得
    // 現時点ではモックデータを返す
    return NextResponse.json(mockMonthlyOperationRates);
  } catch (error) {
    console.error('Error fetching monthly operation rate:', error);
    // エラー時もモックデータを返す
    return NextResponse.json(mockMonthlyOperationRates);
  }
}


