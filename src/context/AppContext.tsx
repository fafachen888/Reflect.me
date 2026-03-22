import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_CONFIG, getToken, setToken, clearToken } from '../config';
import { demoUserA, demoUserB } from '../data/mockData';

interface AppContextType {
  currentUser: any;
  setCurrentUser: (u: any) => void;
  currentMatch: any;
  setCurrentMatch: (m: any) => void;
  isLoggedIn: boolean;
  loadDemoData: () => void;
  logout: () => void;
  token: string | null;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentMatch, setCurrentMatch] = useState<any>(null);
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mirrorworld_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setCurrentUser(u);
        setCurrentMatch({ userA: u, userB: null });
      } catch {}
    }
    setTokenState(getToken());
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mirrorworld_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const loadDemoData = useCallback(() => {
    const demoUser = { ...demoUserA, assessmentData: { answers: {}, dimensionScores: { basic: 72, family: 80, personality: 85, love: 75, value: 78, communicate: 80, interest: 70, expect: 72, habit: 75 } } };
    setCurrentUser(demoUser);
    const match = { userA: demoUser, userB: demoUserB, overallScore: 78, matchLevel: '较好匹配', createdAt: new Date().toISOString() };
    setCurrentMatch(match);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentMatch(null);
    clearToken();
    setTokenState(null);
    localStorage.removeItem('mirrorworld_user');
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      currentMatch, setCurrentMatch,
      isLoggedIn: !!currentUser,
      loadDemoData, logout, token,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
