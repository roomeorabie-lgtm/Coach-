import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MovieVideoPlayer } from '../components/MovieVideoPlayer';
import { Logo } from '../components/Logo';
import { LogIn, Key, Phone, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onNavigate: (tab: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { login, t, language } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = login(phone, password);
      setLoading(false);
      if (res.success) {
        // If logged in as admin Ramadan, navigate to admin dashboard, else home
        if (phone.trim().toLowerCase() === 'ramadan' || phone.trim() === '01000000000') {
          onNavigate('admin');
        } else {
          onNavigate('home');
        }
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const isRtl = language === 'ar';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Movie Style Borderless Video Player Header */}
      <div className="space-y-2 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          {t('heroTag')}
        </span>
        <MovieVideoPlayer title="COACH BODA | High Intensity Training Showcase" />
      </div>

      {/* Login Card Container */}
      <div className="max-w-md mx-auto glass-panel p-8 rounded-3xl border border-emerald-500/30 shadow-2xl glow-emerald">
        <div className="text-center space-y-2 mb-6">
          <Logo size="md" className="justify-center mb-2" />
          <h2 className="font-heading font-black text-2xl text-white uppercase tracking-wider">
            {t('loginTitle')}
          </h2>
          <p className="text-xs text-gray-400">
            {t('loginSubtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 mb-6 bg-rose-500/20 border border-rose-500/40 rounded-xl flex items-start gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              {t('phoneLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phonePlaceholder')}
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-white focus:outline-none focus:border-emerald-500 ${
                  isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
              />
              <Phone className={`w-4 h-4 text-gray-400 absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-white focus:outline-none focus:border-emerald-500 ${
                  isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
              />
              <Key className={`w-4 h-4 text-gray-400 absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer shadow-lg glow-emerald flex items-center justify-center gap-2"
          >
            {loading ? (isRtl ? 'جاري التحقق...' : 'Authenticating...') : (
              <>
                <LogIn className="w-4 h-4" />
                {t('loginBtn')}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-3">
          <p className="text-xs text-gray-400">
            {t('noAccount')}
          </p>
          <button
            onClick={() => onNavigate('register')}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all cursor-pointer"
          >
            {t('registerHere')}
          </button>
        </div>
      </div>

    </div>
  );
};

