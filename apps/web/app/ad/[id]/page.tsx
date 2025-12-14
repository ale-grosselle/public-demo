import Link from 'next/link'
import { notFound } from 'next/navigation'
import ImageGallery from '@/app/components/ImageGallery'
import { generateMockAdData } from '@/lib/mock-ad-data'

interface AdPageProps {
  params: {
    id: string
  }
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency === '€' ? 'EUR' : 'USD',
  }).format(price)
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

function formatViews(views: number): string {
  return new Intl.NumberFormat('it-IT').format(views)
}

export default function AdPage({ params }: AdPageProps) {
  const { id } = params

  // Validate ID is numeric
  if (!/^\d+$/.test(id)) {
    notFound()
  }

  const adData = generateMockAdData(id)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600">
              SubitoDemo
            </Link>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Inserisci annuncio
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                I miei annunci
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Preferiti
              </a>
            </nav>
            <button className="md:hidden p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-500">{adData.category}</span>
            </li>
            <li>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-500">{adData.subcategory}</span>
            </li>
          </ol>
        </nav>

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
                <p className="text-gray-700 leading-relaxed">{adData.description}</p>
              </div>

              {adData.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Caratteristiche</h3>
                  <div className="flex flex-wrap gap-2">
                    {adData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(adData.specifications).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Specifiche</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(adData.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Posizione</h3>
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">📍</span>
                  <span>
                    {adData.location.city}, {adData.location.province} ({adData.location.region})
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Contatta il venditore</h3>

              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {adData.seller.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{adData.seller.name}</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">⭐ {adData.seller.rating}</span>
                    <span>({adData.seller.reviewCount} recensioni)</span>
                  </div>
                  {adData.seller.isVerified && (
                    <span className="inline-flex items-center text-xs text-green-600 mt-1">
                      <span className="mr-1">✓</span>
                      Verificato
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  📞 Mostra numero
                </button>
                <button className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  💬 Invia messaggio
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  ❤️ Salva nei preferiti
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                <p>Su SubitoDemo dal {formatDate(adData.seller.joinDate)}</p>
              </div>
            </div>

            {/* Safety tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Consigli per la sicurezza</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Incontra sempre in luoghi pubblici</li>
                <li>• Controlla il prodotto prima del pagamento</li>
                <li>• Non inviare mai denaro in anticipo</li>
                <li>• Usa i pagamenti tracciabili</li>
              </ul>
            </div>

            {/* Similar ads */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Annunci simili</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Link
                    key={i}
                    href={`/ad/${parseInt(id) + i}`}
                    className="block border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex">
                      <div className="w-16 h-16 bg-gray-200 rounded image-placeholder mr-3"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">
                          Prodotto simile #{parseInt(id) + i}
                        </p>
                        <p className="text-blue-600 font-semibold text-sm">
                          € {Math.round(adData.price * (0.8 + Math.random() * 0.4))}
                        </p>
                        <p className="text-gray-500 text-xs">{adData.location.city}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 SubitoDemo - Load Testing Application</p>
            <p className="mt-2">Annuncio ID: {id} | Generato per test di carico Next.js</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export async function generateMetadata({ params }: AdPageProps) {
  const { id } = params

  if (!/^\d+$/.test(id)) {
    return {
      title: 'Annuncio non trovato',
    }
  }

  const adData = generateMockAdData(id)

  return {
    title: `${adData.title} - ${formatPrice(adData.price, adData.currency)} | SubitoDemo`,
    description: `${adData.description.substring(0, 150)}...`,
    openGraph: {
      title: adData.title,
      description: adData.description,
      type: 'website',
    },
  }
}
