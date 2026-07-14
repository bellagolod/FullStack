// טיפוסי הדומיין של ספק — משקפים את מודל ה-Supplier ב-Backend
export interface Supplier {
  id: number
  name: string
  contactPerson: string | null
  phone: string | null
  isActive: boolean
}

// מה ששולחים ליצירה/עדכון — בלי ה-Id שנוצר בשרת
export type SupplierInput = Omit<Supplier, 'id'>
