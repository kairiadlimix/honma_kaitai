// 消耗品のモックデータ

import { Consumable } from '@/types';
import { mockMachines } from './mock-data';

const consumableTypes = [
  { type: 'オイル', unit: 'L', unitPrice: 800 },
  { type: 'エアフィルター', unit: '個', unitPrice: 2000 },
  { type: 'オイルフィルター', unit: '個', unitPrice: 1500 },
  { type: 'グリス', unit: 'kg', unitPrice: 500 },
];

export function generateMockConsumables(): Consumable[] {
  const consumables: Consumable[] = [];
  const today = new Date();
  let id = 1;

  mockMachines.forEach(machine => {
    // 各重機に対して月1-2回の消耗品使用（過去6ヶ月）
    for (let month = 0; month < 6; month++) {
      if (Math.random() > 0.3) {
        const usageDate = new Date(today);
        usageDate.setMonth(usageDate.getMonth() - month);
        usageDate.setDate(Math.floor(Math.random() * 28) + 1);

        const consumable = consumableTypes[Math.floor(Math.random() * consumableTypes.length)];
        let quantity = 0;
        if (consumable.type === 'オイル') {
          quantity = 20 + Math.floor(Math.random() * 30);
        } else if (consumable.type === 'エアフィルター' || consumable.type === 'オイルフィルター') {
          quantity = 1 + Math.floor(Math.random() * 2);
        } else {
          quantity = 1 + Math.floor(Math.random() * 3);
        }

        const totalCost = quantity * consumable.unitPrice;

        consumables.push({
          id: `consumable-${id}`,
          machineId: machine.machineId,
          consumableType: consumable.type,
          usageDate: usageDate.toISOString().split('T')[0],
          quantity: quantity,
          unit: consumable.unit,
          unitPrice: consumable.unitPrice,
          totalCost: totalCost,
        });
        id++;
      }
    }
  });

  return consumables;
}

// 消耗品サマリー
export interface ConsumableSummary {
  consumableType: string;
  totalQuantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  monthlyQuantity: number;
  monthlyCost: number;
}

export function calculateConsumableSummaries(): ConsumableSummary[] {
  const consumables = generateMockConsumables();
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const summaries = new Map<string, ConsumableSummary>();

  consumables.forEach(consumable => {
    const key = consumable.consumableType;
    const isCurrentMonth = new Date(consumable.usageDate) >= currentMonth;

    if (!summaries.has(key)) {
      summaries.set(key, {
        consumableType: consumable.consumableType,
        totalQuantity: 0,
        unit: consumable.unit || '',
        unitPrice: consumable.unitPrice || 0,
        totalCost: 0,
        monthlyQuantity: 0,
        monthlyCost: 0,
      });
    }

    const summary = summaries.get(key)!;
    summary.totalQuantity += consumable.quantity;
    summary.totalCost += consumable.totalCost;
    if (isCurrentMonth) {
      summary.monthlyQuantity += consumable.quantity;
      summary.monthlyCost += consumable.totalCost;
    }
  });

  return Array.from(summaries.values()).sort((a, b) => b.totalCost - a.totalCost);
}

