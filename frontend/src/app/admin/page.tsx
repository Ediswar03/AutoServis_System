import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Selamat datang, Admin</CardTitle>
          <CardDescription>Kelola pendaftaran pelanggan, kendaraan, dan faktur penjualan.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Mulai dengan menambahkan pelanggan baru atau menuju kasir untuk mencetak invoice.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/admin/pendaftaran">
              <Button className="w-full">Form Pendaftaran</Button>
            </Link>
            <Link href="/admin/kasir">
              <Button variant="secondary" className="w-full">Halaman Kasir</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Statistik SPK</CardTitle>
          <CardDescription>Ringkasan antrian dan omzet harian.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-100 p-4">
              <p className="text-3xl font-semibold">24</p>
              <p className="text-sm text-slate-600">SPK hari ini</p>
            </div>
            <div className="rounded-3xl bg-slate-100 p-4">
              <p className="text-3xl font-semibold">18</p>
              <p className="text-sm text-slate-600">Pelanggan terdaftar</p>
            </div>
            <div className="rounded-3xl bg-slate-100 p-4">
              <p className="text-3xl font-semibold">Rp 9.400.000</p>
              <p className="text-sm text-slate-600">Pendapatan estimasi</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
