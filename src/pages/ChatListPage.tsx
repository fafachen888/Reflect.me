import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockChatList } from '../data/mockData';

export default function ChatListPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900">消息</h1>
            <p className="text-xs text-gray-400 mt-0.5">镜遇 · 关系预演</p>
          </div>
          <button className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-lg">🔍</button>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {mockChatList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-5xl mb-6 shadow-inner">
              💬
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">还没有聊天消息</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs">
              去匹配感兴趣的人，开始一段关系预演吧。匹配成功后，你们就可以开始聊天了。
            </p>
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-indigo-200 transition-all"
            >
              去匹配 →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 bg-white">
            {mockChatList.map(chat => (
              <button
                key={chat.id}
                onClick={() => navigate('/chat', { state: { match: { id: chat.id, userB: { id: chat.userId, name: chat.userName, avatar: chat.userAvatar } } } })}
                className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="relative flex-shrink-0">
                  <img src={chat.userAvatar} alt={chat.userName} className="w-14 h-14 rounded-full object-cover bg-gray-100" />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-gray-900 text-sm">{chat.userName}</span>
                    <span className="text-xs text-gray-400">{chat.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate pr-4">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {chat.matchScore}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Bottom tip */}
        <div className="mx-4 mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <div className="text-sm font-semibold text-amber-800 mb-0.5">匹配成功后的正确姿势</div>
              <p className="text-xs text-amber-700 leading-relaxed">
                先查看预演报告，了解你们的关系特点，再用AI破冰话题开始第一次对话——让建联更有方向。
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-lg mx-auto flex">
          {[
            { id: 'match', label: '匹配', icon: '⚡', path: '/home' },
            { id: 'chat', label: '聊天', icon: '💬', path: '/chat-list' },
            { id: 'profile', label: '我', icon: '👤', path: '/profile' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 text-sm ${tab.id === 'chat' ? 'text-indigo-600' : 'text-gray-400'}`}
            >
              <div className="relative">
                <span className="text-xl">{tab.icon}</span>
                {tab.id === 'chat' && mockChatList.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </div>
              <span className="font-medium">{tab.label}</span>
              {tab.id === 'chat' && <div className="w-6 h-0.5 bg-indigo-500 rounded-full" />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
