import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { demoUserA } from '../data/mockData';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setCurrentUser, loadDemoData } = useApp();
  const [showModal, setShowModal] = useState(false);

  const handleQuickDemo = () => {
    setCurrentUser(demoUserA);
    loadDemoData(); navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white text-lg">⚡</span>
            </div>
            <span className="font-bold text-xl text-gray-800">镜遇<span className="text-indigo-500">.</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleQuickDemo} className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">快速体验</button>
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-indigo-200 transition-all">登录</button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-purple-100/50" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full text-sm font-medium text-indigo-600 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI 预演引擎 · 全新上线
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            在建联之前<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">先「看见」你们的关系</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            基于多智能体 AI 预演技术，深度模拟两个人在价值观、沟通、冲突等场景中的潜在互动——<span className="text-indigo-600 font-semibold">让每一次关系建立都更有方向</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleQuickDemo} className="group px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center gap-2">
              立即体验 Demo <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button onClick={() => setShowModal(true)} className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-2xl hover:shadow-lg transition-all border border-gray-200">了解产品原理</button>
          </div>
        </div>

        <div className="absolute top-32 left-10 w-64 bg-white rounded-2xl p-4 shadow-xl animate-float opacity-60 hidden lg:block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500" />
            <div><div className="font-semibold text-sm">王小姐</div><div className="text-xs text-gray-500">产品经理 · 26岁</div></div>
          </div>
          <div className="text-xs text-gray-600">"预演报告让我在约会前就了解了可能出现的沟通障碍"</div>
        </div>

        <div className="absolute bottom-32 right-10 w-72 bg-white rounded-2xl p-4 shadow-xl animate-float opacity-60 hidden lg:block" style={{ animationDelay: '2s' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
            <div><div className="font-semibold text-sm">李先生</div><div className="text-xs text-gray-500">工程师 · 29岁</div></div>
          </div>
          <div className="text-xs text-gray-600">"发现了和她在消费观上的差异，提前沟通避免了第一次约会的尴尬"</div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么需要关系预演？</h2>
            <p className="text-gray-600 max-w-xl mx-auto">在投入时间和情感之前，先用AI预演你们的关系走向</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🔮</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI 深度预演</h3>
              <p className="text-gray-600 leading-relaxed">基于多智能体引擎，模拟两人在不同场景下的真实互动，生成可视化关系图谱</p>
            </div>
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">量化匹配分析</h3>
              <p className="text-gray-600 leading-relaxed">从人格特质、价值观、沟通风格等维度给出综合评分，清晰了解镜遇程度</p>
            </div>
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">关系建议指导</h3>
              <p className="text-gray-600 leading-relaxed">针对潜在冲突点提供沟通建议，帮助你们更好地理解彼此</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">如何使用</h2>
            <p className="text-gray-600">两种玩法，满足不同场景需求</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-3xl">👥</div>
                <div><h3 className="text-xl font-bold text-gray-900">邀请朋友预演</h3><p className="text-sm text-gray-500">与认识的人进行关系预演</p></div>
              </div>
              <ol className="space-y-4">
                <li className="flex items-start gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-sm font-bold flex items-center justify-center">1</span><span className="text-gray-700">填写你的性格档案和偏好</span></li>
                <li className="flex items-start gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-sm font-bold flex items-center justify-center">2</span><span className="text-gray-700">邀请朋友也填写档案（或代填）</span></li>
                <li className="flex items-start gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-sm font-bold flex items-center justify-center">3</span><span className="text-gray-700">AI 生成深度匹配报告</span></li>
                <li className="flex items-start gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-sm font-bold flex items-center justify-center">4</span><span className="text-gray-700">查看关系图谱和预演场景</span></li>
              </ol>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-3xl">✨</div>
                <div><h3 className="text-xl font-bold text-gray-900">平台智能匹配</h3><p className="text-sm text-gray-500">AI 为你寻找合适的陌生人</p></div>
              </div>
              <ol className="space-y-4">
                <li className="flex items-start gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold flex items-center justify-center">1</span><span className="text-gray-700">完善你的性格测试和偏好设置</span></li>
                <li className="flex items-start gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold flex items-center justify-center">2</span><span className="text-gray-700">平台根据算法推荐候选人</span></li>
                <li className="flex items-start gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold flex items-center justify-center">3</span><span className="text-gray-700">选择感兴趣的人选进行预演</span></li>
                <li className="flex items-start gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold flex items-center justify-center">4</span><span className="text-gray-700">AI 预演并生成关系报告</span></li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">准备好看见你们的关系了吗？</h2>
          <p className="text-xl text-indigo-100 mb-10">用 AI 预演一次，少走弯路</p>
          <button onClick={handleQuickDemo} className="px-10 py-5 text-lg font-bold text-indigo-600 bg-white rounded-2xl hover:shadow-2xl transition-all hover:scale-105">开始关系预演</button>
        </div>
      </section>

      <footer className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><span className="text-white text-sm">⚡</span></div>
            <span className="font-bold text-xl text-white">镜遇<span className="text-indigo-400">.</span></span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 镜遇 · 关系预演引擎 · Built by 发发 & 旺财</p>
        </div>
      </footer>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl" onClick={(e: React.SyntheticEvent) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">产品原理</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
            </div>
            <div className="space-y-4 text-gray-600">
              <p><strong className="text-gray-900">1. 人格特质分析：</strong>基于大五人格模型，分析用户在外向性、宜人性、尽责性、开放性、神经质五个维度的表现。</p>
              <p><strong className="text-gray-900">2. 依恋类型识别：</strong>识别用户的安全型、焦虑型或回避型依恋风格，理解其在亲密关系中的行为模式。</p>
              <p><strong className="text-gray-900">3. 价值观匹配：</strong>分析双方对婚姻、事业、生活方式的期望一致性。</p>
              <p><strong className="text-gray-900">4. 多智能体模拟：</strong>基于以上数据，AI 模拟两个人在破冰对话、价值观碰撞、冲突处理等场景中的互动。</p>
              <p><strong className="text-gray-900">5. 关系图谱生成：</strong>将分析结果可视化为关系拓扑图，清晰展示匹配点、互补点和潜在冲突。</p>
            </div>
            <button onClick={() => setShowModal(false)} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">我知道了</button>
          </div>
        </div>
      )}
    </div>
  );
}
