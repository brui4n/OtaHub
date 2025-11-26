# 🐳 Cómo Iniciar OtaHub con Docker

## ✅ Configuración Actualizada

He actualizado tu `docker-compose.yml` para que funcione con las nuevas funcionalidades (autenticación, Stripe, etc.).

---

## 🚀 Pasos para Iniciar con Docker

### Paso 1: Detener contenedores anteriores (si están corriendo)

```bash
docker-compose down
```

### Paso 2: Reconstruir los contenedores (para instalar nuevas dependencias)

```bash
docker-compose build
```

O si quieres forzar la reconstrucción:

```bash
docker-compose build --no-cache
```

### Paso 3: Iniciar los contenedores

```bash
docker-compose up
```

O si quieres que corran en segundo plano:

```bash
docker-compose up -d
```

### Paso 4: Verificar que todo funciona

- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:5173

---

## 📋 Comandos Útiles de Docker

### Ver logs de los contenedores:
```bash
docker-compose logs -f
```

### Ver logs solo del backend:
```bash
docker-compose logs -f backend
```

### Ver logs solo del frontend:
```bash
docker-compose logs -f frontend
```

### Detener los contenedores:
```bash
docker-compose down
```

### Reiniciar los contenedores:
```bash
docker-compose restart
```

### Ejecutar comandos dentro del contenedor backend:
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

---

## ⚠️ IMPORTANTE: Stripe CLI

**El Stripe CLI NO corre dentro de Docker.** Necesitas ejecutarlo en tu máquina local:

1. Abre una terminal normal (CMD o PowerShell)
2. Ejecuta:
   ```bash
   stripe listen --forward-to http://localhost:8000/api/pay/webhook/
   ```
3. Déjalo corriendo mientras usas la aplicación

---

## 🔄 Resumen del Flujo Completo

1. **Terminal 1**: `stripe listen --forward-to http://localhost:8000/api/pay/webhook/`
2. **Terminal 2**: `docker-compose up` (o `docker start otahub-backend` y `docker start otahub-frontend`)

---

## 🆘 Si algo no funciona

### Los contenedores no inician:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Las migraciones no se aplicaron:
```bash
docker-compose exec backend python manage.py migrate
```

### Ver errores:
```bash
docker-compose logs backend
docker-compose logs frontend
```

