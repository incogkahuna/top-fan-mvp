# PowerShell script to start development server from correct directory
Set-Location "C:\Users\danie\OneDrive\Desktop\James project"
Write-Host "Starting development server from: $(Get-Location)" -ForegroundColor Green
npm run dev
