# 🚀 Cómo Iniciar los Servidores - OtaHub

## 📋 Resumen de lo que necesitas hacer:

Tienes que tener **3 terminales abiertas** al mismo tiempo:

1. **Terminal 1**: Stripe CLI (listener de webhooks) - Ya debería estar corriendo
2. **Terminal 2**: Backend Django
3. **Terminal 3**: Frontend React

---

## 🔵 Terminal 1: Stripe CLI (Ya debería estar corriendo)

Si ya ejecutaste `stripe listen --forward-to http://localhost:8000/api/pay/webhook/`, déjalo corriendo.

Si no, ejecuta:
```bash
stripe listen --forward-to http://localhost:8000/api/pay/webhook/
```

**⚠️ IMPORTANTE:** Esta terminal debe quedarse abierta y corriendo.

---

## 🔵 Terminal 2: Backend Django

1. Abre una **nueva terminal** (PowerShell o CMD)

2. Navega a la carpeta del backend:
   ```bash
   cd C:\Users\Milene\Desktop\EMPRESARIALES\OtaHub\backend\otahub
   ```

3. Inicia el servidor:
   ```bash
   python manage.py runserver
   ```

4. Deberías ver algo como:
   ```
   Starting development server at http://127.0.0.1:8000/
   Quit the server with CTRL-BREAK.
   ```

5. **Deja esta terminal abierta y corriendo**

---

## 🔵 Terminal 3: Frontend React

1. Abre **otra nueva terminal** (PowerShell o CMD)

2. Navega a la carpeta del frontend:
   ```bash
   cd C:\Users\Milene\Desktop\EMPRESARIALES\OtaHub\frontend\otahub-frontend
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Deberías ver algo como:
   ```
   VITE v7.x.x  ready in xxx ms

   ➜  Local:   http://localhost:5173/
   ```

5. **Deja esta terminal abierta y corriendo**

---

## ✅ Verificar que todo funciona

1. Abre tu navegador y ve a: **http://localhost:5173**

2. Deberías ver la página principal de OtaHub

3. Prueba:
   - Haz clic en "Registrarse" y crea una cuenta
   - Inicia sesión
   - Agrega productos al carrito
   - Ve al carrito y haz clic en "Proceder al Pago"

---

## 🎯 Orden de Inicio Recomendado

1. **Primero**: Stripe CLI (`stripe listen...`)
2. **Segundo**: Backend Django (`python manage.py runserver`)
3. **Tercero**: Frontend React (`npm run dev`)

---

## 🆘 Si algo no funciona

### Backend no inicia:
- Verifica que estés en la carpeta correcta: `OtaHub\backend\otahub`
- Verifica que el archivo `.env` esté ahí
- Revisa que no haya otro proceso usando el puerto 8000

### Frontend no inicia:
- Verifica que estés en la carpeta correcta: `OtaHub\frontend\otahub-frontend`
- Ejecuta: `npm install` si es necesario
- Revisa que no haya otro proceso usando el puerto 5173

### Stripe no funciona:
- Asegúrate de que `stripe listen` esté corriendo
- Verifica que el webhook secret en `.env` sea correcto
- Reinicia el backend después de cambiar `.env`

