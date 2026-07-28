import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  CheckCircle2, 
  MessageSquare, 
  Instagram, 
  Facebook, 
  Youtube, 
  Video, 
  ShieldCheck, 
  Dumbbell, 
  Trophy 
} from 'lucide-react';

export const CoachProfileView: React.FC = () => {
  const { db, t } = useApp();
  const profile = db.coachProfile;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* Header Profile Hero Card */}
      <div className="glass-panel rounded-3xl p-8 md:p-12 border border-emerald-500/30 shadow-2xl glow-emerald">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl group">
              <img 
                src={profile.photo || "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop"} 
                alt={profile.name} 
                className="w-full h-96 sm:h-[480px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> {t('verifiedMasterCoach')}
                </span>
                <span className="text-xs font-mono font-bold text-black bg-emerald-400 px-2 py-0.5 rounded">
                  {profile.experienceYears}+ {t('yearsExp')}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                {t('headCoachFounder')}
              </span>
              <h1 className="font-heading font-black text-4xl sm:text-5xl text-white uppercase mt-1">
                {profile.name}
              </h1>
              <p className="text-sm font-semibold text-emerald-400 mt-1">
                {profile.title}
              </p>
            </div>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {profile.biography}
            </p>

            {/* Statistics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-black/50 border border-white/10 rounded-2xl">
              <div>
                <span className="font-heading font-black text-2xl text-white block">
                  {profile.experienceYears}+
                </span>
                <span className="text-[11px] text-gray-400 uppercase font-semibold">{t('yearsExp')}</span>
              </div>
              <div>
                <span className="font-heading font-black text-2xl text-emerald-400 block">
                  {profile.clientsTransformed}+
                </span>
                <span className="text-[11px] text-gray-400 uppercase font-semibold">{t('transformedLives')}</span>
              </div>
              <div>
                <span className="font-heading font-black text-2xl text-white block">
                  100%
                </span>
                <span className="text-[11px] text-gray-400 uppercase font-semibold">{t('dedication')}</span>
              </div>
            </div>

            {/* Certifications list */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" /> {t('professionalCerts')}
              </h3>
              <div className="space-y-2">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-xs text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Social & WhatsApp Buttons - ONLY SHOWN IF LINK IS NON-EMPTY */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {profile.whatsappNumber && profile.whatsappNumber.trim() !== '' && (
                <a
                  href={`https://wa.me/${profile.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer shadow-lg glow-emerald"
                >
                  <MessageSquare className="w-4 h-4" />
                  {t('whatsappCoach')}
                </a>
              )}

              {profile.instagramUrl && profile.instagramUrl.trim() !== '' && (
                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-white/5 text-gray-300 hover:text-emerald-400 border border-white/10 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}

              {profile.facebookUrl && profile.facebookUrl.trim() !== '' && (
                <a
                  href={profile.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-white/5 text-gray-300 hover:text-emerald-400 border border-white/10 transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}

              {profile.tiktokUrl && profile.tiktokUrl.trim() !== '' && (
                <a
                  href={profile.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-white/5 text-gray-300 hover:text-emerald-400 border border-white/10 transition-colors font-extrabold text-xs"
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
                  className="p-3.5 rounded-xl bg-white/5 text-gray-300 hover:text-emerald-400 border border-white/10 transition-colors"
                  title="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}

              {profile.telegramUrl && profile.telegramUrl.trim() !== '' && (
                <a
                  href={profile.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-white/5 text-sky-400 hover:text-emerald-400 border border-white/10 transition-colors font-bold text-xs flex items-center gap-1.5"
                  title="Telegram"
                >
                  Telegram
                </a>
              )}

              {profile.xTwitterUrl && profile.xTwitterUrl.trim() !== '' && (
                <a
                  href={profile.xTwitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-white/5 text-gray-300 hover:text-emerald-400 border border-white/10 transition-colors font-extrabold text-xs"
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
                  className="px-4 py-3.5 rounded-xl bg-white/5 text-emerald-400 hover:bg-white/10 border border-white/10 transition-colors font-bold text-xs"
                  title={link.platform}
                >
                  {link.platform}
                </a>
              ))}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
