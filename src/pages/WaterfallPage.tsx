import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { waterfallUsers, WaterfallUser, demoMatchAnalysis, demoUserA } from '../data/mockData';
import { computeMatch, computeMatchLevel } from '../utils/matching';

export default function WaterfallPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentMatch } = useApp();
  const [users, setUsers] = useState<WaterfallUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (!currentUser) { setUsers(waterfallUsers); return; }
    // 真实匹配：用当前用户的维度向量计算与每个候选的相似度
    const myScores = currentUser.dimensionScores || {};
    if (Object.keys(myScores).length === 0) { setUsers(waterfallUsers); return; }
    const myAge = currentUser.age || 26;
    const scored = waterfallUsers.map(u => {
      // mock用户的维度分数（在mockData里以不同字段名存储，需要映射）
      const targetScores = (u as any).dimensionScores || {};
      if (Object.keys(targetScores).length === 0) {
        // 如果mock用户没有维度分数，用随机分（demo模式）
        return { ...u, matchScore: u.matchScore || 65 };
      }
      const score = computeMatch(myScores, targetScores, myAge, u.age);
      return { ...u, matchScore: score };
    });
    // 按匹配分降序
    scored.sort((a, b) => b.matchScore - a.matchScore);
    setUsers(scored as WaterfallUser[]);
  }, [currentUser]);

  const handleSwipe = (dir: 'left' | 'right') => {
    if (direction) return;
    setDirection(dir);
    setTimeout(() => {
      if (dir === 'right') {
        const target = users[currentIndex];
        const matchData = {
          id: `match-${Date.now()}`,
          userA: currentUser || demoUserA,
          userB: target,
          overallScore: target.matchScore,
          matchLevel: computeMatchLevel(target.matchScore),
          analysis: { ...demoMatchAnalysis, overallScore: target.matchScore, matchLevel: target.matchScore >= 85 ? '灵魂伴侣' : target.matchScore >= 70 ? '较好匹配' : '需要磨合' },
          createdAt: new Date().toISOString(),
        };
        setMatchedCount(c => c + 1);
        setCurrentMatch(matchData);
        navigate('/match-result', { state: { match: matchData } });
      }
      setDirection(null);
      setCurrentIndex(prev => prev + 1);
      setCurrentPhotoIndex(0);
    }, 350);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 60) {
      handleSwipe(diff > 0 ? 'right' : 'left');
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const user = users[currentIndex];
    setCurrentPhotoIndex(prev => (prev + 1) % user.photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const user = users[currentIndex];
    setCurrentPhotoIndex(prev => (prev - 1 + user.photos.length) % user.photos.length);
  };

  const allDone = currentIndex >= users.length;
  const current = users[currentIndex];

  if (allDone || !current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-7xl mb-6 animate-bounce">🌟</div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">今日推荐已看完</h2>
          <p className="text-gray-500 leading-relaxed mb-2">
            你今天已经浏览了 <strong className="text-indigo-600">{users.length}</strong> 位镜遇用户
          </p>
          {matchedCount > 0 && (
            <p className="text-gray-500 mb-6">
              其中 <strong className="text-rose-500">{matchedCount}</strong> 位让你产生了兴趣 ✨
            </p>
          )}
          <p className="text-gray-400 text-sm mb-8">
            明天还有更多有趣的灵魂等着你~
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/invite-match')}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-200 transition-all"
            >
              🎁 邀请朋友来匹配
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-full py-3 text-gray-500 text-sm font-medium"
            >
              查看我的档案 →
            </button>
          </div>
        </div>
        {/* Bottom Nav */}
        <BottomNav navigate={navigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-sm shadow">🪞</div>
          <span className="font-black text-gray-900">镜遇</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/invite-match')} className="text-gray-500 text-xl" title="邀请朋友">🎁</button>
          <button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full border-2 border-gray-200 overflow-hidden">
            <img
              src={currentUser?.avatar || 'https://i.pravatar.cc/300?img=47'}
              alt="me"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white px-4 pt-2 pb-0">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>{currentIndex + 1} / {users.length}</span>
          <span>{matchedCount} 位感兴趣</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, ((currentIndex) / users.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* Card Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm relative">
          <div
            ref={cardRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`relative transition-all duration-300 ${
              direction === 'left' ? '-translate-x-24 rotate-[-12deg] opacity-0' :
              direction === 'right' ? 'translate-x-24 rotate-[12deg] opacity-0' : ''
            }`}
          >
            {/* Swipe hint overlay */}
            {direction === 'right' && (
              <div className="absolute top-6 left-4 z-10 border-4 border-emerald-500 rounded-2xl px-4 py-2 rotate-[-15deg]">
                <span className="text-emerald-500 font-black text-xl">感兴趣</span>
              </div>
            )}
            {direction === 'left' && (
              <div className="absolute top-6 right-4 z-10 border-4 border-gray-400 rounded-2xl px-4 py-2 rotate-[15deg]">
                <span className="text-gray-400 font-black text-xl">跳过</span>
              </div>
            )}

            {/* Photo Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white mb-3 aspect-[3/4] cursor-pointer">
              <img
                src={current.photos[currentPhotoIndex]}
                alt="photo"
                className="w-full h-full object-cover transition-all duration-300"
              />

              {current.photos.length > 1 && (
                <>
                  <button onClick={prevPhoto} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 backdrop-blur rounded-full text-white text-lg flex items-center justify-center hover:bg-black/60 transition-colors">‹</button>
                  <button onClick={nextPhoto} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 backdrop-blur rounded-full text-white text-lg flex items-center justify-center hover:bg-black/60 transition-colors">›</button>
                </>
              )}

              {/* Photo dots */}
              <div className="absolute bottom-20 right-4 flex gap-1.5">
                {current.photos.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentPhotoIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} />
                ))}
              </div>

              {/* Gradient */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-white font-black text-2xl">
                      {current.name}
                      <span className="text-white/70 text-lg ml-1.5">{current.age}岁</span>
                    </h2>
                    <p className="text-white/80 text-sm mt-0.5">{(current as any).occupation} · {current.location}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur text-white rounded-full px-3 py-1.5 text-sm font-bold shadow">
                    {(current as any).matchScore || current.matchScore}%
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <div className="flex gap-2">
                  {(current as any).online && (
                    <span className="bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow">在线</span>
                  )}
                  {(current as any).verified && (
                    <span className="bg-indigo-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow">已认证</span>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{(current as any).bio}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {((current as any).interests || []).map((interest: string) => (
                  <span key={interest} className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-xs font-medium">{interest}</span>
                ))}
              </div>
              <div className="flex gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3">
                <span className="flex items-center gap-1">💬 {(current as any).communicationStyle}</span>
                <span className="flex items-center gap-1">💡 {(current as any).relationshipExpectation}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center items-center gap-5 mt-6">
            <button onClick={() => handleSwipe('left')}
              className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl text-gray-300 hover:text-gray-500 hover:scale-110 transition-all border border-gray-200 hover:shadow-xl">
              ✕
            </button>
            <button onClick={() => navigate('/questionnaire')}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-all">
              📝
            </button>
            <button onClick={() => handleSwipe('right')}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg flex items-center justify-center text-2xl text-white hover:scale-110 transition-all hover:shadow-xl hover:shadow-indigo-200">
              ❤️
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">左右滑动或点击按钮</p>
        </div>
      </main>

      <BottomNav navigate={navigate} />
    </div>
  );
}

function BottomNav({ navigate }: { navigate: any }) {
  return (
    <nav className="bg-white border-t">
      <div className="max-w-lg mx-auto flex">
        {[
          { id: 'match', label: '匹配', icon: '⚡', path: '/home' },
          { id: 'chat', label: '聊天', icon: '💬', path: '/chat-list' },
          { id: 'profile', label: '我', icon: '👤', path: '/profile' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-sm ${tab.id === 'match' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
            {tab.id === 'match' && <div className="w-6 h-0.5 bg-indigo-500 rounded-full" />}
          </button>
        ))}
      </div>
    </nav>
  );
}
