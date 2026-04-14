import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const aggregates = await prisma.sPK.groupBy({
    by: ['id_mekanik'],
    where: { status: 'SELESAI' },
    _count: {
      no_spk: true,
    },
  })

  const report = await Promise.all(
    aggregates.map(async (item) => {
      const mekanik = await prisma.mekanik.findUnique({
        where: { id: item.id_mekanik },
      })

      return {
        id_mekanik: item.id_mekanik,
        nama_mekanik: mekanik?.nama ?? 'Unknown',
        spk_selesai: item._count.no_spk,
      }
    })
  )

  return NextResponse.json({
    status: true,
    message: 'Laporan kinerja mekanik berhasil dibuat.',
    data: report,
  })
}
