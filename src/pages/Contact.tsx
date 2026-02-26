import { Mail, MapPin, Phone, Send, Facebook, Instagram, Twitter, Youtube, Linkedin, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';
import TiktokIcon from '../components/TiktokIcon';
import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('inquiries').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: `Subject: ${formData.subject}\n\n${formData.message}`,
        property_title: null,
        read: false,
      }]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError('Sorry, something went wrong. Please try again or contact us directly via WhatsApp.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm";

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about a property or want to list with us? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <div className="bg-emerald-50 rounded-2xl p-8 md:p-12 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm text-emerald-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Our Location</h3>
                    <p className="text-gray-600">Fort Portal Tourism City</p>
                    <p className="text-gray-600 mb-3">Uganda</p>
                    <a
                      href="https://maps.google.com/?q=Fort+Portal+Tourism+City+Uganda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-200 transition-colors"
                    >
                      View on Map <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm text-emerald-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Email Us</h3>
                    <p className="text-gray-600 break-all mb-3">hassqualityproperties@gmail.com</p>
                    <a
                      href="mailto:hassqualityproperties@gmail.com"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-200 transition-colors"
                    >
                      Send Email <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm text-emerald-600">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Call Us</h3>
                    <p className="text-gray-600">+256 771 86354</p>
                    <p className="text-gray-500 text-sm mt-1 mb-3">Mon - Sat: 8:00 AM - 6:00 PM</p>
                    <a
                      href="tel:+25677186354"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-200 transition-colors"
                    >
                      Call Now <Phone className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm text-emerald-600">
                    <WhatsAppIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">WhatsApp Us</h3>
                    <p className="text-gray-600 break-all mb-3">+256 771 86354</p>
                    <a
                      href="https://wa.me/25677186354"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors"
                    >
                      Message on WhatsApp <WhatsAppIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-4">
                  <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all">
                    <TiktokIcon className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all">
                    <Youtube className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">Message Sent!</h3>
                  <p className="text-emerald-700 text-sm">Thank you for contacting us. We will get back to you shortly.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-emerald-600 font-semibold hover:text-emerald-800 underline text-sm"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        type="text" id="name" name="name" required
                        value={formData.name} onChange={handleChange}
                        className={inputClass} placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <input
                        type="email" id="email" name="email" required
                        value={formData.email} onChange={handleChange}
                        className={inputClass} placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone / WhatsApp <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel" id="phone" name="phone"
                      value={formData.phone} onChange={handleChange}
                      className={inputClass} placeholder="+256 700 000 000"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                    <select
                      id="subject" name="subject" required
                      value={formData.subject} onChange={handleChange}
                      className={inputClass + ' bg-white'}
                    >
                      <option value="">Select a subject</option>
                      <option value="Inquiry about a property">Inquiry about a property</option>
                      <option value="Schedule a viewing">Schedule a viewing</option>
                      <option value="List my property">List my property</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea
                      id="message" name="message" required rows={5}
                      value={formData.message} onChange={handleChange}
                      className={inputClass + ' resize-none'}
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-lg text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</>
                      : <><Send className="h-5 w-5" /> Send Message</>
                    }
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
