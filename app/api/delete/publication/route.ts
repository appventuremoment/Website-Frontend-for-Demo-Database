'use server';
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { link } = await req.json()
  
  try {
    await prisma.publication.delete({where: { link: link }});
    return NextResponse.json(true, {status: 200});
  } catch (error) {
    console.error('Database query error:', error)
    return NextResponse.json(false, { status: 500 });
  }
}
