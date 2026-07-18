# Documentación Técnica — La Vie Naturelle Ecommerce

## 1. Resumen del Proyecto

La Vie Naturelle es una tienda de ecommerce enfocada en productos naturales y orgánicos de origen botánico. La plataforma permite a los clientes explorar un catálogo de productos, agregarlos al carrito, realizar pedidos mediante coordinación por WhatsApp, y rastrear el estado de sus compras.

**URL de producción:** *(pendiente de despliegue)*  
**Repositorio:** `lavienaturelle-ecommerce`  
**Versión:** 1.0.0  
**Fecha de entrega:** Julio 2026

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| Framework | Next.js | 16 | App Router, SSR/SSG, API Routes |
| UI Library | React | 19 | Componentes interactivos |
| Lenguaje | TypeScript | 5.x | Tipado estático |
| Estilos | Tailwind CSS | 4 | Utility-first CSS |
| Componentes UI | shadcn/ui | New York | Base de componentes (Button, Sheet, Input, etc.) |
| Íconos | lucide-react | — | Íconos consistentes |
| Base de Datos | Supabase (PostgreSQL) | — | DB, Auth, Storage, Realtime |
| Auth Client | @supabase/ssr | 0.10.2 | Cliente SSR para Supabase |
| Carrito | localStorage + React Context | — | Persistencia local del carrito |
| Notificaciones | WhatsApp (wa.me links) | — | Coordinación de pedidos |

---

## 3. Arquitectura de la Aplicación

### 3.1 Estructura de Directorios

```
app/
  page.tsx                    — Home / catálogo
  producto/[id]/page.tsx      — Detalle de producto
  categoria/[id]/page.tsx     — Filtro por categoría
  checkout/page.tsx           — Checkout (4 pasos: info → envío → finalizar → confirmación)
  consulta-pedido/page.tsx    — Rastreo de pedido guest
  login/ | register/          — Autenticación
  account/                    — Dashboard del usuario
  admin/                      — Panel de administración

lib/
  cart-context.tsx            — Estado global del carrito (Context + localStorage)
  whatsapp.ts                 — Generadores de links wa.me
  utils.ts                    — Helpers (formatPrice, slugify, cn)

supabase/
  migrations/                 — SQL de esquema, RLS, triggers, funciones RPC
  types/
    client.ts                 — createBrowserClient
    server.ts                 — createServerClient (cookies)
    database.ts               — Tipos TypeScript de la DB
    products.ts | orders.ts   — Queries server-side

components/
  product-card.tsx            — Card de producto (catálogo)
  product-catalog.tsx         — Grid + filtros + paginación
  product-gallery.tsx         — Galería de imágenes (detalle)
  cart-drawer.tsx             — Drawer del carrito
  admin/                      — Componentes del panel admin
```

### 3.2 Flujo de Datos

```
Usuario → Next.js App Router (Server Component)
  → Server Action → supabase/types/server.ts (createServerClient)
    → Supabase RPC / REST → PostgreSQL

Usuario → Client Component
  → supabase/types/client.ts (createBrowserClient)
    → Supabase REST → PostgreSQL
```

### 3.3 Patrones Clave

- **Server Actions**: Escrituras desde checkout (`app/checkout/actions.ts`) usan el server client con cookies
- **RPC (SECURITY DEFINER)**: `create_order_with_items` y `claim_guest_orders` bypass RLS para operaciones atómicas
- **RLS JWT-optimized**: `is_admin()` y `get_my_role()` leen desde `auth.jwt() -> 'app_metadata' ->> 'role'` en vez de hacer SELECT a `profiles`
- **Sync Role to Auth**: Trigger `tr_sync_role_to_auth` mantiene `profiles.role` sincronizado con `auth.users.raw_app_meta_data`

---

## 4. Base de Datos

### 4.1 Tablas Principales

| Tabla | Propósito | Soft Delete |
|---|---|---|
| `profiles` | Extensión de `auth.users` (nombre, teléfono, rol) | Sí (`deleted_at`) |
| `categories` | Categorías de productos | Sí |
| `products` | Catálogo (precio, stock, estado, descripción) | Sí |
| `product_multimedia` | Imágenes/videos de productos | No |
| `product_reviews` | Reseñas de clientes | Sí |
| `orders` | Pedidos (info del cliente snapshoteada) | Sí |
| `order_items` | Líneas de cada pedido | No |
| `addresses` | Direcciones de envío del usuario | Sí |
| `payment_logs` | Logs de pasarela (placeholder) | No |

### 4.2 Enums

```sql
user_role:          'admin' | 'customer'
product_status:     'draft' | 'published' | 'out_of_stock' | 'archived'
order_status:       'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
payment_status:     'pending' | 'completed' | 'failed' | 'refunded'
```

### 4.3 Funciones RPC (SECURITY DEFINER)

| Función | Propósito |
|---|---|
| `create_order_with_items(JSONB, JSONB)` | Inserta orden + items atómicamente, decrementa stock con `FOR UPDATE`, valida precios desde la DB |
| `claim_guest_orders(email, user_id)` | Vincula órdenes guest al usuario autenticado (verifica `auth.uid()`) |
| `get_order_by_tracking(order_num, doc_num)` | Lookup seguro de orden para guests (bypass RLS) |

### 4.4 Triggers

| Trigger | Evento | Acción |
|---|---|---|
| `on_auth_user_created` | INSERT en `auth.users` | Crea perfil en `public.profiles` |
| `tr_sync_role_to_auth` | INSERT/UPDATE `profiles.role` | Sync a `auth.users.raw_app_meta_data` |
| `tr_auto_sync_stock_status` | UPDATE `products.stock_quantity` | Cambia `status` a `out_of_stock` / `published` |
| `update_timestamp` | UPDATE en cualquier tabla | Actualiza `updated_at` automáticamente |

---

## 5. Variables de Entorno

Archivo requerido: `.env.local` en producción.

```bash
# Obligatorias
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...

# Opcionales
NEXT_PUBLIC_WHATSAPP_BUSINESS_PHONE=573246763231
```

**No debe incluirse en el repo:** `.env.local` está en `.gitignore`.

---

## 6. Guía de Despliegue

### 6.1 Requisitos Previos

- Node.js 20+
- pnpm 9+
- Cuenta Supabase con proyecto configurado

### 6.2 Pasos de Deploy

```bash
# 1. Instalar dependencias
pnpm install

# 2. Ejecutar migraciones en Supabase (en orden numérico)
#    001_initial_db_structure.sql → 011_production_fixes.sql
#    Usar SQL Editor de Supabase Dashboard o CLI

# 3. Configurar variables de entorno
#    Crear .env.local con las credenciales del proyecto Supabase

# 4. Build de producción
pnpm build

# 5. Iniciar
pnpm start
```

### 6.3 Post-Deploy Checklist

- [ ] Verificar que `profiles`, `categories`, `products` tienen datos iniciales
- [ ] Confirmar que RLS policies están activas (`ENABLE ROW LEVEL SECURITY`)
- [ ] Validar que `tr_sync_role_to_auth` sincroniza roles correctamente
- [ ] Probar checkout completo (guest + autenticado)
- [ ] Verificar que WhatsApp links generan mensajes correctos
- [ ] Comprobar que `images.unoptimized: true` está en `next.config.mjs`

---

## 7. Seguridad

### 7.1 Autenticación y Autorización

- **Supabase Auth**: JWT-based, cookies manejadas por `@supabase/ssr`
- **RBAC**: Dos roles (`admin`, `customer`). `is_admin()` lee desde JWT `app_metadata.role`
- **Proxy (`proxy.ts`)**: Protege rutas `/admin` (requiere admin) y `/account` (requiere auth)

### 7.2 Row Level Security (RLS)

Todas las tablas tienen RLS activado. Políticas principales:

- `orders` / `order_items`: INSERT anónimo permitido (para checkout guest). SELECT por `user_id` o `email` del JWT.
- `products` / `categories`: SELECT público (solo `published` / no eliminados). WRITE solo admin.
- `profiles`: SELECT/UPDATE solo propio. Admin puede ver todos.

### 7.3 Validaciones Críticas (Post-Review)

- **Precios**: El RPC `create_order_with_items` lee `products.price` / `sale_price` desde la DB con `FOR UPDATE`. Ignora el precio enviado por el cliente (previene manipulación).
- **Stock**: Validación atómica en el RPC. Si no hay stock suficiente, la transacción falla completa.
- **Guest Orders**: `claim_guest_orders` verifica `auth.uid() == p_user_id` y `p_email == jwt.email` antes de actualizar.
- **Input Validation**: Server Action `createOrderAction` usa Zod para validar email, nombre, dirección, documento, y items del carrito.

---

## 8. Integración WhatsApp

No hay pasarela de pagos integrada (en desarrollo). La coordinación es manual por WhatsApp:

1. Cliente completa checkout → orden se crea con `status: 'pending'`
2. Navegador abre pestaña con `wa.me/<business_phone>?text=<order_details>`
3. Cliente envía el mensaje al negocio
4. Negocio confirma pago y coordina envío manualmente
5. Admin actualiza estado del pedido desde el panel (`shipped`, `delivered`)

---

## 9. Mantenimiento y Troubleshooting

### 9.1 Problemas Comunes

| Síntoma | Causa Probable | Solución |
|---|---|---|
| "Error al procesar el pedido" (stock) | Producto agotado entre validación y compra | Revisar stock en panel admin |
| No se ven productos agotados | RLS bloquea `out_of_stock` | Verificar migration `011_production_fixes.sql` |
| Usuario no puede reclamar órdenes guest | `claim_guest_orders` sin email en JWT | Verificar que `profiles.email` está sincronizado con `auth.users` |
| Imágenes no cargan | `images.unoptimized: true` requiere URLs absolutas | Verificar que `product_multimedia.url` apunta a storage público |
| Panel admin inaccesible | Proxy redirige a login | Confirmar que el usuario tiene `role: 'admin'` en `profiles` y `app_metadata` |

### 9.2 Comandos Útiles

```bash
# Ver logs de build
pnpm build 2>&1 | grep -i error

# Lint
pnpm lint

# Acceso local
pnpm dev        # http://localhost:3000
```

---

## 10. Contacto y Soporte

**Desarrollador:** Salomón Milla  
**Stack:** Next.js, Supabase, Tailwind CSS  
**Entorno de ejecución:** Vercel / Servidor propio con Node.js 20+

---

*Documento generado automáticamente. Última actualización: Julio 2026.*
