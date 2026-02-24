import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { properties } from '../data/properties';
import { MapPin, Bed, Bath, Maximize, Check, ArrowLeft, Phone, Mail, Building2, ChevronLeft, ChevronRight, X, Download, Share2, Heart, Video } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';
import PropertyCard from '../components/PropertyCard';
import { useFavorites } from '../hooks/useFavorites';

export default function PropertyDetails() {
  const { id } = useParams();
  const property = properties.find(p => p.id === id);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  
  const { isFavorite, toggleFavorite } = useFavorites();

  // Reset image index when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
    window.scrollTo(0, 0);
  }, [id]);

  const images = property?.images || [property?.imageUrl];

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDownload = async (imageUrl: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `property-${property?.id}-image-${currentImageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: property?.title,
      text: `Check out this property: ${property?.title} for ${property?.price}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Link to="/properties" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center justify-center gap-2">
            <ArrowLeft className="h-5 w-5" /> Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Image Gallery */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-semibold mb-3 uppercase tracking-wide">
                {property.status}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 text-lg">
                <MapPin className="h-5 w-5" />
                {property.location}
              </div>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="text-emerald-600">
                <p className="text-3xl font-bold">{property.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors relative"
                >
                  <Share2 className="h-5 w-5" /> Share
                  {showShareToast && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-3 rounded shadow-lg whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>
                <button 
                  onClick={(e) => toggleFavorite(property.id, e)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${
                    isFavorite(property.id) 
                      ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite(property.id) ? 'fill-red-500' : ''}`} /> 
                  {isFavorite(property.id) ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[60vh]">
            {/* Main Image */}
            <div 
              className={`relative rounded-xl overflow-hidden cursor-pointer group ${images.length > 1 ? 'md:col-span-3' : 'md:col-span-4'}`}
              onClick={() => setIsLightboxOpen(true)}
            >
              <img 
                src={images[0]} 
                alt={property.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-medium flex items-center gap-2">
                  <Maximize className="h-4 w-4" /> View Fullscreen
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="hidden md:grid grid-rows-3 gap-4 h-full">
                {images.slice(1, 4).map((img, idx) => (
                  <div 
                    key={idx} 
                    className="relative rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setCurrentImageIndex(idx + 1);
                      setIsLightboxOpen(true);
                    }}
                  >
                    <img 
                      src={img} 
                      alt={`${property.title} - Image ${idx + 2}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {idx === 2 && images.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">+{images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button 
            onClick={(e) => handleDownload(images[currentImageIndex], e)}
            className="absolute top-6 right-20 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50 flex items-center gap-2"
            title="Download Image"
          >
            <Download className="h-6 w-6" />
          </button>

          <div className="absolute top-6 left-6 text-white/70 font-medium z-50">
            {currentImageIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-6 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
              
              <button 
                onClick={handleNextImage}
                className="absolute right-6 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            </>
          )}

          <div className="w-full h-full flex items-center justify-center p-4 md:p-12" onClick={() => setIsLightboxOpen(false)}>
            <img 
              src={images[currentImageIndex]} 
              alt={`${property.title} - Fullscreen`} 
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Features */}
            <div className="bg-white rounded-xl shadow-sm p-8 flex flex-wrap gap-8 justify-between border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                  <Maximize className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Area</p>
                  <p className="font-bold text-gray-900">{property.area}</p>
                </div>
              </div>
              
              {property.bedrooms && (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                    <Bed className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-bold text-gray-900">{property.bedrooms}</p>
                  </div>
                </div>
              )}

              {property.bathrooms && (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                    <Bath className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-bold text-gray-900">{property.bathrooms}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-bold text-gray-900">{property.type}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            {/* Amenities (Mock) */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities & Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Water Supply', 'Electricity', 'Good Road Access', 'Secure Neighborhood', 'Title Deed Available', 'Near Schools'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Tour */}
            {property.videoUrl && (
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Video className="h-6 w-6 text-emerald-600" /> Video Tour
                </h2>
                <div className="relative w-full overflow-hidden pt-[56.25%] rounded-lg bg-gray-100">
                  <iframe
                    src={property.videoUrl}
                    title="Property Video Tour"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-0"
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Interested in this property?</h3>
              
              <div className="space-y-6">
                <a 
                  href="tel:+256700000000"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                >
                  <Phone className="h-5 w-5" /> Call Agent
                </a>
                
                <a 
                  href={`mailto:hassqualityproperties@gmail.com?subject=Inquiry about ${property.title}`}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-lg font-bold hover:bg-emerald-50 transition-colors"
                >
                  <Mail className="h-5 w-5" /> Email Us
                </a>
                <a 
                  href="https://wa.me/256700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
                >
                  <WhatsAppIcon className="h-5 w-5" /> WhatsApp
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center mb-4">
                  Or visit our office in Fort Portal Tourism City
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {property.category === 'Vehicles' ? 'Similar Vehicles' : 'Similar Properties'}
            </h2>
            <p className="text-gray-600">You might also be interested in these listings</p>
          </div>
          <Link 
            to="/properties" 
            state={{ category: property.category }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-lg font-bold hover:bg-emerald-100 transition-colors shadow-sm"
          >
            View All <ArrowLeft className="h-5 w-5 rotate-180" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties
            .filter(p => {
              if (p.id === property.id) return false;
              if (p.category !== property.category) return false;
              
              // For Real Estate: Match Type OR Location
              if (property.category === 'Real Estate') {
                return p.type === property.type || p.location.includes(property.location.split(',')[0]);
              }
              
              // For Vehicles: Match Type (e.g. Car vs Car)
              return p.type === property.type;
            })
            .sort((a, b) => {
              // Prioritize exact type match
              if (a.type === property.type && b.type !== property.type) return -1;
              if (a.type !== property.type && b.type === property.type) return 1;
              return 0;
            })
            .slice(0, 3)
            .map((similarProperty) => (
              <PropertyCard key={similarProperty.id} property={similarProperty} />
            ))}
        </div>
      </div>
    </div>
  );
}
