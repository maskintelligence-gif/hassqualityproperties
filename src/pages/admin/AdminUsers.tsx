import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/Toast';
import { Mail, Phone, MessageSquare, Clock, CheckCircle2, Circle, Loader2, Users, Trash2, X } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  property_title?: string;
  created_at: string;
  read: boolean;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminUsers() {
  const toast = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableExists, setTableExists] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message?.includes('does not exist') || error.code === '42P01') {
          setTableExists(false);
        } else {
          throw error;
        }
      } else {
        setInquiries(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const markRead = async (id: string) => {
    try {
      await supabase.from('inquiries').update({ read: true }).eq('id', id);
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, read: true } : i));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, read: true } : null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(id);
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) throw error;
      setInquiries(prev => prev.filter(i => i.id !== id));
      if (selected?.id === id) setSelected(null);
      toast('success', 'Inquiry deleted');
    } catch (err: any) {
      toast('error', err.message || 'Failed to delete inquiry');
    } finally {
      setDeleting(null);
    }
  };

  const unreadCount = inquiries.filter(i => !i.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!tableExists) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-500 mt-1 text-sm">View and manage contact form submissions</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600 flex-shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">Set up the Inquiries table</h3>
              <p className="text-amber-700 text-sm mt-1">
                To track contact form submissions, create an <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono">inquiries</code> table in your Supabase project with these columns:
              </p>
              <pre className="mt-3 text-xs bg-white border border-amber-200 rounded-lg p-4 text-gray-700 overflow-x-auto">
{`id          uuid  (primary key, default gen_random_uuid())
name        text  not null
email       text  not null
phone       text
message     text  not null
property_title text
read        bool  default false
created_at  timestamptz  default now()`}
              </pre>
              <p className="text-amber-700 text-sm mt-3">
                Then update your contact form to insert into this table instead of (or in addition to) sending emails.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-500 mt-1 text-sm">Contact form submissions from your website visitors</p>
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            {unreadCount} unread
          </span>
        )}
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="font-medium text-gray-600">No inquiries yet</p>
          <p className="text-gray-400 text-sm mt-1">When visitors fill out your contact form, their messages will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {inquiries.map(inq => (
              <div
                key={inq.id}
                onClick={() => { setSelected(inq); if (!inq.read) markRead(inq.id); }}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                  selected?.id === inq.id ? 'border-emerald-500 shadow-md' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {!inq.read
                      ? <Circle className="h-2.5 w-2.5 text-emerald-500 flex-shrink-0 fill-emerald-500" />
                      : <Circle className="h-2.5 w-2.5 text-gray-300 flex-shrink-0" />}
                    <p className={`text-sm truncate ${!inq.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {inq.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-xs text-gray-400">{timeAgo(inq.created_at)}</span>
                    <button
                      onClick={e => handleDelete(inq.id, e)}
                      disabled={deleting === inq.id}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
                    >
                      {deleting === inq.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4 truncate">{inq.email}</p>
                {inq.property_title && (
                  <p className="text-xs text-emerald-600 mt-1 ml-4 truncate">Re: {inq.property_title}</p>
                )}
                <p className="text-xs text-gray-500 mt-1.5 ml-4 line-clamp-2">{inq.message}</p>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!selected.read
                      ? <Circle className="h-2.5 w-2.5 text-emerald-500 fill-emerald-500" />
                      : <CheckCircle2 className="h-4 w-4 text-gray-400" />}
                    <h3 className="font-semibold text-gray-900">{selected.name}</h3>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${selected.email}`} className="hover:text-emerald-600 transition-colors">{selected.email}</a>
                    </div>
                    {selected.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${selected.phone}`} className="hover:text-emerald-600 transition-colors">{selected.phone}</a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {new Date(selected.created_at).toLocaleString()}
                    </div>
                    {selected.property_title && (
                      <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                        Re: {selected.property_title}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Message</p>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.property_title || 'Your Inquiry'}`}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <Mail className="h-4 w-4" /> Reply via Email
                    </a>
                    {selected.phone && (
                      <a
                        href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=Hi ${selected.name}, thank you for your inquiry about ${selected.property_title || 'our properties'}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        <Phone className="h-4 w-4" /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 h-64 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Select an inquiry to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
