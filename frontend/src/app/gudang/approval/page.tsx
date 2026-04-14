'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface PermintaanPart {
  id: number
  no_spk: string
  kode_part: string
  qty: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  requested_at: string
  spk: {
    mekanik: {
      nama: string
    }
  }
  sukuCadang: {
    nama_part: string
  }
}

export default function WarehouseApprovalPage() {
  const [requests, setRequests] = useState<PermintaanPart[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState<number | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/gudang/permintaan-part')
      const data = await response.json()
      if (data.status) {
        setRequests(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Gagal mengambil data permintaan part.')
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (id: number, action: 'APPROVE' | 'REJECT') => {
    setProcessing(id)
    try {
      const response = await fetch(`/api/gudang/permintaan-part/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await response.json()
      if (data.status) {
        setRequests(requests.filter(req => req.id !== id))
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Gagal memproses permintaan.')
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'APPROVED':
        return <Badge variant="secondary"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
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
          <CardTitle>Validasi Permintaan Part</CardTitle>
          <CardDescription>Setujui atau tolak pengeluaran suku cadang dari mekanik.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {requests.length === 0 ? (
            <p className="text-center text-muted-foreground">Tidak ada permintaan part yang menunggu approval.</p>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
              <table className="w-full min-w-[640px] text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-slate-900">
                  <tr>
                    <th className="px-4 py-3">SPK</th>
                    <th className="px-4 py-3">Mekanik</th>
                    <th className="px-4 py-3">Suku Cadang</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium">{request.no_spk}</td>
                      <td className="px-4 py-4">{request.spk.mekanik.nama}</td>
                      <td className="px-4 py-4">{request.sukuCadang.nama_part}</td>
                      <td className="px-4 py-4">{request.qty}</td>
                      <td className="px-4 py-4">{getStatusBadge(request.status)}</td>
                      <td className="px-4 py-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproval(request.id, 'APPROVE')}
                          disabled={processing === request.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Setujui
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleApproval(request.id, 'REJECT')}
                          disabled={processing === request.id}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Tolak
                        </Button>
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
