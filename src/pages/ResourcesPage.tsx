import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Api, Resource } from '../api'
import { useAuth } from '../auth'
import { errMsg, WEEKEND } from '../lib/format'

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const { t } = useTranslation()
  return (<div className="fixed inset-0 z-10 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
    <div className="w-full max-w-md space-y-3 rounded-xl bg-white p-5"><div className="flex items-center justify-between">
      <h2 className="text-lg font-extrabold text-pine">{title}</h2><button className="btn2" onClick={onClose}>{t('close')}</button></div>{children}</div></div>)
}
function BookForm({ r, onDone }: { r: Resource; onDone: () => void }) {
  const { t } = useTranslation(); const qc = useQueryClient()
  const [s, setS] = useState(''); const [e, setE] = useState(''); const [n, setN] = useState(''); const [err, setErr] = useState('')
  const bad = !!s && !!e && new Date(e) <= new Date(s); const wk = !!s && WEEKEND.includes(new Date(s).getDay())
  const m = useMutation({ mutationFn: () => Api.book({ resourceId: r.id, startTime: new Date(s).toISOString(), endTime: new Date(e).toISOString(), notes: n || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['mine'] }); onDone() }, onError: x => setErr(errMsg(x, t('error'))) })
  return (<form className="space-y-3" onSubmit={ev => { ev.preventDefault(); if (!bad) m.mutate() }}>
    <p className="text-sm text-ink/70">{r.name}</p>
    <label className="block">{t('start')}<input type="datetime-local" required className="inp" value={s} onChange={x => setS(x.target.value)} /></label>
    <label className="block">{t('end')}<input type="datetime-local" required className="inp" value={e} onChange={x => setE(x.target.value)} /></label>
    <label className="block">{t('notes')}<input className="inp" value={n} onChange={x => setN(x.target.value)} /></label>
    {wk && <p className="text-sm text-gold">{t('weekend')}</p>}{bad && <p className="text-sm text-red-700">{t('badRange')}</p>}
    {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
    <button className="btn w-full" disabled={m.isPending || bad}>{t('confirm')}</button></form>)
}
function ResForm({ r, onDone }: { r?: Resource; onDone: () => void }) {
  const { t } = useTranslation(); const qc = useQueryClient()
  const [f, setF] = useState({ name: r?.name ?? '', description: r?.description ?? '', capacity: r?.capacity ?? 20, location: r?.location ?? '', isActive: r?.isActive ?? true }); const [err, setErr] = useState('')
  const m = useMutation({ mutationFn: () => (r ? Api.updateResource(r.id, f) : Api.createResource({ name: f.name, description: f.description, capacity: f.capacity, location: f.location })),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['resources'] }); onDone() }, onError: x => setErr(errMsg(x, t('error'))) })
  return (<form className="space-y-3" onSubmit={e => { e.preventDefault(); m.mutate() }}>
    <label className="block">{t('name')}<input className="inp" required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></label>
    <label className="block">{t('desc')}<input className="inp" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} /></label>
    <label className="block">{t('capacity')}<input className="inp" type="number" min={1} required value={f.capacity} onChange={e => setF({ ...f, capacity: +e.target.value })} /></label>
    <label className="block">{t('location')}<input className="inp" value={f.location} onChange={e => setF({ ...f, location: e.target.value })} /></label>
    {r && <label className="flex items-center gap-2"><input type="checkbox" checked={f.isActive} onChange={e => setF({ ...f, isActive: e.target.checked })} />{t('active')}</label>}
    {err && <p role="alert" className="text-sm text-red-700">{err}</p>}<button className="btn w-full" disabled={m.isPending}>{t('save')}</button></form>)
}
export default function ResourcesPage() {
  const { t } = useTranslation(); const { user } = useAuth(); const qc = useQueryClient(); const admin = user?.role === 'Admin'
  const [cap, setCap] = useState(1); const [av, setAv] = useState(false)
  const [modal, setModal] = useState<{ k: 'book' | 'edit' | 'new'; r?: Resource } | null>(null)
  const q = useQuery({ queryKey: ['resources', cap, av], queryFn: () => Api.resources(cap, av) })
  const del = useMutation({ mutationFn: (id: string) => Api.deleteResource(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['resources'] }) })
  const close = () => setModal(null)
  return (<div className="space-y-4">
    <div className="flex flex-wrap items-end gap-4">
      <label className="text-sm">{t('minCap')}<input type="number" min={1} className="inp mt-1 w-28" value={cap} onChange={e => setCap(Math.max(1, +e.target.value || 1))} /></label>
      <label className="flex items-center gap-2 pb-2"><input type="checkbox" checked={av} onChange={e => setAv(e.target.checked)} />{t('onlyAvail')}</label>
      {admin && <button className="btn ms-auto" onClick={() => setModal({ k: 'new' })}>{t('add')}</button>}</div>
    {q.isError && <p role="alert" className="text-red-700">{errMsg(q.error, t('error'))}</p>}
    {q.data?.length === 0 && <p className="rounded-xl bg-white p-6 text-center">{t('emptyRes')}</p>}
    <ul className="divide-y divide-pine/10 rounded-xl bg-white">{q.data?.map(r => (
      <li key={r.id} className="flex flex-wrap items-center gap-3 p-4">
        <div className="min-w-0 flex-1"><b>{r.name}</b>{!r.isActive && <span className="ms-2 text-xs text-gold">({t('active')}: ✗)</span>}
          <p className="text-sm text-ink/70">{[r.location, `${t('capacity')}: ${r.capacity}`, r.description].filter(Boolean).join(' | ')}</p></div>
        <button className="btn" disabled={!r.isActive} onClick={() => setModal({ k: 'book', r })}>{t('book')}</button>
        {admin && <><button className="btn2" onClick={() => setModal({ k: 'edit', r })}>{t('edit')}</button>
          <button className="btn2 text-red-700" onClick={() => confirm(t('confirmDel')) && del.mutate(r.id)}>{t('del')}</button></>}</li>))}</ul>
    {modal?.k === 'book' && modal.r && <Modal title={t('book')} onClose={close}><BookForm r={modal.r} onDone={close} /></Modal>}
    {modal?.k === 'edit' && <Modal title={t('edit')} onClose={close}><ResForm r={modal.r} onDone={close} /></Modal>}
    {modal?.k === 'new' && <Modal title={t('add')} onClose={close}><ResForm onDone={close} /></Modal>}</div>)
}
