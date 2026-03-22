import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { demoMatchAnalysis, demoUserAnswers } from '../data/mockData';

export default function InviteMatchPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentMatch } = useApp();
  const [inviteLink] = useState('https://cihe.app/invite/' + Math.random().toString(36).substr(2, 8));
  const [friendName, setFriendName] = useState('');
  const [showFillForm, setShowFillForm] = useState(false);

  const handleCopy = () => { navigator.clipboard.writeText(inviteLink); alert('邀请链接已复制！'); };

  const handleGenerateForFriend = () => {
    if (!friendName.trim()) { alert('请输入朋友姓名'); return; }
    const matchUser = {
      id: 'friend-match', name: friendName, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${friendName}&backgroundColor=c0aede`,
      gender: 'male' as const, age: 27, occupation: '朋友', location: '北京', bio: '通过邀请链接匹配',
      personality: [], attachment: '', communicationStyle: '', relationshipExpectation: '', interests: [], dealBreakers: [], createdAt: new Date().toISOString(),
    };
    setCurrentMatch({
      id: 'invite-match', userA: { ...currentUser, assessmentData: demoUserAnswers } as any, userB: matchUser,
      overallScore: demoMatchAnalysis.overallScore, matchLevel: demoMatchAnalysis.matchLevel,
      edges: [], scenes: [], createdAt: new Date().toISOString(), status: 'ready', analysis: demoMatchAnalysis,
    });
    navigate('/match-result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 pb-8">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-500">← 返回</button>
          <span className="font-semibold text-gray-700">邀请朋友预演</span>
          <div className="w-16" />
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8"><h1 className="text-2xl font-bold text-gray-900 mb-2">邀请朋友参与</h1><p className="text-gray-500 text-sm">分享邀请链接给朋友，一起完成关系预演</p></div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="text-sm font-medium text-gray-500 mb-2">邀请链接</div>
          <div className="flex gap-2"><input type="text" value={inviteLink} readOnly className="flex-1 px-3 py-2.5 rounded-lg bg-gray-50 border text-sm text-gray-600" /><button onClick={handleCopy} className="px-4 py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-medium">复制</button></div>
          <div className="flex gap-3 mt-3"><button onClick={handleCopy} className="flex-1 py-2 border rounded-lg text-sm">📱 微信</button><button onClick={handleCopy} className="flex-1 py-2 border rounded-lg text-sm">💬 朋友圈</button></div>
        </div>
        <div className="text-center"><div className="text-gray-400 text-sm mb-3">或者</div><button onClick={() => setShowFillForm(!showFillForm)} className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold">{showFillForm ? '收起' : '代替朋友填写档案'}</button></div>
        {showFillForm && (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-4">朋友不方便填写？获得同意后代为填写（仅适用认识的人）</p>
            <input type="text" value={friendName} onChange={e => setFriendName(e.target.value)} placeholder="朋友姓名" className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-3 outline-none" />
            <button onClick={handleGenerateForFriend} className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold">生成匹配报告</button>
          </div>
        )}
        <div className="mt-8 bg-indigo-50 rounded-2xl p-4 text-center"><p className="text-sm text-indigo-700">朋友注册后完成测评，你们的关系报告自动生成</p></div>
      </main>
    </div>
  );
}
