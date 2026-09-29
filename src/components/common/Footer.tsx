import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Truck, Headphones, RotateCcw, Facebook } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-[#071A2B] text-gray-300 pt-14 pb-8 border-t-4 border-[#1261A0]">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1261A0]/30 border border-[#19A7CE]/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#19A7CE]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Genuine Products</h4>
              <p className="text-xs text-gray-400">Authentic appliances from verified brand sources</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1261A0]/30 border border-[#19A7CE]/40 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 text-[#19A7CE]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Official Brand Warranty</h4>
              <p className="text-xs text-gray-400">Claimable at brand service centers nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1261A0]/30 border border-[#19A7CE]/40 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-[#19A7CE]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Lahore & Nationwide Delivery</h4>
              <p className="text-xs text-gray-400">Careful appliance delivery with tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1261A0]/30 border border-[#19A7CE]/40 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6 text-[#19A7CE]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Call & WhatsApp Support</h4>
              <p className="text-xs text-gray-400">Direct assistance from store representatives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-black text-white uppercase tracking-tight font-['Outfit'] block">
                HANIF <span className="text-[#19A7CE]">CENTRE</span>
              </span>
              <span className="text-xs text-gray-400 tracking-wider uppercase block font-semibold">
                Electronics & Home Appliances — Lahore
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-sm">
              Hanif Centre is Lahore's premier destination for original consumer electronics, DC inverter air conditioners, refrigerators, LED televisions, and kitchen appliances.
            </p>
            <div className="space-y-1 text-xs text-gray-400">
              <p className="font-semibold text-gray-300">Showroom Locations in Lahore:</p>
              <p>• {settings.address}</p>
              {settings.branch2 && <p>• Branch 2: {settings.branch2}</p>}
            </div>

            {/* Facebook icon shown ONLY if configured by Admin */}
            {settings.facebookUrl && (
              <div className="mt-4">
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#19A7CE] hover:text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                >
                  <Facebook className="w-4 h-4" />
                  Follow Hanif Centre on Facebook
                </a>
              </div>
            )}
          </div>

          {/* Quick Shop */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider font-['Outfit']">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/shop?category=dc-inverter-ac" className="hover:text-white transition-colors">DC Inverter AC</Link></li>
              <li><Link to="/shop?category=led-qled-tvs" className="hover:text-white transition-colors">LED & QLED TVs</Link></li>
              <li><Link to="/shop?category=refrigerators" className="hover:text-white transition-colors">Refrigerators</Link></li>
              <li><Link to="/shop?category=washing-machines" className="hover:text-white transition-colors">Washing Machines</Link></li>
              <li><Link to="/shop?category=kitchen-appliances" className="hover:text-white transition-colors">Kitchen Appliances</Link></li>
              <li><Link to="/shop?category=geysers" className="hover:text-white transition-colors">Gas & Instant Geysers</Link></li>
              <li><Link to="/shop?category=water-dispensers" className="hover:text-white transition-colors">Water Dispensers</Link></li>
              <li><Link to="/shop?category=mobiles" className="hover:text-white transition-colors">Smartphones</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider font-['Outfit']">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="/installments" className="hover:text-white transition-colors">Installment Inquiry</Link></li>
              <li><Link to="/deals" className="hover:text-white transition-colors">Hot Deals & Offers</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Showroom</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Warranty & Return Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider font-['Outfit']">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <span className="text-xs text-gray-500 block">Phone Inquiries:</span>
                <a href={`tel:${settings.phone1.replace(/[^0-9]/g, '')}`} className="text-white font-bold hover:text-[#19A7CE] block">
                  {settings.phone1}
                </a>
                <a href={`tel:${settings.phone2.replace(/[^0-9]/g, '')}`} className="text-gray-300 hover:text-[#19A7CE] block text-xs">
                  {settings.phone2}
                </a>
                <a href={`tel:${settings.phone3.replace(/[^0-9]/g, '')}`} className="text-gray-300 hover:text-[#19A7CE] block text-xs">
                  {settings.phone3}
                </a>
              </div>

              <div>
                <span className="text-xs text-gray-500 block">Email Support:</span>
                <a href={`mailto:${settings.email}`} className="text-white hover:text-[#19A7CE] block text-xs">
                  {settings.email}
                </a>
              </div>

              <div>
                <span className="text-xs text-gray-500 block">Showroom Timings:</span>
                <span className="text-xs text-gray-300 block">{settings.openingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
          <p className="text-center md:text-right text-gray-400 max-w-xl">
            Notice: Electronics market rates and stock availability fluctuate. Please confirm current prices via phone or WhatsApp before dispatch.
          </p>
        </div>
      </div>
    </footer>
  );
};
