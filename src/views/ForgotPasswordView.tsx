import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { KeyRound, ArrowLeft, CheckCircle2, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ForgotPasswordView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { db } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fade-in">
      <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 shadow-2xl glow-emerald text-center space-y-6">
        <Logo size="md" className="justify-center" />

        <div className="space-y-1">
          <h2 className="font-heading font-black text-2xl text-white uppercase">
            RECOVER ACCOUNT
          </h2>
          <p className="text-xs text-gray-400">
            Enter your email to request a password reset or contact Coach Boda directly.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-heading font-bold text-lg text-white">Reset Request Sent!</h4>
            <p className="text-xs text-gray-300">
              If an account with <strong className="text-white">{email}</strong> exists, Coach Boda will send password reset instructions to your email or WhatsApp.
            </p>
            <a
              href={`https://wa.me/${db.coachProfile.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 text-black text-xs font-extrabold uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp Coach Boda Directly
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="registered@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-sm font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer shadow-lg glow-emerald"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => onNavigate('login')}
            className="text-xs text-gray-400 hover:text-emerald-400 inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
