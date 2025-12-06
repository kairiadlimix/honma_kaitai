import { Machine, OperationHour, Maintenance, Consumable, DashboardSummary } from '@/types';
import { format, startOfMonth, subMonths } from 'date-fns';

// Google SheetsのデータをMachine型に変換
export function parseMachineData(rows: any[][]): Machine[] {
  if (!rows || rows.length === 0) return [];
  
  return rows.map((row) => ({
    machineId: row[0] || '',
    serialNumber: row[1] || '',
    manufacturer: row[2] || '',
    machineClass: row[3] || '',
    modelType: row[4] || '',
    year: row[5] ? parseInt(row[5]) : undefined,
    purchaseDate: row[6] || '',
    inspectionDeadline: row[7] || '',
    status: row[8] || '稼働中',
  }));
}

// Google SheetsのデータをOperationHour型に変換
export function parseOperationHourData(rows: any[][]): OperationHour[] {
  if (!rows || rows.length === 0) return [];
  
  return rows.map((row) => ({
    machineId: row[0] || '',
    date: row[1] || '',
    operationHours: parseFloat(row[2] || '0'),
    idleHours: parseFloat(row[3] || '0'),
    totalOperationHours: parseFloat(row[4] || '0'),
  }));
}

// Google SheetsのデータをMaintenance型に変換
export function parseMaintenanceData(rows: any[][]): Maintenance[] {
  if (!rows || rows.length === 0) return [];
  
  return rows.map((row) => ({
    maintenanceId: row[0] || '',
    machineId: row[1] || '',
    maintenanceDate: row[2] || '',
    maintenanceType: row[3] || '',
    cost: parseFloat(row[4] || '0'),
    description: row[5] || '',
  }));
}

// Google SheetsのデータをConsumable型に変換
export function parseConsumableData(rows: any[][]): Consumable[] {
  if (!rows || rows.length === 0) return [];
  
  return rows.map((row, index) => ({
    id: `consumable-${index}`,
    machineId: row[0] || '',
    consumableType: row[1] || '',
    usageDate: row[2] || '',
    quantity: parseFloat(row[3] || '0'),
    unit: row[4] || '',
    unitPrice: parseFloat(row[5] || '0'),
    totalCost: parseFloat(row[6] || '0'),
  }));
}

// ダッシュボードサマリーを計算
export function calculateDashboardSummary(
  machines: Machine[],
  operationHours: OperationHour[],
  maintenances: Maintenance[],
  consumables: Consumable[]
): DashboardSummary {
  const now = new Date();
  const currentMonth = startOfMonth(now);
  const lastMonth = subMonths(currentMonth, 1);
  
  // 重機台数
  const totalMachines = machines.length;
  const operatingMachines = machines.filter(m => m.status === '稼働中').length;
  const maintenanceMachines = machines.filter(m => m.status === '整備中').length;
  const storedMachines = machines.filter(m => m.status === '入庫中').length;
  
  // 今月の稼働時間を計算
  const currentMonthOperations = operationHours.filter(
    oh => {
      const ohDate = new Date(oh.date);
      return ohDate >= currentMonth && ohDate < now;
    }
  );
  
  const totalOperationHours = currentMonthOperations.reduce(
    (sum, oh) => sum + oh.operationHours,
    0
  );
  
  // 稼働率の計算（1日8時間稼働可能として）
  const daysInMonth = Math.ceil((now.getTime() - currentMonth.getTime()) / (1000 * 60 * 60 * 24));
  const possibleHours = operatingMachines * daysInMonth * 8;
  const overallOperationRate = possibleHours > 0 
    ? (totalOperationHours / possibleHours) * 100 
    : 0;
  
  // 今月のコスト
  const currentMonthMaintenances = maintenances.filter(
    m => {
      const mDate = new Date(m.maintenanceDate);
      return mDate >= currentMonth && mDate < now;
    }
  );
  
  const currentMonthConsumables = consumables.filter(
    c => {
      const cDate = new Date(c.usageDate);
      return cDate >= currentMonth && cDate < now;
    }
  );
  
  const maintenanceCost = currentMonthMaintenances.reduce((sum, m) => sum + m.cost, 0);
  const consumableCost = currentMonthConsumables.reduce((sum, c) => sum + c.totalCost, 0);
  const monthlyTotalCost = maintenanceCost + consumableCost;
  
  // 故障リスクが高い重機（簡易計算：メンテナンス頻度が高い）
  const maintenanceCounts = maintenances.reduce((acc, m) => {
    acc[m.machineId] = (acc[m.machineId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const highRiskMachines = machines.filter(
    m => (maintenanceCounts[m.machineId] || 0) >= 3
  ).length;
  
  // 特自検期限が近い重機（1ヶ月以内）
  const inspectionDeadlineMachines = machines.filter(m => {
    if (!m.inspectionDeadline) return false;
    const deadline = new Date(m.inspectionDeadline);
    const oneMonthLater = new Date(now);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    return deadline <= oneMonthLater && deadline >= now;
  }).length;
  
  // 稼働率が低い重機（40%未満）
  const machineOperationRates = machines.map(m => {
    const machineOps = currentMonthOperations.filter(oh => oh.machineId === m.machineId);
    const machineHours = machineOps.reduce((sum, oh) => sum + oh.operationHours, 0);
    const machineRate = possibleHours > 0 ? (machineHours / (daysInMonth * 8)) * 100 : 0;
    return { machineId: m.machineId, rate: machineRate };
  });
  
  const lowOperationRateMachines = machineOperationRates.filter(
    mor => mor.rate < 40
  ).length;
  
  return {
    totalMachines,
    operatingMachines,
    maintenanceMachines,
    storedMachines,
    overallOperationRate: Math.round(overallOperationRate * 10) / 10,
    monthlyTotalCost: Math.round(monthlyTotalCost),
    highRiskMachines,
    inspectionDeadlineMachines,
    lowOperationRateMachines,
  };
}

