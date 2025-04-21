'use server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, oldpassword, newpassword } = await req.json()

  if (!email || !oldpassword || !newpassword) {
    return NextResponse.json({ error: "Missing required fields. This should not be showing up." }, { status: 400 })
  }

  const user = await prisma.account.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Account not found, this error should never be reached' }, { status: 404 });
  }

  if (!await bcrypt.compare(oldpassword, user.password)) {
    return NextResponse.json({ error: 'Old password does not match' }, { status: 401 });
  }

  await prisma.account.update({
    where: { email: email },
    data: { password: await bcrypt.hash(newpassword, 10) },
  });

  return NextResponse.json({ message: 'Password reset successful, please log in again' })
}