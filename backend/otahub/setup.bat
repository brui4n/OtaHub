@echo off
echo ========================================
echo    Configuracion de OtaHub Backend
echo ========================================
echo.

echo Paso 1: Verificando dependencias...
pip show django >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Django no esta instalado
    echo Ejecuta: pip install -r requirements.txt
    pause
    exit /b 1
)

echo [OK] Django esta instalado
echo.

echo Paso 2: Creando migraciones...
python manage.py makemigrations
if errorlevel 1 (
    echo [ERROR] Error al crear migraciones
    pause
    exit /b 1
)

echo [OK] Migraciones creadas
echo.

echo Paso 3: Aplicando migraciones...
python manage.py migrate
if errorlevel 1 (
    echo [ERROR] Error al aplicar migraciones
    pause
    exit /b 1
)

echo [OK] Migraciones aplicadas
echo.

echo Paso 4: Verificando archivo .env...
if not exist .env (
    echo [ADVERTENCIA] Archivo .env no encontrado
    echo.
    echo Creando archivo .env de ejemplo...
    (
        echo STRIPE_SECRET_KEY=sk_test_tu_clave_aqui
        echo STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
    ) > .env
    echo.
    echo [INFO] Archivo .env creado. Por favor editalo y agrega tus claves de Stripe.
    echo.
) else (
    echo [OK] Archivo .env encontrado
)

echo.
echo ========================================
echo    Configuracion completada!
echo ========================================
echo.
echo IMPORTANTE:
echo 1. Edita el archivo .env con tus claves de Stripe
echo 2. Instala Stripe CLI y ejecuta: stripe listen --forward-to http://localhost:8000/api/pay/webhook/
echo 3. Inicia el servidor con: python manage.py runserver
echo.
pause

