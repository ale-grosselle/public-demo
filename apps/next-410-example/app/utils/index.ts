import { cache } from 'react';

/**
 * Fetches content by ID with React cache for deduplication
 * Returns 410 if contentId is "1111", otherwise returns 200 with content data
 */
export const getContentById = cache(
  async (contentId: string): Promise<Response> => {
    console.log('Fetching content for ID:', contentId);
    return await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/content/${contentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  },
);
