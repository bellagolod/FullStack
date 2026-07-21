import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import './ProductsPage.css'
import type { Product } from '../types/Product'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/productsApi'

function ProductsPage() {
  const queryClient = useQueryClient()
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })


  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [price, setPrice] = useState('')
  const [inStock, setInStock] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editInStock, setEditInStock] = useState(false)

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Failed to load products</p>


  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await createProduct({ name, color, price: Number(price), inStock })
    setName('')
    setColor('')
    setPrice('')
    setInStock(false)
    queryClient.invalidateQueries({ queryKey: ['products'] })

  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this product?')) return
    await deleteProduct(id)
    queryClient.invalidateQueries({ queryKey: ['products'] })

  }

  function startEdit(p: Product) {
    updateMutation.reset()
    setEditingId(p.id)
    setEditName(p.name)
    setEditColor(p.color ?? '')
    setEditPrice(String(p.price))
    setEditInStock(p.inStock)
  }

  function cancelEdit() {
    updateMutation.reset()
    setEditingId(null)
  }

  function handleSaveEdit(id: number) {
  updateMutation.mutate(
    { id, name: editName, color: editColor, price: Number(editPrice), inStock: editInStock },
    { onSuccess: () => setEditingId(null) }             
  )
}
  

  return (
    <div className="products-page">
      <h1>Products</h1>

      <form className="products-form" onSubmit={handleAdd}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Color" value={color} onChange={e => setColor(e.target.value)} />
        <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        <label className="checkbox-label">
          In stock
          <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
        </label>
        <button type="submit" className="icon-btn add-btn" aria-label="Add product" title="Add product">
          ADD
        </button>
      </form>

      <table className="products-table">
        <thead>
          <tr><th>Name</th><th>Color</th><th>Price</th><th>In Stock</th><th></th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              {editingId === p.id ? (
                <>
                  <td><input value={editName} onChange={e => setEditName(e.target.value)} /></td>
                  <td><input value={editColor} onChange={e => setEditColor(e.target.value)} /></td>
                  <td><input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} /></td>
                  <td><input type="checkbox" checked={editInStock} onChange={e => setEditInStock(e.target.checked)} /></td>
                  <td className="row-actions">
                    <button
                      onClick={() => handleSaveEdit(p.id)}
                      disabled={updateMutation.isPending}
                      className="icon-btn save-btn"
                      aria-label="Save"
                      title="Save"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                    <button onClick={cancelEdit} className="icon-btn cancel-btn" aria-label="Cancel" title="Cancel">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                    {updateMutation.isError && <span className="save-error">שמירה נכשלה</span>}
                  </td>
                </>
              ) : (
                <>
                  <td>{p.name}</td>
                  <td>{p.color}</td>
                  <td>{p.price}</td>
                  <td>{p.inStock ? 'Yes' : 'No'}</td>
                  <td className="row-actions">
                    <button onClick={() => startEdit(p)} className="icon-btn edit-btn" aria-label="Edit" title="Edit">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="icon-btn delete-btn" aria-label="Delete product" title="Delete product">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      </svg>
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductsPage
