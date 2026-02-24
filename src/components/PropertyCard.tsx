import { MapPin, Bed, Bath, Maximize, ArrowRight, Heart, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../data/properties';
import { FC } from 'react';
import { useFavorites } from '../hooks/useFavorites';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: FC<PropertyCardProps> = ({ property }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(property.id);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative h-64 overflow-hidden group">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
          {property.status}
        </div>
        <button 
          onClick={(e) => toggleFavorite(property.id, e)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors backdrop-blur-sm z-10"
        >
          <Heart className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
        {property.videoUrl && (
          <div className="absolute top-4 right-14 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm z-10" title="Video Tour Available">
            <Video className="h-5 w-5" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white font-bold text-lg">{property.price}</p>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>{property.type}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
          <div className="flex gap-4">
            {property.bedrooms && (
              <div className="flex items-center gap-1 text-gray-600 text-sm" title="Bedrooms">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1 text-gray-600 text-sm" title="Bathrooms">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-600 text-sm" title="Area">
              <Maximize className="h-4 w-4" />
              <span>{property.area}</span>
            </div>
          </div>
          
          <Link 
            to={`/properties/${property.id}`}
            className="p-2 rounded-full bg-gray-50 text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
