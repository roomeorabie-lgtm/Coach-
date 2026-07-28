import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { 
  Dumbbell, 
  Trophy, 
  Film, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  Home, 
  PhoneCall, 
  LayoutDashboard,
  Globe,
  Tag
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate }) => {
  const { currentUser, logout, language, setLanguage, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isApproved = currentUser?.status === 'approved';
  const hasActiveSubscription = currentUser?.subscriptionEnd && new Date(currentUser.subscriptionEnd).getTime() > new Date().getTime();
  const canAccessWorkouts = currentUser?.role === 'admin' || (isApproved && hasActiveSubscription);

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    ...(canAccessWorkouts ? [{ id: 'workouts', label: t('workouts'), icon: Dumbbell }] : []),
    { id: 'coach', label: t('coach'), icon: UserIcon },
    { id: 'transformations', label: t('transformations'), icon: Trophy },
    { id: 'reels', label: t('reels'), icon: Film },
    { id: 'pricing', label: t('pricing'), icon: Tag },
    { id: 'contact', label: t('contact'), icon: PhoneCall },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}>
          <Logo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Globe Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-200 bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 transition-all cursor-pointer"
            title="Switch Language / تغيير اللغة"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    currentTab === 'admin'
                      ? 'bg-emerald-500 text-black shadow-lg glow-emerald'
                      : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/20'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t('admin')}
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentTab === 'profile'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <img 
                    src={currentUser.profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop"} 
                    alt={currentUser.name} 
                    className="w-6 h-6 rounded-full object-cover border border-emerald-400"
                  />
                  <span>{currentUser.name.split(' ')[0]}</span>
                </button>
              )}

              <button
                onClick={() => { logout(); onNavigate('home'); }}
                className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title={t('logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                {t('login')}
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer shadow-md glow-emerald"
              >
                <UserPlus className="w-4 h-4" />
                {t('register')}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          {/* Globe Language Switcher for Mobile */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-emerald-400 text-xs font-bold flex items-center gap-1"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'ar' ? 'EN' : 'ع'}</span>
          </button>

          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold"
            >
              {t('admin')}
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-gray-300 bg-white/5 border border-white/10 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0d0d] border-b border-white/10 px-4 py-6 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold w-full cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 w-full"
              >
                <LayoutDashboard className="w-5 h-5" />
                {t('admin')}
              </button>
            )}

            {currentUser && currentUser.role === 'member' && (
              <button
                onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-200 bg-white/5 w-full"
              >
                <UserIcon className="w-5 h-5 text-emerald-400" />
                {t('profile')}
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-white/10">
            {currentUser ? (
              <button
                onClick={() => { logout(); onNavigate('home'); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                  className="py-3 rounded-xl text-sm font-bold text-white bg-white/10 text-center"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}
                  className="py-3 rounded-xl text-sm font-black text-black bg-emerald-500 text-center uppercase tracking-wider"
                >
                  {t('register')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

