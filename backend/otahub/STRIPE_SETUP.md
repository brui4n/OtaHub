# 🔑 Configuración de Stripe

## Paso 1: Crear cuenta en Stripe (si no tienes una)

1. Ve a https://stripe.com
2. Crea una cuenta gratuita
3. Confirma tu email

## Paso 2: Obtener las claves de API (Modo Test)

1. Una vez dentro del dashboard de Stripe, ve a **Developers** → **API keys**
2. En la sección **Test mode** (asegúrate de estar en modo test, no en modo live), verás:
   - **Publishable key** (no la necesitamos para el backend)
   - **Secret key** - Esta es tu `STRIPE_SECRET_KEY`
     - Se ve así: `sk_test_51AbCdEf...`
     - Haz clic en "Reveal test key" si está oculta
     - Cópiala

## Paso 3: Configurar Webhook (para desarrollo local)

### Opción A: Usar Stripe CLI (Recomendado para desarrollo)

1. **Instalar Stripe CLI:**
   - Windows: Descarga desde https://stripe.com/docs/stripe-cli
   - O usa: `scoop install stripe` o `choco install stripe`
   - Mac: `brew install stripe/stripe-cli/stripe`
   - Linux: Descarga desde el sitio oficial

2. **Autenticarte:**
   ```bash
   stripe login
   ```
   Esto abrirá el navegador para autorizar.

3. **Obtener el webhook secret:**
   ```bash
   stripe listen --forward-to http://localhost:8000/api/pay/webhook/
   ```
   Este comando te dará un `whsec_...` que es tu `STRIPE_WEBHOOK_SECRET`
   **IMPORTANTE:** Deja este comando corriendo en una terminal mientras desarrollas

### Opción B: Configurar Webhook en el Dashboard (Para producción)

1. Ve a **Developers** → **Webhooks**
2. Click en **Add endpoint**
3. URL del endpoint: `https://tu-dominio.com/api/pay/webhook/`
4. Selecciona el evento: `checkout.session.completed`
5. Copia el **Signing secret** (whsec_...)

## Paso 4: Crear archivo .env

Crea un archivo llamado `.env` en la carpeta `OtaHub/backend/otahub/` con este contenido:

```env
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
```

**Ejemplo real:**
```env
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

⚠️ **IMPORTANTE:** 
- NO subas el archivo `.env` a Git (ya debería estar en .gitignore)
- Usa claves de TEST para desarrollo
- Las claves de LIVE solo se usan en producción

