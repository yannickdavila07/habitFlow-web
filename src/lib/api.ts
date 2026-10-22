const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const KEY = 'habitflow.tokens'

export interface Tokens { token: string; refreshToken: string }

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export const tokenStore = {
  get(): Tokens | null {
    try { return JSON.parse(localStorage.getItem(KEY) ?? 'null') } catch { return null }
  },
  set(t: Tokens) { try { localStorage.setItem(KEY, JSON.stringify(t)) } catch { /* ignore */ } },
  clear() { try { localStorage.removeItem(KEY) } catch { /* ignore */ } },
}

let onLogout: () => void = () => {}
export const setLogoutHandler = (fn: () => void) => { onLogout = fn }

let refreshing: Promise<boolean> | null = null

async function refresh(): Promise<boolean> {
  const tokens = tokenStore.get()
  if (!tokens) return false
  refreshing ??= (async () => {
    try {
      const res = await fetch(`${BASE}/login/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      })
      if (!res.ok) return false
      tokenStore.set(await res.json())
      return true
    } catch { return false } finally { setTimeout(() => { refreshing = null }, 0) }
  })()
  return refreshing
}

async function parse(res: Response) {
  const text = await res.text()
  if (!text) return undefined
  try { return JSON.parse(text) } catch { return text }
}

export async function api<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {},
  retry = true,
): Promise<T> {
  const { method = 'GET', body, auth = true } = opts
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const tokens = tokenStore.get()
  if (auth && tokens) headers.Authorization = `Bearer ${tokens.token}`

  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      method, headers, body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor.', 0)
  }

  if (res.status === 401 && auth && retry) {
    if (await refresh()) return api<T>(path, opts, false)
    tokenStore.clear()
    onLogout()
    throw new ApiError('Sessão expirada. Entre novamente.', 401)
  }

  const data = await parse(res)
  if (!res.ok) {
    const msg = typeof data === 'object' && data && 'message' in data
      ? String((data as { message: unknown }).message)
      : typeof data === 'string' && data ? data : 'Algo deu errado. Tente novamente.'
    throw new ApiError(msg, res.status)
  }
  return data as T
}
