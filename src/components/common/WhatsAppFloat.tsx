import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const WhatsAppFloat: React.FC<{ customMessage?: string }> = ({ customMessage }) => {
  const { settings } = useSettings();

  const msg = customMessage || encodeURIComponent(
    'Hello Hanif Centre Lahore, I am browsing your online store and would like to confirm price and stock availability.'
  );

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${msg}`;
  const phoneUrl = `tel:${settings.phone1.replace(/[^0-9]/g, '')}`;

  return (
    <>
      {/* Desktop Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white pl-4 pr-5 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-emerald-500/25 border-2 border-white"
          title="Chat with Hanif Centre on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-white text-transparent" />
          <span className="text-xs font-bold font-sans tracking-wide">
            Chat on WhatsApp
          </span>
        </a>
      </div>

      {/* Mobile Bottom Sticky Bar (WhatsApp & Direct Call) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2 flex items-center gap-2.5 shadow-2xl">
        <a
          href={phoneUrl}
          className="flex-1 py-2.5 px-3 bg-[#071A2B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
        >
          <Phone className="w-4 h-4 text-emerald-400" />
          <span>Call Showroom</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-3 bg-[#25D366] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
        >
          <MessageCircle className="w-4 h-4 fill-white text-transparent" />
          <span>WhatsApp</span>
        </a>
      </div>
    </>
  );
};
