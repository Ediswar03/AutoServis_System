import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const no_spk = params.id

  if (!no_spk) {
    return NextResponse.json(
      { status: false, message: 'Parameter id SPK wajib disertakan di URL.' },
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
      { status: false, message: `SPK ${no_spk} tidak ditemukan.` },
      { status: 404 }
    )
  }

  const total_part = spk.details.reduce((sum, detail) => {
    const price = Number(detail.sukuCadang?.harga ?? 0)
    return sum + price * detail.qty
  }, 0)

  const total_jasa = Number(spk.biaya_jasa ?? 0)
  const grand_total = total_jasa + total_part

  return NextResponse.json(
    {
      status: true,
      message: `Estimasi invoice untuk SPK ${no_spk} berhasil dihitung.`,
      data: {
        no_spk,
        total_part,
        total_jasa,
        grand_total,
        invoice: {
          total_part,
          total_jasa,
          grand_total,
        },
      },
    },
    { status: 200 }
  )
}
