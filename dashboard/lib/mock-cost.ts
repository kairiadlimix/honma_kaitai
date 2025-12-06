// コスト分析用のモックデータ

import { MachineSummary } from './mock-data-extended';
import { calculateMachineSummaries } from './mock-data-extended';
import { generateMockConsumables } from './mock-consumables';

export interface CostSummary {
  totalCost: number;
  maintenanceCost: number;
  consumableCost: number;
  monthlyCost: number;
  monthlyMaintenanceCost: number;
  monthlyConsumableCost: number;
  averageCostPerMachine: number;
}

export interface MonthlyCost {
  month: string;
  maintenanceCost: number;
  consumableCost: number;
  totalCost: number;
}

export function calculateCostSummary(): CostSummary {
  const machines = calculateMachineSummaries();
  const consumables = generateMockConsumables();
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const yearStart = new Date(today.getFullYear(), 0, 1);

  // 年間コスト
  const totalMaintenanceCost = machines.reduce((sum, m) => sum + m.yearlyCost, 0);
  const totalConsumableCost = consumables
    .filter(c => {
      const cDate = new Date(c.usageDate);
      return cDate >= yearStart;
    })
    .reduce((sum, c) => sum + c.totalCost, 0);

  // 今月のコスト
  const monthlyMaintenanceCost = machines.reduce((sum, m) => {
    // 簡易的に年間コストを12で割る
    return sum + (m.yearlyCost / 12);
  }, 0);

  const monthlyConsumableCost = consumables
    .filter(c => {
      const cDate = new Date(c.usageDate);
      return cDate >= currentMonth;
    })
    .reduce((sum, c) => sum + c.totalCost, 0);

  return {
    totalCost: totalMaintenanceCost + totalConsumableCost,
    maintenanceCost: totalMaintenanceCost,
    consumableCost: totalConsumableCost,
    monthlyCost: monthlyMaintenanceCost + monthlyConsumableCost,
    monthlyMaintenanceCost,
    monthlyConsumableCost,
    averageCostPerMachine: (totalMaintenanceCost + totalConsumableCost) / machines.length,
  };
}

export function calculateMonthlyCosts(): MonthlyCost[] {
  const consumables = generateMockConsumables();
  const machines = calculateMachineSummaries();
  const today = new Date();
  const months: MonthlyCost[] = [];

  // 過去12ヶ月分
  for (let i = 11; i >= 0; i--) {
    const month = new Date(today);
    month.setMonth(month.getMonth() - i);
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const monthConsumables = consumables.filter(c => {
      const cDate = new Date(c.usageDate);
      return cDate >= monthStart && cDate <= monthEnd;
    });

    const consumableCost = monthConsumables.reduce((sum, c) => sum + c.totalCost, 0);
    
    // メンテナンスコストは簡易的に年間コストを12で割る
    const maintenanceCost = machines.reduce((sum, m) => sum + (m.yearlyCost / 12), 0);

    months.push({
      month: `${month.getFullYear()}/${String(month.getMonth() + 1).padStart(2, '0')}`,
      maintenanceCost: Math.round(maintenanceCost),
      consumableCost: Math.round(consumableCost),
      totalCost: Math.round(maintenanceCost + consumableCost),
    });
  }

  return months;
}

