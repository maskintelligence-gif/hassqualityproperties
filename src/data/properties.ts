export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: 'House' | 'Land' | 'Commercial' | 'Apartment';
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  imageUrl: string;
  images?: string[];
  description: string;
  featured: boolean;
  status: 'For Sale' | 'For Rent';
}

export const properties: Property[] = [
  {
    id: '1',
    title: 'Modern Family Home in Booma',
    price: 'UGX 450,000,000',
    location: 'Booma, Fort Portal',
    type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    area: '25 Decimals',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-2250657d2fc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-2250657d2fc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1600607687931-cebf0746e50e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    ],
    description: 'A beautiful modern family home located in the upscale Booma residential area. Features spacious living areas, a modern kitchen, and a well-maintained garden.',
    featured: true,
    status: 'For Sale'
  },
  {
    id: '2',
    title: 'Prime Commercial Plot',
    price: 'UGX 150,000,000',
    location: 'Fort Portal City Center',
    type: 'Land',
    area: '50x100 ft',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Strategic commercial plot located near the city center. Ideal for a shopping mall, office complex, or hotel. Titled land with easy access to main roads.',
    featured: true,
    status: 'For Sale'
  },
  {
    id: '3',
    title: 'Luxury Apartment with Mountain View',
    price: 'UGX 1,500,000 / Month',
    location: 'Boma, Fort Portal',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: '120 sqm',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Fully furnished luxury apartment offering breathtaking views of the Rwenzori Mountains. Includes 24/7 security, parking, and backup power.',
    featured: false,
    status: 'For Rent'
  },
  {
    id: '4',
    title: 'Farm Land in Kyenjojo',
    price: 'UGX 25,000,000 per Acre',
    location: 'Kyenjojo District',
    type: 'Land',
    area: '10 Acres',
    imageUrl: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Fertile farm land suitable for tea, coffee, or cattle farming. Located 15km from Fort Portal city with good access roads.',
    featured: false,
    status: 'For Sale'
  },
  {
    id: '5',
    title: 'Colonial Style Bungalow',
    price: 'UGX 380,000,000',
    location: 'Kabarole Hill',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: '30 Decimals',
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Charming colonial-style bungalow with renovated interiors. Large compound with mature trees and a separate servant quarter.',
    featured: true,
    status: 'For Sale'
  },
  {
    id: '6',
    title: 'Lake View Resort Land',
    price: 'UGX 800,000,000',
    location: 'Crater Lakes Region',
    type: 'Land',
    area: '5 Acres',
    imageUrl: 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Exclusive land overlooking one of the crater lakes. Perfect for an eco-lodge or luxury resort development.',
    featured: true,
    status: 'For Sale'
  }
];
