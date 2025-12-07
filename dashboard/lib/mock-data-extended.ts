// 拡張モックデータ（重機一覧・ランキング用）

import { Machine, OperationHour, Maintenance, MachineRiskAnalysis, RiskFactor, ManufacturerRiskTrend } from '@/types';

// 既存のモックデータをインポート
import { mockMachines } from './mock-data';

// 稼働時間データを生成
export function generateMockOperationHours(): OperationHour[] {
  const hours: OperationHour[] = [];
  const today = new Date();
  
  mockMachines.forEach(machine => {
    // 過去6ヶ月分のデータを生成
    for (let i = 0; i < 180; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // 週末は稼働しない可能性が高い
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (Math.random() > 0.3) continue;
      }
      
      // 稼働時間（0-10時間）
      const operationHours = Math.random() > 0.2 ? Math.random() * 8 + 2 : 0;
      const idleHours = operationHours > 0 ? Math.random() * 2 : 0;
      
      if (operationHours > 0) {
        hours.push({
          machineId: machine.machineId,
          date: date.toISOString().split('T')[0],
          operationHours: parseFloat(operationHours.toFixed(1)),
          idleHours: parseFloat(idleHours.toFixed(1)),
          totalOperationHours: 3000 + Math.random() * 2000, // 累計時間
        });
      }
    }
  });
  
  return hours;
}

// メンテナンスデータを生成
export function generateMockMaintenances(): Maintenance[] {
  const maintenances: Maintenance[] = [];
  const maintenanceTypes = ['特自検', 'オイル交換', '部品交換', '点検', 'その他'];
  const today = new Date();
  let maintenanceId = 1;
  
  mockMachines.forEach(machine => {
    // 各重機に対して月1-2回のメンテナンス（過去6ヶ月）
    for (let month = 0; month < 6; month++) {
      if (Math.random() > 0.3) {
        const maintenanceDate = new Date(today);
        maintenanceDate.setMonth(maintenanceDate.getMonth() - month);
        maintenanceDate.setDate(Math.floor(Math.random() * 28) + 1);
        
        const type = maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)];
        let cost = 0;
        if (type === '特自検') {
          cost = 30000 + Math.floor(Math.random() * 20000);
        } else if (type === 'オイル交換') {
          cost = 10000 + Math.floor(Math.random() * 5000);
        } else if (type === '部品交換') {
          cost = 20000 + Math.floor(Math.random() * 30000);
        } else {
          cost = 5000 + Math.floor(Math.random() * 10000);
        }
        
        maintenances.push({
          maintenanceId: `MT-${String(maintenanceId).padStart(3, '0')}`,
          machineId: machine.machineId,
          maintenanceDate: maintenanceDate.toISOString().split('T')[0],
          maintenanceType: type,
          cost: cost,
          description: `${type}を実施しました`,
        });
        maintenanceId++;
      }
    }
  });
  
  return maintenances;
}

// 重機サマリー情報を計算
export interface MachineSummary {
  machine: Machine;
  totalOperationHours: number;
  monthlyOperationHours: number;
  operationRate: number;
  failureRiskScore: number; // 1-5
  yearlyCost: number;
  lastMaintenanceDate?: string;
}

export function calculateMachineSummaries(): MachineSummary[] {
  const operationHours = generateMockOperationHours();
  const maintenances = generateMockMaintenances();
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return mockMachines.map(machine => {
    // 稼働時間を計算
    const machineOps = operationHours.filter(oh => oh.machineId === machine.machineId);
    const totalOps = machineOps.reduce((sum, oh) => sum + oh.operationHours, 0);
    
    // 今月の稼働時間
    const monthlyOps = machineOps
      .filter(oh => {
        const ohDate = new Date(oh.date);
        return ohDate >= currentMonth;
      })
      .reduce((sum, oh) => sum + oh.operationHours, 0);
    
    // 稼働率（今月、1日8時間稼働可能として）
    const daysInMonth = Math.ceil((today.getTime() - currentMonth.getTime()) / (1000 * 60 * 60 * 24));
    const possibleHours = daysInMonth * 8;
    const operationRate = possibleHours > 0 ? (monthlyOps / possibleHours) * 100 : 0;
    
    // メンテナンス情報
    const machineMaintenances = maintenances.filter(m => m.machineId === machine.machineId);
    const maintenanceCount = machineMaintenances.length;
    
    // 故障リスクスコアの計算（年式、稼働率、メンテナンス頻度を考慮）
    const currentYear = today.getFullYear();
    const machineAge = machine.year ? currentYear - machine.year : 0; // 年式からの経過年数
    
    // 各要素のスコア（0-5）
    let ageScore = 0;
    if (machineAge >= 10) ageScore = 5;
    else if (machineAge >= 8) ageScore = 4;
    else if (machineAge >= 6) ageScore = 3;
    else if (machineAge >= 4) ageScore = 2;
    else if (machineAge >= 2) ageScore = 1;
    
    let operationRateScore = 0;
    if (operationRate < 30) operationRateScore = 4; // 極端に低い
    else if (operationRate < 40) operationRateScore = 2;
    else if (operationRate > 80) operationRateScore = 3; // 極端に高い（過負荷）
    else if (operationRate > 70) operationRateScore = 1;
    
    let maintenanceScore = 0;
    if (maintenanceCount >= 8) maintenanceScore = 5;
    else if (maintenanceCount >= 6) maintenanceScore = 4;
    else if (maintenanceCount >= 4) maintenanceScore = 3;
    else if (maintenanceCount >= 2) maintenanceScore = 2;
    else if (maintenanceCount >= 1) maintenanceScore = 1;
    
    // 最終メンテナンス日を取得
    const sortedMaintenances = [...machineMaintenances].sort(
      (a, b) => new Date(b.maintenanceDate).getTime() - new Date(a.maintenanceDate).getTime()
    );
    const lastMaintenanceRecord = sortedMaintenances[0];
    
    // 最終メンテナンスからの経過日数
    const daysSinceLastMaintenance = lastMaintenanceRecord
      ? Math.floor((today.getTime() - new Date(lastMaintenanceRecord.maintenanceDate).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    
    let maintenanceIntervalScore = 0;
    if (daysSinceLastMaintenance > 180) maintenanceIntervalScore = 4; // 6ヶ月以上
    else if (daysSinceLastMaintenance > 120) maintenanceIntervalScore = 3; // 4ヶ月以上
    else if (daysSinceLastMaintenance > 90) maintenanceIntervalScore = 2; // 3ヶ月以上
    else if (daysSinceLastMaintenance > 60) maintenanceIntervalScore = 1; // 2ヶ月以上
    
    // 総合リスクスコア（各要素の重み付け平均）
    // 年式: 30%, メンテナンス頻度: 30%, 稼働率: 20%, メンテナンス間隔: 20%
    const weightedScore = 
      ageScore * 0.3 +
      maintenanceScore * 0.3 +
      operationRateScore * 0.2 +
      maintenanceIntervalScore * 0.2;
    
    const failureRiskScore = Math.min(5, Math.max(1, Math.round(weightedScore)));
    
    // 年間コスト
    const yearlyCost = machineMaintenances
      .filter(m => {
        const mDate = new Date(m.maintenanceDate);
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return mDate >= yearStart;
      })
      .reduce((sum, m) => sum + m.cost, 0);
    
    // 次回メンテナンス予測（過去のメンテナンス間隔の平均から計算）
    let predictedMaintenanceDays = 90; // デフォルト90日
    if (machineMaintenances.length >= 2) {
      const intervals: number[] = [];
      const sortedMaintenancesForPrediction = [...machineMaintenances].sort(
        (a, b) => new Date(a.maintenanceDate).getTime() - new Date(b.maintenanceDate).getTime()
      );
      for (let i = 1; i < sortedMaintenancesForPrediction.length; i++) {
        const interval = Math.floor(
          (new Date(sortedMaintenancesForPrediction[i].maintenanceDate).getTime() - 
           new Date(sortedMaintenancesForPrediction[i - 1].maintenanceDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        intervals.push(interval);
      }
      if (intervals.length > 0) {
        const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
        predictedMaintenanceDays = Math.round(avgInterval);
      }
    }
    
    return {
      machine,
      totalOperationHours: parseFloat(totalOps.toFixed(1)),
      monthlyOperationHours: parseFloat(monthlyOps.toFixed(1)),
      operationRate: parseFloat(operationRate.toFixed(1)),
      failureRiskScore,
      yearlyCost,
      lastMaintenanceDate: lastMaintenanceRecord?.maintenanceDate,
    };
  });
}

// 故障リスク分析データを生成
export function generateMachineRiskAnalyses(): MachineRiskAnalysis[] {
  const summaries = calculateMachineSummaries();
  const today = new Date();
  const maintenances = generateMockMaintenances();
  
  return summaries.map(summary => {
    const machine = summary.machine;
    const currentYear = today.getFullYear();
    const machineAge = machine.year ? currentYear - machine.year : 0;
    
    // メンテナンス情報
    const machineMaintenances = maintenances.filter(m => m.machineId === machine.machineId);
    const maintenanceCount = machineMaintenances.length;
    const lastMaintenance = machineMaintenances
      .sort((a, b) => new Date(b.maintenanceDate).getTime() - new Date(a.maintenanceDate).getTime())[0];
    
    const daysSinceLastMaintenance = lastMaintenance
      ? Math.floor((today.getTime() - new Date(lastMaintenance.maintenanceDate).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    
    // 次回メンテナンス予測
    let predictedMaintenanceDays = 90;
    if (machineMaintenances.length >= 2) {
      const intervals: number[] = [];
      const sortedMaintenances = [...machineMaintenances].sort(
        (a, b) => new Date(a.maintenanceDate).getTime() - new Date(b.maintenanceDate).getTime()
      );
      for (let i = 1; i < sortedMaintenances.length; i++) {
        const interval = Math.floor(
          (new Date(sortedMaintenances[i].maintenanceDate).getTime() - 
           new Date(sortedMaintenances[i - 1].maintenanceDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        intervals.push(interval);
      }
      if (intervals.length > 0) {
        const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
        predictedMaintenanceDays = Math.round(avgInterval);
      }
    }
    
    const predictedMaintenanceDate = lastMaintenance
      ? new Date(new Date(lastMaintenance.maintenanceDate).getTime() + predictedMaintenanceDays * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0]
      : undefined;
    
    // リスク要因を生成
    const riskFactors: RiskFactor[] = [];
    
    // 年式
    if (machineAge >= 8) {
      riskFactors.push({
        factor: '年式',
        value: `${machine.year}年（${machineAge}年経過）`,
        impact: 'high',
        description: '経年劣化による故障リスクが高い',
      });
    } else if (machineAge >= 6) {
      riskFactors.push({
        factor: '年式',
        value: `${machine.year}年（${machineAge}年経過）`,
        impact: 'medium',
        description: '経年劣化が進行中',
      });
    } else {
      riskFactors.push({
        factor: '年式',
        value: `${machine.year}年（${machineAge}年経過）`,
        impact: 'low',
        description: '比較的新しい',
      });
    }
    
    // 稼働率
    if (summary.operationRate < 30) {
      riskFactors.push({
        factor: '稼働率',
        value: `${summary.operationRate}%`,
        impact: 'high',
        description: '極端に低い稼働率（不具合の可能性）',
      });
    } else if (summary.operationRate > 80) {
      riskFactors.push({
        factor: '稼働率',
        value: `${summary.operationRate}%`,
        impact: 'high',
        description: '極端に高い稼働率（過負荷の可能性）',
      });
    } else if (summary.operationRate < 40) {
      riskFactors.push({
        factor: '稼働率',
        value: `${summary.operationRate}%`,
        impact: 'medium',
        description: '低い稼働率',
      });
    } else {
      riskFactors.push({
        factor: '稼働率',
        value: `${summary.operationRate}%`,
        impact: 'low',
        description: '適正な稼働率',
      });
    }
    
    // メンテナンス頻度
    if (maintenanceCount >= 6) {
      riskFactors.push({
        factor: 'メンテナンス頻度',
        value: `過去6ヶ月で${maintenanceCount}回`,
        impact: 'high',
        description: '頻繁なメンテナンス（故障が多い可能性）',
      });
    } else if (maintenanceCount >= 4) {
      riskFactors.push({
        factor: 'メンテナンス頻度',
        value: `過去6ヶ月で${maintenanceCount}回`,
        impact: 'medium',
        description: 'やや頻繁なメンテナンス',
      });
    } else {
      riskFactors.push({
        factor: 'メンテナンス頻度',
        value: `過去6ヶ月で${maintenanceCount}回`,
        impact: 'low',
        description: '適正なメンテナンス頻度',
      });
    }
    
    // 最終メンテナンスからの経過日数
    if (daysSinceLastMaintenance > 180) {
      riskFactors.push({
        factor: '最終メンテナンスからの経過日数',
        value: `${daysSinceLastMaintenance}日`,
        impact: 'high',
        description: 'メンテナンス間隔が長すぎる',
      });
    } else if (daysSinceLastMaintenance > 120) {
      riskFactors.push({
        factor: '最終メンテナンスからの経過日数',
        value: `${daysSinceLastMaintenance}日`,
        impact: 'medium',
        description: 'メンテナンス間隔がやや長い',
      });
    } else {
      riskFactors.push({
        factor: '最終メンテナンスからの経過日数',
        value: `${daysSinceLastMaintenance}日`,
        impact: 'low',
        description: '適正なメンテナンス間隔',
      });
    }
    
    // 累計稼働時間
    if (summary.totalOperationHours > 10000) {
      riskFactors.push({
        factor: '累計稼働時間',
        value: `${summary.totalOperationHours.toLocaleString()}時間`,
        impact: 'high',
        description: '累計稼働時間が非常に長い',
      });
    } else if (summary.totalOperationHours > 7000) {
      riskFactors.push({
        factor: '累計稼働時間',
        value: `${summary.totalOperationHours.toLocaleString()}時間`,
        impact: 'medium',
        description: '累計稼働時間が長い',
      });
    } else {
      riskFactors.push({
        factor: '累計稼働時間',
        value: `${summary.totalOperationHours.toLocaleString()}時間`,
        impact: 'low',
        description: '適正な累計稼働時間',
      });
    }
    
    // 推奨アクション
    let recommendedAction: 'maintenance' | 'replacement' | 'monitor' = 'monitor';
    if (summary.failureRiskScore >= 5 || (machineAge >= 10 && summary.failureRiskScore >= 4)) {
      recommendedAction = 'replacement';
    } else if (summary.failureRiskScore >= 4 || daysSinceLastMaintenance > 120) {
      recommendedAction = 'maintenance';
    }
    
    return {
      machineId: machine.machineId,
      machineClass: machine.machineClass,
      manufacturer: machine.manufacturer,
      year: machine.year || 0,
      riskScore: summary.failureRiskScore,
      riskFactors,
      maintenanceFrequency: maintenanceCount,
      totalOperationHours: summary.totalOperationHours,
      operationRate: summary.operationRate,
      daysSinceLastMaintenance,
      recommendedAction,
      predictedMaintenanceDate,
      predictedMaintenanceDays,
    };
  });
}

// メーカー別故障傾向を計算
export function calculateManufacturerRiskTrends(): ManufacturerRiskTrend[] {
  const riskAnalyses = generateMachineRiskAnalyses();
  const manufacturers = Array.from(new Set(riskAnalyses.map(r => r.manufacturer)));
  
  return manufacturers.map(manufacturer => {
    const manufacturerMachines = riskAnalyses.filter(r => r.manufacturer === manufacturer);
    const averageRiskScore = manufacturerMachines.reduce((sum, m) => sum + m.riskScore, 0) / manufacturerMachines.length;
    const highRiskCount = manufacturerMachines.filter(m => m.riskScore >= 4).length;
    
    return {
      manufacturer,
      averageRiskScore: Math.round(averageRiskScore * 10) / 10,
      highRiskCount,
      totalCount: manufacturerMachines.length,
      machines: manufacturerMachines,
    };
  });
}

