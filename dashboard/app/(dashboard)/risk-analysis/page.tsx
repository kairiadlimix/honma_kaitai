'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Wrench, Calendar, BarChart3, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { MachineRiskAnalysis, ManufacturerRiskTrend, AIMalfunctionScore } from '@/types';

interface RiskAnalysisResponse {
  machines: MachineRiskAnalysis[];
  manufacturerTrends: ManufacturerRiskTrend[];
  highRiskMachines: MachineRiskAnalysis[];
  topRiskMachines: MachineRiskAnalysis[];
}

async function fetchRiskAnalysis(): Promise<RiskAnalysisResponse> {
  const res = await fetch('/api/risk-analysis');
  if (!res.ok) {
    throw new Error('Failed to fetch risk analysis');
  }
  return res.json();
}

async function fetchAIMalfunctionScores(): Promise<AIMalfunctionScore[]> {
  const res = await fetch('/api/ai-malfunction-scores');
  if (!res.ok) {
    throw new Error('Failed to fetch AI malfunction scores');
  }
  return res.json();
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#DC2626'];

export default function RiskAnalysisPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['risk-analysis'],
    queryFn: fetchRiskAnalysis,
    refetchInterval: 30000,
  });

  const { data: aiMalfunctionScores, isLoading: isLoadingAI } = useQuery({
    queryKey: ['ai-malfunction-scores'],
    queryFn: fetchAIMalfunctionScores,
    refetchInterval: 60000,
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

  if (!data) {
    return null;
  }

  const { machines, manufacturerTrends, highRiskMachines, topRiskMachines } = data;
  
  // AI不調スコアをマシンIDでマッピング
  const aiScoreMap = new Map<string, AIMalfunctionScore>();
  if (aiMalfunctionScores) {
    aiMalfunctionScores.forEach(score => {
      aiScoreMap.set(score.machineId, score);
    });
  }

  // メーカー別平均リスクスコアのグラフデータ
  const manufacturerChartData = manufacturerTrends.map(trend => ({
    name: trend.manufacturer,
    平均リスクスコア: trend.averageRiskScore,
    高リスク台数: trend.highRiskCount,
  }));

  // 推奨アクション別の集計
  const actionCounts = {
    maintenance: highRiskMachines.filter(m => m.recommendedAction === 'maintenance').length,
    replacement: highRiskMachines.filter(m => m.recommendedAction === 'replacement').length,
    monitor: machines.filter(m => m.recommendedAction === 'monitor').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">故障リスク分析</h1>
        <p className="text-gray-600">故障しやすい重機の状況を把握</p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高リスク重機</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highRiskMachines.length}台</div>
            <p className="text-xs text-gray-500 mt-1">リスクスコア4以上</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均リスクスコア</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(machines.reduce((sum, m) => sum + m.riskScore, 0) / machines.length).toFixed(1)}
            </div>
            <p className="text-xs text-gray-500 mt-1">全重機の平均</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">整備推奨</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{actionCounts.maintenance}台</div>
            <p className="text-xs text-gray-500 mt-1">整備を推奨</p>
          </CardContent>
        </Card>
      </div>

      {/* 故障リスクランキング TOP10 */}
      <Card>
        <CardHeader>
          <CardTitle>故障リスクランキング TOP10</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">順位</th>
                  <th className="text-left p-2">管理番号</th>
                  <th className="text-left p-2">メーカー</th>
                  <th className="text-left p-2">重機クラス</th>
                  <th className="text-left p-2">リスクスコア</th>
                  <th className="text-left p-2">AI不調スコア</th>
                  <th className="text-left p-2">年式</th>
                  <th className="text-left p-2">稼働率</th>
                  <th className="text-left p-2">AI推奨アクション</th>
                </tr>
              </thead>
              <tbody>
                {topRiskMachines.map((machine, index) => {
                  const aiScore = aiScoreMap.get(machine.machineId);
                  return (
                    <tr key={machine.machineId} className="border-b hover:bg-gray-50">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2 font-medium">{machine.machineId}</td>
                      <td className="p-2">{machine.manufacturer}</td>
                      <td className="p-2">{machine.machineClass}</td>
                      <td className="p-2">
                        <span className={`font-bold ${
                          machine.riskScore >= 5 ? 'text-red-600' :
                          machine.riskScore >= 4 ? 'text-orange-600' :
                          machine.riskScore >= 3 ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {'★'.repeat(machine.riskScore)}{'☆'.repeat(5 - machine.riskScore)}
                        </span>
                      </td>
                      <td className="p-2">
                        {aiScore ? (
                          <div className="flex items-center space-x-1">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                            <span className={`font-bold ${
                              aiScore.score >= 80 ? 'text-red-600' :
                              aiScore.score >= 60 ? 'text-orange-600' :
                              aiScore.score >= 40 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {aiScore.score}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-2">{machine.year}年</td>
                      <td className="p-2">{machine.operationRate.toFixed(1)}%</td>
                      <td className="p-2">
                        {aiScore ? (
                          <div className="space-y-1">
                            <span className={`px-2 py-1 rounded text-xs ${
                              machine.recommendedAction === 'replacement' ? 'bg-red-100 text-red-800' :
                              machine.recommendedAction === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {machine.recommendedAction === 'replacement' ? '買い替え検討' :
                               machine.recommendedAction === 'maintenance' ? '整備推奨' :
                               '監視継続'}
                            </span>
                            <p className="text-xs text-purple-700 italic">{aiScore.aiRecommendation}</p>
                          </div>
                        ) : (
                          <span className={`px-2 py-1 rounded text-xs ${
                            machine.recommendedAction === 'replacement' ? 'bg-red-100 text-red-800' :
                            machine.recommendedAction === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {machine.recommendedAction === 'replacement' ? '買い替え検討' :
                             machine.recommendedAction === 'maintenance' ? '整備推奨' :
                             '監視継続'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* メーカー別故障傾向 */}
      <Card>
        <CardHeader>
          <CardTitle>メーカー別故障傾向</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={manufacturerChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="平均リスクスコア" fill="#3B82F6" name="平均リスクスコア" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 要注意重機リスト（リスク4以上） */}
      <Card>
        <CardHeader>
          <CardTitle>要注意重機リスト（リスクスコア4以上）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highRiskMachines.map(machine => (
              <div key={machine.machineId} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{machine.machineId}</h3>
                    <p className="text-sm text-gray-600">
                      {machine.manufacturer} {machine.machineClass} ({machine.year}年)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      machine.riskScore >= 5 ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {'★'.repeat(machine.riskScore)}{'☆'.repeat(5 - machine.riskScore)}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      machine.recommendedAction === 'replacement' ? 'bg-red-100 text-red-800' :
                      machine.recommendedAction === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {machine.recommendedAction === 'replacement' ? '買い替え検討' :
                       machine.recommendedAction === 'maintenance' ? '整備推奨' :
                       '監視継続'}
                    </span>
                  </div>
                </div>

                {/* AI不調スコア */}
                {aiScoreMap.has(machine.machineId) && (
                  <div className="mb-3 bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <p className="text-sm font-semibold text-purple-900">AI不調スコア: {aiScoreMap.get(machine.machineId)?.score}点</p>
                    </div>
                    <p className="text-sm text-purple-800 mb-2 italic">{aiScoreMap.get(machine.machineId)?.aiRecommendation}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-purple-700">検出された不調要因:</p>
                      {aiScoreMap.get(machine.machineId)?.factors.map((factor, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs">
                          <span className={`w-2 h-2 rounded-full ${
                            factor.severity === 'high' ? 'bg-red-500' :
                            factor.severity === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></span>
                          <span>{factor.factor}</span>
                          {factor.detectedDate && (
                            <span className="text-gray-500">({factor.detectedDate})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* リスク要因 */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">リスク要因（予測に使用した情報）:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {machine.riskFactors.map((factor, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <span className={`w-2 h-2 rounded-full ${
                          factor.impact === 'high' ? 'bg-red-500' :
                          factor.impact === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></span>
                        <span className="font-medium">{factor.factor}:</span>
                        <span>{factor.value}</span>
                        <span className="text-gray-500 text-xs">({factor.description})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 詳細情報 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">メンテナンス頻度</p>
                    <p className="font-medium">過去6ヶ月で{machine.maintenanceFrequency}回</p>
                  </div>
                  <div>
                    <p className="text-gray-500">累計稼働時間</p>
                    <p className="font-medium">{machine.totalOperationHours.toLocaleString()}時間</p>
                  </div>
                  <div>
                    <p className="text-gray-500">最終メンテナンスから</p>
                    <p className="font-medium">{machine.daysSinceLastMaintenance}日経過</p>
                  </div>
                  {machine.predictedMaintenanceDate && (
                    <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                      <div className="flex items-center space-x-1 mb-1">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <p className="text-gray-700 font-semibold text-sm">AI予測: 次回メンテ</p>
                      </div>
                      <p className="font-bold text-purple-900">
                        {machine.predictedMaintenanceDays}日後
                        <br />
                        <span className="text-xs font-normal">({machine.predictedMaintenanceDate})</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
