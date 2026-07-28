export type UserRole = 'admin' | 'member';
export type UserStatus = 'pending' | 'approved' | 'rejected';
export type SubscriptionType = '1_month' | '3_months' | '6_months' | '1_year' | 'custom';

export interface User {
  id: string;
  membershipId: string;
  name: string;
  email: string;
  username: string;
  password: string; // Stored securely for admin demo auth
  phone?: string;
  profilePhoto?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  subscriptionStart?: string;
  subscriptionEnd?: string; // ISO date string
  subscriptionDaysTotal?: number;
}

export type MuscleGroup = 
  | 'Chest' 
  | 'Back' 
  | 'Shoulders' 
  | 'Biceps' 
  | 'Triceps' 
  | 'Legs' 
  | 'Abs & Core' 
  | 'Full Body';

export type VideoDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';

export type VideoCategory = 'Hypertrophy' | 'Strength' | 'Fat Loss' | 'Mobility' | 'Endurance';

export interface WorkoutVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  muscleGroup: MuscleGroup;
  difficulty: VideoDifficulty;
  equipment: string;
  thumbnail: string;
  category: VideoCategory;
  createdAt: string;
  views?: number;
}

export interface Transformation {
  id: string;
  clientName: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  duration?: string; // e.g. "12 Weeks"
  weightChange?: string; // e.g. "-15 kg"
  createdAt: string;
}

export interface Reel {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  likesCount?: number;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isImportant?: boolean;
}

export interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  durationLabel: string;
  subtitle: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
}

export interface CoachProfile {
  name: string;
  title: string;
  photo: string;
  biography: string;
  experienceYears: number;
  clientsTransformed: number;
  certifications: string[];
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  telegramUrl?: string;
  xTwitterUrl?: string;
  customSocialLinks?: SocialMediaLink[];
}

export interface DatabaseState {
  users: User[];
  videos: WorkoutVideo[];
  transformations: Transformation[];
  reels: Reel[];
  announcements: Announcement[];
  coachProfile: CoachProfile;
  pricingPlans: PricingPlan[];
}
