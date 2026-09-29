import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

export const AdminSettings: React.FC = () => {
  const { settings, refreshSettings } = useSettings();
  const { success, error } = useToast();

  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateSettings(formData);
      if (res.success) {
        success('Store settings saved successfully!');
        await refreshSettings();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Store Settings</h1>
        <p className="text-xs text-gray-500">Configure verified showroom phones, address, timings, and policies</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName || ''}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Primary Phone 1</label>
            <input
              type="text"
              name="phone1"
              value={formData.phone1 || ''}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone 2</label>
            <input
              type="text"
              name="phone2"
              value={formData.phone2 || ''}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone 3</label>
            <input
              type="text"
              name="phone3"
              value={formData.phone3 || ''}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">WhatsApp Number (e.g. 923057245533)</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp || ''}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Official Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Showroom Hours</label>
            <input
              type="text"
              name="openingHours"
              value={formData.openingHours || ''}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Primary Showroom Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Branch 2 (DHA / Ring Road)</label>
            <input
              type="text"
              name="branch2"
              value={formData.branch2 || ''}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Facebook Page URL (Hide icon if empty)</label>
            <input
              type="url"
              name="facebookUrl"
              placeholder="Leave blank to hide Facebook link"
              value={formData.facebookUrl || ''}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Top Announcement Bar</label>
            <input
              type="text"
              name="announcementBar"
              value={formData.announcementBar || ''}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-[#1261A0] hover:bg-[#0D2B45] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  );
};
