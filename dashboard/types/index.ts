// 重機マスタ
export interface Machine {
  machineId: string; // 管理番号
  serialNumber?: string; // シリアル番号
  manufacturer: string; // メーカー（コベルコ/日立）
  machineClass: string; // 重機クラス（SK235、ZX200など）
  modelType?: string; // 型式
  year?: number; // 年式
  purchaseDate?: string; // 購入年月日
  inspectionDeadline?: string; // 特自検期限
  status: string; // ステータス（稼働中/整備中/入庫中）
}

// 稼働時間記録
export interface OperationHour {
  machineId: string;
  date: string; // YYYY-MM-DD
  operationHours: number;
  idleHours: number;
  totalOperationHours: number;
}

// メンテナンス記録
export interface Maintenance {
  maintenanceId: string;
  machineId: string;
  maintenanceDate: string;
  maintenanceType: string; // 特自検/オイル交換/部品交換など
  cost: number;
  description?: string;
}

// 消耗品使用記録
export interface Consumable {
  id: string;
  machineId: string;
  consumableType: string; // オイル/フィルター/グリスなど
  usageDate: string;
  quantity: number;
  unit?: string;
  unitPrice?: number;
  totalCost: number;
}

// ダッシュボードサマリー
export interface DashboardSummary {
  totalMachines: number;
  operatingMachines: number;
  maintenanceMachines: number;
  storedMachines: number;
  overallOperationRate: number;
  monthlyTotalCost: number;
  highRiskMachines: number;
  inspectionDeadlineMachines: number;
  lowOperationRateMachines: number;
}

// 月次稼働率データ
export interface MonthlyOperationRate {
  month: string; // YYYY-MM形式
  monthLabel: string; // "2024年1月"形式
  operationRate: number; // 稼働率（%）
  operatingMachines: number; // 稼働中台数
  totalMachines: number; // 総台数
}

