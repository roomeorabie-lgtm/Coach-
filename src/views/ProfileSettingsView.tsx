import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MemberCard } from '../components/MemberCard';
import { ImageUploader } from '../components/ImageUploader';
import { User, CheckCircle2, AlertCircle, Save, Key, Phone, Camera } from 'lucide-react';

export const ProfileSettingsView: React.FC = () => {
  const { currentUser, updateUserProfile, t, language } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <p className="text-sm text-gray-400">
          {language === 'ar' ? 'يرجى تسجيل الدخول لعرض إعدادات الحساب.' : 'Please log in to view your profile settings.'}
        </p>
      </div>
    );
  }

  const [name, setName] = useState(currentUser.name);
  const [password, setPassword] = useState(currentUser.password);
  const [profilePhoto, setProfilePhoto] = useState(currentUser.profilePhoto || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const res = updateUserProfile(currentUser.id, {
      name,
      password,
      profilePhoto,
      phone
    });

    if (res.success) {
      setMessage({ type: 'success', text: res.message });
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-fade-in">
      
      {/* Member Pass Preview Card */}
      <MemberCard user={currentUser} />

      {/* Edit Profile Settings Card */}
      <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 shadow-xl space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h2 className="font-heading font-extrabold text-2xl text-white uppercase">
            {t('profileSettingsTitle')}
          </h2>
          <p className="text-xs text-gray-400">
            {t('profileSettingsSub')}
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
            message.type === 'success' 
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
          }`}>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p>{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                {t('fullNameLabel')}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                {t('phoneLabel')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              {t('passwordLabel')}
            </label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono text-emerald-400"
            />
          </div>

          <div>
            <ImageUploader
              label={t('profilePhotoUrl')}
              value={profilePhoto}
              onChange={setProfilePhoto}
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer shadow-lg glow-emerald inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {t('saveProfileChanges')}
          </button>
        </form>
      </div>

    </div>
  );
};
