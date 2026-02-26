import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, X, Loader2, Upload, Link as LinkIcon, CheckCircle2, AlertCircle, FolderOpen, Video, Youtube, FileVideo } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MediaPickerModal from './MediaPickerModal';

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
  videoUrl: string;
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
  imageUrl: '', additionalImages: [], videoUrl: '',
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

async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// Convert any YouTube URL format to embed format
function toYouTubeEmbed(url: string): string {
  if (!url) return '';
  // Already an embed URL
  if (url.includes('youtube.com/embed/')) return url;
  // youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  return url;
}

function isYouTubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

// ── Single image uploader ────────────────────────────────────────────────────

interface ImageUploaderProps {
  label: string;
  required?: boolean;
  currentUrl: string;
  onUpload: (url: string) => void;
  onClear: () => void;
}

function ImageUploader({ label, required, currentUrl, onUpload, onClear }: ImageUploaderProps) {
  const [tab, setTab] = useState<'upload' | 'url' | 'library'>('upload');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onUpload(url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
          {(['upload', 'url', 'library'] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`px-3 py-1 flex items-center gap-1 transition-colors ${tab === t ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {t === 'upload' && <Upload className="h-3 w-3" />}
              {t === 'url' && <LinkIcon className="h-3 w-3" />}
              {t === 'library' && <FolderOpen className="h-3 w-3" />}
              {t === 'library' ? 'Library' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {currentUrl && !uploading ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
          <img src={currentUrl} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <button type="button" onClick={() => { onClear(); setUrlInput(''); }}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Image ready
          </div>
        </div>
      ) : uploading ? (
        <div className="h-48 rounded-lg border-2 border-emerald-300 bg-emerald-50 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          <p className="text-sm text-emerald-700 font-medium">Uploading...</p>
        </div>
      ) : tab === 'upload' ? (
        <div onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${dragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50'}`}>
          <div className="p-3 bg-white rounded-full shadow-sm text-emerald-600"><Upload className="h-6 w-6" /></div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Drop image here or <span className="text-emerald-600">browse</span></p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — up to 10MB</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
        </div>
      ) : tab === 'url' ? (
        <div className="space-y-2">
          <input type="url" value={urlInput} onChange={e => { setUrlInput(e.target.value); onUpload(e.target.value); }}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
          {urlInput && (
            <div className="rounded-lg overflow-hidden border border-gray-200 h-32">
              <img src={urlInput} alt="Preview" className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
        </div>
      ) : (
        <div onClick={() => setShowPicker(true)}
          className="h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors">
          <div className="p-3 bg-white rounded-full shadow-sm text-emerald-600"><FolderOpen className="h-6 w-6" /></div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Pick from Media Library</p>
            <p className="text-xs text-gray-400 mt-1">Choose from previously uploaded images</p>
          </div>
        </div>
      )}

      {showPicker && (
        <MediaPickerModal onSelect={url => { onUpload(url); setShowPicker(false); }} onClose={() => setShowPicker(false)} />
      )}
    </div>
  );
}

// ── Multi image uploader ─────────────────────────────────────────────────────

interface MultiImageUploaderProps {
  images: string[];
  onAdd: (url: string) => void;
  onAddMultiple: (urls: string[]) => void;
  onRemove: (i: number) => void;
}

function MultiImageUploader({ images, onAdd, onAddMultiple, onRemove }: MultiImageUploaderProps) {
  const [tab, setTab] = useState<'upload' | 'url' | 'library'>('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [dragging, setDragging] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadFile));
      urls.forEach(url => onAdd(url));
    } catch (err: any) {
      setUploadError('Upload failed. Check your storage bucket settings.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [onAdd]);

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
          {(['upload', 'url', 'library'] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`px-3 py-1 flex items-center gap-1 transition-colors ${tab === t ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {t === 'upload' && <Upload className="h-3 w-3" />}
              {t === 'url' && <LinkIcon className="h-3 w-3" />}
              {t === 'library' && <FolderOpen className="h-3 w-3" />}
              {t === 'library' ? 'Library' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {tab === 'upload' ? (
        <div onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 py-6 cursor-pointer transition-colors ${dragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50'} ${uploading ? 'cursor-not-allowed opacity-75' : ''}`}>
          {uploading
            ? <><Loader2 className="h-6 w-6 text-emerald-600 animate-spin" /><p className="text-sm text-emerald-700 font-medium">Uploading...</p></>
            : <><Upload className="h-6 w-6 text-emerald-500" /><p className="text-sm text-gray-600">Drop images here or <span className="text-emerald-600 font-medium">browse</span></p><p className="text-xs text-gray-400">Select multiple files at once</p></>
          }
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
        </div>
      ) : tab === 'url' ? (
        <div className="flex gap-2">
          <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
            placeholder="Paste image URL and press Add"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
          <button type="button" onClick={addUrl} disabled={!urlInput.trim()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            Add
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setShowPicker(true)}
          className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50 flex items-center justify-center gap-3 py-5 cursor-pointer transition-colors">
          <FolderOpen className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-medium text-gray-700">Pick from Media Library</span>
        </button>
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

      {showPicker && (
        <MediaPickerModal
          multiSelect
          onSelect={() => {}}
          onMultiSelect={urls => { onAddMultiple(urls); setShowPicker(false); }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

// ── Video uploader ───────────────────────────────────────────────────────────

interface VideoUploaderProps {
  currentUrl: string;
  onChange: (url: string) => void;
  onClear: () => void;
}

function VideoUploader({ currentUrl, onChange, onClear }: VideoUploaderProps) {
  const [tab, setTab] = useState<'youtube' | 'upload'>('youtube');
  const [rawInput, setRawInput] = useState(currentUrl || '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const embedUrl = currentUrl ? toYouTubeEmbed(currentUrl) : '';
  const isYT = currentUrl && isYouTubeUrl(currentUrl);
  const isDirectVideo = currentUrl && !isYouTubeUrl(currentUrl) && (
    currentUrl.includes('.mp4') || currentUrl.includes('.webm') || currentUrl.includes('.mov')
  );

  const handleYouTubeInput = (val: string) => {
    setRawInput(val);
    const embed = toYouTubeEmbed(val);
    onChange(embed);
  };

  const handleVideoFile = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('video/')) return;

    setUploadError(null);
    setUploading(true);
    setUploadProgress(file.name);

    try {
      const ext = file.name.split('.').pop();
      const path = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) throw error;
      const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      onChange(url);
    } catch (err: any) {
      setUploadError(err.message || 'Video upload failed');
    } finally {
      setUploading(false);
      setUploadProgress('');
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [onChange]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <Video className="h-4 w-4 text-emerald-600" /> Video Tour
          <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
          <button type="button" onClick={() => setTab('youtube')}
            className={`px-3 py-1 flex items-center gap-1 transition-colors ${tab === 'youtube' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Youtube className="h-3 w-3" /> YouTube
          </button>
          <button type="button" onClick={() => setTab('upload')}
            className={`px-3 py-1 flex items-center gap-1 transition-colors ${tab === 'upload' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <FileVideo className="h-3 w-3" /> Upload Video
          </button>
        </div>
      </div>

      {/* Preview */}
      {currentUrl && !uploading && (
        <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 bg-gray-900 relative group">
          {isYT ? (
            <div className="relative w-full pt-[56.25%]">
              <iframe src={embedUrl} title="Video Tour Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen className="absolute top-0 left-0 w-full h-full border-0" />
            </div>
          ) : isDirectVideo ? (
            <video src={currentUrl} controls className="w-full max-h-64 object-contain" />
          ) : null}
          <div className="absolute top-2 right-2 flex gap-2">
            <div className="flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              {isYT ? 'YouTube' : 'Video'} ready
            </div>
            <button type="button" onClick={() => { onClear(); setRawInput(''); }}
              className="h-7 w-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow hover:bg-red-700 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {tab === 'youtube' ? (
        <div>
          <input
            type="url"
            value={rawInput}
            onChange={e => handleYouTubeInput(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm transition-all"
          />
          <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
            <Youtube className="h-3.5 w-3.5 text-red-500" />
            Paste any YouTube link — it will be automatically converted to embed format
          </p>
        </div>
      ) : (
        <div>
          {uploading ? (
            <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-6 flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium text-emerald-700">Uploading video...</p>
                <p className="text-xs text-emerald-600 mt-1 truncate max-w-xs">{uploadProgress}</p>
              </div>
              <p className="text-xs text-gray-500">Large videos may take a moment</p>
            </div>
          ) : (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleVideoFile(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
              className={`rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 py-8 cursor-pointer transition-colors ${dragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50'}`}
            >
              <div className="p-3 bg-white rounded-full shadow-sm text-emerald-600">
                <FileVideo className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Drop video here or <span className="text-emerald-600">browse</span></p>
                <p className="text-xs text-gray-400 mt-1">MP4, WebM, MOV — up to 500MB</p>
              </div>
              <input ref={inputRef} type="file" accept="video/*" className="hidden"
                onChange={e => handleVideoFile(e.target.files)} />
            </div>
          )}

          {uploadError && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-xs">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {uploadError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Form ────────────────────────────────────────────────────────────────

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

  const isVehicle = formData.category === 'Vehicles' || formData.category === 'Motorcycles';
  const isRealEstate = formData.category === 'Real Estate' || formData.category === 'Rentals';
  const showRoomDetails = isRealEstate && formData.type !== 'Land' && formData.type !== 'Commercial';

  const set = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'category') next.type = (CATEGORY_TYPES[value] || [])[0] || '';
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) { alert('Please add a main image.'); return; }
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
                <option>For Sale</option><option>For Rent</option><option>Sold</option>
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
                  <div><label className={labelClass}>Bedrooms</label><input type="number" min="0" value={formData.beds} onChange={e => set('beds', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Bathrooms</label><input type="number" min="0" value={formData.baths} onChange={e => set('baths', e.target.value)} className={inputClass} /></div>
                </>
              )}
              <div><label className={labelClass}>Area (sq ft / acres / decimals)</label><input type="text" value={formData.area} onChange={e => set('area', e.target.value)} placeholder="e.g. 2,500 sq ft" className={inputClass} /></div>
            </div>
          </div>
        )}

        {/* Vehicle Details */}
        {isVehicle && (
          <div className={sectionClass}>
            <h2 className="text-base font-semibold text-gray-900 mb-5">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div><label className={labelClass}>Make</label><input type="text" value={formData.make} onChange={e => set('make', e.target.value)} placeholder="e.g. Toyota" className={inputClass} /></div>
              <div><label className={labelClass}>Model</label><input type="text" value={formData.model} onChange={e => set('model', e.target.value)} placeholder="e.g. Land Cruiser Prado" className={inputClass} /></div>
              <div><label className={labelClass}>Year</label><input type="number" value={formData.year} onChange={e => set('year', e.target.value)} placeholder="e.g. 2020" className={inputClass} /></div>
              <div><label className={labelClass}>Mileage</label><input type="text" value={formData.mileage} onChange={e => set('mileage', e.target.value)} placeholder="e.g. 85,000 km" className={inputClass} /></div>
              <div>
                <label className={labelClass}>Transmission</label>
                <select value={formData.transmission} onChange={e => set('transmission', e.target.value)} className={inputClass}>
                  <option>Automatic</option><option>Manual</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Fuel Type</label>
                <select value={formData.fuelType} onChange={e => set('fuelType', e.target.value)} className={inputClass}>
                  <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Media — Images & Video */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-900 mb-6">Media</h2>
          <div className="space-y-6">
            {/* Main image */}
            <ImageUploader
              label="Main Image"
              required
              currentUrl={formData.imageUrl}
              onUpload={url => set('imageUrl', url)}
              onClear={() => set('imageUrl', '')}
            />

            {/* Additional images */}
            <div className="border-t border-gray-100 pt-6">
              <MultiImageUploader
                images={formData.additionalImages}
                onAdd={url => set('additionalImages', [...formData.additionalImages, url])}
                onAddMultiple={urls => {
                  const newUrls = urls.filter(u => !formData.additionalImages.includes(u));
                  set('additionalImages', [...formData.additionalImages, ...newUrls]);
                }}
                onRemove={i => set('additionalImages', formData.additionalImages.filter((_, idx) => idx !== i))}
              />
            </div>

            {/* Video tour */}
            <div className="border-t border-gray-100 pt-6">
              <VideoUploader
                currentUrl={formData.videoUrl}
                onChange={url => set('videoUrl', url)}
                onClear={() => set('videoUrl', '')}
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
