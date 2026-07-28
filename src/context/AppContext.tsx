import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DatabaseState, 
  User, 
  WorkoutVideo, 
  Transformation, 
  Reel, 
  Announcement, 
  CoachProfile, 
  PricingPlan,
  SocialMediaLink,
  SubscriptionType 
} from '../types';
import { initialData } from '../data/initialData';
import { Language, translations } from '../utils/translations';

const STORAGE_KEY = 'COACH_BODA_DATA_V2';
const AUTH_KEY = 'COACH_BODA_AUTH_USER_V2';
const LANG_KEY = 'COACH_BODA_LANG';

interface AppContextType {
  db: DatabaseState;
  currentUser: User | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
  login: (phoneOrAccount: string, password: string) => { success: boolean; message: string };
  register: (data: { name: string; phone: string; password: string }) => { success: boolean; message: string };
  logout: () => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  assignSubscription: (userId: string, type: SubscriptionType, customDays?: number) => void;
  renewSubscription: (userId: string, daysToAdd: number) => void;
  addVideo: (video: Omit<WorkoutVideo, 'id' | 'createdAt'>) => void;
  editVideo: (id: string, video: Partial<WorkoutVideo>) => void;
  deleteVideo: (id: string) => void;
  addTransformation: (tf: Omit<Transformation, 'id' | 'createdAt'>) => void;
  editTransformation: (id: string, tf: Partial<Transformation>) => void;
  deleteTransformation: (id: string) => void;
  addReel: (reel: Omit<Reel, 'id' | 'createdAt'>) => void;
  deleteReel: (id: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;
  updateCoachProfile: (profile: Partial<CoachProfile>) => void;
  addCertification: (cert: string) => void;
  editCertification: (index: number, cert: string) => void;
  deleteCertification: (index: number) => void;
  addCustomSocialLink: (link: { platform: string; url: string }) => void;
  deleteCustomSocialLink: (id: string) => void;
  addPricingPlan: (plan: Omit<PricingPlan, 'id'>) => void;
  editPricingPlan: (id: string, plan: Partial<PricingPlan>) => void;
  deletePricingPlan: (id: string) => void;
  updateUserProfile: (userId: string, data: { name?: string; password?: string; profilePhoto?: string; phone?: string }) => { success: boolean; message: string };
  exportBackup: () => void;
  importBackup: (jsonContent: string) => { success: boolean; message: string };
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(LANG_KEY);
      if (savedLang === 'ar' || savedLang === 'en') return savedLang;
    } catch (e) {
      console.error(e);
    }
    return 'ar'; // Default to Arabic as preferred for Coach Boda platform
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof typeof translations['en']): string => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  const [db, setDb] = useState<DatabaseState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          coachProfile: parsed.coachProfile || initialData.coachProfile,
          users: Array.isArray(parsed.users) ? parsed.users : initialData.users,
          videos: Array.isArray(parsed.videos) ? parsed.videos : initialData.videos,
          transformations: Array.isArray(parsed.transformations) ? parsed.transformations : initialData.transformations,
          reels: Array.isArray(parsed.reels) ? parsed.reels : initialData.reels,
          announcements: Array.isArray(parsed.announcements) ? parsed.announcements : initialData.announcements,
          pricingPlans: Array.isArray(parsed.pricingPlans) && parsed.pricingPlans.length > 0 ? parsed.pricingPlans : initialData.pricingPlans,
        };
      }
    } catch (e) {
      console.error('Failed to load storage, using initialData', e);
    }
    return initialData;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_KEY);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Failed to load auth user', e);
    }
    return null;
  });

  // Save database whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save database state to localStorage', e);
    }
  }, [db]);

  // Keep currentUser state in sync with updated DB user state
  useEffect(() => {
    if (currentUser) {
      const updatedUser = db.users.find(u => u.id === currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      }
    }
  }, [db.users]);

  // Clean phone helper
  const cleanPhone = (str: string) => str.replace(/[^0-9]/g, '');

  // Login handler using Phone or Admin Account Identifier
  const login = (phoneOrAccount: string, password: string) => {
    const rawInput = phoneOrAccount.trim();
    const cleanedInputDigits = cleanPhone(rawInput);

    // Find user by phone, username, email, or membershipId
    const foundUser = db.users.find(u => {
      const uPhoneClean = u.phone ? cleanPhone(u.phone) : '';
      if (cleanedInputDigits && uPhoneClean && (uPhoneClean === cleanedInputDigits || uPhoneClean.endsWith(cleanedInputDigits) || cleanedInputDigits.endsWith(uPhoneClean))) {
        return true;
      }
      if (u.username.toLowerCase() === rawInput.toLowerCase()) return true;
      if (u.email.toLowerCase() === rawInput.toLowerCase()) return true;
      if (u.membershipId.toLowerCase() === rawInput.toLowerCase()) return true;
      return false;
    });

    if (!foundUser) {
      return { 
        success: false, 
        message: language === 'ar' ? 'رقم الهاتف أو كلمة المرور غير صحيحة.' : 'Invalid phone number or password.' 
      };
    }

    if (foundUser.password !== password) {
      return { 
        success: false, 
        message: language === 'ar' ? 'رقم الهاتف أو كلمة المرور غير صحيحة.' : 'Invalid phone number or password.' 
      };
    }

    if (foundUser.status === 'pending') {
      return { 
        success: false, 
        message: t('lockReasonPending') 
      };
    }

    if (foundUser.status === 'rejected') {
      return { 
        success: false, 
        message: language === 'ar' ? 'عفواً، طلب حسابك لم يتم قبوله. يرجى التواصل مع كابتن بودا.' : 'Your account registration was not approved. Please contact Coach Boda directly.' 
      };
    }

    // Success
    setCurrentUser(foundUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(foundUser));
    return { 
      success: true, 
      message: language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!' 
    };
  };

  // Simplified Register Handler (Name, Phone, Password)
  const register = (data: { name: string; phone: string; password: string }) => {
    const phoneClean = cleanPhone(data.phone);
    if (!phoneClean || phoneClean.length < 6) {
      return { 
        success: false, 
        message: language === 'ar' ? 'يرجى إدخال رقم هاتف صحيح.' : 'Please enter a valid phone number.' 
      };
    }

    // Check duplicate phone
    const phoneExists = db.users.some(u => u.phone && cleanPhone(u.phone) === phoneClean);
    if (phoneExists) {
      return { 
        success: false, 
        message: language === 'ar' ? 'رقم الهاتف مسجل بالفعل. يرجى تسجيل الدخول.' : 'This phone number is already registered. Please log in.' 
      };
    }

    const newMembershipId = `CB-${Math.floor(10000 + Math.random() * 90000)}`;
    const generatedUsername = `user_${phoneClean}`;
    const generatedEmail = `${phoneClean}@coachboda.com`;

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      membershipId: newMembershipId,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: generatedEmail,
      username: generatedUsername,
      password: data.password,
      role: 'member',
      status: 'pending', // Pending Admin approval
      createdAt: new Date().toISOString()
    };

    setDb(prev => ({
      ...prev,
      users: [newUser, ...prev.users]
    }));

    return { 
      success: true, 
      message: language === 'ar' ? 'تم إرسال طلب التسجيل بنجاح! حسابك بانتظار موافقة الكابتن بودا.' : 'Registration submitted successfully! Your account is now pending approval by Coach Boda.' 
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  // Admin User Approvals
  const approveUser = (userId: string) => {
    const now = new Date();
    // Default 30 days subscription upon initial approval if none set
    const defaultEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'approved',
            subscriptionStart: u.subscriptionStart || now.toISOString(),
            subscriptionEnd: u.subscriptionEnd || defaultEnd.toISOString(),
            subscriptionDaysTotal: u.subscriptionDaysTotal || 30
          };
        }
        return u;
      })
    }));
  };

  const rejectUser = (userId: string) => {
    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, status: 'rejected' } : u)
    }));
  };

  const deleteUser = (userId: string) => {
    setDb(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId)
    }));
  };

  // Subscriptions
  const assignSubscription = (userId: string, type: SubscriptionType, customDays?: number) => {
    let days = 30;
    if (type === '1_month') days = 30;
    else if (type === '3_months') days = 90;
    else if (type === '6_months') days = 180;
    else if (type === '1_year') days = 365;
    else if (type === 'custom' && customDays && customDays > 0) days = customDays;

    const start = new Date();
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            subscriptionStart: start.toISOString(),
            subscriptionEnd: end.toISOString(),
            subscriptionDaysTotal: days,
            status: 'approved'
          };
        }
        return u;
      })
    }));
  };

  const renewSubscription = (userId: string, daysToAdd: number) => {
    if (daysToAdd <= 0) return;

    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => {
        if (u.id === userId) {
          const currentEnd = u.subscriptionEnd ? new Date(u.subscriptionEnd) : new Date();
          const baseDate = currentEnd.getTime() > Date.now() ? currentEnd : new Date();
          const newEnd = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

          return {
            ...u,
            subscriptionStart: u.subscriptionStart || new Date().toISOString(),
            subscriptionEnd: newEnd.toISOString(),
            subscriptionDaysTotal: (u.subscriptionDaysTotal || 0) + daysToAdd,
            status: 'approved'
          };
        }
        return u;
      })
    }));
  };

  // Workout Videos
  const addVideo = (video: Omit<WorkoutVideo, 'id' | 'createdAt'>) => {
    const newVid: WorkoutVideo = {
      ...video,
      id: `vid-${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 0
    };
    setDb(prev => ({ ...prev, videos: [newVid, ...prev.videos] }));
  };

  const editVideo = (id: string, videoData: Partial<WorkoutVideo>) => {
    setDb(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id === id ? { ...v, ...videoData } : v)
    }));
  };

  const deleteVideo = (id: string) => {
    setDb(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== id) }));
  };

  // Transformations
  const addTransformation = (tf: Omit<Transformation, 'id' | 'createdAt'>) => {
    const newTf: Transformation = {
      ...tf,
      id: `tf-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setDb(prev => ({ ...prev, transformations: [newTf, ...prev.transformations] }));
  };

  const editTransformation = (id: string, tfData: Partial<Transformation>) => {
    setDb(prev => ({
      ...prev,
      transformations: prev.transformations.map(t => t.id === id ? { ...t, ...tfData } : t)
    }));
  };

  const deleteTransformation = (id: string) => {
    setDb(prev => ({ ...prev, transformations: prev.transformations.filter(t => t.id !== id) }));
  };

  // Reels
  const addReel = (reel: Omit<Reel, 'id' | 'createdAt'>) => {
    const newReel: Reel = {
      ...reel,
      id: `reel-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: Math.floor(Math.random() * 500) + 100
    };
    setDb(prev => ({ ...prev, reels: [newReel, ...prev.reels] }));
  };

  const deleteReel = (id: string) => {
    setDb(prev => ({ ...prev, reels: prev.reels.filter(r => r.id !== id) }));
  };

  // Announcements
  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setDb(prev => ({ ...prev, announcements: [newAnn, ...prev.announcements] }));
  };

  const deleteAnnouncement = (id: string) => {
    setDb(prev => ({ ...prev, announcements: prev.announcements.filter(a => a.id !== id) }));
  };

  // Coach Profile & Certifications
  const updateCoachProfile = (profile: Partial<CoachProfile>) => {
    setDb(prev => ({
      ...prev,
      coachProfile: { ...prev.coachProfile, ...profile }
    }));
  };

  const addCertification = (cert: string) => {
    const trimmed = cert.trim();
    if (!trimmed) return;
    setDb(prev => ({
      ...prev,
      coachProfile: {
        ...prev.coachProfile,
        certifications: [...(prev.coachProfile.certifications || []), trimmed]
      }
    }));
  };

  const editCertification = (index: number, cert: string) => {
    const trimmed = cert.trim();
    if (!trimmed) return;
    setDb(prev => {
      const updated = [...(prev.coachProfile.certifications || [])];
      if (index >= 0 && index < updated.length) {
        updated[index] = trimmed;
      }
      return {
        ...prev,
        coachProfile: { ...prev.coachProfile, certifications: updated }
      };
    });
  };

  const deleteCertification = (index: number) => {
    setDb(prev => ({
      ...prev,
      coachProfile: {
        ...prev.coachProfile,
        certifications: (prev.coachProfile.certifications || []).filter((_, i) => i !== index)
      }
    }));
  };

  const addCustomSocialLink = (link: { platform: string; url: string }) => {
    if (!link.url.trim()) return;
    const newLink: SocialMediaLink = {
      id: `social-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      platform: link.platform.trim() || 'Social',
      url: link.url.trim()
    };
    setDb(prev => ({
      ...prev,
      coachProfile: {
        ...prev.coachProfile,
        customSocialLinks: [...(prev.coachProfile.customSocialLinks || []), newLink]
      }
    }));
  };

  const deleteCustomSocialLink = (id: string) => {
    setDb(prev => ({
      ...prev,
      coachProfile: {
        ...prev.coachProfile,
        customSocialLinks: (prev.coachProfile.customSocialLinks || []).filter(l => l.id !== id)
      }
    }));
  };

  // Pricing Plans
  const addPricingPlan = (plan: Omit<PricingPlan, 'id'>) => {
    const newPlan: PricingPlan = {
      ...plan,
      id: `plan-${Date.now()}`
    };
    setDb(prev => ({ ...prev, pricingPlans: [...(prev.pricingPlans || []), newPlan] }));
  };

  const editPricingPlan = (id: string, planData: Partial<PricingPlan>) => {
    setDb(prev => ({
      ...prev,
      pricingPlans: (prev.pricingPlans || []).map(p => p.id === id ? { ...p, ...planData } : p)
    }));
  };

  const deletePricingPlan = (id: string) => {
    setDb(prev => ({
      ...prev,
      pricingPlans: (prev.pricingPlans || []).filter(p => p.id !== id)
    }));
  };

  // User Self Profile Update
  const updateUserProfile = (userId: string, data: { name?: string; password?: string; profilePhoto?: string; phone?: string }) => {
    let success = false;
    let message = language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح!' : 'Profile updated successfully!';

    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => {
        if (u.id === userId) {
          success = true;
          return {
            ...u,
            ...(data.name ? { name: data.name } : {}),
            ...(data.password ? { password: data.password } : {}),
            ...(data.profilePhoto ? { profilePhoto: data.profilePhoto } : {}),
            ...(data.phone ? { phone: data.phone } : {})
          };
        }
        return u;
      })
    }));

    return { success, message };
  };

  // Backup & Restore
  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `COACH_BODA_BACKUP_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (jsonContent: string) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid JSON backup format.' };
      }

      setDb({
        coachProfile: parsed.coachProfile || initialData.coachProfile,
        users: Array.isArray(parsed.users) ? parsed.users : [],
        videos: Array.isArray(parsed.videos) ? parsed.videos : [],
        transformations: Array.isArray(parsed.transformations) ? parsed.transformations : [],
        reels: Array.isArray(parsed.reels) ? parsed.reels : [],
        announcements: Array.isArray(parsed.announcements) ? parsed.announcements : []
      });

      return { success: true, message: 'Data backup successfully restored!' };
    } catch (e: any) {
      return { success: false, message: `Failed to import JSON: ${e.message}` };
    }
  };

  const resetData = () => {
    setDb(initialData);
  };

  return (
    <AppContext.Provider value={{
      db,
      currentUser,
      language,
      setLanguage,
      t,
      login,
      register,
      logout,
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
      updateUserProfile,
      exportBackup,
      importBackup,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

