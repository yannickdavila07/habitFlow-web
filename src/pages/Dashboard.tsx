import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LogOut, Plus } from 'lucide-react'
import { Background, Button, ErrorNote, Logo } from '../components/ui'
import { HabitCard } from '../components/HabitCard'
import { HabitFormModal } from '../components/HabitFormModal'
import { Counter } from '../components/Counter'
import { useAuth } from '../auth/AuthContext'
import {
  FREQ_LABEL, useCreateHabit, useDeleteHabit, useHabits, useToggleHabit, useUpdateHabit,
  type Frequency, type Habit,
} from '../features/habits/habits'

const chip = (on: boolean) =>
  `relative rounded-full px-4 py-1.5 text-sm font-medium transition ${on ? 'text-navy' : 'text-cream/70 hover:text-cream ring-1 ring-white/15'}`

export default function Dashboard() {
  const { logout } = useAuth()
  const [freq, setFreq] = useState<Frequency | ''>('')
  const [active, setActive] = useState<'' | 'true' | 'false'>('')
  const [editing, setEditing] = useState<Habit | null>(null)
  const [open, setOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Habit | null>(null)

  const { data, isLoading, error } = useHabits(freq, active)
  const all = useHabits('', '').data
  const create = useCreateHabit(), update = useUpdateHabit(), del = useDeleteHabit(), toggle = useToggleHabit()

  const stats = useMemo(() => {
    const list = all ?? []
    return [
      { label: 'Hábitos', value: list.length },
      { label: 'Ativos', value: list.filter((h) => h.active).length },
      { label: 'Diários', value: list.filter((h) => h.frequency === 'DAILY').length },
    ]
  }, [all])

  const close = () => { setOpen(false); setEditing(null); create.reset(); update.reset() }
  const mut = editing ? update : create

  return (
    <div className="min-h-screen">
      <Background />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <button onClick={logout} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-cream/70 transition hover:bg-white/10 hover:text-cream">
          <LogOut size={16} /> Sair
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold sm:text-5xl">Seus <span className="text-gold">hábitos</span></h1>
            <p className="mt-1 text-cream/60">Pequenas ações, grande constância.</p>
          </div>
          <Button onClick={() => setOpen(true)}><Plus size={18} /> Novo hábito</Button>
        </motion.div>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-5">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10 backdrop-blur-xl sm:p-6">
              <div className="font-display text-3xl font-bold text-teal sm:text-5xl"><Counter value={s.value} /></div>
              <div className="mt-1 text-xs text-cream/60 sm:text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {([['', 'Todos'], ...Object.entries(FREQ_LABEL)] as [Frequency | '', string][]).map(([k, label]) => (
            <button key={k} onClick={() => setFreq(k)} className={chip(freq === k)}>
              {freq === k && <motion.span layoutId="freq-pill" className="absolute inset-0 rounded-full bg-teal" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className="relative">{label}</span>
            </button>
          ))}
          <span className="mx-2 h-5 w-px bg-white/15" />
          {([['', 'Qualquer'], ['true', 'Ativos'], ['false', 'Pausados']] as const).map(([k, label]) => (
            <button key={k} onClick={() => setActive(k)} className={chip(active === k)}>
              {active === k && <motion.span layoutId="active-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {error && <ErrorNote>{error.message}</ErrorNote>}
          {isLoading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="animate-shimmer h-44 rounded-3xl bg-[linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.12),rgba(255,255,255,.04))] bg-[length:200%_100%]" />
              ))}
            </div>
          )}
          {data && data.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-dashed border-slate p-14 text-center">
              <p className="font-display text-2xl">Nada por aqui ainda</p>
              <p className="mt-1 mb-5 text-cream/60">Crie seu primeiro hábito e comece o fluxo.</p>
              <Button onClick={() => setOpen(true)}><Plus size={18} /> Criar hábito</Button>
            </motion.div>
          )}
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {data?.map((h) => (
                <HabitCard key={h.id} habit={h}
                  onToggle={() => toggle.mutate({ id: h.id, active: h.active })}
                  onEdit={() => { setEditing(h); setOpen(true) }}
                  onDelete={() => setToDelete(h)} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {open && (
          <HabitFormModal key={editing?.id ?? 'new'} habit={editing} onClose={close} pending={mut.isPending} error={mut.error?.message}
            onSubmit={(v) => editing
              ? update.mutate({ ...v, id: editing.id }, { onSuccess: close })
              : create.mutate(v, { onSuccess: close })} />
        )}
        {toDelete && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-navy/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div role="alertdialog" aria-label="Confirmar exclusão"
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-slate/40 p-7 ring-1 ring-white/15 backdrop-blur-2xl">
              <h2 className="font-display text-2xl font-bold">Excluir hábito?</h2>
              <p className="mt-2 text-sm text-cream/70">“{toDelete.name}” será removido permanentemente.</p>
              {del.error && <div className="mt-3"><ErrorNote>{del.error.message}</ErrorNote></div>}
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => { setToDelete(null); del.reset() }}>Cancelar</Button>
                <Button variant="danger" loading={del.isPending}
                  onClick={() => del.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })}>Excluir</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
