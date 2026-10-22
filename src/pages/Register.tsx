import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthShell } from '../components/AuthShell'
import { Button, ErrorNote, Field } from '../components/ui'
import { api } from '../lib/api'

const schema = z.object({
  nomeCompleto: z.string().trim().min(1, 'Informe seu nome'),
  nomeUsuario: z.string().trim().min(3, 'Mínimo 3 caracteres'),
  email: z.email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
})
type V = z.infer<typeof schema>

export default function Register() {
  const nav = useNavigate()
  const [error, setError] = useState<string>()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(schema) })

  const submit = async (v: V) => {
    setError(undefined)
    try {
      await api('/login/create', { method: 'POST', body: v, auth: false })
      nav(`/verificar?email=${encodeURIComponent(v.email)}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao cadastrar')
    }
  }

  return (
    <AuthShell title="Crie sua conta" subtitle="Enviaremos um código de verificação ao seu e-mail."
      footer={<>Já tem conta? <Link to="/entrar" className="font-semibold text-teal hover:underline">Entrar</Link></>}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
        <Field label="Nome completo" autoComplete="name" error={errors.nomeCompleto?.message} {...register('nomeCompleto')} />
        <Field label="Usuário" autoComplete="username" error={errors.nomeUsuario?.message} {...register('nomeUsuario')} />
        <Field label="E-mail" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Field label="Senha" type="password" autoComplete="new-password" error={errors.senha?.message} {...register('senha')} />
        <ErrorNote>{error}</ErrorNote>
        <Button type="submit" loading={isSubmitting} className="w-full">Criar conta</Button>
      </form>
    </AuthShell>
  )
}
