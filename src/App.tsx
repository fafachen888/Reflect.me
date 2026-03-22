import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import WaterfallPage from './pages/WaterfallPage';
import BasicInfoPage from './pages/BasicInfoPage';
import QuestionnairePage from './pages/QuestionnairePage';
import InviteMatchPage from './pages/InviteMatchPage';
import MatchResultPage from './pages/MatchResultPage';
import ReportPage from './pages/ReportPage';
import SimulationPage from './pages/SimulationPage';
import NetworkSimulationPage from './pages/NetworkSimulationPage';
import ChatPage from './pages/ChatPage';
import ChatListPage from './pages/ChatListPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<WaterfallPage />} />
          <Route path="/basic-info" element={<BasicInfoPage />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/invite-match" element={<InviteMatchPage />} />
          <Route path="/match-result" element={<MatchResultPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/network-simulation" element={<NetworkSimulationPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat-list" element={<ChatListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
export default App;
