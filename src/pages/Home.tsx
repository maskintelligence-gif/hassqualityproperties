import { ArrowRight, CheckCircle2, Search, Star } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';

import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { testimonials } from '../data/testimonials';
import PropertyCard from '../components/PropertyCard';
import PropertyGallery from '../components/PropertyGallery';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .limit(3)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setFeaturedProperties(data.map(p => ({ ...p, imageUrl: p.image_url })));
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      }
    }
    fetchFeatured();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth;
        
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Home in Uganda"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Find Your Dream Property in <br />
            <span className="text-emerald-400">Fort Portal Tourism City</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto font-light">
            We help you find the perfect home, land, or commercial space in the Pearl of Africa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Browse Properties <Search className="h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-emerald-900 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/25677186354"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-600 text-lg">Handpicked selection of our best properties</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/properties" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              View All Properties <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Property Gallery */}
      <PropertyGallery />

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-emerald-100 rounded-full -z-10" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-50 rounded-full -z-10" />
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Real Estate Agent"
                className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Hass Quality Properties?</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                We are more than just a real estate agency. We are your partners in finding the perfect place to call home or the ideal investment opportunity in Fort Portal.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: 'Local Expertise', desc: 'Deep knowledge of Fort Portal and surrounding areas.' },
                  { title: 'Trusted Service', desc: 'Transparent dealings and verified property titles.' },
                  { title: 'Wide Selection', desc: 'From budget plots to luxury homes and commercial estates.' },
                  { title: 'Client Focused', desc: 'We prioritize your needs and budget above all else.' }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                      <p className="text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-emerald-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 text-lg">Don't just take our word for it</p>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.slice(0, 10).map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="min-w-[100%] md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative mt-6"
              >
                <div className="absolute -top-6 left-8">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full border-4 border-white shadow-md object-cover bg-gray-100"
                  />
                </div>
                <div className="mt-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6 line-clamp-4">"{testimonial.quote}"</p>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-emerald-600 text-sm font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/testimonials" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-600 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md w-full sm:w-auto"
            >
              Read More Success Stories <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              to="/testimonials" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md w-full sm:w-auto"
            >
              Share Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Property?</h2>
          <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto">
            Contact us today to schedule a viewing or discuss your real estate needs with our expert team.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-white text-emerald-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
