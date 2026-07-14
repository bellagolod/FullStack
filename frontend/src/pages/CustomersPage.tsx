import { useState, useEffect } from 'react';
import type { Customer } from '../types/Customer';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api/customersApi';

export default function CustomersPage() {
   const [customers, setCustomers] = useState<Customer[]>([]);
   const [form, setForm] = useState({ name: '', city: '', phone: '', isActive: true });
   const [editingId, setEditingId] = useState<number | null>(null);
   const [search, setSearch] = useState('');

   const loadCustomers = async () => setCustomers(await getCustomers());

   const filteredCustomers = customers.filter(c => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      return [c.name, c.city, c.phone, c.isActive ? 'כן' : 'לא']
         .some(field => (field ?? '').toLowerCase().includes(term));
   });

   useEffect(() => { loadCustomers(); }, []);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (editingId === null) {
         await createCustomer(form);
      } else {
         await updateCustomer({ id: editingId, ...form });
      }
      setForm({ name: '', city: '', phone: '', isActive: true });
      setEditingId(null);
      await loadCustomers();
   };

   const handleEdit = (customer: Customer) => {
      setEditingId(customer.id);
      setForm({ name: customer.name, city: customer.city ?? '', phone: customer.phone ?? '', isActive: customer.isActive });
   };

   const handleDelete = async (customer: Customer) => {
      if (!window.confirm(`למחוק את הלקוח "${customer.name}"?`)) return;
      await deleteCustomer(customer.id);
      await loadCustomers();
   };

   return (
      <div className="page">
         <h1>לקוחות</h1>

         <form className="customer-form" onSubmit={handleSubmit}>
            <div className="form-row">
               <input className="input" placeholder="שם" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
               <input className="input" placeholder="עיר" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
               <input className="input" placeholder="טלפון" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
               <label className="checkbox-label">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                  פעיל
               </label>
               <button className="btn btn-primary" type="submit">{editingId === null ? 'הוסף' : 'עדכן'}</button>
            </div>
         </form>

         <input
            className="input search-input"
            placeholder="חיפוש..."
            value={search}
            onChange={e => setSearch(e.target.value)}
         />

         <div className="table-card">
            <table className="customers-table">
               <thead>
                  <tr><th>שם</th><th>עיר</th><th>טלפון</th><th>פעיל</th><th></th></tr>
               </thead>
               <tbody>
                  {filteredCustomers.map(c => (
                     <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{c.city}</td>
                        <td>{c.phone}</td>
                        <td><span className={`status-pill ${c.isActive ? 'active' : 'inactive'}`}>{c.isActive ? 'כן' : 'לא'}</span></td>
                        <td>
                           <div className="actions">
                              <button className="btn btn-sm btn-edit" onClick={() => handleEdit(c)}>ערוך</button>
                              <button className="btn btn-sm btn-delete" onClick={() => handleDelete(c)}>מחק</button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                     <tr>
                        <td colSpan={5} className="empty-state">
                           {customers.length === 0 ? 'לא נמצאו לקוחות' : 'אין תוצאות התואמות לחיפוש'}
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
}
