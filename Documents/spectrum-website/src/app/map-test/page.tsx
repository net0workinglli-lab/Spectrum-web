'use client';

import SimpleMap from '@/components/SimpleMap';

export default function MapTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Test Google Maps Integration
            </h1>
            <p className="text-gray-600">
              Kiểm tra xem bản đồ có hiển thị đúng không
            </p>
          </div>

          {/* Map Test 1: Default location (Ho Chi Minh City) */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Test 1: Vị trí mặc định (TP.HCM)
              </h2>
              <p className="text-sm text-gray-600">
                Lat: 10.8231, Lng: 106.6297, Zoom: 15
              </p>
            </div>
            <div className="aspect-[16/9]">
              <SimpleMap
                lat={10.8231}
                lng={106.6297}
                zoom={15}
                address="123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh, Việt Nam"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Map Test 2: Different location (Hanoi) */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Test 2: Vị trí khác (Hà Nội)
              </h2>
              <p className="text-sm text-gray-600">
                Lat: 21.0285, Lng: 105.8542, Zoom: 12
              </p>
            </div>
            <div className="aspect-[16/9]">
              <SimpleMap
                lat={21.0285}
                lng={105.8542}
                zoom={12}
                address="Hà Nội, Việt Nam"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Map Test 3: High zoom level */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Test 3: Zoom cao (Landmark 81)
              </h2>
              <p className="text-sm text-gray-600">
                Lat: 10.7951, Lng: 106.7212, Zoom: 18
              </p>
            </div>
            <div className="aspect-[16/9]">
              <SimpleMap
                lat={10.7951}
                lng={106.7212}
                zoom={18}
                address="Landmark 81, Vinhomes Central Park, TP.HCM"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Debug Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Debug Info:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Nếu bạn thấy iframe Google Maps → Thành công!</li>
              <li>• Nếu chỉ thấy "Đang tải bản đồ..." → Có vấn đề với API key</li>
              <li>• Nếu thấy lỗi 403 → API key không có quyền</li>
              <li>• Nếu thấy lỗi 400 → API key không hợp lệ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
