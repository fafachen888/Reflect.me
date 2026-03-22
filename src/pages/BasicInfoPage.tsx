import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { industryCategories } from '../data/mockData';

export default function BasicInfoPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ birthday: '', gender: '', name: '', industry: '', job: '', bio: '', location: '' });
  const selectedIndustry = industryCategories.find(i => i.value === formData.industry);
  const canProceed1 = formData.birthday && formData.gender;
  const canProceed2 = formData.name && formData.industry && formData.job && formData.location;

  const handleComplete = () => {
    if (!canProceed2) return;
    const birthYear = parseInt(formData.birthday.split('-')[0]);
    setCurrentUser({
      id: Math.random().toString(36).substr(2, 9), name: formData.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}&backgroundColor=b6e3f4`,
      gender: formData.gender as any, age: new Date().getFullYear() - birthYear,
      occupation: formData.job, location: formData.location, bio: formData.bio,
      personality: [], attachment: '', communicationStyle: '', relationshipExpectation: '', interests: [], dealBreakers: [], createdAt: new Date().toISOString(),
    });
    localStorage.setItem('user_basic_info', JSON.stringify(formData));
    navigate('/questionnaire');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="text-gray-500 text-sm">{step > 1 ? '← 上一步' : '← 返回'}</button>
          <div className="text-sm font-medium text-gray-500">{step}/2</div>
        </div>
        <div className="h-1 bg-gray-100"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: `${(step / 2) * 100}%` }} /></div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-8">
        {step === 1 ? (
          <div className="space-y-6">
            <div className="text-center mb-8"><div className="text-5xl mb-3">👋</div><h1 className="text-2xl font-bold text-gray-900 mb-2">欢迎加入镜遇</h1><p className="text-gray-500 text-sm">先告诉我们一些基本信息</p></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">出生日期</label>
              <input type="date" value={formData.birthday} onChange={e => setFormData({ ...formData, birthday: e.target.value })} min="1960-01-01" max="2008-12-31" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">你的性别</label>
              <div className="grid grid-cols-3 gap-3">
                {[{ value: 'female', label: '女', emoji: '♀' }, { value: 'male', label: '男', emoji: '♂' }, { value: 'other', label: '其他', emoji: '⚥' }].map(opt => (
                  <button key={opt.value} onClick={() => setFormData({ ...formData, gender: opt.value })} className={`py-4 rounded-xl border-2 font-semibold text-sm transition-all ${formData.gender === opt.value ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                    <span className="text-xl mb-1 block">{opt.emoji}</span>{opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center mb-6"><h1 className="text-2xl font-bold text-gray-900 mb-2">完善你的资料</h1><p className="text-gray-500 text-sm">让其他人更好地了解你</p></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-2">昵称</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="你希望怎么称呼" maxLength={20} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-2">行业</label><select value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value, job: '' })} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none bg-white"><option value="">请选择你的行业</option>{industryCategories.map(ind => <option key={ind.value} value={ind.value}>{ind.label}</option>)}</select></div>
            {formData.industry && <div><label className="block text-sm font-semibold text-gray-700 mb-2">岗位</label><select value={formData.job} onChange={e => setFormData({ ...formData, job: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none bg-white"><option value="">请选择你的岗位</option>{selectedIndustry?.jobs.map(job => <option key={job} value={job}>{job}</option>)}</select></div>}
            <div><label className="block text-sm font-semibold text-gray-700 mb-2">所在城市</label><input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="如：北京、上海、杭州" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-2">个人简介 <span className="text-gray-400 font-normal">(选填)</span></label><textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="介绍一下你自己~" rows={3} maxLength={200} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none bg-white resize-none" /><p className="text-xs text-gray-400 mt-1 text-right">{formData.bio.length}/200</p></div>
          </div>
        )}
        <div className="mt-8 flex gap-3">
          {step > 1 && <button onClick={() => setStep(step - 1)} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold">上一步</button>}
          <button onClick={step === 1 ? () => setStep(2) : handleComplete} disabled={step === 1 ? !canProceed1 : !canProceed2} className={`flex-1 py-4 rounded-xl font-semibold transition-all ${(step === 1 ? canProceed1 : canProceed2) ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            {step === 1 ? '下一步 →' : '开始测评 →'}
          </button>
        </div>
      </main>
    </div>
  );
}
