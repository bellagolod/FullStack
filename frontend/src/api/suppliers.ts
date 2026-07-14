import { request } from './http'
import type { Supplier, SupplierInput } from '../types/supplier'

export const suppliersApi = {
  getAll: () => request<Supplier[]>('/suppliers'),

  getById: (id: number) => request<Supplier>(`/suppliers/${id}`),

  create: (data: SupplierInput) =>
    request<Supplier>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: SupplierInput) =>
    request<Supplier>(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (id: number) =>
    request<void>(`/suppliers/${id}`, {
      method: 'DELETE',
    }),
}
