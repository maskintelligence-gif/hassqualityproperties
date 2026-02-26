import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Filter, Edit, Trash2, Building2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useToast } from '../../components/Toast';

const PAGE_SIZE = 10;

const CATEGORIES = ['All', 'Real Estate', 'Rentals', 'Vehicles', 'Motorcycles'];
const STATUSES = ['All', 'For Sale', 'For Rent', 'Sold'];

export default function AdminProperties() {
  const navigate = useNavigate();
  const toast = useToast();

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [categoryFilter, statusFilter]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('properties').select('*', { count: 'exact' });

      if (debouncedSearch) {
        query = query.or(`title.ilike.%${debouncedSearch}%,location.ilike.%${debouncedSearch}%`);
      }
      if (categoryFilter !== 'All') query = query.eq('category', categoryFilter);
      if (statusFilter !== 'All') query = query.eq('status', statusFilter);

      const from = (page - 1) * PAGE_SIZE;
      query = query.order('created_at', { ascending: false }).range(from, from + PAGE_SIZE - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      setProperties((data || []).map((p: any) => ({ ...p, imageUrl: p.image_url })));
      setTotalCount(count || 0);
    } catch (err) {
      console.error(err);
      toast('error', 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, categoryFilter, statusFilter, page, toast]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('properties').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      toast('success', `"${deleteTarget.title}" deleted successfully`);
      setDeleteTarget(null);
      fetchProperties();
    } catch (err: any) {
      toast('error', err.message || 'Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const activeFilters = (categoryFilter !== 'All' ? 1 : 0) + (statusFilter !== 'All' ? 1 : 0);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your real estate and vehicle listings</p>
        </div>
        <button
          onClick={() => navigate('/admin/properties/add')}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm text-sm"
        >
          <Plus className="h-4 w-4" /> Add Property
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors relative ${
                showFilters || activeFilters > 0
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" /> Filters
              {activeFilters > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600">Category</label>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600">Status</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {activeFilters > 0 && (
                <button
                  onClick={() => { setCategoryFilter('All'); setStatusFilter('All'); }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 animate-pulse" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-36 bg-gray-100 rounded animate-pulse" />
                          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </td>
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No properties found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {debouncedSearch || activeFilters > 0 ? 'Try adjusting your search or filters.' : 'Add your first listing to get started.'}
                    </p>
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg overflow-hidden bg-gray-100">
                          {property.imageUrl ? (
                            <img className="h-10 w-10 object-cover" src={property.imageUrl} alt="" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{property.title}</p>
                          <p className="text-xs text-gray-500">{property.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{property.category}</p>
                      <p className="text-xs text-gray-500">{property.type}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {property.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                        property.status === 'For Sale' ? 'bg-emerald-100 text-emerald-800' :
                        property.status === 'For Rent' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(`/admin/properties/edit/${property.id}`)}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: property.id, title: property.title })}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalCount > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-white">
            <p className="text-sm text-gray-600">
              Showing{' '}
              <span className="font-medium">{Math.min((page - 1) * PAGE_SIZE + 1, totalCount)}</span>–
              <span className="font-medium">{Math.min(page * PAGE_SIZE, totalCount)}</span> of{' '}
              <span className="font-medium">{totalCount}</span> results
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                      page === p ? 'bg-emerald-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Property</h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{deleteTarget.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
