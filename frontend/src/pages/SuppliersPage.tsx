import { useEffect, useState } from 'react'
import { suppliersApi } from '../api/suppliers'
import type { Supplier, SupplierInput } from '../types/supplier'
import './SuppliersPage.css'

const EMPTY_FORM: SupplierInput = {
  name: '',
  contactPerson: '',
  phone: '',
  isActive: true,
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [form, setForm] = useState<SupplierInput>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setSuppliers(await suppliersApi.getAll())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'טעינת הספקים נכשלה')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('שם ספק הוא שדה חובה')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const payload: SupplierInput = {
        name: form.name.trim(),
        contactPerson: form.contactPerson?.trim() || null,
        phone: form.phone?.trim() || null,
        isActive: form.isActive,
      }

      if (editingId === null) {
        await suppliersApi.create(payload)
      } else {
        await suppliersApi.update(editingId, payload)
      }

      resetForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'השמירה נכשלה')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(supplier: Supplier) {
    setEditingId(supplier.id)
    setForm({
      name: supplier.name,
      contactPerson: supplier.contactPerson ?? '',
      phone: supplier.phone ?? '',
      isActive: supplier.isActive,
    })
    setError(null)
  }

  async function handleDelete(supplier: Supplier) {
    if (!confirm(`למחוק את הספק "${supplier.name}"?`)) return

    setError(null)
    try {
      await suppliersApi.remove(supplier.id)
      if (editingId === supplier.id) resetForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'המחיקה נכשלה')
    }
  }

  return (
    <div className="suppliers" dir="rtl">
      <h1>ספקים</h1>

      <form className="supplier-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">שם *</label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="שם הספק"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="contactPerson">איש קשר</label>
          <input
            id="contactPerson"
            value={form.contactPerson ?? ''}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            placeholder="איש קשר"
          />
        </div>

        <div className="field">
          <label htmlFor="phone">טלפון</label>
          <input
            id="phone"
            value={form.phone ?? ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="טלפון"
          />
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          פעיל
        </label>

        <div className="actions">
          <button type="submit" disabled={saving}>
            {editingId === null ? 'הוסף ספק' : 'עדכן ספק'}
          </button>
          {editingId !== null && (
            <button type="button" className="ghost" onClick={resetForm} disabled={saving}>
              ביטול
            </button>
          )}
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="hint">טוען…</p>
      ) : suppliers.length === 0 ? (
        <p className="hint">אין ספקים עדיין. הוסיפו את הראשון למעלה.</p>
      ) : (
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>איש קשר</th>
              <th>טלפון</th>
              <th>פעיל</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.contactPerson || '—'}</td>
                <td>{s.phone || '—'}</td>
                <td>
                  <span className={s.isActive ? 'badge active' : 'badge inactive'}>
                    {s.isActive ? 'כן' : 'לא'}
                  </span>
                </td>
                <td className="row-actions">
                  <button type="button" className="ghost" onClick={() => startEdit(s)}>
                    עריכה
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(s)}>
                    מחיקה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
