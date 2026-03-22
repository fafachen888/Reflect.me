import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function MatchSelectPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">← 返回</button>
          <div className="font-semibold text-gray-700">开始匹配</div>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">选择匹配方式</h1>
          <p className="text-gray-600">你想和谁进行关系预演？</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <button onClick={() => navigate('/invite-match')} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-violet-200">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">邀请朋友预演</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">生成分享链接邀请认识的人填写档案，双方档案完成后自动生成匹配报告</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-sm">私密1v1</span>
              <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-sm">双向参与</span>
              <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-sm">深度分析</span>
            </div>
          </button>

          <button onClick={() => navigate('/platform-match')} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-indigo-200">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">✨</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">平台智能匹配</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">AI 根据你的档案和偏好，在平台上为你寻找合适的陌生人进行预演配对</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">AI 推荐</span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">广泛匹配</span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">探索可能</span>
            </div>
          </button>
        </div>

        <div className="mt-12 max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <img src={currentUser?.avatar} alt="avatar" className="w-16 h-16 rounded-full bg-gray-100" />
              <div>
                <div className="font-bold text-gray-900">{currentUser?.name}</div>
                <div className="text-sm text-gray-500">{currentUser?.occupation} · {currentUser?.location}</div>
              </div>
              <button onClick={() => navigate('/profile-fill')} className="ml-auto text-indigo-600 text-sm font-medium hover:underline">编辑档案</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
