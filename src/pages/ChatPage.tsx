import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Message } from '../types';

const aiHints = [
  '💡 建议：可以聊聊最近看的电影，分享一下观后感',
  '💡 建议：问问他平时周末喜欢做什么，了解更多生活方式',
  '💡 建议：适度分享自己的生活，增加亲近感',
  '💡 建议：可以邀请他一起去看看正在举办的艺术展',
  '💡 建议：避免问太多查户口式的问题，让对话更自然',
];

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'system', content: '🎉 恭喜你们匹配成功！基于预演结果，以下是一些沟通建议', timestamp: new Date().toISOString(), type: 'system' },
    { id: '2', senderId: 'system', content: '💬 破冰技巧：可以从共同兴趣入手，比如展览、旅行话题', timestamp: new Date().toISOString(), type: 'system' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showHint, setShowHint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 优先从路由state读取match数据
  const matchFromState = (location.state as any)?.match;
  const otherUser = matchFromState?.userB || { id: 'other', name: '对方', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=other&backgroundColor=c0aede', occupation: '未知', location: '未知' };

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  if (!matchFromState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">请先完成匹配</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-indigo-500 text-white rounded-xl">去匹配</button>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputValue.trim() || !currentUser) return;
    const newMessage: Message = { id: Date.now().toString(), senderId: currentUser.id, content: inputValue, timestamp: new Date().toISOString(), type: 'text' };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setShowHint(false);
    setTimeout(() => {
      const replies = ['好的，听起来很有意思！', '哈哈，这个我也很感兴趣', '周末的话我一般会去咖啡馆写写东西', '最近在看一本书，推荐给你', '有空的话可以一起去看展'];
      const reply: Message = { id: (Date.now() + 1).toString(), senderId: otherUser.id, content: replies[Math.floor(Math.random() * replies.length)], timestamp: new Date().toISOString(), type: 'text' };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/match-result', { state: { match: matchFromState } })} className="text-gray-500 text-xl">←</button>
          <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <div className="font-semibold">{otherUser.name}</div>
            <div className="text-xs text-gray-500">{otherUser.occupation} · {otherUser.location}</div>
          </div>
          <button onClick={() => navigate('/report', { state: { match: matchFromState } })} className="text-indigo-600 text-sm font-medium">报告</button>
        </div>
      </header>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-1.5 text-sm font-medium">
        预演合拍度：{matchFromState.overallScore}分 · {matchFromState.matchLevel}
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          {messages.map(msg => {
            if (msg.type === 'system') return (<div key={msg.id} className="flex justify-center"><div className="bg-gray-200/80 rounded-xl px-4 py-2 text-sm text-gray-600 max-w-xs">{msg.content}</div></div>);
            const isMe = currentUser ? msg.senderId === currentUser.id : false;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && <img src={otherUser.avatar} alt="" className="w-8 h-8 rounded-full mr-2 mt-1" />}
                <div className={`max-w-xs ${isMe ? 'order-1' : ''}`}>
                  <div className={`rounded-2xl px-4 py-2 ${isMe ? 'bg-indigo-500 text-white rounded-br-md' : 'bg-white text-gray-800 rounded-bl-md'}`}>{msg.content}</div>
                  <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                {isMe && currentUser && <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full ml-2 mt-1" />}
              </div>
            );
          })}
          {showHint && (<div className="flex justify-center"><div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl px-4 py-3 text-sm text-amber-800 border border-amber-200 max-w-xs">{aiHints[Math.floor(Math.random() * aiHints.length)]}</div></div>)}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <div className="max-w-2xl mx-auto w-full px-4 py-2"><button onClick={() => setShowHint(true)} className="w-full py-2 text-indigo-600 text-sm font-medium">🤖 获取AI沟通建议</button></div>
      <footer className="bg-white border-t">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="输入消息..." className="flex-1 px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            <button onClick={handleSend} disabled={!inputValue.trim()} className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed">发送</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
