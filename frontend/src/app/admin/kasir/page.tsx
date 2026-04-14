'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Printer, CheckCircle, XCircle } from 'lucide-react'

interface Invoice {
  no_invoice: string
  no_spk: string
  total_jasa: number
  total_part: number
  grand_total: number
  status_pembayaran: 'BELUM_BAYAR' | 'LUNAS'
  createdAt: string
  spk: {
    kendaraan: {
      pelanggan: {
        nama: string
      }
    }
  }
}

export default function CashierPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoice')
      const data = await response.json()
      if (data.status) {
        setInvoices(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Gagal mengambil data invoice.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentStatus = async (no_invoice: string, status: 'LUNAS' | 'BELUM_BAYAR') => {
    setProcessing(no_invoice)
    try {
      const response = await fetch(`/api/invoice/${no_invoice}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_pembayaran: status }),
      })
      const data = await response.json()
      if (data.status) {
        setInvoices(invoices.map(inv =>
          inv.no_invoice === no_invoice ? { ...inv, status_pembayaran: status } : inv
        ))
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Gagal mengupdate status pembayaran.')
    } finally {
      setProcessing(null)
    }
  }

  const handlePrint = (no_invoice: string) => {
    // Implementasi cetak invoice
    window.print()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LUNAS':
        return <Badge variant="secondary"><CheckCircle className="w-3 h-3 mr-1" />Lunas</Badge>
      case 'BELUM_BAYAR':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Belum Bayar</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kasir & Cetak Faktur</CardTitle>
          <CardDescription>Rekapitulasi SPK untuk membuat invoice dan mencetak nota.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {invoices.length === 0 ? (
            <p className="text-center text-muted-foreground">Belum ada invoice yang dibuat.</p>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
              <table className="w-full min-w-[800px] text-left text-sm text-slate-700">
                <thead className="border-b bg-slate-100 text-slate-900">
                  <tr>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">SPK</th>
                    <th className="px-4 py-3">Pelanggan</th>
                    <th className="px-4 py-3">Total Jasa</th>
                    <th className="px-4 py-3">Total Part</th>
                    <th className="px-4 py-3">Grand Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.no_invoice} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium">{invoice.no_invoice}</td>
                      <td className="px-4 py-4">{invoice.no_spk}</td>
                      <td className="px-4 py-4">{invoice.spk.kendaraan.pelanggan.nama}</td>
                      <td className="px-4 py-4">{formatCurrency(Number(invoice.total_jasa))}</td>
                      <td className="px-4 py-4">{formatCurrency(Number(invoice.total_part))}</td>
                      <td className="px-4 py-4 font-semibold">{formatCurrency(Number(invoice.grand_total))}</td>
                      <td className="px-4 py-4">{getStatusBadge(invoice.status_pembayaran)}</td>
                      <td className="px-4 py-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePrint(invoice.no_invoice)}
                        >
                          <Printer className="w-4 h-4 mr-1" />
                          Cetak
                        </Button>
                        {invoice.status_pembayaran === 'BELUM_BAYAR' ? (
                          <Button
                            size="sm"
                            onClick={() => handlePaymentStatus(invoice.no_invoice, 'LUNAS')}
                            disabled={processing === invoice.no_invoice}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Bayar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handlePaymentStatus(invoice.no_invoice, 'BELUM_BAYAR')}
                            disabled={processing === invoice.no_invoice}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Batal Bayar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
