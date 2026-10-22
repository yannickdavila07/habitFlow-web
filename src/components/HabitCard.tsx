import { motion } from 'motion/react'
import { Pencil, Trash2 } from 'lucide-react'
import { FREQ_LABEL, UNIT_LABEL, type Habit } from '../features/habits/habits'

export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch" aria-checked={on} aria-label={label} onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? 'bg-teal' : 'bg-slate'}`}
    >
      <motion.span
        layout transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-cream shadow ${on ? 'right-0.5' : 'left-0.5'}`}
      />
    </button>
  )
}

export function HabitCard({ habit, onToggle, onEdit, onDelete }: {
  habit: Habit; onToggle: () => void; onEdit: () => void; onDelete: () => void
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: habit.active ? 1 : 0.6, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="group relative overflow-hidden rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur-xl transition-shadow hover:shadow-[0_20px_50px_-20px_var(--color-teal)] hover:ring-teal/40"
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${habit.active ? 'bg-linear-to-r from-teal to-gold' : 'bg-slate'}`} />
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl leading-tight font-bold">{habit.name}</h3>
        <Toggle on={habit.active} onChange={onToggle} label={habit.active ? 'Desativar hábito' : 'Ativar hábito'} />
      </div>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm text-cream/60">{habit.description || 'Sem descrição'}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="rounded-full bg-gold/15 px-3 py-1 text-gold">{FREQ_LABEL[habit.frequency]}</span>
        <span className="rounded-full bg-teal/15 px-3 py-1 text-teal">Meta: {habit.target} {UNIT_LABEL[habit.unit]}</span>
        <span className="ml-auto flex gap-1 opacity-60 transition group-hover:opacity-100">
          <button aria-label="Editar" onClick={onEdit} className="rounded-lg p-2 hover:bg-white/10"><Pencil size={16} /></button>
          <button aria-label="Excluir" onClick={onDelete} className="rounded-lg p-2 text-red-300 hover:bg-red-400/10"><Trash2 size={16} /></button>
        </span>
      </div>
    </motion.article>
  )
}
