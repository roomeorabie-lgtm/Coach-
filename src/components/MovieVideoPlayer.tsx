import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Film } from 'lucide-react';

export const MOVIE_VIDEO_URL = "https://www.image2url.com/r2/default/videos/1785270924759-67f4a0b2-3921-4c86-88aa-4e14bc7b6885.mp4";

export const MovieVideoPlayer: React.FC<{ title?: string }> = ({ 
  title = "COACH BODA | Exclusive Transformation & Training Teaser" 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Autoplay audio policy handled:", err);
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, []);

  const handleEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black group border border-emerald-500/20 glow-emerald">
      {/* Cinematic Horizontal Aspect Ratio Container */}
      <div className="relative aspect-video w-full bg-black">
        <video 
          ref={videoRef}
          src={MOVIE_VIDEO_URL}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onEnded={handleEnded}
          className="w-full h-full object-cover cursor-pointer"
          onClick={togglePlay}
        />

        {/* Top Glass Caption Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500 text-black">
              <Film className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              {title}
            </span>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-black bg-emerald-400 px-2 py-0.5 rounded">
            4K CINEMATIC
          </span>
        </div>

        {/* Bottom Control Bar Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3">
            <button 
              onClick={togglePlay}
              className="p-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black transition-colors cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
            </button>

            <button 
              onClick={toggleMute}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-emerald-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <span className="text-xs font-medium text-gray-300 hidden sm:inline">
              Coach Boda Official Teaser
            </span>
          </div>

          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
