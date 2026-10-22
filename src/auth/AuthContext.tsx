import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { api, setLogoutHandler, tokenStore, ApiError, type Tokens } from '../lib/api'

interface AuthState {
  authenticated: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
}

const Ctx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => !!tokenStore.get())

  const logout = useCallback(() => {
    tokenStore.clear()
    setAuthenticated(false)
  }, [])

  useEffect(() => { setLogoutHandler(logout) }, [logout])

  const login = useCallback(async (email: string, senha: string) => {
    try {
      const t = await api<Tokens>('/login', { method: 'POST', body: { login: email, senha }, auth: false })
      tokenStore.set(t)
      setAuthenticated(true)
    } catch (e) {
      if (e instanceof ApiError && e.status !== 0) throw new ApiError('E-mail ou senha inválidos, ou conta não verificada.', e.status)
      throw e
    }
  }, [])

  const value = useMemo(() => ({ authenticated, login, logout }), [authenticated, login, logout])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth fora do AuthProvider')
  return c
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { authenticated } = useAuth()
  const loc = useLocation()
  return authenticated ? <>{children}</> : <Navigate to="/entrar" state={{ from: loc }} replace />
}
