import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { loadDemoData, isLoggedIn, currentUser } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      navigate('/home');
    }
  }, [isLoggedIn, currentUser, navigate]);

  const handleLogin = () => {
    if (!phone.trim()) { setError('请输入手机号'); return; }
    if (!password.trim()) { setError('请输入密码'); return; }
    setError('');
    loadDemoData();
    navigate('/home');
  };

  const handleDemo = () => {
    loadDemoData();
    navigate('/home');
  };

  const features = [
    { icon: '🔮', title: 'AI 深度预演', desc: '多智能体引擎，模拟两人在价值观、沟通、冲突等场景中的真实互动', gradient: 'from-violet-500 to-purple-600' },
    { icon: '📊', title: '九维匹配分析', desc: '从人格特质、价值观、沟通风格等维度量化镜遇程度', gradient: 'from-amber-500 to-orange-500' },
    { icon: '💡', title: '关系建议指导', desc: '针对潜在冲突点提供沟通策略，帮助你们更好地理解彼此', gradient: 'from-emerald-500 to-teal-500' },
  ];

  const testimonials = [
    { name: '王小姐', role: '产品经理 · 26岁', quote: '预演报告让我在约会前就了解了可能出现的沟通障碍', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=W1&backgroundColor=f9d5d5' },
    { name: '李先生', role: '工程师 · 29岁', quote: '发现了和她在消费观上的差异，提前沟通避免了第一次约会的尴尬', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=L1&backgroundColor=d4e4f7' },
    { name: '张小姐', role: '设计师 · 27岁', quote: '原来我们「吵架模式」完全不同！提前知道这点省了很多误会', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Z1&backgroundColor=e8d5f5' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* 左侧品牌展示区 */}
      <div className="flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-800 text-white flex flex-col justify-center relative overflow-hidden lg:min-h-screen">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/10" />
        </div>

        <div className="relative z-10 px-8 xl:px-16 py-16 animate-fadeIn">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shadow-lg">🪞</div>
            <div>
              <div className="text-2xl font-black tracking-tight">镜遇</div>
              <div className="text-xs text-white/60 mt-0.5">Mirror World, Real Connection</div>
            </div>
          </div>

          {/* Hero */}
          <div className="mb-10">
            <div className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-sm font-medium mb-6">🔮 AI 预演引擎 · 全新上线</div>
            <h1 className="text-4xl xl:text-5xl font-black leading-tight mb-6">
              在建联之前<br />先「看见」你们的关系
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-md">
              基于多智能体 AI 预演技术，深度模拟两个人在价值观、沟通、冲突等场景中的潜在互动——<strong className="text-white">让每一次关系建立都更有方向</strong>。
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {features.map(f => (
              <div key={f.title} className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-3 shadow-lg`}>{f.icon}</div>
                <div className="font-bold text-sm mb-1">{f.title}</div>
                <div className="text-xs text-white/60 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            {testimonials.map(t => (
              <div key={t.name} className="flex items-start gap-4 bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-white/20 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{t.name}</span>
                    <span className="text-xs text-white/50">{t.role}</span>
                  </div>
                  <div className="text-sm text-white/80 leading-relaxed">"{t.quote}"</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-white/10">
            <div className="text-xs text-white/30">Powered by MiniMax Agent · 2026年3月</div>
          </div>
        </div>
      </div>

      {/* 右侧登录区 */}
      <div className="flex-1 flex flex-col justify-center px-8 py-16 lg:px-16 xl:px-24 bg-white relative">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-xl text-white shadow-lg">🪞</div>
            <div className="text-xl font-black text-gray-900">镜遇</div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">欢迎回来</h2>
            <p className="text-gray-500">登录你的镜遇账号，开始关系预演</p>
          </div>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">手机号</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">+86</span>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="138 0000 0000"
                  className="w-full pl-14 pr-4 py-4 rounded-2xl border-2 border-gray-200 outline-none focus:border-indigo-400 transition-colors text-gray-800 bg-gray-50 text-base" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">密码</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="输入密码"
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 outline-none focus:border-indigo-400 transition-colors text-gray-800 bg-gray-50 text-base" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">{error}</div>
          )}

          <button onClick={handleLogin}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-indigo-200 transition-all mb-3">
            登录 / 注册
          </button>

          <button onClick={handleDemo}
            className="w-full py-3.5 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors mb-6">
            快速体验 Demo →
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-gray-400">或</span></div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100">
            <div className="text-sm font-semibold text-indigo-800 mb-2">🪞 什么是镜遇？</div>
            <p className="text-sm text-indigo-700 leading-relaxed mb-3">
              「镜遇」是一款 AI 关系预演产品。通过多智能体技术，在你们建联之前，先模拟真实相处场景——让你<strong>提前看见</strong>关系的可能走向。
            </p>
            <div className="flex flex-wrap gap-2">
              {['完全免费', '隐私保护', 'AI驱动', '40题深度测评'].map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full">{tag}</span>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            登录即表示同意 <span className="text-indigo-500">《用户协议》</span> 和 <span className="text-indigo-500">《隐私政策》</span>
          </p>
        </div>
      </div>
    </div>
  );
}
