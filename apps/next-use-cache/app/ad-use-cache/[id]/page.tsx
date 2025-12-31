import { AdPageContent } from '@/app/components/AdPageContent';

export default async function AdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <h1>ERROR!</h1>;
  }

  return <AdPageContent id={id} />;
}
