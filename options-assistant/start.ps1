$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Created .env from .env.example."
  Write-Host "Please open options-assistant\.env and paste your API keys, then run this script again."
  exit 1
}

node server.mjs
