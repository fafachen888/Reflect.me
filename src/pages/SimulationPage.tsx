/**
 * SimulationPage — 统一预演中心 v3
 * 融合事件预演 + 社交网络预演，一次预演给出全方位结论
 * 前端直连 Kimi API，无需后端
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SCENARIOS } from '../data/sceneData';
import { demoUserA, demoUserB } from '../data/mockData';

const KIMI_API_KEY = 'sk-DgSdBiuxyL3GoJwl9CYxeYO7pcP4UNanTvoM1do5QSbQuElf';
const KIMI_API_BASE = 'https://api.moonshot.cn/v1';

// ============================================================
// Kimi API
// ============================================================
async function callKimi(prompt: string): Promise<string> {
  const resp = await fetch(`${KIMI_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KIMI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'moonshot-v1-8k', messages: [{ role: 'user', content: prompt }], temperature: 0.8, max_tokens: 3500 }),
  });
  if (!resp.ok) throw new Error(`API错误 ${resp.status}`);
  const data = await resp.json();
  return data?.choices?.[0]?.message?.content || '';
}

function parseJSON(str: string): any {
  try {
    const m = str.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : null;
  } catch { return null; }
}

// ============================================================
// 工具函数
// ============================================================
function buildPersonalityDesc(user: any): string {
  const traitMap: Record<string, number> = {};
  (user.personality || []).forEach((t: any) => { traitMap[t.name] = t.value || 50; });
  const extra = traitMap['外向性'] || 50;
  const agree = traitMap['宜人性'] || 60;
  const open = traitMap['开放性'] || 60;
  const parts: string[] = [];
  if (extra > 65) parts.push('非常外向开朗，喜欢社交');
  else if (extra < 35) parts.push('偏内向，享受独处');
  if (agree > 70) parts.push('高同理心，善于理解他人');
  else if (agree < 45) parts.push('理性直接，不轻易妥协');
  if (open > 65) parts.push('思维开放，喜欢探索新事物');
  return parts.join('，') || '性格稳重有同理心';
}

function buildCommunicationDesc(user: any): string {
  const map: Record<string, string> = {
    '直接坦诚型': '直接表达观点，语速快，观点鲜明',
    '感性与理性交替型': '时而感性时而理性，根据话题切换',
    '委婉含蓄型': '用暗示传信息，情绪激动时选择沉默',
    '幽默调侃型': '用幽默化解尴尬，忍不住开玩笑',
    '沉默内敛型': '话不多，关键时刻才说重要的话',
  };
  return map[user.communicationStyle] || '直接坦诚型';
}

// ============================================================
// Kimi Prompts
// ============================================================

// 事件推演 Prompt
function buildEventPrompt(userA: any, userB: any, scenario: any): string {
  return `你是"镜遇"MiroFish引擎，名字叫小镜。请严格按JSON格式生成，不要有任何其他文字：

{
  "title": "推演事件标题（20字）",
  "summary": "一句话概括（30字）",
  "startingPoint": "事件如何开始（80字）",
  "keyEvents": [
    {"phase":"第1个关键时刻：事件名称","situation":"具体情况（100字）","stanceA":"A的立场（60字）","stanceB":"B的立场（60字）","emotionA":"A情绪（10字）","emotionB":"B情绪（10字）","risk":"风险点（60字）"},
    {"phase":"关键选择点：核心分歧","situation":"最核心矛盾（120字）","stanceA":"A坚持什么（60字）","stanceB":"B坚持什么（60字）","emotionA":"A底层情绪（10字）","emotionB":"B底层情绪（10字）","risk":"最坏结果（60字）"},
    {"phase":"关键选择点：妥协或僵局","situation":"双方如何应对（100字）","stanceA":"A的选择（60字）","stanceB":"B的选择（60字）","emotionA":"A感受（10字）","emotionB":"B感受（10字）","risk":"隐患（60字）"},
    {"phase":"结局走向：结果呈现","situation":"最终结果（120字）","stanceA":"A最终状态（60字）","stanceB":"B最终状态（60字）","emotionA":"A最终情绪（10字）","emotionB":"B最终情绪（10字）"}
  ],
  "prediction":{"outcome":"长期预测（20字）","probability":75,"successReason":"成功原因（60字）","failureReason":"最大隐患（60字）","riskPoints":["风险1","风险2","风险3"],"warning":"预警（30字）"},
  "advice":"具体沟通建议（100字，要有操作性）",
  "redFlag":"最严重隐患（30字）"
}

## 用户A：${userA.name}，${userA.age}岁，${userA.occupation}
性格：${buildPersonalityDesc(userA)}
沟通风格：${buildCommunicationDesc(userA)}
依恋类型：${userA.attachment || '安全型'}
关系期望：${userA.relationshipExpectation || '认真交往'}

## 用户B：${userB.name}，${userB.age}岁，${userB.occupation}
性格：${buildPersonalityDesc(userB)}
沟通风格：${buildCommunicationDesc(userB)}
依恋类型：${userB.attachment || '安全型'}
关系期望：${userB.relationshipExpectation || '认真交往'}

## 场景：${scenario.name}
${scenario.background}`;
}

// 社交网络推演 Prompt（核心改进版）
function buildNetworkPrompt(userA: any, userB: any, scenario: any): string {
  return `你是"镜遇"社交网络预演引擎，名字叫小镜。
请严格按JSON格式输出，不要有任何其他文字：

{
  "circleA": {
    "name": "${userA.name}的圈子",
    "reactions": [
      {"charName":"最好的朋友","role":"bestFriend","influence":9,"attitude":"supportive","reaction":"（具体反应，30-60字，符合角色性格和立场）"},
      {"charName":"老友","role":"bestFriend","influence":6,"attitude":"supportive","reaction":"（具体反应，30-60字）"},
      {"charName":"室友","role":"roommate","influence":7,"attitude":"cautious","reaction":"（具体反应，30-60字）"},
      {"charName":"同事","role":"colleague","influence":4,"attitude":"chaotic","reaction":"（具体反应，30-60字）"},
      {"charName":"${userA.name === '林小晴' ? '妈妈' : '妈妈或哥哥'}","role":"parent","influence":8,"attitude":"cautious","reaction":"（具体反应，30-60字）"}
    ]
  },
  "circleB": {
    "name": "${userB.name}的圈子",
    "reactions": [
      {"charName":"好闺蜜","role":"bestFriend","influence":8,"attitude":"supportive","reaction":"（具体反应，30-60字，符合角色性格）"},
      {"charName":"老同学","role":"bestFriend","influence":5,"attitude":"cautious","reaction":"（具体反应，30-60字）"},
      {"charName":"同事","role":"colleague","influence":4,"attitude":"cautious","reaction":"（具体反应，30-60字）"},
      {"charName":"${userB.name === '陈思远' ? '妈妈' : '妈妈或姐姐'}","role":"parent","influence":8,"attitude":"cautious","reaction":"（具体反应，30-60字）"}
    ]
  },
  "crossCircle": {
    "charName":"共同好友小李",
    "reaction":"（体现两难处境，40-100字）"
  },
  "emergence": {
    "probability":75,
    "sentimentA":0.5,
    "sentimentB":0.35,
    "summary":"（综合分析，80-120字）",
    "keyFindings":["关键发现1（30字）","关键发现2（30字）"],
    "risks":["风险1（30字）","风险2（30字）"]
  }
}

【背景】
当${scenario.description}时，${userA.name}和${userB.name}的社交圈会分别有什么反应？

【${userA.name}的圈子构成】
- 最好的朋友：和${userA.name}认识最久，最了解${userA.name}
- 老友：一起玩了很多年的朋友，性格相近
- 室友：和${userA.name}日常相处多，能看到${userA.name}在家最真实的样子
- 同事：对${userA.name}的私生活了解有限，可能有八卦
- 父母：对${userA.name}的婚恋态度有重要影响

【${userB.name}的圈子构成】
- 好闺蜜/老友：和${userB.name}关系密切，有感情经验
- 同事/同学：旁观者视角
- 父母：意见重要

【重要规则】
1. 每条reaction必须是30-60字的具体内容，不能是模板废话
2. 角色之间的reaction要有明显差异
3. A圈和B圈的反应要符合各自圈子的特点
4. attitude: "supportive"=支持 | "cautious"=谨慎 | "negative"=担忧 | "chaotic"=吃瓜
5. influence: 1-10，影响力越高的人越重要
6. emergence.sentimentA/B: -1到1之间，负数表示整体偏担忧/负面
7. 共同好友的反应要体现"两边都认识"的两难处境
8. 直接输出JSON，不要markdown代码块`;
}

// 统一结论 Prompt
function buildUnifiedConclusionPrompt(userA: any, userB: any, eventResult: any, networkResult: any): string {
  return `你是"镜遇"MiroFish引擎，名字叫小镜。

【你的任务】综合事件推演和社交网络分析，给出一段关系的最终结论和建议。

【用户A】${userA.name}，${userA.age}岁，${userA.occupation}
【用户B】${userB.name}，${userB.age}岁，${userB.occupation}

【事件推演结论】
- 预测概率：${eventResult?.prediction?.probability || '?'}%
- 最大隐患：${eventResult?.redFlag || '未知'}
- 建议：${eventResult?.advice || '未知'}

【社交网络分析】
- 社会支持度：${networkResult?.emergence?.probability || '?'}%
- A圈态度：${networkResult?.emergence?.sentimentA > 0.3 ? '偏支持' : networkResult?.emergence?.sentimentA > 0 ? '中立偏支持' : '偏谨慎或担忧'}
- B圈态度：${networkResult?.emergence?.sentimentB > 0.3 ? '偏支持' : networkResult?.emergence?.sentimentB > 0 ? '中立偏支持' : '偏谨慎或担忧'}
- 关键发现：${(networkResult?.emergence?.keyFindings || []).join('；') || '未知'}

请生成最终的统一结论，格式：
{
  "verdict": "判决词（20字以内，如：需要磨合但有潜力）",
  "verdictLabel": "乐观|谨慎乐观|高风险|需要努力",
  "summary": "综合分析（150字以内，结合事件和社交两个维度）",
  "topAdvice": "最重要的一条建议（30字以内，要有可操作性）",
  "riskSignal": "最需要警惕的一个信号（30字以内）",
  "confidence": "小镜对这个结论的信心程度（0-100整数）",
  "timeline": "关系发展的预期节奏（50字以内）"
}

直接输出JSON，不要任何其他文字`;
}

// ============================================================
// 样式
// ============================================================
function probStyle(pb: number) {
  if (pb >= 75) return { bar: '#34d399', badge: 'bg-emerald-100 text-emerald-700', label: '乐观' };
  if (pb >= 55) return { bar: '#fbbf24', badge: 'bg-amber-100 text-amber-700', label: '谨慎乐观' };
  return { bar: '#f87171', badge: 'bg-rose-100 text-rose-700', label: '高风险' };
}

function sentimentColor(s: number) {
  if (s > 0.3) return '#059669';
  if (s > 0) return '#10b981';
  if (s > -0.3) return '#d97706';
  return '#dc2626';
}

function attitudeLabel(a: string) {
  const m: Record<string, string> = { supportive: '支持', cautious: '谨慎', negative: '担忧', chaotic: '吃瓜' };
  return m[a] || a;
}

function attitudeColor(a: string) {
  const m: Record<string, string> = { supportive: '#059669', cautious: '#d97706', negative: '#dc2626', chaotic: '#7c3aed' };
  return m[a] || '#6b7280';
}

function attitudeBg(a: string) {
  const m: Record<string, string> = { supportive: '#ecfdf5', cautious: '#fffbeb', negative: '#fff1f2', chaotic: '#f5f3ff' };
  return m[a] || '#f9fafb';
}

// ============================================================
// 主组件
// ============================================================
export default function SimulationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const matchData = (location.state as any)?.match || {};
  const userA = matchData?.userA || demoUserA;
  const userB = matchData?.userB || demoUserB;

  type Phase = 'idle' | 'running-event' | 'running-network' | 'running-conclusion' | 'done' | 'error';
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState('');
  const [step, setStep] = useState(''); // 当前步骤描述
  const [eventResult, setEventResult] = useState<any>(null);
  const [networkResult, setNetworkResult] = useState<any>(null);
  const [conclusion, setConclusion] = useState<any>(null);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [customText, setCustomText] = useState('');
  const [showBoth, setShowBoth] = useState(false); // 是否同时展示两个结果

  // 预设场景（融合版）
  const scenarios = [...SCENARIOS].sort((x: any, y: any) => y.weight - x.weight).slice(0, 5);

  // 运行完整预演（事件 + 社交网络 + 统一结论）
  const runFullSimulation = async (scenario: any) => {
    setSelectedScenario(scenario);
    setEventResult(null);
    setNetworkResult(null);
    setConclusion(null);
    setError('');
    setShowBoth(false);

    try {
      // Step 1: 事件推演
      setPhase('running-event');
      setStep('正在生成事件推演...');
      const eventPrompt = buildEventPrompt(userA, userB, scenario);
      const eventContent = await callKimi(eventPrompt);
      const eventData = parseJSON(eventContent);
      if (!eventData) throw new Error('事件推演生成失败，请重试');
      setEventResult(eventData);

      // Step 2: 社交网络推演
      setPhase('running-network');
      setStep('正在分析社交网络反应...');
      const networkPrompt = buildNetworkPrompt(userA, userB, scenario);
      const networkContent = await callKimi(networkPrompt);
      const networkData = parseJSON(networkContent);
      if (!networkData) throw new Error('社交网络分析失败，请重试');
      setNetworkResult(networkData);

      // Step 3: 统一结论
      setPhase('running-conclusion');
      setStep('正在生成综合结论...');
      const conclusionPrompt = buildUnifiedConclusionPrompt(userA, userB, eventData, networkData);
      const conclusionContent = await callKimi(conclusionPrompt);
      const conclusionData = parseJSON(conclusionContent);
      if (!conclusionData) throw new Error('综合结论生成失败，请重试');
      setConclusion(conclusionData);

      setPhase('done');
    } catch (e: any) {
      setError(e.message || '预演失败，请重试');
      setPhase('error');
    }
  };

  const runCustomScenario = () => {
    if (!customText.trim()) { setError('请先输入场景描述'); return; }
    runFullSimulation({ id: 'custom', name: '自定义场景', description: customText.trim(), background: customText.trim(), emoji: '✨' });
  };

  const restart = () => {
    setPhase('idle'); setEventResult(null); setNetworkResult(null);
    setConclusion(null); setSelectedScenario(null); setError(''); setShowBoth(false);
  };

  // 统一结论的视觉样式
  const verdictStyle = (label: string) => {
    if (label === '乐观') return { bg: '#059669', text: 'white' };
    if (label === '谨慎乐观') return { bg: '#d97706', text: 'white' };
    if (label === '高风险') return { bg: '#dc2626', text: 'white' };
    return { bg: '#6b7280', text: 'white' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/match-result', { state: { match: matchData } })} style={{ color: '#6b7280', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>← 返回</button>
          <div style={{ fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: 6 }}>🧠 MiroFish 统一预演</div>
          <div style={{ width: 60 }} />
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '1.5rem 1rem' }}>

        {/* ===== IDLE ===== */}
        {phase === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 16, padding: '1.5rem', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧠</div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>MiroFish 统一预演引擎</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                同时运行<strong style={{ color: 'white' }}>事件推演</strong>和<strong style={{ color: 'white' }}>社交网络分析</strong><br />给你一个完整的、基于两个维度的综合结论
              </p>
            </div>

            {/* 说明 */}
            <div style={{ background: 'white', borderRadius: 14, padding: '1.25rem', border: '1px solid #f3f4f6' }}>
              <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.75rem', fontSize: '0.95rem' }}>🎯 一次预演，两重分析</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: '#eff6ff', borderRadius: 10, padding: '0.875rem' }}>
                  <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>⚡</div>
                  <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>事件推演</div>
                  <p style={{ color: '#3b82f6', fontSize: '0.75rem', lineHeight: 1.5 }}>AI模拟{userA.name}和{userB.name}在特定场景下会发生什么</p>
                </div>
                <div style={{ background: '#f5f3ff', borderRadius: 10, padding: '0.875rem' }}>
                  <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>🕸️</div>
                  <div style={{ fontWeight: 700, color: '#6d28d9', fontSize: '0.875rem', marginBottom: '0.25rem' }}>社交网络</div>
                  <p style={{ color: '#7c3aed', fontSize: '0.75rem', lineHeight: 1.5 }}>分析两个人的朋友圈对这段关系的反应</p>
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: 10, border: '1px solid #a7f3d0' }}>
                <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.8rem', marginBottom: '0.25rem' }}>🔮 统一综合结论</div>
                <p style={{ color: '#065f46', fontSize: '0.75rem', lineHeight: 1.5 }}>结合事件和社交两个维度，给出最终判决 + 可操作建议</p>
              </div>
            </div>

            {/* 场景选择 */}
            <div>
              <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.75rem', fontSize: '0.95rem' }}>🎭 选择预演场景</h2>
              {scenarios.map((s: any) => (
                <button key={s.id} onClick={() => runFullSimulation(s)}
                  style={{ width: '100%', background: 'white', borderRadius: 12, padding: '1rem', border: '1px solid #f3f4f6', marginBottom: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = '#c7d2fe'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = '#f3f4f6'; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{s.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#111827', marginBottom: 4 }}>{s.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{s.background}</div>
                  </div>
                  <div style={{ color: '#a5b4fc', fontSize: '1.2rem' }}>→</div>
                </button>
              ))}
            </div>

            {/* 分隔 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, borderTop: '1px solid #e5e7eb' }} />
              <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>或</span>
              <div style={{ flex: 1, borderTop: '1px solid #e5e7eb' }} />
            </div>

            {/* 自定义 */}
            <div style={{ background: 'white', borderRadius: 14, padding: '1.25rem', border: '1px solid #f3f4f6' }}>
              <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✨ 自定义场景</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.75rem' }}>描述你们可能经历的一个真实场景</p>
              <textarea value={customText} onChange={e => setCustomText(e.target.value)} rows={4}
                placeholder={'例如：我们已经在一起2年，最近在讨论结婚...\n或者：因为工作调动要开始异地恋...\n或者：她最近总是加班，我们因此频繁吵架...'}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '2px solid #f3f4f6', outline: 'none', fontSize: '0.875rem', resize: 'none', lineHeight: 1.6, fontFamily: 'inherit', background: '#f9fafb', color: '#374151' }}
                onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = '#c7d2fe'; }}
                onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = '#f3f4f6'; }} />
              <button onClick={runCustomScenario}
                style={{ marginTop: '0.75rem', width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', borderRadius: 10, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                🧠 开始完整预演 →
              </button>
            </div>
          </div>
        )}

        {/* ===== LOADING ===== */}
        {(phase === 'running-event' || phase === 'running-network' || phase === 'running-conclusion') && (
          <div style={{ background: 'white', borderRadius: 16, padding: '3rem 2rem', textAlign: 'center', border: '1px solid #f3f4f6' }}>
            <div style={{ width: 56, height: 56, border: '4px solid #e0e7ff', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem' }} />
            <div style={{ fontWeight: 700, color: '#111827', fontSize: '1.1rem', marginBottom: '0.5rem' }}>⚡ {step}</div>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.5rem' }}>这可能需要20-40秒，请耐心等待</p>
            {/* 进度指示 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
              {[
                { label: '事件推演', done: phase !== 'running-event' && phase !== 'idle' },
                { label: '社交网络', done: phase === 'running-conclusion' || phase === 'done' },
                { label: '综合结论', done: phase === 'done' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.done ? '#6366f1' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: s.done ? 'white' : '#9ca3af' }}>
                    {s.done ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: s.done ? '#6366f1' : '#9ca3af', fontWeight: s.done ? 600 : 400 }}>{s.label}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 4, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 999, animation: 'loadbar 2s ease-in-out infinite' }} />
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes loadbar{0%,100%{width:10%}50%{width:80%}}`}</style>
          </div>
        )}

        {/* ===== DONE ===== */}
        {phase === 'done' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* ===== 统一结论（最显眼，放在最前面）===== */}
            {conclusion && (
              <div style={{ background: 'linear-gradient(135deg, #1f2937, #374151)', borderRadius: 16, padding: '1.5rem', color: 'white' }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>🔮 MiroFish 综合判决</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900 }}>{conclusion.verdict || '综合结论'}</div>
                  {conclusion.verdictLabel && (
                    <div style={{ padding: '4px 12px', borderRadius: 999, background: verdictStyle(conclusion.verdictLabel).bg, color: verdictStyle(conclusion.verdictLabel).text, fontSize: '0.75rem', fontWeight: 700 }}>
                      {conclusion.verdictLabel}
                    </div>
                  )}
                </div>
                {conclusion.summary && (
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1rem' }}>{conclusion.summary}</p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {conclusion.topAdvice && (
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#86efac', fontWeight: 600, marginBottom: 4 }}>💡 最重要建议</div>
                      <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>{conclusion.topAdvice}</p>
                    </div>
                  )}
                  {conclusion.riskSignal && (
                    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#fca5a5', fontWeight: 600, marginBottom: 4 }}>⚠️ 警惕信号</div>
                      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem' }}>{conclusion.riskSignal}</p>
                    </div>
                  )}
                  {conclusion.timeline && (
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>⏱️ {conclusion.timeline}</div>
                  )}
                  {conclusion.confidence !== undefined && (
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>小镜信心指数：{conclusion.confidence}%</div>
                  )}
                </div>
              </div>
            )}

            {/* ===== 双维度评分卡 ===== */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: 'white', borderRadius: 14, padding: '1rem', border: '1px solid #f3f4f6', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.875rem', marginBottom: '0.5rem' }}>事件推演</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#6366f1', marginBottom: '0.25rem' }}>{eventResult?.prediction?.probability || '?'}%</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>两个人相处中的预测</div>
              </div>
              <div style={{ background: 'white', borderRadius: 14, padding: '1rem', border: '1px solid #f3f4f6', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🕸️</div>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.875rem', marginBottom: '0.5rem' }}>社交网络</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#6d28d9', marginBottom: '0.25rem' }}>{networkResult?.emergence?.probability || '?'}%</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>社会支持度</div>
              </div>
            </div>

            {/* ===== 事件推演详细 ===== */}
            {eventResult && (
              <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                <div style={{ padding: '0.875rem 1.25rem', background: '#eff6ff', borderBottom: '1px solid #e0e7ff' }}>
                  <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.875rem' }}>⚡ 事件推演详情</div>
                </div>
                <div style={{ padding: '1rem' }}>
                  {eventResult.keyEvents && eventResult.keyEvents.slice(0, 2).map((evt: any, i: number) => (
                    <div key={i} style={{ marginBottom: i < 1 ? '1rem' : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.8rem' }}>{evt.phase}</span>
                        <span style={{ fontSize: '0.65rem', background: '#e0e7ff', color: '#6366f1', padding: '2px 8px', borderRadius: 999 }}>{i + 1}/{eventResult.keyEvents.length}</span>
                      </div>
                      <p style={{ color: '#4b5563', fontSize: '0.75rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>{evt.situation}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '0.75rem' }}>
                        <div style={{ background: '#eff6ff', borderRadius: 8, padding: '0.6rem' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#1d4ed8', marginBottom: 4 }}>{userA.name}</div>
                          <p style={{ fontSize: '0.7rem', color: '#1e40af', lineHeight: 1.5 }}>{evt.stanceA}</p>
                        </div>
                        <div style={{ background: '#f5f3ff', borderRadius: 8, padding: '0.6rem' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6d28d9', marginBottom: 4 }}>{userB.name}</div>
                          <p style={{ fontSize: '0.7rem', color: '#5b21b6', lineHeight: 1.5 }}>{evt.stanceB}</p>
                        </div>
                      </div>
                      {evt.risk && (
                        <div style={{ background: '#fffbeb', borderRadius: 8, padding: '0.6rem', border: '1px solid #fde68a', marginBottom: '0.75rem' }}>
                          <p style={{ fontSize: '0.7rem', color: '#92400e', lineHeight: 1.5 }}>⚠️ {evt.risk}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {eventResult.redFlag && (
                    <div style={{ background: '#be123c', borderRadius: 10, padding: '0.875rem', marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fecdd3', marginBottom: 4 }}>🚩 最大隐患</div>
                      <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>{eventResult.redFlag}</p>
                    </div>
                  )}
                  {eventResult.advice && (
                    <div style={{ background: '#ecfdf5', borderRadius: 10, padding: '0.875rem', marginTop: '0.75rem', border: '1px solid #a7f3d0' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', marginBottom: 4 }}>💡 具体建议</div>
                      <p style={{ color: '#065f46', fontSize: '0.8rem', lineHeight: 1.7 }}>{eventResult.advice}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== 社交网络详细 ===== */}
            {networkResult && (
              <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                <div style={{ padding: '0.875rem 1.25rem', background: '#f5f3ff', borderBottom: '1px solid #ede9fe' }}>
                  <div style={{ fontWeight: 700, color: '#6d28d9', fontSize: '0.875rem' }}>🕸️ 社交网络分析</div>
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    {/* A圈 */}
                    <div>
                      <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{userA.name}的圈子</div>
                      {(networkResult.circleA?.reactions || []).map((r: any, i: number) => (
                        <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '0.75rem', marginBottom: '0.5rem', borderLeft: `3px solid ${attitudeColor(r.attitude)}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{r.charName}</span>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <span style={{ fontSize: '0.6rem', background: '#f3f4f6', color: '#6b7280', padding: '1px 5px', borderRadius: 999, fontWeight: 600 }}>{r.influence}级</span>
                              <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: 999, fontWeight: 600, color: attitudeColor(r.attitude), background: attitudeBg(r.attitude) }}>{attitudeLabel(r.attitude)}</span>
                            </div>
                          </div>
                          <p style={{ fontSize: '0.7rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>"{r.reaction}"</p>
                        </div>
                      ))}
                    </div>
                    {/* B圈 */}
                    <div>
                      <div style={{ fontWeight: 700, color: '#6d28d9', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{userB.name}的圈子</div>
                      {(networkResult.circleB?.reactions || []).map((r: any, i: number) => (
                        <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '0.75rem', marginBottom: '0.5rem', borderLeft: `3px solid ${attitudeColor(r.attitude)}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{r.charName}</span>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <span style={{ fontSize: '0.6rem', background: '#f3f4f6', color: '#6b7280', padding: '1px 5px', borderRadius: 999, fontWeight: 600 }}>{r.influence}级</span>
                              <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: 999, fontWeight: 600, color: attitudeColor(r.attitude), background: attitudeBg(r.attitude) }}>{attitudeLabel(r.attitude)}</span>
                            </div>
                          </div>
                          <p style={{ fontSize: '0.7rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>"{r.reaction}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 共同好友 */}
                  {networkResult.crossCircle && networkResult.crossCircle.reaction && (
                    <div style={{ background: '#fffbeb', borderRadius: 10, padding: '0.875rem', border: '1px solid #fde68a', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#d97706', marginBottom: 4 }}>🔗 共同好友视角</div>
                      <p style={{ fontSize: '0.8rem', color: '#78350f', lineHeight: 1.6, margin: 0 }}>"{networkResult.crossCircle.reaction}"</p>
                    </div>
                  )}

                  {/* 涌现分析 */}
                  {networkResult.emergence && (
                    <div>
                      {networkResult.emergence.keyFindings && networkResult.emergence.keyFindings.length > 0 && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>💡 关键发现</div>
                          {networkResult.emergence.keyFindings.map((f: string, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#e0e7ff', color: '#6366f1', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                              <span style={{ fontSize: '0.75rem', color: '#374151', lineHeight: 1.5 }}>{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {networkResult.emergence.risks && networkResult.emergence.risks.length > 0 && (
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>⚠️ 社会风险</div>
                          {networkResult.emergence.risks.map((r: string, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>!</div>
                              <span style={{ fontSize: '0.75rem', color: '#7f1d1d', lineHeight: 1.5 }}>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 底部操作 */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={restart} style={{ flex: 1, padding: '1rem', border: '2px solid #e5e7eb', borderRadius: 12, fontWeight: 600, color: '#374151', background: 'white', cursor: 'pointer', fontSize: '0.875rem' }}>← 换个场景</button>
              <button onClick={() => navigate('/chat', { state: { match: matchData } })} style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>💬 去聊天</button>
            </div>
          </div>
        )}

        {/* ===== ERROR ===== */}
        {phase === 'error' && (
          <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
            <p style={{ color: '#e11d48', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
            <button onClick={restart} style={{ color: '#9f1239', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>← 返回重试</button>
          </div>
        )}

        <div style={{ textAlign: 'center', padding: '2rem 0 1rem', color: '#9ca3af', fontSize: '0.75rem' }}>
          <p>🧠 MiroFish 统一预演引擎 · Powered by Kimi</p>
          <p style={{ marginTop: 4 }}>Built by 发发 & 旺财</p>
        </div>
      </div>
    </div>
  );
}
