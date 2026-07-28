import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WorkoutVideo } from '../types';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { 
  Search, 
  Dumbbell, 
  Play, 
  X,
  Layers,
  Lock,
  Clock,
  ShieldAlert,
  UserCheck,
  LogIn,
  UserPlus
} from 'lucide-react';

interface WorkoutsViewProps {
  onNavigate?: (tab: string) => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({ onNavigate }) => {
  const { db, currentUser, t, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeVideoModal, setActiveVideoModal] = useState<WorkoutVideo | null>(null);

  const isRtl = language === 'ar';

  // Check user subscription status
  const isApproved = currentUser?.status === 'approved';
  const hasActiveSubscription = currentUser?.subscriptionEnd && new Date(currentUser.subscriptionEnd).getTime() > new Date().getTime();
  const canAccessWorkouts = currentUser?.role === 'admin' || (isApproved && hasActiveSubscription);

  // Dynamic Muscle Groups & Categories from existing videos and standard sets
  const muscleGroups: string[] = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Abs & Core', 'Full Body'];
  const categories: string[] = ['All', 'Hypertrophy', 'Strength', 'Fat Loss', 'Mobility', 'Endurance'];
  const difficulties: string[] = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Elite'];

  // Instant Search Filtering Logic
  const filteredVideos = db.videos.filter(video => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      !query || 
      video.title.toLowerCase().includes(query) ||
      video.muscleGroup.toLowerCase().includes(query) ||
      video.category.toLowerCase().includes(query) ||
      video.equipment.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query);

    const matchesMuscle = selectedMuscle === 'All' || video.muscleGroup === selectedMuscle;
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || video.difficulty === selectedDifficulty;

    return matchesSearch && matchesMuscle && matchesCategory && matchesDifficulty;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMuscle('All');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
  };

  // 1. If not logged in -> Show access lock screen
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in text-center space-y-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/30 shadow-2xl glow-emerald relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-20 h-20 bg-emerald-950/80 border-2 border-emerald-500/40 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl text-emerald-400">
            <Lock className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
            {t('privateAccessOnly')}
          </span>

          <h1 className="font-heading font-black text-2xl sm:text-4xl text-white uppercase tracking-tight max-w-xl mx-auto">
            {t('workoutsAccessDeniedTitle')}
          </h1>

          <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed mt-3">
            {t('workoutsAccessDeniedSub')}
          </p>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
            {onNavigate && (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-6 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer shadow-lg glow-emerald flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  {t('loginBtn')}
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-6 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  {t('registerBtn')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. If logged in but NOT approved or subscription expired -> Show status lock screen
  if (!canAccessWorkouts) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in text-center space-y-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 bg-amber-950/80 border-2 border-amber-500/40 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl text-amber-400">
            {isApproved ? <ShieldAlert className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
            {!isApproved ? t('pendingApprovalTitle') : t('subscriptionExpiredTitle')}
          </span>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight max-w-xl mx-auto">
            {!isApproved ? t('pendingApprovalTitle') : t('subscriptionExpiredTitle')}
          </h1>

          <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed mt-3">
            {!isApproved ? t('pendingApprovalSub') : t('lockReasonExpired')}
          </p>

          <div className="pt-8">
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 transition-all shadow-lg glow-emerald"
            >
              Contact Coach Boda on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. Approved active member / Admin view -> Full Workout Video Library
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <Dumbbell className="w-4 h-4" />
          {t('workoutsTitle')}
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
          COACH BODA <span className="text-emerald-500">{t('workoutsTitle')}</span>
        </h1>
        <p className="text-sm text-gray-300 max-w-2xl mx-auto">
          {t('workoutsSubtitle')}
        </p>
      </div>

      {/* Instant Search Bar & Filter Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 shadow-xl space-y-4">
        
        {/* Main Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'ابحث باسم التمرين أو المجموعة العضلية...' : 'Search by Title, Muscle Group, Equipment...'}
            className={`w-full bg-black/60 border border-white/10 rounded-2xl py-4 text-sm md:text-base text-white focus:outline-none focus:border-emerald-500 shadow-inner placeholder:text-gray-500 ${
              isRtl ? 'pr-12 pl-10' : 'pl-12 pr-10'
            }`}
          />
          <Search className={`w-5 h-5 text-emerald-400 absolute top-4.5 ${isRtl ? 'right-4' : 'left-4'}`} />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className={`absolute top-4.5 text-gray-400 hover:text-white ${isRtl ? 'left-4' : 'right-4'}`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Pills Grid */}
        <div className="space-y-3 pt-2">
          {/* Muscle Group Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 shrink-0 flex items-center gap-1 mx-1">
              <Layers className="w-3.5 h-3.5" /> {isRtl ? 'العضلة:' : 'Muscle:'}
            </span>
            {muscleGroups.map((mg) => (
              <button
                key={mg}
                onClick={() => setSelectedMuscle(mg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  selectedMuscle === mg
                    ? 'bg-emerald-500 text-black shadow-md glow-emerald'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                }`}
              >
                {mg}
              </button>
            ))}
          </div>

          {/* Category & Difficulty Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-semibold">{isRtl ? 'الفئة:' : 'Category:'}</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-black/60 border border-white/10 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  {categories.map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-semibold">{isRtl ? 'المستوى:' : 'Difficulty:'}</span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-black/60 border border-white/10 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  {difficulties.map(d => <option key={d} value={d} className="bg-black text-white">{d}</option>)}
                </select>
              </div>
            </div>

            {(searchQuery || selectedMuscle !== 'All' || selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
              <button
                onClick={clearFilters}
                className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                {isRtl ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Video Results Count Header */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>
          {isRtl ? 'عدد الفيديوهات:' : 'Showing Videos:'} <strong className="text-emerald-400 font-bold">{filteredVideos.length}</strong>
        </span>
      </div>

      {/* Video Cards Grid */}
      {filteredVideos.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
          <Dumbbell className="w-12 h-12 text-gray-500 mx-auto stroke-1" />
          <h3 className="font-heading font-bold text-lg text-white">
            {isRtl ? 'لا توجد فيديوهات تمارين حالياً' : 'No Workout Videos Found'}
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            {isRtl ? 'سيتم إضافة الفيديوهات من لوحة التحكم قريباً.' : 'Videos will appear here as soon as created from the Admin Dashboard.'}
          </p>
          {(searchQuery || selectedMuscle !== 'All' || selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-emerald-500 hover:bg-emerald-400 cursor-pointer"
            >
              {isRtl ? 'إلغاء البحث' : 'Clear Filters'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setActiveVideoModal(video)}
              className="group glass-card rounded-2xl overflow-hidden border border-white/10 glass-card-hover cursor-pointer flex flex-col justify-between"
            >
              {/* Thumbnail Area */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={video.thumbnail || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop"}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <div className="p-3.5 rounded-full bg-emerald-500 text-black shadow-2xl glow-emerald">
                    <Play className="w-6 h-6 fill-black" />
                  </div>
                </div>

                {/* Muscle Badge */}
                <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider text-black bg-emerald-400 px-2.5 py-1 rounded-md shadow">
                  {video.muscleGroup}
                </span>

                {/* Difficulty Badge */}
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-white bg-black/80 px-2 py-0.5 rounded border border-white/20">
                  {video.difficulty}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                    {video.description}
                  </p>
                </div>

                {/* Tags Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1 font-medium text-emerald-300">
                    <Dumbbell className="w-3.5 h-3.5" />
                    {video.equipment}
                  </span>
                  <span className="font-semibold text-gray-400">
                    {video.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {activeVideoModal && (
        <VideoPlayerModal
          video={activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
        />
      )}

    </div>
  );
};

