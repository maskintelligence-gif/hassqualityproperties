import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Search, X, CheckCircle2, Loader2, ImageIcon, Upload } from 'lucide-react';

const BUCKET = 'property-images';

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  publicUrl: string;
}

interface Props {
  onSelect: (url: string) => void;
  onClose: () => void;
  multiSelect?: boolean;
  onMultiSelect?: (urls: string[]) => void;
}

export default function MediaPickerModal({ onSelect, onClose, multiSelect = false, onMultiSelect }: Props) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list('', {
        limit: 200,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      setFiles(
        (data || [])
          .filter(f => f.name !== '.emptyFolderPlaceholder')
          .map(f => ({
            ...f,
            publicUrl: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
          }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const toggleSelect = (url: string) => {
    if (!multiSelect) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(url) ? next.delete(url) : next.add(url);
      return next;
    });
  };

  const handleConfirmMulti = () => {
    if (onMultiSelect) onMultiSelect(Array.from(selected));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Media Library</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {multiSelect ? 'Select multiple images to add' : 'Click an image to select it'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search images..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ImageIcon className="h-10 w-10 text-gray-300 mb-3" />
              <p className="font-medium text-gray-500">
                {search ? 'No images match your search' : 'No images in library yet'}
              </p>
              {!search && (
                <p className="text-sm mt-1">Upload images in the <span className="text-emerald-600 font-medium">Media</span> section first</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map(file => {
                const isSelected = multiSelect && selected.has(file.publicUrl);
                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      if (multiSelect) {
                        toggleSelect(file.publicUrl);
                      } else {
                        onSelect(file.publicUrl);
                        onClose();
                      }
                    }}
                    className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-200'
                        : 'border-transparent hover:border-emerald-300'
                    }`}
                  >
                    <div className="aspect-square bg-gray-100">
                      <img src={file.publicUrl} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    {multiSelect && (
                      <div className={`absolute top-2 left-2 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-emerald-600 border-emerald-600' : 'bg-white/90 border-gray-400 group-hover:border-emerald-400'
                      }`}>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                    )}
                    {!multiSelect && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 rounded-full px-3 py-1 text-xs font-semibold text-emerald-700 shadow">
                          Select
                        </div>
                      </div>
                    )}
                    <div className="p-1.5">
                      <p className="text-xs text-gray-500 truncate">{file.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {multiSelect && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600">
              {selected.size > 0
                ? <span><span className="font-semibold text-emerald-700">{selected.size}</span> image{selected.size !== 1 ? 's' : ''} selected</span>
                : 'No images selected'}
            </p>
            <div className="flex gap-3">
              <button onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors">
                Cancel
              </button>
              <button
                onClick={handleConfirmMulti}
                disabled={selected.size === 0}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add {selected.size > 0 ? selected.size : ''} Image{selected.size !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
