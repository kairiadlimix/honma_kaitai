import { NextResponse } from 'next/server';
import { getMachinesData, getOperationHoursData, getMaintenanceData, getConsumablesData } from '@/lib/google-sheets';
import { parseMachineData, parseOperationHourData, parseMaintenanceData, parseConsumableData, calculateDashboardSummary } from '@/lib/data-processor';
import { mockDashboardSummary } from '@/lib/mock-data';

// モックデータモード（環境変数で切り替え可能）
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true' || !process.env.GOOGLE_SHEETS_ID;

export async function GET() {
  // モックデータモードの場合
  if (USE_MOCK_DATA) {
    console.log('Using mock data for dashboard summary');
    return NextResponse.json(mockDashboardSummary);
  }

  try {
    // Google Sheetsからデータを取得
    const [machinesData, operationHoursData, maintenanceData, consumablesData] = await Promise.all([
      getMachinesData(),
      getOperationHoursData(),
      getMaintenanceData(),
      getConsumablesData(),
    ]);

    // データをパース
    const machines = parseMachineData(machinesData);
    const operationHours = parseOperationHourData(operationHoursData);
    const maintenances = parseMaintenanceData(maintenanceData);
    const consumables = parseConsumableData(consumablesData);

    // サマリーを計算
    const summary = calculateDashboardSummary(machines, operationHours, maintenances, consumables);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    // エラー時もモックデータを返す（デモ用）
    console.log('Falling back to mock data due to error');
    return NextResponse.json(mockDashboardSummary);
  }
}

