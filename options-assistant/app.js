const today = new Date("2026-06-18T09:10:00-04:00");

const state = {
  quoteTime: new Date("2026-06-18T09:12:24-04:00"),
  activeFilter: "all",
  settings: {
    accountSize: 50000,
    riskPerTrade: 1.5,
    portfolioRisk: 12,
    earningsBuffer: 7,
    minDte: 45,
    maxDte: 90,
    takeProfit: 70,
  },
  markets: [
    { symbol: "SPY", label: "S&P 500 ETF", price: 651.42, change: 0.42, signal: "多方延續" },
    { symbol: "QQQ", label: "Nasdaq 100 ETF", price: 559.18, change: 0.66, signal: "科技股領先" },
    { symbol: "IWM", label: "Russell 2000 ETF", price: 219.36, change: -0.18, signal: "小型股落後" },
    { symbol: "VIX", label: "波動率指數", price: 16.8, change: -2.1, signal: "波動收斂" },
    { symbol: "10Y", label: "美債 10Y", price: 4.31, change: 0.04, signal: "利率壓力中性" },
    { symbol: "DXY", label: "美元指數", price: 101.72, change: -0.12, signal: "美元偏弱" },
    { symbol: "ES", label: "S&P 期貨", price: 6578.25, change: 0.31, signal: "盤前偏多" },
    { symbol: "NQ", label: "Nasdaq 期貨", price: 23680.5, change: 0.55, signal: "風險偏好回升" },
  ],
  signals: [
    { level: "good", text: "大盤趨勢偏多，信用價差可偏向 put credit spread，但維持有限風險。" },
    { level: "warn", text: "6 月接近月度 OPEX 與季底再平衡，單筆風險建議低於帳戶 1.5%。" },
    { level: "warn", text: "第 3 季前夕與 6/7 月交界常見資金輪動，避免追高 IV 過低標的。" },
    { level: "neutral", text: "新倉需避開財報日前後 7 日；既有倉位若接近 21 DTE 需決策。" },
  ],
  avoidList: [
    { symbol: "ADBE", reason: "財報日接近，跳空風險過高", date: "2026-06-19" },
    { symbol: "FDX", reason: "財報週與 IV 擴張，暫停新倉", date: "2026-06-23" },
    { symbol: "NKE", reason: "財報日前 7 日內，排除信用價差", date: "2026-06-25" },
    { symbol: "SPY", reason: "OPEX 週，允許但降低倉位", date: "2026-06-20" },
  ],
  strategies: [
    {
      symbol: "MSFT",
      type: "put-credit-spread",
      title: "Put Credit Spread",
      bias: "偏多",
      expiration: "2026-08-21",
      dte: 64,
      strikes: "Short 465P / Long 455P",
      credit: 2.15,
      maxRisk: 785,
      breakeven: 462.85,
      winRate: 74,
      liquidity: "A",
      status: "候選",
      exit: "收回 70% 權利金或 21 DTE 前重評",
    },
    {
      symbol: "NVDA",
      type: "iron-condor",
      title: "Iron Condor",
      bias: "中性偏多",
      expiration: "2026-08-21",
      dte: 64,
      strikes: "130P/125P + 175C/180C",
      credit: 1.52,
      maxRisk: 348,
      breakeven: "128.48 / 176.52",
      winRate: 68,
      liquidity: "A+",
      status: "IV 合理",
      exit: "收回 70% 權利金或任一側 delta > 0.35",
    },
    {
      symbol: "AAPL",
      type: "put-credit-spread",
      title: "Put Credit Spread",
      bias: "偏多",
      expiration: "2026-09-18",
      dte: 92,
      strikes: "Short 190P / Long 180P",
      credit: 1.8,
      maxRisk: 820,
      breakeven: 188.2,
      winRate: 72,
      liquidity: "A",
      status: "DTE 略高",
      exit: "若仍超過 90 DTE，等待下一個到期週",
    },
    {
      symbol: "TSLA",
      type: "call-credit-spread",
      title: "Call Credit Spread",
      bias: "偏空",
      expiration: "2026-08-21",
      dte: 64,
      strikes: "Short 240C / Long 250C",
      credit: 2.4,
      maxRisk: 760,
      breakeven: 242.4,
      winRate: 66,
      liquidity: "A",
      status: "高波動",
      exit: "若標的站回 240 或虧損達權利金 2 倍，需調整",
    },
    {
      symbol: "XLF",
      type: "put-credit-spread",
      title: "Put Credit Spread",
      bias: "偏多",
      expiration: "2026-08-21",
      dte: 64,
      strikes: "Short 48P / Long 45P",
      credit: 0.62,
      maxRisk: 238,
      breakeven: 47.38,
      winRate: 76,
      liquidity: "B+",
      status: "低風險",
      exit: "權利金回補至 0.19 以下停利",
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
      quoteTimestamp: "2026-06-18 09:12 ET",
      source: "手動輸入",
    },
    {
      underlying: "NVDA",
      strategyType: "Iron Condor",
      legs: "130/125P + 175/180C",
      expiration: "2026-08-21",
      openedCredit: 1.52,
      currentMark: 0.53,
      quantity: 1,
      quoteTimestamp: "2026-06-18 09:12 ET",
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
      quoteTimestamp: "2026-06-18 09:12 ET",
      source: "API 同步",
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
    quoteTimestamp: "2026-06-18 09:12 ET",
    source: "OCR",
  },
  events: [
    { date: "2026-06-18", title: "Juneteenth 前後", detail: "假期造成交易週壓縮，避免高槓桿短線。" },
    { date: "2026-06-19", title: "月度 OPEX", detail: "選擇權到期週，留意尾盤量能與 pin risk。" },
    { date: "2026-06-25", title: "NKE 財報", detail: "財報日前後 7 日不開新信用價差。" },
    { date: "2026-07-02", title: "NFP 前夕", detail: "非農前降低方向性曝險。" },
    { date: "2026-07-15", title: "CPI 週", detail: "若 VIX 上升，避免追價開倉。" },
    { date: "2026-09-18", title: "三巫/四巫日", detail: "季末到期與再平衡，倉位需提前處理。" },
  ],
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const formatPercent = (value) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

const dateDiffDays = (from, to) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const fromDate = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const toDate = new Date(`${to}T00:00:00`);
  return Math.ceil((toDate - fromDate) / oneDay);
};

const addDays = (dateText, delta) => {
  const date = new Date(`${dateText}T00:00:00`);
  date.setDate(date.getDate() + delta);
  return date.toISOString().slice(0, 10);
};

const statusForPosition = (position) => {
  if (!position.currentMark || !position.openedCredit) return "資料不足";
  const dte = dateDiffDays(today, position.expiration);
  const profitPercent = ((position.openedCredit - position.currentMark) / position.openedCredit) * 100;
  if (profitPercent >= 70) return "到達停利";
  if (profitPercent >= 60) return "接近 70% 停利";
  if (dte <= 21 && profitPercent < 50) return "需平倉";
  if (dte <= 28) return "接近 21 DTE";
  if (position.currentMark > position.openedCredit * 1.8) return "需調整";
  return "持有中";
};

const positionStats = (position) => {
  const dte = dateDiffDays(today, position.expiration);
  const pnl = (position.openedCredit - position.currentMark) * 100 * position.quantity;
  const profitPercent = ((position.openedCredit - position.currentMark) / position.openedCredit) * 100;
  const takeProfitPrice = position.openedCredit * (1 - state.settings.takeProfit / 100);
  return {
    dte,
    pnl,
    profitPercent,
    takeProfitPrice,
    decisionDate: addDays(position.expiration, -21),
    status: statusForPosition(position),
  };
};

const renderMetrics = () => {
  const container = document.querySelector("#market-metrics");
  container.innerHTML = state.markets
    .map((market) => {
      const changeClass = market.change > 0 ? "positive" : market.change < 0 ? "negative" : "neutral";
      return `
        <article class="metric-card">
          <span>${market.label}</span>
          <strong>${market.symbol === "10Y" ? `${market.price.toFixed(2)}%` : market.price.toLocaleString("en-US")}</strong>
          <em class="${changeClass}">${formatPercent(market.change)}</em>
          <p>${market.signal}</p>
        </article>
      `;
    })
    .join("");
};

const renderSignals = () => {
  document.querySelector("#daily-signals").innerHTML = state.signals
    .map((signal) => `<li><span class="badge ${signal.level}">${signal.level}</span> ${signal.text}</li>`)
    .join("");

  document.querySelector("#avoid-list").innerHTML = state.avoidList
    .map(
      (item) => `
        <div class="avoid-item">
          <strong>${item.symbol}</strong>
          <span>${item.date} · ${item.reason}</span>
        </div>
      `,
    )
    .join("");
};

const renderStrategies = () => {
  const strategies =
    state.activeFilter === "all"
      ? state.strategies
      : state.strategies.filter((strategy) => strategy.type === state.activeFilter);

  document.querySelector("#strategy-grid").innerHTML = strategies
    .map(
      (strategy) => `
        <article class="strategy-card">
          <header>
            <div>
              <small>${strategy.bias}</small>
              <h4>${strategy.symbol}</h4>
            </div>
            <span class="badge ${strategy.status.includes("高") || strategy.status.includes("略") ? "warn" : "good"}">
              ${strategy.status}
            </span>
          </header>
          <strong>${strategy.title}</strong>
          <p>${strategy.strikes}</p>
          <div class="strategy-details">
            <div><small>到期日</small><strong>${strategy.expiration}</strong></div>
            <div><small>DTE</small><strong>${strategy.dte}</strong></div>
            <div><small>收取權利金</small><strong>${formatCurrency(strategy.credit)}</strong></div>
            <div><small>最大風險</small><strong>${formatCurrency(strategy.maxRisk)}</strong></div>
            <div><small>勝率估計</small><strong>${strategy.winRate}%</strong></div>
            <div><small>流動性</small><strong>${strategy.liquidity}</strong></div>
          </div>
          <small>退出條件：${strategy.exit}</small>
        </article>
      `,
    )
    .join("");
};

const renderPositions = () => {
  const tbody = document.querySelector("#position-table");
  let totalPnl = 0;
  tbody.innerHTML = state.positions
    .map((position) => {
      const stats = positionStats(position);
      totalPnl += stats.pnl;
      const statusClass =
        stats.status.includes("停利") || stats.status === "持有中"
          ? "good"
          : stats.status.includes("不足")
            ? ""
            : "warn";
      return `
        <tr>
          <td><strong>${position.underlying}</strong><br><small>${position.source} · ${position.quoteTimestamp}</small></td>
          <td>${position.strategyType}</td>
          <td>${position.legs}</td>
          <td>${position.expiration}</td>
          <td>${stats.dte}</td>
          <td>${stats.decisionDate}</td>
          <td class="${stats.pnl >= 0 ? "positive" : "negative"}">${formatCurrency(stats.pnl)}</td>
          <td>${stats.profitPercent.toFixed(1)}%</td>
          <td>${formatCurrency(stats.takeProfitPrice)}</td>
          <td><span class="badge ${statusClass}">${stats.status}</span></td>
        </tr>
      `;
    })
    .join("");

  const grossCredit = state.positions.reduce((sum, position) => sum + position.openedCredit * 100 * position.quantity, 0);
  document.querySelector("#portfolio-summary").innerHTML = `
    <span class="badge">權利金 ${formatCurrency(grossCredit)}</span>
    <span class="badge ${totalPnl >= 0 ? "good" : "warn"}">未實現 ${formatCurrency(totalPnl)}</span>
    <span class="badge">持倉 ${state.positions.length}</span>
  `;
};

const renderOcrDraft = () => {
  const fields = [
    ["underlying", "標的"],
    ["strategyType", "策略"],
    ["legs", "履約價"],
    ["expiration", "到期日"],
    ["openedCredit", "建倉價格"],
    ["currentMark", "目前價格"],
    ["quantity", "合約數"],
    ["quoteTimestamp", "報價時間"],
  ];

  document.querySelector("#ocr-grid").innerHTML = fields
    .map(([key, label]) => {
      const type = ["openedCredit", "currentMark", "quantity"].includes(key) ? "number" : "text";
      return `
        <label>
          ${label}
          <input data-ocr-field="${key}" type="${type}" value="${state.ocrDraft[key]}" />
        </label>
      `;
    })
    .join("");
};

const renderCalendar = () => {
  document.querySelector("#calendar-grid").innerHTML = state.events
    .map(
      (event) => `
        <article class="calendar-card">
          <time>${event.date}</time>
          <strong>${event.title}</strong>
          <span>${event.detail}</span>
        </article>
      `,
    )
    .join("");
};

const renderQuoteClock = () => {
  const taipei = new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(state.quoteTime);
  const eastern = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(state.quoteTime);
  document.querySelector("#quote-clock").textContent = `近即時報價 ${eastern} ET / ${taipei} 台北`;
};

const applySettings = () => {
  state.settings.accountSize = Number(document.querySelector("#account-size").value);
  state.settings.riskPerTrade = Number(document.querySelector("#risk-per-trade").value);
  state.settings.portfolioRisk = Number(document.querySelector("#portfolio-risk").value);
  state.settings.earningsBuffer = Number(document.querySelector("#earnings-buffer").value);
  state.settings.minDte = Number(document.querySelector("#min-dte").value);
  state.settings.maxDte = Number(document.querySelector("#max-dte").value);
  state.settings.takeProfit = Number(document.querySelector("#take-profit").value);
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

  document.querySelector("#refresh-quotes").addEventListener("click", () => {
    state.quoteTime = new Date(state.quoteTime.getTime() + 90 * 1000);
    state.positions = state.positions.map((position, index) => ({
      ...position,
      currentMark: Number(Math.max(0.05, position.currentMark + [0.03, -0.04, 0.06][index % 3]).toFixed(2)),
      quoteTimestamp: "2026-06-18 09:14 ET",
    }));
    renderQuoteClock();
    renderPositions();
  });

  document.querySelector("#position-image").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const preview = document.querySelector("#image-preview");
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      preview.innerHTML = `<img src="${reader.result}" alt="已上傳的倉位截圖" />`;
      state.ocrDraft.quoteTimestamp = "2026-06-18 09:15 ET";
      renderOcrDraft();
    };
    reader.readAsDataURL(file);
  });

  document.querySelector("#confirm-import").addEventListener("click", () => {
    document.querySelectorAll("[data-ocr-field]").forEach((input) => {
      const key = input.dataset.ocrField;
      state.ocrDraft[key] = input.type === "number" ? Number(input.value) : input.value;
    });
    state.positions.unshift({ ...state.ocrDraft, source: "OCR 確認" });
    renderPositions();
    document.querySelector('[data-tab="positions"]').click();
  });

  document.querySelectorAll("#settings input, #settings select").forEach((control) => {
    control.addEventListener("change", applySettings);
  });
};

const boot = () => {
  renderQuoteClock();
  renderMetrics();
  renderSignals();
  renderStrategies();
  renderPositions();
  renderOcrDraft();
  renderCalendar();
  bindEvents();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
};

boot();
