import { Link, Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { BarChart3, Bell, Sparkles } from 'lucide-react'
import { Background, Logo } from '../components/ui'
import { useAuth } from '../auth/AuthContext'

const fade = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.1 + i * 0.12, type: 'spring' as const, stiffness: 110, damping: 20 },
})

const features = [
  { icon: Sparkles, title: 'Simples', text: 'Crie hábitos com frequência e meta em segundos.' },
  { icon: BarChart3, title: 'Claro', text: 'Veja ativos, metas e frequências num só painel.' },
  { icon: Bell, title: 'Seu ritmo', text: 'Ative ou pause hábitos quando a rotina mudar.' },
]

export default function Landing() {
  const { authenticated } = useAuth()
  if (authenticated) return <Navigate to="/painel" replace />
  return (
    <div className="min-h-screen">
      <Background />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-5 text-sm font-semibold">
          <Link to="/entrar" className="text-cream/80 transition hover:text-teal">Entrar</Link>
          <Link to="/cadastro" className="rounded-xl bg-teal px-4 py-2 text-navy transition hover:shadow-[0_0_24px_-4px_var(--color-teal)]">Criar conta</Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-16 pb-24 text-center">
        <motion.p {...fade(0)} className="mx-auto mb-5 w-fit rounded-full bg-gold/15 px-4 py-1.5 text-xs font-semibold tracking-widest text-gold uppercase">
          Constância sem esforço
        </motion.p>
        <motion.h1 {...fade(1)} className="font-display mx-auto max-w-3xl text-5xl leading-[1.05] font-bold sm:text-7xl">
          Transforme intenção em <span className="bg-linear-to-r from-teal to-gold bg-clip-text text-transparent">fluxo</span>.
        </motion.h1>
        <motion.p {...fade(2)} className="mx-auto mt-6 max-w-xl text-lg text-cream/70">
          O HabitFlow organiza seus hábitos diários, semanais e mensais num painel leve e bonito.
        </motion.p>
        <motion.div {...fade(3)} className="mt-9 flex justify-center gap-4">
          <Link to="/cadastro" className="rounded-xl bg-teal px-7 py-3.5 font-semibold text-navy transition hover:-translate-y-0.5 hover:shadow-[0_0_36px_-4px_var(--color-teal)]">Começar grátis</Link>
          <Link to="/entrar" className="rounded-xl bg-white/5 px-7 py-3.5 font-semibold ring-1 ring-white/15 transition hover:bg-white/10">Já tenho conta</Link>
        </motion.div>

        <div className="mt-24 grid gap-5 text-left sm:grid-cols-3">
          {features.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 120, damping: 20 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white/[0.06] p-7 ring-1 ring-white/10 backdrop-blur-xl"
            >
              <Icon className="mb-4 text-teal" />
              <h3 className="font-display text-xl font-bold">{title}</h3>
              <p className="mt-1 text-sm text-cream/60">{text}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
