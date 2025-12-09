'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, BarChart3, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { calculateMachineSummaries } from '@/lib/mock-data-extended';
import { AIPrediction } from '@/types';

async function fetchCostData() {
  const res = await fetch('/api/cost');
  if (!res.ok) {
    throw new Error('Failed to fetch cost data');
  }
  return res.json();
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

export default function CostAnalysisPage() {
  const { data: costData, isLoading, error } = useQuery({
    queryKey: ['cost'],
    queryFn: fetchCostData,
  });

  const { data: machines } = useQuery({
    queryKey: ['machines'],
    queryFn: async () => {
      const res = await fetch('/api/machines');
      if (!res.ok) throw new Error('Failed to fetch machines');
      return res.json();
    },
  });

  const { data: aiPrediction } = useQuery({
    queryKey: ['ai-prediction'],
    queryFn: async (): Promise<AIPrediction> => {
      const res = await fetch('/api/ai-prediction');
      if (!res.ok) throw new Error('Failed to fetch AI prediction');
      return res.json();
    },
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

  if (!costData) {
    return null;
  }

  const { summary, monthlyCosts } = costData;

  // コスト内訳の円グラフ用データ
  const costBreakdown = [
    { name: '整備費', value: summary.maintenanceCost },
    { name: '消耗品費', value: summary.consumableCost },
  ];

  // 重機別コストランキング
  const machineCostRanking = machines
    ? [...machines]
        .sort((a, b) => b.yearlyCost - a.yearlyCost)
        .slice(0, 10)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">コスト分析</h1>
        <p className="text-gray-600">重機にかかっているコストを詳細に分析</p>
      </div>

      {/* コストサマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">年間総コスト</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalCost.toLocaleString()}円</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">年間整備費</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.maintenanceCost.toLocaleString()}円</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">年間消耗品費</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.consumableCost.toLocaleString()}円</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">1台あたり平均コスト</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(summary.averageCostPerMachine).toLocaleString()}円</div>
          </CardContent>
        </Card>
        {aiPrediction && aiPrediction.leaseRecommendations.length > 0 && (
          <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">推定リース収益（月額）</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {aiPrediction.leaseRecommendations.reduce((sum, r) => sum + r.estimatedMonthlyRevenue, 0).toLocaleString()}円
              </div>
              <p className="text-xs text-green-600 mt-1">
                年額: {(aiPrediction.leaseRecommendations.reduce((sum, r) => sum + r.estimatedMonthlyRevenue, 0) * 12).toLocaleString()}円
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 月次コスト推移 */}
        <Card>
          <CardHeader>
            <CardTitle>月次コスト推移</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyCosts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toLocaleString()}円`} />
                <Legend />
                <Line type="monotone" dataKey="totalCost" stroke="#3B82F6" name="総コスト" strokeWidth={2} />
                <Line type="monotone" dataKey="maintenanceCost" stroke="#10B981" name="整備費" />
                <Line type="monotone" dataKey="consumableCost" stroke="#F59E0B" name="消耗品費" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* コスト内訳 */}
        <Card>
          <CardHeader>
            <CardTitle>コスト内訳（年間）</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString()}円`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 重機別コストランキング */}
      <Card>
        <CardHeader>
          <CardTitle>重機別コストランキング（年間）</CardTitle>
        </CardHeader>
        <CardContent>
          {machineCostRanking.length > 0 ? (
            <div className="space-y-2">
              {machineCostRanking.map((machine, index) => (
                <div key={machine.machine.machineId} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded border">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-gray-400 w-8">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <div>
                      <span className="font-medium">{machine.machine.machineId}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {machine.machine.manufacturer} {machine.machine.machineClass}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-600">{machine.yearlyCost.toLocaleString()}円</div>
                    <div className="text-sm text-gray-500">
                      {machine.monthlyOperationHours > 0
                        ? `${Math.round(machine.yearlyCost / 12 / machine.monthlyOperationHours).toLocaleString()}円/時間`
                        : '-'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">データがありません</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
