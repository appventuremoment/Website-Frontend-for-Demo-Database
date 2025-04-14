import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, password, username } = await req.json()

  if (!email || !password || !username) {
    return NextResponse.json({ error: password }, { status: 400 })
  }

  const existingUser = await prisma.accounts.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const _ = await prisma.accounts.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  })

  return NextResponse.json({ message: 'User registered successfully' })
}
