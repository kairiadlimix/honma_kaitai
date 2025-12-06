// サンプルデータ生成スクリプト

// 重機マスタのサンプルデータ
export const sampleMachines = [
  ['管理番号', 'シリアル番号', 'メーカー', '重機クラス', '型式', '年式', '購入年月日', '特自検期限', 'ステータス'],
  ['SK-001', 'SK123456', 'コベルコ', 'SK235', 'SK235LC-8', '2018', '2018/04/01', '2024/12/31', '稼働中'],
  ['SK-002', 'SK123457', 'コベルコ', 'SK200', 'SK200LC-8', '2019', '2019/06/15', '2024/11/30', '稼働中'],
  ['SK-003', 'SK123458', 'コベルコ', 'SK235', 'SK235LC-8', '2017', '2017/03/20', '2024/10/31', '整備中'],
  ['SK-004', 'SK123459', 'コベルコ', 'SK200', 'SK200LC-8', '2020', '2020/05/10', '2025/01/31', '稼働中'],
  ['SK-005', 'SK123460', 'コベルコ', 'SK235', 'SK235LC-8', '2016', '2016/08/25', '2024/09/30', '稼働中'],
  ['ZX-001', 'ZX789012', '日立', 'ZX200', 'ZX200LC-5', '2018', '2018/07/01', '2024/12/15', '稼働中'],
  ['ZX-002', 'ZX789013', '日立', 'ZX200', 'ZX200LC-5', '2019', '2019/09/20', '2024/11/20', '稼働中'],
  ['ZX-003', 'ZX789014', '日立', 'ZX160', 'ZX160LC-5', '2017', '2017/11/10', '2024/10/15', '稼働中'],
  ['ZX-004', 'ZX789015', '日立', 'ZX200', 'ZX200LC-5', '2020', '2020/02/28', '2025/02/28', '入庫中'],
  ['ZX-005', 'ZX789016', '日立', 'ZX160', 'ZX160LC-5', '2018', '2018/12/05', '2024/12/05', '稼働中'],
  ['SK-006', 'SK123461', 'コベルコ', 'SK235', 'SK235LC-8', '2019', '2019/10/15', '2024/12/20', '稼働中'],
  ['SK-007', 'SK123462', 'コベルコ', 'SK200', 'SK200LC-8', '2021', '2021/01/20', '2025/01/20', '稼働中'],
  ['ZX-006', 'ZX789017', '日立', 'ZX200', 'ZX200LC-5', '2019', '2019/08/30', '2024/11/10', '整備中'],
  ['ZX-007', 'ZX789018', '日立', 'ZX160', 'ZX160LC-5', '2020', '2020/06/15', '2025/03/15', '稼働中'],
  ['SK-008', 'SK123463', 'コベルコ', 'SK235', 'SK235LC-8', '2018', '2018/11/10', '2024/12/10', '稼働中'],
];

// 稼働時間のサンプルデータ（過去6ヶ月分）
function generateOperationHours() {
  const machines = ['SK-001', 'SK-002', 'SK-003', 'SK-004', 'SK-005', 'ZX-001', 'ZX-002', 'ZX-003', 'ZX-004', 'ZX-005', 'SK-006', 'SK-007', 'ZX-006', 'ZX-007', 'SK-008'];
  const data: string[][] = [['管理番号', '日付', '稼働時間', 'アイドリング時間', '累計稼働時間']];
  
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  machines.forEach(machineId => {
    let totalHours = 3000 + Math.floor(Math.random() * 2000); // 初期累計時間
    
    for (let d = new Date(sixMonthsAgo); d <= today; d.setDate(d.getDate() + 1)) {
      // 週末は稼働しない可能性が高い
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (Math.random() > 0.3) continue; // 30%の確率で稼働
      }
      
      // 稼働時間（0-10時間）
      const operationHours = Math.random() > 0.2 ? (Math.random() * 8 + 2).toFixed(1) : '0';
      const idleHours = parseFloat(operationHours) > 0 ? (Math.random() * 2).toFixed(1) : '0';
      
      if (parseFloat(operationHours) > 0) {
        totalHours += parseFloat(operationHours);
        data.push([
          machineId,
          `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`,
          operationHours,
          idleHours,
          totalHours.toFixed(1),
        ]);
      }
    }
  });
  
  return data;
}

export const sampleOperationHours = generateOperationHours();

// メンテナンスのサンプルデータ（過去6ヶ月分）
function generateMaintenances() {
  const machines = ['SK-001', 'SK-002', 'SK-003', 'SK-004', 'SK-005', 'ZX-001', 'ZX-002', 'ZX-003', 'ZX-004', 'ZX-005', 'SK-006', 'SK-007', 'ZX-006', 'ZX-007', 'SK-008'];
  const maintenanceTypes = ['特自検', 'オイル交換', '部品交換', '点検', 'その他'];
  const data: string[][] = [['メンテナンスID', '管理番号', '実施日', 'メンテナンス種別', 'コスト', '実施内容']];
  
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  let maintenanceId = 1;
  
  machines.forEach(machineId => {
    // 各重機に対して月1-2回のメンテナンス
    for (let d = new Date(sixMonthsAgo); d <= today; d.setMonth(d.getMonth() + 1)) {
      if (Math.random() > 0.3) { // 70%の確率でメンテナンス
        const maintenanceDate = new Date(d);
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
        
        data.push([
          `MT-${String(maintenanceId).padStart(3, '0')}`,
          machineId,
          `${maintenanceDate.getFullYear()}/${String(maintenanceDate.getMonth() + 1).padStart(2, '0')}/${String(maintenanceDate.getDate()).padStart(2, '0')}`,
          type,
          cost.toString(),
          `${type}を実施しました`,
        ]);
        maintenanceId++;
      }
    }
  });
  
  return data;
}

export const sampleMaintenances = generateMaintenances();

// 消耗品のサンプルデータ（過去6ヶ月分）
function generateConsumables() {
  const machines = ['SK-001', 'SK-002', 'SK-003', 'SK-004', 'SK-005', 'ZX-001', 'ZX-002', 'ZX-003', 'ZX-004', 'ZX-005', 'SK-006', 'SK-007', 'ZX-006', 'ZX-007', 'SK-008'];
  const consumableTypes = [
    { type: 'オイル', unit: 'L', unitPrice: 800 },
    { type: 'エアフィルター', unit: '個', unitPrice: 2000 },
    { type: 'オイルフィルター', unit: '個', unitPrice: 1500 },
    { type: 'グリス', unit: 'kg', unitPrice: 500 },
  ];
  const data: string[][] = [['管理番号', '消耗品種別', '使用日', '使用量', '単位', '単価', '総コスト']];
  
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  machines.forEach(machineId => {
    // 各重機に対して月1-2回の消耗品使用
    for (let d = new Date(sixMonthsAgo); d <= today; d.setMonth(d.getMonth() + 1)) {
      if (Math.random() > 0.3) { // 70%の確率で消耗品使用
        const usageDate = new Date(d);
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
        
        data.push([
          machineId,
          consumable.type,
          `${usageDate.getFullYear()}/${String(usageDate.getMonth() + 1).padStart(2, '0')}/${String(usageDate.getDate()).padStart(2, '0')}`,
          quantity.toString(),
          consumable.unit,
          consumable.unitPrice.toString(),
          totalCost.toString(),
        ]);
      }
    }
  });
  
  return data;
}

export const sampleConsumables = generateConsumables();

