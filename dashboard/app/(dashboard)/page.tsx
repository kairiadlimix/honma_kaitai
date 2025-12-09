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
  Activity,
  Sparkles,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DashboardSummary, MonthlyOperationRate, AIPrediction } from '@/types';

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

async function fetchAIPrediction(): Promise<AIPrediction> {
  const res = await fetch('/api/ai-prediction');
  if (!res.ok) {
    throw new Error('Failed to fetch AI prediction');
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

  const { data: aiPrediction, isLoading: isLoadingAI } = useQuery({
    queryKey: ['ai-prediction'],
    queryFn: fetchAIPrediction,
    refetchInterval: 60000, // 1分ごとに更新
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
    <div className="space-y-8 md:space-y-10 p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4">全社サマリー</h1>
        <p className="text-lg md:text-xl text-gray-600">重機の稼働状況とコストの全体像</p>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
        {aiPrediction && (
          <KPICard
            title="AI予測: 次月稼働率"
            value={`${aiPrediction.nextMonthOperationRate}%`}
            icon={Sparkles}
            color="purple"
            trend={{
              value: Math.abs(aiPrediction.nextMonthOperationRateChange),
              isPositive: aiPrediction.nextMonthOperationRateChange >= 0,
            }}
            description={`前月比 ${aiPrediction.nextMonthOperationRateChange >= 0 ? '+' : ''}${aiPrediction.nextMonthOperationRateChange.toFixed(1)}%`}
          />
        )}
        <KPICard
          title="今月の総コスト"
          value={`${summary.monthlyTotalCost.toLocaleString()}円`}
          icon={DollarSign}
          color="orange"
        />
        {aiPrediction && aiPrediction.leaseRecommendations.length > 0 && (
          <KPICard
            title="リース候補重機"
            value={`${aiPrediction.leaseRecommendations.length}台`}
            icon={TrendingDown}
            color="green"
            description={`推定月額収益: ${aiPrediction.leaseRecommendations.reduce((sum, r) => sum + r.estimatedMonthlyRevenue, 0).toLocaleString()}円`}
          />
        )}
      </div>

      {/* 月次稼働率グラフ */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-2xl md:text-3xl font-bold text-gray-900">
            <TrendingUp className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
            <span>月次稼働率推移</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {isLoadingRates ? (
            <div className="flex items-center justify-center h-64 md:h-96">
              <div className="text-lg md:text-xl text-gray-500">データを読み込み中...</div>
            </div>
          ) : monthlyRates && monthlyRates.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={monthlyRates} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="monthLabel" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fontSize: 14, fill: '#374151' }}
                  stroke="#6b7280"
                />
                <YAxis 
                  domain={[0, 100]}
                  label={{ value: '稼働率 (%)', angle: -90, position: 'insideLeft', style: { fontSize: 16, fontWeight: 'bold' } }}
                  tick={{ fontSize: 14, fill: '#374151' }}
                  stroke="#6b7280"
                />
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  labelFormatter={(label) => label}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #3b82f6', 
                    borderRadius: '8px',
                    fontSize: '16px',
                    padding: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '16px', paddingTop: '20px' }} />
                <Line 
                  type="monotone" 
                  dataKey="operationRate" 
                  stroke="#2563eb" 
                  strokeWidth={4}
                  name="稼働率"
                  dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 10, fill: '#1d4ed8', strokeWidth: 3, stroke: '#fff' }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 md:h-96">
              <div className="text-lg md:text-xl text-gray-500">データがありません</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI予測コメント */}
      {aiPrediction && aiPrediction.comments.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-xl border-2 border-purple-300 shadow-lg p-6 md:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-purple-600 animate-pulse" />
            <h2 className="text-2xl md:text-3xl font-bold text-purple-900">AI予測・推奨事項</h2>
          </div>
          <div className="space-y-4 md:space-y-5">
            {aiPrediction.comments.map((comment, index) => (
              <div key={index} className="bg-white rounded-xl p-5 md:p-6 border-l-4 border-purple-500 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-base md:text-lg text-gray-800 flex-1 leading-relaxed font-medium">{comment.message}</p>
                  <span className="ml-4 text-sm md:text-base text-purple-700 bg-purple-100 px-3 py-2 rounded-lg font-semibold whitespace-nowrap">
                    信頼度: {comment.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* リース活用提案 */}
      {aiPrediction && aiPrediction.leaseRecommendations.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-xl border-2 border-green-300 shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <TrendingDown className="h-8 w-8 md:h-10 md:w-10 text-green-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-green-900">リース活用提案</h2>
            </div>
            <div className="text-right">
              <p className="text-sm md:text-base text-green-700 font-medium">推定月額収益</p>
              <p className="text-2xl md:text-3xl font-bold text-green-900">
                {aiPrediction.leaseRecommendations.reduce((sum, r) => sum + r.estimatedMonthlyRevenue, 0).toLocaleString()}円
              </p>
              <p className="text-sm md:text-base text-green-600 mt-1">
                年額: {(aiPrediction.leaseRecommendations.reduce((sum, r) => sum + r.estimatedMonthlyRevenue, 0) * 12).toLocaleString()}円
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
            <p className="text-base md:text-lg text-gray-700 mb-4 font-medium">
              稼働率が低い重機をリース化することで、遊休資産を収益化できます。
            </p>
            <div className="space-y-3 md:space-y-4">
              {aiPrediction.leaseRecommendations.map((lease, index) => (
                <div key={lease.machineId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-green-200 hover:bg-green-50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-base md:text-lg font-semibold text-gray-900">{lease.machineId}</p>
                      <p className="text-sm md:text-base text-gray-600">{lease.machineClass}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs md:text-sm text-gray-500">現在の稼働率</p>
                      <p className="text-base md:text-lg font-bold text-orange-600">{lease.currentOperationRate.toFixed(1)}%</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="text-right">
                      <p className="text-xs md:text-sm text-gray-500">推定月額収益</p>
                      <p className="text-lg md:text-xl font-bold text-green-700">{lease.estimatedMonthlyRevenue.toLocaleString()}円</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-green-200">
              <button className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors text-base md:text-lg">
                リース提案を送信
              </button>
            </div>
          </div>
        </div>
      )}

      {/* アラート・通知 */}
      <div className="bg-white rounded-xl border-2 shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">アラート・通知</h2>
        <div className="space-y-4 md:space-y-5">
          <div className="flex items-center space-x-4 p-4 md:p-5 bg-red-50 rounded-xl border-l-4 border-red-500 shadow-md hover:shadow-lg transition-shadow">
            <AlertTriangle className="h-7 w-7 md:h-8 md:w-8 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-lg md:text-xl font-bold text-red-900">故障リスクが高い重機</p>
              <p className="text-base md:text-lg text-red-700 font-semibold mt-1">{summary.highRiskMachines}台</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 md:p-5 bg-yellow-50 rounded-xl border-l-4 border-yellow-500 shadow-md hover:shadow-lg transition-shadow">
            <Calendar className="h-7 w-7 md:h-8 md:w-8 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="text-lg md:text-xl font-bold text-yellow-900">特自検期限が近い重機</p>
              <p className="text-base md:text-lg text-yellow-700 font-semibold mt-1">{summary.inspectionDeadlineMachines}台（1ヶ月以内）</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 md:p-5 bg-orange-50 rounded-xl border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow">
            <Activity className="h-7 w-7 md:h-8 md:w-8 text-orange-600 flex-shrink-0" />
            <div>
              <p className="text-lg md:text-xl font-bold text-orange-900">稼働率が低い重機</p>
              <p className="text-base md:text-lg text-orange-700 font-semibold mt-1">{summary.lowOperationRateMachines}台（40%未満）</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

