import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'motion/react'

export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-navy">
      <div className="animate-float absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-teal/25 blur-[120px]" />
      <div className="animate-float absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-slate/60 blur-[120px] [animation-delay:-5s]" />
      <div className="animate-float absolute -bottom-40 left-1/3 h-[26rem] w-[26rem] rounded-full bg-gold/15 blur-[120px] [animation-delay:-9s]" />
    </div>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display text-2xl font-bold tracking-tight ${className}`}>
      Habit<span className="text-teal">Flow</span>
    </span>
  )
}

type BtnProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> & {
  variant?: 'primary' | 'ghost' | 'danger' | 'gold'
  loading?: boolean
}
const variants = {
  primary: 'bg-teal text-navy hover:shadow-[0_0_30px_-4px_var(--color-teal)]',
  gold: 'bg-gold text-navy hover:shadow-[0_0_30px_-4px_var(--color-gold)]',
  ghost: 'bg-white/5 text-cream ring-1 ring-white/15 hover:bg-white/10',
  danger: 'bg-red-400/90 text-navy hover:bg-red-400',
}
export function Button({ variant = 'primary', loading, children, className = '', disabled, ...rest }: BtnProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-shadow disabled:opacity-60 ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </motion.button>
  )
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string }
export const Field = forwardRef<HTMLInputElement, FieldProps>(({ label, error, className = '', ...rest }, ref) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-medium tracking-wide text-cream/70 uppercase">{label}</span>
    <input
      ref={ref}
      className={`w-full rounded-xl bg-navy/60 px-4 py-3 text-cream ring-1 ring-slate/70 transition placeholder:text-cream/30 focus:ring-2 focus:ring-teal focus:outline-none ${className}`}
      {...rest}
    />
    {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
  </label>
))

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-white/[0.06] p-7 ring-1 ring-white/10 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  )
}

export function ErrorNote({ children }: { children?: ReactNode }) {
  if (!children) return null
  return <p role="alert" className="rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-200 ring-1 ring-red-300/30">{children}</p>
}
