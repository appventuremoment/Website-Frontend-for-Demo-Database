import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { link, journal, publisher, publication_date } = body;

  try {
    await prisma.publication.update({
      where: { link },
      data: {
        journal,
        publisher,
        publication_date: new Date(publication_date),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
