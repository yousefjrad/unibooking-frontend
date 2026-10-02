import axios from 'axios'
export type Auth = { token: string; fullName: string; email: string; role: string }
export type Tenant = { id: string; name: string }
export type Resource = { id: string; name: string; description?: string | null; capacity: number; location?: string | null; isActive: boolean }
export type Booking = { id: string; resourceId: string; userFullName: string; resourceName: string; startTime: string; endTime: string; status: string; notes?: string | null }
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7022/api' })
// نتأكد أن الرد مصفوفة، حتى لا تنهار الواجهة إذا رجع HTML أو رد غير متوقع
const list = <T,>(p: Promise<{ data: unknown }>) => p.then(r => { if (!Array.isArray(r.data)) throw new Error('Unexpected API response'); return r.data as T[] })
api.interceptors.request.use(c => {
  const a = localStorage.getItem('auth'); if (a) c.headers.Authorization = `Bearer ${(JSON.parse(a) as Auth).token}`; return c })
api.interceptors.response.use(r => r, e => {
  if (e.response?.status === 401 && !String(e.config?.url).includes('/Auth/')) { localStorage.removeItem('auth'); location.href = '/login' }
  return Promise.reject(e) })
export const Api = {
  login: (b: { email: string; password: string }) => api.post<Auth>('/Auth/login', b).then(r => r.data),
  register: (b: { firstName: string; lastName: string; email: string; password: string; tenantId: string }) => api.post<Auth>('/Auth/register', b).then(r => r.data),
  tenants: () => list<Tenant>(api.get('/Tenants')),
  resources: (minCapacity: number, onlyAvailable: boolean) =>
    list<Resource>(onlyAvailable || minCapacity > 1 ? api.get('/Resources/available', { params: { minCapacity } }) : api.get('/Resources')),
  createResource: (b: object) => api.post('/Resources/Create', b),
  // ملاحظة: الباك اند يستقبل ResourceId من الـ query string (انظر README)
  updateResource: (id: string, b: object) => api.put(`/Resources/${id}/Update`, b, { params: { ResourceId: id } }),
  deleteResource: (id: string) => api.delete(`/Resources/${id}`, { params: { ResourceId: id } }),
  myBookings: () => list<Booking>(api.get('/Booking/mine')),
  book: (b: { resourceId: string; startTime: string; endTime: string; notes?: string }) => api.post('/Booking', b),
  cancel: (id: string) => api.put(`/Booking/${id}/cancel`),
}
