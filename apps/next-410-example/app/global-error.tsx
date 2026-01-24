'use client'; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string; statusCode?: number };
  reset: () => void;
}) {
  const is410 = 'statusCode' in error && error.statusCode === 410;

  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>{is410 ? 'Resource No Longer Available' : 'Something went wrong!'}</h2>
        {is410 ? (
          <p>This resource has been permanently removed (410 Gone).</p>
        ) : (
          <button onClick={() => reset()}>Try again</button>
        )}
      </body>
    </html>
  );
}
