import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const no_spk = params.id

  if (!no_spk || typeof no_spk !== 'string') {
    return NextResponse.json(
      {
        status: false,
        message: 'Parameter id SPK harus berupa string no_spk yang valid.',
      },
      { status: 400 }
    )
  }

  try {
    const spk = await prisma.sPK.findUnique({
      where: { no_spk },
      include: {
        details: {
          include: {
            sukuCadang: true,
          },
        },
        mekanik: true,
        kendaraan: true,
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

    return NextResponse.json(
      {
        status: true,
        message: 'Data SPK berhasil diambil.',
        data: spk,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak terduga.'
    return NextResponse.json(
      {
        status: false,
        message: 'Terjadi kesalahan saat mengambil data SPK.',
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
