import { Building2, Mail, MapPin, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-emerald-500" />
              <span className="font-bold text-xl tracking-tight">HASS QUALITY PROPERTIES</span>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Your trusted partner in finding the perfect property in Fort Portal Tourism City and across Uganda. 
              We specialize in residential, commercial, and land sales.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-500">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-white transition-colors text-sm">Properties</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-500">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Fort Portal Tourism City, Uganda</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <a href="mailto:hassqualityproperties@gmail.com" className="text-gray-400 hover:text-white transition-colors text-sm break-all">
                  hassqualityproperties@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+256 700 000 000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Hass Quality Properties. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
