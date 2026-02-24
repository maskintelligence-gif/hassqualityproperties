import React, { useState, useEffect } from 'react';
import { Maximize, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { properties } from '../data/properties';
import { Link } from 'react-router-dom';

export default function PropertyGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Filter properties that have images to showcase
  const galleryItems = properties.filter(p => p.imageUrl);

  useEffect(() => {
    if (isLightboxOpen) return; // Pause auto-slide when lightbox is open

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [isLightboxOpen, galleryItems.length]);

  if (galleryItems.length === 0) return null;

  const currentItem = galleryItems[currentIndex];

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <section className="py-20 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Property Gallery</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Take a visual tour of some of our most stunning properties currently on the market.
          </p>
        </div>

        <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden group">
          {/* Main Slideshow Image */}
          <div 
            className="absolute inset-0 cursor-pointer transition-transform duration-700 ease-in-out"
            onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={currentItem.imageUrl}
              alt={currentItem.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium flex items-center gap-2">
                <Maximize className="h-5 w-5" /> View Fullscreen
              </span>
            </div>
          </div>

          {/* Property Info Overlay (Hook) */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 pointer-events-none">
            <div className="pointer-events-auto max-w-3xl">
              <span className="inline-block px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-semibold mb-4 uppercase tracking-wide shadow-lg">
                {currentItem.status}
              </span>
              <h3 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                {currentItem.title}
              </h3>
              <p className="text-2xl text-emerald-400 font-bold mb-6 drop-shadow-md">
                {currentItem.price}
              </p>
              <Link
                to={`/properties/${currentItem.id}`}
                className="inline-block px-8 py-3 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                View Details
              </Link>
            </div>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Progress Indicators */}
          <div className="absolute bottom-8 right-8 flex gap-2">
            {galleryItems.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-emerald-500 scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
          >
            <X className="h-8 w-8" />
          </button>

          <div className="absolute top-6 left-6 text-white/70 font-medium z-50">
            {currentIndex + 1} / {galleryItems.length}
          </div>

          <button 
            onClick={handlePrev}
            className="absolute left-6 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-6 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-12" onClick={() => setIsLightboxOpen(false)}>
            <img 
              src={currentItem.imageUrl} 
              alt={`${currentItem.title} - Fullscreen`} 
              className="max-w-full max-h-[85vh] object-contain select-none"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-6 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-white mb-2">{currentItem.title}</h3>
              <p className="text-emerald-400 text-xl font-semibold">{currentItem.price}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
