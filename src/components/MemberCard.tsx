import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { ShieldCheck, Clock, AlertTriangle, QrCode } from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';

interface MemberCardProps {
  user: User;
  onEditProfile?: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ user, onEditProfile }) => {
  const { t, language } = useApp();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!user.subscriptionEnd) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      const end = new Date(user.subscriptionEnd).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { days, hours, minutes, seconds, isExpired: false };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [user.subscriptionEnd]);

  const isApproved = user.status === 'approved';
  const isActive = isApproved && !timeLeft.isExpired;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#141414] via-[#0d1612] to-[#080808] border border-emerald-500/30 p-6 md:p-8 shadow-2xl glow-emerald">
      {/* Background Decorative Accents */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Logo showText={false} size="sm" />
          <div>
            <h3 className="font-heading font-black tracking-wider text-xl text-white">
              COACH <span className="text-emerald-400">BODA</span>
            </h3>
            <p className="text-[10px] tracking-widest text-emerald-500 font-bold uppercase">
              {t('memberCardTitle')}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isActive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t('activeSub')}
            </span>
          ) : isApproved ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <AlertTriangle className="w-3.5 h-3.5" />
              {t('expiredSub')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
              <Clock className="w-3.5 h-3.5" />
              {t('pendingSub')}
            </span>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
        {/* Profile Avatar & ID info */}
        <div className="md:col-span-5 flex items-center gap-4">
          <div className="relative group flex-shrink-0">
            <img 
              src={user.profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"} 
              alt={user.name} 
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black p-1 rounded-full shadow-md">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block mb-1">
              {t('memberName')}
            </span>
            <h2 className="font-heading font-extrabold text-xl md:text-2xl text-white leading-tight">
              {user.name}
            </h2>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">{t('membershipId')}:</span>
              <span className="font-mono text-sm font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                {user.membershipId}
              </span>
            </div>
            {user.phone && (
              <p className="text-xs text-gray-400 mt-1 font-mono">
                {user.phone}
              </p>
            )}
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="md:col-span-7 bg-black/50 border border-white/10 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              {t('subRemaining')}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              {timeLeft.days} {t('days')}
            </span>
          </div>

          {timeLeft.isExpired ? (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-sm font-medium text-center">
              {t('lockReasonExpired')}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 text-center" dir="ltr">
              <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-lg p-2">
                <span className="font-mono text-xl md:text-2xl font-black text-white">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                  {t('days')}
                </span>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-lg p-2">
                <span className="font-mono text-xl md:text-2xl font-black text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                  {t('hours')}
                </span>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-lg p-2">
                <span className="font-mono text-xl md:text-2xl font-black text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                  {t('minutes')}
                </span>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-lg p-2">
                <span className="font-mono text-xl md:text-2xl font-black text-emerald-400 animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                  {t('seconds')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Bar */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-[11px] text-gray-300 uppercase">COACH BODA OFFICIAL PASS</span>
        </div>

        {onEditProfile && (
          <button 
            onClick={onEditProfile}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 cursor-pointer transition-colors"
          >
            {t('profile')}
          </button>
        )}
      </div>
    </div>
  );
};

