// 拡張モックデータ（重機一覧・ランキング用）

import { Machine, OperationHour, Maintenance, MachineRiskAnalysis, RiskFactor, ManufacturerRiskTrend, AIPrediction, AIPredictionComment, AIMalfunctionScore } from '@/types';

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

// AI予測データを生成
export function generateAIPrediction(): AIPrediction {
  const today = new Date();
  const riskAnalyses = generateMachineRiskAnalyses();
  const summaries = calculateMachineSummaries();
  
  // 現在の稼働率を計算
  const currentOperationRate = summaries.reduce((sum: number, s: any) => sum + s.operationRate, 0) / summaries.length;
  
  // 次月稼働率予測（現在の稼働率に基づいて±5%の変動）
  const nextMonthOperationRate = Math.max(50, Math.min(80, currentOperationRate + (Math.random() - 0.5) * 10));
  const nextMonthOperationRateChange = nextMonthOperationRate - currentOperationRate;
  
  // 次月コスト予測（年間コストから月次コストを計算し、±10%の変動）
  const currentYearlyCost = summaries.reduce((sum: number, s: any) => sum + s.yearlyCost, 0);
  const currentMonthlyCost = currentYearlyCost / 12; // 年間コストを12で割って月次コストを計算
  const nextMonthCost = currentMonthlyCost * (0.9 + Math.random() * 0.2);
  
  // リース候補重機（稼働率40%未満）
  const leaseRecommendations = summaries
    .filter((s: any) => s.operationRate < 40)
    .slice(0, 3)
    .map((s: any) => ({
      machineId: s.machine.machineId,
      machineClass: s.machine.machineClass,
      currentOperationRate: s.operationRate,
      estimatedMonthlyRevenue: Math.floor(50000 + Math.random() * 200000), // 5万円〜25万円
    }));
  
  // AI予測コメントを生成
  const comments: AIPredictionComment[] = [];
  
  // 稼働率予測コメント
  if (nextMonthOperationRateChange > 2) {
    comments.push({
      type: 'operation',
      message: `AI分析によると、来月の稼働率は${nextMonthOperationRate.toFixed(1)}%と予測されます（前月比+${nextMonthOperationRateChange.toFixed(1)}%）。好調な稼働状況が続く見込みです。`,
      confidence: 85,
      timestamp: today.toISOString(),
    });
  } else if (nextMonthOperationRateChange < -2) {
    comments.push({
      type: 'operation',
      message: `AI分析によると、来月の稼働率は${nextMonthOperationRate.toFixed(1)}%と予測されます（前月比${nextMonthOperationRateChange.toFixed(1)}%）。稼働率低下の要因を確認することを推奨します。`,
      confidence: 82,
      timestamp: today.toISOString(),
    });
  } else {
    comments.push({
      type: 'operation',
      message: `AI分析によると、来月の稼働率は${nextMonthOperationRate.toFixed(1)}%と予測されます。現在の稼働状況が維持される見込みです。`,
      confidence: 88,
      timestamp: today.toISOString(),
    });
  }
  
  // リース提案コメント
  if (leaseRecommendations.length > 0) {
    comments.push({
      type: 'lease',
      message: `稼働率が低い重機${leaseRecommendations.length}台がリース候補として推奨されます。推定月額収益: ${leaseRecommendations.reduce((sum, r) => sum + r.estimatedMonthlyRevenue, 0).toLocaleString()}円`,
      confidence: 75,
      timestamp: today.toISOString(),
    });
  }
  
  // コスト予測コメント
  const costChange = ((nextMonthCost - currentMonthlyCost) / currentMonthlyCost) * 100;
  if (costChange > 5) {
    comments.push({
      type: 'cost',
      message: `AI予測によると、来月のコストは${nextMonthCost.toLocaleString()}円と予測されます（前月比+${costChange.toFixed(1)}%）。コスト増加の要因を確認することを推奨します。`,
      confidence: 80,
      timestamp: today.toISOString(),
    });
  } else if (costChange < -5) {
    comments.push({
      type: 'cost',
      message: `AI予測によると、来月のコストは${nextMonthCost.toLocaleString()}円と予測されます（前月比${costChange.toFixed(1)}%）。コスト削減効果が期待できます。`,
      confidence: 78,
      timestamp: today.toISOString(),
    });
  }
  
  // 故障リスクコメント
  const highRiskCount = riskAnalyses.filter(r => r.riskScore >= 4).length;
  if (highRiskCount > 0) {
    comments.push({
      type: 'risk',
      message: `故障リスクが高い重機が${highRiskCount}台検出されました。早期のメンテナンスまたは買い替え検討を推奨します。`,
      confidence: 90,
      timestamp: today.toISOString(),
    });
  }
  
  return {
    nextMonthOperationRate: Math.round(nextMonthOperationRate * 10) / 10,
    nextMonthOperationRateChange: Math.round(nextMonthOperationRateChange * 10) / 10,
    nextMonthCost: Math.round(nextMonthCost),
    leaseRecommendations,
    comments,
  };
}

// AI不調スコアを生成
export function generateAIMalfunctionScores(): AIMalfunctionScore[] {
  const riskAnalyses = generateMachineRiskAnalyses();
  const malfunctionTypes = [
    'オイル漏れ',
    'アイドリング不安定',
    'エンジン異音',
    '油圧系統の不調',
    'ブレーキ効き不良',
    'アタッチメント動作不良',
    '冷却系統の不調',
    '電装系統の不調',
    '走行系統の不調',
    'その他不調',
  ];
  
  return riskAnalyses.map(risk => {
    // リスクスコアに基づいて不調スコアを計算（0-100）
    const baseScore = risk.riskScore * 20; // 1-5スコアを0-100に変換
    const variation = (Math.random() - 0.5) * 20; // ±10の変動
    const score = Math.max(0, Math.min(100, baseScore + variation));
    
    // 不調要因をランダムに選択（1-3個）
    const factorCount = Math.floor(Math.random() * 3) + 1;
    const selectedFactors = malfunctionTypes
      .sort(() => Math.random() - 0.5)
      .slice(0, factorCount)
      .map(factor => ({
        factor,
        severity: score > 70 ? 'high' as const : score > 40 ? 'medium' as const : 'low' as const,
        detectedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }));
    
    // AI推奨アクションを生成
    let aiRecommendation = '';
    if (score >= 80) {
      aiRecommendation = '緊急メンテナンスまたは買い替え検討を強く推奨します。故障リスクが非常に高い状態です。';
    } else if (score >= 60) {
      aiRecommendation = '早期のメンテナンスを推奨します。不調要因の解消により、故障リスクを低減できます。';
    } else if (score >= 40) {
      aiRecommendation = '定期的な点検を継続し、不調の兆候に注意してください。';
    } else {
      aiRecommendation = '現在の状態は良好です。定期的なメンテナンスを継続してください。';
    }
    
    return {
      machineId: risk.machineId,
      score: Math.round(score),
      factors: selectedFactors,
      aiRecommendation,
    };
  });
}

