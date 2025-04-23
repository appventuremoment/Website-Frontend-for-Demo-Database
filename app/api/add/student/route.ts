'use server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { studentid, fname, lname, year_of_study } = await req.json();

  try {
    if ((year_of_study === '5' && !studentid.startsWith('h21')) || (year_of_study === '6' && !studentid.startsWith('h20'))) return NextResponse.json({ ok: false, error: 'Student ID does not match the year of study' }, { status: 400 });

    await prisma.student.create({
      data: {
        studentid,
        fname,
        lname,
        year_of_study: typeof year_of_study === 'string' ? parseInt(year_of_study, 10) : year_of_study,
      },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Error adding publication:', error);
    return NextResponse.json({ ok: false, error: 'Failed to add publication' }, { status: 500 });
  }
}