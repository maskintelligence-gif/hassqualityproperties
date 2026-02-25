import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Building2, Users, Eye, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: '45.2K', // Mock for now
    activeInquiries: 32, // Mock for now
    pendingApprovals: 5, // Mock for now
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    async function fetchStats() {
      try {
        const { count, error } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        setStats(prev => ({ ...prev, totalProperties: count || 0 }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {session?.user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +12%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Properties</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProperties}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <Eye className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +24%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Views</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalViews}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +8%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Active Inquiries</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeInquiries}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full flex items-center gap-1">
              0%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Pending Approvals</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingApprovals}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        
        <div className="space-y-6">
          {[
            { action: 'New Inquiry', item: 'Luxury Villa in Boma', time: '2 hours ago', type: 'inquiry' },
            { action: 'Property Added', item: 'Commercial Space Downtown', time: '5 hours ago', type: 'property' },
            { action: 'Price Updated', item: '50 Acre Farm in Kyenjojo', time: '1 day ago', type: 'update' },
            { action: 'New Inquiry', item: 'Toyota Hilux 2020', time: '1 day ago', type: 'inquiry' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
              <div className={`p-2 rounded-full ${
                activity.type === 'inquiry' ? 'bg-purple-100 text-purple-600' :
                activity.type === 'property' ? 'bg-emerald-100 text-emerald-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {activity.type === 'inquiry' ? <Users className="h-4 w-4" /> : 
                 activity.type === 'property' ? <Building2 className="h-4 w-4" /> : 
                 <TrendingUp className="h-4 w-4" />}
              </div>
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.item}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
