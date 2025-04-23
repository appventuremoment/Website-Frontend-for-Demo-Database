'use server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { ssef_code } = await req.json();

  try {
    await prisma.ssef_project.delete({ where: { ssef_code: ssef_code } });
    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(false, { status: 500 });
  }
}