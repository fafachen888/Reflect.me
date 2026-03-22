import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { demoMatchAnalysis, demoUserA, demoUserB } from '../data/mockData';

interface TopologyItem {
  dimensionId: string;
  emoji: string;
  label: string;
  userScore: number;
  targetScore: string;
  matchLevel: 'high' | 'medium' | 'low';
  analysis: string;
  matchRate: number;
}

function getMatchColor(rate: number): string {
  if (rate >= 75) return '#ef4444';   // 红色 - 高契合
  if (rate >= 45) return '#f59e0b';   // 黄色 - 一般
  return '#22c55e';                  // 绿色 - 需磨合
}

function getMatchLabel(rate: number): string {
  if (rate >= 75) return '高度契合';
  if (rate >= 45) return '基本一致';
  return '需要磨合';
}

function TopologyGraph({ items }: { items: TopologyItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">🕸️ 关系拓扑图谱</h2>
      <p className="text-sm text-gray-500 mb-1">连线的颜色代表契合程度</p>
      <div className="flex gap-3 mb-4 flex-wrap">
        {[
          { color: '#ef4444', label: '红色 = 高度契合' },
          { color: '#f59e0b', label: '黄色 = 基本一致' },
          { color: '#22c55e', label: '绿色 = 需要磨合' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 rounded" style={{ backgroundColor: l.color }} />
            <span className="text-xs text-gray-500">{l.label}</span>
          </div>
        ))}
      </div>

      {/* SVG Graph */}
      <div className="relative bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 rounded-2xl p-4 min-h-72">
        <svg viewBox="0 0 500 320" className="w-full" style={{ overflow: 'visible' }}>
          {/* Center avatar - "合拍" */}
          <defs>
            <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Connection lines from left avatar to right avatar via each dimension */}
          {items.map((item, i) => {
            const yPos = 50 + i * (220 / (items.length - 1));
            const color = getMatchColor(item.matchRate);
            const isHovered = hovered === i;
            return (
              <g key={item.dimensionId}>
                {/* Connection line from left to right through this dimension point */}
                <line
                  x1="50" y1={yPos}
                  x2="450" y2={yPos}
                  stroke={color}
                  strokeWidth={isHovered ? 3 : 1.5}
                  strokeOpacity={isHovered ? 0.6 : 0.25}
                  strokeDasharray={item.matchLevel === 'low' ? '6 4' : item.matchLevel === 'medium' ? '3 3' : 'none'}
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Dimension node on the line */}
                <g transform={`translate(250, ${yPos})`}>
                  <circle
                    r={isHovered ? 22 : 18}
                    fill="white"
                    stroke={color}
                    strokeWidth={isHovered ? 3 : 2}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="14px"
                    style={{ pointerEvents: 'none' }}
                  >
                    {item.emoji}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Left avatar */}
          <g transform="translate(50, 160)">
            <circle r="32" fill="url(#centerGrad)" />
            <circle r="26" fill="white" stroke="#6366f1" strokeWidth="2.5" />
            <text textAnchor="middle" dominantBaseline="central" fontSize="22px">🧑</text>
          </g>

          {/* Right avatar */}
          <g transform="translate(450, 160)">
            <circle r="32" fill="url(#centerGrad)" />
            <circle r="26" fill="white" stroke="#8b5cf6" strokeWidth="2.5" />
            <text textAnchor="middle" dominantBaseline="central" fontSize="22px">👩</text>
          </g>

          {/* Center label */}
          <g transform="translate(250, 160)">
            <rect x="-36" y="-18" width="72" height="36" rx="18" fill="#6366f1" opacity="0.9" />
            <text textAnchor="middle" dominantBaseline="central" fill="white" fontSize="13px" fontWeight="bold">合拍</text>
          </g>

          {/* Labels on left */}
          <text x="20" y="20" fontSize="11" fill="#6366f1" fontWeight="bold">你</text>
          {/* Labels on right */}
          <text x="475" y="20" fontSize="11" fill="#8b5cf6" fontWeight="bold" textAnchor="end">TA</text>
        </svg>

        {/* Hover tooltip */}
        {hovered !== null && items[hovered] && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-2xl border border-gray-200 z-20 w-64 pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{items[hovered].emoji}</span>
              <span className="font-bold text-gray-900">{items[hovered].label}</span>
            </div>
            <div className="flex gap-3 text-xs mb-2">
              <span className="text-indigo-600">你的: <strong>{items[hovered].userScore}</strong></span>
              <span className="text-violet-600">TA的: <strong>{items[hovered].targetScore}</strong></span>
              <span className="font-bold px-2 py-0.5 rounded-full text-white ml-auto" style={{ backgroundColor: getMatchColor(items[hovered].matchRate), fontSize: '10px' }}>
                {items[hovered].matchRate}%
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{items[hovered].analysis}</p>
          </div>
        )}
      </div>

      {/* Dimension legend cards */}
      <div className="mt-4 space-y-2">
        {items.map((item, i) => (
          <div
            key={item.dimensionId}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
              hovered === i ? 'border-2 shadow-sm' : 'border-gray-100'
            }`}
            style={{ borderColor: hovered === i ? getMatchColor(item.matchRate) : undefined }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="text-lg">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800 text-sm">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">你: <strong className="text-gray-700">{item.userScore}</strong></span>
                  <span className="text-xs text-gray-400">TA: <strong className="text-gray-700">{item.targetScore}</strong></span>
                </div>
              </div>
              <div className="mt-1.5 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{
                  width: `${item.matchRate}%`,
                  backgroundColor: getMatchColor(item.matchRate),
                  opacity: 0.7,
                }} />
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-sm font-bold" style={{ color: getMatchColor(item.matchRate) }}>{item.matchRate}%</div>
              <div className="text-xs" style={{ color: getMatchColor(item.matchRate) }}>{getMatchLabel(item.matchRate)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MatchResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const matchFromState = (location.state as any)?.match;
  const analysis = matchFromState?.analysis || demoMatchAnalysis;
  const userA = matchFromState?.userA || demoUserA;
  const userB = matchFromState?.userB || demoUserB;
  const { overallScore, matchLevel } = matchFromState || { overallScore: 0, matchLevel: '较好匹配' };

  // 构建拓扑图数据
  const topologyItems: TopologyItem[] = (analysis?.dimensionMatches || demoMatchAnalysis.dimensionMatches || []).map((m: any) => ({
    dimensionId: m.dimensionId,
    emoji: m.emoji,
    label: m.label,
    userScore: m.userScore,
    targetScore: String(m.targetScore),
    matchLevel: m.matchLevel,
    analysis: m.analysis,
    matchRate: m.matchLevel === 'high' ? 75 + Math.round(Math.random() * 20)
      : m.matchLevel === 'medium' ? 50 + Math.round(Math.random() * 20)
      : 25 + Math.round(Math.random() * 20),
  }));

  // 预演总结数据
  const summaryData = {
    overall: {
      verdict: overallScore >= 80 ? '灵魂伴侣级' : overallScore >= 65 ? '较好匹配型' : '需要磨合型',
      summary: overallScore >= 80
        ? `你们在核心维度上高度共振！这是一段难得的关系。双方在价值观和生活态度上有很强的共鸣，AI预演显示你们最可能成为彼此「对的人」。虽然小分歧在所难免，但你们的共同价值层足够稳固，能让关系在经历波折后依然回到正轨。`
        : overallScore >= 65
        ? `你们整体契合度不错，有进一步接触的价值。AI预演显示：你们的主要契合点在沟通和情感需求层，但在冲突处理模式上需要提前建立默契。建议把「冲突预演层」的预警当作你们的第一课。`
        : `AI预演显示你们需要更多的理解和包容。这不是坏事——任何关系都需要经营。你们的挑战主要在沟通频率和决策方式上，但只要双方愿意投入，这些差异反而可以成为互补的优势。`,
      suggestion: overallScore >= 65
        ? '建议：直接开始聊天，从一个小话题开始。你们的契合层已经足够支撑一次愉快的初次对话。'
        : '建议：先做一次完整的40题测评，了解彼此的底层需求，再决定是否进一步投入情感。',
    },
    strengths: topologyItems.filter(m => m.matchLevel === 'high').map(m => ({
      emoji: m.emoji, label: m.label, analysis: m.analysis, rate: m.matchRate
    })),
    challenges: topologyItems.filter(m => m.matchLevel === 'low').map(m => ({
      emoji: m.emoji, label: m.label, analysis: m.analysis, rate: m.matchRate
    })),
    neutral: topologyItems.filter(m => m.matchLevel === 'medium').map(m => ({
      emoji: m.emoji, label: m.label, analysis: m.analysis, rate: m.matchRate
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">← 返回</button>
          <div className="font-bold text-gray-800 flex items-center gap-2">🪞 镜遇预演报告</div>
          <button onClick={() => navigate('/report', { state: { match: matchFromState } })} className="text-indigo-600 font-semibold text-sm">完整版 →</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-3xl p-6 text-white mb-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10">
            <div className="text-xs text-white/60 mb-2">🪞 AI 关系预演引擎 · 镜遇</div>
            <h1 className="text-2xl font-black mb-1">关系预演报告</h1>
            <p className="text-white/70 text-sm mb-6">{userA?.name} × {userB?.name}</p>
            <div className="inline-flex items-center gap-4 bg-white/15 backdrop-blur rounded-2xl px-8 py-4">
              <div>
                <div className="text-4xl font-black">{overallScore || 0}</div>
                <div className="text-xs text-white/60">综合匹配分</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <div className="text-sm font-bold">{matchLevel || '较好匹配'}</div>
                <div className="text-xs text-white/60">匹配级别</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== 总：预演总结 ========== */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg">📋</div>
            <h2 className="text-lg font-bold text-gray-900">预演总结</h2>
            <span className="text-xs bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full font-semibold ml-auto">AI生成</span>
          </div>

          {/* 整体定性 */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-5 mb-5 border border-indigo-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-2xl font-black">
                {overallScore || 0}
              </div>
              <div>
                <div className="font-black text-indigo-900 text-lg">{summaryData.overall.verdict}</div>
                <div className="text-xs text-indigo-600 font-medium">关系类型判断</div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm mb-4">
              {summaryData.overall.summary}
            </p>
            <div className="bg-white/70 rounded-xl px-4 py-3 border border-indigo-100">
              <div className="text-xs font-semibold text-indigo-700 mb-1">💡 镜遇建议</div>
              <p className="text-sm text-indigo-800 leading-relaxed">{summaryData.overall.suggestion}</p>
            </div>
          </div>

          {/* 三栏：优势 / 中性 / 挑战 */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* 高度契合 */}
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-700">高度契合</span>
              </div>
              <div className="text-xs text-emerald-800 font-semibold mb-1">{summaryData.strengths.length}个维度</div>
              <div className="space-y-1.5">
                {summaryData.strengths.slice(0, 3).map(s => (
                  <div key={s.label} className="text-xs text-emerald-700 flex items-start gap-1">
                    <span>{s.emoji}</span>
                    <span className="leading-relaxed">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 基本一致 */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-amber-700">基本一致</span>
              </div>
              <div className="text-xs text-amber-800 font-semibold mb-1">{summaryData.neutral.length}个维度</div>
              <div className="space-y-1.5">
                {summaryData.neutral.slice(0, 3).map(s => (
                  <div key={s.label} className="text-xs text-amber-700 flex items-start gap-1">
                    <span>{s.emoji}</span>
                    <span className="leading-relaxed">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 需要磨合 */}
            <div className="bg-rose-50 rounded-xl p-3 border border-rose-100">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-rose-700">需要磨合</span>
              </div>
              <div className="text-xs text-rose-800 font-semibold mb-1">{summaryData.challenges.length}个维度</div>
              <div className="space-y-1.5">
                {summaryData.challenges.slice(0, 3).map(s => (
                  <div key={s.label} className="text-xs text-rose-700 flex items-start gap-1">
                    <span>{s.emoji}</span>
                    <span className="leading-relaxed">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 分维度一句话总结 */}
          <div className="space-y-2">
            {topologyItems.slice(0, 5).map(item => (
              <div key={item.dimensionId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-lg">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold" style={{ color: getMatchColor(item.matchRate) }}>{item.matchRate}%</div>
                  <div className="text-xs" style={{ color: getMatchColor(item.matchRate) }}>{getMatchLabel(item.matchRate)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========== 分：关系拓扑图 ========== */}
        <TopologyGraph items={topologyItems} />

        {/* User Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[userA, userB].map((user, i) => (
            <div key={user?.id || i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <img src={user?.avatar} alt={user?.name} className="w-14 h-14 rounded-full bg-gray-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 truncate">{user?.name}</div>
                <div className="text-xs text-gray-500 truncate">{user?.occupation}</div>
                <div className="text-xs text-gray-400">{user?.location}</div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full flex-shrink-0">{i === 0 ? '我' : 'TA'}</span>
            </div>
          ))}
        </div>

        {/* MiroFish CTA */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 shadow-lg text-white text-center mb-4">
          <div className="text-4xl mb-3">🧠</div>
          <h3 className="text-xl font-black mb-2">想看见更深的东西吗？</h3>
          <p className="text-white/80 text-sm leading-relaxed mb-6">
            事件推演 + 社交网络分析 + 综合结论<br />
            一次预演，给你一个完整的答案。
          </p>
          <button onClick={() => navigate('/simulation', { state: { match: matchFromState } })}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all">
            🧠 启动 MiroFish 统一预演 →
          </button>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">预演结论：{matchLevel || '较好匹配'}</h3>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            {(overallScore || 0) >= 70
              ? '你们有较好的匹配基础，建议可以进一步接触。AI 预演显示你们的共同价值层较稳固，可以尝试开始第一步。'
              : '建议在沟通中多关注差异点，耐心磨合。冲突预演层提示了几个需要注意的地方，提前知道能帮你们走得更顺。'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/chat', { state: { match: matchFromState } })}
              className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-200 transition-all">
              💬 开始建联聊天
            </button>
            <button onClick={() => navigate('/home')}
              className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              再匹配一位
            </button>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-gray-400 pb-8">
          <p>🪞 镜遇 · AI 关系预演引擎</p>
          <p className="mt-1">Powered by 多智能体 AI 预演技术 · Built by 发发 & 旺财</p>
        </footer>
      </main>
    </div>
  );
}
