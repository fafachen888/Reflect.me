/**
 * NetworkSimulationPage — Level 2: 社交网络预演引擎
 * 模拟两个社交圈对关系的真实反应
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { demoUserA, demoUserB } from '../data/mockData';

const BACKEND_URL = 'http://localhost:3001';

// ============================================================
// 场景定义
// ============================================================
const NETWORK_SCENARIOS = [
  {
    id: 'confession',
    emoji: '💕',
    name: '表白前夜',
    description: '主角纠结要不要表白，想听听朋友们的意见',
    prompt: '主角想向对方表白，正在纠结时机和方式',
  },
  {
    id: 'first_fight',
    emoji: '⚡',
    name: '第一次争吵',
    description: '两人发生了第一次激烈争吵，朋友们的反应是...',
    prompt: '两人因为某件事发生了第一次争吵',
  },
  {
    id: 'long_distance',
    emoji: '✈️',
    name: '异地抉择',
    description: '一方要调去其他城市，是否要继续这段关系...',
    prompt: '一方因为工作原因要开始异地恋',
  },
  {
    id: 'meeting_parents',
    emoji: '👨‍👩‍👧',
    name: '见家长',
    description: '第一次带对象见家长，双方父母会有什么反应...',
    prompt: '第一次带对方见家长',
  },
  {
    id: 'jealousy',
    emoji: '😔',
    name: '发现暧昧',
    description: '发现对方和前任还有联系，感到不安和吃醋',
    prompt: '发现对方和前任还有联系，感到不安',
  },
  {
    id: 'ring_talk',
    emoji: '💍',
    name: '谈论结婚',
    description: '关系稳定后，认真讨论结婚这件事',
    prompt: '两人认真讨论结婚这件事',
  },
];

// ============================================================
// 角色图标
// ============================================================
function RoleIcon({ role, size = 32 }: { role: string; size?: number }) {
  const icons: Record<string, string> = {
    bestFriend: '👯',
    roommate: '🏠',
    colleague: '💼',
    parent: '👨‍👩‍👧',
    ex: '💔',
    mutual: '🔗',
  };
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5, flexShrink: 0,
    }}>
      {icons[role] || '👤'}
    </div>
  );
}

// ============================================================
// 影响力徽章
// ============================================================
function InfluenceBadge({ influence }: { influence: number }) {
  const color = influence >= 8 ? '#ef4444' : influence >= 5 ? '#f59e0b' : '#6b7280';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      background: `${color}15`, color, borderRadius: 999,
      padding: '2px 8px', fontSize: '0.65rem', fontWeight: 700,
    }}>
      影响力 {influence}
    </div>
  );
}

// ============================================================
// 态度标签
// ============================================================
function AttitudeBadge({ attitude }: { attitude: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    supportive: { label: '支持', color: '#059669', bg: '#ecfdf5' },
    cautious: { label: '谨慎', color: '#d97706', bg: '#fffbeb' },
    negative: { label: '担忧', color: '#dc2626', bg: '#fff1f2' },
    chaotic: { label: '吃瓜', color: '#7c3aed', bg: '#f5f3ff' },
  };
  const style = map[attitude] || map.cautious;
  return (
    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: style.color, background: style.bg, padding: '2px 6px', borderRadius: 999 }}>
      {style.label}
    </span>
  );
}

// ============================================================
// 情感极性颜色
// ============================================================
function sentimentColor(sentiment: number): string {
  if (sentiment > 0.4) return '#059669';
  if (sentiment > 0) return '#10b981';
  if (sentiment > -0.4) return '#d97706';
  return '#dc2626';
}

// ============================================================
// 主组件
// ============================================================
export default function NetworkSimulationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const matchData = (location.state as any)?.match || {};
  const userA = matchData?.userA || demoUserA;
  const userB = matchData?.userB || demoUserB;

  type Phase = 'idle' | 'loading' | 'done' | 'error';
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loadingStep, setLoadingStep] = useState('');

  // ============================================================
  // 运行模拟
  // ============================================================
  const runSimulation = async (scenario: any) => {
    setSelectedScenario(scenario);
    setPhase('loading');
    setError('');
    setResult(null);

    setLoadingStep('正在构建社交图谱...');
    await delay(500);

    setLoadingStep(`正在分析${userA.name}的社交圈...`);
    await delay(400);

    setLoadingStep(`正在分析${userB.name}的社交圈...`);
    await delay(400);

    setLoadingStep('正在模拟信息传播...');
    await delay(600);

    setLoadingStep('正在计算涌现结果...');

    try {
      const resp = await fetch(`${BACKEND_URL}/api/network/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userA, userB,
          event: { type: scenario.id, description: scenario.prompt },
        }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || `HTTP ${resp.status}`);
      }

      const data = await resp.json();
      setResult(data);
      setPhase('done');
    } catch (e: any) {
      // Fallback to frontend-only simulation
      setLoadingStep('正在生成模拟结果...');
      const mockResult = generateMockResult(scenario);
      setResult(mockResult);
      setPhase('done');
    }
  };

  // ============================================================
  // Mock 结果（当后端未启动时）
  // ============================================================
  function generateMockResult(scenario: any) {
    const charsA = [
      { charId: 'A-1', charName: '最好的朋友', role: 'bestFriend', reaction: '我是了解你的，你确定想清楚了吗？不过你喜欢就好，我支持你！', influence: 9, attitude: 'supportive', circle: 'A' },
      { charId: 'A-2', charName: '老友', role: 'bestFriend', reaction: '哇！终于开窍了？之前追人家那么久，加油加油！', influence: 6, attitude: 'supportive', circle: 'A' },
      { charId: 'A-3', charName: '室友', role: 'roommate', reaction: '感觉还行吧，不过你确定了解他吗？先别急，再看看。', influence: 7, attitude: 'cautious', circle: 'A' },
      { charId: 'A-4', charName: '同事', role: 'colleague', reaction: '听说过这个人，看起来条件不错，加油！', influence: 4, attitude: 'supportive', circle: 'A' },
      { charId: 'A-5', charName: '妈妈', role: 'parent', reaction: '婚姻大事要考虑清楚，两个人合不合适最重要。', influence: 8, attitude: 'cautious', circle: 'A' },
    ];
    const charsB = [
      { charId: 'B-1', charName: '好闺蜜', role: 'bestFriend', reaction: '这个女孩看起来挺真诚的，可以接触看看，别太封闭自己。', influence: 8, attitude: 'supportive', circle: 'B' },
      { charId: 'B-2', charName: '老同学', role: 'bestFriend', reaction: '刚分手没多久，不用着急吧，先缓缓？', influence: 5, attitude: 'cautious', circle: 'B' },
      { charId: 'B-3', charName: '同事', role: 'colleague', reaction: '听说过这个人，好像挺靠谱的，不过还是了解清楚再说。', influence: 4, attitude: 'cautious', circle: 'B' },
      { charId: 'B-4', charName: '妈妈', role: 'parent', reaction: '希望你找个踏实的，人品最重要，其他的慢慢来。', influence: 8, attitude: 'cautious', circle: 'B' },
    ];
    const crossCircle = [
      { charId: 'bridge', charName: '共同好友小李', type: 'cross_circle_bridge', reaction: '我认识他们俩，感觉挺合适的，不过这种事还是看他们自己，我帮你们说好话就行了！', role: 'mutual' },
    ];
    return {
      networkA: { name: userA.name, characters: charsA, reactions: charsA },
      networkB: { name: userB.name, characters: charsB, reactions: charsB },
      crossCircle,
      emergence: {
        probability: 68,
        sentimentA: 0.42,
        sentimentB: 0.28,
        overallSentiment: 0.35,
        topInfluentialA: { name: '最好的朋友', attitude: 'supportive' },
        topInfluentialB: { name: '好闺蜜', attitude: 'supportive' },
        risks: ['B圈因为刚分手，持谨慎态度，需要用行动证明'],
        keyFindings: ['A圈整体偏乐观，B圈需要更多时间', '妈妈的意见在两边都有重要影响'],
        summary: 'A圈比B圈更乐观，建议A在关系中多一些耐心，让B慢慢建立信任。',
      },
    };
  }

  const restart = () => { setPhase('idle'); setResult(null); setSelectedScenario(null); };

  // ============================================================
  // 渲染
  // ============================================================
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/match-result', { state: { match: matchData } })} style={{ color: '#6b7280', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>← 返回</button>
          <div style={{ fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: 6 }}>🧠 社交网络预演</div>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', background: '#f3f4f6', padding: '2px 8px', borderRadius: 999 }}>Level 2</div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '1.5rem 1rem' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #1f2937, #374151)', borderRadius: 16, padding: '1.5rem', color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🕸️</div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>社交网络预演引擎</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            不是预测两个人的关系，而是预测<strong style={{ color: 'white' }}>两群人</strong>对这段关系的反应
          </p>
        </div>

        {/* IDLE */}
        {phase === 'idle' && (
          <div>
            <div style={{ background: 'white', borderRadius: 16, padding: '1.25rem', border: '1px solid #f3f4f6', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>👤A</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#111827' }}>{userA.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{userA.occupation} · {userA.location}</div>
                </div>
                <div style={{ color: '#9ca3af', fontSize: '1.5rem' }}>💕</div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>👤B</div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#111827' }}>{userB.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{userB.occupation} · {userB.location}</div>
                </div>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.8rem', textAlign: 'center' }}>
                将分析 {userA.name} 和 {userB.name} 各自的社交圈
              </p>
            </div>

            <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '1rem', fontSize: '1rem' }}>🎭 选择预演场景</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {NETWORK_SCENARIOS.map(s => (
                <button key={s.id} onClick={() => runSimulation(s)}
                  style={{ background: 'white', borderRadius: 14, padding: '1rem', border: '1px solid #f3f4f6', cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = '#d1d5db'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = '#f3f4f6'; }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.emoji}</div>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.875rem', marginBottom: 4 }}>{s.name}</div>
                  <div style={{ color: '#9ca3af', fontSize: '0.75rem', lineHeight: 1.4 }}>{s.description}</div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fffbeb', borderRadius: 12, border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600, marginBottom: 4 }}>💡 什么是社交网络预演？</div>
              <p style={{ color: '#92400e', fontSize: '0.8rem', lineHeight: 1.6 }}>
                分析两个人的社交圈（朋友、家人、同事），模拟当这段关系发展时，周围人会是什么反应、会有什么态度差异、关系会面临什么样的社会压力。
              </p>
            </div>
          </div>
        )}

        {/* LOADING */}
        {phase === 'loading' && (
          <div style={{ background: 'white', borderRadius: 16, padding: '3rem 2rem', textAlign: 'center', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 56, height: 56, border: '4px solid #e5e7eb', borderTopColor: '#1f2937', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem' }} />
            <div style={{ fontWeight: 700, color: '#111827', fontSize: '1.1rem', marginBottom: '0.5rem' }}>🕸️ 正在构建社交图谱...</div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{loadingStep}</p>
            <div style={{ height: 4, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#1f2937', borderRadius: 999, animation: 'loadbar 2s ease-in-out infinite' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1.5rem' }}>
              {[
                { label: userA.name + '的圈子', sub: '朋友·家人·同事' },
                { label: '信息传播', sub: '共同好友桥梁' },
                { label: userB.name + '的圈子', sub: '朋友·家人·同事' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f3f4f6', margin: '0 auto 8px', animation: `pulse ${1+i*0.3}s ease-in-out infinite` }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{s.label}</div>
                  <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes loadbar{0%,100%{width:10%}50%{width:80%}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
          </div>
        )}

        {/* DONE */}
        {phase === 'done' && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* 概览卡片 */}
            <div style={{ background: 'linear-gradient(135deg, #1f2937, #374151)', borderRadius: 16, padding: '1.25rem', color: 'white' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>🧠 社交网络预演报告 · {selectedScenario?.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                当「{selectedScenario?.description}」，两群人分别会怎么反应？
              </div>

              {/* 概率条 */}
              {result.emergence && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>社会支持度</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800 }}>{result.emergence.probability}%</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${result.emergence.probability}%`, background: result.emergence.probability >= 60 ? '#34d399' : result.emergence.probability >= 40 ? '#fbbf24' : '#f87171', borderRadius: 999, transition: 'width 1s ease-out' }} />
                  </div>
                </div>
              )}
            </div>

            {/* 两圈对比 */}
            {result.networkA && result.networkB && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {/* A圈 */}
                <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                  <div style={{ padding: '0.75rem 1rem', background: '#eff6ff', borderBottom: '1px solid #e0e7ff' }}>
                    <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.875rem' }}>{result.networkA.name}的圈子</div>
                    <div style={{ fontSize: '0.7rem', color: '#60a5fa' }}>
                      {result.networkA.reactions?.length || 0}人 · 社会态度：
                      <span style={{ color: sentimentColor(result.emergence?.sentimentA || 0), fontWeight: 700 }}>
                        {((result.emergence?.sentimentA || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {(result.networkA.reactions || []).slice(0, 5).map((r: any) => (
                      <div key={r.charId} style={{ background: '#f8fafc', borderRadius: 10, padding: '0.6rem 0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <RoleIcon role={r.role} size={24} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{r.charName}</span>
                          </div>
                          <InfluenceBadge influence={r.influence} />
                        </div>
                        <p style={{ fontSize: '0.7rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>"{r.reaction}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* B圈 */}
                <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                  <div style={{ padding: '0.75rem 1rem', background: '#f5f3ff', borderBottom: '1px solid #ede9fe' }}>
                    <div style={{ fontWeight: 700, color: '#6d28d9', fontSize: '0.875rem' }}>{result.networkB.name}的圈子</div>
                    <div style={{ fontSize: '0.7rem', color: '#a78bfa' }}>
                      {result.networkB.reactions?.length || 0}人 · 社会态度：
                      <span style={{ color: sentimentColor(result.emergence?.sentimentB || 0), fontWeight: 700 }}>
                        {((result.emergence?.sentimentB || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {(result.networkB.reactions || []).slice(0, 5).map((r: any) => (
                      <div key={r.charId} style={{ background: '#f8fafc', borderRadius: 10, padding: '0.6rem 0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <RoleIcon role={r.role} size={24} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{r.charName}</span>
                          </div>
                          <InfluenceBadge influence={r.influence} />
                        </div>
                        <p style={{ fontSize: '0.7rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>"{r.reaction}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 关键人物 */}
            {result.emergence?.topInfluentialA && result.emergence?.topInfluentialB && (
              <div style={{ background: 'white', borderRadius: 14, padding: '1.25rem', border: '1px solid #f3f4f6' }}>
                <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.75rem', fontSize: '0.875rem' }}>👑 关键人物分析</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ background: '#eff6ff', borderRadius: 10, padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#60a5fa', marginBottom: 4 }}>{result.emergence.topInfluentialA.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 600 }}>
                      {result.emergence.topInfluentialA.attitude === 'supportive' ? '✅ 持支持态度' : result.emergence.topInfluentialA.attitude === 'cautious' ? '⚠️ 持谨慎态度' : '⚠️ 有担忧'}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#3b82f6', margin: '4px 0 0' }}>{result.networkA.name}的圈子中高影响力人物</p>
                  </div>
                  <div style={{ background: '#f5f3ff', borderRadius: 10, padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#a78bfa', marginBottom: 4 }}>{result.emergence.topInfluentialB.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6d28d9', fontWeight: 600 }}>
                      {result.emergence.topInfluentialB.attitude === 'supportive' ? '✅ 持支持态度' : result.emergence.topInfluentialB.attitude === 'cautious' ? '⚠️ 持谨慎态度' : '⚠️ 有担忧'}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#7c3aed', margin: '4px 0 0' }}>{result.networkB.name}的圈子中高影响力人物</p>
                  </div>
                </div>
              </div>
            )}

            {/* 跨圈信息 */}
            {result.crossCircle && result.crossCircle.length > 0 && (
              <div style={{ background: '#fffbeb', borderRadius: 14, padding: '1.25rem', border: '1px solid #fde68a' }}>
                <div style={{ fontWeight: 700, color: '#d97706', marginBottom: '0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  🔗 共同好友视角（两个圈子的信息桥梁）
                </div>
                {result.crossCircle.map((c: any, i: number) => (
                  <div key={i} style={{ background: 'white', borderRadius: 10, padding: '0.75rem', border: '1px solid #fef3c7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <RoleIcon role={c.role || 'mutual'} size={28} />
                      <span style={{ fontWeight: 600, color: '#92400e', fontSize: '0.8rem' }}>{c.charName}</span>
                      <span style={{ fontSize: '0.65rem', color: '#d97706', background: '#fef3c7', padding: '1px 6px', borderRadius: 999 }}>中间人</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#78350f', lineHeight: 1.6, margin: 0 }}>"{c.reaction}"</p>
                  </div>
                ))}
              </div>
            )}

            {/* 涌现结果 */}
            {result.emergence && (
              <div style={{ background: 'white', borderRadius: 14, padding: '1.25rem', border: '1px solid #f3f4f6' }}>
                <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.75rem', fontSize: '0.875rem' }}>🔮 涌现分析</div>

                {result.emergence.summary && (
                  <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1rem', padding: '0.75rem', background: '#f9fafb', borderRadius: 10 }}>{result.emergence.summary}</p>
                )}

                {result.emergence.keyFindings && result.emergence.keyFindings.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>💡 关键发现</div>
                    {result.emergence.keyFindings.map((f: string, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#e0e7ff', color: '#6366f1', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                        <span style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.6 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                {result.emergence.risks && result.emergence.risks.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>⚠️ 潜在风险</div>
                    {result.emergence.risks.map((r: string, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>!</div>
                        <span style={{ fontSize: '0.8rem', color: '#7f1d1d', lineHeight: 1.6 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 态度对比条 */}
            {result.emergence && (
              <div style={{ background: 'white', borderRadius: 14, padding: '1.25rem', border: '1px solid #f3f4f6' }}>
                <div style={{ fontWeight: 700, color: '#111827', marginBottom: '1rem', fontSize: '0.875rem' }}>📊 两圈态度对比</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1d4ed8' }}>{result.networkA?.name}的圈子</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: sentimentColor(result.emergence.sentimentA) }}>{((result.emergence.sentimentA || 0) * 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ height: 10, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.abs(result.emergence.sentimentA) * 100}%`, background: sentimentColor(result.emergence.sentimentA), borderRadius: 999 }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6d28d9' }}>{result.networkB?.name}的圈子</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: sentimentColor(result.emergence.sentimentB) }}>{((result.emergence.sentimentB || 0) * 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ height: 10, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.abs(result.emergence.sentimentB) * 100}%`, background: sentimentColor(result.emergence.sentimentB), borderRadius: 999 }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', paddingTop: '0.25rem' }}>
                    差异：<span style={{ fontWeight: 700, color: Math.abs((result.emergence.sentimentA || 0) - (result.emergence.sentimentB || 0)) > 0.3 ? '#d97706' : '#059669' }}>
                      {Math.abs(((result.emergence.sentimentA || 0) - (result.emergence.sentimentB || 0)) * 100).toFixed(0)}%
                    </span>
                    {Math.abs((result.emergence.sentimentA || 0) - (result.emergence.sentimentB || 0)) > 0.3 ? '（差异较大，需要注意平衡）' : '（态度相近）'}
                  </div>
                </div>
              </div>
            )}

            {/* 底部操作 */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={restart} style={{ flex: 1, padding: '1rem', border: '2px solid #e5e7eb', borderRadius: 12, fontWeight: 600, color: '#374151', background: 'white', cursor: 'pointer', fontSize: '0.875rem' }}>← 换个场景</button>
              <button onClick={() => navigate('/simulation', { state: { match: matchData } })} style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>🧠 事件推演</button>
            </div>
          </div>
        )}

        {/* ERROR */}
        {phase === 'error' && (
          <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
            <p style={{ color: '#e11d48', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
            <button onClick={restart} style={{ color: '#9f1239', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>← 返回重试</button>
          </div>
        )}

        <div style={{ textAlign: 'center', padding: '2rem 0 1rem', color: '#9ca3af', fontSize: '0.75rem' }}>
          <p>🕸️ MiroFish Level 2 · 社交网络预演</p>
          <p style={{ marginTop: 4 }}>Built by 发发 & 旺财</p>
        </div>
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
