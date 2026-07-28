import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { Phone, MessageSquare, Instagram, Facebook, Youtube, Send, Globe, Settings, Share2 } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { currentUser, db, t, language } = useApp();
  const profile = db.coachProfile;
  const isRtl = language === 'ar';

  const isApproved = currentUser?.status === 'approved';
  const hasActiveSubscription = currentUser?.subscriptionEnd && new Date(currentUser.subscriptionEnd).getTime() > new Date().getTime();
  const canAccessWorkouts = currentUser?.role === 'admin' || (isApproved && hasActiveSubscription);

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div onClick={() => onNavigate('home')}>
              <Logo size="lg" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              {profile.biography}
            </p>
            
            {/* All Social Media Icons - ONLY SHOWN IF LINK IS NON-EMPTY */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {profile.whatsappNumber && profile.whatsappNumber.trim() !== '' && (
                <a 
                  href={`https://wa.me/${profile.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 transition-all cursor-pointer"
                  title={t('whatsappCoach')}
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              )}
              {profile.instagramUrl && profile.instagramUrl.trim() !== '' && (
                <a 
                  href={profile.instagramUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 text-gray-300 hover:text-emerald-400 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.facebookUrl && profile.facebookUrl.trim() !== '' && (
                <a 
                  href={profile.facebookUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 text-gray-300 hover:text-emerald-400 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {profile.tiktokUrl && profile.tiktokUrl.trim() !== '' && (
                <a 
                  href={profile.tiktokUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 text-gray-300 hover:text-emerald-400 hover:bg-white/10 border border-white/10 transition-all cursor-pointer font-black text-xs px-3"
                  title="TikTok"
                >
                  TikTok
                </a>
              )}
              {profile.youtubeUrl && profile.youtubeUrl.trim() !== '' && (
                <a 
                  href={profile.youtubeUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 text-gray-300 hover:text-emerald-400 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {profile.telegramUrl && profile.telegramUrl.trim() !== '' && (
                <a 
                  href={profile.telegramUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 text-sky-400 hover:text-emerald-400 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                  title="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              {profile.xTwitterUrl && profile.xTwitterUrl.trim() !== '' && (
                <a 
                  href={profile.xTwitterUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 text-gray-300 hover:text-emerald-400 hover:bg-white/10 border border-white/10 transition-all cursor-pointer font-extrabold text-xs px-3"
                  title="X (Twitter)"
                >
                  X
                </a>
              )}
              {profile.customSocialLinks && profile.customSocialLinks.filter(l => l.url && l.url.trim() !== '').map(link => (
                <a 
                  key={link.id}
                  href={link.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 text-emerald-400 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title={link.platform}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-heading font-extrabold text-white text-sm uppercase tracking-wider mb-4 ${isRtl ? 'border-r-2 pr-3' : 'border-l-2 pl-3'} border-emerald-500`}>
              {t('quickNavigation')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('home')}
                </button>
              </li>
              {canAccessWorkouts && (
                <li>
                  <button onClick={() => onNavigate('workouts')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                    {t('workouts')}
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => onNavigate('transformations')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('transformations')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reels')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('reels')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('pricing')}
                </button>
              </li>
            </ul>
          </div>

          {/* Member & Coach */}
          <div>
            <h4 className={`font-heading font-extrabold text-white text-sm uppercase tracking-wider mb-4 ${isRtl ? 'border-r-2 pr-3' : 'border-l-2 pl-3'} border-emerald-500`}>
              {t('platformAndCoach')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('coach')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('coach')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('contact')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('login')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('register')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className={`font-heading font-extrabold text-white text-sm uppercase tracking-wider mb-4 ${isRtl ? 'border-r-2 pr-3' : 'border-l-2 pl-3'} border-emerald-500`}>
              {t('coachBodaDirect')}
            </h4>
            <div className="space-y-3 text-xs">
              <p className="text-gray-300 font-semibold">
                {t('readyForTransformation')}
              </p>
              <a 
                href={`https://wa.me/${profile.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold uppercase tracking-wider shadow-md hover:bg-emerald-400 transition-all cursor-pointer glow-emerald text-center"
              >
                <Phone className="w-4 h-4" />
                {t('whatsappCoach')}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits with Discreet "Settings" Link */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} COACH BODA. {t('copyright')}</p>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{t('poweredBy')}</span>
            
            {/* Discreet Settings Link for Coach/Admin Login */}
            <button
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-1 text-[11px] text-gray-600 hover:text-gray-400 transition-colors cursor-pointer"
              title={t('settings')}
            >
              <Settings className="w-3 h-3" />
              <span>{t('settings')}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

