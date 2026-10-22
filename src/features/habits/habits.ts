import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'

export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY'
export type Unit = 'MINUTES' | 'HOURS'

export interface Habit {
  id: number
  name: string
  description: string
  frequency: Frequency
  target: number
  unit: Unit
  active: boolean
}
export interface HabitInput {
  name: string
  description: string
  frequency: Frequency
  target: number
  unit: Unit
}

export const FREQ_LABEL: Record<Frequency, string> = {
  DAILY: 'Diário', WEEKLY: 'Semanal', MONTHLY: 'Mensal', ANNUALLY: 'Anual',
}
export const UNIT_LABEL: Record<Unit, string> = { MINUTES: 'min', HOURS: 'h' }

const KEY = ['habits']

export function useHabits(frequency: Frequency | '', active: '' | 'true' | 'false') {
  return useQuery({
    queryKey: [...KEY, frequency, active],
    queryFn: () => {
      const q = new URLSearchParams()
      if (frequency) q.set('frequency', frequency)
      if (active) q.set('active', active)
      const s = q.toString()
      return api<Habit[]>(`/habitos${s ? `?${s}` : ''}`)
    },
  })
}

function useInvalidating<V>(fn: (v: V) => Promise<unknown>) {
  const qc = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) })
}

export const useCreateHabit = () =>
  useInvalidating((b: HabitInput) => api('/habitos', { method: 'POST', body: b }))
export const useUpdateHabit = () =>
  useInvalidating((b: HabitInput & { id: number }) => api('/habitos', { method: 'PUT', body: b }))
export const useDeleteHabit = () =>
  useInvalidating((id: number) => api(`/habitos/${id}`, { method: 'DELETE' }))

export function useToggleHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      api(`/habitos/${id}/${active ? 'desativar' : 'ativar'}`, { method: 'PATCH' }),
    onMutate: async ({ id, active }) => {
      await qc.cancelQueries({ queryKey: KEY })
      const prev = qc.getQueriesData<Habit[]>({ queryKey: KEY })
      qc.setQueriesData<Habit[]>({ queryKey: KEY }, (old) =>
        old?.map((h) => (h.id === id ? { ...h, active: !active } : h)))
      return { prev }
    },
    onError: (_e, _v, ctx) => ctx?.prev.forEach(([k, d]) => qc.setQueryData(k, d)),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
