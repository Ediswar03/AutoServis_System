import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RevenueChart } from './components/revenue-chart'

const performance = [
  { mechanic: 'Andi', completed: 28, rating: 4.8 },
  { mechanic: 'Sari', completed: 22, rating: 4.7 },
  { mechanic: 'Rio', completed: 19, rating: 4.5 },
]

export default function ExecutiveDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card className="bg-slate-900/90 text-slate-100">
          <CardHeader>
            <CardTitle>Ringkasan Pendapatan Bulanan</CardTitle>
            <CardDescription>Monitor pertumbuhan omzet dan prediksi target.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-5">
                <p className="text-sm uppercase text-slate-400">Pendapatan Bulan Ini</p>
                <p className="mt-3 text-3xl font-semibold">Rp 10.2M</p>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-5">
                <p className="text-sm uppercase text-slate-400">Pertumbuhan Bulan</p>
                <p className="mt-3 text-3xl font-semibold">+12.4%</p>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-5">
                <p className="text-sm uppercase text-slate-400">SPK Selesai</p>
                <p className="mt-3 text-3xl font-semibold">156</p>
              </div>
            </div>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/90 text-slate-100">
          <CardHeader>
            <CardTitle>Wawasan Cepat</CardTitle>
            <CardDescription>Indikator KPI utama harian.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-5">
              <p className="text-sm text-slate-400">Tingkat penggunaan suku cadang</p>
              <p className="mt-3 text-xl font-semibold">72%</p>
            </div>
            <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-5">
              <p className="text-sm text-slate-400">Rata-rata waktu pengerjaan</p>
              <p className="mt-3 text-xl font-semibold">3.2 jam</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/90 text-slate-100">
        <CardHeader>
          <CardTitle>Performa Mekanik</CardTitle>
          <CardDescription>Rekap jumlah SPK yang diselesaikan dan rating tim.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-3xl border border-slate-700 bg-slate-950/90">
            <table className="w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Mekanik</th>
                  <th className="px-4 py-3">SPK Selesai</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Trend</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((item) => (
                  <tr key={item.mechanic} className="border-b border-slate-800 hover:bg-slate-800">
                    <td className="px-4 py-4 font-medium">{item.mechanic}</td>
                    <td className="px-4 py-4">{item.completed}</td>
                    <td className="px-4 py-4">{item.rating.toFixed(1)}</td>
                    <td className="px-4 py-4">
                      <Badge variant="secondary">Stabil</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
