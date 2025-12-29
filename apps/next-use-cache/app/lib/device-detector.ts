export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function detectDeviceType(userAgent: string): DeviceType {
  if (!userAgent) {
    return 'desktop';
  }

  // Convert to lowercase for case-insensitive matching
  const ua = userAgent.toLowerCase();

  // Mobile device patterns
  const mobilePatterns = [
    /android.*mobile/,
    /iphone/,
    /ipod/,
    /blackberry/,
    /opera mini/,
    /opera mobi/,
    /mobile/,
    /palm/,
    /windows phone/,
    /iemobile/,
    /fennec/,
    /series ?60/,
  ];

  // Tablet device patterns
  const tabletPatterns = [
    /ipad/,
    /android(?!.*mobile)/,
    /tablet/,
    /kindle/,
    /silk/,
    /playbook/,
    /bb10/,
    /rim.*tablet/,
  ];

  // Check for tablet first (more specific)
  for (const pattern of tabletPatterns) {
    if (pattern.test(ua)) {
      return 'tablet';
    }
  }

  // Then check for mobile
  for (const pattern of mobilePatterns) {
    if (pattern.test(ua)) {
      return 'mobile';
    }
  }

  // Default to desktop
  return 'desktop';
}

export function getDeviceDescription(deviceType: DeviceType): string {
  switch (deviceType) {
    case 'mobile':
      return 'Mobile Device';
    case 'tablet':
      return 'Tablet Device';
    case 'desktop':
      return 'Desktop Device';
    default:
      return 'Desktop Device';
  }
}
