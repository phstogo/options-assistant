# Options Assistant MVP

Static PWA + small Node proxy for a US options assistant. The default data mode now uses free official sources:

- MarketData.app: delayed options chains and option marks
- Alpha Vantage: stock/ETF quotes and earnings calendar
- FRED: macro series such as 10Y yield, Fed Funds, CPI, unemployment

## Run Locally

Set free API keys in the same PowerShell session:

```powershell
$env:MARKETDATA_TOKEN="your_marketdata_token"
$env:ALPHAVANTAGE_API_KEY="your_alpha_vantage_key"
$env:FRED_API_KEY="your_fred_key"
node server.mjs
```

Open:

```text
http://127.0.0.1:4173/index.html
```

The app defaults to `Free official stack`. Press the refresh quote button to pull:

- `/api/marketdata/chain`
- `/api/alphavantage/quote`
- `/api/alphavantage/earnings`
- `/api/fred/latest`

## Free Data Limits

MarketData.app Free Forever currently provides limited daily credits and 24-hour delayed options data. Alpha Vantage free keys have strict daily request limits. FRED is suitable for macro data but also requires a free API key.

This means the MVP is useful for planning, review, and position management, but not for real-time trading decisions.

## Deployment

For GitHub Pages, only the static UI can run. Official API calls require a backend because API keys must not be exposed in the browser.

For production-like deployment, host `server.mjs` on a Node-capable platform such as Render, Railway, Fly.io, or a small VPS, then deploy the static files from the same origin.

## Disclaimer

This tool is for research support and trade checklist assistance only. It does not place trades, does not guarantee profit, and does not replace personal investment judgment.
