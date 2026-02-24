import { useParams, Link } from 'react-router-dom';
import { properties } from '../data/properties';
import { MapPin, Bed, Bath, Maximize, Check, ArrowLeft, Phone, Mail, Building2, MessageSquareText } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';

export default function PropertyDetails() {
  const { id } = useParams();
  const property = properties.find(p => p.id === id);

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
      {/* Image Header */}
      <div className="h-[50vh] relative">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-semibold mb-3 uppercase tracking-wide">
                  {property.status}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-200 text-lg">
                  <MapPin className="h-5 w-5" />
                  {property.location}
                </div>
              </div>
              <div className="text-white">
                <p className="text-3xl font-bold">{property.price}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
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
    </div>
  );
}
