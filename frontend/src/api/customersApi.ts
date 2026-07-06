import type { Customer } from '../types/Customer';

// תחליף PORT בפורט האמיתי של ה-Backend
// const BASE_URL = 'https://localhost:PORT/api/customers';

const BASE_URL = 'http://localhost:5136/api/customers';


export async function getCustomers(): Promise<Customer[]> {
   const res = await fetch(BASE_URL);
   return res.json();
}

export async function createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
   const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
   });
   return res.json();
}

export async function updateCustomer(customer: Customer): Promise<void> {
   await fetch(`${BASE_URL}/${customer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
   });
}

export async function deleteCustomer(id: number): Promise<void> {
   await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
}
