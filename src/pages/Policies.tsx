import React from 'react';
import { useSettings } from '../context/SettingsContext';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "Are the products sold by Hanif Centre genuine?",
      a: "Yes. All products listed on Hanif Centre are 100% genuine and sourced directly from official brand distributors. Every eligible product is delivered with an official brand warranty card."
    },
    {
      q: "Why do prices require confirmation?",
      a: "Electronics market rates in Pakistan can fluctuate due to exchange rate changes and brand updates. We encourage customers to call or WhatsApp our showroom to confirm real-time prices before final order dispatch."
    },
    {
      q: "Do you deliver across Pakistan?",
      a: "Yes. We offer prompt delivery across Lahore and nationwide shipping through trusted logistics and courier services. Delivery charges vary based on appliance weight and destination."
    },
    {
      q: "Can I inspect the appliance upon delivery?",
      a: "Yes. Customers are encouraged to inspect package condition and seals at the time of delivery before accepting the order."
    },
    {
      q: "What payment methods are supported?",
      a: "We currently accept Cash on Delivery (COD), Direct Bank Transfer, and Showroom Payment upon phone or WhatsApp confirmation."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 font-['Outfit']">Frequently Asked Questions</h1>
        <p className="text-xs sm:text-sm text-gray-500">Everything you need to know about ordering from Hanif Centre Lahore.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm divide-y divide-gray-100">
        {faqs.map((faq, i) => (
          <div key={i} className="py-4 space-y-2">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 font-['Outfit']">{faq.q}</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6 text-gray-700 leading-relaxed text-sm">
      <h1 className="text-2xl sm:text-4xl font-black text-gray-900 font-['Outfit']">Privacy Policy</h1>
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-4">
        <p>
          At Hanif Centre Electronics Online Store, we respect your privacy. This policy outlines how we handle customer personal information collected when visiting our website or placing an order.
        </p>
        <h3 className="font-bold text-base text-gray-900 font-['Outfit']">Information We Collect</h3>
        <p>
          We collect basic details such as your name, telephone number, delivery address, and email address solely for order processing, price confirmations, and delivery coordination.
        </p>
        <h3 className="font-bold text-base text-gray-900 font-['Outfit']">Data Usage & Protection</h3>
        <p>
          Your information is never sold or rented to third-party marketing companies. It is used strictly by our showroom dispatch and customer support personnel to fulfill your requests.
        </p>
      </div>
    </div>
  );
};

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6 text-gray-700 leading-relaxed text-sm">
      <h1 className="text-2xl sm:text-4xl font-black text-gray-900 font-['Outfit']">Terms & Conditions</h1>
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-4">
        <p>
          By accessing and placing an order on Hanif Centre Electronics Online Store, you agree to comply with our store terms and purchasing guidelines.
        </p>
        <h3 className="font-bold text-base text-gray-900 font-['Outfit']">Pricing & Quotations</h3>
        <p>
          Due to changing market conditions in the consumer electronics sector, all listed prices represent baseline demo/reference estimates. A final verbal or written confirmation from our showroom via telephone or WhatsApp is required prior to shipping.
        </p>
        <h3 className="font-bold text-base text-gray-900 font-['Outfit']">Warranty Disclaimers</h3>
        <p>
          All product warranties are provided directly by respective manufacturers (such as Haier, TCL, Dawlance, PEL, etc.). Warranty claims must follow the manufacturer's official procedures and service center networks.
        </p>
      </div>
    </div>
  );
};

export const RefundPolicy: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6 text-gray-700 leading-relaxed text-sm">
      <h1 className="text-2xl sm:text-4xl font-black text-gray-900 font-['Outfit']">Warranty & Return Policy</h1>
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-4">
        <p>{settings.returnPolicy}</p>
        <h3 className="font-bold text-base text-gray-900 font-['Outfit']">Eligible Conditions</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
          <li>Item received in damaged or non-functional condition upon immediate unboxing.</li>
          <li>Original invoice and warranty card intact.</li>
          <li>All accessories, packaging materials, and manufacturer manuals preserved.</li>
        </ul>
        <h3 className="font-bold text-base text-gray-900 font-['Outfit']">Manufacturer Warranty</h3>
        <p>{settings.warrantyPolicy}</p>
      </div>
    </div>
  );
};
