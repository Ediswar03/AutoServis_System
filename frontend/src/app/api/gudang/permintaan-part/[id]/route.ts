import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  const body = await request.json().catch(() => null)
  const action = typeof body?.action === 'string' ? body.action.toUpperCase() : ''

  if (!id || Number.isNaN(id) || !['APPROVE', 'REJECT'].includes(action)) {
    return NextResponse.json(
      {
        status: false,
        message: 'Parameter id harus angka valid dan action harus APPROVE atau REJECT.',
      },
      { status: 400 }
    )
  }

  const requestPart = await prisma.permintaanPart.findUnique({
    where: { id },
    include: { spk: true, sukuCadang: true },
  })

  if (!requestPart) {
    return NextResponse.json(
      { status: false, message: `Permintaan part dengan id ${id} tidak ditemukan.` },
      { status: 404 }
    )
  }

  if (requestPart.status !== 'PENDING') {
    return NextResponse.json(
      { status: false, message: 'Permintaan ini sudah diproses sebelumnya.' },
      { status: 400 }
    )
  }

  const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED'

  try {
    const updatedRequest = await prisma.permintaanPart.update({
      where: { id },
      data: { status: newStatus },
    })

    return NextResponse.json(
      {
        status: true,
        message: `Permintaan part berhasil ${newStatus.toLowerCase()}.`,
        data: updatedRequest,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses permintaan.'
    return NextResponse.json({ status: false, message }, { status: 500 })
  }
}
