import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const no_spk = typeof body?.no_spk === 'string' ? body.no_spk.trim() : ''

  if (!no_spk) {
    return NextResponse.json(
      { status: false, message: 'no_spk wajib disertakan dalam body request.' },
      { status: 400 }
    )
  }

  const spk = await prisma.sPK.findUnique({
    where: { no_spk },
    include: {
      details: {
        include: { sukuCadang: true },
      },
    },
  })

  if (!spk) {
    return NextResponse.json(
      { status: false, message: `SPK ${no_spk} tidak ditemukan.` },
      { status: 404 }
    )
  }

  if (spk.details.length === 0) {
    return NextResponse.json(
      { status: false, message: 'SPK tidak memiliki detail suku cadang.' },
      { status: 400 }
    )
  }

  const validationErrors = spk.details.flatMap((detail) => {
    const part = detail.sukuCadang
    if (!part) {
      return [`SukuCadang ${detail.kode_part} tidak ditemukan.`]
    }
    if (part.stok < detail.qty) {
      return [`Stok ${part.nama} (${part.kode_part}) tidak cukup. Tersedia ${part.stok}.`] 
    }
    return []
  })

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { status: false, message: 'Validasi stok gagal.', errors: validationErrors },
      { status: 400 }
    )
  }

  const warnings: Array<{ kode_part: string; nama: string; stok_sisa: number }> = []

  const transactionOps = spk.details.map((detail) => {
    const part = detail.sukuCadang!
    const newStock = part.stok - detail.qty

    if (newStock < 5) {
      warnings.push({ kode_part: part.kode_part, nama: part.nama, stok_sisa: newStock })
    }

    return prisma.sukuCadang.update({
      where: { kode_part: part.kode_part },
      data: { stok: newStock },
    })
  })

  const transactionResult = await prisma.$transaction([
    ...transactionOps,
    prisma.sPK.update({
      where: { no_spk },
      data: { status: 'PROGRESS' },
    }),
  ])

  return NextResponse.json(
    {
      status: true,
      message: `Pengeluaran part untuk SPK ${no_spk} berhasil divalidasi.`,
      data: {
        updatedParts: (transactionResult.slice(0, spk.details.length) as Array<{ kode_part: string; stok: number }>)
        .map((item) => ({ kode_part: item.kode_part, stok: item.stok })),
        warnings,
      },
    },
    { status: 200 }
  )
}
