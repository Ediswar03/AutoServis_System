import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function generateSpkNumber() {
  return `SPK-${Date.now()}`
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const plat_nomor = typeof body?.plat_nomor === 'string' ? body.plat_nomor.trim() : ''
  const id_mekanik = typeof body?.id_mekanik === 'number' ? body.id_mekanik : null
  const keluhan = typeof body?.keluhan === 'string' ? body.keluhan.trim() : ''
  const biaya_jasa = typeof body?.biaya_jasa === 'number' ? body.biaya_jasa : 0
  const details = Array.isArray(body?.details) ? body.details : []

  if (!plat_nomor || !id_mekanik || details.length === 0) {
    return NextResponse.json(
      {
        status: false,
        message: 'Payload tidak lengkap. Harus berisi plat_nomor, id_mekanik, dan minimal satu detail part.',
      },
      { status: 400 }
    )
  }

  const no_spk = generateSpkNumber()

  try {
    const createdSPK = await prisma.$transaction(async (tx) => {
      const spk = await tx.sPK.create({
        data: {
          no_spk,
          plat_nomor,
          id_mekanik,
          status: 'OPEN',
          keluhan,
          biaya_jasa,
        },
      })

      const detailRecords = await Promise.all(
        details.map(async (item: { kode_part: string; qty: number }) => {
          if (!item?.kode_part || typeof item.qty !== 'number' || item.qty <= 0) {
            throw new Error('Setiap detail harus berisi kode_part dan qty > 0.')
          }

          return tx.detailSukuCadang.create({
            data: {
              no_spk: spk.no_spk,
              kode_part: item.kode_part,
              qty: item.qty,
            },
          })
        })
      )

      return { spk, details: detailRecords }
    })

    return NextResponse.json({
      status: true,
      message: 'SPK berhasil dibuat.',
      data: createdSPK,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat SPK.'
    return NextResponse.json({ status: false, message }, { status: 500 })
  }
}
