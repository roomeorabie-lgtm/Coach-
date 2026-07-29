import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Link as LinkIcon, Check, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function compressAndProcessImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string || '');
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to parse selected image.'));
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

interface ImageUploaderProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label,
  placeholder,
  aspectRatio = 'auto',
  className = ''
}) => {
  const { language } = useApp();
  const isRtl = language === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlMode, setShowUrlMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage(isRtl ? 'يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).' : 'Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const processedDataUrl = await compressAndProcessImage(file, 1200, 1200, 0.82);
      onChange(processedDataUrl);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setErrorMessage(isRtl ? 'تعذر معالجة الصورة. يرجى المحاولة مرة أخرى.' : 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square max-w-[200px]';
      case 'video': return 'aspect-video max-w-md';
      case 'banner': return 'aspect-[3/1] w-full';
      default: return 'min-h-[120px]';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowUrlMode(!showUrlMode)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <LinkIcon className="w-3 h-3" />
            {showUrlMode 
              ? (isRtl ? 'رفع ملف صورة مباشرة' : 'Direct File Upload') 
              : (isRtl ? 'إدخال رابط URL بديل' : 'Enter URL instead')}
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Upload Box */}
      {value && !showUrlMode ? (
        <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-black group shadow-lg">
          <img
            src={value}
            alt="Preview"
            className="w-full h-auto max-h-[220px] object-cover rounded-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              {isRtl ? 'تغيير الصورة' : 'Change Image'}
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600/80 hover:bg-rose-600 transition-colors shadow-md flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              {isRtl ? 'حذف' : 'Remove'}
            </button>
          </div>
        </div>
      ) : showUrlMode ? (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "https://..."}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
          <p className="text-[10px] text-gray-400">
            {isRtl ? 'أدخل رابط صورة خارجي أو انقر أعلاه للرفع المباشر.' : 'Enter an external image URL or click above to upload directly.'}
          </p>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 ${getAspectClass()} ${
            isDragging 
              ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]' 
              : 'border-white/15 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10'
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2 text-emerald-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">
                {isRtl ? 'جاري ضغط ومعالجة الصورة...' : 'Compressing and processing image...'}
              </span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-white">
                {isRtl ? 'انقر لرفع صورة من جهازك' : 'Click to upload image from device'}
              </p>
              <p className="text-[11px] text-gray-400">
                {isRtl ? 'يدعم الصور من الهاتف، الكاميرا، أو الكمبيوتر (JPG, PNG, WebP)' : 'Supports images from Mobile, Camera, or Desktop (JPG, PNG, WebP)'}
              </p>
            </>
          )}
        </div>
      )}

      {errorMessage && (
        <p className="text-xs text-rose-400 font-medium">{errorMessage}</p>
      )}
    </div>
  );
};
