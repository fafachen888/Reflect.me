import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { demoUserA } from '../data/mockData';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser, loadDemoData } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'password' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSendCode = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) { alert('请输入正确的手机号'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('code'); }, 800);
  };

  const handlePasswordLogin = () => {
    if (!phone || !password) { alert('请输入手机号和密码'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // 模拟登录成功，判断是否已完成测评
      const hasCompletedAssessment = localStorage.getItem(`user_${phone}_assessed`);
      if (hasCompletedAssessment) {
        loadDemoData();
        navigate('/');
      } else {
        setCurrentUser(demoUserA);
        navigate('/basic-info');
      }
    }, 800);
  };

  const handleVerify = () => {
    if (code.length !== 6) { alert('请输入6位验证码'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentUser(demoUserA);
      // 判断是否新用户
      if (isNewUser || !localStorage.getItem('user_assessed')) {
        navigate('/basic-info');
      } else {
        loadDemoData();
        navigate('/');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <span className="font-black text-2xl text-gray-800">镜遇<span className="text-indigo-500">.</span></span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {step === 'phone' ? '登录或注册' : step === 'password' ? '输入密码' : '输入验证码'}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              {step === 'phone' ? '登录即表示同意用户协议' : step === 'password' ? `欢迎回来，${phone.slice(0,3)}***${phone.slice(-4)}` : `验证码已发送至 ${phone.slice(0,3)}***${phone.slice(-4)}`}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100/50">
            {step === 'phone' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="请输入手机号"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-lg"
                    maxLength={11}
                  />
                </div>
                
                {/* Password option */}
                <button
                  onClick={() => { if (/^1[3-9]\d{9}$/.test(phone)) setStep('password'); else alert('请先输入正确的手机号'); }}
                  className="w-full py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  使用密码登录
                </button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">或</span></div>
                </div>
                
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50"
                >
                  {loading ? '发送中...' : '获取验证码'}
                </button>
                
                <p className="text-center text-xs text-gray-400 mt-2">
                  未注册手机号将自动创建账号
                </p>
              </div>
            )}

            {step === 'password' && (
              <div className="space-y-4">
                <button onClick={() => setStep('phone')} className="text-sm text-indigo-600 hover:underline mb-2">← 返回</button>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none transition-all"
                    autoFocus
                  />
                </div>
                <button className="text-xs text-indigo-600 hover:underline">忘记密码？</button>
                <button onClick={handlePasswordLogin} disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                  {loading ? '登录中...' : '登录'}
                </button>
              </div>
            )}

            {step === 'code' && (
              <div className="space-y-4">
                <button onClick={() => setStep('phone')} className="text-sm text-indigo-600 hover:underline mb-2">← 返回</button>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">验证码</label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="请输入6位验证码"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none transition-all text-lg text-center tracking-widest"
                    maxLength={6}
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleSendCode}
                  className="w-full text-indigo-600 text-sm font-medium hover:underline"
                >
                  重新发送验证码
                </button>
                <button onClick={handleVerify} disabled={loading || code.length !== 6} className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                  {loading ? '验证中...' : '验证并登录'}
                </button>
              </div>
            )}

            {/* Demo */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-center text-xs text-gray-400 mb-3">想先快速体验完整流程？</p>
              <button
                onClick={() => { loadDemoData(); navigate('/'); }}
                className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                🚀 快速体验 Demo（跳过登录）
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            登录即表示同意<span className="text-indigo-600 cursor-pointer">《用户协议》</span>和<span className="text-indigo-600 cursor-pointer">《隐私政策》</span>
          </p>
        </div>
      </div>
    </div>
  );
}
