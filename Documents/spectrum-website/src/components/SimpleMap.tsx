'use client';

import { MapPin, ExternalLink } from 'lucide-react';

interface SimpleMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
  address?: string;
}

export default function SimpleMap({ 
  lat = 10.8231, 
  lng = 106.6297, 
  zoom = 15, 
  className = '',
  address = '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh'
}: SimpleMapProps) {
  
  const mapUrl = `https://maps.google.com/maps?width=100%25&height=400&hl=en&q=${lat},${lng}+(Spectrum+Eyecare)&t=&z=${zoom}&ie=UTF8&iwloc=B&output=embed`;
  const directionsUrl = `https://maps.google.com/?q=${lat},${lng}`;
  
  console.log('🗺️ SimpleMap rendering with:', { lat, lng, zoom, mapUrl });

  return (
    <div className={`relative ${className}`}>
      {/* Main Map Iframe */}
      <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '300px' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
          title="Bản đồ vị trí Spectrum Eyecare"
          className="w-full h-full"
        />
      </div>

      {/* Overlay Info Card */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
            <MapPin className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              Spectrum Eyecare
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed mb-2">
              {address}
            </p>
            <a 
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium"
            >
              <ExternalLink className="h-3 w-3" />
              Chỉ đường
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <a 
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg shadow-md text-xs font-medium transition-colors flex items-center gap-1"
        >
          <MapPin className="h-3 w-3" />
          Xem chi tiết
        </a>
        <a 
          href={`https://maps.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-md text-xs font-medium transition-colors flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          Chỉ đường
        </a>
      </div>

      {/* Loading fallback */}
      <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center" 
           style={{ zIndex: -1 }}>
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Đang tải bản đồ...</p>
        </div>
      </div>
    </div>
  );
}
