import type { ReactNode } from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Pimpinan AutoServis',
  description: 'Dashboard analitik utama untuk pimpinan bengkel.',
}

export default function ExecutiveLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pimpinan</p>
            <h1 className="text-2xl font-semibold">Executive Analytics</h1>
          </div>
          <nav className="flex items-center gap-3 text-sm text-slate-300">
            <Link href="/pimpinan" className="rounded-md px-3 py-2 hover:bg-slate-800">Dashboard</Link>
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</main>
    </div>
  )
}
