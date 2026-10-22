import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthShell } from '../components/AuthShell'
import { Button, ErrorNote } from '../components/ui'
import { api } from '../lib/api'

export default function VerifyCode() {
  const [params] = useSearchParams()
  const email = params.get('email')
  const nav = useNavigate()
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState<string>()
  const [info, setInfo] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(30)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  if (!email) return <Navigate to="/cadastro" replace />
  const q = `?email=${encodeURIComponent(email)}`

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, '')
    if (!d) return
    const next = [...digits]
    d.split('').slice(0, 6 - i).forEach((c, k) => { next[i + k] = c })
    setDigits(next)
    refs.current[Math.min(i + d.length, 5)]?.focus()
  }

  const verify = async () => {
    setError(undefined); setInfo(undefined); setLoading(true)
    try {
      await api(`/login/verificar${q}`, { method: 'POST', body: { codigoVerificacao: digits.join('') }, auth: false })
      nav('/entrar', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Código inválido')
    } finally { setLoading(false) }
  }

  const resend = async () => {
    setError(undefined)
    try {
      await api(`/login/reenviarcodigo${q}`, { method: 'POST', auth: false })
      setInfo('Novo código enviado!'); setCooldown(30)
    } catch (e) { setError(e instanceof Error ? e.message : 'Erro ao reenviar') }
  }

  return (
    <AuthShell title="Verifique seu e-mail" subtitle={`Digite o código de 6 dígitos enviado para ${email}.`}
      footer={<Link to="/entrar" className="font-semibold text-teal hover:underline">Voltar para o login</Link>}>
      <div className="space-y-5">
        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i} ref={(el) => { refs.current[i] = el }} value={d} inputMode="numeric" maxLength={6}
              aria-label={`Dígito ${i + 1}`}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace') {
                  const next = [...digits]; next[i] = ''; setDigits(next)
                  if (!d) refs.current[i - 1]?.focus()
                }
              }}
              className="h-14 w-full rounded-xl bg-navy/60 text-center font-display text-2xl text-gold ring-1 ring-slate/70 transition focus:ring-2 focus:ring-teal focus:outline-none"
            />
          ))}
        </div>
        <ErrorNote>{error}</ErrorNote>
        {info && <p className="text-sm text-teal">{info}</p>}
        <Button onClick={verify} loading={loading} disabled={digits.some((d) => !d)} className="w-full">Verificar conta</Button>
        <button onClick={resend} disabled={cooldown > 0} className="w-full text-sm text-cream/60 transition enabled:hover:text-teal disabled:opacity-50">
          {cooldown > 0 ? `Reenviar código em ${cooldown}s` : 'Reenviar código'}
        </button>
      </div>
    </AuthShell>
  )
}
