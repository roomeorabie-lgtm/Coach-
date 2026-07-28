import React from 'react';
import { WorkoutVideo } from '../types';
import { parseVideoUrl } from '../utils/videoUtils';
import { X, Dumbbell, ShieldAlert, Award, Tag } from 'lucide-react';

interface VideoPlayerModalProps {
  video: WorkoutVideo | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  const parsed = parseVideoUrl(video.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#121212] border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 bg-black/60 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Dumbbell className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-heading">
              {video.muscleGroup} • {video.category}
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {parsed.type === 'mp4' && parsed.embedUrl ? (
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
          ) : parsed.embedUrl ? (
            <iframe 
              src={parsed.embedUrl}
              title={video.title}
              className="w-full h-full border-0 bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              scrolling="no"
            />
          ) : (
            <div className="text-gray-400 text-xs p-4 text-center">Video URL unavailable</div>
          )}
        </div>

        {/* Video Details Bar */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-black bg-emerald-400 px-2 py-0.5 rounded">
                  {parsed.platformName}
                </span>
              </div>
              <h2 className="font-heading font-extrabold text-xl md:text-2xl text-white">
                {video.title}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Tag className="w-3 h-3" />
                {video.muscleGroup}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Award className="w-3 h-3" />
                {video.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Dumbbell className="w-3 h-3" />
                {video.equipment}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed border-t border-white/10 pt-4">
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
};
