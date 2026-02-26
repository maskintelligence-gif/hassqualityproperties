import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Plus, X, Loader2 } from 'lucide-react';

export interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  category: string;
  type: string;
  status: string;
  imageUrl: string;
  additionalImages: string[];
  beds: string;
  baths: string;
  area: string;
  // Vehicle fields
  make: string;
  model: string;
  year: string;
  mileage: string;
  transmission: string;
  fuelType: string;
}

export const EMPTY_FORM: PropertyFormData = {
  title: '', description: '', price: '', location: '',
  category: 'Real Estate', type: 'House', status: 'For Sale',
  imageUrl: '', additionalImages: [],
  beds: '', baths: '', area: '',
  make: '', model: '', year: '', mileage: '', transmission: 'Automatic', fuelType: 'Petrol',
};

const CATEGORY_TYPES: Record<string, string[]> = {
  'Real Estate': ['House', 'Apartment', 'Land', 'Commercial'],
  'Rentals': ['House', 'Apartment', 'Land', 'Commercial'],
  'Vehicles': ['Car', 'Truck', 'Van'],
  'Motorcycles': ['Motorcycle', 'Scooter', 'Dirt Bike'],
};

interface Props {
  title: string;
  subtitle: string;
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  loading: boolean;
  submitLabel: string;
}

export default function PropertyForm({ title, subtitle, initialData, onSubmit, loading, submitLabel }: Props) {
  const [formData, setFormData] = useState<PropertyFormData>({ ...EMPTY_FORM, ...initialData });
  const [newImageUrl, setNewImageUrl] = useState('');

  const isVehicle = formData.category === 'Vehicles' || formData.category === 'Motorcycles';
  const isRealEstate = formData.category === 'Real Estate' || formData.category === 'Rentals';
  const showRoomDetails = isRealEstate && formData.type !== 'Land' && formData.type !== 'Commercial';

  const set = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      // Reset type when category changes
      if (field === 'category') {
        const types = CATEGORY_TYPES[value] || [];
        next.type = types[0] || '';
      }
      return next;
    });
  };

  const addImage = () => {
    const url = newImageUrl.trim();
    if (url && !formData.additionalImages.includes(url)) {
      setFormData(prev => ({ ...prev, additionalImages: [...prev.additionalImages, url] }));
      setNewImageUrl('');
    }
  };

  const removeImage = (i: number) => {
    setFormData(prev => ({ ...prev, additionalImages: prev.additionalImages.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
  const sectionClass = "bg-white p-6 rounded-xl shadow-sm border border-gray-100";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/admin/properties" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-900 mb-5">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Property Title *</label>
              <input type="text" required value={formData.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. Luxury 4 Bedroom Villa in Boma" className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description *</label>
              <textarea required rows={4} value={formData.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe the property in detail..." className={inputClass + ' resize-none'} />
            </div>
            <div>
              <label className={labelClass}>Price *</label>
              <input type="text" required value={formData.price} onChange={e => set('price', e.target.value)}
                placeholder="e.g. UGX 450,000,000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Location *</label>
              <input type="text" required value={formData.location} onChange={e => set('location', e.target.value)}
                placeholder="e.g. Boma, Fort Portal" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-900 mb-5">Classification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Category</label>
              <select value={formData.category} onChange={e => set('category', e.target.value)} className={inputClass}>
                {Object.keys(CATEGORY_TYPES).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select value={formData.type} onChange={e => set('type', e.target.value)} className={inputClass}>
                {(CATEGORY_TYPES[formData.category] || []).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={formData.status} onChange={e => set('status', e.target.value)} className={inputClass}>
                <option>For Sale</option>
                <option>For Rent</option>
                <option>Sold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Real Estate Details */}
        {isRealEstate && (
          <div className={sectionClass}>
            <h2 className="text-base font-semibold text-gray-900 mb-5">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {showRoomDetails && (
                <>
                  <div>
                    <label className={labelClass}>Bedrooms</label>
                    <input type="number" min="0" value={formData.beds} onChange={e => set('beds', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Bathrooms</label>
                    <input type="number" min="0" value={formData.baths} onChange={e => set('baths', e.target.value)} className={inputClass} />
                  </div>
                </>
              )}
              <div>
                <label className={labelClass}>Area (sq ft / acres / decimals)</label>
                <input type="text" value={formData.area} onChange={e => set('area', e.target.value)}
                  placeholder="e.g. 2,500 sq ft" className={inputClass} />
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Details */}
        {isVehicle && (
          <div className={sectionClass}>
            <h2 className="text-base font-semibold text-gray-900 mb-5">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Make</label>
                <input type="text" value={formData.make} onChange={e => set('make', e.target.value)}
                  placeholder="e.g. Toyota" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Model</label>
                <input type="text" value={formData.model} onChange={e => set('model', e.target.value)}
                  placeholder="e.g. Land Cruiser Prado" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <input type="number" value={formData.year} onChange={e => set('year', e.target.value)}
                  placeholder="e.g. 2020" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Mileage</label>
                <input type="text" value={formData.mileage} onChange={e => set('mileage', e.target.value)}
                  placeholder="e.g. 85,000 km" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Transmission</label>
                <select value={formData.transmission} onChange={e => set('transmission', e.target.value)} className={inputClass}>
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Fuel Type</label>
                <select value={formData.fuelType} onChange={e => set('fuelType', e.target.value)} className={inputClass}>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Media */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-900 mb-5">Images</h2>
          
          {/* Main image */}
          <div className="mb-5">
            <label className={labelClass}>Main Image URL *</label>
            <div className="flex gap-3">
              <input type="url" required value={formData.imageUrl} onChange={e => set('imageUrl', e.target.value)}
                placeholder="https://images.unsplash.com/..." className={inputClass + ' flex-1'} />
              <div className="flex-shrink-0 h-11 w-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Additional images */}
          <div>
            <label className={labelClass}>Additional Images <span className="text-gray-400 font-normal">(optional)</span></label>
            <div className="flex gap-3 mb-3">
              <input
                type="url"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                placeholder="Paste image URL and press Add"
                className={inputClass + ' flex-1'}
              />
              <button
                type="button"
                onClick={addImage}
                disabled={!newImageUrl.trim()}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
            {formData.additionalImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {formData.additionalImages.map((url, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-8">
          <Link
            to="/admin/properties"
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-75 disabled:cursor-not-allowed text-sm"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
