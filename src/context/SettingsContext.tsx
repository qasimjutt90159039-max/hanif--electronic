import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings } from '../types';
import { api } from '../services/api';

const DEFAULT_SETTINGS: SiteSettings = {
  businessName: "Hanif Centre Electronics Online Store",
  logo: "",
  phone1: "0305-7245533",
  phone2: "0300-9409477",
  phone3: "0326-7245533",
  email: "haneefcentre@gmail.com",
  address: "Yasin Mansion, Patiala Ground, 2 Link McLeod Road, near Hall Road, Lahore 54000, Pakistan",
  branch2: "Near Sui Gas Interchange/Ring Road near Phase 4 DHA Lahore",
  whatsapp: "923057245533",
  openingHours: "Mon–Sat: 11:00 AM – 8:30 PM | Sunday: Closed",
  deliveryPolicy: "Delivery options available according to product weight and location across Lahore and nationwide via safe logistics.",
  returnPolicy: "7-day replacement warranty for manufacturing defects with original packaging and invoice.",
  warrantyPolicy: "100% Genuine electronics backed by official brand warranties at authorized customer service centers.",
  facebookUrl: "",
  announcementBar: "🔥 Summer Inverter AC & Refrigerator Deals | Call 0305-7245533 for Price Confirmation & Fast Lahore Delivery",
  heroTitle: "Smart Electronics. Better Living.",
  heroSubtitle: "Discover quality electronics and home appliances from trusted brands at Hanif Centre — Lahore's verified electronics landmark."
};

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (e) {
      console.warn('Could not fetch settings, using defaults');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
