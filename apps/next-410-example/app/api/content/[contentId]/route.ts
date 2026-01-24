import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ contentId: string }> },
) {
  const { contentId } = await params;

  if (contentId === '1111') {
    return new NextResponse(
      JSON.stringify({
        error: 'Content no longer available',
        message: 'This content has been permanently removed (410 Gone)',
      }),
      {
        status: 410,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  return NextResponse.json(
    {
      contentId,
      message: 'Content found successfully',
      data: {
        id: contentId,
        title: `Content ${contentId}`,
        status: 'active',
      },
    },
    { status: 200 },
  );
}
