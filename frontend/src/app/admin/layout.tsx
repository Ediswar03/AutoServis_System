import type { ReactNode } from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Admin AutoServis',
  description: 'Admin portal untuk pendaftaran pelanggan dan kasir.',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Admin / Kasir</p>
            <h1 className="text-2xl font-bold">AutoServis System</h1>
          </div>
          <nav className="flex items-center gap-3 text-sm text-slate-600">
            <Link href="/admin" className="rounded-md px-3 py-2 hover:bg-slate-100">Beranda</Link>
            <Link href="/admin/pendaftaran" className="rounded-md px-3 py-2 hover:bg-slate-100">Pendaftaran</Link>
            <Link href="/admin/kasir" className="rounded-md px-3 py-2 hover:bg-slate-100">Kasir</Link>
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</main>
    </div>
  )
}
