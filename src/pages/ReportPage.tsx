import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { demoMatchAnalysis, demoUserA, demoUserB } from '../data/mockData';

export default function ReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const matchFromState = (location.state as any)?.match;
  const analysis = (matchFromState || {})?.analysis || demoMatchAnalysis;
  const userA = (matchFromState || {})?.userA || demoUserA;
  const userB = (matchFromState || {})?.userB || demoUserB;

  const dimTag = (level: string) => {
    if (level === 'high') return { label: '高度镜遇', color: '#10b981', bg: 'bg-emerald-50' };
    if (level === 'medium') return { label: '基本一致', color: '#f59e0b', bg: 'bg-amber-50' };
    return { label: '需要磨合', color: '#ef4444', bg: 'bg-rose-50' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/match-result', { state: { match: matchFromState } })} className="text-gray-400 hover:text-gray-600">← 返回</button>
          <div className="font-semibold text-gray-700">完整关系预演报告</div>
          <button className="text-indigo-500 font-medium text-sm">分享</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Cover */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4"><span className="text-2xl">⚡</span><span className="font-bold">镜遇.</span></div>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-2xl font-black mb-2">关系预演报告</h1>
                <p className="opacity-80 text-sm mb-4">{userA?.name || '用户A'} × {userB?.name || '用户B'}</p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-sm"><span>🔮</span><span>多智能体 AI 预演</span><span>·</span><span>2026年3月</span></div>
              </div>
              <div className="text-center">
                <div className="text-7xl font-black">{analysis?.overallScore || 0}</div>
                <div className="text-sm opacity-80 mt-1">综合匹配分</div>
                <div className="mt-2 inline-block px-4 py-1 rounded-full text-sm font-bold bg-white/20">{analysis?.matchLevel || '较好匹配'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 text-sm font-bold flex items-center justify-center">📋</span>执行摘要</h2>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5">
            <p className="text-gray-700 leading-relaxed text-sm">
              你们的综合匹配度为 <strong>{analysis?.overallScore || 0}分</strong>，属于「{analysis?.matchLevel || '较好匹配'}」级别。
              在{analysis?.dimensionMatches?.length || 9}个核心维度的评估中，双方在{analysis?.dimensionMatches?.filter((m: any) => m.matchLevel === 'high').length || 0}个维度上高度镜遇。
            </p>
          </div>
        </div>

        {/* User Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {[userA, userB].map((user, i) => (
            <div key={user?.id || i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt={user?.name} className="w-16 h-16 rounded-full bg-gray-100" />
                <div className="flex-1">
                  <div className="font-bold text-lg">{user?.name || `用户${i + 1}`}</div>
                  <div className="text-sm text-gray-500">{user?.age || 26}岁 · {user?.occupation || '未知'}</div>
                  <div className="text-xs text-gray-400">{user?.location || '未知'}</div>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">{i === 0 ? '你' : '对方'}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{user?.bio || '暂无简介'}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-violet-50 text-violet-600 rounded-full">{user?.attachment || '安全型'}</span>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{user?.communicationStyle || '直接坦诚型'}</span>
                <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">{user?.relationshipExpectation || '认真交往'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dimension Details */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><span className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 text-sm font-bold flex items-center justify-center">📊</span>九维度匹配分析</h2>
          <div className="space-y-5">
            {(analysis?.dimensionMatches || []).map((m: any) => {
              const tag = dimTag(m.matchLevel);
              return (
                <div key={m.dimensionId} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2"><span className="text-xl">{m.emoji}</span><span className="font-semibold text-gray-800">{m.label}</span></div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-3 text-center">
                        <div><div className="text-sm font-bold text-indigo-600">{m.userScore}</div><div className="text-xs text-gray-400">你的</div></div>
                        <div><div className="text-sm font-bold text-rose-600">{m.targetScore}</div><div className="text-xs text-gray-400">对方</div></div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${tag.bg}`} style={{ color: tag.color }}>{tag.label}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2"><div className="h-full bg-indigo-200 rounded-full" style={{ width: `${m.userScore}%` }} /></div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3"><div className="h-full rounded-full" style={{ width: `${m.targetScore}%`, backgroundColor: m.color, opacity: 0.6 }} /></div>
                  <p className="text-xs text-gray-500 leading-relaxed">{m.analysis}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <button onClick={() => navigate('/chat', { state: { match: matchFromState } })} className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-200 transition-all">💬 开始建联聊天</button>
          <button onClick={() => navigate('/')} className="flex-1 py-4 border border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">匹配新人</button>
        </div>

        <footer className="text-center text-xs text-gray-400 pb-8">
          <p>本报告由「镜遇」关系预演引擎基于 AI 多智能体技术生成</p>
          <p className="mt-1">Built by 发发 & 旺财 · 2026年3月</p>
        </footer>
      </main>
    </div>
  );
}
