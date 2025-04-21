'use server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email, username } = await req.json()

  if (!username) {
    return NextResponse.json({ error: "Missing required fields. This should not be showing up." }, { status: 400 })
  }

  await prisma.account.update({
    where: { email: email },
    data: { username: username },
  });

  return NextResponse.json({ message: 'Name change successful' })
}