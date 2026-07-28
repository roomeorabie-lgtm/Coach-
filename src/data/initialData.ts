import { DatabaseState } from '../types';

export const initialData: DatabaseState = {
  coachProfile: {
    name: 'COACH BODA',
    title: 'Master Bodybuilding & Hypertrophy Fitness Specialist',
    photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1000&auto=format&fit=crop',
    biography: 'Professional bodybuilding coach specializing in custom muscle hypertrophy programs, physique transformation, macronutrient coaching, and precise exercise execution.',
    experienceYears: 5,
    clientsTransformed: 500,
    certifications: [
      'ISSA Certified Personal Trainer',
      'IFBB Certified Bodybuilding & Physique Specialist',
      'Precision Nutrition Specialist'
    ],
    whatsappNumber: '+201001234567',
    instagramUrl: 'https://instagram.com',
    facebookUrl: 'https://facebook.com',
    tiktokUrl: 'https://tiktok.com',
    youtubeUrl: 'https://youtube.com',
    telegramUrl: 'https://t.me/coachboda',
    xTwitterUrl: 'https://x.com/coachboda',
    customSocialLinks: []
  },
  pricingPlans: [
    {
      id: 'plan-1',
      name: '1 Month Kickstart',
      price: '$50 / Month',
      durationLabel: '1 Month',
      subtitle: 'Ideal for rapid physique assessment & initial guidance.',
      features: [
        'Access to HD Workout Video Library',
        'Custom Workout Split & Progression',
        'Macronutrient Diet Plan'
      ],
      isPopular: false,
      buttonText: 'Choose Plan / Register Now'
    },
    {
      id: 'plan-2',
      name: '3 Months Transformation',
      price: '$120 / 3 Months',
      durationLabel: '3 Months',
      subtitle: 'Most popular plan to build dense muscle & visible results.',
      features: [
        'Access to HD Workout Video Library',
        'Custom Workout Split & Progression',
        'Macronutrient Diet Plan',
        'Direct WhatsApp Access with Coach Boda'
      ],
      isPopular: true,
      buttonText: 'Choose Plan / Register Now'
    },
    {
      id: 'plan-3',
      name: '6 Months Elite',
      price: '$200 / 6 Months',
      durationLabel: '6 Months',
      subtitle: 'Complete body recomposition & macronutrient strategy.',
      features: [
        'Access to HD Workout Video Library',
        'Custom Workout Split & Progression',
        'Macronutrient Diet Plan',
        'Direct WhatsApp Access with Coach Boda'
      ],
      isPopular: false,
      buttonText: 'Choose Plan / Register Now'
    },
    {
      id: 'plan-4',
      name: '1 Year VIP Master',
      price: '$350 / Year',
      durationLabel: '1 Year',
      subtitle: 'Full year 1-on-1 dedicated coaching for elite conditioning.',
      features: [
        'Access to HD Workout Video Library',
        'Custom Workout Split & Progression',
        'Macronutrient Diet Plan',
        'Direct WhatsApp Access with Coach Boda'
      ],
      isPopular: false,
      buttonText: 'Choose Plan / Register Now'
    }
  ],
  users: [
    {
      id: 'usr-admin-ramadan',
      membershipId: 'CB-80001',
      name: 'Ramadan (Coach Boda)',
      email: 'ramadan@coachboda.com',
      username: 'Ramadan',
      password: 'R@@@2001',
      phone: '01000000000',
      profilePhoto: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=300&auto=format&fit=crop',
      role: 'admin',
      status: 'approved',
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      subscriptionStart: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      subscriptionEnd: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString(),
      subscriptionDaysTotal: 3650
    }
  ],
  videos: [],
  transformations: [],
  reels: [],
  announcements: [
    {
      id: 'ann-1',
      title: '🔥 Welcome to Coach Boda Official Platform',
      content: 'Access your workout library, live subscription countdown timer, and personal coaching materials. Contact Coach Boda directly via WhatsApp for support.',
      createdAt: new Date().toISOString(),
      isImportant: true
    }
  ]
};

