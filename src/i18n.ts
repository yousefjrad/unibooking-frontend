import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
const ar = { app: 'يوني بوكينج', resources: 'القاعات', mine: 'حجوزاتي', login: 'تسجيل الدخول', register: 'إنشاء حساب', logout: 'خروج',
  email: 'البريد الإلكتروني', password: 'كلمة المرور', first: 'الاسم الأول', last: 'اسم العائلة', tenant: 'الجامعة', choose: 'اختر…',
  noAcc: 'ليس لديك حساب؟', hasAcc: 'لديك حساب؟', capacity: 'السعة', location: 'الموقع', name: 'الاسم', desc: 'الوصف', active: 'مفعّلة',
  minCap: 'الحد الأدنى للسعة', onlyAvail: 'المتاحة فقط', book: 'احجز', start: 'البداية', end: 'النهاية', notes: 'ملاحظات', confirm: 'تأكيد الحجز',
  cancel: 'إلغاء', cancelBooking: 'إلغاء الحجز', close: 'إغلاق', add: 'إضافة قاعة', edit: 'تعديل', del: 'تعطيل', save: 'حفظ التغييرات',
  weekend: 'التاريخ المختار يقع في عطلة نهاية الأسبوع. تأكد من توفر القاعة.', badRange: 'وقت النهاية يجب أن يكون بعد البداية.',
  emptyRes: 'لا توجد قاعات مطابقة. غيّر الفلاتر أو أضف قاعة جديدة.', emptyBk: 'لا توجد حجوزات بعد. اختر قاعة من صفحة القاعات.',
  error: 'حدث خطأ. حاول مرة أخرى.', confirmDel: 'تعطيل هذه القاعة؟ لن يمكن حجزها بعد ذلك.', hijri: 'هجري', status: 'الحالة', admin: 'مشرف' }
const en = { app: 'UniBooking', resources: 'Rooms', mine: 'My bookings', login: 'Log in', register: 'Create account', logout: 'Log out',
  email: 'Email', password: 'Password', first: 'First name', last: 'Last name', tenant: 'University', choose: 'Select…',
  noAcc: "Don't have an account?", hasAcc: 'Already have an account?', capacity: 'Capacity', location: 'Location', name: 'Name', desc: 'Description', active: 'Active',
  minCap: 'Minimum capacity', onlyAvail: 'Available only', book: 'Book', start: 'Start', end: 'End', notes: 'Notes', confirm: 'Confirm booking',
  cancel: 'Cancel', cancelBooking: 'Cancel booking', close: 'Close', add: 'Add room', edit: 'Edit', del: 'Deactivate', save: 'Save changes',
  weekend: 'The selected date falls on the weekend. Check the room is open.', badRange: 'End time must be after start time.',
  emptyRes: 'No matching rooms. Change the filters or add a room.', emptyBk: 'No bookings yet. Pick a room from the Rooms page.',
  error: 'Something went wrong. Try again.', confirmDel: 'Deactivate this room? It can no longer be booked.', hijri: 'Hijri', status: 'Status', admin: 'Admin' }
Object.assign(ar, { st_Pending: 'قيد الانتظار', st_Confirmed: 'مؤكد', st_Cancelled: 'ملغى', e401: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  e403: 'لا تملك صلاحية لهذا الإجراء.', e404: 'العنصر المطلوب غير موجود.', e409: 'يوجد تعارض: القاعة محجوزة في هذا الوقت، أو البريد مسجّل مسبقًا.' })
Object.assign(en, { st_Pending: 'Pending', st_Confirmed: 'Confirmed', st_Cancelled: 'Cancelled', e401: 'Email or password is incorrect.',
  e403: 'You do not have permission for this action.', e404: 'The requested item was not found.', e409: 'Conflict: the room is booked at this time, or the email is already registered.' })
const lng = localStorage.getItem('lng') || 'ar'
i18n.use(initReactI18next).init({ resources: { ar: { translation: ar }, en: { translation: en } }, lng, fallbackLng: 'ar', interpolation: { escapeValue: false } })
export const applyDir = (l: string) => { document.documentElement.lang = l; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'; localStorage.setItem('lng', l) }
applyDir(lng)
export default i18n
