import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!email || !password) {
    return NextResponse.json(
      { status: false, message: 'Email dan password wajib diisi.' },
      { status: 400 }
    )
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { status: false, message: 'Email atau password salah.' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { status: false, message: 'Email atau password salah.' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nama: user.nama,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    return NextResponse.json({
      status: true,
      message: 'Login berhasil.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          nama: user.nama,
          role: user.role,
        },
        token,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat login.'
    return NextResponse.json({ status: false, message }, { status: 500 })
  }
}