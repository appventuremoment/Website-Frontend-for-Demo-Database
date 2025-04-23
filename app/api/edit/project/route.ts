'use server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { internal_code, title, field_of_study, taken, present_ready, poster_received, EMemail, IMemail, ecompany_name } = await req.json();

  try {
    await prisma.project.update({
        where: { internal_code },
        data: {
          title,
          field_of_study,
          taken,
          present_ready,
          poster_received,
          EMemail: EMemail || null,
          IMemail: IMemail || null,
          ecompany_name: ecompany_name || null
        },
      });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Error editing project:', error);
    return NextResponse.json({ ok: false, error: 'Failed to edit project' }, { status: 500 });
  }
}