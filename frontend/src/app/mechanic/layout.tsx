import type { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Mekanik AutoServis',
  description: 'Portal mekanik mobile-first untuk tugas servis dan permintaan suku cadang.',
}

export default function MechanicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Mekanik</p>
            <h1 className="text-xl font-semibold">AutoServis Mobile</h1>
          </div>
          <Button variant="ghost">
            <span className="text-sm">Notifikasi</span>
          </Button>
        </div>
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-3xl flex-col px-4 py-6 sm:px-6">{children}</main>
      <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95 px-4 py-3 sm:hidden">
        <div className="flex items-center justify-between">
          <Link href="/mekanik" className="text-sm text-slate-200">Tugas</Link>
          <Link href="/mekanik/job/1" className="text-sm text-slate-200">Detail</Link>
          <Link href="/mekanik" className="text-sm text-slate-200">Permintaan</Link>
        </div>
      </footer>
    </div>
  )
}
