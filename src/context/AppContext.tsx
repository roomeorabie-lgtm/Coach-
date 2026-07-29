import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db as firestoreDb } from '../lib/firebase';
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

const AUTH_KEY = 'COACH_BODA_AUTH_USER_V2';
const LANG_KEY = 'COACH_BODA_LANG';

interface AppContextType {
  db: DatabaseState;
  currentUser: User | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
  login: (phoneOrAccount: string, password: string) => { success: boolean; message: string };
  register: (data: { name: string; phone: string; password: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  assignSubscription: (userId: string, type: SubscriptionType, customDays?: number) => Promise<void>;
  renewSubscription: (userId: string, daysToAdd: number) => Promise<void>;
  addVideo: (video: Omit<WorkoutVideo, 'id' | 'createdAt'>) => Promise<void>;
  editVideo: (id: string, video: Partial<WorkoutVideo>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  addTransformation: (tf: Omit<Transformation, 'id' | 'createdAt'>) => Promise<void>;
  editTransformation: (id: string, tf: Partial<Transformation>) => Promise<void>;
  deleteTransformation: (id: string) => Promise<void>;
  addReel: (reel: Omit<Reel, 'id' | 'createdAt'>) => Promise<void>;
  deleteReel: (id: string) => Promise<void>;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  updateCoachProfile: (profile: Partial<CoachProfile>) => Promise<void>;
  addCertification: (cert: string) => Promise<void>;
  editCertification: (index: number, cert: string) => Promise<void>;
  deleteCertification: (index: number) => Promise<void>;
  addCustomSocialLink: (link: { platform: string; url: string }) => Promise<void>;
  deleteCustomSocialLink: (id: string) => Promise<void>;
  addPricingPlan: (plan: Omit<PricingPlan, 'id'>) => Promise<void>;
  editPricingPlan: (id: string, plan: Partial<PricingPlan>) => Promise<void>;
  deletePricingPlan: (id: string) => Promise<void>;
  updateUserProfile: (userId: string, data: { name?: string; password?: string; profilePhoto?: string; phone?: string }) => Promise<{ success: boolean; message: string }>;
  exportBackup: () => void;
  importBackup: (jsonContent: string) => Promise<{ success: boolean; message: string }>;
  resetData: () => Promise<void>;
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
    return 'ar';
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

  const [db, setDb] = useState<DatabaseState>(initialData);

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

  // REAL-TIME FIRESTORE LISTENERS
  useEffect(() => {
    // 1. Coach Profile Listener
    const unsubCoach = onSnapshot(doc(firestoreDb, 'settings', 'coachProfile'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as CoachProfile;
        setDb(prev => ({ ...prev, coachProfile: data }));
      } else {
        // Seed initial coach profile if document doesn't exist yet
        setDoc(doc(firestoreDb, 'settings', 'coachProfile'), initialData.coachProfile).catch(console.error);
      }
    }, (err) => console.error("Firestore coachProfile error:", err));

    // 2. Users Listener
    const unsubUsers = onSnapshot(collection(firestoreDb, 'users'), (snapshot) => {
      if (!snapshot.empty) {
        const usersList = snapshot.docs.map(doc => doc.data() as User);
        setDb(prev => ({ ...prev, users: usersList }));
      } else {
        // Seed initial users if collection is empty
        initialData.users.forEach(u => {
          setDoc(doc(firestoreDb, 'users', u.id), u).catch(console.error);
        });
      }
    }, (err) => console.error("Firestore users error:", err));

    // 3. Videos Listener
    const unsubVideos = onSnapshot(collection(firestoreDb, 'videos'), (snapshot) => {
      const videosList = snapshot.docs.map(doc => doc.data() as WorkoutVideo);
      setDb(prev => ({ ...prev, videos: videosList }));
    }, (err) => console.error("Firestore videos error:", err));

    // 4. Transformations Listener
    const unsubTfs = onSnapshot(collection(firestoreDb, 'transformations'), (snapshot) => {
      const tfsList = snapshot.docs.map(doc => doc.data() as Transformation);
      setDb(prev => ({ ...prev, transformations: tfsList }));
    }, (err) => console.error("Firestore transformations error:", err));

    // 5. Reels Listener
    const unsubReels = onSnapshot(collection(firestoreDb, 'reels'), (snapshot) => {
      const reelsList = snapshot.docs.map(doc => doc.data() as Reel);
      setDb(prev => ({ ...prev, reels: reelsList }));
    }, (err) => console.error("Firestore reels error:", err));

    // 6. Announcements Listener
    const unsubAnn = onSnapshot(collection(firestoreDb, 'announcements'), (snapshot) => {
      if (!snapshot.empty) {
        const annList = snapshot.docs.map(doc => doc.data() as Announcement);
        setDb(prev => ({ ...prev, announcements: annList }));
      } else {
        initialData.announcements.forEach(a => {
          setDoc(doc(firestoreDb, 'announcements', a.id), a).catch(console.error);
        });
      }
    }, (err) => console.error("Firestore announcements error:", err));

    // 7. Pricing Plans Listener
    const unsubPlans = onSnapshot(collection(firestoreDb, 'pricingPlans'), (snapshot) => {
      if (!snapshot.empty) {
        const plansList = snapshot.docs.map(doc => doc.data() as PricingPlan);
        setDb(prev => ({ ...prev, pricingPlans: plansList }));
      } else {
        initialData.pricingPlans.forEach(p => {
          setDoc(doc(firestoreDb, 'pricingPlans', p.id), p).catch(console.error);
        });
      }
    }, (err) => console.error("Firestore pricingPlans error:", err));

    return () => {
      unsubCoach();
      unsubUsers();
      unsubVideos();
      unsubTfs();
      unsubReels();
      unsubAnn();
      unsubPlans();
    };
  }, []);

  // Sync logged in currentUser state when user record updates in Firestore
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

  // Login handler
  const login = (phoneOrAccount: string, password: string) => {
    const rawInput = phoneOrAccount.trim();
    const cleanedInputDigits = cleanPhone(rawInput);

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
        message: language === 'ar' ? 'حسابك قيد المراجعة والموافقة من قبل الكابتن بودا.' : 'Your account is pending review and approval by Coach Boda.'
      };
    }

    if (foundUser.status === 'rejected') {
      return { 
        success: false, 
        message: language === 'ar' ? 'عفواً، طلب حسابك لم يتم قبوله. يرجى التواصل مع كابتن بودا.' : 'Your account registration was not approved. Please contact Coach Boda directly.' 
      };
    }

    setCurrentUser(foundUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(foundUser));
    return { 
      success: true, 
      message: language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!' 
    };
  };

  // Register Handler
  const register = async (data: { name: string; phone: string; password: string }) => {
    const phoneClean = cleanPhone(data.phone);
    if (!phoneClean || phoneClean.length < 6) {
      return { 
        success: false, 
        message: language === 'ar' ? 'يرجى إدخال رقم هاتف صحيح.' : 'Please enter a valid phone number.' 
      };
    }

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
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(firestoreDb, 'users', newUser.id), newUser);
      return { 
        success: true, 
        message: language === 'ar' ? 'تم إرسال طلب التسجيل بنجاح! حسابك بانتظار موافقة الكابتن بودا.' : 'Registration submitted successfully! Your account is now pending approval by Coach Boda.' 
      };
    } catch (e: any) {
      console.error('Registration error:', e);
      return { success: false, message: e.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  // Admin User Approvals
  const approveUser = async (userId: string) => {
    const user = db.users.find(u => u.id === userId);
    if (!user) return;

    const now = new Date();
    const defaultEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const updated: User = {
      ...user,
      status: 'approved',
      subscriptionStart: user.subscriptionStart || now.toISOString(),
      subscriptionEnd: user.subscriptionEnd || defaultEnd.toISOString(),
      subscriptionDaysTotal: user.subscriptionDaysTotal || 30
    };

    await setDoc(doc(firestoreDb, 'users', userId), updated, { merge: true });
  };

  const rejectUser = async (userId: string) => {
    const user = db.users.find(u => u.id === userId);
    if (!user) return;
    await setDoc(doc(firestoreDb, 'users', userId), { ...user, status: 'rejected' }, { merge: true });
  };

  const deleteUser = async (userId: string) => {
    await deleteDoc(doc(firestoreDb, 'users', userId));
  };

  // Subscriptions
  const assignSubscription = async (userId: string, type: SubscriptionType, customDays?: number) => {
    const user = db.users.find(u => u.id === userId);
    if (!user) return;

    let days = 30;
    if (type === '1_month') days = 30;
    else if (type === '3_months') days = 90;
    else if (type === '6_months') days = 180;
    else if (type === '1_year') days = 365;
    else if (type === 'custom' && customDays && customDays > 0) days = customDays;

    const start = new Date();
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

    const updated: User = {
      ...user,
      subscriptionStart: start.toISOString(),
      subscriptionEnd: end.toISOString(),
      subscriptionDaysTotal: days,
      status: 'approved'
    };

    await setDoc(doc(firestoreDb, 'users', userId), updated, { merge: true });
  };

  const renewSubscription = async (userId: string, daysToAdd: number) => {
    if (daysToAdd <= 0) return;
    const user = db.users.find(u => u.id === userId);
    if (!user) return;

    const currentEnd = user.subscriptionEnd ? new Date(user.subscriptionEnd) : new Date();
    const baseDate = currentEnd.getTime() > Date.now() ? currentEnd : new Date();
    const newEnd = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    const updated: User = {
      ...user,
      subscriptionStart: user.subscriptionStart || new Date().toISOString(),
      subscriptionEnd: newEnd.toISOString(),
      subscriptionDaysTotal: (user.subscriptionDaysTotal || 0) + daysToAdd,
      status: 'approved'
    };

    await setDoc(doc(firestoreDb, 'users', userId), updated, { merge: true });
  };

  // Workout Videos
  const addVideo = async (video: Omit<WorkoutVideo, 'id' | 'createdAt'>) => {
    const newVid: WorkoutVideo = {
      ...video,
      id: `vid-${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 0
    };
    await setDoc(doc(firestoreDb, 'videos', newVid.id), newVid);
  };

  const editVideo = async (id: string, videoData: Partial<WorkoutVideo>) => {
    await setDoc(doc(firestoreDb, 'videos', id), videoData, { merge: true });
  };

  const deleteVideo = async (id: string) => {
    await deleteDoc(doc(firestoreDb, 'videos', id));
  };

  // Transformations
  const addTransformation = async (tf: Omit<Transformation, 'id' | 'createdAt'>) => {
    const newTf: Transformation = {
      ...tf,
      id: `tf-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(firestoreDb, 'transformations', newTf.id), newTf);
  };

  const editTransformation = async (id: string, tfData: Partial<Transformation>) => {
    await setDoc(doc(firestoreDb, 'transformations', id), tfData, { merge: true });
  };

  const deleteTransformation = async (id: string) => {
    await deleteDoc(doc(firestoreDb, 'transformations', id));
  };

  // Reels
  const addReel = async (reel: Omit<Reel, 'id' | 'createdAt'>) => {
    const newReel: Reel = {
      ...reel,
      id: `reel-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: Math.floor(Math.random() * 500) + 100
    };
    await setDoc(doc(firestoreDb, 'reels', newReel.id), newReel);
  };

  const deleteReel = async (id: string) => {
    await deleteDoc(doc(firestoreDb, 'reels', id));
  };

  // Announcements
  const addAnnouncement = async (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(firestoreDb, 'announcements', newAnn.id), newAnn);
  };

  const deleteAnnouncement = async (id: string) => {
    await deleteDoc(doc(firestoreDb, 'announcements', id));
  };

  // Coach Profile & Certifications
  const updateCoachProfile = async (profile: Partial<CoachProfile>) => {
    const updated = { ...db.coachProfile, ...profile };
    await setDoc(doc(firestoreDb, 'settings', 'coachProfile'), updated, { merge: true });
  };

  const addCertification = async (cert: string) => {
    const trimmed = cert.trim();
    if (!trimmed) return;
    const updatedCerts = [...(db.coachProfile.certifications || []), trimmed];
    await setDoc(doc(firestoreDb, 'settings', 'coachProfile'), { ...db.coachProfile, certifications: updatedCerts }, { merge: true });
  };

  const editCertification = async (index: number, cert: string) => {
    const trimmed = cert.trim();
    if (!trimmed) return;
    const updatedCerts = [...(db.coachProfile.certifications || [])];
    if (index >= 0 && index < updatedCerts.length) {
      updatedCerts[index] = trimmed;
    }
    await setDoc(doc(firestoreDb, 'settings', 'coachProfile'), { ...db.coachProfile, certifications: updatedCerts }, { merge: true });
  };

  const deleteCertification = async (index: number) => {
    const updatedCerts = (db.coachProfile.certifications || []).filter((_, i) => i !== index);
    await setDoc(doc(firestoreDb, 'settings', 'coachProfile'), { ...db.coachProfile, certifications: updatedCerts }, { merge: true });
  };

  const addCustomSocialLink = async (link: { platform: string; url: string }) => {
    if (!link.url.trim()) return;
    const newLink: SocialMediaLink = {
      id: `social-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      platform: link.platform.trim() || 'Social',
      url: link.url.trim()
    };
    const updatedLinks = [...(db.coachProfile.customSocialLinks || []), newLink];
    await setDoc(doc(firestoreDb, 'settings', 'coachProfile'), { ...db.coachProfile, customSocialLinks: updatedLinks }, { merge: true });
  };

  const deleteCustomSocialLink = async (id: string) => {
    const updatedLinks = (db.coachProfile.customSocialLinks || []).filter(l => l.id !== id);
    await setDoc(doc(firestoreDb, 'settings', 'coachProfile'), { ...db.coachProfile, customSocialLinks: updatedLinks }, { merge: true });
  };

  // Pricing Plans
  const addPricingPlan = async (plan: Omit<PricingPlan, 'id'>) => {
    const newPlan: PricingPlan = {
      ...plan,
      id: `plan-${Date.now()}`
    };
    await setDoc(doc(firestoreDb, 'pricingPlans', newPlan.id), newPlan);
  };

  const editPricingPlan = async (id: string, planData: Partial<PricingPlan>) => {
    await setDoc(doc(firestoreDb, 'pricingPlans', id), planData, { merge: true });
  };

  const deletePricingPlan = async (id: string) => {
    await deleteDoc(doc(firestoreDb, 'pricingPlans', id));
  };

  // User Self Profile Update
  const updateUserProfile = async (userId: string, data: { name?: string; password?: string; profilePhoto?: string; phone?: string }) => {
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    const updatedUser: User = {
      ...user,
      ...(data.name ? { name: data.name } : {}),
      ...(data.password ? { password: data.password } : {}),
      ...(data.profilePhoto ? { profilePhoto: data.profilePhoto } : {}),
      ...(data.phone ? { phone: data.phone } : {})
    };
    try {
      await setDoc(doc(firestoreDb, 'users', userId), updatedUser, { merge: true });
      return { 
        success: true, 
        message: language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح!' : 'Profile updated successfully!' 
      };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
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

  const importBackup = async (jsonContent: string) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid JSON backup format.' };
      }

      if (parsed.coachProfile) {
        await setDoc(doc(firestoreDb, 'settings', 'coachProfile'), parsed.coachProfile);
      }
      if (Array.isArray(parsed.users)) {
        for (const u of parsed.users) {
          await setDoc(doc(firestoreDb, 'users', u.id), u);
        }
      }
      if (Array.isArray(parsed.videos)) {
        for (const v of parsed.videos) {
          await setDoc(doc(firestoreDb, 'videos', v.id), v);
        }
      }
      if (Array.isArray(parsed.transformations)) {
        for (const tf of parsed.transformations) {
          await setDoc(doc(firestoreDb, 'transformations', tf.id), tf);
        }
      }
      if (Array.isArray(parsed.reels)) {
        for (const r of parsed.reels) {
          await setDoc(doc(firestoreDb, 'reels', r.id), r);
        }
      }
      if (Array.isArray(parsed.announcements)) {
        for (const a of parsed.announcements) {
          await setDoc(doc(firestoreDb, 'announcements', a.id), a);
        }
      }
      if (Array.isArray(parsed.pricingPlans)) {
        for (const p of parsed.pricingPlans) {
          await setDoc(doc(firestoreDb, 'pricingPlans', p.id), p);
        }
      }

      return { success: true, message: 'Data backup successfully restored to database!' };
    } catch (e: any) {
      return { success: false, message: `Failed to import JSON: ${e.message}` };
    }
  };

  const resetData = async () => {
    await setDoc(doc(firestoreDb, 'settings', 'coachProfile'), initialData.coachProfile);
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
