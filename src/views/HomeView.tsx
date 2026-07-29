import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MemberCard } from '../components/MemberCard';
import { BeforeAfterCard } from '../components/BeforeAfterCard';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { AnnouncementBanner } from '../components/AnnouncementBanner';
import { MovieVideoPlayer } from '../components/MovieVideoPlayer';
import { HorizontalCarousel } from '../components/HorizontalCarousel';
import { WorkoutVideo, MuscleGroup } from '../types';
import { 
  Dumbbell, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Play, 
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  LogIn,
  UserPlus
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  scrollTo?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, scrollTo }) => {
  const { db, currentUser, t, language } = useApp();
  const profile = db.coachProfile;
  const [selectedVideo, setSelectedVideo] = useState<WorkoutVideo | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);
  const isRtl = language === 'ar';

  const isApproved = currentUser?.status === 'approved';
  const hasActiveSubscription = currentUser?.subscriptionEnd && new Date(currentUser.subscriptionEnd).getTime() > new Date().getTime();
  const canAccessWorkouts = currentUser?.role === 'admin' || (isApproved && hasActiveSubscription);

  useEffect(() => {
    if (scrollTo === 'pricing') {
      const el = document.getElementById('pricing-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (scrollTo === 'contact') {
      const el = document.getElementById('contact-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollTo]);

  const categoryNames: Record<MuscleGroup, string> = {
    'Chest': isRtl ? 'الصدر' : 'Chest',
    'Back': isRtl ? 'الظهر' : 'Back',
    'Biceps': isRtl ? 'البايسبس' : 'Biceps',
    'Triceps': isRtl ? 'الترايسبس' : 'Triceps',
    'Shoulders': isRtl ? 'الكتف' : 'Shoulders',
    'Legs': isRtl ? 'الأرجل' : 'Legs',
    'Abs & Core': isRtl ? 'البطن والكوَر' : 'Abs & Core',
    'Full Body': isRtl ? 'الجسم بالكامل' : 'Full Body',
    'Cardio & HIIT': isRtl ? 'كارديو وفتنس' : 'Cardio & HIIT',
  };

  const categories: { name: MuscleGroup; icon: any; count: number; image: string }[] = [
    { name: 'Chest', icon: Dumbbell, count: db.videos.filter(v => v.muscleGroup === 'Chest').length, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop' },
    { name: 'Back', icon: Target, count: db.videos.filter(v => v.muscleGroup === 'Back').length, image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=500&auto=format&fit=crop' },
    { name: 'Biceps', icon: Zap, count: db.videos.filter(v => v.muscleGroup === 'Biceps').length, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format&fit=crop' },
    { name: 'Legs', icon: Flame, count: db.videos.filter(v => v.muscleGroup === 'Legs').length, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop' },
    { name: 'Abs & Core', icon: Trophy, count: db.videos.filter(v => v.muscleGroup === 'Abs & Core').length, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop' },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 5000);
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* If logged in, show Member Card or Announcement Banner */}
      {currentUser && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <AnnouncementBanner announcements={db.announcements} />
          <MemberCard user={currentUser} onEditProfile={() => onNavigate('profile')} />
        </section>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              {t('heroTag')}
            </div>

            {/* Hero Teaser Video replacing static image card */}
            <div className="w-full">
              <MovieVideoPlayer title="COACH BODA – Master Bodybuilding & Hypertrophy Fitness Specialist" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {canAccessWorkouts ? (
                <>
                  <button
                    onClick={() => onNavigate('workouts')}
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer shadow-xl glow-emerald"
                  >
                    <Dumbbell className="w-5 h-5" />
                    {t('startTraining')}
                  </button>
                  <button
                    onClick={() => onNavigate('coach')}
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all cursor-pointer"
                  >
                    {t('viewFullCoachProfile')}
                    <ArrowRight className={`w-5 h-5 text-emerald-400 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('register')}
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer shadow-xl glow-emerald"
                  >
                    <UserPlus className="w-5 h-5" />
                    {t('joinTeamBoda')}
                  </button>

                  <button
                    onClick={() => onNavigate('pricing')}
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all cursor-pointer"
                  >
                    {t('pricing')}
                    <ArrowRight className={`w-5 h-5 text-emerald-400 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </>
              )}
            </div>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-xl">
              <div>
                <span className="font-heading font-black text-2xl sm:text-3xl text-white block">
                  {profile.clientsTransformed}+
                </span>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  {t('clientsTransformed')}
                </span>
              </div>
              <div>
                <span className="font-heading font-black text-2xl sm:text-3xl text-emerald-400 block">
                  {profile.experienceYears}+ {isRtl ? 'سنوات' : 'Yrs'}
                </span>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  {t('yearsExp')}
                </span>
              </div>
              <div>
                <span className="font-heading font-black text-2xl sm:text-3xl text-white block">
                  100%
                </span>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  {t('guaranteedResults')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl glow-emerald group">
              <img 
                src={profile.photo || "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop"} 
                alt={profile.name} 
                className="w-full h-[450px] sm:h-[550px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500 text-black">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-white text-lg">
                      {profile.name}
                    </h4>
                    <p className="text-xs text-emerald-400 font-semibold">
                      {profile.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* About Coach Boda Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-emerald-500/20">
          <div className="space-y-4 max-w-4xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {t('aboutMentorTag')}
            </span>
            
            {/* Captain Boda Biography Image */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-xl bg-black my-2 group">
              <img 
                src={profile.biographyImage || "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop"} 
                alt="Captain Boda Biography" 
                className="w-full h-auto max-h-[320px] sm:max-h-[380px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 p-3.5 bg-black/85 backdrop-blur-md rounded-xl border border-white/10">
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider block mb-1">
                  {t('aboutMentorTitle')}
                </span>
                <p className="text-xs text-gray-200 font-medium line-clamp-2">
                  {profile.biography}
                </p>
              </div>
            </div>

            {/* Certifications List */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                {t('certificationsQualifications')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {profile.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-200 bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('coach')}
                className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {t('viewFullCoachProfile')}
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            {t('whatWeOffer')}
          </span>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-white uppercase">
            {t('coachingServices')}
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            {t('coachingServicesSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              {t('service1Title')}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('service1Desc')}
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              {t('service2Title')}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('service2Desc')}
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              {t('service3Title')}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('service3Desc')}
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Play className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              {t('service4Title')}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('service4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Workout Categories - ONLY VISIBLE TO LOGGED IN APPROVED MEMBERS WITH ACTIVE SUBSCRIPTION */}
      {canAccessWorkouts && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                {t('targetedTraining')}
              </span>
              <h2 className="font-heading font-black text-3xl md:text-4xl text-white uppercase">
                {t('workoutCategories')}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('workouts')}
              className="text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              {t('exploreAllVideos')} <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={idx}
                  onClick={() => onNavigate('workouts')}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer border border-white/10 glass-card-hover"
                >
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 space-y-1">
                    <div className="p-2 rounded-lg bg-emerald-500/80 text-black w-fit mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-white">
                      {categoryNames[cat.name] || cat.name}
                    </h3>
                    <p className="text-[11px] text-emerald-400 font-semibold">
                      {cat.count} {t('exercisesCount')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Pricing & Membership Plans Section - PUBLIC ACCESSIBLE */}
      <section id="pricing-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            {t('membershipPlansTag')}
          </span>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-white uppercase">
            {t('membershipPlansTitle')}
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            {t('membershipPlansSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(db.pricingPlans && db.pricingPlans.length > 0 ? db.pricingPlans : [
            {
              id: 'p1',
              name: t('plan1Title'),
              price: '$50 / Month',
              durationLabel: '1 Month',
              subtitle: t('plan1Sub'),
              features: [t('planFeature1'), t('planFeature2'), t('planFeature3')],
              isPopular: false,
              buttonText: t('joinPlanBtn')
            },
            {
              id: 'p2',
              name: t('plan2Title'),
              price: '$120 / 3 Months',
              durationLabel: '3 Months',
              subtitle: t('plan2Sub'),
              features: [t('planFeature1'), t('planFeature2'), t('planFeature3'), t('planFeature4')],
              isPopular: true,
              buttonText: t('joinPlanBtn')
            },
            {
              id: 'p3',
              name: t('plan3Title'),
              price: '$200 / 6 Months',
              durationLabel: '6 Months',
              subtitle: t('plan3Sub'),
              features: [t('planFeature1'), t('planFeature2'), t('planFeature3'), t('planFeature4')],
              isPopular: false,
              buttonText: t('joinPlanBtn')
            },
            {
              id: 'p4',
              name: t('plan4Title'),
              price: '$350 / Year',
              durationLabel: '1 Year',
              subtitle: t('plan4Sub'),
              features: [t('planFeature1'), t('planFeature2'), t('planFeature3'), t('planFeature4')],
              isPopular: false,
              buttonText: t('joinPlanBtn')
            }
          ]).map((plan) => (
            <div 
              key={plan.id} 
              className={`glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden ${
                plan.isPopular 
                  ? 'border-2 border-emerald-500 shadow-2xl glow-emerald' 
                  : 'border border-white/10 glass-card-hover'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                  {t('mostPopularTag')}
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading font-extrabold text-xl text-white">{plan.name}</h3>
                  {plan.durationLabel && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                      {plan.durationLabel}
                    </span>
                  )}
                </div>
                {plan.price && (
                  <div className="text-2xl font-black text-emerald-400 font-heading">
                    {plan.price}
                  </div>
                )}
                {plan.subtitle && (
                  <p className="text-xs text-gray-400">{plan.subtitle}</p>
                )}
                <ul className="space-y-2 text-xs text-gray-300 pt-3 border-t border-white/10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => onNavigate('register')}
                className={`w-full py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                  plan.isPopular
                    ? 'text-black bg-emerald-400 hover:bg-emerald-300'
                    : 'text-black bg-emerald-500 hover:bg-emerald-400'
                }`}
              >
                {plan.buttonText || t('joinPlanBtn')}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Client Transformations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {t('realResults')}
            </span>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white uppercase">
              {t('clientTransformations')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('transformations')}
            className="text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            {t('viewAllTransformations')} <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <HorizontalCarousel itemGap="gap-6">
          {db.transformations.map((tf) => (
            <div key={tf.id} className="w-[88vw] sm:w-[480px] shrink-0 snap-center">
              <BeforeAfterCard transformation={tf} />
            </div>
          ))}
        </HorizontalCarousel>
      </section>

      {/* Public Reels Section Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {t('featuredClips')}
            </span>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white uppercase">
              {t('coachBodaReels')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('reels')}
            className="text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            {t('seeAllReels')} <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <HorizontalCarousel itemGap="gap-5">
          {db.reels.map((reel) => (
            <div 
              key={reel.id}
              onClick={() => onNavigate('reels')}
              className="w-[220px] sm:w-[260px] shrink-0 snap-center group relative rounded-2xl overflow-hidden aspect-[9/16] bg-black border border-white/10 glass-card-hover cursor-pointer"
            >
              <img 
                src={reel.thumbnail || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop"} 
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 rounded-full bg-emerald-500/90 text-black shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-black" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-heading font-bold text-sm text-white line-clamp-2">
                  {reel.title}
                </p>
                <span className="text-xs text-emerald-400 font-semibold mt-1 block">
                  ❤️ {reel.likesCount || 1200} {t('likes')}
                </span>
              </div>
            </div>
          ))}
        </HorizontalCarousel>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-emerald-500/30 glow-emerald">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                {t('getInTouch')}
              </span>
              <h2 className="font-heading font-black text-3xl md:text-4xl text-white uppercase">
                {t('contactCoachBoda')}
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t('contactDesc')}
              </p>

              <div className="pt-2 space-y-3">
                <a 
                  href={`https://wa.me/${profile.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-emerald-500 text-black font-extrabold uppercase tracking-wider text-sm shadow-xl hover:bg-emerald-400 transition-all cursor-pointer text-center"
                >
                  <MessageSquare className="w-5 h-5" />
                  {t('directWhatsappChat')}
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 bg-black/40 p-6 md:p-8 rounded-2xl border border-white/10">
              {contactSuccess ? (
                <div className="p-6 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-heading font-bold text-lg text-white">{t('messageSentTitle')}</h4>
                  <p className="text-xs text-gray-300">{t('messageSentSub')}</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        {t('yourName')}
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder={isRtl ? 'مثال: محمد أحمد' : 'John Doe'}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        {t('phoneWhatsapp')}
                      </label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+20 100 000 0000"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      {t('messageGoal')}
                    </label>
                    <textarea 
                      rows={4}
                      required
                      placeholder={isRtl ? 'اكتب هدفك الرياضي واستفسارك للكابتن...' : 'Describe your current fitness goals...'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-sm font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer shadow-lg"
                  >
                    {t('sendMessageToCoach')}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoPlayerModal 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}

    </div>
  );
};
