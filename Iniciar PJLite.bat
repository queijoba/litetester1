@echo off
chcp 65001 >nul
setlocal

title PJ Lite - Prévia Local
cd /d "%~dp0"

echo ========================================
echo       PJ Lite - Prévia Local
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js não foi encontrado neste computador.
    echo Instale o Node.js LTS e tente novamente.
    echo.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERRO] npm não foi encontrado neste computador.
    echo Reinstale o Node.js LTS e tente novamente.
    echo.
    pause
    exit /b 1
)

if not exist "package.json" (
    echo [ERRO] package.json não encontrado.
    echo Execute este arquivo dentro da pasta do PJ Lite.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo Instalando dependências pela primeira vez...
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERRO] Não foi possível instalar as dependências.
        pause
        exit /b 1
    )
    echo.
)

echo Iniciando o PJ Lite em modo de desenvolvimento...
echo A prévia será aberta em: http://127.0.0.1:5173
echo.

start "PJ Lite - Vite" cmd /k "cd /d ""%~dp0"" && npm run dev -- --host 127.0.0.1 --port 5173 --strictPort"

timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:5173"

echo Prévia iniciada.
echo Para encerrar, feche a janela "PJ Lite - Vite".
echo.
timeout /t 2 /nobreak >nul
exit /b 0
