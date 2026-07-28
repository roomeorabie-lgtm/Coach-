export interface VideoEmbedInfo {
  type: 'youtube' | 'vimeo' | 'instagram' | 'tiktok' | 'facebook' | 'mp4' | 'iframe_generic';
  embedUrl: string;
  platformName: string;
  originalUrl: string;
  isEmbeddable: boolean;
  noticeMessage?: string;
  noticeMessageAr?: string;
}

export function parseVideoUrl(url: string): VideoEmbedInfo {
  if (!url || typeof url !== 'string') {
    return {
      type: 'mp4',
      embedUrl: '',
      platformName: 'Video',
      originalUrl: '',
      isEmbeddable: false,
    };
  }

  const trimmedUrl = url.trim();

  // 1. YOUTUBE / YOUTUBE SHORTS
  if (trimmedUrl.includes('youtube.com') || trimmedUrl.includes('youtu.be')) {
    let videoId = '';
    
    if (trimmedUrl.includes('shorts/')) {
      const parts = trimmedUrl.split('shorts/');
      videoId = parts[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (trimmedUrl.includes('youtu.be/')) {
      const parts = trimmedUrl.split('youtu.be/');
      videoId = parts[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (trimmedUrl.includes('v=')) {
      const params = new URLSearchParams(trimmedUrl.split('?')[1] || '');
      videoId = params.get('v') || '';
    } else if (trimmedUrl.includes('/embed/')) {
      return {
        type: 'youtube',
        embedUrl: trimmedUrl,
        platformName: 'YouTube',
        originalUrl: trimmedUrl,
        isEmbeddable: true,
      };
    }

    if (videoId) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&enablejsapi=1&rel=0`,
        platformName: 'YouTube',
        originalUrl: trimmedUrl,
        isEmbeddable: true,
      };
    }
  }

  // 2. INSTAGRAM REELS & POSTS
  if (trimmedUrl.includes('instagram.com') || trimmedUrl.includes('instagr.am')) {
    let postId = '';
    if (trimmedUrl.includes('/reel/')) {
      const parts = trimmedUrl.split('/reel/');
      postId = parts[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (trimmedUrl.includes('/p/')) {
      const parts = trimmedUrl.split('/p/');
      postId = parts[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (trimmedUrl.includes('/reels/')) {
      const parts = trimmedUrl.split('/reels/');
      postId = parts[1]?.split('?')[0]?.split('/')[0] || '';
    }

    if (postId) {
      return {
        type: 'instagram',
        embedUrl: `https://www.instagram.com/reel/${postId}/embed/captioned/`,
        platformName: 'Instagram Reel',
        originalUrl: trimmedUrl,
        isEmbeddable: true,
      };
    }

    if (trimmedUrl.includes('/embed')) {
      return {
        type: 'instagram',
        embedUrl: trimmedUrl,
        platformName: 'Instagram Reel',
        originalUrl: trimmedUrl,
        isEmbeddable: true,
      };
    }
  }

  // 3. TIKTOK
  if (trimmedUrl.includes('tiktok.com')) {
    let videoId = '';
    if (trimmedUrl.includes('/video/')) {
      const parts = trimmedUrl.split('/video/');
      videoId = parts[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (trimmedUrl.includes('/v/')) {
      const parts = trimmedUrl.split('/v/');
      videoId = parts[1]?.split('?')[0]?.split('/')[0] || '';
    }

    if (videoId) {
      return {
        type: 'tiktok',
        embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
        platformName: 'TikTok',
        originalUrl: trimmedUrl,
        isEmbeddable: true,
      };
    }

    if (trimmedUrl.includes('/embed/')) {
      return {
        type: 'tiktok',
        embedUrl: trimmedUrl,
        platformName: 'TikTok',
        originalUrl: trimmedUrl,
        isEmbeddable: true,
      };
    }
  }

  // 4. FACEBOOK VIDEOS & REELS
  if (trimmedUrl.includes('facebook.com') || trimmedUrl.includes('fb.watch') || trimmedUrl.includes('fb.gg')) {
    return {
      type: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmedUrl)}&show_text=false&autoplay=true`,
      platformName: 'Facebook Video',
      originalUrl: trimmedUrl,
      isEmbeddable: true,
    };
  }

  // 5. VIMEO
  if (trimmedUrl.includes('vimeo.com')) {
    const parts = trimmedUrl.split('vimeo.com/');
    const videoId = parts[parts.length - 1]?.split('?')[0]?.split('/')[0];
    if (videoId && !isNaN(Number(videoId))) {
      return {
        type: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=0&loop=1`,
        platformName: 'Vimeo',
        originalUrl: trimmedUrl,
        isEmbeddable: true,
      };
    }
  }

  // 6. DIRECT MP4 / WEBM / MOV
  if (
    trimmedUrl.endsWith('.mp4') || 
    trimmedUrl.endsWith('.webm') || 
    trimmedUrl.endsWith('.mov') ||
    trimmedUrl.includes('.mp4?') ||
    trimmedUrl.includes('.webm?') ||
    trimmedUrl.includes('image2url.com') ||
    trimmedUrl.includes('cloudinary.com')
  ) {
    return {
      type: 'mp4',
      embedUrl: trimmedUrl,
      platformName: 'Direct MP4 Video',
      originalUrl: trimmedUrl,
      isEmbeddable: true,
    };
  }

  // 7. GENERIC EMBED OR IFRAME
  if (trimmedUrl.includes('/embed') || trimmedUrl.includes('player.')) {
    return {
      type: 'iframe_generic',
      embedUrl: trimmedUrl,
      platformName: 'Embedded Video',
      originalUrl: trimmedUrl,
      isEmbeddable: true,
    };
  }

  // Fallback for general web video URLs
  return {
    type: 'iframe_generic',
    embedUrl: trimmedUrl,
    platformName: 'External Platform',
    originalUrl: trimmedUrl,
    isEmbeddable: true,
    noticeMessage: 'If this platform restricts inline playback, you can launch the original video directly.',
    noticeMessageAr: 'إذا كانت هذه المنصة تمنع العرض المباشر المضمن، يمكنك فتح الفيديو عبر الرابط المباشر.',
  };
}

