import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        spk: {
          include: {
            kendaraan: {
              include: { pelanggan: true },
            },
            mekanik: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      status: true,
      message: 'Daftar invoice berhasil diambil.',
      data: invoices,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil data invoice.'
    return NextResponse.json({ status: false, message }, { status: 500 })
  }
}

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

  const total_part = spk.details.reduce((sum, detail) => {
    const price = Number(detail.sukuCadang?.harga ?? 0)
    return sum + price * detail.qty
  }, 0)

  const total_jasa = Number(spk.biaya_jasa ?? 0)
  const grand_total = total_part + total_jasa

  try {
    const invoice = await prisma.invoice.upsert({
      where: { no_invoice: `INV-${no_spk}` },
      update: {
        total_jasa,
        total_part,
        grand_total,
      },
      create: {
        no_invoice: `INV-${no_spk}`,
        no_spk,
        total_jasa,
        total_part,
        grand_total,
      },
    })

    return NextResponse.json({
      status: true,
      message: 'Invoice berhasil dibuat atau diperbarui.',
      data: invoice,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat invoice.'
    return NextResponse.json({ status: false, message }, { status: 500 })
  }
}