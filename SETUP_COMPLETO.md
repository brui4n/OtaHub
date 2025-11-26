# 🚀 Guía Completa de Configuración - OtaHub

Esta guía te ayudará a configurar todo lo necesario para que el proyecto funcione completamente.

---

## 📋 PASO 1: Configurar Variables de Entorno de Stripe

### 1.1 Crear cuenta en Stripe (si no tienes una)

1. Ve a https://stripe.com
2. Crea una cuenta gratuita
3. Confirma tu email

### 1.2 Obtener las claves de API

1. En el dashboard de Stripe, ve a **Developers** → **API keys**
2. Asegúrate de estar en **Test mode** (toggle en la parte superior)
3. Busca **Secret key** y haz clic en "Reveal test key"
4. Copia la clave (se ve así: `sk_test_51AbCdEf...`)

### 1.3 Configurar Webhook para desarrollo local

**Opción A: Usar Stripe CLI (Recomendado)**

1. **Instalar Stripe CLI:**
   - Descarga desde: https://stripe.com/docs/stripe-cli
   - O en Windows con PowerShell:
     ```powershell
     # Con Chocolatey
     choco install stripe
     
     # O descarga manual desde el sitio
     ```

2. **Autenticarte:**
   ```bash
   stripe login
   ```

3. **Iniciar el listener (en una terminal separada):**
   ```bash
   stripe listen --forward-to http://localhost:8000/api/pay/webhook/
   ```
   
   Este comando mostrará algo como:
   ```
   > Ready! Your webhook signing secret is whsec_1234567890abcdef...
   ```
   
   **Copia ese `whsec_...`** - es tu `STRIPE_WEBHOOK_SECRET`

   ⚠️ **IMPORTANTE:** Deja este comando corriendo mientras desarrollas

### 1.4 Crear archivo .env

1. Ve a la carpeta: `OtaHub/backend/otahub/`
2. Crea un archivo llamado `.env` (sin extensión)
3. Agrega este contenido:

```env
STRIPE_SECRET_KEY=sk_test_pega_tu_clave_aqui
STRIPE_WEBHOOK_SECRET=whsec_pega_tu_webhook_secret_aqui
```

**Ejemplo:**
```env
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

---

## 📋 PASO 2: Ejecutar Migraciones de Base de Datos

### 2.1 Abrir terminal en la carpeta del backend

```bash
cd OtaHub/backend/otahub
```

### 2.2 Crear las migraciones

```bash
python manage.py makemigrations
```

Esto creará los archivos de migración para:
- El nuevo campo `user` en `CartItem`
- El nuevo modelo `HistorialCompra`

### 2.3 Aplicar las migraciones

```bash
python manage.py migrate
```

Esto actualizará tu base de datos SQLite con los nuevos modelos.

**Salida esperada:**
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, products, sessions
Running migrations:
  Applying products.0006_historialcompra... OK
  Applying products.0007_alter_cartitem_user... OK
```

---

## 📋 PASO 3: Verificar que todo funciona

### 3.1 Iniciar el backend

```bash
# En OtaHub/backend/otahub/
python manage.py runserver
```

Deberías ver:
```
Starting development server at http://127.0.0.1:8000/
```

### 3.2 Iniciar el frontend (en otra terminal)

```bash
# En OtaHub/frontend/otahub-frontend/
npm run dev
```

Deberías ver:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 3.3 Probar la aplicación

1. Abre http://localhost:5173
2. Haz clic en "Registrarse" y crea una cuenta
3. Agrega productos al carrito
4. Ve al carrito y haz clic en "Proceder al Pago"
5. Usa una tarjeta de prueba de Stripe:
   - Número: `4242 4242 4242 4242`
   - Fecha: Cualquier fecha futura
   - CVC: Cualquier 3 dígitos
   - Código postal: Cualquier código

---

## ✅ Checklist Final

- [ ] Archivo `.env` creado con las claves de Stripe
- [ ] Stripe CLI instalado y corriendo (`stripe listen`)
- [ ] Migraciones ejecutadas (`makemigrations` y `migrate`)
- [ ] Backend corriendo en http://127.0.0.1:8000
- [ ] Frontend corriendo en http://localhost:5173
- [ ] Puedes registrarte e iniciar sesión
- [ ] Puedes agregar productos al carrito
- [ ] Puedes proceder al checkout

---

## 🆘 Solución de Problemas

### Error: "STRIPE_SECRET_KEY not found"
- Verifica que el archivo `.env` esté en `OtaHub/backend/otahub/`
- Verifica que el nombre del archivo sea exactamente `.env` (sin extensión)
- Reinicia el servidor Django

### Error: "No such table: products_historialcompra"
- Ejecuta: `python manage.py migrate`

### Error: "Webhook signature verification failed"
- Asegúrate de que `stripe listen` esté corriendo
- Verifica que el `STRIPE_WEBHOOK_SECRET` en `.env` sea el correcto
- Reinicia el servidor Django

### Error: "ModuleNotFoundError: No module named 'stripe'"
- Ejecuta: `pip install -r requirements.txt`

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu aplicación debería estar funcionando completamente con:
- ✅ Autenticación de usuarios
- ✅ Carrito de compras por usuario
- ✅ Checkout con Stripe
- ✅ Historial de compras
- ✅ Control de stock

