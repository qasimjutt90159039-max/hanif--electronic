import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Phone, ArrowRight, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

export const Installments: React.FC = () => {
  const { settings } = useSettings();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Lahore',
    productName: '',
    plan: '6 Months Plan',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.productName) {
      error('Please complete name, phone, and product fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitInstallmentInquiry(formData);
      if (res.success) {
        success('Inquiry submitted! Our showroom team will contact you.');
        setSubmitted(true);
        setFormData({
          name: '',
          phone: '',
          city: 'Lahore',
          productName: '',
          plan: '6 Months Plan',
          message: ''
        });
      }
    } catch (err: any) {
      error(err.message || 'Failed to submit installment inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#1261A0] uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full">
          Flexible Payment Options
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 font-['Outfit']">
          Appliance Installment Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
          Hanif Centre facilitates installment plans on major appliances including Inverter ACs, Refrigerators, and LED TVs in Lahore.
        </p>
      </div>

      {/* Transparency Notice Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-900">Important Policy Notice:</p>
          <p className="text-amber-800 leading-relaxed">
            Installment availability, tenure (3, 6, 9, or 12 months), down payment requirements, and document verification are subject to showroom confirmation and approval. Terms are agreed upon directly with the customer.
          </p>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-gray-900 font-['Outfit'] border-b border-gray-100 pb-3">
          Submit Installment Inquiry
        </h3>

        {submitted ? (
          <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-bold text-emerald-950 font-['Outfit']">Inquiry Successfully Registered</h4>
            <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
              Thank you for contacting Hanif Centre. A showroom representative will call your number to discuss the applicable installment plan, documents needed, and monthly installments.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 text-xs font-bold text-[#1261A0] underline"
            >
              Submit another inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Ullah"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mobile Number (WhatsApp Enabled) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0305-1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Product / Appliance Required *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haier 1.5 Ton Inverter AC or TCL 55 Inch QLED"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Desired Installment Duration
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0] font-semibold"
                >
                  <option value="3 Months Plan">3 Months Plan</option>
                  <option value="6 Months Plan">6 Months Plan</option>
                  <option value="9 Months Plan">9 Months Plan</option>
                  <option value="12 Months Plan">12 Months Plan</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Additional Notes (Advance amount willing to pay, etc.)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Willing to provide 30% advance deposit. Looking for delivery in Johar Town Lahore."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1261A0] hover:bg-[#0D2B45] text-white text-xs font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Installment Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
