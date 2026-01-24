import { notFound } from 'next/navigation';
import { getContentById } from '@/app/utils';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const contentId = params.id as string;

  const contentDetailsResponse = await getContentById(contentId);
  const body = await contentDetailsResponse.json();

  // Handle 410 Gone status using Next.js notFound function
  if (contentDetailsResponse.status === 410) {
    notFound();
  }

  return (
    <>
      <h1>Ad details</h1>
      {JSON.stringify(body, null, 2)}
    </>
  );
}
