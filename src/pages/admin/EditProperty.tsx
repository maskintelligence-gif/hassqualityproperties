import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/Toast';
import PropertyForm, { PropertyFormData } from '../../components/PropertyForm';
import { Loader2 } from 'lucide-react';

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [initialData, setInitialData] = useState<Partial<PropertyFormData> | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) {
          setInitialData({
            title: data.title || '',
            description: data.description || '',
            price: data.price || '',
            location: data.location || '',
            category: data.category || 'Real Estate',
            type: data.type || 'House',
            status: data.status || 'For Sale',
            imageUrl: data.image_url || '',
            additionalImages: Array.isArray(data.images) ? data.images : [],
            beds: data.beds != null ? String(data.beds) : '',
            baths: data.baths != null ? String(data.baths) : '',
            area: data.area || '',
            make: data.make || '',
            model: data.model || '',
            year: data.year != null ? String(data.year) : '',
            mileage: data.mileage || '',
            transmission: data.transmission || 'Automatic',
            fuelType: data.fuel_type || 'Petrol',
            videoUrl: data.video_url || '',
          });
        }
      } catch (err: any) {
        toast('error', err.message || 'Failed to load property');
        navigate('/admin/properties');
      } finally {
        setFetching(false);
      }
    }
    if (id) fetchProperty();
  }, [id, navigate, toast]);

  const handleSubmit = async (formData: PropertyFormData) => {
    setSaving(true);
    try {
      const { error } = await supabase.from('properties').update({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        location: formData.location,
        category: formData.category,
        type: formData.type,
        status: formData.status,
        image_url: formData.imageUrl,
        images: formData.additionalImages.length > 0 ? formData.additionalImages : null,
        beds: formData.beds ? parseInt(formData.beds) : null,
        baths: formData.baths ? parseInt(formData.baths) : null,
        area: formData.area || null,
        make: formData.make || null,
        model: formData.model || null,
        year: formData.year ? parseInt(formData.year) : null,
        mileage: formData.mileage || null,
        transmission: formData.transmission || null,
        fuel_type: formData.fuelType || null,
        video_url: formData.videoUrl || null,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
      toast('success', 'Property updated successfully!');
      navigate('/admin/properties');
    } catch (err: any) {
      toast('error', err.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <PropertyForm
      title="Edit Property"
      subtitle="Update the details of this listing"
      initialData={initialData}
      onSubmit={handleSubmit}
      loading={saving}
      submitLabel="Update Property"
    />
  );
}
