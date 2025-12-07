// モックデータ（サンプル画面用）

import { DashboardSummary, Machine, OperationHour, Maintenance, Consumable, MonthlyOperationRate } from '@/types';

// ダッシュボードサマリーのモックデータ
export const mockDashboardSummary: DashboardSummary = {
  totalMachines: 15,
  operatingMachines: 12,
  maintenanceMachines: 2,
  storedMachines: 1,
  overallOperationRate: 65.5,
  monthlyTotalCost: 4850000,
  highRiskMachines: 3,
  inspectionDeadlineMachines: 2,
  lowOperationRateMachines: 5,
};

// 重機マスタのモックデータ
export const mockMachines: Machine[] = [
  {
    machineId: 'SK-001',
    serialNumber: 'SK123456',
    manufacturer: 'コベルコ',
    machineClass: 'SK235',
    modelType: 'SK235LC-8',
    year: 2018,
    purchaseDate: '2018/04/01',
    inspectionDeadline: '2024/12/31',
    status: '稼働中',
  },
  {
    machineId: 'SK-002',
    serialNumber: 'SK123457',
    manufacturer: 'コベルコ',
    machineClass: 'SK200',
    modelType: 'SK200LC-8',
    year: 2019,
    purchaseDate: '2019/06/15',
    inspectionDeadline: '2024/11/30',
    status: '稼働中',
  },
  {
    machineId: 'SK-003',
    serialNumber: 'SK123458',
    manufacturer: 'コベルコ',
    machineClass: 'SK235',
    modelType: 'SK235LC-8',
    year: 2017,
    purchaseDate: '2017/03/20',
    inspectionDeadline: '2024/10/31',
    status: '整備中',
  },
  {
    machineId: 'ZX-001',
    serialNumber: 'ZX789012',
    manufacturer: '日立',
    machineClass: 'ZX200',
    modelType: 'ZX200LC-5',
    year: 2018,
    purchaseDate: '2018/07/01',
    inspectionDeadline: '2024/12/15',
    status: '稼働中',
  },
  {
    machineId: 'ZX-002',
    serialNumber: 'ZX789013',
    manufacturer: '日立',
    machineClass: 'ZX200',
    modelType: 'ZX200LC-5',
    year: 2019,
    purchaseDate: '2019/09/20',
    inspectionDeadline: '2024/11/20',
    status: '稼働中',
  },
  {
    machineId: 'ZX-003',
    serialNumber: 'ZX789014',
    manufacturer: '日立',
    machineClass: 'ZX160',
    modelType: 'ZX160LC-5',
    year: 2017,
    purchaseDate: '2017/11/10',
    inspectionDeadline: '2024/10/15',
    status: '稼働中',
  },
  {
    machineId: 'ZX-004',
    serialNumber: 'ZX789015',
    manufacturer: '日立',
    machineClass: 'ZX200',
    modelType: 'ZX200LC-5',
    year: 2020,
    purchaseDate: '2020/02/28',
    inspectionDeadline: '2025/02/28',
    status: '入庫中',
  },
  {
    machineId: 'SK-004',
    serialNumber: 'SK123459',
    manufacturer: 'コベルコ',
    machineClass: 'SK200',
    modelType: 'SK200LC-8',
    year: 2020,
    purchaseDate: '2020/05/10',
    inspectionDeadline: '2025/01/31',
    status: '稼働中',
  },
  {
    machineId: 'SK-005',
    serialNumber: 'SK123460',
    manufacturer: 'コベルコ',
    machineClass: 'SK235',
    modelType: 'SK235LC-8',
    year: 2016,
    purchaseDate: '2016/08/25',
    inspectionDeadline: '2024/09/30',
    status: '稼働中',
  },
  {
    machineId: 'ZX-005',
    serialNumber: 'ZX789016',
    manufacturer: '日立',
    machineClass: 'ZX160',
    modelType: 'ZX160LC-5',
    year: 2018,
    purchaseDate: '2018/12/05',
    inspectionDeadline: '2024/12/05',
    status: '稼働中',
  },
  {
    machineId: 'SK-006',
    serialNumber: 'SK123461',
    manufacturer: 'コベルコ',
    machineClass: 'SK235',
    modelType: 'SK235LC-8',
    year: 2019,
    purchaseDate: '2019/10/15',
    inspectionDeadline: '2024/12/20',
    status: '稼働中',
  },
  {
    machineId: 'SK-007',
    serialNumber: 'SK123462',
    manufacturer: 'コベルコ',
    machineClass: 'SK200',
    modelType: 'SK200LC-8',
    year: 2021,
    purchaseDate: '2021/01/20',
    inspectionDeadline: '2025/01/20',
    status: '稼働中',
  },
  {
    machineId: 'ZX-006',
    serialNumber: 'ZX789017',
    manufacturer: '日立',
    machineClass: 'ZX200',
    modelType: 'ZX200LC-5',
    year: 2019,
    purchaseDate: '2019/08/30',
    inspectionDeadline: '2024/11/10',
    status: '整備中',
  },
  {
    machineId: 'ZX-007',
    serialNumber: 'ZX789018',
    manufacturer: '日立',
    machineClass: 'ZX160',
    modelType: 'ZX160LC-5',
    year: 2020,
    purchaseDate: '2020/06/15',
    inspectionDeadline: '2025/03/15',
    status: '稼働中',
  },
  {
    machineId: 'SK-008',
    serialNumber: 'SK123463',
    manufacturer: 'コベルコ',
    machineClass: 'SK235',
    modelType: 'SK235LC-8',
    year: 2018,
    purchaseDate: '2018/11/10',
    inspectionDeadline: '2024/12/10',
    status: '稼働中',
  },
];

// 月次稼働率のモックデータ（過去12ヶ月分）
export function generateMonthlyOperationRates(): MonthlyOperationRate[] {
  const months: MonthlyOperationRate[] = [];
  const today = new Date();
  const totalMachines = 15; // 総重機台数

  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const monthLabel = `${year}年${month}月`;

    // ランダムな稼働率を生成（50%〜80%の範囲、少し変動を持たせる）
    const baseRate = 65;
    const variation = (Math.random() - 0.5) * 20; // -10%〜+10%の変動
    const operationRate = Math.max(50, Math.min(80, baseRate + variation));
    
    // 稼働中台数を計算
    const operatingMachines = Math.round((operationRate / 100) * totalMachines);

    months.push({
      month: monthStr,
      monthLabel,
      operationRate: Math.round(operationRate * 10) / 10, // 小数点第1位まで
      operatingMachines,
      totalMachines,
    });
  }

  return months;
}

export const mockMonthlyOperationRates: MonthlyOperationRate[] = generateMonthlyOperationRates();

