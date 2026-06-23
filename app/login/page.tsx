'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/admin')
      } else {
        setError(data.message ?? 'Senha incorreta')
      }
    } catch {
      setError('Erro ao conectar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#16191F' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="font-display text-3xl font-semibold tracking-tight"
            style={{ color: '#F2F0EB' }}
          >
            Primeore CRM
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#a8adb8' }}>
            Acesso restrito
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl border p-6 space-y-5"
          style={{
            backgroundColor: '#1e222b',
            borderColor: 'rgba(242, 240, 235, 0.1)',
          }}
        >
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium"
              style={{ color: '#F2F0EB' }}
            >
              Senha de acesso
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              autoComplete="current-password"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs pt-0.5"
                style={{ color: '#ef4444' }}
              >
                {error}
              </motion.p>
            )}
          </div>

          <Button
            className="w-full h-10 text-sm font-semibold"
            style={{ backgroundColor: '#FF6B35', color: '#ffffff' }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
