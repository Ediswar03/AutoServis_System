'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const initialFormState = {
  customerName: '',
  phone: '',
  vehicleBrand: '',
  vehicleModel: '',
  licensePlate: '',
  serviceType: '',
  notes: '',
}

export default function AdminRegistrationPage() {
  const [form, setForm] = useState(initialFormState)
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof typeof initialFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleReset = () => {
    setForm(initialFormState)
    setStatus({ type: 'idle', message: '' })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: 'idle', message: '' })

    try {
      // TODO: Ganti dengan panggilan API nyata ketika endpoint backend tersedia
      await new Promise((resolve) => setTimeout(resolve, 800))

      setStatus({
        type: 'success',
        message: 'Pendaftaran pelanggan berhasil disimpan. Lanjutkan ke halaman kasir untuk membuat SPK.',
      })
      setForm(initialFormState)
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Terjadi kesalahan saat menyimpan data. Coba ulang beberapa saat lagi.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Pendaftaran Pelanggan & Kendaraan</CardTitle>
            <CardDescription>Input data pelanggan dan detail kendaraan untuk SPK baru.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Nama Pelanggan</Label>
                  <Input
                    id="customer-name"
                    value={form.customerName}
                    onChange={(event) => handleChange('customerName', event.target.value)}
                    placeholder="Budi Santoso"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">No. Telepon</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(event) => handleChange('phone', event.target.value)}
                    placeholder="0812xxxxxxx"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-brand">Merek</Label>
                  <Input
                    id="vehicle-brand"
                    value={form.vehicleBrand}
                    onChange={(event) => handleChange('vehicleBrand', event.target.value)}
                    placeholder="Toyota"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle-model">Tipe</Label>
                  <Input
                    id="vehicle-model"
                    value={form.vehicleModel}
                    onChange={(event) => handleChange('vehicleModel', event.target.value)}
                    placeholder="Avanza"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license-plate">Nopol</Label>
                  <Input
                    id="license-plate"
                    value={form.licensePlate}
                    onChange={(event) => handleChange('licensePlate', event.target.value)}
                    placeholder="B 1234 XYZ"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-type">Jenis Layanan</Label>
                <Input
                  id="service-type"
                  value={form.serviceType}
                  onChange={(event) => handleChange('serviceType', event.target.value)}
                  placeholder="Ganti oli / Tune-up / Perbaikan rem"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan Tambahan</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(event) => handleChange('notes', event.target.value)}
                  placeholder="Keluhan pelanggan, kondisi kendaraan, atau permintaan khusus"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={handleReset} disabled={isSubmitting}>
                  Reset
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Daftar Pelanggan'}
                </Button>
              </div>
            </form>

            {status.type !== 'idle' ? (
              <div
                className={`mt-6 rounded-2xl border p-4 text-sm ${
                  status.type === 'success'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-rose-300 bg-rose-50 text-rose-800'
                }`}
              >
                {status.message}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="bg-slate-50 p-6">
          <CardHeader>
            <CardTitle>Petunjuk</CardTitle>
            <CardDescription>Gunakan formulir ini untuk mencatat pelanggan dan kendaraan sebelum membuat SPK.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <p className="text-sm">Pastikan nomor telepon valid agar tracking servis dapat dikomunikasikan langsung.</p>
            <p className="text-sm">Data kendaraan akan disimpan di profil pelanggan untuk reuse di kunjungan berikutnya.</p>
            <p className="text-sm">Setelah pendaftaran, lanjutkan ke halaman kasir untuk membuat invoice.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pendaftaran Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-900">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">No. HP</th>
                  <th className="px-4 py-3">Kendaraan</th>
                  <th className="px-4 py-3">Nopol</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">Siti Rahma</td>
                  <td className="px-4 py-3">081298765432</td>
                  <td className="px-4 py-3">Honda Brio</td>
                  <td className="px-4 py-3">B 5678 ABC</td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">Andi Santoso</td>
                  <td className="px-4 py-3">081234567890</td>
                  <td className="px-4 py-3">Toyota Avanza</td>
                  <td className="px-4 py-3">D 1234 EF</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
