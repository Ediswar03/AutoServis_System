"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wrench, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.status) {
        // Store token in cookie
        document.cookie = `auth-token=${data.data.token}; path=/; max-age=28800` // 8 hours

        // Redirect based on role
        const role = data.data.user.role.toLowerCase()
        switch (role) {
          case 'admin':
            router.push('/admin')
            break
          case 'mekanik':
            router.push('/mechanic')
            break
          case 'gudang':
            router.push('/gudang')
            break
          case 'pimpinan':
            router.push('/pimpinan')
            break
          default:
            router.push('/dashboard')
        }
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert('Terjadi kesalahan saat login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
      
      <div className="w-full max-w-[440px] relative z-10 transition-all duration-500 ease-out animate-in fade-in zoom-in-95">
        <div className="text-center mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-[0_0_40px_rgba(var(--primary),0.3)] mb-6 transform hover:rotate-12 transition-transform duration-300">
            <Wrench className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">
            AutoServis
          </h1>
          <p className="text-muted-foreground text-lg">
            Sistem Pengurusan Bengkel Premium
          </p>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2rem]">
          <CardContent className="pt-8 pb-10 px-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground/80 ml-1">
                  Emel Pengguna
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@autoservis.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-11 bg-background/50 border-border/50 focus:ring-primary/20 focus:border-primary transition-all rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">
                    Kata Laluan
                  </Label>
                  <button type="button" className="text-xs text-primary hover:underline font-medium">
                    Lupa kata laluan?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pl-11 bg-background/50 border-border/50 focus:ring-primary/20 focus:border-primary transition-all rounded-xl"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-[0_10px_20px_-10px_rgba(var(--primary),0.5)] transition-all active:scale-[0.98] group"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                ) : (
                  <>
                    Log Masuk ⚡
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                Belum mempunyai akaun?{" "}
                <button type="button" className="text-primary font-bold hover:underline">
                  Hubungi Admin
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
