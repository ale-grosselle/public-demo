import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getContentById } from '@/app/utils';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  if (request.url.includes('/page-with-error-using-proxy')) {
    const url = new URL(request.url);
    const contentId = url.searchParams.get('id');
    if (contentId) {
      const contentDetailsResponse = await getContentById(contentId);
      if (contentDetailsResponse.status === 410) {
        return NextResponse.rewrite(
          new URL(`/page-with-error-using-proxy/410`, request.url),
          {
            status: 410,
          },
        );
      }
    }
  }
  return NextResponse.next();
}
