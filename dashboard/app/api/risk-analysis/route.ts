import { NextResponse } from 'next/server';
import { 
  generateMachineRiskAnalyses, 
  calculateManufacturerRiskTrends 
} from '@/lib/mock-data-extended';
import { MachineRiskAnalysis, ManufacturerRiskTrend } from '@/types';

export interface RiskAnalysisResponse {
  machines: MachineRiskAnalysis[];
  manufacturerTrends: ManufacturerRiskTrend[];
  highRiskMachines: MachineRiskAnalysis[]; // リスク4以上
  topRiskMachines: MachineRiskAnalysis[]; // TOP10
}

export async function GET() {
  try {
    // 環境変数でモックデータを使用するか判定
    const useMockData = process.env.USE_MOCK_DATA === 'true';

    if (useMockData) {
      const machines = generateMachineRiskAnalyses();
      const manufacturerTrends = calculateManufacturerRiskTrends();
      const highRiskMachines = machines.filter(m => m.riskScore >= 4);
      const topRiskMachines = [...machines]
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 10);

      return NextResponse.json({
        machines,
        manufacturerTrends,
        highRiskMachines,
        topRiskMachines,
      });
    }

    // TODO: 実際のデータソース（Google Sheets、kintone等）から取得
    // 現時点ではモックデータを返す
    const machines = generateMachineRiskAnalyses();
    const manufacturerTrends = calculateManufacturerRiskTrends();
    const highRiskMachines = machines.filter(m => m.riskScore >= 4);
    const topRiskMachines = [...machines]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);

    return NextResponse.json({
      machines,
      manufacturerTrends,
      highRiskMachines,
      topRiskMachines,
    });
  } catch (error) {
    console.error('Error fetching risk analysis:', error);
    // エラー時もモックデータを返す
    const machines = generateMachineRiskAnalyses();
    const manufacturerTrends = calculateManufacturerRiskTrends();
    const highRiskMachines = machines.filter(m => m.riskScore >= 4);
    const topRiskMachines = [...machines]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);

    return NextResponse.json({
      machines,
      manufacturerTrends,
      highRiskMachines,
      topRiskMachines,
    });
  }
}


