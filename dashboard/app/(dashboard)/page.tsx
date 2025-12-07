'use client';

import { useQuery } from '@tanstack/react-query';
import { KPICard } from '@/components/dashboard/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wrench, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  Calendar,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DashboardSummary, MonthlyOperationRate } from '@/types';

async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch('/api/dashboard/summary');
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard summary');
  }
  return res.json();
}

async function fetchMonthlyOperationRate(): Promise<MonthlyOperationRate[]> {
  const res = await fetch('/api/dashboard/monthly-operation-rate');
  if (!res.ok) {
    throw new Error('Failed to fetch monthly operation rate');
  }
  return res.json();
}

export default function DashboardPage() {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
    refetchInterval: 30000, // 30秒ごとに更新
  });

  const { data: monthlyRates, isLoading: isLoadingRates } = useQuery({
    queryKey: ['monthly-operation-rate'],
    queryFn: fetchMonthlyOperationRate,
    refetchInterval: 30000,
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
        <div className="text-sm text-gray-500 mt-2">
          Google Sheetsの設定を確認してください
        </div>
        <div className="text-xs text-blue-500 mt-4">
          💡 デモモードを使用する場合は、.env.localに USE_MOCK_DATA=true を設定してください
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">全社サマリー</h1>
        <p className="text-gray-600">重機の稼働状況とコストの全体像</p>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="総重機台数"
          value={`${summary.totalMachines}台`}
          icon={Wrench}
          color="blue"
        />
        <KPICard
          title="稼働中"
          value={`${summary.operatingMachines}台`}
          icon={CheckCircle}
          color="green"
        />
        <KPICard
          title="整備中"
          value={`${summary.maintenanceMachines}台`}
          icon={AlertCircle}
          color="yellow"
        />
        <KPICard
          title="入庫中"
          value={`${summary.storedMachines}台`}
          icon={Package}
          color="gray"
        />
        <KPICard
          title="全体稼働率"
          value={`${summary.overallOperationRate}%`}
          icon={TrendingUp}
          color="purple"
        />
        <KPICard
          title="今月の総コスト"
          value={`${summary.monthlyTotalCost.toLocaleString()}円`}
          icon={DollarSign}
          color="orange"
        />
      </div>

      {/* 月次稼働率グラフ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>月次稼働率推移</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRates ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">データを読み込み中...</div>
            </div>
          ) : monthlyRates && monthlyRates.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyRates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="monthLabel" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  domain={[0, 100]}
                  label={{ value: '稼働率 (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  labelFormatter={(label) => label}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="operationRate" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="稼働率"
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">データがありません</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* アラート・通知 */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">アラート・通知</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium text-red-900">故障リスクが高い重機</p>
              <p className="text-sm text-red-700">{summary.highRiskMachines}台</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <Calendar className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-medium text-yellow-900">特自検期限が近い重機</p>
              <p className="text-sm text-yellow-700">{summary.inspectionDeadlineMachines}台（1ヶ月以内）</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <Activity className="h-5 w-5 text-orange-500" />
            <div>
              <p className="font-medium text-orange-900">稼働率が低い重機</p>
              <p className="text-sm text-orange-700">{summary.lowOperationRateMachines}台（40%未満）</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

