import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <nav className="sidebar">
      <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>Products</NavLink>
      <NavLink to="/customers" className={({ isActive }) => isActive ? 'active' : ''}>Customers</NavLink>
      <NavLink to="/suppliers" className={({ isActive }) => isActive ? 'active' : ''}>Suppliers</NavLink>
    </nav>
  )
}

export default Sidebar
