'use client';

export default function MapDirectTestPage() {
  const lat = 10.8231;
  const lng = 106.6297;
  const zoom = 15;
  
  const mapUrl = `https://maps.google.com/maps?width=100%25&height=400&hl=en&q=${lat},${lng}+(Spectrum+Eyecare)&t=&z=${zoom}&ie=UTF8&iwloc=B&output=embed`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Direct Iframe Test
            </h1>
            <p className="text-gray-600 mb-2">
              Test trực tiếp iframe Google Maps không qua component
            </p>
            <p className="text-sm text-gray-500">
              URL: {mapUrl}
            </p>
          </div>

          {/* Direct iframe test */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Direct Iframe (không qua React component)
              </h2>
            </div>
            <div className="aspect-[21/9]">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapUrl}
                title="Direct Google Maps Test"
              />
            </div>
          </div>

          {/* Alternative embed test */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Alternative Embed (search by address)
              </h2>
            </div>
            <div className="aspect-[21/9]">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?width=100%25&height=400&hl=en&q=Ho+Chi+Minh+City,Vietnam+(Ho+Chi+Minh+City)&t=&z=12&ie=UTF8&iwloc=B&output=embed"
                title="Alternative Google Maps Test"
              />
            </div>
          </div>

          {/* Debug info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Debug Info:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Nếu thấy bản đồ → API key hoạt động</li>
              <li>• Nếu thấy lỗi → Có vấn đề với API key hoặc domain</li>
              <li>• Nếu không load → Có thể bị block bởi CSP</li>
              <li>• API Key: AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgBhVEGOc1U</li>
              <li>• Coordinates: {lat}, {lng}</li>
              <li>• Zoom: {zoom}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
