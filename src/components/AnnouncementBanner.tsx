import React, { useState } from 'react';
import { Announcement } from '../types';
import { Megaphone, X, Bell } from 'lucide-react';

export const AnnouncementBanner: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeAnnouncements = announcements.filter(a => !dismissedIds.includes(a.id));

  if (activeAnnouncements.length === 0) return null;

  const current = activeAnnouncements[0];

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-950/80 via-[#121212] to-emerald-950/80 border border-emerald-500/40 p-4 shadow-lg mb-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="p-2 rounded-lg bg-emerald-500 text-black font-bold shrink-0 mt-0.5">
            <Megaphone className="w-5 h-5" />
          </span>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-black bg-emerald-400 px-2 py-0.5 rounded">
                ANNOUNCEMENT
              </span>
              <span className="text-xs text-gray-400">
                {new Date(current.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h4 className="font-heading font-bold text-base text-white mt-1">
              {current.title}
            </h4>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              {current.content}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setDismissedIds(prev => [...prev, current.id])}
          className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
