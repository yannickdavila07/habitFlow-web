import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthShell } from '../components/AuthShell'
import { Button, ErrorNote, Field } from '../components/ui'
import { useAuth } from '../auth/AuthContext'

const schema = z.object({ email: z.email('E-mail inválido'), senha: z.string().min(1, 'Informe a senha') })
type V = z.infer<typeof schema>

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation() as { state?: { from?: { pathname: string } } }
  const [error, setError] = useState<string>()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(schema) })

  const submit = async (v: V) => {
    setError(undefined)
    try {
      await login(v.email, v.senha)
      nav(loc.state?.from?.pathname ?? '/painel', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao entrar')
    }
  }

  return (
    <AuthShell title="Bem-vindo de volta" subtitle="Entre para continuar seus hábitos."
      footer={<>Novo por aqui? <Link to="/cadastro" className="font-semibold text-teal hover:underline">Criar conta</Link></>}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
        <Field label="E-mail" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Field label="Senha" type="password" autoComplete="current-password" error={errors.senha?.message} {...register('senha')} />
        <ErrorNote>{error}</ErrorNote>
        <Button type="submit" loading={isSubmitting} className="w-full">Entrar</Button>
      </form>
    </AuthShell>
  )
}
