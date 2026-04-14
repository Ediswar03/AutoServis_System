import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const CRITICAL_STOCK_THRESHOLD = 5

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const no_spk = typeof body?.no_spk === 'string' ? body.no_spk.trim() : ''

  if (!no_spk) {
    return NextResponse.json(
      {
        status: false,
        message: 'no_spk wajib disertakan dalam body request.',
      },
      { status: 400 }
    )
  }

  const spk = await prisma.sPK.findUnique({
    where: { no_spk },
    include: {
      details: {
        include: {
          sukuCadang: true,
        },
      },
    },
  })

  if (!spk) {
    return NextResponse.json(
      {
        status: false,
        message: `SPK dengan no_spk ${no_spk} tidak ditemukan.`,
      },
      { status: 404 }
    )
  }

  if (spk.status === 'SELESAI') {
    return NextResponse.json(
      {
        status: false,
        message: 'SPK sudah diselesaikan sebelumnya.',
      },
      { status: 400 }
    )
  }

  if (!spk.details || spk.details.length === 0) {
    return NextResponse.json(
      {
        status: false,
        message: 'SPK tidak memiliki detail suku cadang.',
      },
      { status: 400 }
    )
  }

  const warnings: Array<{ kode_part: string; nama: string; stok_sisa: number }> = []
  const updateOperations = [] as Array<Promise<any>>
  let totalPart = 0

  for (const detail of spk.details) {
    const part = detail.sukuCadang
    const qty = detail.qty

    if (!part) {
      return NextResponse.json(
        {
          status: false,
          message: `SukuCadang ${detail.kode_part} tidak ditemukan.`,
        },
        { status: 400 }
      )
    }

    if (part.stok < qty) {
      return NextResponse.json(
        {
          status: false,
          message: `Stok ${part.nama} (${part.kode_part}) tidak cukup. Tersedia ${part.stok}.`,
        },
        { status: 400 }
      )
    }

    const newStock = part.stok - qty
    totalPart += Number(part.harga) * qty

    if (newStock < CRITICAL_STOCK_THRESHOLD) {
      warnings.push({ kode_part: part.kode_part, nama: part.nama, stok_sisa: newStock })
    }

    updateOperations.push(
      prisma.sukuCadang.update({
        where: { kode_part: part.kode_part },
        data: { stok: newStock },
      })
    )
  }

  const totalJasa = Number(spk.biaya_jasa ?? 0)
  const grandTotal = totalPart + totalJasa

  try {
    await prisma.$transaction([
      ...updateOperations,
      prisma.sPK.update({
        where: { no_spk },
        data: {
          status: 'SELESAI',
        },
      }),
    ])

    return NextResponse.json(
      {
        status: true,
        message: 'SPK berhasil diselesaikan dan stok berhasil dimutasi.',
        data: {
          no_spk,
          total_part: totalPart,
          total_jasa: totalJasa,
          grand_total: grandTotal,
          warnings,
        },
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyelesaikan SPK.'
    return NextResponse.json(
      {
        status: false,
        message: 'Transaksi dibatalkan karena kegagalan proses mutasi stok.',
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
