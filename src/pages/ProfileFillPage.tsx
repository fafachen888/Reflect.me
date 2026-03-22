import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { assessmentQuestions, dimensions, AssessmentData } from '../data/mockData';

const QUESTIONS_PER_PAGE = 5;

export default function ProfileFillPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useApp();
  const [answers, setAnswers] = useState<AssessmentData>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const totalQuestions = assessmentQuestions.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const currentQuestions = assessmentQuestions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );
  
  const currentDim = dimensions.find(d => d.id === currentQuestions[0]?.dimension);
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  
  const handleAnswer = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };
  
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setCompleted(true);
    }
  };
  
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const canProceed = currentQuestions.every(q => answers[q.id] !== undefined);
  const isLastPage = currentPage === totalPages - 1;
  
  // 完成后保存并跳转
  const handleComplete = () => {
    const user = {
      ...(currentUser || {}),
      id: currentUser?.id || generateId(),
      assessmentData: answers,
      avatar: currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'user'}&backgroundColor=b6e3f4`,
      createdAt: currentUser?.createdAt || new Date().toISOString(),
    };
    setCurrentUser(user as any);
    navigate('/match-select');
  };
  
  // 进度条颜色
  const getProgressColor = () => {
    if (progress < 30) return 'from-rose-400 to-pink-500';
    if (progress < 60) return 'from-amber-400 to-orange-500';
    if (progress < 90) return 'from-blue-400 to-indigo-500';
    return 'from-emerald-400 to-teal-500';
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-lg w-full text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">测评完成！</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            你已完成全部{totalQuestions}道测评题。<br />
            我们已生成你的专属人格画像。
          </p>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
            <div className="text-sm text-indigo-600 mb-2 font-medium">测评进度</div>
            <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {progress}%
            </div>
            <div className="text-xs text-gray-400 mt-1">{answeredCount}/{totalQuestions} 题已作答</div>
          </div>
          <button
            onClick={handleComplete}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-indigo-200 transition-all"
          >
            开始匹配 →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 text-sm">← 返回</button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentDim?.emoji || '📋'}</span>
              <span className="font-semibold text-gray-700">{currentDim?.label || '测评'}</span>
            </div>
            <span className="text-sm text-gray-400">{currentPage + 1}/{totalPages}</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{answeredCount} 题已作答</span>
            <span>约 {Math.ceil((totalQuestions - answeredCount) / QUESTIONS_PER_PAGE)} 分钟剩余</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Dimension intro */}
        <div className="text-center mb-6">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-2"
            style={{ backgroundColor: `${currentDim?.color}15`, color: currentDim?.color }}
          >
            <span>{currentDim?.emoji}</span>
            <span>{currentDim?.label}</span>
          </div>
          <p className="text-gray-400 text-xs">{currentDim?.desc}</p>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {currentQuestions.map((q, qIndex) => {
            const globalIndex = currentPage * QUESTIONS_PER_PAGE + qIndex;
            const selectedScore = answers[q.id];
            
            return (
              <div key={q.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold flex items-center justify-center mt-0.5">
                    {globalIndex + 1}
                  </span>
                  <p className="text-gray-800 font-medium leading-relaxed">{q.text}</p>
                </div>
                
                <div className="space-y-2 ml-10">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = selectedScore === opt.score;
                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswer(q.id, opt.score)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm ${
                          isSelected
                            ? 'bg-indigo-500 text-white shadow-md scale-[1.01]'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className={isSelected ? 'opacity-90' : ''}>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {currentPage > 0 ? (
            <button
              onClick={handlePrev}
              className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              ← 上一步
            </button>
          ) : (
            <div className="flex-1" />
          )}
          
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex-1 py-4 rounded-2xl font-semibold transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLastPage ? '完成测评 ✓' : '下一步 →'}
          </button>
        </div>

        {/* Dimension dots */}
        <div className="flex justify-center gap-1.5 mt-6 flex-wrap">
          {dimensions.map(dim => {
            const dimQuestions = assessmentQuestions.filter(q => q.dimension === dim.id);
            const answered = dimQuestions.filter(q => answers[q.id] !== undefined).length;
            const isComplete = answered === dimQuestions.length;
            const isCurrent = dim.id === currentDim?.id;
            
            return (
              <div
                key={dim.id}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: isComplete ? dim.color : isCurrent ? `${dim.color}80` : '#e5e7eb',
                  transform: isCurrent ? 'scale(1.5)' : 'scale(1)',
                }}
                title={dim.label}
              />
            );
          })}
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-2">
          <span style={{ color: 'var(--tw-prose-links-invert)' }}>{dimensions.find(d => d.id === currentDim?.id)?.label}</span> · 
          {Object.keys(answers).length}/{totalQuestions} 已完成
        </p>
      </main>
    </div>
  );
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
