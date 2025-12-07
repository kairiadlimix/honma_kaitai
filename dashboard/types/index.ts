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

// 故障リスク要因
export interface RiskFactor {
  factor: string; // 要因名（"年式", "稼働率", "メンテナンス頻度"など）
  value: string | number; // 値
  impact: 'high' | 'medium' | 'low'; // 影響度
  description: string; // 説明
}

// 故障リスク分析データ
export interface MachineRiskAnalysis {
  machineId: string;
  machineClass: string;
  manufacturer: string;
  year: number;
  riskScore: number; // 1-5
  riskFactors: RiskFactor[]; // リスク要因
  maintenanceFrequency: number; // 過去6ヶ月のメンテナンス回数
  totalOperationHours: number; // 累計稼働時間
  operationRate: number; // 稼働率（%）
  daysSinceLastMaintenance: number; // 最終メンテナンスからの経過日数
  recommendedAction: 'maintenance' | 'replacement' | 'monitor'; // 推奨アクション
  predictedMaintenanceDate?: string; // 次回メンテナンス予測日
  predictedMaintenanceDays?: number; // 次回メンテナンスまでの予測日数
}

// メーカー別故障傾向
export interface ManufacturerRiskTrend {
  manufacturer: string;
  averageRiskScore: number;
  highRiskCount: number; // リスク4以上
  totalCount: number;
  machines: MachineRiskAnalysis[];
}

