# 🛒 OtaHub – Tienda de Mangas (React + Django REST)

OtaHub es una plataforma web completa que permite visualizar categorías de mangas, ver sus detalles, gestionar un carrito de compras, realizar compras con Stripe y mantener un historial de compras.  
El proyecto está dividido en dos partes:

- **Backend:** Django + Django REST Framework  
- **Frontend:** React + Vite

Este desarrollo incluye: gestión de inventario, API operativa, Home con listado de productos, vista de detalle, carrito funcional, autenticación JWT, checkout con Stripe e historial de compras.

---

## 🚀 Tecnologías utilizadas

### **Backend (Django + DRF)**
- Django  
- Django REST Framework  
- Django CORS Headers  
- Pillow (para imágenes)
- djangorestframework-simplejwt (autenticación JWT)
- Stripe (pagos)
- python-dotenv (variables de entorno)

### **Frontend (React + Vite)**
- React  
- React Router DOM
- React Query (@tanstack/react-query)
- Axios  

---

# 📁 Estructura general del proyecto
OtaHub/ <br>
├── backend/ <br>
│ ├── manage.py <br>
│ ├── requirements.txt <br>
│ ├── api/              (categorías, productos, endpoints) <br>
│ ├── media/            (imágenes de productos) <br>
│ └── config/           (settings, urls) <br>
│ <br>
└── frontend/ <br>
   ├── index.html <br>
   ├── package.json <br>
   ├── src/ <br>
   │   ├── pages/ <br>
   │   ├── components/ <br>
   │   └── App.jsx <br>
   └── vite.config.js <br>

---

# 📦 Dependencias

## 🔹 Backend – Instalación de dependencias

Dentro de la carpeta del backend:

```bash
cd OtaHub/backend/otahub
pip install -r requirements.txt
```

O instalar manualmente:
```bash
pip install django djangorestframework pillow django-cors-headers djangorestframework-simplejwt stripe python-dotenv
```

### Configuración de Variables de Entorno

Crea un archivo `.env` en `OtaHub/backend/otahub/` con las siguientes variables:

```env
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_de_stripe
STRIPE_WEBHOOK_SECRET=whsec_tu_secreto_de_webhook
```

### Migraciones de Base de Datos

```bash
python manage.py makemigrations
python manage.py migrate
```

### Ejecutar el servidor

```bash
python manage.py runserver
```

## 🔹 Frontend – Instalación de dependencias

```bash
cd OtaHub/frontend/otahub-frontend
npm install
```

### Ejecutar el servidor de desarrollo

```bash
npm run dev
```

---

## 🔐 Funcionalidades Implementadas

### Backend

1. **Autenticación JWT**
   - `/api/auth/register/` - Registro de usuarios
   - `/api/auth/login/` - Inicio de sesión
   - `/api/auth/me/` - Obtener datos del usuario autenticado

2. **Historial de Compras**
   - `/api/historial/` - Listar compras del usuario autenticado

3. **Checkout con Stripe**
   - `/api/pay/create-checkout-session/` - Crear sesión de checkout
   - `/api/pay/webhook/` - Webhook para procesar pagos completados

4. **Carrito de Compras**
   - Asociado a usuarios autenticados
   - Control de stock antes de agregar productos

### Frontend

1. **Autenticación**
   - Página de Login (`/login`)
   - Página de Registro (`/register`)
   - Contexto global de autenticación
   - Protección de rutas privadas

2. **Carrito de Compras**
   - Gestión de productos en el carrito
   - Checkout con Stripe integrado

3. **Historial de Compras**
   - Página `/historial` que muestra todas las compras del usuario

4. **Confirmación de Pago**
   - Página `/success` que se muestra después de un pago exitoso

5. **React Query**
   - Implementado para todas las consultas de datos
   - Prefetch para mejorar la experiencia de usuario

---

## 📝 Notas Importantes

1. **Stripe**: Necesitas configurar las claves de Stripe en el archivo `.env` del backend. Para desarrollo, usa las claves de prueba (test mode).

2. **Webhook de Stripe**: Para que el webhook funcione en desarrollo, necesitas usar Stripe CLI:
   ```bash
   stripe listen --forward-to http://localhost:8000/api/pay/webhook/
   ```

3. **Base de Datos**: El proyecto usa SQLite por defecto. Los datos existentes se mantendrán, pero necesitarás ejecutar las migraciones para agregar los nuevos modelos.

4. **CORS**: El frontend está configurado para conectarse a `http://localhost:5173`. Si cambias el puerto, actualiza `CORS_ALLOWED_ORIGINS` en `settings.py`.
