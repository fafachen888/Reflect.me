#!/usr/bin/env python3
import re, os

BASE = '/workspace/cihe-v2/src'

# ============================
# 1. App.tsx - 路由调整
# ============================
app_tsx = f'''import React from 'react';
import {{ BrowserRouter, Routes, Route }} from 'react-router-dom';
import {{ AppProvider }} from './context/AppContext';
import HomePage from './pages/HomePage';
import WaterfallPage from './pages/WaterfallPage';
import BasicInfoPage from './pages/BasicInfoPage';
import QuestionnairePage from './pages/QuestionnairePage';
import InviteMatchPage from './pages/InviteMatchPage';
import MatchResultPage from './pages/MatchResultPage';
import ReportPage from './pages/ReportPage';
import ChatPage from './pages/ChatPage';
import ChatListPage from './pages/ChatListPage';
import ProfilePage from './pages/ProfilePage';

function App() {{
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={{<HomePage />}} />
          <Route path="/home" element={{<WaterfallPage />}} />
          <Route path="/basic-info" element={{<BasicInfoPage />}} />
          <Route path="/questionnaire" element={{<QuestionnairePage />}} />
          <Route path="/invite-match" element={{<InviteMatchPage />}} />
          <Route path="/match-result" element={{<MatchResultPage />}} />
          <Route path="/report" element={{<ReportPage />}} />
          <Route path="/chat" element={{<ChatPage />}} />
          <Route path="/chat-list" element={{<ChatListPage />}} />
          <Route path="/profile" element={{<ProfilePage />}} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}}
export default App;
'''

# ============================
# 2. HomePage.tsx - 镜遇登录页
# ============================
homepage = '''import React, { useState, useEffect } from 'react';
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
    { icon: '🔮', title: 'AI 深度预演', desc: '多智能体引擎，模拟两人在价值观、沟通、冲突等场景中的真实互动', color: 'from-violet-500 to-purple-600' },
    { icon: '📊', title: '九维匹配分析', desc: '从人格特质、价值观、沟通风格等维度量化契合程度', color: 'from-amber-500 to-orange-500' },
    { icon: '💡', title: '关系建议指导', desc: '针对潜在冲突点提供沟通策略，帮助你们更好地理解彼此', color: 'from-emerald-500 to-teal-500' },
  ];

  const testimonials = [
    { name: '王小姐', role: '产品经理 · 26岁', quote: '预演报告让我在约会前就了解了可能出现的沟通障碍', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=W1&backgroundColor=f9d5d5' },
    { name: '李先生', role: '工程师 · 29岁', quote: '发现了和她在消费观上的差异，提前沟通避免了第一次约会的尴尬', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=L1&backgroundColor=d4e4f7' },
    { name: '张小姐', role: '设计师 · 27岁', quote: '原来我们「吵架模式」完全不同！提前知道这点省了很多误会', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Z1&backgroundColor=e8d5f5' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* 左侧品牌区 */}
      <div className="flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-800 text-white flex flex-col justify-center relative overflow-hidden lg:min-h-screen">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl" />
        </div>
        <div className="relative z-10 px-8 xl:px-16 py-16">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shadow-lg">🪞</div>
            <div>
              <div className="text-2xl font-black tracking-tight">镜遇</div>
              <div className="text-xs text-white/60 mt-0.5">Mirror World, Real Connection</div>
            </div>
          </div>
          <div className="mb-8">
            <h1 className="text-4xl xl:text-5xl font-black leading-tight mb-6">
              在建联之前<br />先「看见」你们的关系
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-md">
              基于多智能体 AI 预演技术，深度模拟两个人在价值观、沟通、冲突等场景中的潜在互动——<strong className="text-white">让每一次关系建立都更有方向</strong>。
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {features.map(f => (
              <div key={f.title} className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br {f.color} flex items-center justify-center text-2xl mb-3 shadow-lg`}>{f.icon}</div>
                <div className="font-bold text-sm mb-1">{f.title}</div>
                <div className="text-xs text-white/60 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {testimonials.map(t => (
              <div key={t.name} className="flex items-start gap-4 bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-white/20 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1"><span className="font-bold text-sm">{t.name}</span><span className="text-xs text-white/50">{t.role}</span></div>
                  <div className="text-sm text-white/80 leading-relaxed">"{t.quote}"</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-xs text-white/40">Powered by MiniMax Agent · 2026年3月</div>
        </div>
      </div>

      {/* 右侧登录区 */}
      <div className="flex-1 flex flex-col justify-center px-8 py-16 lg:px-16 xl:px-24 bg-white relative">
        <div className="max-w-md mx-auto w-full">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-xl text-white shadow-lg">🪞</div>
            <div className="text-xl font-black text-gray-900">镜遇</div>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">欢迎回来</h2>
            <p className="text-gray-500">登录你的镜遇账号，开始关系预演</p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">手机号</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">+86</span>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="138 0000 0000"
                  className="w-full pl-14 pr-4 py-4 rounded-2xl border-2 border-gray-200 outline-none focus:border-indigo-400 transition-colors text-gray-800 bg-gray-50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">密码</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="输入密码"
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 outline-none focus:border-indigo-400 transition-colors text-gray-800 bg-gray-50" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? '🙈' : '👁'}</button>
              </div>
            </div>
          </div>

          {error && <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">{error}</div>}

          <button onClick={handleLogin} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-indigo-200 transition-all mb-3">
            登录 / 注册
          </button>

          <button onClick={handleDemo} className="w-full py-3.5 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors mb-8">
            快速体验 Demo →
          </button>

          <div className="relative mb-8">
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
'''

# ============================
# 3. WaterfallPage.tsx - 瀑布流
# ============================
waterfall = '''import React, {{ useState, useEffect, useRef }} from 'react';
import {{ useNavigate }} from 'react-router-dom';
import {{ useApp }} from '../context/AppContext';
import {{ waterfallUsers, WaterfallUser, demoMatchAnalysis, demoUserA, demoUserB }} from '../data/mockData';

export default function WaterfallPage() {{
  const navigate = useNavigate();
  const {{ currentUser, setCurrentMatch }} = useApp();
  const [users, setUsers] = useState<WaterfallUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [loadedPhotos, setLoadedPhotos] = useState<Set<string>>(new Set());
  const touchStartX = useRef(0);

  useEffect(() => { setUsers(waterfallUsers); }, []);

  const currentUser_ = users[currentIndex];
  if (!currentUser_) {{
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">没有更多匹配了，稍后再来~</div>
      </div>
    );
  }}

  const handleSwipe = (dir: 'left' | 'right') => {{
    setDirection(dir);
    setTimeout(() => {{
      if (dir === 'right') {{
        const matchData = {{
          id: `match-${{Date.now()}}`,
          userA: currentUser || demoUserA,
          userB: currentUser_,
          overallScore: currentUser_.matchScore,
          matchLevel: currentUser_.matchScore >= 85 ? '灵魂伴侣' : currentUser_.matchScore >= 70 ? '较好匹配' : '需要磨合',
          analysis: {{ ...demoMatchAnalysis, overallScore: currentUser_.matchScore, matchLevel: currentUser_.matchScore >= 85 ? '灵魂伴侣' : currentUser_.matchScore >= 70 ? '较好匹配' : '需要磨合' }},
          createdAt: new Date().toISOString(),
        }};
        setCurrentMatch(matchData);
        navigate('/match-result', {{ state: {{ match: matchData }} }});
      }}
      setDirection(null);
      setCurrentIndex(prev => prev + 1);
    }}, 300);
  }};

  const handlePhotoChange = (idx: number) => {{
    const photoUrl = currentUser_.photos[idx];
    setLoadedPhotos(prev => new Set(prev).add(photoUrl));
  }};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-sm shadow">🪞</div>
          <span className="font-black text-gray-900">镜遇</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/invite-match')} className="text-gray-500 text-xl">🎁</button>
          <button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden"><img src={currentUser?.avatar} alt="me" className="w-full h-full object-cover" /></button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm relative">
          <div className={`relative transition-transform duration-300 ${{direction === 'left' ? '-translate-x-full rotate-[-20deg] opacity-0' : direction === 'right' ? 'translate-x-full rotate-[20deg] opacity-0' : ''}`}>
            {/* 照片轮播 */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white mb-4 aspect-[3/4]">
              {currentUser_.photos.map((photo, i) => (
                <div key={{i}} className={`absolute inset-0 transition-opacity duration-300 ${{i === 0 ? 'opacity-100' : 'opacity-0'}}`} onClick={() => handlePhotoChange(i)}>
                  <img src={photo} alt={`photo-${{i}}`} className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-16">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-white font-bold text-xl">{{currentUser_.name}}<span className="text-white/70 text-base ml-1">{{currentUser_.age}}</span></h2>
                    <p className="text-white/80 text-sm">{{currentUser_.occupation}} · {{currentUser_.location}}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-full px-3 py-1.5 text-white text-sm font-bold">{{currentUser_.matchScore}}%</div>
                </div>
              </div>
              {currentUser_.photos.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-1.5">
                  {currentUser_.photos.map((_, i) => (<div key={{i}} className="w-2 h-2 rounded-full bg-white/60" />))}
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-1.5">
                {currentUser_.online && <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">在线</span>}
                {currentUser_.verified && <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">已认证</span>}
              </div>
            </div>

            {/* 用户信息 */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{{currentUser_.bio}}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {currentUser_.interests.map(interest => (<span key={{interest}} className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-xs font-medium">{{interest}}</span>))}
              </div>
              <div className="flex gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                <span className="flex items-center gap-1"><span>💬</span> {{currentUser_.communicationStyle}}</span>
                <span className="flex items-center gap-1"><span>💡</span> {{currentUser_.relationshipExpectation}}</span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-center gap-5 mt-6">
            <button onClick={() => handleSwipe('left')} className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl text-gray-400 hover:scale-110 transition-transform border border-gray-200">✕</button>
            <button onClick={() => navigate('/questionnaire')} className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform">📝</button>
            <button onClick={() => handleSwipe('right')} className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg flex items-center justify-center text-2xl text-white hover:scale-110 transition-transform">❤️</button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">{{currentIndex + 1}} / {{users.length}} · 左右滑动切换</p>
        </div>
      </main>

      <nav className="bg-white border-t">
        <div className="max-w-lg mx-auto flex">
          {[{{ id: 'match', label: '匹配', icon: '⚡', path: '/home' }}, {{ id: 'chat', label: '聊天', icon: '💬', path: '/chat-list' }}, {{ id: 'profile', label: '我', icon: '👤', path: '/profile' }}].map(tab => (
            <button key={{tab.id}} onClick={() => navigate(tab.path)} className={`flex-1 flex flex-col items-center py-3 gap-1 text-sm ${{tab.id === 'match' ? 'text-indigo-600' : 'text-gray-400'}}`}>
              <span className="text-xl">{tab.icon}</span><span className="font-medium">{tab.label}</span>
              {tab.id === 'match' && <div className="w-6 h-0.5 bg-indigo-500 rounded-full" />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}}
'''

# ============================
# 4. MatchResultPage - 五层拓扑图
# ============================
matchresult = '''import React, {{ useState }} from 'react';
import {{ useNavigate, useLocation }} from 'react-router-dom';
import {{ demoMatchAnalysis, demoUserA, demoUserB }} from '../data/mockData';

const layerConfig = [
  {{
    id: 'shared_value', layer: 1, label: '共同价值层', emoji: '🤝', color: '#10b981',
    title: '共同价值观', icon: '🌟',
    desc: '你们在最底层拥有共同的核心价值，这是关系的基石',
    items: [
      {{ label: '成长节奏一致', userA: 85, userB: 78, analysis: '双方都重视个人成长，愿意共同进步，不因对方追求事业而感到不安。' }},
      {{ label: '生活态度契合', userA: 72, userB: 80, analysis: '都追求有质量的生活，愿意为体验付费，在消费观念上有共鸣。' }},
      {{ label: '家庭观念相近', userA: 68, userB: 75, analysis: '对家庭的期望接近，都认为家庭是生活的核心，愿意为家人投入时间。' }},
    ]
  }},
  {{
    id: 'behavioral', layer: 2, label: '行为模式层', emoji: '🔄', color: '#6366f1',
    title: '相处行为模式', icon: '🔁',
    desc: '日常相处中的行为习惯，决定了相处的舒适度',
    items: [
      {{ label: '沟通频率匹配', userA: 90, userB: 65, analysis: '一方喜欢频繁交流，另一方偏好适度空间，初期可能需要磨合。建议设定「无干扰时间」。' }},
      {{ label: '决策方式互补', userA: 75, userB: 88, analysis: '一方果断、一方谨慎，形成良性互补。重大决定建议共同参与。' }},
      {{ label: '情绪调节同步', userA: 70, userB: 72, analysis: '双方都能较好管理情绪，冲突时能较快平复，不易升级为激烈争吵。' }},
    ]
  }},
  {{
    id: 'emotional', layer: 3, label: '情感需求层', emoji: '💗', color: '#ec4899',
    title: '情感需求回应', icon: '💝',
    desc: '彼此情感需求的匹配程度，影响关系的深度',
    items: [
      {{ label: '安全感给予', userA: 80, userB: 85, analysis: '双方都能给对方稳定的安全感，不易产生猜疑和不安，信任建立较快。' }},
      {{ label: '支持方式认同', userA: 78, userB: 72, analysis: '一方偏好语言鼓励，一方偏好行动支持。了解差异可让支持更有效。' }},
      {{ label: '独处需求尊重', userA: 65, userB: 88, analysis: '一方需要较多独处空间，另一方愿意给予。这是一大优势，能避免过度依赖。' }},
    ]
  }},
  {{
    id: 'conflict', layer: 4, label: '冲突预演层', emoji: '⚡', color: '#f59e0b',
    title: '潜在冲突预警', icon: '⚠️',
    desc: 'AI 预演中最关键的一层，提前知道摩擦点',
    items: [
      {{ label: '冲突模式：冷处理 vs 直接', risk: 'medium', analysis: '当冲突发生时，一方倾向于冷静后再说，一方希望当下解决。建议约定「暂停键」。' }},
      {{ label: '金钱观差异', risk: 'low', analysis: '在可承受范围内消费观有差异，但不影响大局。大的财务决策需提前沟通。' }},
      {{ label: '社交边界分歧', risk: 'medium', analysis: '一方更外向，一方偏内向。在社交活动频率上需要协商，找到双方舒适的平衡点。' }},
    ]
  }},
  {{
    id: 'growth', layer: 5, label: '共同成长层', emoji: '🚀', color: '#8b5cf6',
    title: '未来发展预测', icon: '🔮',
    desc: 'AI 预演你们关系的发展轨迹',
    items: [
      {{ label: '短期(1-3月)', score: 85, analysis: '蜜月期：彼此好奇，交流充分，关系快速升温。建议多创造共同体验。' }},
      {{ label: '中期(3-12月)', score: 72, analysis: '磨合期：生活差异逐渐显现。需要主动沟通，保持开放态度。' }},
      {{ label: '长期(1年+)', score: 80, analysis: '稳定期：如能顺利度过磨合期，关系将进入稳定舒适的状态。' }},
    ]
  }},
];

function LayerCard({{ layer, active, onClick }}: {{ layer: typeof layerConfig[0]; active: boolean; onClick: () => void }}) {{
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="{{`border-2 rounded-2xl p-5 transition-all cursor-pointer hover:shadow-lg ${{active ? 'shadow-lg ring-2 ring-offset-2' : 'border-gray-200 hover:border-gray-300'}}`}}" style={{active ? `border-color: ${{layer.color}}; ring-color: ${{layer.color}}` : ''}} onClick={() => {{ onClick(); setExpanded(!expanded); }}}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{backgroundColor: `${{layer.color}}20`}}>{layer.emoji}</div>
          <div>
            <div className="text-xs font-medium" style={{color: layer.color}}>第 {layer.layer} 层</div>
            <div className="font-bold text-gray-900">{layer.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {expanded && <span className="text-xs text-gray-400">点击收起</span>}
          <span className="text-gray-300">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{layer.desc}</p>
      {expanded && (
        <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
          {layer.items.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-gray-800 text-sm">{item.label}</div>
                {'risk' in item && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${{low: 'bg-emerald-50 text-emerald-600', medium: 'bg-amber-50 text-amber-600', high: 'bg-rose-50 text-rose-600'}}[item.risk]}`}>{item.risk === 'low' ? '低风险' : item.risk === 'medium' ? '中风险' : '高风险'}</span>}
                {'score' in item && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{item.score}分</span>}
                {'userA' in item && (
                  <div className="flex gap-3 text-xs">
                    <span className="text-indigo-600">A: <strong>{item.userA}</strong></span>
                    <span className="text-rose-600">B: <strong>{item.userB}</strong></span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.analysis}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MatchResultPage() {{
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLayer, setActiveLayer] = useState(0);
  const matchFromState = (location.state as any)?.match;
  const analysis = matchFromState?.analysis || demoMatchAnalysis;
  const userA = matchFromState?.userA || demoUserA;
  const userB = matchFromState?.userB || demoUserB;
  const {{ overallScore, matchLevel }} = matchFromState || {{ overallScore: 0, matchLevel: '较好匹配' }};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">← 返回</button>
          <div className="font-bold text-gray-800">🪞 镜遇预演报告</div>
          <button onClick={() => navigate('/report', {{ state: {{ match: matchFromState }} }})} className="text-indigo-600 font-semibold text-sm">完整版 →</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-3xl p-6 text-white mb-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10">
            <div className="text-xs text-white/60 mb-2">🪞 AI 关系预演引擎 · 镜遇</div>
            <h1 className="text-2xl font-black mb-1">关系预演报告</h1>
            <p className="text-white/70 text-sm mb-6">{{userA?.name}} × {{userB?.name}}</p>
            <div className="inline-flex items-center gap-4 bg-white/15 backdrop-blur rounded-2xl px-8 py-4">
              <div>
                <div className="text-4xl font-black">{{overallScore || 0}}</div>
                <div className="text-xs text-white/60">综合匹配分</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <div className="text-sm font-bold">{{matchLevel || '较好匹配'}}</div>
                <div className="text-xs text-white/60">匹配级别</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Avatars */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[userA, userB].map((user, i) => (
            <div key={{user?.id || i}} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <img src={{user?.avatar}} alt={{user?.name}} className="w-14 h-14 rounded-full bg-gray-100" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 truncate">{{user?.name}}</div>
                <div className="text-xs text-gray-500 truncate">{{user?.occupation}}</div>
                <div className="text-xs text-gray-400">{{user?.location}}</div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{{i === 0 ? '我' : 'TA'}}</span>
            </div>
          ))}
        </div>

        {/* 关系拓扑图谱 - 五层结构 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">🕸️ 关系拓扑图谱</h2>
          <p className="text-sm text-gray-500 mb-5">五层结构 · 深度解读你们的关系网络</p>

          {/* 五层可视化 */}
          <div className="relative mb-6 p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl min-h-48">
            <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
              {[5,4,3,2,1].map(layer => ({{
                id: layerConfig.find(l => l.layer === layer)?.id || '',
                label: layerConfig