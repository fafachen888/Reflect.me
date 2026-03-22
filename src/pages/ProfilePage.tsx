import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: currentUser?.name || '林小晴',
    bio: currentUser?.bio || '',
    occupation: currentUser?.occupation || '',
    location: currentUser?.location || '',
  });

  const menuItems = [
    { icon: '📊', label: '我的测评档案', sub: '查看九维度分析报告', action: () => navigate('/report'), color: 'bg-indigo-50 text-indigo-600' },
    { icon: '📝', label: '编辑个人资料', sub: '修改基本信息', action: () => setEditMode(true), color: 'bg-purple-50 text-purple-600' },
    { icon: '🔒', label: '隐私设置', sub: '控制信息可见性', action: () => alert('隐私设置功能开发中~'), color: 'bg-emerald-50 text-emerald-600' },
    { icon: '⚙️', label: '账号设置', sub: '账号安全 · 退出登录', action: () => navigate('/login'), color: 'bg-gray-50 text-gray-600' },
    { icon: 'ℹ️', label: '关于我们', sub: '了解镜遇产品理念', action: () => alert('镜遇 v3.0 · 2026年3月\nBuilt by 发发 & 旺财'), color: 'bg-slate-50 text-slate-600' },
  ];

  if (editMode) {
    return (
      <div className="min-h-screen bg-gray-50 pb-safe">
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setEditMode(false)} className="text-gray-500">取消</button>
            <span className="font-semibold text-gray-800">编辑资料</span>
            <button onClick={() => setEditMode(false)} className="text-indigo-600 font-semibold text-sm">保存</button>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
          <div className="flex justify-center">
            <div className="relative">
              <img src={currentUser?.avatar || 'https://i.pravatar.cc/300?img=47'} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-500 rounded-full text-white text-sm flex items-center justify-center shadow-md">📷</button>
            </div>
          </div>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">昵称</label><input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">职业</label><input type="text" value={editData.occupation} onChange={e => setEditData({...editData, occupation: e.target.value})} placeholder="你的职业" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">城市</label><input type="text" value={editData.location} onChange={e => setEditData({...editData, location: e.target.value})} placeholder="所在城市" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">个人简介</label><textarea value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} rows={3} placeholder="介绍一下你自己" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white resize-none" /></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
          <div className="flex items-center justify-between mb-4"><span className="text-sm font-medium opacity-80">我的主页</span><button className="text-sm">⚙️</button></div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={currentUser?.avatar || 'https://i.pravatar.cc/300?img=47'} alt="avatar" className="w-20 h-20 rounded-full object-cover border-3 border-white/30 shadow-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">✓</div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-xl mb-0.5">{currentUser?.name || '林小晴'}</div>
              <div className="text-sm opacity-80 mb-2">{currentUser?.occupation || '产品经理'} · {currentUser?.location || '北京'}</div>
              <button onClick={() => setEditMode(true)} className="text-xs bg-white/20 backdrop-blur rounded-full px-3 py-1 hover:bg-white/30 transition-colors">编辑资料</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 -mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[{ label: '被查看', value: '128', unit: '次' }, { label: '收到感兴趣', value: '23', unit: '人' }, { label: '匹配成功', value: '5', unit: '对' }].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-bold text-gray-900 text-lg">{stat.value}<span className="text-xs text-gray-400">{stat.unit}</span></div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          {menuItems.map((item, i) => (
            <button key={item.label} onClick={item.action}
              className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${i < menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-lg`}>{item.icon}</div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-800 text-sm">{item.label}</div>
                <div className="text-xs text-gray-400">{item.sub}</div>
              </div>
              <span className="text-gray-300">›</span>
            </button>
          ))}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-lg mx-auto flex">
          {[{ id: 'match', label: '匹配', icon: '⚡', path: '/' }, { id: 'chat', label: '聊天', icon: '💬', path: '/chat-list' }, { id: 'profile', label: '我', icon: '👤', path: '/profile' }].map(tab => (
            <button key={tab.id} onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 text-sm ${tab.id === 'profile' ? 'text-indigo-600' : 'text-gray-400'}`}>
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
              {tab.id === 'profile' && <div className="w-6 h-0.5 bg-indigo-500 rounded-full" />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
