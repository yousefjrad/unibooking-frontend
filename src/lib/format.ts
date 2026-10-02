// عطلة نهاية الأسبوع: 5 = الجمعة، 6 = السبت (عدّلها حسب الدولة)
export const WEEKEND = [5, 6]
// الباك اند يعيد DateTime بدون Z (UTC)، فنضيفها كي لا تنزاح الساعات
const utc = (s: string) => new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : s + 'Z')
export function fmt(iso: string, lng: string) {
  const d = utc(iso), ar = lng === 'ar'
  return {
    greg: new Intl.DateTimeFormat(ar ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(d),
    hijri: new Intl.DateTimeFormat(ar ? 'ar-SA-u-ca-islamic-umalqura-nu-latn' : 'en-u-ca-islamic-umalqura', { dateStyle: 'medium' }).format(d),
  }
}
import i18n from '../i18n'
export const errMsg = (e: any, fb: string) => {
  const s = e?.response?.status, d = e?.response?.data
  if ([401, 403, 404, 409].includes(s)) return i18n.t('e' + s)
  // التحقق (FluentValidation) يعيد مصفوفة نصوص، والاستثناءات تعيد ProblemDetails
  if (Array.isArray(d) && d.length) return d.join(' | ')
  return (typeof d === 'string' && d) || d?.message || d?.detail || d?.errors?.[0]?.errorMessage || d?.title || fb
}
