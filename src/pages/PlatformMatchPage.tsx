import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recommendedUsers, generateMatchSession } from '../data/mockData';
import { UserProfile } from '../types';

export default function PlatformMatchPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentMatch } = useApp();
  const [filterOpen, setFilterOpen] = useState(false);
  const [preferences, setPreferences] = useState({ ageRange: [22, 35] as [number, number], location: '', intention: '' });

  const handleStartMatch = (user: UserProfile) => {
    if (!currentUser) return;
    const match = generateMatchSession(currentUser, user);
    setCurrentMatch(match);
    navigate('/match-result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50"><div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between"><button onClick={() => navigate('/match-select')} className="text-gray-500">← 返回</button><div className="font-semibold text-gray-700">平台匹配</div><button onClick={() => setFilterOpen(!filterOpen)} className="text-indigo-600 font-medium">{filterOpen ? '收起' : '筛选'}</button></div></header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {filterOpen && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h3 className="font-bold text-gray-900 mb-4">匹配偏好设置</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">年龄范围</label><div className="flex items-center gap-2"><input type="number" value={preferences.ageRange[0]} onChange={e => setPreferences({ ...preferences, ageRange: [parseInt(e.target.value), preferences.ageRange[1]] })} className="w-full px-3 py-2 rounded-lg border border-gray-200" min={18} /><span className="text-gray-400">-</span><input type="number" value={preferences.ageRange[1]} onChange={e => setPreferences({ ...preferences, ageRange: [preferences.ageRange[0], parseInt(e.target.value)] })} className="w-full px-3 py-2 rounded-lg border border-gray-200" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">所在城市</label><select value={preferences.location} onChange={e => setPreferences({ ...preferences, location: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200"><option value="">不限</option><option value="北京">北京</option><option value="上海">上海</option><option value="深圳">深圳</option><option value="杭州">杭州</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">关系目的</label><select value={preferences.intention} onChange={e => setPreferences({ ...preferences, intention: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200"><option value="">不限</option><option value="认真交往">认真交往</option><option value="以结婚为目标">以结婚为目标</option></select></div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-6"><div><h2 className="text-xl font-bold text-gray-900">为你推荐</h2><p className="text-gray-500 text-sm">基于你的档案和偏好精选</p></div><div className="text-right"><div className="text-2xl font-bold text-indigo-600">{recommendedUsers.length}</div><div className="text-xs text-gray-500">位候选对象</div></div></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedUsers.map(user => (
            <div key={user.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4 mb-4"><img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full bg-gray-100" /><div className="flex-1 min-w-0"><div className="font-bold text-gray-900 truncate">{user.name}</div><div className="text-sm text-gray-500">{user.age}岁 · {user.occupation}</div><div className="text-xs text-gray-400">{user.location}</div></div></div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{user.bio}</p>
              <div className="flex gap-1 mb-4">{user.personality.slice(0, 3).map(trait => (<div key={trait.name} className="flex-1 text-center py-1 bg-gray-50 rounded text-xs" title={`${trait.name}: ${trait.value}`}>{trait.emoji}</div>))}</div>
              <div className="flex flex-wrap gap-1 mb-4"><span className="px-2 py-0.5 bg-violet-50 text-violet-600 rounded text-xs">{user.attachment}</span><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{user.communicationStyle.split('型')[0]}</span></div>
              <button onClick={() => handleStartMatch(user)} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">开始预演</button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8"><button className="px-8 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">加载更多</button></div>
      </main>
    </div>
  );
}
