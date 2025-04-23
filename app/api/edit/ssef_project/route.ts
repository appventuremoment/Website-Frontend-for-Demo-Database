import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { ssef_code, forms_received, poster_received, result, pid } = await req.json();
 
  try {
    await prisma.ssef_project.update({
      where: { ssef_code },
      data: {
        forms_received,
        poster_received,
        result,
        pid,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}