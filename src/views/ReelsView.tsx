import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reel } from '../types';
import { parseVideoUrl } from '../utils/videoUtils';
import { Film, Play, Heart, Share2, X, Sparkles } from 'lucide-react';

export const ReelsView: React.FC = () => {
  const { db, t } = useApp();
  const [activeReel, setActiveReel] = useState<Reel | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <Film className="w-4 h-4" />
          {t('shortFormContent')}
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
          {t('publicReelsTitle')}
        </h1>
        <p className="text-sm text-gray-300 max-w-2xl mx-auto">
          {t('publicReelsSubtitle')}
        </p>
      </div>

      {/* Reels Showcase Grid */}
      {db.reels.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
          <Film className="w-12 h-12 text-gray-500 mx-auto stroke-1" />
          <h3 className="font-heading font-bold text-lg text-white">{t('noReelsFound')}</h3>
          <p className="text-xs text-gray-400">
            {t('noReelsFoundSub')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {db.reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-black border border-white/10 glass-card-hover cursor-pointer flex flex-col justify-between shadow-2xl"
            >
              <img
                src={reel.thumbnail || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop"}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                <div className="p-4 rounded-full bg-emerald-500 text-black shadow-2xl glow-emerald">
                  <Play className="w-8 h-8 fill-black" />
                </div>
              </div>

              {/* Top Tag */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-black px-2.5 py-1 rounded shadow">
                  REEL
                </span>
              </div>

              {/* Bottom Caption Info */}
              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <p className="font-heading font-bold text-sm text-white line-clamp-2">
                  {reel.title}
                </p>
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-emerald-400" />
                    {reel.likesCount || 1200}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase">{t('watchNow')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reel Modal Player */}
      {activeReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-lg bg-[#121212] border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-black/80 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-emerald-400 font-heading">
                {activeReel.title}
              </span>
              <button
                onClick={() => setActiveReel(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[9/16] w-full bg-black flex items-center justify-center">
              {(() => {
                const parsed = parseVideoUrl(activeReel.videoUrl);
                if (!parsed.embedUrl) {
                  return <div className="text-gray-400 text-xs p-4 text-center">Video URL unavailable</div>;
                }
                if (parsed.type === 'mp4') {
                  return (
                    <video
                      src={parsed.embedUrl}
                      controls
                      autoPlay
                      loop
                      playsInline
                      onEnded={(e) => {
                        e.currentTarget.currentTime = 0;
                        e.currentTarget.play().catch(() => {});
                      }}
                      className="w-full h-full object-contain"
                    />
                  );
                } else {
                  return (
                    <iframe
                      src={parsed.embedUrl}
                      title={activeReel.title}
                      className="w-full h-full border-0 bg-black"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      scrolling="no"
                    />
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
