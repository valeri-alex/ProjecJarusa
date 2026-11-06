import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Logo } from './ui'

/* Footer único de Jarusa: siempre al final de la página, con newsletter y accesos */
export default function Footer() {
  const { notify, user } = useApp()
  const [mail, setMail] = useState('')
  const subscribe = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(mail)) return notify('Escribe un correo válido', 'err')
    notify('¡Gracias! Te suscribiste a la newsletter')
    setMail('')
  }
  return (
    <footer className="mt-auto bg-brand text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-5 px-6 py-7 md:grid-cols-[1fr_auto_1fr]">
        <div className="text-center md:text-left">
          <Logo className="text-2xl" to="/" />
          <p className="mt-1 text-[10px] text-white/80">La ciencia de la belleza natural</p>
        </div>
        <form onSubmit={subscribe} className="flex w-full items-center justify-center gap-2 md:w-auto">
          <span className="hidden whitespace-nowrap text-xs font-bold lg:block">Suscríbete a nuestra newsletter</span>
          <input value={mail} onChange={(e) => setMail(e.target.value)} placeholder="tucorreo@ejemplo.com" aria-label="Correo para newsletter" className="min-w-0 flex-1 rounded-full px-4 py-2 text-[11px] text-neutral-800 focus:outline-none focus:ring-2 focus:ring-white/60 md:w-56 md:flex-none" />
          <button className="rounded-full bg-neutral-700 px-4 py-2 text-[10px] font-bold hover:bg-neutral-800">SUSCRIBIRME</button>
        </form>
        <nav className="flex items-center justify-center gap-5 text-[11px] font-bold md:justify-end">
          <Link to="/tienda" className="underline-offset-4 hover:underline">Tienda</Link>
          {user
            ? <Link to={user.role === 'admin' ? '/admin' : '/cuenta'} className="underline-offset-4 hover:underline">{user.role === 'admin' ? 'Panel' : 'Mi cuenta'}</Link>
            : <><Link to="/login" className="underline-offset-4 hover:underline">Iniciar sesión</Link><Link to="/registro" className="underline-offset-4 hover:underline">Registrarse</Link></>}
        </nav>
      </div>
      <p className="border-t border-white/20 px-6 py-3 text-center text-[10px] text-white/75">© {new Date().getFullYear()} Jarusa · Cosmética inspirada en la naturaleza</p>
    </footer>
  )
}
