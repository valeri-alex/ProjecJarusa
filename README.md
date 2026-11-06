# Jarusa · Prototipo interactivo (React + Tailwind + Vite)

## Cómo correrlo
```bash
npm install
npm run dev        # abre http://localhost:5173
```

## Credenciales
| Rol | Correo | Contraseña | Entra a |
|---|---|---|---|
| Usuario | user@hola.com | user12345 | Pantalla principal → Tienda / Mi cuenta |
| Admin | admin@hola.com | admin12345 | Panel de administración |

También puedes crear cuentas nuevas en **Registro** y recuperar contraseña (el código de 6 dígitos se muestra en pantalla porque no hay servidor de correo). Cupón de prueba: `JARUSA10`.

## Estructura
```
src/
├─ auth/        Login, Registro, Recuperar, Verificar código, Nueva contraseña
├─ user/        Landing (pantalla principal), Shop (tienda), Purchase (carrito, pago, éxito)
│  └─ account/  Resumen, Mis pedidos, Detalle, Perfil, Deseos, Direcciones, Analítica
├─ admin/       Panel, Productos, Pedidos, Clientes, Reportes
├─ components/  Shell (headers/sidebar/gráficos), ui (modal, badge, paginación…)
├─ context/     AppContext (sesión, carrito, pedidos, productos) – se guarda en localStorage
└─ data/mock.js Datos de ejemplo y helpers
public/img/     Fotos de producto
```

## Agregar productos nuevos
- **Desde la app:** entra como admin → Productos → NUEVO PRODUCTO (puedes subir foto). Aparece al instante en la tienda.
- **Desde el código:** copia la foto a `public/img/` y añade un objeto en `PRODUCTS_SEED` (`src/data/mock.js`).
- La tienda siempre deja **tarjetas vacías** ("Próximamente") al final del catálogo como espacio reservado.

Si quieres volver a los datos iniciales: botón **Restablecer datos de la demo** en la pantalla de login.
