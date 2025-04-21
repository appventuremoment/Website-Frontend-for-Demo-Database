'use server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { project_code, journal, publisher, publication_date, link } = body;

  try {
    await prisma.publication.create({
      data: {
        pid: project_code,
        journal,
        publisher,
        publication_date: new Date(publication_date),
        link
      },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Error adding publication:', error);
    return NextResponse.json({ ok: false, error: 'Failed to add publication' }, { status: 500 });
  }
}