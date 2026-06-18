import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".md": "text/markdown; charset=utf-8",
};

const send = (res, status, body, contentType = "application/json; charset=utf-8") => {
  res.writeHead(status, { "content-type": contentType });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
};

const fetchText = async (target, options = {}) => {
  const response = await fetch(target, options);
  const text = await response.text();
  return { status: response.status, text };
};

const proxyMarketDataChain = async (res, url) => {
  if (!process.env.MARKETDATA_TOKEN) {
    send(res, 500, { error: "Missing MARKETDATA_TOKEN" });
    return;
  }
  const underlying = url.searchParams.get("underlying");
  if (!underlying) {
    send(res, 400, { error: "Missing underlying" });
    return;
  }
  const target = new URL(`https://api.marketdata.app/v1/options/chain/${underlying}/`);
  ["expiration", "side", "strike"].forEach((key) => {
    const value = url.searchParams.get(key);
    if (value) target.searchParams.set(key, value);
  });
  const response = await fetchText(target, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.MARKETDATA_TOKEN}`,
    },
  });
  send(res, response.status, response.text);
};

const proxyAlphaQuote = async (res, url) => {
  if (!process.env.ALPHAVANTAGE_API_KEY) {
    send(res, 500, { error: "Missing ALPHAVANTAGE_API_KEY" });
    return;
  }
  const symbol = url.searchParams.get("symbol");
  if (!symbol) {
    send(res, 400, { error: "Missing symbol" });
    return;
  }
  const target = new URL("https://www.alphavantage.co/query");
  target.searchParams.set("function", "GLOBAL_QUOTE");
  target.searchParams.set("symbol", symbol);
  target.searchParams.set("apikey", process.env.ALPHAVANTAGE_API_KEY);
  const response = await fetchText(target);
  send(res, response.status, response.text);
};

const proxyAlphaEarnings = async (res, url) => {
  if (!process.env.ALPHAVANTAGE_API_KEY) {
    send(res, 500, { error: "Missing ALPHAVANTAGE_API_KEY" });
    return;
  }
  const target = new URL("https://www.alphavantage.co/query");
  target.searchParams.set("function", "EARNINGS_CALENDAR");
  target.searchParams.set("horizon", url.searchParams.get("horizon") || "3month");
  target.searchParams.set("apikey", process.env.ALPHAVANTAGE_API_KEY);
  const response = await fetchText(target);
  send(res, response.status, response.text, "text/csv; charset=utf-8");
};

const proxyFredLatest = async (res, url) => {
  if (!process.env.FRED_API_KEY) {
    send(res, 500, { error: "Missing FRED_API_KEY" });
    return;
  }
  const seriesId = url.searchParams.get("series_id");
  if (!seriesId) {
    send(res, 400, { error: "Missing series_id" });
    return;
  }
  const target = new URL("https://api.stlouisfed.org/fred/series/observations");
  target.searchParams.set("series_id", seriesId);
  target.searchParams.set("api_key", process.env.FRED_API_KEY);
  target.searchParams.set("file_type", "json");
  target.searchParams.set("sort_order", "desc");
  target.searchParams.set("limit", "1");
  const response = await fetchText(target);
  send(res, response.status, response.text);
};

const serveStatic = async (res, pathname) => {
  const cleanPath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const filePath = normalize(join(root, cleanPath));
  if (!filePath.startsWith(root)) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }
  try {
    const body = await readFile(filePath);
    res.writeHead(200, {
      "content-type": mime[extname(filePath)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch {
    send(res, 404, "Not found", "text/plain; charset=utf-8");
  }
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === "/api/marketdata/chain") return proxyMarketDataChain(res, url);
    if (url.pathname === "/api/alphavantage/quote") return proxyAlphaQuote(res, url);
    if (url.pathname === "/api/alphavantage/earnings") return proxyAlphaEarnings(res, url);
    if (url.pathname === "/api/fred/latest") return proxyFredLatest(res, url);
    return serveStatic(res, url.pathname);
  } catch (error) {
    return send(res, 500, { error: error.message });
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Options Assistant running at http://127.0.0.1:${port}/`);
});
