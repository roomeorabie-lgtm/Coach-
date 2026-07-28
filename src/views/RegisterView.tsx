import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MovieVideoPlayer } from '../components/MovieVideoPlayer';
import { Logo } from '../components/Logo';
import { UserPlus, CheckCircle2, AlertCircle, ArrowLeft, Phone, User, Key } from 'lucide-react';

interface RegisterViewProps {
  onNavigate: (tab: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate }) => {
  const { register, t, language } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: t('passwordsDoNotMatch') });
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.password.trim()) {
      setMessage({ type: 'error', text: t('fillAllFields') });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = register({
        name: formData.name,
        phone: formData.phone,
        password: formData.password
      });

      setLoading(false);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    }, 400);
  };

  const isRtl = language === 'ar';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Movie Style Borderless Video Player */}
      <div className="space-y-2 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          {t('heroTag')}
        </span>
        <MovieVideoPlayer title="COACH BODA | Exclusive Transformation Teaser" />
      </div>

      {/* Registration Form Card */}
      <div className="max-w-md mx-auto glass-panel p-8 rounded-3xl border border-emerald-500/30 shadow-2xl glow-emerald">
        <div className="text-center space-y-2 mb-6">
          <Logo size="md" className="justify-center mb-2" />
          <h2 className="font-heading font-black text-2xl text-white uppercase tracking-wider">
            {t('registerTitle')}
          </h2>
          <p className="text-xs text-gray-400">
            {t('registerSubtitle')}
          </p>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-xl border flex items-start gap-3 text-xs ${
            message.type === 'success' 
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{message.text}</p>
          </div>
        )}

        {message?.type === 'success' ? (
          <div className="space-y-4 pt-2">
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3.5 rounded-xl text-sm font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer shadow-lg text-center block"
            >
              {t('loginHere')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                {t('fullNameLabel')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={t('fullNamePlaceholder')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-white focus:outline-none focus:border-emerald-500 ${
                    isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                  }`}
                />
                <User className={`w-4 h-4 text-gray-400 absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                {t('phoneLabel')}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder={t('phonePlaceholder')}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  placeholder={t('passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-white focus:outline-none focus:border-emerald-500 ${
                    isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                  }`}
                />
                <Key className={`w-4 h-4 text-gray-400 absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                {t('confirmPasswordLabel')}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder={t('confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              <UserPlus className="w-4 h-4" />
              {loading ? (isRtl ? 'جاري إرسال الطلب...' : 'Submitting Application...') : t('registerBtn')}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <button
            onClick={() => onNavigate('login')}
            className="text-xs text-gray-400 hover:text-emerald-400 inline-flex items-center gap-1 font-semibold cursor-pointer"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} /> {t('alreadyHaveAccount')} {t('loginHere')}
          </button>
        </div>
      </div>

    </div>
  );
};

