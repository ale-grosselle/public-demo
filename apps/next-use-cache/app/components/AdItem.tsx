import ImageGallery from '@/app/components/ImageGallery';
import { formatPrice } from '@/app/lib/formatPrice';
import type { AdData } from '@/app/lib/mock-ad-data';
import { DeviceType, getDeviceDescription } from '@/app/lib/device-detector';

export const AdItem = ({
  adData,
  deviceType,
}: {
  adData: AdData;
  deviceType: DeviceType;
}) => {
  // Detect device type
  const deviceDescription = getDeviceDescription(deviceType);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={adData.images} title={adData.title} />
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    [{deviceDescription}] {adData.title}
                  </h1>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">
                    {formatPrice(adData.price, adData.currency)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {adData.category}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {adData.condition}
                </span>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">Descrizione</h3>
                <p className="text-gray-700 leading-relaxed">
                  {adData.description}
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Posizione</h3>
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">📍</span>
                  <span>
                    {adData.location.city}, {adData.location.province} (
                    {adData.location.region})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
