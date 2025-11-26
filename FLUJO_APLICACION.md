# 📱 Flujo Completo de la Aplicación OtaHub

## 🎯 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    ESTADO INICIAL                            │
│  - Ver productos ✅                                          │
│  - Buscar productos ✅                                       │
│  - Filtrar por categoría ✅                                 │
│  - Ver detalles ✅                                           │
│  - Agregar al carrito ❌ (requiere login)                   │
│  - Comprar ❌ (requiere login)                               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────┴─────────────────┐
        │                                     │
        ▼                                     ▼
┌───────────────┐                  ┌───────────────┐
│  REGISTRARSE  │                  │ INICIAR SESIÓN │
│  (Nuevo)      │                  │  (Existente)   │
└───────────────┘                  └───────────────┘
        │                                     │
        └─────────────────┬─────────────────┘
                          ▼
        ┌─────────────────────────────────────┐
        │      USUARIO AUTENTICADO             │
        │  - Token JWT guardado                │
        │  - Navbar actualizado                 │
        │  - Acceso a carrito y compras         │
        └─────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │      NAVEGAR Y AGREGAR AL CARRITO    │
        │  - Ver productos                      │
        │  - Agregar productos al carrito       │
        │  - Carrito asociado a tu usuario      │
        └─────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │         GESTIONAR CARRITO            │
        │  - Ver productos en carrito            │
        │  - Modificar cantidades               │
        │  - Eliminar productos                 │
        │  - Ver total                          │
        └─────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │      PROCEDER AL PAGO                │
        │  - Click en "Proceder al Pago"        │
        │  - Backend crea sesión Stripe         │
        │  - Redirección a Stripe Checkout      │
        └─────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │      PAGAR EN STRIPE                  │
        │  - Ingresar datos de tarjeta          │
        │  - Confirmar pago                      │
        └─────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │      WEBHOOK DE STRIPE                │
        │  - Stripe notifica al backend         │
        │  - Backend procesa el pago:           │
        │    • Crea HistorialCompra             │
        │    • Actualiza stock                   │
        │    • Limpia carrito                   │
        └─────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │      PÁGINA DE ÉXITO                  │
        │  - Mensaje de confirmación            │
        │  - Opción de ver historial            │
        └─────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │      VER HISTORIAL                    │
        │  - Lista de todas las compras         │
        │  - Detalles de cada compra             │
        │  - Productos comprados                 │
        └─────────────────────────────────────┘
```

---

## 🔐 Autenticación

### ¿Cómo funciona?

1. **Registro/Login**: Se genera un token JWT (JSON Web Token)
2. **Token guardado**: Se almacena en `localStorage` del navegador
3. **Peticiones autenticadas**: Cada vez que haces una petición al backend, el token se envía automáticamente en el header `Authorization: Bearer <token>`
4. **Validación**: El backend valida el token en cada petición protegida

### Rutas Protegidas (requieren autenticación):
- `/carrito` - Ver y gestionar carrito
- `/historial` - Ver historial de compras
- `/success` - Página de confirmación

### Rutas Públicas (no requieren autenticación):
- `/` - Home con productos
- `/producto/:id` - Detalle de producto
- `/categorias` - Lista de categorías
- `/categoria/:id` - Productos por categoría
- `/login` - Iniciar sesión
- `/register` - Registrarse

---

## 🛒 Carrito de Compras

### Características:
- **Por usuario**: Cada usuario tiene su propio carrito
- **Persistente**: Se guarda en la base de datos
- **Validación de stock**: No puedes agregar más productos de los disponibles
- **Actualización en tiempo real**: Usa React Query para sincronización

---

## 💳 Proceso de Pago

### Flujo técnico:

1. **Frontend** → Llama a `/api/pay/create-checkout-session/`
2. **Backend** → 
   - Valida usuario autenticado
   - Obtiene productos del carrito
   - Valida stock
   - Crea sesión en Stripe
   - Devuelve URL de checkout
3. **Frontend** → Redirige a Stripe
4. **Usuario** → Completa pago en Stripe
5. **Stripe** → Envía webhook a `/api/pay/webhook/`
6. **Backend** → 
   - Verifica firma del webhook
   - Crea registro en HistorialCompra
   - Actualiza stock de productos
   - Elimina productos del carrito
7. **Frontend** → Redirige a `/success`

---

## 📊 Base de Datos

### Modelos principales:

1. **User** (Django): Usuarios del sistema
2. **Category**: Categorías de mangas
3. **Product**: Productos (mangas)
4. **CartItem**: Items en el carrito (asociado a User)
5. **HistorialCompra**: Registro de compras realizadas

### Relaciones:
- `CartItem.user` → ForeignKey a User
- `HistorialCompra.usuario` → ForeignKey a User
- `HistorialCompra.productos` → ManyToMany a Product

---

## 🔄 React Query

### ¿Qué hace?

- **Cache**: Guarda datos en memoria para acceso rápido
- **Refetch automático**: Actualiza datos cuando es necesario
- **Optimistic updates**: Actualiza la UI antes de confirmar con el servidor
- **Prefetch**: Carga datos antes de que los necesites (mejora UX)

### Queries implementadas:
- `["products"]` - Lista de productos
- `["cart"]` - Carrito del usuario
- `["historial"]` - Historial de compras
- `["categories"]` - Categorías

---

## 🎨 Diseño y UX

### Colores del tema:
- **Fondo**: `#0b0f19` (oscuro)
- **Cards**: `#1f2937` (gris oscuro)
- **Inputs**: `#374151` (gris medio)
- **Acentos**: `#646cff` (azul/morado)
- **Éxito**: `#34d399` (verde)
- **Error**: `#ef4444` (rojo)

### Características UX:
- **Loading states**: Muestra "Cargando..." mientras carga
- **Error handling**: Muestra mensajes de error claros
- **Validación**: Valida formularios antes de enviar
- **Feedback visual**: Botones cambian de color al hover
- **Responsive**: Se adapta a diferentes tamaños de pantalla

---

## 🧪 Pruebas

### Tarjeta de prueba de Stripe:
- **Número**: `4242 4242 4242 4242`
- **Fecha**: Cualquier fecha futura (ej: 12/25)
- **CVC**: Cualquier 3 dígitos (ej: 123)
- **Código postal**: Cualquier código (ej: 12345)

### Flujo de prueba recomendado:
1. Registrarse con un usuario nuevo
2. Agregar varios productos al carrito
3. Modificar cantidades
4. Proceder al pago
5. Usar tarjeta de prueba
6. Verificar que aparece en el historial
7. Verificar que el stock se actualizó
8. Verificar que el carrito está vacío

---

## 🆘 Solución de Problemas

### No puedo agregar al carrito:
- Verifica que estés autenticado (debe aparecer tu nombre en el navbar)
- Verifica que haya stock disponible

### El pago no se procesa:
- Verifica que `stripe listen` esté corriendo
- Revisa los logs del backend: `docker-compose logs backend`
- Verifica que el webhook secret en `.env` sea correcto

### No veo mi historial:
- Verifica que hayas completado al menos una compra
- Verifica que estés autenticado
- Revisa la consola del navegador (F12) por errores

