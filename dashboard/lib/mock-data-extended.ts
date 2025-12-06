// 拡張モックデータ（重機一覧・ランキング用）

import { Machine, OperationHour, Maintenance } from '@/types';

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
    
    // 故障リスクスコア（メンテナンス頻度から計算）
    let failureRiskScore = 1;
    if (maintenanceCount >= 8) {
      failureRiskScore = 5;
    } else if (maintenanceCount >= 6) {
      failureRiskScore = 4;
    } else if (maintenanceCount >= 4) {
      failureRiskScore = 3;
    } else if (maintenanceCount >= 2) {
      failureRiskScore = 2;
    }
    
    // 年間コスト
    const yearlyCost = machineMaintenances
      .filter(m => {
        const mDate = new Date(m.maintenanceDate);
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return mDate >= yearStart;
      })
      .reduce((sum, m) => sum + m.cost, 0);
    
    // 最終メンテナンス日
    const lastMaintenance = machineMaintenances
      .sort((a, b) => new Date(b.maintenanceDate).getTime() - new Date(a.maintenanceDate).getTime())[0];
    
    return {
      machine,
      totalOperationHours: parseFloat(totalOps.toFixed(1)),
      monthlyOperationHours: parseFloat(monthlyOps.toFixed(1)),
      operationRate: parseFloat(operationRate.toFixed(1)),
      failureRiskScore,
      yearlyCost,
      lastMaintenanceDate: lastMaintenance?.maintenanceDate,
    };
  });
}

