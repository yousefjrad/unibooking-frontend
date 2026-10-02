import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Api } from '../api'
import { errMsg, fmt } from '../lib/format'

export default function BookingsPage() {
  const { t, i18n } = useTranslation(); const qc = useQueryClient()
  const q = useQuery({ queryKey: ['mine'], queryFn: Api.myBookings })
  
  const c = useMutation({ mutationFn: (id: string) => Api.cancel(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['mine'] }) })
  return (<div className="space-y-4">
    <h1 className="text-2xl font-extrabold text-pine">{t('mine')}</h1>
    {q.isError && <p role="alert" className="text-red-700">{errMsg(q.error, t('error'))}</p>}
    {c.isError && <p role="alert" className="text-red-700">{errMsg(c.error, t('error'))}</p>}
    {q.data?.length === 0 && <p className="rounded-xl bg-white p-6 text-center">{t('emptyBk')}</p>}
    <ul className="divide-y divide-pine/10 rounded-xl bg-white">{q.data?.map(b => { const s = fmt(b.startTime, i18n.language), e = fmt(b.endTime, i18n.language)
      return (<li key={b.id} className="flex flex-wrap items-center gap-3 p-4"><div className="flex-1">
        <b>{b.resourceName}</b><p className="text-sm">{s.greg} ← {e.greg}</p>
        <p className="text-sm text-ink/70">{t('hijri')}: {s.hijri} | {t('status')}: {t('st_' + b.status)}{b.notes ? ` | ${b.notes}` : ''}</p></div>
        {b.status !== 'Cancelled' && <button className="btn2 text-red-700" disabled={c.isPending} onClick={() => c.mutate(b.id)}>{t('cancelBooking')}</button>}</li>) })}</ul></div>)
}
