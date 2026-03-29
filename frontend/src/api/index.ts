import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

export const getShops = () => api.get('/shops').then((r) => r.data);

export const getShop = (id: number, page = 1, limit = 10) =>
  api.get(`/shops/${id}`, { params: { page, limit } }).then((r) => r.data);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrder = (data: any) =>
  api.post('/orders', data).then((r) => r.data);

export const searchOrders = (params: { email?: string; phone?: string; orderId?: number }) =>
  api.get('/orders/search', { params }).then((r) => r.data);

export const getReorderItems = (orderId: number) =>
  api.get(`/orders/${orderId}/reorder`).then((r) => r.data);

export const getCoupons = () =>
  api.get('/coupons').then((r) => r.data);

export const applyCoupon = (code: string) =>
  api.post('/coupons/apply', { code }).then((r) => r.data);