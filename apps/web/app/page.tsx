import Link from 'next/link';

export default function HomePage() {
  // Generate some random ad IDs for testing
  const adIds = Array.from(
    { length: 10 },
    (_) => Math.floor(Math.random() * 100000) + 1,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Load Testing Demo - Subito.it Style
      </h1>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Sample Ad Links for Testing:
        </h2>
        <div className="grid gap-2">
          {adIds.map((id) => (
            <Link
              key={id}
              href={`/ad/${id}`}
              className="block p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-blue-600 hover:text-blue-800 font-medium">
                Annuncio #{id}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Come testare:</h3>
          <p className="text-blue-800 text-sm">
            Visita qualsiasi URL del tipo{' '}
            <code className="bg-white px-1 rounded">/ad/[numero]</code> per
            vedere una pagina di dettaglio annuncio simulata. Ogni ID genererà
            contenuto pseudo-casuale per il load testing.
          </p>
        </div>
      </div>
    </div>
  );
}
