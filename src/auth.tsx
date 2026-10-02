import { createContext, useContext, useState, ReactNode } from 'react'
import type { Auth } from './api'
const Ctx = createContext<{ user: Auth | null; setUser: (a: Auth | null) => void }>({ user: null, setUser: () => {} })
export const useAuth = () => useContext(Ctx)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, set] = useState<Auth | null>(() => { const a = localStorage.getItem('auth'); return a ? JSON.parse(a) : null })
  const setUser = (a: Auth | null) => { a ? localStorage.setItem('auth', JSON.stringify(a)) : localStorage.removeItem('auth'); set(a) }
  return <Ctx.Provider value={{ user, setUser }}>{children}</Ctx.Provider>
}
