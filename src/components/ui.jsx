import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Eye, EyeOff, ImagePlus, X, Check, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

export const Logo = ({ className = 'text-3xl', to }) => {
  const el = <span className={`block font-logo font-normal leading-none tracking-wide ${className}`}>Jarusa</span>
  return to ? <Link to={to} aria-label="Jarusa, inicio" className="flex items-center justify-center leading-none">{el}</Link> : el
}

export const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export const Avatar = ({ name, photo, size = 'h-8 w-8', text = 'text-[11px]', ring }) => (
  <span className={`inline-flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full ${ring?.includes('bg-white') ? '' : 'bg-brand'} font-bold text-white ${text} ${ring || ''}`}>
    {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : initials(name)}
  </span>
)

const BADGE = {
  Entregado: 'bg-emerald-50 text-emerald-700',
  'En camino': 'bg-sky-50 text-sky-700',
  Pendiente: 'bg-amber-50 text-amber-700',
  Cancelado: 'bg-rose-50 text-rose-700',
  Activo: 'bg-emerald-50 text-emerald-700',
  'Stock bajo': 'bg-amber-50 text-amber-700',
  Agotado: 'bg-rose-50 text-rose-700',
}
export const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${BADGE[children] || 'bg-neutral-100 text-neutral-600'} ${className}`}>
    <i className="h-1.5 w-1.5 rounded-full bg-current" />
    {children}
  </span>
)

export function Pagination({ page, pages, onPage, from, to, total, noun = 'pedidos' }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-[11px] text-neutral-500">
      <span>Mostrando {total === 0 ? 0 : from}–{to} de {total} {noun}</span>
      <div className="flex items-center gap-1.5">
        <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="grid h-7 w-7 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100 disabled:opacity-30" aria-label="Página anterior"><ChevronLeft size={14} /></button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button key={n} onClick={() => onPage(n)} className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold ${n === page ? 'bg-brand text-white' : 'bg-white text-neutral-600 shadow-sm hover:bg-neutral-100'}`}>{n}</button>
        ))}
        <button disabled={page >= pages} onClick={() => onPage(page + 1)} className="grid h-7 w-7 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100 disabled:opacity-30" aria-label="Página siguiente"><ChevronRight size={14} /></button>
      </div>
    </div>
  )
}

export function usePaged(list, size) {
  const [page, setPage] = useState(1)
  const pages = Math.max(1, Math.ceil(list.length / size))
  const p = Math.min(page, pages)
  const slice = list.slice((p - 1) * size, p * size)
  return { page: p, pages, setPage, slice, from: (p - 1) * size + 1, to: (p - 1) * size + slice.length, total: list.length }
}

export function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-jar-900/40 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`pop max-h-[92vh] w-full ${width} overflow-auto rounded-2xl bg-white shadow-pop`}>
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-neutral-800">{title}</h3>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-full hover:bg-neutral-100" aria-label="Cerrar"><X size={15} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  return (
    <div key={toast.k} className="pop fixed bottom-5 left-1/2 z-[60] -translate-x-1/2" role="status">
      <div className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-white shadow-pop ${toast.type === 'err' ? 'bg-neutral-800' : 'bg-jar-700'}`}>
        {toast.type === 'err' ? <AlertCircle size={14} /> : <Check size={14} />}
        {toast.msg}
      </div>
    </div>
  )
}

export const PasswordInput = ({ value, onChange, placeholder = '••••••••', name, autoComplete }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input name={name} autoComplete={autoComplete} type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} className="input pr-9" />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700" aria-label="Mostrar u ocultar contraseña">
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  )
}

export const Field = ({ label, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="label">{label}</span>
    {children}
  </label>
)

// Imagen de producto, o espacio vacío listo para recibir una foto
export const ProductImg = ({ src, alt = '', className = '' }) =>
  src ? (
    <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />
  ) : (
    <div className={`grid place-items-center bg-jar-50 text-jar-300 ${className}`}><ImagePlus size={22} /></div>
  )

export const Check16 = ({ on, onChange, label }) => (
  <button type="button" role="checkbox" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${on ? 'border-jar-600 bg-jar-600 text-white' : 'border-neutral-300 bg-white'}`}>
    {on && <Check size={11} strokeWidth={3} />}
  </button>
)

// Lee una imagen del disco y la devuelve como dataURL (reducida) para previsualizar / guardar
export const readImage = (file, max = 600) =>
  new Promise((resolve) => {
    const fr = new FileReader()
    fr.onload = () => {
      const img = new Image()
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height))
        const c = document.createElement('canvas')
        c.width = img.width * k; c.height = img.height * k
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
        resolve(c.toDataURL('image/jpeg', 0.85))
      }
      img.src = fr.result
    }
    fr.readAsDataURL(file)
  })

export function download(filename, text, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }))
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 500)
}
