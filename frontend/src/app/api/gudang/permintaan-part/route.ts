import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const pendingRequests = await prisma.permintaanPart.findMany({
      where: { status: 'PENDING' },
      include: {
        spk: {
          include: { mekanik: true },
        },
        sukuCadang: true,
      },
      orderBy: { requested_at: 'desc' },
    })

    return NextResponse.json({
      status: true,
      message: 'Daftar permintaan part pending berhasil diambil.',
      data: pendingRequests,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data.'
    return NextResponse.json({ status: false, message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const no_spk = typeof body?.no_spk === 'string' ? body.no_spk.trim() : ''
  const requests = Array.isArray(body?.requests) ? body.requests : []

  if (!no_spk || requests.length === 0) {
    return NextResponse.json(
      {
        status: false,
        message: 'Payload tidak lengkap. Harus berisi no_spk dan daftar requests.',
      },
      { status: 400 }
    )
  }

  const spk = await prisma.sPK.findUnique({
    where: { no_spk },
    include: { mekanik: true },
  })

  if (!spk) {
    return NextResponse.json(
      { status: false, message: `SPK ${no_spk} tidak ditemukan.` },
      { status: 404 }
    )
  }

  try {
    const createdRequests = await prisma.$transaction(async (tx) => {
      const entries = await Promise.all(
        requests.map(async (item: { kode_part: string; qty: number }) => {
          if (!item?.kode_part || typeof item.qty !== 'number' || item.qty <= 0) {
            throw new Error('Setiap request harus berisi kode_part dan qty > 0.')
          }

          const part = await tx.sukuCadang.findUnique({ where: { kode_part: item.kode_part } })
          if (!part) {
            throw new Error(`SukuCadang ${item.kode_part} tidak ditemukan.`)
          }

          return tx.permintaanPart.create({
            data: {
              no_spk,
              kode_part: item.kode_part,
              qty: item.qty,
              status: 'PENDING',
            },
          })
        })
      )

      return entries
    })

    return NextResponse.json(
      {
        status: true,
        message: `Permintaan part untuk SPK ${no_spk} berhasil dibuat dan menunggu validasi gudang.`,
        data: {
          spk: { no_spk, mekanik: spk.mekanik?.nama ?? 'Unknown' },
          requests: createdRequests,
        },
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat permintaan part.'
    return NextResponse.json({ status: false, message }, { status: 500 })
  }
}

