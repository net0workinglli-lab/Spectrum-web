'use client';

import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface GoogleMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
  address?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function GoogleMap({ 
  lat = 10.8231, 
  lng = 106.6297, 
  zoom = 15, 
  className = '',
  address = '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh'
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Create script element for Google Maps API
      const script = document.createElement('script');
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgBhVEGOc1U';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      console.log('🗺️ Loading Google Maps with API key:', apiKey.substring(0, 10) + '...');
      
      script.onload = () => {
        initializeMap();
      };

      script.onerror = () => {
        console.error('❌ Failed to load Google Maps API');
        // Show iframe fallback instead
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <iframe
              width="100%"
              height="100%"
              style="border:0; border-radius: 8px;"
              loading="lazy"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgBhVEGOc1U&q=${lat},${lng}&zoom=${zoom}">
            </iframe>
          `;
        }
      };

      document.head.appendChild(script);

      return () => {
        // Cleanup script if component unmounts
        const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      try {
        // Create map
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ weight: '2.00' }]
            },
            {
              featureType: 'all',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#9c9c9c' }]
            },
            {
              featureType: 'all',
              elementType: 'labels.text',
              stylers: [{ visibility: 'on' }]
            },
            {
              featureType: 'landscape',
              elementType: 'all',
              stylers: [{ color: '#f2f2f2' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry.fill',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'landscape.man_made',
              elementType: 'geometry.fill',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'road',
              elementType: 'all',
              stylers: [{ saturation: -100 }, { lightness: 45 }]
            },
            {
              featureType: 'road',
              elementType: 'geometry.fill',
              stylers: [{ color: '#eeeeee' }]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#7b7b7b' }]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'all',
              stylers: [{ visibility: 'simplified' }]
            },
            {
              featureType: 'road.arterial',
              elementType: 'labels.icon',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              elementType: 'all',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'water',
              elementType: 'all',
              stylers: [{ color: '#46bcec' }, { visibility: 'on' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#c8d7d4' }]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#070707' }]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#ffffff' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'cooperative'
        });

        // Create custom marker
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: address,
          animation: window.google.maps.Animation.DROP,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="background: #3B82F6; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                  <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1F2937;">Spectrum Vietnam</h3>
              </div>
              <p style="margin: 0; font-size: 14px; color: #6B7280; line-height: 1.4;">
                ${address}
              </p>
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
                <a href="https://maps.google.com/?q=${lat},${lng}" target="_blank" style="color: #3B82F6; text-decoration: none; font-size: 13px; font-weight: 500;">
                  Xem trên Google Maps →
                </a>
              </div>
            </div>
          `
        });

        // Add click event to marker
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Store map instance
        mapInstanceRef.current = map;

        // Auto-open info window after a short delay
        setTimeout(() => {
          infoWindow.open(map, marker);
        }, 1000);

      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    loadGoogleMaps();
  }, [lat, lng, zoom, address]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[300px] rounded-lg"
        style={{ backgroundColor: '#f8f9fa' }}
      />
      
      {/* Loading overlay */}
      {!window.google && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm">Đang tải bản đồ...</p>
          </div>
        </div>
      )}

      {/* Fallback if Google Maps fails to load */}
      {typeof window !== 'undefined' && window.google === undefined && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500 mb-4">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm mb-2">Không thể tải Google Maps API</p>
            <p className="text-xs text-gray-400">Đang sử dụng bản đồ dự phòng...</p>
          </div>
          
          {/* Fallback iframe */}
          <div className="w-full h-full">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '8px', minHeight: '300px' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgBhVEGOc1U&q=${lat},${lng}&zoom=${zoom}`}
              title="Bản đồ vị trí"
            />
          </div>
          
          <div className="absolute bottom-4 right-4">
            <a 
              href={`https://maps.google.com/?q=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
            >
              Mở Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
