'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface StoreSettings {
  phoneNumber: string;
  address: string;
  email: string;
  businessHours: string;
}

const defaultSettings: StoreSettings = {
  phoneNumber: '+84901234567',
  address: '192 Nguyễn Văn Hưởng, Thảo Điền, Thủ Đức, Hồ Chí Minh 700000, Việt Nam',
  email: 'info@spectrum-eyecare.com',
  businessHours: '8:00 - 20:00 (Thứ 2 - Chủ nhật)'
};

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const settingsRef = doc(db, 'settings', 'store');
        const settingsSnap = await getDoc(settingsRef);
        
        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          setSettings({
            phoneNumber: data.phoneNumber || defaultSettings.phoneNumber,
            address: data.address || defaultSettings.address,
            email: data.email || defaultSettings.email,
            businessHours: data.businessHours || defaultSettings.businessHours
          });
        } else {
          // Use default settings if no settings document exists
          setSettings(defaultSettings);
        }
      } catch (err) {
        console.error('Error loading store settings:', err);
        setError('Failed to load store settings');
        // Use default settings on error
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    phoneNumber: settings.phoneNumber,
    address: settings.address,
    email: settings.email,
    businessHours: settings.businessHours
  };
}
