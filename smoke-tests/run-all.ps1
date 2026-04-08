# ============================================================
# run-all.ps1 — Ejecuta todas las pruebas smoke
# Uso: .\run-all.ps1
#      .\run-all.ps1 -ApiUrl "http://localhost:3001/api/v1"
# ============================================================
param(
  [string]$ApiUrl = "http://localhost:3001/api/v1"
)

$env:API_URL = $ApiUrl

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  SMOKE TESTS — Sistema de Gestión Académica" -ForegroundColor Cyan
Write-Host "  API: $ApiUrl" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que el backend está activo antes de correr
try {
  $response = Invoke-WebRequest -Uri "$ApiUrl/programa-academico" -UseBasicParsing -TimeoutSec 5
  Write-Host "[OK] Backend accesible en $ApiUrl" -ForegroundColor Green
} catch {
  Write-Host "[ERROR] No se puede conectar al backend en $ApiUrl" -ForegroundColor Red
  Write-Host "        Asegúrate de que el backend esté corriendo: cd backend && npm run start:dev"
  exit 1
}

Write-Host ""
node --test tests/*.test.js

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "[PASS] Todas las pruebas smoke pasaron correctamente." -ForegroundColor Green
} else {
  Write-Host ""
  Write-Host "[FAIL] Algunas pruebas fallaron. Revisa los logs anteriores." -ForegroundColor Red
}
