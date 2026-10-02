import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Api } from '../api'
import { useAuth } from '../auth'
import { errMsg } from '../lib/format'

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { t } = useTranslation(); const { setUser } = useAuth(); const reg = mode === 'register'
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', password: '', tenantId: '' })
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const tenants = useQuery({ queryKey: ['tenants'], queryFn: Api.tenants, enabled: reg })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value })
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('')
    try { setUser(reg ? await Api.register(f) : await Api.login({ email: f.email, password: f.password })) }
    catch (x) { setErr(errMsg(x, t('error'))) } finally { setBusy(false) }
  }
  return (<form onSubmit={submit} className="mx-auto mt-8 max-w-sm space-y-3 rounded-xl bg-white p-6 shadow-sm">
    <h1 className="text-2xl font-extrabold text-pine">{t(mode)}</h1>
    {reg && <><label className="block">{t('first')}<input className="inp" required maxLength={100} value={f.firstName} onChange={set('firstName')} /></label>
      <label className="block">{t('last')}<input className="inp" required maxLength={100} value={f.lastName} onChange={set('lastName')} /></label>
      <label className="block">{t('tenant')}<select className="inp" required value={f.tenantId} onChange={set('tenantId')}>
        <option value="">{t('choose')}</option>{tenants.data?.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      {tenants.isError && <p role="alert" className="text-sm text-red-700">{t('error')}</p>}</>}
    <label className="block">{t('email')}<input className="inp" type="email" dir="ltr" required value={f.email} onChange={set('email')} /></label>
    <label className="block">{t('password')}<input className="inp" type="password" dir="ltr" required minLength={reg ? 8 : undefined} value={f.password} onChange={set('password')} /></label>
    {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
    <button className="btn w-full" disabled={busy}>{t(mode)}</button>
    <p className="text-sm">{t(reg ? 'hasAcc' : 'noAcc')} <Link className="font-semibold text-pine underline" to={reg ? '/login' : '/register'}>{t(reg ? 'login' : 'register')}</Link></p>
  </form>)
}
