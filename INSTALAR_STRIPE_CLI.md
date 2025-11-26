# 📥 Cómo Instalar Stripe CLI - Guía Paso a Paso

## Opción 1: Descarga Manual (MÁS FÁCIL) ⭐

### Paso 1: Descargar Stripe CLI

1. Ve a esta página: https://github.com/stripe/stripe-cli/releases/latest
2. Busca la sección **Assets** (al final de la página)
3. Descarga el archivo para Windows:
   - Si tienes Windows 64-bit: `stripe_X.X.X_windows_x86_64.zip`
   - Si tienes Windows 32-bit: `stripe_X.X.X_windows_i386.zip`

### Paso 2: Extraer y Configurar

1. **Extrae el archivo ZIP** que descargaste
2. **Copia el archivo `stripe.exe`** a una carpeta fácil de acceder, por ejemplo:
   - `C:\stripe-cli\` (crea esta carpeta si no existe)
   - O `C:\Program Files\stripe-cli\`

### Paso 3: Agregar a PATH (Para poder usarlo desde cualquier terminal)

1. Presiona `Windows + R`
2. Escribe: `sysdm.cpl` y presiona Enter
3. Ve a la pestaña **"Opciones avanzadas"**
4. Haz clic en **"Variables de entorno"**
5. En "Variables del sistema", busca **Path** y haz clic en **"Editar"**
6. Haz clic en **"Nuevo"**
7. Agrega la ruta donde pusiste `stripe.exe` (ejemplo: `C:\stripe-cli`)
8. Haz clic en **"Aceptar"** en todas las ventanas
9. **Cierra y vuelve a abrir** PowerShell/CMD para que tome efecto

### Paso 4: Verificar Instalación

Abre una **nueva terminal** (PowerShell o CMD) y escribe:
```bash
stripe --version
```

Si ves un número de versión, ¡está instalado correctamente!

---

## Opción 2: Instalar Chocolatey Primero (Más Complejo)

Si prefieres usar Chocolatey:

### Paso 1: Instalar Chocolatey

1. Abre **PowerShell como Administrador**:
   - Presiona `Windows + X`
   - Selecciona **"Windows PowerShell (Administrador)"** o **"Terminal (Administrador)"**

2. Ejecuta este comando:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

3. Espera a que termine la instalación

4. Cierra y vuelve a abrir PowerShell como Administrador

### Paso 2: Instalar Stripe CLI

En PowerShell como Administrador, ejecuta:
```powershell
choco install stripe
```

---

## ✅ Después de Instalar (Cualquiera de las dos opciones)

Una vez que `stripe --version` funcione, continúa con:

1. **Autenticarte:**
   ```bash
   stripe login
   ```

2. **Iniciar el listener:**
   ```bash
   stripe listen --forward-to http://localhost:8000/api/pay/webhook/
   ```

3. **Copiar el webhook secret** que aparece (whsec_...)

4. **Actualizar tu archivo .env** con ese valor

---

## 🆘 ¿Problemas?

- **"stripe no se reconoce"**: Asegúrate de haber agregado la carpeta al PATH y haber cerrado/abierto la terminal
- **"No puedo ejecutar scripts"**: Ejecuta PowerShell como Administrador
- **"Error de descarga"**: Intenta descargar manualmente desde GitHub

