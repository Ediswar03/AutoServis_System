import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create default users
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'admin@autoservis.com' },
        update: {},
        create: {
          email: 'admin@autoservis.com',
          password: hashedPassword,
          nama: 'Administrator',
          role: 'ADMIN',
        },
      }),
      prisma.user.upsert({
        where: { email: 'mekanik@autoservis.com' },
        update: {},
        create: {
          email: 'mekanik@autoservis.com',
          password: hashedPassword,
          nama: 'Ahmad Mekanik',
          role: 'MEKANIK',
        },
      }),
      prisma.user.upsert({
        where: { email: 'gudang@autoservis.com' },
        update: {},
        create: {
          email: 'gudang@autoservis.com',
          password: hashedPassword,
          nama: 'Budi Gudang',
          role: 'GUDANG',
        },
      }),
      prisma.user.upsert({
        where: { email: 'pimpinan@autoservis.com' },
        update: {},
        create: {
          email: 'pimpinan@autoservis.com',
          password: hashedPassword,
          nama: 'Citra Pimpinan',
          role: 'PIMPINAN',
        },
      }),
    ])

    return NextResponse.json({
      status: true,
      message: 'User default berhasil dibuat.',
      data: users.map(user => ({
        email: user.email,
        nama: user.nama,
        role: user.role,
      })),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat user default.'
    return NextResponse.json({ status: false, message }, { status: 500 })
  }
}