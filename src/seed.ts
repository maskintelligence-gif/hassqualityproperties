import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmuuovbalclrxtblythc.supabase.co';
const supabaseAnonKey = 'sb_publishable_-eQChPPGjegVjLfXQwPGuw_mAHvdsh_';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDatabase() {
  console.log('Seeding database with example property...');

  const exampleProperty = {
    title: 'Modern 4-Bedroom Villa in Boma',
    description: 'Experience luxury living in this stunning 4-bedroom villa located in the prestigious Boma neighborhood of Fort Portal. Featuring a spacious open-plan living area, modern kitchen with granite countertops, and a master suite with a private balcony offering breathtaking views of the Rwenzori Mountains. The property sits on a 0.5-acre plot with a manicured garden and ample parking space.',
    price: 'UGX 450,000,000',
    location: 'Boma, Fort Portal',
    category: 'Real Estate',
    type: 'House',
    status: 'For Sale',
    image_url: 'https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    beds: 4,
    baths: 3,
    area: '2,500 sq ft'
  };

  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([exampleProperty])
      .select();

    if (error) {
      console.error('Error inserting property:', error.message);
    } else {
      console.log('Successfully added example property:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

seedDatabase();
