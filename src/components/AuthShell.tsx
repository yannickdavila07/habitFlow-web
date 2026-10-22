import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Background, Card, Logo } from './ui'

export function AuthShell({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: ReactNode; footer: ReactNode
}) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Background />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="mb-6 block text-center"><Logo /></Link>
        <Card>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-1 mb-6 text-sm text-cream/60">{subtitle}</p>
          {children}
        </Card>
        <p className="mt-5 text-center text-sm text-cream/60">{footer}</p>
      </motion.div>
    </main>
  )
}
