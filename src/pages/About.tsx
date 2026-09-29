import React from 'react';
import { ShieldCheck, MapPin, Truck, Phone, Award } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#1261A0] uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full">
          About Hanif Centre
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 font-['Outfit']">
          Lahore's Trusted Electronics Destination
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Offering genuine consumer electronics, home appliances, and DC inverter climate systems from leading global manufacturers.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-['Outfit']">Our Showroom Story</h2>
          <p>
            Hanif Centre Electronics Online Store is an established electronics and home appliance retail hub based in Lahore, Pakistan. Centrally located at Yasin Mansion, Patiala Ground on McLeod Road near Hall Road, we have built our reputation on genuine product provenance, fair pricing, and responsive after-sales assistance.
          </p>
          <p>
            We offer a comprehensive selection of modern electronics including DC Inverter Air Conditioners, 4K LED & QLED Televisions, Refrigerators, Deep Freezers, Washing Machines, Kitchen Range Hoods, Gas and Instant Geysers, and small domestic appliances.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-['Outfit']">Genuine Brand Warranties</h2>
          <p>
            In Pakistan's electronics marketplace, peace of mind is essential. Every appliance sold through Hanif Centre includes the original brand warranty card and is eligible for nationwide official service and parts support at authorized customer centers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-['Outfit']">Physical Showroom Locations</h2>
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80 space-y-3 text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-[#1261A0] shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Main Showroom:</strong>
                <p className="text-gray-600">{settings.address}</p>
              </div>
            </div>
            {settings.branch2 && (
              <div className="flex items-start gap-2.5 pt-2 border-t border-gray-200">
                <MapPin className="w-5 h-5 text-[#1261A0] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block">DHA Branch:</strong>
                  <p className="text-gray-600">{settings.branch2}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-gray-900 font-['Outfit']">Looking for specific appliance specifications?</h4>
            <p className="text-xs text-gray-500">Our knowledgeable sales team is ready to assist you.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 bg-[#1261A0] hover:bg-[#0D2B45] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            Contact Showroom
          </Link>
        </section>
      </div>
    </div>
  );
};
