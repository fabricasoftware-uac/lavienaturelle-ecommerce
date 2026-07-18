# Manual de Administrador — La Vie Naturelle

## Acceso al Panel de Administración

**URL:** `/admin`  
**Requisito:** Rol `admin` en tu cuenta de Supabase Auth.

### Cómo acceder

1. Inicia sesión con tu cuenta de administrador
2. Navega a `/admin`
3. Si no eres admin, el sistema te redirigirá a la página principal

---

## 1. Dashboard Principal (`/admin`)

Al ingresar verás:
- **Resumen de ventas** (últimos 7 días)
- **Pedidos recientes**
- **Productos con stock bajo**
- **Clientes nuevos**

---

## 2. Gestión de Productos (`/admin/productos`)

### 2.1 Ver Productos

- Lista de todos los productos activos (no eliminados)
- Filtros disponibles:
  - **Búsqueda por nombre**
  - **Filtro por categoría**
  - **Filtro por stock:** Todos, En Stock, Stock Bajo, Agotado
- **Grid toggle:** Vista compacta (5 columnas) o cómoda (4 columnas)
- Scroll infinito: carga más productos al llegar al final

### 2.2 Crear un Producto

1. Haz clic en el botón **"+"** (esquina superior derecha)
2. Completa el formulario:
   - **Nombre** del producto
   - **Categoría** (selecciona existente o crea nueva)
   - **Precio** (en COP)
   - **Stock** (cantidad disponible)
   - **Descripción** (corta y larga)
   - **Detalles:** peso/contenido, origen, ingredientes, beneficios, modo de uso
   - **Etiqueta** (badge): Nuevo, Oferta, Más Vendido, Popular, Orgánico
   - **Imágenes:** sube hasta 2 fotos (máximo 2MB cada una)
3. Haz clic en **"Guardar"**

### 2.3 Crear una Categoría (desde el formulario de producto)

1. En el campo **Categoría**, haz clic en el botón **"+"** al lado del selector
2. Aparece un campo de texto
3. Escribe el nombre de la nueva categoría
4. Haz clic en **✓** para confirmar
5. La categoría se crea automáticamente y se selecciona en el formulario

> **Nota:** El `slug` se genera automáticamente a partir del nombre.

### 2.4 Eliminar una Categoría

1. En el formulario de producto, selecciona una categoría del dropdown
2. Aparecerá un botón de **🗑️** (papelera) rojo al lado del botón "+"
3. Haz clic en la papelera
4. Confirma la eliminación en el diálogo
5. La categoría se elimina (soft delete) y se deselecciona del formulario

> **Advertencia:** Los productos que usaban esa categoría quedarán sin categoría asignada.

### 2.5 Editar un Producto

1. En la lista de productos, haz clic en **"Ver Detalles"** del producto deseado
2. Se abre un panel lateral (Sheet) con toda la información
3. Haz clic en **"Editar"**
4. Modifica los campos necesarios
5. Haz clic en **"Guardar"**

### 2.6 Eliminar un Producto

1. Abre el detalle del producto
2. Haz clic en el ícono de **🗑️** (abajo a la derecha, junto a WhatsApp y Email)
3. Confirma la eliminación en el diálogo
4. El producto se elimina lógicamente (`deleted_at`) — no se borra físicamente de la base de datos

---

## 3. Gestión de Pedidos (`/admin/pedidos`)

### 3.1 Ver Pedidos

- Lista de todas las órdenes
- Filtros disponibles:
  - **Búsqueda:** por ID del pedido o nombre del cliente
  - **Estado:** Todos, Pendiente, Procesando, Pagado, Enviado, Entregado, Cancelado, Reembolsado
- Información visible por pedido:
  - ID del pedido
  - Cliente (nombre + email)
  - Dirección de envío
  - Fecha
  - Estado (badge de color)

### 3.2 Estados de un Pedido

| Estado | Color | Significado |
|---|---|---|
| **Pendiente** | Amarillo | Pedido registrado, aún no pagado/enviado |
| **Procesando** | Naranja | Pago confirmado, preparando envío |
| **Pagado** | Verde | Pago completado (WhatsApp coordinado) |
| **Enviado** | Azul | Pedido en camino, tiene guía de transporte |
| **Entregado** | Verde oscuro | Cliente recibió el pedido |
| **Cancelado** | Rojo | Pedido cancelado |
| **Reembolsado** | Gris | Dinero devuelto al cliente |

### 3.3 Marcar como Enviado

1. Localiza el pedido en la lista
2. Haz clic en el botón **"Enviar"** (aparece solo en pedidos que no estén ya enviados/entregados)
3. Se abre el modal de envío:
   - Selecciona **transportadora** (ej: Servientrega, Interrapidísimo)
   - Ingresa **número de guía**
4. Haz clic en **"Confirmar Envío"**
5. El sistema:
   - Actualiza el estado a "Enviado"
   - Abre automáticamente WhatsApp con un mensaje pre-escrito para notificar al cliente con la guía

### 3.4 Marcar como Entregado

1. Localiza un pedido con estado **"Enviado"**
2. Haz clic en el botón **"Entregar"** (verde con check)
3. El estado cambia a "Entregado"

### 3.5 Editar Información del Pedido

1. Abre el detalle del pedido (haz clic en "Ver Detalles")
2. Haz clic en **"Editar"**
3. Puedes modificar:
   - Datos del cliente (nombre, email, teléfono, documento)
   - Dirección de envío
   - Estado del envío
   - Estado del pago
4. Guarda los cambios

### 3.6 Eliminar un Pedido

1. Abre el detalle del pedido
2. Haz clic en **"Eliminar Pedido"** (botón rojo abajo)
3. Confirma en el diálogo

---

## 4. Gestión de Clientes (`/admin/clientes`)

### 4.1 Ver Clientes

- Lista de todos los usuarios registrados con rol `customer`
- Filtros disponibles:
  - **Búsqueda:** por nombre, email o ID
  - **Pedidos:** Con pedidos / Sin pedidos / Todos
  - **Rol:** Cliente / Admin / Todos
  - **Orden:** Más recientes / Más antiguos

### 4.2 Ver Perfil de Cliente

1. Haz clic en **"Ver Perfil"** de cualquier cliente
2. Se abre un panel lateral con:
   - Datos personales (nombre, email, teléfono, documento)
   - Rol (Cliente / Admin)
   - Historial de pedidos (tabla con ID, fecha, estado de pago, total)

### 4.3 Editar Cliente

1. Abre el perfil del cliente
2. Haz clic en **"Editar"**
3. Modifica:
   - Nombre completo
   - Email
   - Teléfono
4. Guarda los cambios

---

## 5. Analíticas (`/admin/analiticas`)

Métricas disponibles:
- **Ventas totales** (hoy, esta semana, este mes)
- **Pedidos por estado** (gráfico de barras)
- **Productos más vendidos**
- **Clientes nuevos** por período
- **Ingresos vs. período anterior**

---

## 6. Flujo de Trabajo Recomendado

### Cuando llega un nuevo pedido (vía WhatsApp)

1. **Verifica el pedido** en el panel (`/admin/pedidos`)
2. **Confirma el pago** con el cliente por WhatsApp
3. **Actualiza el estado** a "Pagado" o "Procesando"
4. **Prepara el envío** y obtén la guía de la transportadora
5. **Marca como "Enviado"** ingresando transportadora y guía
   - El cliente recibe notificación automática por WhatsApp
6. **Cuando el cliente confirme recepción**, marca como "Entregado"

### Cuando un producto se agota

1. Ve a `/admin/productos`
2. Abre el producto
3. Cambia el stock a `0`
4. El sistema automáticamente cambia el estado a `out_of_stock`
5. El producto desaparece del catálogo público (pero sigue visible en admin)

---

## 7. Seguridad y Buenas Prácticas

### 7.1 Roles

| Rol | Permisos |
|---|---|
| **Admin** | Acceso total al panel, CRUD de productos/pedidos/clientes, ver analíticas |
| **Customer** | Solo puede ver su propia cuenta, pedidos, direcciones |

### 7.2 Cómo asignar admin a un usuario

1. Ve a Supabase Dashboard → Authentication → Users
2. Localiza al usuario
3. En `raw_app_meta_data`, agrega `"role": "admin"`
4. Alternativamente, actualiza directamente en la tabla `profiles`:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = '<user-id>';
   ```
5. El trigger `tr_sync_role_to_auth` sincronizará automáticamente con `auth.users`

### 7.3 Cuidados

- **No elimines físicamente** productos ni pedidos — siempre usa soft delete (botón Eliminar ya lo hace automáticamente)
- **Verifica precios** antes de guardar productos
- **Revisa stock** periódicamente para mantener el catálogo actualizado
- **Responde WhatsApp** rápidamente — el flujo de ventas depende de la coordinación manual

---

## 8. Solución de Problemas

| Problema | Solución |
|---|---|
| No puedo acceder a `/admin` | Verifica que tu cuenta tenga `role: 'admin'` en la tabla `profiles` |
| Producto no aparece en la tienda | Verifica que `status = 'published'` y `stock_quantity > 0` |
| Imagen no carga | Verifica que la URL apunte al bucket `products` de Supabase Storage |
| Pedido no aparece en la lista | Verifica que no tenga `deleted_at` no nulo |
| Filtro de pedidos no funciona | Refresca la página — los datos se cargan al montar el componente |
| No puedo crear categoría | Verifica que no exista ya una con el mismo nombre |

---

## 9. Atajos de Teclado

No hay atajos especiales configurados. La interfaz es completamente mouse/touch-friendly.

---

*Manual de Administrador v1.0 — La Vie Naturelle*
