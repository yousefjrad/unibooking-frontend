import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from './auth'
import { applyDir } from './i18n'
import { fmt } from './lib/format'
import AuthPage from './pages/AuthPage'
import ResourcesPage from './pages/ResourcesPage'
import BookingsPage from './pages/BookingsPage'

function Shell({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation(); const { user, setUser } = useAuth()
  const d = fmt(new Date().toISOString(), i18n.language)
  const link = ({ isActive }: { isActive: boolean }) => `px-3 py-1 rounded-lg ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
  return (<>
    <header className="bg-pine text-white"><div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
      <b className="text-xl font-extrabold">{t('app')}</b>
      {user && <nav className="flex gap-1"><NavLink to="/" end className={link}>{t('resources')}</NavLink><NavLink to="/mine" className={link}>{t('mine')}</NavLink></nav>}
      <div className="ms-auto flex items-center gap-3 text-sm">
        <span className="hidden text-white/80 sm:inline">{d.greg} · {d.hijri}</span>
        <button className="rounded border border-white/40 px-2 py-0.5" onClick={() => { const l = i18n.language === 'ar' ? 'en' : 'ar'; i18n.changeLanguage(l); applyDir(l) }}>{i18n.language === 'ar' ? 'English' : 'العربية'}</button>
        {user && <><span>{user.fullName}{user.role === 'Admin' ? ` (${t('admin')})` : ''}</span><button onClick={() => setUser(null)} className="underline">{t('logout')}</button></>}
      </div></div></header>
    <main className="mx-auto max-w-5xl px-4 py-6">{children}</main></>)
}
export default function App() {
  const { user } = useAuth()
  const guard = (el: JSX.Element) => (user ? el : <Navigate to="/login" replace />)
  return (<Shell><Routes>
    <Route path="/login" element={user ? <Navigate to="/" /> : <AuthPage mode="login" />} />
    <Route path="/register" element={user ? <Navigate to="/" /> : <AuthPage mode="register" />} />
    <Route path="/" element={guard(<ResourcesPage />)} />
    <Route path="/mine" element={guard(<BookingsPage />)} />
    <Route path="*" element={<Navigate to="/" />} /></Routes></Shell>)
}
