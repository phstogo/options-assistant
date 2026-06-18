const today = new Date();

const storageKey = "options-assistant-settings";
const defaults = {
  provider: "free",
  accountSize: 50000,
  riskPerTrade: 1.5,
  portfolioRisk: 12,
  earningsBuffer: 7,
  minDte: 45,
  maxDte: 90,
  takeProfit: 70,
};

const loadSettings = () => {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
  } catch {
    return { ...defaults };
  }
};

const state = {
  quoteTime: new Date(),
  dataStatus: "Free official stack ready",
  activeFilter: "all",
  settings: loadSettings(),
  markets: [
    { symbol: "SPY", label: "S&P 500 ETF", price: 651.42, change: 0.42, signal: "Trend positive" },
    { symbol: "QQQ", label: "Nasdaq 100 ETF", price: 559.18, change: 0.66, signal: "Tech leadership" },
    { symbol: "IWM", label: "Russell 2000 ETF", price: 219.36, change: -0.18, signal: "Small caps lagging" },
    { symbol: "DIA", label: "Dow ETF", price: 428.7, change: 0.2, signal: "Value stable" },
    { symbol: "VIXY", label: "VIX Futures ETF", price: 12.31, change: -1.15, signal: "Volatility softer" },
    { symbol: "TLT", label: "20Y Treasury ETF", price: 89.42, change: -0.18, signal: "Rates neutral" },
    { symbol: "UUP", label: "Dollar ETF", price: 28.08, change: -0.07, signal: "Dollar softer" },
    { symbol: "XLF", label: "Financials ETF", price: 49.26, change: 0.34, signal: "Financials supportive" },
  ],
  signals: [
    { level: "good", text: "Market trend is constructive; put credit spreads remain preferred when risk is controlled." },
    { level: "warn", text: "Reduce position size around OPEX, quarter-end rebalancing, CPI, FOMC, and NFP." },
    { level: "warn", text: "Avoid opening new credit spreads inside the earnings buffer window." },
    { level: "neutral", text: "Positions near 21 DTE should be reviewed before new trades are added." },
  ],
  avoidList: [
    { symbol: "ADBE", reason: "Near earnings window", date: "2026-06-19" },
    { symbol: "FDX", reason: "Earnings week and elevated gap risk", date: "2026-06-23" },
    { symbol: "NKE", reason: "Inside earnings buffer", date: "2026-06-25" },
    { symbol: "SPY", reason: "OPEX week: allowed with lower size", date: "2026-06-20" },
  ],
  strategies: [
    {
      symbol: "MSFT",
      type: "put-credit-spread",
      title: "Put Credit Spread",
      bias: "Bullish",
      expiration: "2026-08-21",
      dte: 64,
      strikes: "Short 465P / Long 455P",
      credit: 2.15,
      maxRisk: 785,
      breakeven: 462.85,
      winRate: 74,
      liquidity: "A",
      status: "Candidate",
      exit: "Close near 70% profit or review before 21 DTE.",
    },
    {
      symbol: "NVDA",
      type: "iron-condor",
      title: "Iron Condor",
      bias: "Neutral",
      expiration: "2026-08-21",
      dte: 64,
      strikes: "130P/125P + 175C/180C",
      credit: 1.52,
      maxRisk: 348,
      breakeven: "128.48 / 176.52",
      winRate: 68,
      liquidity: "A+",
      status: "IV OK",
      exit: "Close near 70% profit or adjust if tested side delta rises.",
    },
    {
      symbol: "TSLA",
      type: "call-credit-spread",
      title: "Call Credit Spread",
      bias: "Bearish",
      expiration: "2026-08-21",
      dte: 64,
      strikes: "Short 240C / Long 250C",
      credit: 2.4,
      maxRisk: 760,
      breakeven: 242.4,
      winRate: 66,
      liquidity: "A",
      status: "High vol",
      exit: "Adjust if price reclaims short strike or loss reaches 2x credit.",
    },
    {
      symbol: "XLF",
      type: "put-credit-spread",
      title: "Put Credit Spread",
      bias: "Bullish",
      expiration: "2026-08-21",
      dte: 64,
      strikes: "Short 48P / Long 45P",
      credit: 0.62,
      maxRisk: 238,
      breakeven: 47.38,
      winRate: 76,
      liquidity: "B+",
      status: "Low risk",
      exit: "Close when spread value falls under 0.19.",
    },
  ],
  positions: [
    {
      underlying: "MSFT",
      strategyType: "Put Credit Spread",
      legs: "465P / 455P",
      expiration: "2026-08-21",
      openedCredit: 2.15,
      currentMark: 0.86,
      quantity: 1,
      quoteTimestamp: "Mock",
      source: "Manual",
    },
    {
      underlying: "NVDA",
      strategyType: "Iron Condor",
      legs: "130/125P + 175/180C",
      expiration: "2026-08-21",
      openedCredit: 1.52,
      currentMark: 0.53,
      quantity: 1,
      quoteTimestamp: "Mock",
      source: "OCR",
    },
    {
      underlying: "TSLA",
      strategyType: "Call Credit Spread",
      legs: "240C / 250C",
      expiration: "2026-07-17",
      openedCredit: 2.4,
      currentMark: 2.95,
      quantity: 1,
      quoteTimestamp: "Mock",
      source: "API sync",
    },
  ],
  ocrDraft: {
    underlying: "META",
    strategyType: "Put Credit Spread",
    legs: "620P / 610P",
    expiration: "2026-08-21",
    openedCredit: 1.95,
    currentMark: 1.02,
    quantity: 1,
    quoteTimestamp: "OCR pending",
    source: "OCR",
  },
  events: [
    { date: "2026-06-19", title: "Monthly OPEX", detail: "Watch pin risk and reduce size." },
    { date: "2026-06-25", title: "NKE earnings", detail: "No new credit spread inside buffer." },
    { date: "2026-07-02", title: "NFP window", detail: "Reduce directional exposure before jobs data." },
    { date: "2026-07-15", title: "CPI week", detail: "Avoid chasing if VIX rises into the release." },
    { date: "2026-09-18", title: "Triple/quad witching", detail: "Review positions before expiration week." },
  ],
};

const saveSettings = () => localStorage.setItem(storageKey, JSON.stringify(state.settings));
const currency = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
const percent = (value) => `${value > 0 ? "+" : ""}${Number(value || 0).toFixed(2)}%`;
const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const addDays = (dateText, delta) => {
  const date = new Date(`${dateText}T00:00:00`);
  date.setDate(date.getDate() + delta);
  return date.toISOString().slice(0, 10);
};

const dte = (dateText) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const from = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const to = new Date(`${dateText}T00:00:00`);
  return Math.ceil((to - from) / oneDay);
};

const etStamp = () =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

const getMid = (bid, ask, last) => {
  const bidNumber = Number(bid);
  const askNumber = Number(ask);
  const lastNumber = Number(last);
  if (bidNumber > 0 && askNumber > 0) return Number(((bidNumber + askNumber) / 2).toFixed(2));
  if (lastNumber > 0) return Number(lastNumber.toFixed(2));
  return null;
};

const parseLegs = (position) => {
  const fallbackSide = position.strategyType.toLowerCase().includes("call") ? "call" : "put";
  return String(position.legs)
    .match(/\d+(\.\d+)?[CP]?/gi)
    ?.map((text) => ({
      strike: Number(text.replace(/[CP]/gi, "")),
      side: /C/i.test(text) ? "call" : /P/i.test(text) ? "put" : fallbackSide,
    }))
    .filter((leg) => Number.isFinite(leg.strike)) || [];
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  if (!response.ok) throw new Error(`${response.status}: ${text}`);
  return text.trim().startsWith("{") || text.trim().startsWith("[") ? JSON.parse(text) : text;
};

const parseCsv = (csv) => {
  const lines = String(csv).trim().split(/\r?\n/);
  const headers = lines.shift()?.split(",") || [];
  return lines.map((line) => {
    const cols = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, cols[index] || ""]));
  });
};

const updateMarketQuotesFromAlpha = async () => {
  const symbols = state.markets.map((market) => market.symbol);
  const updates = await Promise.allSettled(
    symbols.map((symbol) => fetchJson(`/api/alphavantage/quote?symbol=${encodeURIComponent(symbol)}`)),
  );
  state.markets = state.markets.map((market, index) => {
    const result = updates[index];
    if (result.status !== "fulfilled") return market;
    const quote = result.value["Global Quote"] || {};
    const price = Number(quote["05. price"]);
    const changeText = String(quote["10. change percent"] || "0").replace("%", "");
    const change = Number(changeText);
    if (!price) return market;
    return {
      ...market,
      price,
      change,
      signal: change > 0.35 ? "Alpha Vantage quote strong" : change < -0.35 ? "Alpha Vantage quote weak" : "Alpha Vantage quote neutral",
    };
  });
};

const marketDataChain = async ({ underlying, expiration, side, strike }) =>
  fetchJson(
    `/api/marketdata/chain?underlying=${encodeURIComponent(underlying)}&expiration=${encodeURIComponent(
      expiration,
    )}&side=${encodeURIComponent(side)}&strike=${encodeURIComponent(strike)}`,
  );

const extractMarketDataMark = (chain, targetStrike) => {
  if (!chain || chain.s === "error") return null;
  const strikes = chain.strike || [];
  const index = strikes.findIndex((strike) => Number(strike) === Number(targetStrike));
  if (index < 0) return null;
  return getMid(chain.bid?.[index], chain.ask?.[index], chain.last?.[index]);
};

const updatePositionsFromMarketData = async () => {
  const updated = [];
  for (const position of state.positions) {
    const legs = parseLegs(position);
    if (!legs.length) {
      updated.push({ ...position, quoteTimestamp: `${etStamp()} ET - no parsed legs` });
      continue;
    }
    const marks = [];
    for (const leg of legs) {
      try {
        const chain = await marketDataChain({
          underlying: position.underlying,
          expiration: position.expiration,
          side: leg.side,
          strike: leg.strike,
        });
        const mark = extractMarketDataMark(chain, leg.strike);
        if (mark !== null) marks.push(mark);
      } catch (error) {
        console.warn(error);
      }
    }
    if (!marks.length) {
      updated.push({ ...position, quoteTimestamp: `${etStamp()} ET - no option quote` });
      continue;
    }
    updated.push({
      ...position,
      currentMark: Number(Math.max(0.01, Math.max(...marks) - Math.min(...marks)).toFixed(2)),
      quoteTimestamp: `${etStamp()} ET - 24h delayed`,
      source: "MarketData.app",
    });
  }
  state.positions = updated;
};

const updateEarningsFromAlpha = async () => {
  const csv = await fetchJson(`/api/alphavantage/earnings?horizon=3month`);
  const earnings = parseCsv(csv);
  const watched = new Set([...state.positions.map((p) => p.underlying), ...state.strategies.map((s) => s.symbol)]);
  const upcoming = earnings
    .filter((row) => watched.has(row.symbol))
    .slice(0, 6)
    .map((row) => ({ symbol: row.symbol, date: row.reportDate, reason: "Alpha Vantage earnings calendar" }));
  if (upcoming.length) state.avoidList = upcoming;
};

const updateMacroFromFred = async () => {
  const series = [
    ["DGS10", "10Y Treasury"],
    ["FEDFUNDS", "Fed Funds"],
    ["CPIAUCSL", "CPI"],
    ["UNRATE", "Unemployment"],
  ];
  const results = await Promise.allSettled(series.map(([id]) => fetchJson(`/api/fred/latest?series_id=${id}`)));
  const notes = results
    .map((result, index) => {
      if (result.status !== "fulfilled") return null;
      const observation = result.value.observations?.at(-1);
      if (!observation || observation.value === ".") return null;
      return `${series[index][1]} ${observation.value}`;
    })
    .filter(Boolean);
  if (notes.length) {
    state.signals = [
      ...state.signals.slice(0, 3),
      { level: "neutral", text: `FRED macro snapshot: ${notes.join(", ")}.` },
    ];
  }
};

const refreshFreeOfficialData = async () => {
  state.dataStatus = "Refreshing free official data...";
  renderDataStatus();
  const tasks = [updateMarketQuotesFromAlpha(), updatePositionsFromMarketData(), updateEarningsFromAlpha(), updateMacroFromFred()];
  const results = await Promise.allSettled(tasks);
  const failures = results.filter((result) => result.status === "rejected");
  state.quoteTime = new Date();
  state.dataStatus = failures.length
    ? `Free official data partial: ${failures.length} source(s) failed`
    : "Free official data: MarketData.app + Alpha Vantage + FRED";
};

const applyMockTick = () => {
  state.positions = state.positions.map((position, index) => ({
    ...position,
    currentMark: Number(Math.max(0.05, position.currentMark + [0.03, -0.04, 0.06][index % 3]).toFixed(2)),
    quoteTimestamp: `${etStamp()} ET - Mock`,
  }));
  state.quoteTime = new Date();
  state.dataStatus = "Mock fallback";
};

const refreshData = async () => {
  try {
    if (state.settings.provider === "free") await refreshFreeOfficialData();
    else applyMockTick();
  } catch (error) {
    console.error(error);
    state.dataStatus = `Data refresh failed: ${error.message}`;
  }
  renderAll();
};

const positionStatus = (position) => {
  if (!position.currentMark || !position.openedCredit) return "No data";
  const days = dte(position.expiration);
  const profit = ((position.openedCredit - position.currentMark) / position.openedCredit) * 100;
  if (profit >= 70) return "Take profit";
  if (profit >= 60) return "Near 70% profit";
  if (days <= 21 && profit < 50) return "Close or adjust";
  if (days <= 28) return "Near 21 DTE";
  if (position.currentMark > position.openedCredit * 1.8) return "Adjust";
  return "Holding";
};

const positionStats = (position) => {
  const days = dte(position.expiration);
  const pnl = (position.openedCredit - position.currentMark) * 100 * position.quantity;
  const profit = ((position.openedCredit - position.currentMark) / position.openedCredit) * 100;
  return {
    days,
    pnl,
    profit,
    decisionDate: addDays(position.expiration, -21),
    takeProfitPrice: position.openedCredit * (1 - state.settings.takeProfit / 100),
    status: positionStatus(position),
  };
};

const renderQuoteClock = () => {
  const taipei = new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(state.quoteTime);
  const eastern = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(state.quoteTime);
  document.querySelector("#quote-clock").textContent = `Quote time ${eastern} ET / ${taipei} Taipei`;
};

const renderDataStatus = () => {
  const badge = document.querySelector("#data-status");
  if (badge) badge.textContent = state.dataStatus;
};

const renderMetrics = () => {
  document.querySelector("#market-metrics").innerHTML = state.markets
    .map((market) => `
      <article class="metric-card">
        <span>${market.label}</span>
        <strong>${market.price.toLocaleString("en-US")}</strong>
        <em class="${market.change > 0 ? "positive" : market.change < 0 ? "negative" : "neutral"}">${percent(market.change)}</em>
        <p>${market.signal}</p>
      </article>
    `)
    .join("");
};

const renderSignals = () => {
  document.querySelector("#daily-signals").innerHTML = state.signals
    .map((signal) => `<li><span class="badge ${signal.level}">${signal.level}</span> ${signal.text}</li>`)
    .join("");
  document.querySelector("#avoid-list").innerHTML = state.avoidList
    .map((item) => `<div class="avoid-item"><strong>${item.symbol}</strong><span>${item.date} - ${item.reason}</span></div>`)
    .join("");
};

const renderStrategies = () => {
  const strategies = state.activeFilter === "all" ? state.strategies : state.strategies.filter((item) => item.type === state.activeFilter);
  document.querySelector("#strategy-grid").innerHTML = strategies
    .map((strategy) => `
      <article class="strategy-card">
        <header>
          <div><small>${strategy.bias}</small><h4>${strategy.symbol}</h4></div>
          <span class="badge ${strategy.status.includes("High") ? "warn" : "good"}">${strategy.status}</span>
        </header>
        <strong>${strategy.title}</strong>
        <p>${strategy.strikes}</p>
        <div class="strategy-details">
          <div><small>Expiration</small><strong>${strategy.expiration}</strong></div>
          <div><small>DTE</small><strong>${strategy.dte}</strong></div>
          <div><small>Credit</small><strong>${currency(strategy.credit)}</strong></div>
          <div><small>Max risk</small><strong>${currency(strategy.maxRisk)}</strong></div>
          <div><small>Win rate</small><strong>${strategy.winRate}%</strong></div>
          <div><small>Liquidity</small><strong>${strategy.liquidity}</strong></div>
        </div>
        <small>Exit: ${strategy.exit}</small>
      </article>
    `)
    .join("");
};

const renderPositions = () => {
  let totalPnl = 0;
  document.querySelector("#position-table").innerHTML = state.positions
    .map((position) => {
      const stats = positionStats(position);
      totalPnl += stats.pnl;
      const statusClass = stats.status.includes("profit") || stats.status === "Holding" ? "good" : stats.status === "No data" ? "" : "warn";
      return `
        <tr>
          <td><strong>${position.underlying}</strong><br><small>${position.source} - ${position.quoteTimestamp}</small></td>
          <td>${position.strategyType}</td>
          <td>${position.legs}</td>
          <td>${position.expiration}</td>
          <td>${stats.days}</td>
          <td>${stats.decisionDate}</td>
          <td class="${stats.pnl >= 0 ? "positive" : "negative"}">${currency(stats.pnl)}</td>
          <td>${stats.profit.toFixed(1)}%</td>
          <td>${currency(stats.takeProfitPrice)}</td>
          <td><span class="badge ${statusClass}">${stats.status}</span></td>
        </tr>
      `;
    })
    .join("");
  const grossCredit = state.positions.reduce((sum, position) => sum + position.openedCredit * 100 * position.quantity, 0);
  document.querySelector("#portfolio-summary").innerHTML = `
    <span class="badge">Credit ${currency(grossCredit)}</span>
    <span class="badge ${totalPnl >= 0 ? "good" : "warn"}">Unrealized ${currency(totalPnl)}</span>
    <span class="badge">Positions ${state.positions.length}</span>
  `;
};

const renderOcrDraft = () => {
  const fields = [
    ["underlying", "Underlying"],
    ["strategyType", "Strategy"],
    ["legs", "Strikes"],
    ["expiration", "Expiration"],
    ["openedCredit", "Open credit"],
    ["currentMark", "Current mark"],
    ["quantity", "Quantity"],
    ["quoteTimestamp", "Quote time"],
  ];
  document.querySelector("#ocr-grid").innerHTML = fields
    .map(([key, label]) => `
      <label>${label}
        <input data-ocr-field="${key}" type="${["openedCredit", "currentMark", "quantity"].includes(key) ? "number" : "text"}" value="${state.ocrDraft[key]}" />
      </label>
    `)
    .join("");
};

const renderCalendar = () => {
  document.querySelector("#calendar-grid").innerHTML = state.events
    .map((event) => `<article class="calendar-card"><time>${event.date}</time><strong>${event.title}</strong><span>${event.detail}</span></article>`)
    .join("");
};

const injectDataSettings = () => {
  const settingsGrid = document.querySelector("#settings .settings-grid");
  if (!settingsGrid || document.querySelector("#data-provider")) return;
  settingsGrid.insertAdjacentHTML(
    "beforeend",
    `
      <section class="panel data-settings-panel">
        <div class="section-head">
          <h3>Official free data</h3>
          <span id="data-status" class="badge">${state.dataStatus}</span>
        </div>
        <div class="form-grid">
          <label>
            Data source
            <select id="data-provider">
              <option value="free">Free official stack</option>
              <option value="mock">Mock fallback</option>
            </select>
          </label>
          <label>
            Required server env
            <input value="MARKETDATA_TOKEN, ALPHAVANTAGE_API_KEY, FRED_API_KEY" readonly />
          </label>
        </div>
        <p class="note">
          Free official stack uses MarketData.app delayed options data, Alpha Vantage quotes/earnings, and FRED macro data through server.mjs.
        </p>
      </section>
    `,
  );
};

const syncSettingsForm = () => {
  const fields = {
    "account-size": "accountSize",
    "risk-per-trade": "riskPerTrade",
    "portfolio-risk": "portfolioRisk",
    "earnings-buffer": "earningsBuffer",
    "min-dte": "minDte",
    "max-dte": "maxDte",
    "take-profit": "takeProfit",
    "data-provider": "provider",
  };
  Object.entries(fields).forEach(([id, key]) => {
    const control = document.querySelector(`#${id}`);
    if (control) control.value = state.settings[key] ?? defaults[key];
  });
};

const applySettings = () => {
  const readNumber = (id, fallback) => Number(document.querySelector(`#${id}`)?.value || fallback);
  state.settings.accountSize = readNumber("account-size", defaults.accountSize);
  state.settings.riskPerTrade = readNumber("risk-per-trade", defaults.riskPerTrade);
  state.settings.portfolioRisk = readNumber("portfolio-risk", defaults.portfolioRisk);
  state.settings.earningsBuffer = readNumber("earnings-buffer", defaults.earningsBuffer);
  state.settings.minDte = readNumber("min-dte", defaults.minDte);
  state.settings.maxDte = readNumber("max-dte", defaults.maxDte);
  state.settings.takeProfit = readNumber("take-profit", defaults.takeProfit);
  state.settings.provider = document.querySelector("#data-provider")?.value || "free";
  saveSettings();
  renderPositions();
};

const bindEvents = () => {
  document.querySelectorAll(".nav-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.remove("is-active"));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("is-active"));
      button.classList.add("is-active");
      document.querySelector(`#${button.dataset.tab}`).classList.add("is-active");
    });
  });

  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("is-active"));
      button.classList.add("is-active");
      state.activeFilter = button.dataset.filter;
      renderStrategies();
    });
  });

  document.querySelector("#refresh-quotes").addEventListener("click", refreshData);

  document.querySelector("#position-image").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const preview = document.querySelector("#image-preview");
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      preview.innerHTML = `<img src="${reader.result}" alt="Uploaded position screenshot" />`;
      state.ocrDraft.quoteTimestamp = `${etStamp()} ET`;
      renderOcrDraft();
    };
    reader.readAsDataURL(file);
  });

  document.querySelector("#confirm-import").addEventListener("click", () => {
    document.querySelectorAll("[data-ocr-field]").forEach((input) => {
      state.ocrDraft[input.dataset.ocrField] = input.type === "number" ? Number(input.value) : input.value;
    });
    state.positions.unshift({ ...state.ocrDraft, source: "OCR confirmed" });
    renderPositions();
    document.querySelector('[data-tab="positions"]').click();
  });

  document.querySelectorAll("#settings input, #settings select").forEach((control) => {
    control.addEventListener("change", applySettings);
  });
};

const renderAll = () => {
  renderQuoteClock();
  renderDataStatus();
  renderMetrics();
  renderSignals();
  renderStrategies();
  renderPositions();
  renderOcrDraft();
  renderCalendar();
};

const boot = () => {
  injectDataSettings();
  syncSettingsForm();
  renderAll();
  bindEvents();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
};

boot();
