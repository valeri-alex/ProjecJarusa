import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

/* Estructura fija: header arriba, contenido flexible, footer siempre abajo */
export default function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  )
}
