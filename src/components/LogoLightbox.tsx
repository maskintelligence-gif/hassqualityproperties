import React, { useState } from 'react';
import { X, Download, Share2 } from 'lucide-react';

interface LogoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  logoUrl: string;
}

export default function LogoLightbox({ isOpen, onClose, logoUrl }: LogoLightboxProps) {
  const [showShareToast, setShowShareToast] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(logoUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hass-quality-properties-logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image, falling back to new tab:', error);
      window.open(logoUrl, '_blank');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: 'Hass Quality Properties Logo',
      text: `Check out the Hass Quality Properties logo!`,
      url: logoUrl,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(logoUrl);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
      >
        <X className="h-8 w-8" />
      </button>
      
      <div className="absolute top-6 right-20 flex gap-4 z-50">
        <button 
          onClick={handleShare}
          className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors relative"
          title="Share Logo"
        >
          <Share2 className="h-6 w-6" />
          {showShareToast && (
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-3 rounded shadow-lg whitespace-nowrap">
              Link copied!
            </span>
          )}
        </button>
        <button 
          onClick={handleDownload}
          className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          title="Download Logo"
        >
          <Download className="h-6 w-6" />
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center p-4 md:p-12" onClick={onClose}>
        <img 
          src={logoUrl} 
          alt="Hass Quality Properties Logo Fullscreen" 
          className="max-w-full max-h-full object-contain select-none bg-white/5 rounded-2xl p-8"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
