import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { AuthProvider, ProtectedRoute } from './auth/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyCode from './pages/VerifyCode'
import Dashboard from './pages/Dashboard'

const qc = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } })

function AnimatedRoutes() {
  const loc = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={loc.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
        <Routes location={loc}>
          <Route path="/" element={<Landing />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/verificar" element={<VerifyCode />} />
          <Route path="/painel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
