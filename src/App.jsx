import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useApp } from './context/AppContext'
import { SidebarShell } from './components/Shell'
import StoreLayout from './components/StoreLayout'
import { Toast } from './components/ui'

// auth/
import { Login, Register } from './auth/Login'
import { NewPassword, Recover, Verify } from './auth/Recover'

// user/
import Landing from './user/Landing'
import Shop from './user/Shop'
import { Cart, Checkout, Success } from './user/Purchase'
import { Dashboard, OrderDetail, Orders } from './user/account/Orders'
import { Addresses, Analytics, Profile, Wishlist } from './user/account/Profile'

// admin/
import { AdminPanel, AdminProducts } from './admin/AdminPanel'
import { AdminCustomers, AdminOrders, AdminReports } from './admin/AdminOrders'

function Guard({ roles }) {
  const { user } = useApp()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!roles.includes(user.role)) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />
  return <Outlet />
}

// Sube al inicio en cada cambio de ruta
function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { user } = useApp()
  return (
    <>
      <ScrollTop />
      <Routes>
        {/* Acceso */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar" element={<Recover />} />
        <Route path="/verificar" element={<Verify />} />
        <Route path="/nueva-contrasena" element={<NewPassword />} />
        <Route path="/inicio" element={<Navigate to="/" replace />} />

        {/* Tienda: header + footer compartidos */}
        <Route element={<StoreLayout />}>
          {/* Página de inicio pública (antes del login) */}
          <Route path="/" element={<Landing />} />
          <Route element={<Guard roles={['user', 'admin']} />}>
            <Route path="/tienda" element={<Shop />} />
          </Route>
          <Route element={<Guard roles={['user']} />}>
            <Route path="/carrito" element={<Cart />} />
            <Route path="/pagar" element={<Checkout />} />
            <Route path="/exito" element={<Success />} />
          </Route>
        </Route>

        {/* Usuario */}
        <Route element={<Guard roles={['user']} />}>
          <Route path="/cuenta" element={<SidebarShell />}>
            <Route index element={<Dashboard />} />
            <Route path="pedidos" element={<Orders />} />
            <Route path="pedidos/:id" element={<OrderDetail />} />
            <Route path="deseos" element={<Wishlist />} />
            <Route path="direcciones" element={<Addresses />} />
            <Route path="analitica" element={<Analytics />} />
            <Route path="perfil" element={<Profile />} />
          </Route>
        </Route>

        {/* Administrador */}
        <Route element={<Guard roles={['admin']} />}>
          <Route path="/admin" element={<SidebarShell admin />}>
            <Route index element={<AdminPanel />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="pedidos" element={<AdminOrders />} />
            <Route path="clientes" element={<AdminCustomers />} />
            <Route path="reportes" element={<AdminReports />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  )
}
