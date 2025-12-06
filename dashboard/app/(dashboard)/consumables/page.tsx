'use client';

import { useQuery } from '@tanstack/react-query';
import { ConsumableSummary } from '@/lib/mock-consumables';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

async function fetchConsumables(): Promise<ConsumableSummary[]> {
  const res = await fetch('/api/consumables');
  if (!res.ok) {
    throw new Error('Failed to fetch consumables');
  }
  return res.json();
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

export default function ConsumablesPage() {
  const { data: consumables, isLoading, error } = useQuery({
    queryKey: ['consumables'],
    queryFn: fetchConsumables,
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

  if (!consumables) {
    return null;
  }

  // グラフ用データ
  const pieChartData = consumables.map(c => ({
    name: c.consumableType,
    value: c.totalCost,
  }));

  const barChartData = consumables.map(c => ({
    name: c.consumableType,
    使用量: c.monthlyQuantity,
    コスト: c.monthlyCost,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">消耗品管理</h1>
        <p className="text-gray-600">消耗品の使用状況とコストを可視化</p>
      </div>

      {/* 消耗品別サマリー */}
      <Card>
        <CardHeader>
          <CardTitle>消耗品別の使用状況</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">消耗品種別</th>
                  <th className="text-right p-3 font-semibold">使用量（月次）</th>
                  <th className="text-right p-3 font-semibold">使用量（年間）</th>
                  <th className="text-right p-3 font-semibold">単価</th>
                  <th className="text-right p-3 font-semibold">コスト（月次）</th>
                  <th className="text-right p-3 font-semibold">コスト（年間）</th>
                </tr>
              </thead>
              <tbody>
                {consumables.map((consumable) => (
                  <tr key={consumable.consumableType} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{consumable.consumableType}</td>
                    <td className="p-3 text-right">
                      {consumable.monthlyQuantity.toFixed(1)} {consumable.unit}
                    </td>
                    <td className="p-3 text-right">
                      {consumable.totalQuantity.toFixed(1)} {consumable.unit}
                    </td>
                    <td className="p-3 text-right">{consumable.unitPrice.toLocaleString()}円</td>
                    <td className="p-3 text-right">{consumable.monthlyCost.toLocaleString()}円</td>
                    <td className="p-3 text-right font-semibold">{consumable.totalCost.toLocaleString()}円</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 消耗品コスト内訳 */}
        <Card>
          <CardHeader>
            <CardTitle>消耗品コスト内訳（年間）</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString()}円`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 月次使用量 */}
        <Card>
          <CardHeader>
            <CardTitle>月次使用量とコスト</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="使用量" fill="#3B82F6" name="使用量" />
                <Bar yAxisId="right" dataKey="コスト" fill="#10B981" name="コスト（円）" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ランキング */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span>使用量が多い消耗品 TOP5</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {consumables
                .sort((a, b) => b.totalQuantity - a.totalQuantity)
                .slice(0, 5)
                .map((consumable, index) => (
                  <div key={consumable.consumableType} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-gray-400 w-6">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </span>
                      <span className="font-medium">{consumable.consumableType}</span>
                    </div>
                    <span className="font-semibold">
                      {consumable.totalQuantity.toFixed(1)} {consumable.unit}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplet className="h-5 w-5 text-orange-500" />
              <span>コストが高い消耗品 TOP5</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {consumables
                .sort((a, b) => b.totalCost - a.totalCost)
                .slice(0, 5)
                .map((consumable, index) => (
                  <div key={consumable.consumableType} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-gray-400 w-6">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </span>
                      <span className="font-medium">{consumable.consumableType}</span>
                    </div>
                    <span className="font-semibold text-orange-600">
                      {consumable.totalCost.toLocaleString()}円
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
