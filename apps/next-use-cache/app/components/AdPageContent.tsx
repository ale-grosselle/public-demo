import { generateMockAdData } from '@/app/lib/mock-ad-data';
import { headers } from 'next/headers';
import { detectDeviceType } from '@/app/lib/device-detector';
import { AdItemWithUseCache } from '@/app/components/AdItemWithUseCache';

export async function AdPageContent({ id }: { id: string }) {
  const [headersSettled] = await Promise.allSettled([
    headers(),
  ]);

  if (headersSettled.status === 'rejected') {
    return <h1>ERROR!</h1>;
  }

  const headersList = headersSettled.value;
  const userAgent = headersList.get('user-agent') || '';

  // Detect device type
  const deviceType = detectDeviceType(userAgent);

  if (!id) {
    return <h1>ERROR!</h1>;
  }

  const adData = generateMockAdData(id);

  return <AdItemWithUseCache adData={adData} deviceType={deviceType} />;
}