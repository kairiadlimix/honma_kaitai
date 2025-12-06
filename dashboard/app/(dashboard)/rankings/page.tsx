'use client';

import { useQuery } from '@tanstack/react-query';
import { MachineSummary } from '@/lib/mock-data-extended';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';

async function fetchMachines(): Promise<MachineSummary[]> {
  const res = await fetch('/api/machines');
  if (!res.ok) {
    throw new Error('Failed to fetch machines');
  }
  return res.json();
}

export default function RankingsPage() {
  const { data: machines, isLoading, error } = useQuery({
    queryKey: ['machines'],
    queryFn: fetchMachines,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">データを読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">データの取得に失敗しました</div>
      </div>
    );
  }

  if (!machines) {
    return null;
  }

  // ランキングを計算
  const operationHoursRanking = [...machines]
    .sort((a, b) => b.monthlyOperationHours - a.monthlyOperationHours)
    .slice(0, 10);

  const operationRateRanking = [...machines]
    .sort((a, b) => b.operationRate - a.operationRate)
    .slice(0, 10);

  const lowOperationRateRanking = [...machines]
    .filter(m => m.operationRate < 40)
    .sort((a, b) => a.operationRate - b.operationRate)
    .slice(0, 10);

  const costEfficiencyRanking = [...machines]
    .map(m => ({
      ...m,
      costPerHour: m.monthlyOperationHours > 0 
        ? m.yearlyCost / 12 / m.monthlyOperationHours 
        : Infinity,
    }))
    .sort((a, b) => a.costPerHour - b.costPerHour)
    .slice(0, 10);

  const highCostRanking = [...machines]
    .sort((a, b) => b.yearlyCost - a.yearlyCost)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">稼働ランキング</h1>
        <p className="text-gray-600">重機の稼働状況をランキングで可視化</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 稼働時間ランキング */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>月次稼働時間 TOP10</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {operationHoursRanking.map((summary, index) => (
                <div key={summary.machine.machineId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400 w-6">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <span className="font-medium">{summary.machine.machineId}</span>
                    <span className="text-sm text-gray-500">{summary.machine.machineClass}</span>
                  </div>
                  <span className="font-semibold">{summary.monthlyOperationHours.toFixed(1)}時間</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 稼働率ランキング */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-blue-500" />
              <span>稼働率 TOP10</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {operationRateRanking.map((summary, index) => (
                <div key={summary.machine.machineId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400 w-6">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <span className="font-medium">{summary.machine.machineId}</span>
                    <span className="text-sm text-gray-500">{summary.machine.machineClass}</span>
                  </div>
                  <span className="font-semibold">{summary.operationRate.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 稼働率が低い重機（リース候補） */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>稼働率が低い重機（40%未満）</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowOperationRateRanking.length > 0 ? (
              <div className="space-y-2">
                {lowOperationRateRanking.map((summary, index) => (
                  <div key={summary.machine.machineId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-gray-400 w-6">{index + 1}.</span>
                      <span className="font-medium">{summary.machine.machineId}</span>
                      <span className="text-sm text-gray-500">{summary.machine.machineClass}</span>
                    </div>
                    <span className="font-semibold text-orange-600">{summary.operationRate.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">該当する重機はありません</p>
            )}
          </CardContent>
        </Card>

        {/* コスト効率ランキング */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span>コスト効率が良い重機 TOP10</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {costEfficiencyRanking.map((summary, index) => (
                <div key={summary.machine.machineId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400 w-6">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <span className="font-medium">{summary.machine.machineId}</span>
                    <span className="text-sm text-gray-500">{summary.machine.machineClass}</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {summary.costPerHour !== Infinity 
                      ? `${Math.round(summary.costPerHour).toLocaleString()}円/時間`
                      : '-'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 年間コストが高い重機 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-red-500" />
              <span>年間コストが高い重機 TOP10</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {highCostRanking.map((summary, index) => (
                <div key={summary.machine.machineId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-gray-400 w-6">{index + 1}.</span>
                    <span className="font-medium">{summary.machine.machineId}</span>
                    <span className="text-sm text-gray-500">{summary.machine.machineClass}</span>
                  </div>
                  <span className="font-semibold text-red-600">{summary.yearlyCost.toLocaleString()}円</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
