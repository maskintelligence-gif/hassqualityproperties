import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/Toast';
import { Save, Loader2, Globe, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

interface Settings {
  company_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  google_maps_embed: string;
}

const DEFAULT: Settings = {
  company_name: 'Hass Quality Properties',
  tagline: 'Find Your Dream Property in Fort Portal Tourism City',
  phone: '+256 700 000 000',
  whatsapp: '+256700000000',
  email: 'info@hassqualityproperties.com',
  address: 'Fort Portal Tourism City, Uganda',
  facebook_url: '',
  instagram_url: '',
  tiktok_url: '',
  google_maps_embed: '',
};

export default function AdminSettings() {
  const toast = useToast();
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase.from('settings').select('*').single();
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        if (data) setSettings({ ...DEFAULT, ...data });
      } catch (err) {
        console.error('Settings table may not exist yet:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const set = (key: keyof Settings, val: string) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('settings').upsert(settings);
      if (error) throw error;
      toast('success', 'Settings saved successfully!');
    } catch (err: any) {
      // If table doesn't exist, show a helpful note
      if (err.message?.includes('does not exist')) {
        toast('warning', 'Settings table not set up in Supabase yet. Create a "settings" table to enable this feature.');
      } else {
        toast('error', err.message || 'Failed to save settings');
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
  const sectionClass = "bg-white p-6 rounded-xl shadow-sm border border-gray-100";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your company info and contact details</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Info */}
        <div className={sectionClass}>
          <div className="flex items-center gap-2 mb-5">
            <Globe className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-900">Company Information</h2>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className={labelClass}>Company Name</label>
              <input type="text" value={settings.company_name} onChange={e => set('company_name', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tagline / Hero Text</label>
              <input type="text" value={settings.tagline} onChange={e => set('tagline', e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className={sectionClass}>
          <div className="flex items-center gap-2 mb-5">
            <Phone className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-900">Contact Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}><span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Phone Number</span></label>
              <input type="text" value={settings.phone} onChange={e => set('phone', e.target.value)} placeholder="+256 700 000 000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}><span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-green-600" /> WhatsApp Number</span></label>
              <input type="text" value={settings.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+256700000000 (no spaces)" className={inputClass} />
              <p className="text-xs text-gray-400 mt-1">Used for the WhatsApp chat button. No spaces or dashes.</p>
            </div>
            <div>
              <label className={labelClass}><span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email Address</span></label>
              <input type="email" value={settings.email} onChange={e => set('email', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Address</span></label>
              <input type="text" value={settings.address} onChange={e => set('address', e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className={sectionClass}>
          <div className="flex items-center gap-2 mb-5">
            <Instagram className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-900">Social Media</h2>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className={labelClass}><span className="flex items-center gap-2"><Facebook className="h-4 w-4 text-blue-600" /> Facebook URL</span></label>
              <input type="url" value={settings.facebook_url} onChange={e => set('facebook_url', e.target.value)} placeholder="https://facebook.com/your-page" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}><span className="flex items-center gap-2"><Instagram className="h-4 w-4 text-pink-600" /> Instagram URL</span></label>
              <input type="url" value={settings.instagram_url} onChange={e => set('instagram_url', e.target.value)} placeholder="https://instagram.com/your-handle" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>TikTok URL</label>
              <input type="url" value={settings.tiktok_url} onChange={e => set('tiktok_url', e.target.value)} placeholder="https://tiktok.com/@your-handle" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className={sectionClass}>
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-900">Google Maps Embed</h2>
          </div>
          <div>
            <label className={labelClass}>Embed URL <span className="text-gray-400 font-normal">(from Google Maps → Share → Embed a map → copy src URL)</span></label>
            <input type="url" value={settings.google_maps_embed} onChange={e => set('google_maps_embed', e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..." className={inputClass} />
            {settings.google_maps_embed && (
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 h-40">
                <iframe src={settings.google_maps_embed} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Map preview" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pb-8">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-75 disabled:cursor-not-allowed text-sm"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
