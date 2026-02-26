import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/Toast';
import PropertyForm, { PropertyFormData, EMPTY_FORM } from '../../components/PropertyForm';

export default function AddProperty() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: PropertyFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('properties').insert([{
        title: formData.title,
        description: formData.description,
        price: formData.price,
        location: formData.location,
        category: formData.category,
        type: formData.type,
        status: formData.status,
        image_url: formData.imageUrl,
        images: formData.additionalImages.length > 0 ? formData.additionalImages : null,
        video_url: formData.videoUrl || null,
        beds: formData.beds ? parseInt(formData.beds) : null,
        baths: formData.baths ? parseInt(formData.baths) : null,
        area: formData.area || null,
        make: formData.make || null,
        model: formData.model || null,
        year: formData.year ? parseInt(formData.year) : null,
        mileage: formData.mileage || null,
        transmission: formData.transmission || null,
        fuel_type: formData.fuelType || null,
      }]);
      if (error) throw error;
      toast('success', 'Property added successfully!');
      navigate('/admin/properties');
    } catch (error: any) {
      toast('error', error.message || 'Error adding property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PropertyForm
      title="Add New Property"
      subtitle="Create a new listing for your website"
      initialData={EMPTY_FORM}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Save Property"
    />
  );
}
