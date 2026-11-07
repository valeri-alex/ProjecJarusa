import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ACCENTS, CREDENTIALS, LIP_TONES, PRODUCTS_SEED, SHADOW_TONES, buildOrders, calcTotals } from '../data/mock'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

const KEY = 'jarusa-v1'
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
}

export function AppProvider({ children }) {
  const saved = useMemo(load, [])
  const [users, setUsers] = useState(saved?.users || CREDENTIALS)
  const [session, setSession] = useState(saved?.session || null)
  const [products, setProducts] = useState(saved?.products || PRODUCTS_SEED)
  const [orders, setOrders] = useState(saved?.orders || buildOrders())
  const [cart, setCart] = useState(saved?.cart || [])
  const [wishlist, setWishlist] = useState(saved?.wishlist || ['p5', 'p4'])
  const [addresses, setAddresses] = useState(
    saved?.addresses || [{ id: 'a1', label: 'Casa', line: 'Av. Larco 1234, Dpto. 502', district: 'Miraflores', city: 'Lima', zip: '15074', ref: 'Frente al parque Kennedy', main: true }],
  )
  const [prefs, setPrefs] = useState(saved?.prefs || { skin: 'Mixta', lip: LIP_TONES[0], shadow: SHADOW_TONES[0], accent: ACCENTS[0] })
  // Vista accesible
  // Preferencias de accesibilidad por usuario
const [accessibilityByUser, setAccessibilityByUser] = useState(
  saved?.accessibilityByUser || {}
)

const accessibility = accessibilityByUser[session] || {
  palette: 'default',
}

const setPalette = (palette) => {
  if (!session) return

  const validPalettes = ['default', 'colorblind', 'low-vision']
  if (!validPalettes.includes(palette)) return

  setAccessibilityByUser((prev) => ({
    ...prev,
    [session]: { palette },
  }))
}
  const [coupon, setCoupon] = useState(null)
  const [toast, setToast] = useState(null)
  const [reset, setReset] = useState(null)
  const timer = useRef()

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ users, session, products, orders, cart, wishlist, addresses, prefs, accessibilityByUser }))
    } catch { /* almacenamiento lleno o bloqueado: se ignora en el prototipo */ }
  }, [users, session, products, orders, cart, wishlist, addresses, prefs, accessibilityByUser      ])

  // Aplicar vista accesible
  useEffect(() => {
  document.documentElement.dataset.palette = accessibility.palette
}, [accessibility.palette])



  const notify = useCallback((msg, type = 'ok') => {
    setToast({ msg, type, k: Date.now() })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const user = users.find((u) => u.email === session) || null

  



  // ── auth ───────────────────────────────────────────────
  const login = (email, password) => {
    const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password)
    if (u) setSession(u.email)
    return u || null
  }
  const register = ({ name, email, password, phone, photo }) => {
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return { error: 'Ya existe una cuenta con ese correo.' }
    const [first, ...rest] = name.trim().split(' ')
    const u = { email: email.trim(), password, role: 'user', name: name.trim(), first, last: rest.join(' '), phone: phone || '', points: 0, photo }
    setUsers((x) => [...x, u])
    setSession(u.email)
    return { user: u }
  }
  const logout = () => { setSession(null); setCoupon(null) }
  const updateUser = (patch) => setUsers((xs) => xs.map((u) => (u.email === session ? { ...u, ...patch, name: patch.first ? `${patch.first.split(' ')[0]} ${(patch.last || u.last).split(' ')[0]}` : u.name } : u)))

  // recuperar contraseña (demo: el código se muestra en pantalla porque no hay servidor de correo)
  const startReset = (email) => {
    const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase())
    if (!u) return null
    const code = String(Math.floor(100000 + Math.random() * 900000))
    setReset({ email: u.email, code })
    return code
  }
  const finishReset = (password) => {
    setUsers((xs) => xs.map((u) => (u.email === reset?.email ? { ...u, password } : u)))
    setReset(null)
  }

  // ── carrito ────────────────────────────────────────────
  const addToCart = (id, qty = 1) => {
    const p = products.find((x) => x.id === id)
    if (!p) return
    if (p.stock <= 0) return notify('Este producto está agotado', 'err')
    setCart((c) => (c.some((l) => l.id === id) ? c.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + qty, p.stock) } : l)) : [...c, { id, qty }]))
    notify(`${p.name} añadido al carrito`)
  }
  const setQty = (id, qty) => setCart((c) => c.map((l) => (l.id === id ? { ...l, qty: Math.max(1, qty) } : l)))
  const removeFromCart = (id) => setCart((c) => c.filter((l) => l.id !== id))
  const cartLines = cart.map((l) => ({ ...l, product: products.find((p) => p.id === l.id) })).filter((l) => l.product)
  const cartCount = cart.reduce((s, l) => s + l.qty, 0)
  const totals = calcTotals(cart, products, coupon?.pct || 0)
  const applyCoupon = (code) => {
    if (code.trim().toUpperCase() === 'JARUSA10') { setCoupon({ code: 'JARUSA10', pct: 0.1 }); notify('Cupón aplicado: 10% de descuento'); return true }
    notify('Cupón no válido (prueba JARUSA10)', 'err'); return false
  }
  const toggleWish = (id) => {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))
    notify(wishlist.includes(id) ? 'Quitado de tu lista de deseos' : 'Añadido a tu lista de deseos')
  }

  const placeOrder = ({ pay, address }) => {
    const id = Math.max(1008, ...orders.map((o) => o.id)) + 1
    const order = { id, customer: user.name, email: user.email, date: new Date().toISOString(), items: cart.map(({ id, qty }) => ({ id, qty })), ...totals, pay, status: 'Pendiente', address }
    setOrders((o) => [order, ...o])
    setProducts((ps) => ps.map((p) => { const l = cart.find((x) => x.id === p.id); return l ? { ...p, stock: Math.max(0, p.stock - l.qty) } : p }))
    updateUser({ points: (user.points || 0) + Math.round(totals.total) })
    setCart([]); setCoupon(null)
    return order
  }

  // ── admin ──────────────────────────────────────────────
  const saveProduct = (p) => {
    if (p.id) { setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, ...p } : x))); notify('Producto actualizado') }
    else {
      const n = products.length + 1
      setProducts((ps) => [...ps, { ...p, id: 'p' + Date.now(), sku: p.sku || `JR ${String(700 + n).padStart(4, '0')}`, tag: 'novedad' }])
      notify('Producto creado: ya aparece en la tienda')
    }
  }
  const deleteProduct = (id) => { setProducts((ps) => ps.filter((p) => p.id !== id)); setCart((c) => c.filter((l) => l.id !== id)); notify('Producto eliminado') }
  const setOrderStatus = (id, status) => { setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o))); notify(`Pedido ${id >= 1000 ? '#' + id : id} → ${status}`) }

  const resetDemo = () => { try { localStorage.removeItem(KEY) } catch { /* nada */ } window.location.href = '/' }

  const value = {
    users, user, login, register, logout, updateUser, startReset, finishReset, reset, setReset,
    products, saveProduct, deleteProduct, orders, setOrderStatus, placeOrder,
    cart, cartLines, cartCount, totals, coupon, addToCart, setQty, removeFromCart, applyCoupon,
    wishlist, toggleWish, addresses, setAddresses, prefs, setPrefs, toast, notify, resetDemo,
    accessibility,
    setPalette,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
