'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', revenue: 5600000 },
  { month: 'Feb', revenue: 7200000 },
  { month: 'Mar', revenue: 6900000 },
  { month: 'Apr', revenue: 8100000 },
  { month: 'May', revenue: 9400000 },
  { month: 'Jun', revenue: 10200000 },
]

export function RevenueChart() {
  return (
    <div className="h-[320px] w-full rounded-3xl border border-slate-700 bg-slate-900/80 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" tickFormatter={(value) => `Rp ${value / 1000000}M`} />
          <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Pendapatan']} />
          <Line type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
