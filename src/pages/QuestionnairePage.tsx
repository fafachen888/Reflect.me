import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { assessmentQuestions, dimensions, AssessmentData } from '../data/mockData';

const QUESTIONS_PER_PAGE = 4;

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const { setCurrentUser, currentUser } = useApp();
  const [answers, setAnswers] = useState<AssessmentData>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [showOther, setShowOther] = useState<Record<string, string>>({});
  const completed = Object.keys(answers).length >= assessmentQuestions.length;

  const totalPages = Math.ceil(assessmentQuestions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = assessmentQuestions.slice(currentPage * QUESTIONS_PER_PAGE, (currentPage + 1) * QUESTIONS_PER_PAGE);
  const currentDim = dimensions.find(d => d.id === currentQuestions[0]?.dimension);
  const progress = Math.round((Object.keys(answers).length / assessmentQuestions.length) * 100);

  const handleAnswer = (qId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [qId]: score }));
    setShowOther(prev => ({ ...prev, [qId]: '' }));
  };

  const handleOtherAnswer = (qId: string, text: string) => {
    setShowOther(prev => ({ ...prev, [qId]: text }));
    setAnswers(prev => ({ ...prev, [qId]: text as any }));
  };

  const handleComplete = () => {
    const user = {
      ...(currentUser || {}),
      id: currentUser?.id || Math.random().toString(36).substr(2, 9),
      assessmentData: answers,
      createdAt: currentUser?.createdAt || new Date().toISOString(),
    } as any;
    setCurrentUser(user);
    localStorage.setItem('user_assessed', 'true');
    navigate('/');
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-lg w-full text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">测评完成！</h1>
          <p className="text-gray-500 mb-8">你已完成全部{assessmentQuestions.length}道题，我们已生成你的专属人格画像。</p>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
            <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{progress}%</div>
            <div className="text-xs text-gray-400 mt-1">{Object.keys(answers).length}/{assessmentQuestions.length} 题已作答</div>
          </div>
          <button onClick={handleComplete} className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl">开始匹配 →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => navigate(-1)} className="text-gray-400 text-sm">← 返回</button>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentDim?.emoji}</span>
              <span className="font-semibold text-gray-700">{currentDim?.label}</span>
            </div>
            <span className="text-sm text-gray-400">{currentPage + 1}/{totalPages}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{Object.keys(answers).length} 题已作答</span><span>约{Math.ceil((assessmentQuestions.length - Object.keys(answers).length) / QUESTIONS_PER_PAGE)}页剩余</span></div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-6"><div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-2" style={{ backgroundColor: `${currentDim?.color}15`, color: currentDim?.color }}><span>{currentDim?.emoji}</span><span>{currentDim?.label}</span></div><p className="text-gray-400 text-xs">{currentDim?.desc}</p></div>
        <div className="space-y-4">
          {currentQuestions.map((q, qIdx) => {
            const globalIdx = currentPage * QUESTIONS_PER_PAGE + qIdx;
            const currentVal = answers[q.id];
            const otherVal = showOther[q.id] || '';
            return (
              <div key={q.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-4"><span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold flex items-center justify-center mt-0.5">{globalIdx + 1}</span><p className="text-gray-800 font-medium leading-relaxed">{q.text}</p></div>
                {q.type === 'single' && q.options && (
                  <div className="space-y-2 ml-10">
                    {q.options.map((opt, oIdx) => (
                      <button key={oIdx} onClick={() => handleAnswer(q.id, opt.score)} className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm ${currentVal === opt.score ? 'bg-indigo-500 text-white shadow-md scale-[1.01]' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}>{opt.text}</button>
                    ))}
                    {q.allowOther && (
                      <div className="flex gap-2 mt-2">
                        <input type="text" placeholder="其他，请输入..." value={otherVal} onChange={e => handleOtherAnswer(q.id, e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none" />
                      </div>
                    )}
                  </div>
                )}
                {q.type === 'date' && (
                  <div className="ml-10"><input type="date" value={currentVal as string || ''} onChange={e => handleAnswer(q.id, e.target.value ? 1 : 0)} min="1960-01-01" max="2008-12-31" className="px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none" /></div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 mt-8">
          {currentPage > 0 ? <button onClick={() => setCurrentPage(p => p - 1)} className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">← 上一步</button> : <div className="flex-1" />}
          <button onClick={() => currentPage < totalPages - 1 ? setCurrentPage(p => p + 1) : null} disabled={!currentQuestions.every(q => answers[q.id] !== undefined)} className={`flex-1 py-4 rounded-xl font-semibold transition-all ${currentQuestions.every(q => answers[q.id] !== undefined) ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            {currentPage < totalPages - 1 ? '下一步 →' : '完成'}
          </button>
        </div>
        <div className="flex justify-center gap-1.5 mt-6">{dimensions.map(dim => { const qs = assessmentQuestions.filter(q => q.dimension === dim.id); const done = qs.filter(q => answers[q.id] !== undefined).length; const isComplete = done === qs.length; const isCurrent = dim.id === currentDim?.id; return <div key={dim.id} className="w-2 h-2 rounded-full transition-all" style={{ backgroundColor: isComplete ? dim.color : isCurrent ? `${dim.color}80` : '#e5e7eb', transform: isCurrent ? 'scale(1.5)' : 'scale(1)' }} />; })}</div>
      </main>
    </div>
  );
}
