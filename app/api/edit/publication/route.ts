import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { link, journal, publisher, publication_date } = await req.json();

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
