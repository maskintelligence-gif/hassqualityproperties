import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, X, Loader2, Upload, Link as LinkIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

const BUCKET = 'property-images';

// Upload a single file to Supabase Storage, return public URL
async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

interface ImageSlot {
  url: string;         // final public URL (empty while uploading)
  preview: string;     // local object URL for preview
  status: UploadStatus;
  error?: string;
}

// Reusable image uploader component
interface ImageUploaderProps {
  label: string;
  required?: boolean;
  slot: ImageSlot | null;
  onUpload: (url: string) => void;
  onClear: () => void;
  urlTabValue: string;
  onUrlTabChange: (v: string) => void;
}

function ImageUploader({ label, required, slot, onUpload, onClear, urlTabValue, onUrlTabChange }: ImageUploaderProps) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    setUploading(true);
    try {
      const url = await uploadFile(file);
      onUpload(url);
    } catch (err: any) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const currentUrl = slot?.url || urlTabValue;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
          <button type="button" onClick={() => setTab('upload')}
            className={`px-3 py-1 flex items-center gap-1 transition-colors ${tab === 'upload' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Upload className="h-3 w-3" /> Upload
          </button>
          <button type="button" onClick={() => setTab('url')}
            className={`px-3 py-1 flex items-center gap-1 transition-colors ${tab === 'url' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <LinkIcon className="h-3 w-3" /> URL
          </button>
        </div>
      </div>

      {currentUrl && !uploading ? (
        // Preview
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
          <img src={currentUrl} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Image ready
          </div>
        </div>
      ) : uploading ? (
        // Uploading state
        <div className="h-48 rounded-lg border-2 border-emerald-300 bg-emerald-50 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          <p className="text-sm text-emerald-700 font-medium">Uploading...</p>
        </div>
      ) : tab === 'upload' ? (
        // Drop zone
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
            dragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50'
          }`}
        >
          <div className="p-3 bg-white rounded-full shadow-sm text-emerald-600">
            <Upload className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Drop image here or <span className="text-emerald-600">browse</span></p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — up to 10MB</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => handleFiles(e.target.files)} />
        </div>
      ) : (
        // URL input tab
        <div className="space-y-2">
          <input
            type="url"
            value={urlTabValue}
            onChange={e => onUrlTabChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
          />
          {urlTabValue && (
            <div className="rounded-lg overflow-hidden border border-gray-200 h-32">
              <img src={urlTabValue} alt="Preview" className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Multi-image uploader
interface MultiImageUploaderProps {
  images: string[];
  onAdd: (url: string) => void;
  onRemove: (i: number) => void;
}

function MultiImageUploader({ images, onAdd, onRemove }: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      // Upload all selected files concurrently
      const uploads = Array.from(files).map(f => uploadFile(f));
      const urls = await Promise.all(uploads);
      urls.forEach(url => onAdd(url));
    } catch (err: any) {
      setUploadError('Upload failed. Check your storage bucket settings.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [onAdd]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (url && !images.includes(url)) { onAdd(url); setUrlInput(''); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Additional Images <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
          <button type="button" onClick={() => setTab('upload')}
            className={`px-3 py-1 flex items-center gap-1 transition-colors ${tab === 'upload' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Upload className="h-3 w-3" /> Upload
          </button>
          <button type="button" onClick={() => setTab('url')}
            className={`px-3 py-1 flex items-center gap-1 transition-colors ${tab === 'url' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <LinkIcon className="h-3 w-3" /> URL
          </button>
        </div>
      </div>

      {tab === 'upload' ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 py-6 cursor-pointer transition-colors ${
            dragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50'
          } ${uploading ? 'cursor-not-allowed opacity-75' : ''}`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
              <p className="text-sm text-emerald-700 font-medium">Uploading images...</p>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-emerald-500" />
              <p className="text-sm text-gray-600">Drop images here or <span className="text-emerald-600 font-medium">browse</span></p>
              <p className="text-xs text-gray-400">Select multiple files at once</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => handleFiles(e.target.files)} />
        </div>
      ) : (
        <div className="flex gap-2">
          <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
            placeholder="Paste image URL and press Add"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
          <button type="button" onClick={addUrl} disabled={!urlInput.trim()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Add
          </button>
        </div>
      )}

      {uploadError && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-xs">
          <AlertCircle className="h-4 w-4 flex-shrink-0" /> {uploadError}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <button type="button" onClick={() => onRemove(i)}
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Form ───────────────────────────────────────────────────────────────

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
  const [mainImageUrlTab, setMainImageUrlTab] = useState(initialData?.imageUrl || '');

  const isVehicle = formData.category === 'Vehicles' || formData.category === 'Motorcycles';
  const isRealEstate = formData.category === 'Real Estate' || formData.category === 'Rentals';
  const showRoomDetails = isRealEstate && formData.type !== 'Land' && formData.type !== 'Commercial';

  const set = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'category') {
        const types = CATEGORY_TYPES[value] || [];
        next.type = types[0] || '';
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use URL tab value if no uploaded image
    const finalData = {
      ...formData,
      imageUrl: formData.imageUrl || mainImageUrlTab,
    };
    if (!finalData.imageUrl) {
      alert('Please add a main image (upload a file or paste a URL).');
      return;
    }
    onSubmit(finalData);
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
          <h2 className="text-base font-semibold text-gray-900 mb-6">Images</h2>

          <div className="space-y-6">
            {/* Main image */}
            <ImageUploader
              label="Main Image"
              required
              slot={formData.imageUrl ? { url: formData.imageUrl, preview: formData.imageUrl, status: 'done' } : null}
              onUpload={url => set('imageUrl', url)}
              onClear={() => { set('imageUrl', ''); setMainImageUrlTab(''); }}
              urlTabValue={mainImageUrlTab}
              onUrlTabChange={v => { setMainImageUrlTab(v); set('imageUrl', v); }}
            />

            <div className="border-t border-gray-100 pt-6">
              <MultiImageUploader
                images={formData.additionalImages}
                onAdd={url => set('additionalImages', [...formData.additionalImages, url])}
                onRemove={i => set('additionalImages', formData.additionalImages.filter((_, idx) => idx !== i))}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-8">
          <Link to="/admin/properties"
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm">
            Cancel
          </Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-75 disabled:cursor-not-allowed text-sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
