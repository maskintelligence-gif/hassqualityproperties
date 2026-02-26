import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/Toast';
import {
  Upload, Trash2, Copy, Search, X, Loader2,
  ImageIcon, CheckCircle2, AlertCircle, RefreshCw, FolderOpen
} from 'lucide-react';

const BUCKET = 'property-images';

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  metadata?: { size?: number; mimetype?: string };
  publicUrl: string;
}

function formatBytes(bytes?: number) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function AdminMedia() {
  const toast = useToast();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<MediaFile[] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<MediaFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list('', {
        limit: 200,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      const mapped = (data || [])
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => ({
          ...f,
          publicUrl: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
        }));
      setFiles(mapped);
    } catch (err: any) {
      toast('error', err.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const filesToUpload = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (filesToUpload.length === 0) return;

    setUploading(true);
    setUploadProgress(filesToUpload.map(f => f.name));
    let successCount = 0;

    await Promise.all(
      filesToUpload.map(async (file) => {
        const ext = file.name.split('.').pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (!error) successCount++;
        setUploadProgress(prev => prev.filter(n => n !== file.name));
      })
    );

    setUploading(false);
    setUploadProgress([]);
    if (inputRef.current) inputRef.current.value = '';
    toast('success', `${successCount} image${successCount !== 1 ? 's' : ''} uploaded`);
    fetchFiles();
  }, [toast, fetchFiles]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDelete = async (targets: MediaFile[]) => {
    setDeleting(true);
    try {
      const { error } = await supabase.storage.from(BUCKET).remove(targets.map(f => f.name));
      if (error) throw error;
      toast('success', `${targets.length} file${targets.length !== 1 ? 's' : ''} deleted`);
      setFiles(prev => prev.filter(f => !targets.find(t => t.name === f.name)));
      setSelected(new Set());
      setDeleteTarget(null);
    } catch (err: any) {
      toast('error', err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = (file: MediaFile) => {
    navigator.clipboard.writeText(file.publicUrl);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast('success', 'URL copied to clipboard');
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(f => f.id)));
    }
  };

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedFiles = files.filter(f => selected.has(f.id));

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {files.length} image{files.length !== 1 ? 's' : ''} stored
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchFiles}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-75"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => handleUpload(e.target.files)} />
        </div>
      </div>

      {/* Upload progress */}
      {uploadProgress.length > 0 && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium mb-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading {uploadProgress.length} file{uploadProgress.length !== 1 ? 's' : ''}...
          </div>
          <div className="space-y-1">
            {uploadProgress.map(name => (
              <p key={name} className="text-xs text-emerald-600 truncate">{name}</p>
            ))}
          </div>
        </div>
      )}

      {/* Drag & drop zone (shown when no files or as overlay hint) */}
      {!loading && files.length === 0 ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-4 py-24 cursor-pointer transition-colors ${
            dragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/30'
          }`}
        >
          <div className="p-4 bg-gray-100 rounded-full text-gray-400">
            <FolderOpen className="h-10 w-10" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">No images yet</p>
            <p className="text-gray-500 text-sm mt-1">Drop images here or click to upload</p>
            <p className="text-gray-400 text-xs mt-1">JPG, PNG, WebP — up to 10MB each</p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-colors ${
            dragging ? 'border-emerald-400 ring-2 ring-emerald-200' : 'border-gray-100'
          }`}
        >
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by filename..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {filtered.length > 0 && (
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={selectAll}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Select all
                </label>
              )}
            </div>

            {selected.size > 0 && (
              <button
                onClick={() => setDeleteTarget(selectedFiles)}
                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete {selected.size} selected
              </button>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No images match your search</p>
            </div>
          ) : (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map(file => {
                const isSelected = selected.has(file.id);
                return (
                  <div
                    key={file.id}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div
                      className="aspect-square bg-gray-100"
                      onClick={() => setLightbox(file)}
                    >
                      <img
                        src={file.publicUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors pointer-events-none" />

                    {/* Select checkbox */}
                    <div
                      className={`absolute top-2 left-2 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      onClick={e => { e.stopPropagation(); toggleSelect(file.id); }}
                    >
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-emerald-600 border-emerald-600' : 'bg-white/90 border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => { e.stopPropagation(); copyUrl(file); }}
                        title="Copy URL"
                        className="h-7 w-7 rounded-lg bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow-sm transition-colors"
                      >
                        {copiedId === file.id
                          ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteTarget([file]); }}
                        title="Delete"
                        className="h-7 w-7 rounded-lg bg-white/90 hover:bg-red-50 text-red-600 flex items-center justify-center shadow-sm transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* File info */}
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate font-medium">{file.name}</p>
                      <p className="text-xs text-gray-400">{formatBytes(file.metadata?.size)} · {timeAgo(file.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Drop overlay hint */}
          {dragging && (
            <div className="absolute inset-0 bg-emerald-600/10 border-2 border-emerald-500 rounded-xl flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-xl px-6 py-4 shadow-xl text-center">
                <Upload className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-semibold text-emerald-700">Drop to upload</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <img src={lightbox.publicUrl} alt={lightbox.name} className="w-full max-h-[60vh] object-contain bg-gray-100" />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{lightbox.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatBytes(lightbox.metadata?.size)} · Uploaded {timeAgo(lightbox.created_at)}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => copyUrl(lightbox)}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                >
                  {copiedId === lightbox.id ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedId === lightbox.id ? 'Copied!' : 'Copy URL'}
                </button>
                <button
                  onClick={() => { setDeleteTarget([lightbox]); setLightbox(null); }}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Delete {deleteTarget.length === 1 ? 'Image' : `${deleteTarget.length} Images`}
            </h3>
            <p className="text-gray-500 text-sm text-center mb-1">
              {deleteTarget.length === 1
                ? <><span className="font-medium text-gray-700">"{deleteTarget[0].name}"</span> will be permanently deleted.</>
                : `These ${deleteTarget.length} images will be permanently deleted.`
              }
            </p>
            <p className="text-amber-600 text-xs text-center mb-6 flex items-center justify-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              Any properties using these images will lose their photos.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteTarget)} disabled={deleting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-75 flex items-center justify-center gap-2">
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
