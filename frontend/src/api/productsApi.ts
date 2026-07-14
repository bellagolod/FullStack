import type { Product } from '../types/Product'

export async function getProducts(): Promise<Product[]> {
  const res = await fetch('/api/products')
  return res.json()
}

export async function createProduct(product: Omit<Product, 'id'>) {
  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
}

export async function updateProduct(product: Product) {
  await fetch(`/api/products/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
}

export async function deleteProduct(id: number) {
  await fetch(`/api/products/${id}`, { method: 'DELETE' })
}
