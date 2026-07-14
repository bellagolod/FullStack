import { useState } from 'react'
import './App.css'
import ProductsPage from './pages/ProductsPage'

function App() {
  const [screen, setScreen] = useState('products')

  return (
    <div>
      <label className="screen-selector">
        Screen
        <select className="screen-select" value={screen} onChange={e => setScreen(e.target.value)}>
          <option value="products">Products</option>
          <option value="varieties">Varieties</option>
          <option value="crops">Crops</option>
        </select>
      </label>

      {screen === 'products' && <ProductsPage />}
      {screen === 'varieties' && <p>Under development...</p>}
      {screen === 'crops' && <p>Under development...</p>}
    </div>
  )
}

export default App
