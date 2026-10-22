import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { Button, ErrorNote, Field } from './ui'
import { FREQ_LABEL, type Habit, type HabitInput } from '../features/habits/habits'

const schema = z.object({
  name: z.string().trim().min(1, 'Informe um nome'),
  description: z.string(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY']),
  target: z.number({ error: 'Informe a meta' }).int().min(1, 'Mínimo 1'),
  unit: z.enum(['MINUTES', 'HOURS']),
})

const select = 'w-full rounded-xl bg-navy/60 px-4 py-3 text-cream ring-1 ring-slate/70 focus:ring-2 focus:ring-teal focus:outline-none'

export function HabitFormModal({ habit, onClose, onSubmit, pending, error }: {
  habit: Habit | null; onClose: () => void; onSubmit: (v: HabitInput) => void; pending: boolean; error?: string
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<HabitInput>({
    resolver: zodResolver(schema),
    defaultValues: habit ?? { name: '', description: '', frequency: 'DAILY', target: 30, unit: 'MINUTES' },
  })

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-navy/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.form
        role="dialog" aria-modal="true" aria-label={habit ? 'Editar hábito' : 'Novo hábito'}
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="w-full max-w-md space-y-4 rounded-3xl bg-slate/40 p-7 ring-1 ring-white/15 backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">{habit ? 'Editar hábito' : 'Novo hábito'}</h2>
          <button type="button" aria-label="Fechar" onClick={onClose} className="rounded-lg p-2 hover:bg-white/10"><X size={18} /></button>
        </div>
        <Field label="Nome" autoFocus placeholder="Ex.: Ler" error={errors.name?.message} {...register('name')} />
        <Field label="Descrição" placeholder="Opcional" {...register('description')} />
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-cream/70 uppercase">Frequência</span>
          <select className={select} {...register('frequency')}>
            {Object.entries(FREQ_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Meta" type="number" min={1} error={errors.target?.message} {...register('target', { valueAsNumber: true })} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium tracking-wide text-cream/70 uppercase">Unidade</span>
            <select className={select} {...register('unit')}>
              <option value="MINUTES">Minutos</option>
              <option value="HOURS">Horas</option>
            </select>
          </label>
        </div>
        <ErrorNote>{error}</ErrorNote>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={pending}>{habit ? 'Salvar' : 'Criar hábito'}</Button>
        </div>
      </motion.form>
    </motion.div>
  )
}
