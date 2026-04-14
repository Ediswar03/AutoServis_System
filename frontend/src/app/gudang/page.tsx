import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const inventory = [
  { id: 'SP-001', name: 'Brake Pad', stock: 12, price: 'Rp 230.000' },
  { id: 'SP-002', name: 'Oli Mesin', stock: 4, price: 'Rp 120.000' },
  { id: 'SP-003', name: 'Filter Udara', stock: 18, price: 'Rp 90.000' },
]

export default function WarehousePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventori Suku Cadang</CardTitle>
          <CardDescription>Lihat stok, harga, dan status kritis untuk setiap item.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-900">
                <tr>
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Nama Sparepart</th>
                  <th className="px-4 py-3">Stok</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const isCritical = item.stock < 5
                  return (
                    <tr key={item.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium">{item.id}</td>
                      <td className="px-4 py-4">{item.name}</td>
                      <td className="px-4 py-4">{item.stock}</td>
                      <td className="px-4 py-4">{item.price}</td>
                      <td className="px-4 py-4">
                        <Badge variant={isCritical ? 'destructive' : 'secondary'}>
                          {isCritical ? 'Kritis' : 'Aman'}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-l-4 border-destructive bg-red-50">
          <CardHeader>
            <CardTitle>Notifikasi Stok Kritis</CardTitle>
            <CardDescription>Segera isi ulang stok untuk sparepart yang mendekati batas minimum.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <p>Oli Mesin (SP-002) tersisa 4 unit. Batas kritis ditetapkan &lt; 5 unit.</p>
            <p>Segera validasi permintaan suku cadang dari mekanik sebelum distribusi.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Kebutuhan</CardTitle>
            <CardDescription>Permintaan part yang menunggu validasi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-slate-700">
            <p className="text-sm">3 permintaan baru menunggu persetujuan.</p>
            <p className="text-sm">Prioritas utama: oli mesin, kampas rem, dan aki.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
