import type { AdData } from '@/app/lib/mock-ad-data';
import { DeviceType } from '@/app/lib/device-detector';
import { AdItem } from '@/app/components/AdItem';

export const AdItemWithUseCache = async ({
  adData,
  deviceType,
}: {
  adData: AdData;
  deviceType: DeviceType;
}) => {
  return <AdItem adData={adData} deviceType={deviceType} />;
};
