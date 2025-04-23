import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { ssef_code, forms_received, poster_received, result, pid } = await req.json();

    await prisma.ssef_project.create({
      data: {
        ssef_code,
        forms_received: forms_received === 1,
        poster_received: poster_received === 1,
        result,
        pid,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error adding SSEF project:', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}