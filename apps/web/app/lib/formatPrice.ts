export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency === '€' ? 'EUR' : 'USD',
  }).format(price);
}
