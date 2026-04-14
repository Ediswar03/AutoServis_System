import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { no_invoice: string } }
) {
  const no_invoice = params.no_invoice
  const body = await request.json().catch(() => null)
  const status_pembayaran = typeof body?.status_pembayaran === 'string' ? body.status_pembayaran.toUpperCase() : ''

  if (!no_invoice || !['LUNAS', 'BELUM_BAYAR'].includes(status_pembayaran)) {
    return NextResponse.json(
      {
        status: false,
        message: 'Parameter no_invoice dan status_pembayaran (LUNAS/BELUM_BAYAR) wajib disertakan.',
      },
      { status: 400 }
    )
  }

  try {
    const updatedInvoice = await prisma.invoice.update({
      where: { no_invoice },
      data: { status_pembayaran },
      include: {
        spk: {
          include: {
            kendaraan: {
              include: { pelanggan: true },
            },
          },
        },
      },
    })

    return NextResponse.json(
      {
        status: true,
        message: `Status pembayaran invoice berhasil diupdate menjadi ${status_pembayaran}.`,
        data: updatedInvoice,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate status pembayaran.'
    return NextResponse.json({ status: false, message }, { status: 500 })
  }
}
