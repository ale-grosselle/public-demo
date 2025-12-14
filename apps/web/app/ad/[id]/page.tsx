import { notFound } from 'next/navigation';
import ImageGallery from '../../components/ImageGallery';
import { generateMockAdData } from '@/lib/mock-ad-data';

interface AdPageProps {
  params: {
    id: string;
  };
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency === '€' ? 'EUR' : 'USD',
  }).format(price);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

function formatViews(views: number): string {
  return new Intl.NumberFormat('it-IT').format(views);
}

export default async function AdPage({ params }: AdPageProps) {
  const { id } = await params;

  // Validate ID is numeric
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const adData = generateMockAdData(id);

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
                    {adData.title}
                  </h1>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">
                    {formatPrice(adData.price, adData.currency)}
                  </p>
                </div>
                <div className="text-left sm:text-right text-sm text-gray-500">
                  <p>Pubblicato il {formatDate(adData.publishedDate)}</p>
                  <p>{formatViews(adData.views)} visualizzazioni</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {adData.category}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {adData.subcategory}
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
}

export async function generateMetadata({ params }: AdPageProps) {
  const { id } = params;

  if (!/^\d+$/.test(id)) {
    return {
      title: 'Annuncio non trovato',
    };
  }

  const adData = generateMockAdData(id);

  return {
    title: `${adData.title} - ${formatPrice(adData.price, adData.currency)} | SubitoDemo`,
    description: `${adData.description.substring(0, 150)}...`,
    openGraph: {
      title: adData.title,
      description: adData.description,
      type: 'website',
    },
  };
}
