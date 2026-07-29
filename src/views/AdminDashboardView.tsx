import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const parseVideoUrl = (url: string) => {
  if (!url) return { type: 'unknown' as const, embedUrl: '', platformName: 'Direct' };
  const trimmed = url.trim();
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return { type: 'youtube' as const, embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`, platformName: 'YouTube' };
  }
  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return { type: 'drive' as const, embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`, platformName: 'Google Drive' };
  }
  if (trimmed.includes('vimeo.com')) {
    return { type: 'vimeo' as const, embedUrl: trimmed, platformName: 'Vimeo' };
  }
  return { type: 'direct' as const, embedUrl: trimmed, platformName: 'Direct MP4/Video' };
};
import { 
  User, 
  WorkoutVideo, 
  Transformation, 
  Reel, 
  Announcement, 
  CoachProfile, 
  MuscleGroup, 
  VideoCategory, 
  VideoDifficulty, 
  SubscriptionType,
  PricingPlan
} from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Trophy, 
  Film, 
  Megaphone, 
  UserCheck, 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Download, 
  Upload, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Tag, 
  Award,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  Share2,
  Globe,
  Send,
  Check,
  X,
  Eye
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { 
    db, 
    approveUser, 
    rejectUser, 
    deleteUser, 
    assignSubscription, 
    renewSubscription,
    addVideo,
    editVideo,
    deleteVideo,
    addTransformation,
    editTransformation,
    deleteTransformation,
    addReel,
    deleteReel,
    addAnnouncement,
    deleteAnnouncement,
    updateCoachProfile,
    addCertification,
    editCertification,
    deleteCertification,
    addCustomSocialLink,
    deleteCustomSocialLink,
    addPricingPlan,
    editPricingPlan,
    deletePricingPlan,
    exportBackup,
    importBackup,
    resetData,
    t,
    language
  } = useApp();

  const isRtl = language === 'ar';

  const [activeTab, setActiveTab] = useState<
    'stats' | 'users' | 'pricing' | 'videos' | 'transformations' | 'reels' | 'announcements' | 'coach' | 'social' | 'backup'
  >('stats');

  // Modal & Form States
  const [showSubModal, setShowSubModal] = useState<User | null>(null);
  const [subType, setSubType] = useState<SubscriptionType>('1_month');
  const [customDays, setCustomDays] = useState<number>(30);
  const [renewDays, setRenewDays] = useState<number>(30);

  // Video Form
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    muscleGroup: 'Chest' as MuscleGroup,
    difficulty: 'Intermediate' as VideoDifficulty,
    equipment: 'Dumbbells',
    thumbnail: '',
    category: 'Hypertrophy' as VideoCategory
  });

  // Transformation Form
  const [showTfModal, setShowTfModal] = useState<boolean>(false);
  const [editingTfId, setEditingTfId] = useState<string | null>(null);
  const [tfForm, setTfForm] = useState({
    clientName: '',
    beforeImage: '',
    afterImage: '',
    description: '',
    duration: '12 Weeks',
    weightChange: '-10 kg'
  });

  // Reel Form
  const [showReelModal, setShowReelModal] = useState<boolean>(false);
  const [reelForm, setReelForm] = useState({
    title: '',
    videoUrl: '',
    thumbnail: ''
  });

  // Announcement Form
  const [annForm, setAnnForm] = useState({
    title: '',
    content: ''
  });

  // Coach Profile Form
  const [coachForm, setCoachForm] = useState<CoachProfile>(db.coachProfile);
  const [coachFormSuccess, setCoachFormSuccess] = useState(false);

  // Certifications Form State
  const [newCertText, setNewCertText] = useState('');
  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null);
  const [editingCertText, setEditingCertText] = useState('');

  // Pricing Plans Form State
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [editingPricingId, setEditingPricingId] = useState<string | null>(null);
  const [pricingForm, setPricingForm] = useState({
    name: '',
    price: '',
    durationLabel: '1 Month',
    subtitle: '',
    featuresText: '',
    isPopular: false,
    buttonText: 'Register Now'
  });

  // Social Media Form State
  const [socialForm, setSocialForm] = useState({
    facebookUrl: db.coachProfile.facebookUrl || '',
    instagramUrl: db.coachProfile.instagramUrl || '',
    tiktokUrl: db.coachProfile.tiktokUrl || '',
    youtubeUrl: db.coachProfile.youtubeUrl || '',
    whatsappNumber: db.coachProfile.whatsappNumber || '',
    telegramUrl: db.coachProfile.telegramUrl || '',
    xTwitterUrl: db.coachProfile.xTwitterUrl || ''
  });
  const [newCustomSocial, setNewCustomSocial] = useState({ platform: '', url: '' });
  const [socialFormSuccess, setSocialFormSuccess] = useState(false);

  // Backup Import Ref
  const [backupJson, setBackupJson] = useState('');
  const [backupMsg, setBackupMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Calculated Stats
  const membersOnly = db.users.filter(u => u.role === 'member');
  const totalMembers = membersOnly.length;
  const pendingMembers = membersOnly.filter(u => u.status === 'pending');
  const approvedMembers = membersOnly.filter(u => u.status === 'approved');
  const activeMembers = approvedMembers.filter(u => {
    if (!u.subscriptionEnd) return false;
    return new Date(u.subscriptionEnd).getTime() > Date.now();
  });
  const expiredMembers = approvedMembers.filter(u => {
    if (!u.subscriptionEnd) return true;
    return new Date(u.subscriptionEnd).getTime() <= Date.now();
  });

  // Video Form Submit
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideoId) {
      editVideo(editingVideoId, videoForm);
    } else {
      addVideo(videoForm);
    }
    setShowVideoModal(false);
    setEditingVideoId(null);
    setVideoForm({
      title: '',
      description: '',
      videoUrl: '',
      muscleGroup: 'Chest',
      difficulty: 'Intermediate',
      equipment: 'Dumbbells',
      thumbnail: '',
      category: 'Hypertrophy'
    });
  };

  // Transformation Form Submit
  const handleSaveTf = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTfId) {
      editTransformation(editingTfId, tfForm);
    } else {
      addTransformation(tfForm);
    }
    setShowTfModal(false);
    setEditingTfId(null);
    setTfForm({
      clientName: '',
      beforeImage: '',
      afterImage: '',
      description: '',
      duration: '12 Weeks',
      weightChange: '-10 kg'
    });
  };

  // Reel Form Submit
  const handleSaveReel = (e: React.FormEvent) => {
    e.preventDefault();
    addReel(reelForm);
    setShowReelModal(false);
    setReelForm({ title: '', videoUrl: '', thumbnail: '' });
  };

  // Announcement Submit
  const handleSaveAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annForm.title || !annForm.content) return;
    addAnnouncement(annForm);
    setAnnForm({ title: '', content: '' });
  };

  // Coach Profile Save
  const handleSaveCoachProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCoachProfile(coachForm);
    setCoachFormSuccess(true);
    setTimeout(() => setCoachFormSuccess(false), 3000);
  };

  // Certification Handlers
  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCertText.trim()) {
      addCertification(newCertText.trim());
      setNewCertText('');
    }
  };

  const handleSaveCertEdit = (index: number) => {
    if (editingCertText.trim()) {
      editCertification(index, editingCertText.trim());
    }
    setEditingCertIndex(null);
    setEditingCertText('');
  };

  // Pricing Plan Handlers
  const handleOpenAddPricing = () => {
    setEditingPricingId(null);
    setPricingForm({
      name: '',
      price: '$50 / Month',
      durationLabel: '1 Month',
      subtitle: '',
      featuresText: 'HD Workout Library Access\nCustomized Diet Plan\nWeekly Check-ins',
      isPopular: false,
      buttonText: 'Register Now'
    });
    setShowPricingModal(true);
  };

  const handleOpenEditPricing = (plan: PricingPlan) => {
    setEditingPricingId(plan.id);
    setPricingForm({
      name: plan.name,
      price: plan.price,
      durationLabel: plan.durationLabel || '',
      subtitle: plan.subtitle || '',
      featuresText: plan.features ? plan.features.join('\n') : '',
      isPopular: plan.isPopular || false,
      buttonText: plan.buttonText || 'Register Now'
    });
    setShowPricingModal(true);
  };

  const handleSavePricingPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresArray = pricingForm.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (editingPricingId) {
      editPricingPlan(editingPricingId, {
        name: pricingForm.name,
        price: pricingForm.price,
        durationLabel: pricingForm.durationLabel,
        subtitle: pricingForm.subtitle,
        features: featuresArray,
        isPopular: pricingForm.isPopular,
        buttonText: pricingForm.buttonText
      });
    } else {
      addPricingPlan({
        name: pricingForm.name,
        price: pricingForm.price,
        durationLabel: pricingForm.durationLabel,
        subtitle: pricingForm.subtitle,
        features: featuresArray,
        isPopular: pricingForm.isPopular,
        buttonText: pricingForm.buttonText
      });
    }
    setShowPricingModal(false);
  };

  // Social Media Handlers
  const handleSaveSocialMedia = (e: React.FormEvent) => {
    e.preventDefault();
    updateCoachProfile(socialForm);
    setSocialFormSuccess(true);
    setTimeout(() => setSocialFormSuccess(false), 3000);
  };

  const handleAddCustomSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomSocial.platform.trim() && newCustomSocial.url.trim()) {
      addCustomSocialLink(newCustomSocial);
      setNewCustomSocial({ platform: '', url: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      
      {/* Top Admin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-emerald-500/30 glow-emerald">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500 text-black font-extrabold">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              {t('adminControlPanel')}
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase mt-1">
            {t('coachBodaDashboard')}
          </h1>
          <p className="text-xs text-gray-400">{t('loggedInAsAdmin')}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportBackup}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> {t('quickBackupJson')}
          </button>
        </div>
      </div>

      {/* Admin Dashboard Tabs Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
        {[
          { id: 'stats', label: t('statisticsTab'), icon: LayoutDashboard },
          { id: 'users', label: `${t('membersTab')} (${pendingMembers.length > 0 ? `${pendingMembers.length} ${t('pendingSub')}` : totalMembers})`, icon: Users },
          { id: 'pricing', label: `${t('pricingPlansTab')} (${db.pricingPlans ? db.pricingPlans.length : 0})`, icon: CreditCard },
          { id: 'videos', label: `${t('videosTab')} (${db.videos.length})`, icon: Dumbbell },
          { id: 'transformations', label: `${t('transformationsTab')} (${db.transformations.length})`, icon: Trophy },
          { id: 'reels', label: `${t('reelsTab')} (${db.reels.length})`, icon: Film },
          { id: 'announcements', label: t('announcementsTab'), icon: Megaphone },
          { id: 'coach', label: t('coachProfileTab'), icon: UserCheck },
          { id: 'social', label: t('socialMediaTab'), icon: Share2 },
          { id: 'backup', label: t('backupRestoreTab'), icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-black shadow-lg glow-emerald'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: STATISTICS OVERVIEW */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">{t('totalMembers')}</span>
              <span className="font-heading font-black text-3xl text-white">{totalMembers}</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-emerald-500/30">
              <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">{t('activeMembers')}</span>
              <span className="font-heading font-black text-3xl text-emerald-400">{activeMembers.length}</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-amber-500/30">
              <span className="text-[10px] font-bold uppercase text-amber-400 block mb-1">{t('pendingMembers')}</span>
              <span className="font-heading font-black text-3xl text-amber-400">{pendingMembers.length}</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-rose-500/30">
              <span className="text-[10px] font-bold uppercase text-rose-400 block mb-1">{t('expiredMembers')}</span>
              <span className="font-heading font-black text-3xl text-rose-400">{expiredMembers.length}</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">{t('totalVideos')}</span>
              <span className="font-heading font-black text-3xl text-white">{db.videos.length}</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">{t('transformationsTab')}</span>
              <span className="font-heading font-black text-3xl text-white">{db.transformations.length}</span>
            </div>
          </div>

          {/* Pending Members Action Alert */}
          {pendingMembers.length > 0 && (
            <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-heading font-bold text-lg text-white">
                    {pendingMembers.length} {t('userRegistrationsAwaiting')}
                  </h4>
                  <p className="text-xs text-amber-200">
                    {t('reviewPendingUsersSub')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('users')}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300"
              >
                {t('reviewPendingUsersNow')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT & SUBSCRIPTIONS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-xl text-white uppercase">
              {t('registeredMembersHeading')}
            </h3>
          </div>

          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className={`w-full text-xs text-gray-300 ${isRtl ? 'text-right' : 'text-left'}`}>
                <thead className="bg-black/60 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-4">{t('memberInfoCol')}</th>
                    <th className="p-4">{t('membershipIdCol')}</th>
                    <th className="p-4">{t('statusCol')}</th>
                    <th className="p-4">{t('subscriptionEndCol')}</th>
                    <th className={`p-4 ${isRtl ? 'text-left' : 'text-right'}`}>{t('actionsCol')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {membersOnly.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        {isRtl ? 'لا يوجد متدربين مسجلين حالياً.' : 'No members registered yet.'}
                      </td>
                    </tr>
                  ) : (
                    membersOnly.map((member) => {
                      const isPending = member.status === 'pending';
                      const isApproved = member.status === 'approved';
                      const isRejected = member.status === 'rejected';

                      const subEnd = member.subscriptionEnd ? new Date(member.subscriptionEnd) : null;
                      const isExpired = subEnd ? subEnd.getTime() <= Date.now() : true;

                      return (
                        <tr key={member.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={member.profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop"}
                                alt={member.name}
                                className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40"
                              />
                              <div>
                                <span className="font-bold text-white text-sm block">{member.name}</span>
                                <span className="text-[11px] text-gray-400">@{member.username} • {member.phone}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 font-mono font-bold text-emerald-400">
                            {member.membershipId}
                          </td>

                          <td className="p-4">
                            {isPending && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                {t('pendingSub')}
                              </span>
                            )}
                            {isApproved && !isExpired && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {t('activeSub')}
                              </span>
                            )}
                            {isApproved && isExpired && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                {t('expiredSub')}
                              </span>
                            )}
                            {isRejected && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                                {t('rejectedSub')}
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-xs">
                            {subEnd ? subEnd.toLocaleDateString() : 'N/A'}
                          </td>

                          <td className={`p-4 space-x-2 ${isRtl ? 'text-left' : 'text-right'}`}>
                            {isPending && (
                              <>
                                <button
                                  onClick={() => approveUser(member.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 cursor-pointer"
                                >
                                  {t('approveBtn')}
                                </button>
                                <button
                                  onClick={() => rejectUser(member.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/30 cursor-pointer"
                                >
                                  {t('rejectBtn')}
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <button
                                onClick={() => setShowSubModal(member)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer"
                              >
                                {t('manageSubBtn')}
                              </button>
                            )}

                            <button
                              onClick={() => deleteUser(member.id)}
                              className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg cursor-pointer"
                              title={t('deleteMember')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WORKOUT VIDEOS MANAGEMENT */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-xl text-white uppercase">
              {t('videosTab')} ({db.videos.length})
            </h3>
            <button
              onClick={() => {
                setEditingVideoId(null);
                setVideoForm({
                  title: '',
                  description: '',
                  videoUrl: '',
                  muscleGroup: 'Chest',
                  difficulty: 'Intermediate',
                  equipment: 'Dumbbells',
                  thumbnail: '',
                  category: 'Hypertrophy'
                });
                setShowVideoModal(true);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 flex items-center gap-2 cursor-pointer shadow-lg glow-emerald"
            >
              <Plus className="w-4 h-4" /> {t('addWorkoutVideoBtn')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {db.videos.map((video) => (
              <div key={video.id} className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
                <img
                  src={video.thumbnail || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop"}
                  alt={video.title}
                  className="w-full aspect-video object-cover rounded-xl"
                />
                <h4 className="font-heading font-bold text-base text-white">{video.title}</h4>
                <p className="text-xs text-emerald-400 font-semibold">{video.muscleGroup} • {video.difficulty}</p>
                
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setEditingVideoId(video.id);
                      setVideoForm({
                        title: video.title,
                        description: video.description,
                        videoUrl: video.videoUrl,
                        muscleGroup: video.muscleGroup,
                        difficulty: video.difficulty,
                        equipment: video.equipment,
                        thumbnail: video.thumbnail,
                        category: video.category
                      });
                      setShowVideoModal(true);
                    }}
                    className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TRANSFORMATIONS MANAGEMENT */}
      {activeTab === 'transformations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-xl text-white uppercase">
              {t('transformationsTab')} ({db.transformations.length})
            </h3>
            <button
              onClick={() => {
                setEditingTfId(null);
                setTfForm({
                  clientName: '',
                  beforeImage: '',
                  afterImage: '',
                  description: '',
                  duration: '12 Weeks',
                  weightChange: '-10 kg'
                });
                setShowTfModal(true);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 flex items-center gap-2 cursor-pointer shadow-lg glow-emerald"
            >
              <Plus className="w-4 h-4" /> {t('addTransformationBtn')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {db.transformations.map((tf) => (
              <div key={tf.id} className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="grid grid-cols-2 gap-2 aspect-[4/3] rounded-xl overflow-hidden">
                  <img src={tf.beforeImage || "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"} alt="Before" className="w-full h-full object-cover" />
                  <img src={tf.afterImage || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop"} alt="After" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-base text-white">{tf.clientName}</h4>
                  <span className="text-xs font-mono font-bold text-emerald-400">{tf.weightChange}</span>
                </div>
                <p className="text-xs text-gray-300">{tf.description}</p>
                
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setEditingTfId(tf.id);
                      setTfForm({
                        clientName: tf.clientName,
                        beforeImage: tf.beforeImage,
                        afterImage: tf.afterImage,
                        description: tf.description,
                        duration: tf.duration || '12 Weeks',
                        weightChange: tf.weightChange || '-10 kg'
                      });
                      setShowTfModal(true);
                    }}
                    className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTransformation(tf.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REELS MANAGEMENT */}
      {activeTab === 'reels' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-xl text-white uppercase">
              {t('reelsTab')} ({db.reels.length})
            </h3>
            <button
              onClick={() => setShowReelModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 flex items-center gap-2 cursor-pointer shadow-lg glow-emerald"
            >
              <Plus className="w-4 h-4" /> {t('addReelBtn')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {db.reels.map((reel) => (
              <div key={reel.id} className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
                <img src={reel.thumbnail || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop"} alt={reel.title} className="w-full aspect-[9/16] object-cover rounded-xl" />
                <h4 className="font-heading font-bold text-sm text-white line-clamp-2">{reel.title}</h4>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <button
                    onClick={() => deleteReel(reel.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">{t('publishAnnouncementTitle')}</h3>
            <form onSubmit={handleSaveAnn} className="space-y-4">
              <input
                type="text"
                required
                placeholder={t('announcementTitlePlaceholder')}
                value={annForm.title}
                onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <textarea
                rows={3}
                required
                placeholder={t('announcementContentPlaceholder')}
                value={annForm.content}
                onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-xs font-extrabold uppercase text-black bg-emerald-500 hover:bg-emerald-400 cursor-pointer"
              >
                {t('postAnnouncementBtn')}
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {db.announcements.map((ann) => (
              <div key={ann.id} className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-base text-white">{ann.title}</h4>
                  <p className="text-xs text-gray-300 mt-1">{ann.content}</p>
                </div>
                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRICING & MEMBERSHIP PLANS */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-white uppercase">
                {t('pricingPlansHeading')}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {isRtl ? 'أي تغيير في هذه الباقات يتم تحديثه تلقائياً في صفحة الأسعار العامة والصفحة الرئيسية.' : 'Changes made here automatically update the public Pricing page & homepage.'}
              </p>
            </div>
            <button
              onClick={handleOpenAddPricing}
              className="px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 cursor-pointer flex items-center gap-2 shadow-lg glow-emerald"
            >
              <Plus className="w-4 h-4" /> {t('addPricingPlanBtn')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {db.pricingPlans && db.pricingPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between space-y-6 relative ${
                  plan.isPopular ? 'border-emerald-500 bg-emerald-500/5 shadow-xl glow-emerald' : 'border-white/10'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute top-4 right-4 text-[10px] font-black uppercase px-2.5 py-1 bg-emerald-500 text-black rounded-lg">
                    {t('mostPopularTag')}
                  </span>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-heading font-black text-xl text-white">{plan.name}</h4>
                    <p className="text-2xl font-extrabold text-emerald-400 mt-1 font-heading">{plan.price}</p>
                    {plan.durationLabel && (
                      <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                        {plan.durationLabel}
                      </span>
                    )}
                  </div>

                  {plan.subtitle && (
                    <p className="text-xs text-gray-400 leading-relaxed">{plan.subtitle}</p>
                  )}

                  <div className="pt-3 border-t border-white/10">
                    <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block mb-2">{t('planFeaturesLabel')}</span>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleOpenEditPricing(plan)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> {t('editPricingPlanBtn')}
                  </button>
                  <button
                    onClick={() => deletePricingPlan(plan.id)}
                    className="p-2.5 rounded-xl text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 cursor-pointer"
                    title={t('deletePricingPlanBtn')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: COACH PROFILE & CERTIFICATIONS */}
      {activeTab === 'coach' && (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 space-y-8">
          <h3 className="font-heading font-extrabold text-xl text-white uppercase">
            {t('editCoachProfileHeading')}
          </h3>

          {coachFormSuccess && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'تم تحديث بروفايل الكابتن بودا والشهادات بنجاح!' : 'Coach Boda profile successfully updated!'}</span>
            </div>
          )}

          <form onSubmit={handleSaveCoachProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('coachNameLabel')}</label>
                <input
                  type="text"
                  required
                  value={coachForm.name}
                  onChange={(e) => setCoachForm({ ...coachForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('titleLabel')}</label>
                <input
                  type="text"
                  required
                  value={coachForm.title}
                  onChange={(e) => setCoachForm({ ...coachForm, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('biographyLabel')}</label>
              <textarea
                rows={4}
                required
                value={coachForm.biography}
                onChange={(e) => setCoachForm({ ...coachForm, biography: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Profile Photo by URL with LIVE PREVIEW */}
            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
              <label className="block text-xs font-bold uppercase text-emerald-400">{t('photoUrlLabel')}</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-black shrink-0 shadow-lg relative group">
                  <img 
                    src={coachForm.photo || "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=300&auto=format&fit=crop"} 
                    alt="Coach Boda Preview" 
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=300&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                    Preview
                  </div>
                </div>
                <div className="flex-1 space-y-1.5 w-full">
                  <input
                    type="url"
                    required
                    value={coachForm.photo}
                    onChange={(e) => setCoachForm({ ...coachForm, photo: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <p className="text-[11px] text-gray-400">
                    {t('photoUrlPreviewHint')}
                  </p>
                </div>
              </div>
            </div>

            {/* COACH BODA - Specialist Header Section Image */}
            <div className="p-4 bg-black/40 border border-emerald-500/30 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-emerald-400">
                  {isRtl ? 'صورة قسم الهيدر (COACH BODA - Master Bodybuilding Specialist)' : 'COACH BODA - Specialist Section Banner Image'}
                </label>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {isRtl ? 'صورة رئيسية' : 'Main Section Image'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-32 h-20 rounded-xl overflow-hidden border border-emerald-500/40 bg-black shrink-0 shadow-lg relative">
                  <img 
                    src={coachForm.heroImage || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"} 
                    alt="Hero Banner Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1.5 w-full">
                  <input
                    type="url"
                    value={coachForm.heroImage || ''}
                    onChange={(e) => setCoachForm({ ...coachForm, heroImage: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <p className="text-[11px] text-gray-400">
                    {isRtl ? 'الصورة التي تظهر في الواجهة بقسم الكابتن بودا الماستر بدلاً من النص' : 'Image displayed in place of text in the COACH BODA Specialist section'}
                  </p>
                </div>
              </div>
            </div>

            {/* Captain Boda Biography Section Image */}
            <div className="p-4 bg-black/40 border border-emerald-500/30 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-emerald-400">
                  {isRtl ? 'صورة قسم سيرة الكابتن بودا (Captain Boda Biography Image)' : 'Captain Boda Biography Section Image'}
                </label>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {isRtl ? 'صورة السيرة الذاتية' : 'Biography Image'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-32 h-20 rounded-xl overflow-hidden border border-emerald-500/40 bg-black shrink-0 shadow-lg relative">
                  <img 
                    src={coachForm.biographyImage || "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop"} 
                    alt="Biography Image Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1.5 w-full">
                  <input
                    type="url"
                    value={coachForm.biographyImage || ''}
                    onChange={(e) => setCoachForm({ ...coachForm, biographyImage: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <p className="text-[11px] text-gray-400">
                    {isRtl ? 'الصورة التي تظهر في قسم السيرة الذاتية للكابتن بودا بدلاً من النص' : 'Image displayed in place of text in the Captain Boda Biography section'}
                  </p>
                </div>
              </div>
            </div>

            {/* Experience & Clients Transformed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('experienceYearsLabel')}</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={coachForm.experienceYears}
                  onChange={(e) => setCoachForm({ ...coachForm, experienceYears: parseInt(e.target.value) || 5 })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('clientsTransformedLabel')}</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={coachForm.clientsTransformed}
                  onChange={(e) => setCoachForm({ ...coachForm, clientsTransformed: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl text-xs font-extrabold uppercase text-black bg-emerald-500 hover:bg-emerald-400 cursor-pointer shadow-lg glow-emerald"
            >
              {t('saveCoachProfileBtn')}
            </button>
          </form>

          {/* CERTIFICATIONS & DIPLOMAS MANAGER */}
          <div className="pt-8 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-extrabold text-lg text-white uppercase flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" /> {t('certificationsHeading')}
              </h4>
            </div>

            <form onSubmit={handleAddCert} className="flex gap-2">
              <input
                type="text"
                value={newCertText}
                onChange={(e) => setNewCertText(e.target.value)}
                placeholder={t('certPlaceholder')}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl text-xs font-extrabold uppercase text-black bg-emerald-500 hover:bg-emerald-400 cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> {t('addCertificationBtn')}
              </button>
            </form>

            <div className="space-y-2">
              {db.coachProfile.certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between gap-3 p-3 bg-black/40 border border-white/10 rounded-xl text-xs">
                  {editingCertIndex === index ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editingCertText}
                        onChange={(e) => setEditingCertText(e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <button
                        onClick={() => handleSaveCertEdit(index)}
                        className="p-2 text-emerald-400 bg-emerald-500/20 rounded-lg"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{cert}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCertIndex(index);
                            setEditingCertText(cert);
                          }}
                          className="p-1.5 text-gray-400 hover:text-emerald-400 rounded-lg cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCertification(index)}
                          className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: SOCIAL MEDIA SETTINGS */}
      {activeTab === 'social' && (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 space-y-8">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-white uppercase flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-400" /> {t('socialMediaSettingsHeading')}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {isRtl ? 'جميع الروابط المضافة هنا تظهر تلقائياً في الفوتر وتذييل الموقع وفي صفحة الكابتن.' : 'All links added here automatically appear throughout the website footer & Coach page.'}
            </p>
          </div>

          {socialFormSuccess && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'تم حفظ روابط التواصل الاجتماعي بنجاح!' : 'Social media settings successfully saved!'}</span>
            </div>
          )}

          <form onSubmit={handleSaveSocialMedia} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('facebookUrlLabel')}</label>
                <input
                  type="text"
                  value={socialForm.facebookUrl}
                  onChange={(e) => setSocialForm({ ...socialForm, facebookUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('instagramUrlLabel')}</label>
                <input
                  type="text"
                  value={socialForm.instagramUrl}
                  onChange={(e) => setSocialForm({ ...socialForm, instagramUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('tiktokUrlLabel')}</label>
                <input
                  type="text"
                  value={socialForm.tiktokUrl}
                  onChange={(e) => setSocialForm({ ...socialForm, tiktokUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="https://tiktok.com/@..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('youtubeUrlLabel')}</label>
                <input
                  type="text"
                  value={socialForm.youtubeUrl}
                  onChange={(e) => setSocialForm({ ...socialForm, youtubeUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="https://youtube.com/@..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('whatsappNumberLabel')}</label>
                <input
                  type="text"
                  value={socialForm.whatsappNumber}
                  onChange={(e) => setSocialForm({ ...socialForm, whatsappNumber: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="+201000000000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('telegramUrlLabel')}</label>
                <input
                  type="text"
                  value={socialForm.telegramUrl}
                  onChange={(e) => setSocialForm({ ...socialForm, telegramUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="https://t.me/..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('xTwitterUrlLabel')}</label>
                <input
                  type="text"
                  value={socialForm.xTwitterUrl}
                  onChange={(e) => setSocialForm({ ...socialForm, xTwitterUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="https://x.com/..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl text-xs font-extrabold uppercase text-black bg-emerald-500 hover:bg-emerald-400 cursor-pointer shadow-lg glow-emerald"
            >
              {t('saveSocialLinksBtn')}
            </button>
          </form>

          {/* CUSTOM / ADDITIONAL SOCIAL MEDIA LINKS */}
          <div className="pt-8 border-t border-white/10 space-y-4">
            <div>
              <h4 className="font-heading font-extrabold text-lg text-white uppercase flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" /> {t('customSocialLinksHeading')}
              </h4>
            </div>

            <form onSubmit={handleAddCustomSocial} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newCustomSocial.platform}
                onChange={(e) => setNewCustomSocial({ ...newCustomSocial, platform: e.target.value })}
                placeholder={t('platformNameLabel')}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                value={newCustomSocial.url}
                onChange={(e) => setNewCustomSocial({ ...newCustomSocial, url: e.target.value })}
                placeholder={t('urlLabel')}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl text-xs font-extrabold uppercase text-black bg-emerald-500 hover:bg-emerald-400 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> {t('addCustomSocialLinkBtn')}
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {db.coachProfile.customSocialLinks && db.coachProfile.customSocialLinks.map((custom) => (
                <div key={custom.id} className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-xl text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{custom.platform}</span>
                    <span className="text-[11px] text-emerald-400 font-mono truncate max-w-xs block">{custom.url}</span>
                  </div>
                  <button
                    onClick={() => deleteCustomSocialLink(custom.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 space-y-6">
          <h3 className="font-heading font-extrabold text-xl text-white uppercase">
            {t('backupHeading')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-4">
              <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" /> {t('exportDataTitle')}
              </h4>
              <p className="text-xs text-gray-400">
                {t('exportDataSub')}
              </p>
              <button
                onClick={exportBackup}
                className="w-full py-3 rounded-xl text-xs font-extrabold uppercase text-black bg-emerald-500 hover:bg-emerald-400 cursor-pointer"
              >
                {t('downloadJsonBackupBtn')}
              </button>
            </div>

            <div className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-4">
              <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" /> {t('restoreDataTitle')}
              </h4>
              <textarea
                rows={3}
                placeholder={t('restoreDataSub')}
                value={backupJson}
                onChange={(e) => setBackupJson(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
              />
              <button
                onClick={() => {
                  const res = importBackup(backupJson);
                  setBackupMsg(res);
                }}
                className="w-full py-3 rounded-xl text-xs font-extrabold uppercase text-white bg-white/10 hover:bg-white/20 border border-white/10 cursor-pointer"
              >
                {t('importJsonBackupBtn')}
              </button>

              {backupMsg && (
                <p className={`text-xs ${backupMsg.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {backupMsg.text}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-center">
            <button
              onClick={resetData}
              className="text-xs font-bold text-rose-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> {t('resetInitialDataBtn')}
            </button>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION ASSIGNMENT MODAL */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">
              {t('manageSubModalTitle')} {showSubModal.name}
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">{t('presetOptionsLabel')}</label>
              <select
                value={subType}
                onChange={(e) => setSubType(e.target.value as SubscriptionType)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
              >
                <option value="1_month">{t('monthOption1')}</option>
                <option value="3_months">{t('monthOption3')}</option>
                <option value="6_months">{t('monthOption6')}</option>
                <option value="1_year">{t('yearOption1')}</option>
                <option value="custom">{t('customDaysOption')}</option>
              </select>
            </div>

            {subType === 'custom' && (
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">{t('numberOfDaysLabel')}</label>
                <input
                  type="number"
                  value={customDays}
                  onChange={(e) => setCustomDays(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  assignSubscription(showSubModal.id, subType, customDays);
                  setShowSubModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-black bg-emerald-500 hover:bg-emerald-400 cursor-pointer"
              >
                {t('setSubscriptionBtn')}
              </button>

              <button
                onClick={() => setShowSubModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                {t('cancelBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT VIDEO MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-lg text-white">
              {editingVideoId ? t('editVideo') || 'Edit Video' : t('addWorkoutVideoBtn')}
            </h3>

            <form onSubmit={handleSaveVideo} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-400 mb-1">{t('videoTitleLabel')}</label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-400 mb-1">{t('videoUrlLabel')}</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white font-mono text-[11px]"
                />
                {videoForm.videoUrl && (
                  <div className="mt-1.5 p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300 flex items-center justify-between">
                    <span>
                      {isRtl ? 'المنصة المكتشفة:' : 'Platform Detected:'} <strong>{parseVideoUrl(videoForm.videoUrl).platformName}</strong>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {isRtl ? 'تشغيل مباشر داخل الموقع' : 'Plays Directly Inline'}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-400 mb-1">{t('muscleFilter')}</label>
                  <select
                    value={videoForm.muscleGroup}
                    onChange={(e) => setVideoForm({ ...videoForm, muscleGroup: e.target.value as MuscleGroup })}
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    {['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Abs & Core', 'Full Body'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-400 mb-1">{t('difficultyFilter')}</label>
                  <select
                    value={videoForm.difficulty}
                    onChange={(e) => setVideoForm({ ...videoForm, difficulty: e.target.value as VideoDifficulty })}
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    {['Beginner', 'Intermediate', 'Advanced', 'Elite'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-400 mb-1">{t('equipmentLabel')}</label>
                  <input
                    type="text"
                    required
                    placeholder="Dumbbells / Cables"
                    value={videoForm.equipment}
                    onChange={(e) => setVideoForm({ ...videoForm, equipment: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-400 mb-1">{t('categoryFilter')}</label>
                  <select
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value as VideoCategory })}
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    {['Hypertrophy', 'Strength', 'Fat Loss', 'Mobility', 'Endurance'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-400 mb-1">{t('photoUrlLabel')}</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={videoForm.thumbnail}
                  onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-400 mb-1">{t('descriptionLabel')}</label>
                <textarea
                  rows={3}
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-gray-400 bg-white/5 cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-extrabold text-black bg-emerald-500 uppercase cursor-pointer"
                >
                  {t('saveVideoBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT TRANSFORMATION MODAL */}
      {showTfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-lg text-white">
              {editingTfId ? t('editTransformation') || 'Edit Transformation' : t('addTransformationBtn')}
            </h3>

            <form onSubmit={handleSaveTf} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-400 mb-1">{t('clientNameLabel')}</label>
                <input
                  type="text"
                  required
                  value={tfForm.clientName}
                  onChange={(e) => setTfForm({ ...tfForm, clientName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-400 mb-1">{t('beforeImageLabel')}</label>
                  <input
                    type="url"
                    required
                    value={tfForm.beforeImage}
                    onChange={(e) => setTfForm({ ...tfForm, beforeImage: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-400 mb-1">{t('afterImageLabel')}</label>
                  <input
                    type="url"
                    required
                    value={tfForm.afterImage}
                    onChange={(e) => setTfForm({ ...tfForm, afterImage: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-400 mb-1">{t('durationLabel')}</label>
                  <input
                    type="text"
                    value={tfForm.duration}
                    onChange={(e) => setTfForm({ ...tfForm, duration: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-400 mb-1">{t('weightChangeLabel')}</label>
                  <input
                    type="text"
                    value={tfForm.weightChange}
                    onChange={(e) => setTfForm({ ...tfForm, weightChange: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-400 mb-1">{t('descriptionLabel')}</label>
                <textarea
                  rows={3}
                  value={tfForm.description}
                  onChange={(e) => setTfForm({ ...tfForm, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTfModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-gray-400 bg-white/5 cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-extrabold text-black bg-emerald-500 uppercase cursor-pointer"
                >
                  {t('saveTransformationBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD REEL MODAL */}
      {showReelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">
              {t('addReelBtn')}
            </h3>

            <form onSubmit={handleSaveReel} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-400 mb-1">{t('reelTitleLabel')}</label>
                <input
                  type="text"
                  required
                  value={reelForm.title}
                  onChange={(e) => setReelForm({ ...reelForm, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-400 mb-1">{t('videoUrlLabel')}</label>
                <input
                  type="url"
                  required
                  value={reelForm.videoUrl}
                  onChange={(e) => setReelForm({ ...reelForm, videoUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white font-mono text-[11px]"
                />
                {reelForm.videoUrl && (
                  <div className="mt-1.5 p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300 flex items-center justify-between">
                    <span>
                      {isRtl ? 'المنصة المكتشفة:' : 'Platform Detected:'} <strong>{parseVideoUrl(reelForm.videoUrl).platformName}</strong>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {isRtl ? 'تشغيل مباشر داخل الموقع' : 'Plays Directly Inline'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-400 mb-1">{t('photoUrlLabel')}</label>
                <input
                  type="url"
                  value={reelForm.thumbnail}
                  onChange={(e) => setReelForm({ ...reelForm, thumbnail: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReelModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-gray-400 bg-white/5 cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-extrabold text-black bg-emerald-500 uppercase cursor-pointer"
                >
                  {t('saveReelBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRICING PLAN MODAL */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-lg text-white">
              {editingPricingId ? t('editPricingPlanBtn') : t('addPricingPlanBtn')}
            </h3>

            <form onSubmit={handleSavePricingPlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-400 mb-1">{t('planNameLabel')}</label>
                  <input
                    type="text"
                    required
                    value={pricingForm.name}
                    onChange={(e) => setPricingForm({ ...pricingForm, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. 3 Months Transformation"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-400 mb-1">{t('planPriceLabel')}</label>
                  <input
                    type="text"
                    required
                    value={pricingForm.price}
                    onChange={(e) => setPricingForm({ ...pricingForm, price: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. $120 / 3 Months"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-400 mb-1">{t('planDurationLabel')}</label>
                  <input
                    type="text"
                    value={pricingForm.durationLabel}
                    onChange={(e) => setPricingForm({ ...pricingForm, durationLabel: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. 3 Months"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-400 mb-1">{t('buttonTextLabel')}</label>
                  <input
                    type="text"
                    value={pricingForm.buttonText}
                    onChange={(e) => setPricingForm({ ...pricingForm, buttonText: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Register Now"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-400 mb-1">{t('planSubtitleLabel')}</label>
                <input
                  type="text"
                  value={pricingForm.subtitle}
                  onChange={(e) => setPricingForm({ ...pricingForm, subtitle: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Short description of who this plan is best suited for"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-400 mb-1">{t('planFeaturesLabel')}</label>
                <textarea
                  rows={5}
                  value={pricingForm.featuresText}
                  onChange={(e) => setPricingForm({ ...pricingForm, featuresText: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none font-sans"
                  placeholder={"Customized Diet Plan\nHD Workout Library Access\nWeekly WhatsApp Follow-up"}
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={pricingForm.isPopular}
                  onChange={(e) => setPricingForm({ ...pricingForm, isPopular: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
                <label htmlFor="isPopular" className="font-bold text-white text-xs cursor-pointer">
                  {t('isPopularLabel')}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPricingModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-gray-400 bg-white/5 cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-extrabold text-black bg-emerald-500 uppercase cursor-pointer"
                >
                  {t('savePricingPlanBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
