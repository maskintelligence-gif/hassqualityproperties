import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Building2, Home, Car, TrendingUp, Plus, ArrowRight, Clock } from 'lucide-react';

interface Stats {
  totalProperties: number;
  forSale: number;
  forRent: number;
  vehicles: number;
}

interface RecentProperty {
  id: string;
  title: string;
  category: string;
  status: string;
  price: string;
  location: string;
  image_url: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({ totalProperties: 0, forSale: 0, forRent: 0, vehicles: 0 });
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setStats({
          totalProperties: data.length,
          forSale: data.filter((p: any) => p.status === 'For Sale').length,
          forRent: data.filter((p: any) => p.status === 'For Rent').length,
          vehicles: data.filter((p: any) => p.category === 'Vehicles' || p.category === 'Motorcycles').length,
        });
        setRecentProperties(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    { label: 'Total Listings', value: stats.totalProperties, icon: <Building2 className="h-6 w-6" />, color: 'emerald', sub: 'All active listings' },
    { label: 'For Sale', value: stats.forSale, icon: <Home className="h-6 w-6" />, color: 'blue', sub: 'Properties on market' },
    { label: 'For Rent', value: stats.forRent, icon: <TrendingUp className="h-6 w-6" />, color: 'purple', sub: 'Rental listings' },
    { label: 'Vehicles', value: stats.vehicles, icon: <Car className="h-6 w-6" />, color: 'amber', sub: 'Cars & motorcycles' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Welcome back, <span className="font-medium text-gray-700">{session?.user?.email}</span>
          </p>
        </div>
        <Link
          to="/admin/properties/add"
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm text-sm"
        >
          <Plus className="h-4 w-4" /> Add Listing
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colorMap[card.color]}`}>{card.icon}</div>
            </div>
            <p className="text-gray-500 text-sm font-medium">{card.label}</p>
            {loading ? (
              <div className="h-9 w-16 bg-gray-100 rounded animate-pulse mt-1" />
            ) : (
              <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Listings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Listings</h2>
          <Link
            to="/admin/properties"
            className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-50">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-12 w-12 rounded-lg bg-gray-100 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-48" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : recentProperties.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No listings yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first property to get started.</p>
            <Link
              to="/admin/properties/add"
              className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Plus className="h-4 w-4" /> Add first listing
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentProperties.map((property) => (
              <div key={property.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                  {property.image_url ? (
                    <img src={property.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{property.title}</p>
                  <p className="text-xs text-gray-500 truncate">{property.location}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    property.status === 'For Sale' ? 'bg-emerald-100 text-emerald-700' :
                    property.status === 'For Rent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {property.status}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:flex items-center gap-1">
                    <Clock className="h-3 w-3" />{timeAgo(property.created_at)}
                  </span>
                  <Link to={`/admin/properties/edit/${property.id}`} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
