'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Phone, 
  Save, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface StoreSettings {
  phoneNumber: string;
  address: string;
  email: string;
  businessHours: string;
}

export function StoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>({
    phoneNumber: '+84901234567',
    address: '192 Nguyễn Văn Hưởng, Thảo Điền, Thủ Đức, Hồ Chí Minh 700000, Việt Nam',
    email: 'info@spectrum-eyecare.com',
    businessHours: '8:00 - 20:00 (Thứ 2 - Chủ nhật)'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from Firebase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const settingsRef = doc(db, 'settings', 'store');
        const settingsSnap = await getDoc(settingsRef);
        
        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          setSettings({
            phoneNumber: data.phoneNumber || '+84901234567',
            address: data.address || '192 Nguyễn Văn Hưởng, Thảo Điền, Thủ Đức, Hồ Chí Minh 700000, Việt Nam',
            email: data.email || 'info@spectrum-eyecare.com',
            businessHours: data.businessHours || '8:00 - 20:00 (Thứ 2 - Chủ nhật)'
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Không thể tải cài đặt');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const settingsRef = doc(db, 'settings', 'store');
      await setDoc(settingsRef, settings);
      toast.success('Cài đặt đã được lưu thành công!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Không thể lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof StoreSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cài đặt cửa hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Đang tải cài đặt...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cài đặt cửa hàng
          </CardTitle>
          <p className="text-sm text-gray-600">
            Quản lý thông tin liên hệ và cài đặt cửa hàng
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              value={settings.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="+84901234567"
              className="font-mono"
            />
            <p className="text-xs text-gray-500">
              Số điện thoại này sẽ hiển thị trên trang chi tiết sản phẩm và các trang liên hệ
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Địa chỉ cửa hàng"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          {/* Business Hours */}
          <div className="space-y-2">
            <Label htmlFor="hours">Giờ làm việc</Label>
            <Input
              id="hours"
              value={settings.businessHours}
              onChange={(e) => handleInputChange('businessHours', e.target.value)}
              placeholder="8:00 - 20:00 (Thứ 2 - Chủ nhật)"
            />
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Cài đặt sẽ được áp dụng ngay lập tức</span>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Xem trước:</h4>
            <div className="space-y-1 text-sm">
              <p><strong>📞 Điện thoại:</strong> {settings.phoneNumber}</p>
              <p><strong>📍 Địa chỉ:</strong> {settings.address}</p>
              <p><strong>✉️ Email:</strong> {settings.email}</p>
              <p><strong>🕒 Giờ làm việc:</strong> {settings.businessHours}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
