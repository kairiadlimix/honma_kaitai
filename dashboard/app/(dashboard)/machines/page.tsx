'use client';

import { useQuery } from '@tanstack/react-query';
import { MachineSummary } from '@/lib/mock-data-extended';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, AlertTriangle } from 'lucide-react';

async function fetchMachines(): Promise<MachineSummary[]> {
  const res = await fetch('/api/machines');
  if (!res.ok) {
    throw new Error('Failed to fetch machines');
  }
  return res.json();
}

function getStatusColor(status: string) {
  switch (status) {
    case '稼働中':
      return 'bg-green-100 text-green-800';
    case '整備中':
      return 'bg-yellow-100 text-yellow-800';
    case '入庫中':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getRiskScoreStars(score: number) {
  return '★'.repeat(score) + '☆'.repeat(5 - score);
}

function getRiskScoreColor(score: number) {
  if (score >= 4) return 'text-red-600';
  if (score >= 3) return 'text-orange-600';
  return 'text-gray-600';
}

export default function MachinesPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">重機一覧</h1>
        <p className="text-gray-600">全重機の状況を一覧で確認</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>重機一覧 ({machines.length}台)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">管理番号</th>
                  <th className="text-left p-3 font-semibold">メーカー</th>
                  <th className="text-left p-3 font-semibold">重機クラス</th>
                  <th className="text-left p-3 font-semibold">ステータス</th>
                  <th className="text-right p-3 font-semibold">累計稼働時間</th>
                  <th className="text-right p-3 font-semibold">今月の稼働時間</th>
                  <th className="text-right p-3 font-semibold">稼働率</th>
                  <th className="text-center p-3 font-semibold">故障リスク</th>
                  <th className="text-right p-3 font-semibold">年間コスト</th>
                  <th className="text-left p-3 font-semibold">最終メンテ日</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((summary) => (
                  <tr key={summary.machine.machineId} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{summary.machine.machineId}</td>
                    <td className="p-3">{summary.machine.manufacturer}</td>
                    <td className="p-3">{summary.machine.machineClass}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(summary.machine.status)}`}>
                        {summary.machine.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">{summary.totalOperationHours.toLocaleString()}時間</td>
                    <td className="p-3 text-right">{summary.monthlyOperationHours.toFixed(1)}時間</td>
                    <td className="p-3 text-right">{summary.operationRate.toFixed(1)}%</td>
                    <td className="p-3 text-center">
                      <span className={getRiskScoreColor(summary.failureRiskScore)}>
                        {getRiskScoreStars(summary.failureRiskScore)}
                      </span>
                    </td>
                    <td className="p-3 text-right">{summary.yearlyCost.toLocaleString()}円</td>
                    <td className="p-3 text-sm text-gray-600">
                      {summary.lastMaintenanceDate 
                        ? new Date(summary.lastMaintenanceDate).toLocaleDateString('ja-JP')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
