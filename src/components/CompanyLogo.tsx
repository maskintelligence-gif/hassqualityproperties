import React, { useState } from 'react';
import LogoLightbox from './LogoLightbox';

interface CompanyLogoProps {
  className?: string;
}

export default function CompanyLogo({ className = "" }: CompanyLogoProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const logoUrl = "https://i.ibb.co/DD9B22hs/portrait-remove-bg-1771269872098.png";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPreviewOpen(true);
  };

  return (
    <>
      <img 
        src={logoUrl} 
        alt="Hass Quality Properties Logo" 
        className={`cursor-pointer transition-transform hover:scale-105 ${className}`}
        onClick={handleClick}
        title="Click to preview logo"
      />
      <LogoLightbox 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        logoUrl={logoUrl} 
      />
    </>
  );
}
