import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { HomeView } from './views/HomeView';
import { WorkoutsView } from './views/WorkoutsView';
import { TransformationsView } from './views/TransformationsView';
import { ReelsView } from './views/ReelsView';
import { CoachProfileView } from './views/CoachProfileView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { ForgotPasswordView } from './views/ForgotPasswordView';
import { ProfileSettingsView } from './views/ProfileSettingsView';
import { AdminDashboardView } from './views/AdminDashboardView';

function MainAppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const { currentUser, language } = useApp();

  // Scroll to top on tab switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
  };

  const isRtl = language === 'ar';

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className={`min-h-screen bg-[#080808] text-gray-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black font-sans ${isRtl ? 'font-sans-ar' : ''}`}
    >
      
      {/* Sticky Header */}
      <Header currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && <HomeView onNavigate={handleNavigate} />}
        {currentTab === 'workouts' && <WorkoutsView onNavigate={handleNavigate} />}
        {currentTab === 'transformations' && <TransformationsView />}
        {currentTab === 'reels' && <ReelsView />}
        {currentTab === 'coach' && <CoachProfileView />}
        {currentTab === 'pricing' && <HomeView onNavigate={handleNavigate} scrollTo="pricing" />}
        {currentTab === 'contact' && <HomeView onNavigate={handleNavigate} scrollTo="contact" />}
        {currentTab === 'login' && <LoginView onNavigate={handleNavigate} />}
        {currentTab === 'register' && <RegisterView onNavigate={handleNavigate} />}
        {currentTab === 'forgot-password' && <ForgotPasswordView onNavigate={handleNavigate} />}
        {currentTab === 'profile' && <ProfileSettingsView />}
        {currentTab === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminDashboardView />
          ) : (
            <LoginView onNavigate={handleNavigate} />
          )
        )}
      </main>

      {/* Professional Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
