import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

export const Contact: React.FC = () => {
  const { settings } = useSettings();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      error('Name, phone, and message are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitContact(formData);
      if (res.success) {
        success('Thank you! Your inquiry has been delivered.');
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (err: any) {
      error(err.message || 'Failed to submit contact message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#1261A0] uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full">
          Get In Touch
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 font-['Outfit']">
          Contact Hanif Centre Electronics
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          Visit our Lahore showrooms or reach out for price confirmations, product inquiries, and bulk deals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-gray-900 font-['Outfit'] border-b border-gray-100 pb-3">
              Showroom Information
            </h3>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#1261A0] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Main Showroom:</span>
                <p className="text-xs sm:text-sm text-gray-800 font-medium leading-snug mt-0.5">
                  {settings.address}
                </p>
                {settings.branch2 && (
                  <p className="text-xs text-gray-500 mt-2">
                    <strong className="text-gray-700">DHA Branch:</strong> {settings.branch2}
                  </p>
                )}
              </div>
            </div>

            {/* Phones */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Phone Lines:</span>
                <a href={`tel:${settings.phone1.replace(/[^0-9]/g, '')}`} className="block text-sm font-bold text-gray-900 hover:text-[#1261A0]">
                  {settings.phone1}
                </a>
                <a href={`tel:${settings.phone2.replace(/[^0-9]/g, '')}`} className="block text-xs font-medium text-gray-700 hover:text-[#1261A0]">
                  {settings.phone2}
                </a>
                <a href={`tel:${settings.phone3.replace(/[^0-9]/g, '')}`} className="block text-xs font-medium text-gray-700 hover:text-[#1261A0]">
                  {settings.phone3}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email:</span>
                <a href={`mailto:${settings.email}`} className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#1261A0]">
                  {settings.email}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Business Timings:</span>
                <p className="text-xs text-gray-800 font-medium mt-0.5">{settings.openingHours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-gray-900 font-['Outfit'] border-b border-gray-100 pb-3">
              Send an Online Message
            </h3>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-950 font-['Outfit']">Message Sent Successfully</h4>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                  Thank you for reaching out. A Hanif Centre representative will respond to your query promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-[#1261A0] underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Farhan Ali"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0300-1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="farhan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Product Availability Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Message / Inquiry Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us what you are looking for..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-[#1261A0] hover:bg-[#0D2B45] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
