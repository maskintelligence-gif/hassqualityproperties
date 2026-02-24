import { Building2, Users, Target, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="bg-emerald-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Your trusted real estate partner in Fort Portal Tourism City, committed to quality, integrity, and excellence.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Hass Quality Properties is a premier real estate company based in Fort Portal Tourism City, Uganda. We specialize in connecting buyers with their dream properties and helping sellers get the best value for their investments.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              With years of experience in the local market, our team understands the unique landscape of Fort Portal and the surrounding regions. Whether you are looking for a residential home, commercial land, or an agricultural investment, we have the expertise to guide you every step of the way.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-600 rounded-2xl transform rotate-3 opacity-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Office Meeting" 
              className="relative rounded-2xl shadow-xl w-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To provide professional, transparent, and efficient real estate services that exceed our clients' expectations and contribute to the development of Fort Portal.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Team</h3>
            <p className="text-gray-600">
              A dedicated team of real estate professionals with deep local knowledge and a passion for helping people find their perfect property match.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Promise</h3>
            <p className="text-gray-600">
              We promise integrity in all our dealings, verified property titles, and a hassle-free process from viewing to ownership transfer.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-emerald-900 rounded-3xl p-12 text-white text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">11+</div>
              <div className="text-emerald-200 text-sm uppercase tracking-wider">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-emerald-200 text-sm uppercase tracking-wider">Properties Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-emerald-200 text-sm uppercase tracking-wider">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-emerald-200 text-sm uppercase tracking-wider">Listings Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
