(function () {
  function isMob() {
    var sw = window.screen && window.screen.width || 9999;
    var iw = window.innerWidth || 9999;
    var ua = navigator.userAgent || '';
    var uaMobile = /Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini|BlackBerry|webOS/i.test(ua);
    return sw < 769 || iw < 769 || uaMobile;
  }
  function applyClass() {
    document.documentElement.classList.toggle('is-mobile', window.innerWidth < 769);
    if (isMob()) document.documentElement.classList.remove('desk');else document.documentElement.classList.add('desk');
  }
  applyClass();
  try {
    var th = localStorage.getItem('pf_ios_theme') || 'light';
    document.documentElement.classList.add(th === 'light' ? 'ios-light' : 'ios-dark');
  } catch (e) {
    document.documentElement.classList.add('ios-dark');
  }
  window.addEventListener('resize', applyClass);
  window.addEventListener('orientationchange', function () {
    setTimeout(applyClass, 150);
  });
})();
function _realMobile() {
  var sw = window.screen && window.screen.width || 9999;
  var iw = window.innerWidth || 9999;
  var ua = navigator.userAgent || '';
  return sw < 769 || iw < 769 || /Mobi|Android|iPhone|iPad|iPod|IEMobile/i.test(ua);
}
function isMobile() {
  return window.innerWidth < 769;
}
window.addEventListener('resize', function () {
  document.documentElement.classList.toggle('is-mobile', window.innerWidth < 769);
  if (_realMobile()) document.documentElement.classList.remove('desk');else document.documentElement.classList.add('desk');
  renderAll();
});
function showToast(msg, type) {
  var toast = document.getElementById('_toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = '_toast';
    toast.style.cssText = ['position:fixed', 'top:20px', 'left:50%', 'transform:translateX(-50%)', 'padding:10px 20px', 'border-radius:12px', 'font-size:13px', 'font-weight:500', 'z-index:99999', 'opacity:0', 'transition:opacity .25s', 'white-space:nowrap', 'pointer-events:none', "font-family:var(--font)", 'box-shadow:0 4px 20px rgba(0,0,0,.4)'].join(';');
    document.body.appendChild(toast);
  }
  var colors = {
    success: {
      bg: '#1c3a28',
      border: 'rgba(62,207,142,.4)',
      color: '#3ecf8e'
    },
    error: {
      bg: '#3a1c1c',
      border: 'rgba(246,109,109,.4)',
      color: '#f66d6d'
    },
    info: {
      bg: '#1c2030',
      border: 'rgba(92,159,255,.3)',
      color: '#5c9fff'
    }
  };
  var c = colors[type] || colors.info;
  toast.style.background = c.bg;
  toast.style.border = '1px solid ' + c.border;
  toast.style.color = c.color;
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    toast.style.opacity = '0';
  }, 3500);
}
function setSyncStatus(msg, color) {
  var el = document.getElementById('syncStatus');
  if (el) {
    el.textContent = msg;
    if (color) el.style.color = color;
  }
}
let _toastTimer = null;
function updateDebug(msg, color) {
  var toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1c2030;border:1px solid var(--hairline);border-radius:10px;padding:8px 18px;font-size:12px;color:#e8e6df;z-index:9999;font-family:var(--font);opacity:0;transition:opacity .3s;pointer-events:none;white-space:nowrap';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.color = color || '#e8e6df';
  toast.style.opacity = '1';
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () {
    toast.style.opacity = '0';
  }, 3000);
}
function updateDebugMode() {}
const FX_SYMS = ['GBPSAR=X', 'HKDSAR=X', 'USDSAR=X', 'JODSAR=X'];
const CUR_RATES = {
  JOD: 0.188,
  USD: 1 / 3.756
};
const FONT_CANVAS = "system-ui,-apple-system,'IBM Plex Sans Arabic',RialMark,sans-serif";
if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = FONT_CANVAS;
  Chart.defaults.color = '#7a7d8a';
}
const CUR_SYMS = {
  SAR: '﷼',
  JOD: 'د.أ',
  USD: '$'
};
const OLD_KEY_MAP = {
  GOLD_OZ_USD: {
    assetName: 'Gold',
    isGold: true
  },
  ISWD_GBp: {
    assetName: 'ISWD'
  },
  ISDU_GBp: {
    assetName: 'ISDU'
  },
  ISDE_GBp: {
    assetName: 'ISDE'
  },
  BYD_HKD: {
    assetName: 'BYD'
  }
};
const DEFAULT_ASSETS = [{
  id: 'Gold',
  name: 'Gold',
  type: 'Gold',
  currency: 'USD',
  yahooSym: 'GC=F',
  tvSym: 'TVC:GOLD',
  isGold: true
}, {
  id: 'ISWD',
  name: 'ISWD',
  type: 'Stock',
  currency: 'GBp',
  yahooSym: 'ISWD.L',
  tvSym: 'LSE:ISWD',
  isGold: false
}, {
  id: 'ISDU',
  name: 'ISDU',
  type: 'Stock',
  currency: 'USD',
  yahooSym: 'ISDU.L',
  tvSym: 'LSE:ISDU',
  isGold: false
}, {
  id: 'ISDE',
  name: 'ISDE',
  type: 'Stock',
  currency: 'USD',
  yahooSym: 'ISDE.L',
  tvSym: 'LSE:ISDE',
  isGold: false
}, {
  id: 'BYD',
  name: 'BYD',
  type: 'Stock',
  currency: 'HKD',
  yahooSym: '1211.HK',
  tvSym: 'HKEX:1211',
  isGold: false
}];
let txns = [];
let propVals = {};
let assets = JSON.parse(JSON.stringify(DEFAULT_ASSETS));
let otherSrc = [];
let includeUnrealized = true;
let baseCur = 'SAR';
let pivotCur = 'SAR';
let catGoals = {
  Property: 0,
  Gold: 0,
  Stock: 0,
  Cash: 0
};
let retireGoal = 2800000;
let liveP = {};
let fx = {
  USD: 3.75,
  GBP: 4.73,
  GBp: 0.0473,
  HKD: 0.479,
  JOD: 5.30
};
let marketData = {};
let curPage = 1;
let donutChart = null;
const PG = 30;
var _cloudMode = true;
function saveTxns() {
  if (!_cloudMode) localStorage.setItem('pf_txns', JSON.stringify(txns));
}
function savePVals() {
  const val = JSON.stringify(propVals);
  portfolioAPI.saveSetting('propVals', val);
}
function saveAssets() {
  portfolioAPI.saveAssets(assets);
}
function saveOther() {
  portfolioAPI.saveOtherSources(otherSrc);
}
function toggleSellCard(uid) {
  const body = document.getElementById('body_' + uid);
  const chev = document.getElementById('chev_' + uid);
  if (!body) return;
  const open = body.style.display === 'none';
  body.style.display = open ? 'block' : 'none';
  if (chev) chev.style.transform = open ? 'rotate(180deg)' : '';
}
function savePivot() {
  portfolioAPI.saveSetting('pivotCur', pivotCur);
  updatePivotLabels();
}
function updatePivotLabels() {
  const sym = CUR_SYMS[pivotCur] || pivotCur;
  const rLbl = $('aRateLabel');
  if (rLbl) rLbl.textContent = 'سعر الصرف → ' + sym + ' ' + pivotCur;
  const tLbl = $('aTotalLabel');
  if (tLbl) tLbl.textContent = 'التكلفة الإجمالية (' + pivotCur + ')';
  const pivotDisplay = $('pivotCurDisplay');
  if (pivotDisplay) pivotDisplay.textContent = sym + ' ' + pivotCur;
  const sel = $('pivotCurSelect');
  if (sel) sel.value = pivotCur;
}
function setPivotCurrency(newCur) {
  if (newCur === pivotCur) return;
  const hasData = txns.length > 0;
  const isFirst = !localStorage.getItem('pf_pivotcur') && !_cloudMode;
  const sym = CUR_SYMS[newCur] || newCur;
  if (hasData) {
    const msg = `⚠️ تحذير: تغيير العملة المحورية\n\n` + `العملة الجديدة: ${sym} ${newCur}\n\n` + `جميع الحركات المسجّلة (${txns.length} حركة) وقيم الأصول تم إدخالها باعتبار العملة المحورية الحالية (${CUR_SYMS[pivotCur]} ${pivotCur}).\n\n` + `بعد التغيير ستحتاج للتحقق يدوياً من:\n` + `• معاملات التحويل في كل حركة\n` + `• قيم المصادر الأخرى\n` + `• أهداف الفئات\n\n` + `هل تريد المتابعة؟`;
    if (!confirm(msg)) {
      const sel = $('pivotCurSelect');
      if (sel) sel.value = pivotCur;
      return;
    }
  } else if (isFirst) {
    const msg = `معلومة: العملة المحورية\n\n` + `ستكون ${sym} ${newCur} هي العملة التي تُدخَل بها كل حركاتك ومصادرك.\n\n` + `يُنصح بعدم تغييرها لاحقاً إلا إذا قمت بمراجعة جميع البيانات.\n\n` + `تأكيد الاختيار؟`;
    if (!confirm(msg)) {
      const sel = $('pivotCurSelect');
      if (sel) sel.value = pivotCur;
      return;
    }
  }
  pivotCur = newCur;
  if (baseCur === pivotCur || !CUR_RATES[newCur]) setBaseCurrency(newCur);
  savePivot();
}
function saveCur() {
  portfolioAPI.saveSetting('baseCur', baseCur);
}
function saveCatGoals() {
  portfolioAPI.saveSetting('catGoals', JSON.stringify(catGoals));
}
const fmt = (n, d = 0) => new Intl.NumberFormat('en-US', {
  maximumFractionDigits: d,
  minimumFractionDigits: d
}).format(n || 0);
function sarToBase(sar) {
  if (!baseCur || baseCur === 'SAR') return sar;
  const rate = fx[baseCur];
  if (rate && rate > 0) return sar / rate;
  return sar * (CUR_RATES[baseCur] || 1);
}
const fmtC = sar => {
  const v = sarToBase(sar);
  return CUR_SYMS[baseCur] + ' ' + fmt(Math.abs(v));
};
const fmtS = n => '﷼ ' + fmt(Math.abs(n || 0));
const pN = s => {
  if (!s || s === '-' || s === '') return 0;
  return parseFloat(String(s).replace(/,/g, '')) || 0;
};
const pDate = s => {
  if (!s) return '';
  s = s.trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return s;
};
const $ = id => document.getElementById(id);
const st = (id, v) => {
  const el = $(id);
  if (el) el.textContent = v;
};
const bc = a => ({
  Buy: 'b-buy',
  Sell: 'b-sell',
  Deposit: 'b-dep',
  Withdrawal: 'b-wit'
})[a] || '';
const openModal = id => $(id).classList.add('open');
const closeModal = id => $(id).classList.remove('open');
function toSAR(amt, cur) {
  if (!cur || cur === 'SAR') return amt;
  if (cur === 'GBp' || cur === 'GBX') return amt / 100 * (fx.GBP || 4.73);
  if (cur === 'GBP') return amt * (fx.GBP || 4.73);
  return amt * (fx[cur] || 1);
}
function setBaseCurrency(cur) {
  baseCur = cur;
  saveCur();
  document.querySelectorAll('.cur-btn').forEach(b => b.classList.toggle('active', b.dataset.cur === cur));
  renderAll();
}
function calcFIFO(assetTxns) {
  const sorted = [...assetTxns].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const queue = [];
  let realizedPnL = 0,
    cumulativeQty = 0,
    everFullyExited = false;
  const sellHistory = [],
    repurchases = [];
  sorted.forEach(t => {
    const qty = Math.abs(pN(t.qty) || 0);
    const cost = Math.abs(pN(t.totalCostSAR) || 0);
    const unitP = qty > 0 ? cost / qty : 0;
    if (t.action === 'Buy') {
      if (qty > 0) {
        queue.push({
          qty,
          priceSAR: unitP
        });
        cumulativeQty += qty;
        if (everFullyExited) repurchases.push({
          date: t.date,
          qty,
          totalCost: cost,
          unitPrice: unitP
        });
      }
    } else if (t.action === 'Sell') {
      let remaining = qty,
        txnPnL = 0,
        txnCostBasis = 0;
      while (remaining > 0 && queue.length > 0) {
        const head = queue[0];
        if (head.qty <= remaining) {
          txnPnL += (unitP - head.priceSAR) * head.qty;
          txnCostBasis += head.priceSAR * head.qty;
          remaining -= head.qty;
          queue.shift();
        } else {
          txnPnL += (unitP - head.priceSAR) * remaining;
          txnCostBasis += head.priceSAR * remaining;
          head.qty -= remaining;
          remaining = 0;
        }
      }
      realizedPnL += txnPnL;
      cumulativeQty -= qty;
      if (cumulativeQty <= 0) {
        everFullyExited = true;
        cumulativeQty = 0;
      }
      sellHistory.push({
        date: t.date,
        qty,
        proceeds: cost,
        costBasis: txnCostBasis,
        pnl: txnPnL,
        pct: txnCostBasis > 0 ? txnPnL / txnCostBasis * 100 : 0
      });
    }
  });
  const netQty = queue.reduce((s, b) => s + b.qty, 0);
  const totalCost = queue.reduce((s, b) => s + b.qty * b.priceSAR, 0);
  const avgCostSAR = netQty > 0 ? totalCost / netQty : 0;
  return {
    avgCostSAR,
    netQty,
    fifoQueue: queue,
    realizedPnL,
    sellHistory,
    repurchases,
    everFullyExited
  };
}
function buildGroups() {
  const g = {};
  txns.forEach(t => {
    const k = `${t.assetType}||${t.assetName}`;
    if (!g[k]) g[k] = {
      assetType: t.assetType,
      assetName: t.assetName,
      buyQ: 0,
      sellQ: 0,
      buySAR: 0,
      sellSAR: 0,
      depSAR: 0,
      wthSAR: 0,
      txns: []
    };
    const q = Math.abs(pN(t.qty)),
      c = Math.abs(pN(t.totalCostSAR));
    if (t.action === 'Buy') {
      g[k].buyQ += q;
      g[k].buySAR += c;
    } else if (t.action === 'Sell') {
      g[k].sellQ += q;
      g[k].sellSAR += c;
    } else if (t.action === 'Deposit') g[k].depSAR += c;else if (t.action === 'Withdrawal') g[k].wthSAR += c;
    g[k].txns.push(t);
  });
  Object.values(g).forEach(grp => {
    if (grp.assetType === 'Stock' || grp.assetType === 'Gold' || grp.assetType === 'Property') {
      const f = calcFIFO(grp.txns);
      grp.fifoAvgCost = f.avgCostSAR;
      grp.fifoNetQty = f.netQty;
      grp.realizedPnL = f.realizedPnL;
      grp.sellHistory = f.sellHistory;
      grp.repurchases = f.repurchases;
      grp.everFullyExited = f.everFullyExited;
    }
  });
  return Object.values(g);
}
function isExited(g) {
  if (g.assetType === 'Cash') return false;
  return g.sellQ > 0 && g.sellQ >= g.buyQ;
}
function calcSummary() {
  const s = {
    Property: 0,
    Gold: 0,
    Stock: 0,
    Cash: 0
  };
  buildGroups().forEach(g => {
    if (isExited(g)) return;
    if (g.assetType === 'Cash') s.Cash += g.depSAR - g.wthSAR;else if (s[g.assetType] !== undefined) s[g.assetType] += g.buySAR - g.sellSAR;
  });
  return s;
}
function getLivePrice(assetName) {
  const lp = liveP[assetName];
  if (lp && !lp.error) return lp;
  const ast = assets.find(a => a.name === assetName);
  if (!ast || !ast.yahooSym) return null;
  const raw = marketData[ast.yahooSym];
  if (!raw) return null;
  const price = typeof raw === 'object' ? raw?.price : raw;
  if (price == null) return null;
  const cur = typeof raw === 'object' && raw?.currency || ast.currency || 'USD';
  if (ast.isGold || ast.type === 'Gold') {
    const gramSAR = (price * 0.997 * 0.02055 - 5) / 0.188;
    return {
      price,
      currency: 'USD',
      priceSAR: price * fx.USD,
      gramSAR,
      src: 'marketData'
    };
  }
  return {
    price,
    currency: cur,
    priceSAR: toSAR(price, cur)
  };
}
function groupCurrentValue(g) {
  const netQ = g.buyQ - g.sellQ;
  const cost = g.assetType === 'Cash' ? g.depSAR - g.wthSAR : ['Stock', 'Gold'].includes(g.assetType) ? Math.max(0, netQ) * (g.fifoAvgCost || 0) : g.buySAR - g.sellSAR;
  if (g.assetType === 'Cash') return {
    cur: cost,
    cost,
    hasPx: true
  };
  if (g.assetType === 'Property') {
    const stored = propVals[g.assetName];
    const mv = stored && typeof stored === 'object' ? pN(stored.sar) : pN(stored || 0);
    return {
      cur: mv || cost,
      cost: cost,
      hasPx: !!mv
    };
  }
  const lp = getLivePrice(g.assetName);
  if (g.assetType === 'Gold' && lp && lp.gramSAR) return {
    cur: netQ * lp.gramSAR,
    cost: netQ * (g.fifoAvgCost || 0),
    hasPx: true
  };
  if (g.assetType === 'Stock' && lp && lp.priceSAR) return {
    cur: netQ * lp.priceSAR,
    cost: netQ * (g.fifoAvgCost || 0),
    hasPx: true
  };
  return {
    cur: cost,
    cost,
    hasPx: false
  };
}
function calcTotals() {
  const grps = buildGroups();
  let byType = {
    Property: {
      cur: 0,
      cost: 0
    },
    Gold: {
      cur: 0,
      cost: 0
    },
    Stock: {
      cur: 0,
      cost: 0
    },
    Cash: {
      cur: 0,
      cost: 0
    }
  };
  grps.forEach(g => {
    if (isExited(g)) return;
    const v = groupCurrentValue(g);
    if (byType[g.assetType]) {
      byType[g.assetType].cur += v.cur;
      byType[g.assetType].cost += v.cost;
    }
  });
  const otherUnrealized = otherSrc.filter(s => s.type === 'unrealized' && s.included !== false).reduce((a, s) => a + pN(s.value), 0);
  const otherRealized = otherSrc.filter(s => s.type === 'realized' && s.included !== false).reduce((a, s) => a + pN(s.value), 0);
  const otherTotal = otherRealized + otherUnrealized;
  const investCur = byType.Property.cur + byType.Gold.cur + byType.Stock.cur;
  const investCost = byType.Property.cost + byType.Gold.cost + byType.Stock.cost;
  const growthCur = byType.Gold.cur + byType.Stock.cur;
  const growthCost = byType.Gold.cost + byType.Stock.cost;
  const otherForTotal = otherRealized + (includeUnrealized ? otherUnrealized : 0);
  const totalCur = byType.Property.cur + byType.Gold.cur + byType.Stock.cur + byType.Cash.cur + otherForTotal;
  const totalCost = byType.Property.cost + byType.Gold.cost + byType.Stock.cost + byType.Cash.cost;
  return {
    byType,
    otherTotal,
    investCur,
    investCost,
    growthCur,
    growthCost,
    totalCur,
    totalCost
  };
}
function findAsset(name) {
  return assets.find(a => a.name === name || a.id === name) || null;
}
function parseOldFormat(raw) {
  if (raw.GBPSAR) {
    fx.GBP = raw.GBPSAR;
    fx.GBp = raw.GBPSAR / 100;
  }
  if (raw.HKDSAR) fx.HKD = raw.HKDSAR;
  if (raw.USDSAR) fx.USD = raw.USDSAR;
  if (raw.JODSAR) fx.JOD = raw.JODSAR;
  liveP = {};
  Object.entries(OLD_KEY_MAP).forEach(([key, info]) => {
    const price = raw[key];
    if (price == null || price === 0) return;
    const asset = assets.find(a => a.name === info.assetName || a.id === info.assetName);
    const currency = asset?.currency || 'USD';
    if (info.isGold) {
      const gramSAR = (price * 0.997 * 0.02055 - 5) / 0.188;
      liveP[info.assetName] = {
        price,
        currency: 'USD',
        priceSAR: price * fx.USD,
        gramSAR,
        src: `TVC:GOLD — $${fmt(price, 0)}/oz`
      };
    } else liveP[info.assetName] = {
      price,
      currency,
      priceSAR: toSAR(price, currency)
    };
  });
}
function parseNewFormat(raw) {
  const fxMap = {
    'GBPSAR=X': 'GBP',
    'HKDSAR=X': 'HKD',
    'USDSAR=X': 'USD',
    'JODSAR=X': 'JOD'
  };
  Object.entries(fxMap).forEach(([sym, cur]) => {
    const v = raw[sym];
    const p = typeof v === 'object' ? v?.price : v;
    if (p) {
      fx[cur] = p;
      if (cur === 'GBP') fx.GBp = p / 100;
    }
  });
  liveP = {};
  assets.forEach(a => {
    if (!a.yahooSym || a.type === 'Property' || a.type === 'Cash') return;
    const r = raw[a.yahooSym];
    if (!r) {
      liveP[a.name] = {
        error: 'رمز غير موجود'
      };
      return;
    }
    const price = typeof r === 'object' ? r.price : r;
    const apiCur = (typeof r === 'object' ? r.currency : null) || a.currency;
    if (price == null) {
      liveP[a.name] = {
        error: 'السعر null'
      };
      return;
    }
    if (a.isGold || a.type === 'Gold') {
      const gramSAR = (price * 0.997 * 0.02055 - 5) / 0.188;
      liveP[a.name] = {
        price,
        currency: 'USD',
        priceSAR: price * fx.USD,
        gramSAR,
        src: `TVC:GOLD — $${fmt(price, 0)}/oz`
      };
    } else liveP[a.name] = {
      price,
      currency: apiCur,
      priceSAR: toSAR(price, apiCur)
    };
  });
}
async function refreshPrices() {
  st('statusTxt', 'جاري جلب الأسعار...');
  try {
    let raw;
    const syms = [...new Set([...FX_SYMS, ...assets.filter(a => a.yahooSym && a.type !== 'Property' && a.type !== 'Cash').map(a => a.yahooSym)])];
    st('statusTxt', 'جاري جلب الأسعار...');
    raw = await new Promise((res, rej) => {
      const timer = setTimeout(() => rej(new Error('انتهت مهلة الاتصال — حاول مرة ثانية')), 60000);
      portfolioAPI.withSuccessHandler(function (r) {
        clearTimeout(timer);
        res(r);
      }).withFailureHandler(function (e) {
        clearTimeout(timer);
        rej(e);
      }).getPrices(syms.join(','));
    });
    const isOld = raw.hasOwnProperty('GOLD_OZ_USD') || raw.hasOwnProperty('ISWD_GBp') || raw.hasOwnProperty('GBPSAR');
    if (isOld) parseOldFormat(raw);else parseNewFormat(raw);
    const now = new Date().toLocaleTimeString('ar-EG');
    const errors = Object.values(liveP).filter(v => v?.error).length;
    st('statusTxt', `آخر تحديث: ${now} — GBP/SAR: ${fmt(fx.GBP, 3)} · USD/SAR: ${fmt(fx.USD, 3)}${errors ? ` · ⚠️ ${errors} فشل` : ''}`);
    checkPriceAlerts();
  } catch (e) {
    st('statusTxt', `خطأ: ${e.message}`);
  }
  renderAll();
}
let _renderTimer = null;
function renderAll() {
  if (_renderTimer) cancelAnimationFrame(_renderTimer);
  _renderTimer = requestAnimationFrame(_doRenderAll);
}
function _doRenderAll() {
  if (!window.portfolioLoaded) return;
  requestAnimationFrame(() => window.refreshOverview?.());
  const tots = calcTotals();
  const {
    byType,
    otherTotal,
    investCur,
    investCost,
    growthCur,
    growthCost,
    totalCur,
    totalCost
  } = tots;
  const profit = growthCur - growthCost;
  const pct = growthCost > 0 ? profit / growthCost * 100 : 0;
  animNum('heroVal', totalCur * sarToBase(1), v => fmt(v));
  animNum('heroInvested', investCost, fmtC);
  st('heroSym', CUR_SYMS[baseCur]);
  const profitTag = $('heroProfitTag');
  if (profitTag) {
    if (Math.abs(profit) < 1) {
      profitTag.textContent = '—';
      profitTag.className = 'tag tag-neu';
    } else if (profit > 0) {
      profitTag.textContent = `▲ ${fmtC(profit)} (+${fmt(pct, 1)}%)`;
      profitTag.className = 'tag tag-pos';
    } else {
      profitTag.textContent = `▼ ${fmtC(Math.abs(profit))} (${fmt(pct, 1)}%)`;
      profitTag.className = 'tag tag-neg';
    }
  }
  st('heroProfitLabel', '');
  const otherUnrealized = otherSrc.filter(s => s.type === 'unrealized' && s.included !== false).reduce((a, s) => a + pN(s.value), 0);
  const otherRealized = otherSrc.filter(s => s.type === 'realized' && s.included !== false).reduce((a, s) => a + pN(s.value), 0);
  const totalInvestedAndCash = investCost + byType.Cash.cost;
  animNum('heroInvestedAll', totalInvestedAndCash + otherRealized + (includeUnrealized ? otherUnrealized : 0), fmtC);
  const realizedCost = totalInvestedAndCash + otherRealized;
  st('hmCostRealized', fmtC(realizedCost));
  if (otherUnrealized > 0) {
    const el = $('hmCostUnrealized');
    if (el) {
      el.textContent = fmtC(otherUnrealized);
    }
    const chk = $('chkUnrealized');
    if (chk) chk.checked = includeUnrealized;
    const row = chk?.closest('label');
    if (row) row.style.opacity = otherUnrealized > 0 ? '1' : '.4';
  } else {
    st('hmCostUnrealized', '—');
    const chk = $('chkUnrealized');
    if (chk) chk.checked = false;
  }
  st('hmCount', txns.length);
  animNum('hmInvest', byType.Gold.cur + byType.Stock.cur, fmtC);
  renderStatCard('Prop', 'Property', byType.Property);
  renderStatCard('Gold', 'Gold', byType.Gold);
  renderStatCard('Stock', 'Stock', byType.Stock);
  renderStatCard('Cash', 'Cash', byType.Cash);
  animNum('scOtherVal', otherTotal, fmtC);
  st('scOtherInv', '');
  const oEl = $('scOtherPnl');
  if (oEl) {
    oEl.textContent = otherTotal > 0 ? `${otherSrc.length} مصدر` : '—';
    oEl.className = 'sc-pnl neu';
  }
  renderRetireGoal(totalCur, byType, otherTotal);
  renderGoalsPage(totalCur, byType, otherTotal);
  renderDonut(byType, otherTotal);
  renderPerformance(buildGroups());
  renderPortfolio();
  renderTxnTable();
  renderRegistry(byType, totalCur);
  renderOtherSources();
  populateAssetDropdown();
  const _hrEl = $('heroRealized');
  if (_hrEl) _hrEl.innerHTML = '';
  renderRebalance(byType);
  renderTxnInsights();
  renderGoalProjection(totalCur);
  updateAlertsBadge();
  if ($('page-geo')?.classList.contains('active')) renderGeoPage();
  if ($('page-zakat')?.classList.contains('active')) zkRender();
}
function renderStatCard(id, type, data) {
  const cur = data.cur,
    cost = data.cost,
    profit = cur - cost,
    pct = cost > 0 ? profit / cost * 100 : 0;
  animNum(`sc${id}Val`, cur, fmtC);
  st(`sc${id}Inv`, `مستثمر: ${fmtC(cost)}`);
  const pEl = $(`sc${id}Pnl`);
  if (pEl) {
    if (Math.abs(profit) < 1) {
      pEl.textContent = '—';
      pEl.className = 'sc-pnl neu';
    } else if (profit > 0) {
      pEl.textContent = `▲ ${fmtC(profit)} (+${fmt(pct, 1)}%)`;
      pEl.className = 'sc-pnl pos';
    } else {
      pEl.textContent = `▼ ${fmtC(Math.abs(profit))} (${fmt(pct, 1)}%)`;
      pEl.className = 'sc-pnl neg';
    }
  }
}
function renderDonut(byType, otherTotal) {
  window._lastDonutArgs = [byType, otherTotal];
  const _dc0 = $('donutChart');
  if (_dc0 && _dc0.offsetParent === null) return;
  const pal = ['#c9a84c', '#e3c87d', '#9a7c2e', '#6e6048', '#9c958a'];
  const labs = ['الأملاك', 'الذهب', 'الأسهم', 'النقدي', 'أخرى'];
  const vals = [byType.Property.cur, byType.Gold.cur, byType.Stock.cur, byType.Cash.cur, otherTotal].map(v => Math.max(0, v));
  const total = vals.reduce((a, b) => a + b, 0);
  const dc = $('donutChart');
  if (!dc) return;
  if (donutChart) donutChart.destroy();
  if (!total) {
    dc.getContext('2d')?.clearRect(0, 0, dc.width, dc.height);
    $('donutLeg').innerHTML = '<span style="color:var(--muted);font-size:11px">لا توجد بيانات</span>';
    return;
  }
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart) {
      const {
        ctx,
        chartArea: {
          top,
          bottom,
          left,
          right
        }
      } = chart;
      const cx = (left + right) / 2,
        cy = (top + bottom) / 2;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '600 18px ' + FONT_CANVAS;
      ctx.fillStyle = document.documentElement.classList.contains('ios-light') ? '#1C1C1E' : '#e8e6df';
      ctx.fillText(fmtC(total), cx, cy - 10);
      ctx.font = '400 11px ' + FONT_CANVAS;
      ctx.fillStyle = '#7a7d8a';
      ctx.fillText('إجمالي الثروة', cx, cy + 12);
      ctx.restore();
    }
  };
  donutChart = new Chart(dc, {
    type: 'doughnut',
    plugins: [centerTextPlugin],
    data: {
      labels: labs,
      datasets: [{
        data: vals,
        backgroundColor: pal,
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 8,
        hoverBorderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      animation: {
        animateRotate: true,
        duration: 700,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: ctx => ctx[0].label,
            label: ctx => {
              const v = ctx.raw,
                pct = total > 0 ? (v / total * 100).toFixed(1) : '0';
              return [` ${fmtC(v)}`, ` ${pct}% من الثروة`];
            }
          },
          backgroundColor: '#1c2030',
          titleColor: '#e8e6df',
          bodyColor: '#7a7d8a',
          borderColor: 'rgba(255,255,255,.12)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 10,
          displayColors: true,
          boxWidth: 8,
          boxHeight: 8,
          boxPadding: 4
        }
      }
    }
  });
  $('donutLeg').innerHTML = labs.map((l, i) => vals[i] > 0 ? `<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;background:var(--surf2);border-radius:8px">
        <div style="width:10px;height:10px;border-radius:3px;background:${pal[i]};flex-shrink:0"></div>
        <div>
          <div style="font-size:11px;color:var(--text)">${l}</div>
          <div style="font-size:10px;color:var(--muted)">${total > 0 ? fmt(vals[i] / total * 100, 1) : 0}%</div>
        </div>
      </div>` : '').join('');
}
function renderPerformance(grps) {
  const el = $('perfList');
  if (!el) return;
  if (isMobile()) {
    const typeOrder = ['Property', 'Gold', 'Stock', 'Cash'];
    const typeIcon = {
      Gold: '<i class="ti ti-coin"></i>',
      Stock: '<i class="ti ti-chart-bar"></i>',
      Property: '<i class="ti ti-building"></i>',
      Cash: '<i class="ti ti-cash"></i>'
    };
    const typeColor = {
      Gold: 'var(--text)',
      Stock: 'var(--text)',
      Property: 'var(--text)',
      Cash: 'var(--text)'
    };
    const typeLabel = {
      Gold: 'الذهب',
      Stock: 'الأسهم والصناديق',
      Property: 'الأملاك',
      Cash: 'النقدي'
    };
    const allItems = grps.filter(g => !isExited(g)).map(g => {
      const v = groupCurrentValue(g);
      return {
        ...g,
        cur: v.cur,
        cost: v.cost,
        hasPx: v.hasPx,
        profit: v.cur - v.cost,
        pct: v.cost > 0 ? (v.cur - v.cost) / v.cost * 100 : 0
      };
    });
    let html = '';
    typeOrder.forEach(type => {
      const items = allItems.filter(i => i.assetType === type);
      if (!items.length) return;
      const color = typeColor[type] || 'var(--text)';
      html += `<div style="margin-bottom:12px">
        <div style="font-size:11px;color:var(--muted);font-weight:500;letter-spacing:.05em;margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid var(--bdr)">${typeIcon[type]} ${typeLabel[type]}</div>
        <div style="display:flex;flex-direction:column;gap:5px">`;
      items.forEach(it => {
        const pnlColor = it.profit > 0 ? 'var(--green)' : it.profit < 0 ? 'var(--red)' : 'var(--muted)';
        const pnlTxt = it.hasPx && Math.abs(it.profit) > 1 ? it.profit > 0 ? `▲ ${fmtC(it.profit)} (+${fmt(it.pct, 1)}%)` : `▼ ${fmtC(Math.abs(it.profit))} (${fmt(it.pct, 1)}%)` : '';
        html += `<div class="glass-card" style="background:var(--surf2);border-radius:12px;padding:9px 12px;display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:12px;font-weight:400;color:var(--text)">${it.assetName}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:2px">مستثمر: ${fmtC(it.cost)}</div>
          </div>
          <div style="text-align:left">
            <div style="font-size:12px;font-weight:600;font-family:inherit;color:var(--gold)">${it.hasPx || it.assetType === 'Cash' ? fmtC(it.cur) : '—'}</div>
            ${pnlTxt ? `<div style="font-size:10px;color:${pnlColor};font-weight:600;font-family:inherit;text-align:left;direction:ltr">${pnlTxt}</div>` : ''}
          </div>
        </div>`;
      });
      html += '</div></div>';
    });
    el.innerHTML = html || '<div class="empty">لا توجد بيانات</div>';
    return;
  }
  const colMap = {
    Gold: 'var(--text)',
    Stock: 'var(--text)',
    Property: 'var(--text)',
    Cash: 'var(--text)'
  };
  const typeLabel = {
    Gold: '<i class="ti ti-coin"></i> الذهب',
    Stock: '<i class="ti ti-chart-bar"></i> الأسهم',
    Property: '<i class="ti ti-building"></i> الأملاك',
    Cash: '<i class="ti ti-cash"></i> النقدي'
  };
  const typeOrder = ['Property', 'Gold', 'Stock', 'Cash'];
  const allItems = grps.filter(g => !isExited(g)).map(g => {
    const v = groupCurrentValue(g);
    return {
      ...g,
      cur: v.cur,
      cost: v.cost,
      hasPx: v.hasPx,
      profit: v.cur - v.cost,
      pct: v.cost > 0 ? (v.cur - v.cost) / v.cost * 100 : 0
    };
  });
  if (!allItems.length) {
    el.innerHTML = '<div class="empty">لا توجد بيانات</div>';
    return;
  }
  let html = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem">`;
  typeOrder.forEach(type => {
    const items = allItems.filter(i => i.assetType === type);
    if (!items.length) return;
    const color = colMap[type] || 'var(--muted)';
    html += `<div>
      <div style="font-size:10px;color:var(--muted);font-weight:500;letter-spacing:.06em;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--bdr)">${typeLabel[type]}</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead>
          <tr style="color:var(--muted)">
            <th style="text-align:right;padding:0 0 6px;font-weight:400">الأصل</th>
            <th style="text-align:left;padding:0 0 6px;font-weight:400">مستثمر</th>
            <th style="text-align:left;padding:0 0 6px;font-weight:400">الآن</th>
            <th style="text-align:left;padding:0 0 6px;font-weight:400">ربح/خسارة</th>
          </tr>
        </thead>
        <tbody>`;
    items.forEach(it => {
      const pnlColor = it.profit > 0 ? 'var(--green)' : it.profit < 0 ? 'var(--red)' : 'var(--muted)';
      const pnlTxt = it.hasPx && Math.abs(it.profit) > 1 ? it.profit > 0 ? `▲ ${fmtC(it.profit)} (+${fmt(it.pct, 1)}%)` : `▼ ${fmtC(Math.abs(it.profit))} (${fmt(it.pct, 1)}%)` : '—';
      html += `<tr style="border-top:1px solid var(--wline)">
        <td style="padding:7px 0;font-weight:400;color:var(--text)">${it.assetName}</td>
        <td style="padding:7px 0 7px 8px;color:var(--muted);direction:ltr;font-family:inherit;font-weight:600">${fmtC(it.cost)}</td>
        <td style="padding:7px 0 7px 8px;direction:ltr;font-family:inherit;font-weight:600;color:var(--gold)">${it.hasPx || it.assetType === 'Cash' ? fmtC(it.cur) : '—'}</td>
        <td style="padding:7px 0 7px 8px;color:${pnlColor};direction:ltr;white-space:nowrap;font-family:inherit;font-weight:600;font-size:11px">${pnlTxt}</td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
  });
  html += `</div>`;
  el.innerHTML = html;
}
function toggleTopMenu(e) {
  if (e) e.stopPropagation();
  const m = $('topMenu');
  if (!m) return;
  const willOpen = !m.classList.contains('open');
  m.classList.toggle('open', willOpen);
  if (willOpen) {
    setTimeout(() => {
      const close = ev => {
        if (ev.target.closest('#btnTopMenu')) return;
        m.classList.remove('open');
        document.removeEventListener('click', close, true);
      };
      document.addEventListener('click', close, true);
    }, 0);
  }
}
function toggleScExpand(type) {
  if (!isMobile()) return;
  const panel = $('scExpand-' + type);
  if (!panel) return;
  const wasOpen = panel.classList.contains('open');
  document.querySelectorAll('.sc-expand.open').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('.stat-card.sc-open').forEach(c => c.classList.remove('sc-open'));
  if (wasOpen) return;
  const head = panel.previousElementSibling;
  if (head && head.classList.contains('stat-card')) head.classList.add('sc-open');
  let rows = '';
  if (type === 'Other') {
    const list = (otherSrc || []).filter(s => s.included !== false);
    rows = list.length ? list.map(s => `<div class="sc-exp-row">
      <span style="color:var(--text)">${s.name}</span>
      <span style="font-weight:600;font-family:inherit;color:var(--gold);direction:ltr">${fmtC(pN(s.value))}</span>
    </div>`).join('') : '<div class="sc-exp-row" style="color:var(--muted);border:none">لا توجد مصادر بعد</div>';
  } else {
    const items = buildGroups().filter(g => !isExited(g) && g.assetType === type).map(g => {
      const v = groupCurrentValue(g);
      return {
        ...g,
        cur: v.cur,
        cost: v.cost,
        hasPx: v.hasPx,
        profit: v.cur - v.cost,
        pct: v.cost > 0 ? (v.cur - v.cost) / v.cost * 100 : 0
      };
    });
    rows = items.length ? items.map(it => {
      const pnlColor = it.profit > 0 ? 'var(--green)' : it.profit < 0 ? 'var(--red)' : 'var(--muted)';
      const pnlTxt = it.hasPx && Math.abs(it.profit) > 1 ? it.profit > 0 ? `▲ ${fmtC(it.profit)} (+${fmt(it.pct, 1)}%)` : `▼ ${fmtC(Math.abs(it.profit))} (${fmt(it.pct, 1)}%)` : '';
      return `<div class="sc-exp-row">
        <div style="flex:1;min-width:0">
          <div style="color:var(--text)">${it.assetName}</div>
          <div style="font-size:10.5px;color:var(--muted);margin-top:1px">مستثمر: ${fmtC(it.cost)}</div>
        </div>
        <div style="text-align:left;flex-shrink:0">
          <div style="font-weight:600;font-family:inherit;color:var(--gold);direction:ltr">${it.hasPx || it.assetType === 'Cash' ? fmtC(it.cur) : '—'}</div>
          ${pnlTxt ? `<div style="font-size:10.5px;color:${pnlColor};font-weight:600;font-family:inherit;direction:ltr;margin-top:1px">${pnlTxt}</div>` : ''}
        </div>
      </div>`;
    }).join('') : '<div class="sc-exp-row" style="color:var(--muted);border:none">لا توجد أصول بهذه الفئة</div>';
  }
  panel.innerHTML = rows;
  panel.classList.add('open');
}
function goMarketAsset(id) {
  if (id) mktOpenRow = String(id);
  showPage('market', document.querySelector('.nav-item[data-page="market"]'));
  setTimeout(() => {
    const r = document.querySelector(`.mkt-row[data-mid="${mktOpenRow}"]`);
    if (id && r && r.scrollIntoView) r.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }, 150);
}
function escapePortfolioText(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function renderDashPulse() {
  const el = $('dashPulse');
  if (!el) return;
  const groups = buildGroups();
  const owned = assets.filter(a => a.yahooSym && ['Stock','Gold'].includes(a.type)).map(a => {
    const g = groups.find(g => g.assetName === a.name);
    const raw = marketData[a.yahooSym];
    if (!g || isExited(g) || g.buyQ - g.sellQ <= 0) return null;
    const value = groupCurrentValue(g);
    return {a, change: typeof raw === 'object' && Number.isFinite(raw?.changePct) ? raw.changePct : null, pnl: value.hasPx ? value.cur - value.cost : null};
  }).filter(Boolean);
  const quoted = owned.filter(x => x.change !== null);
  const up = quoted.filter(x => x.change > 0).sort((a,b)=>b.change-a.change)[0];
  const down = quoted.filter(x => x.change < 0).sort((a,b)=>a.change-b.change)[0];
  const best = owned.filter(x => x.pnl !== null).sort((a,b)=>b.pnl-a.pnl)[0];
  const tile = (label, value, detail, tone, id='') => `<button class="day-tile ${tone}" onclick="${escapePortfolioText('goMarketAsset('+JSON.stringify(String(id))+')')}"><span class="day-label">${label}</span><strong class="day-value">${value}</strong><span class="day-detail">${detail}</span><i class="ti ti-chevron-left" aria-hidden="true"></i></button>`;
  const missing = owned.length ? 'بانتظار الأسعار' : 'لا توجد مراكز';
  const ups = quoted.filter(x=>x.change>0).length, downs = quoted.filter(x=>x.change<0).length;
  el.innerHTML = tile('أصولك اليوم', quoted.length ? `<span class="day-up">${ups} ↑</span><span class="day-down">${downs} ↓</span>` : '—', quoted.length ? `${quoted.length} من ${owned.length} أصل لديها تغيّر يومي` : missing, 'day-count')
    + tile('أكبر رابح اليوم', up ? '+'+fmt(up.change,2)+'%' : '—', up ? escapePortfolioText(up.a.name) : quoted.length ? 'لا يوجد أصل صاعد' : missing, 'day-positive', up?.a.id)
    + tile('أكبر خاسر اليوم', down ? fmt(down.change,2)+'%' : '—', down ? escapePortfolioText(down.a.name) : quoted.length ? 'لا يوجد أصل هابط' : missing, 'day-negative', down?.a.id)
    + tile('أفضل مركز · منذ الشراء', best ? (best.pnl>=0?'+':'−')+fmtC(Math.abs(best.pnl)) : '—', best ? escapePortfolioText(best.a.name) : missing, 'day-best', best?.a.id);
  el.style.display = 'grid';
}
function calcPortfolioSections(groups = buildGroups()) {
  const result = {investmentValue:0, investmentCost:0, realized:0, cash:0, property:0, manual:0};
  groups.forEach(g => {
    if (['Stock','Gold'].includes(g.assetType)) result.realized += g.realizedPnL || 0;
    if (isExited(g)) return;
    const v = groupCurrentValue(g);
    if (['Stock','Gold'].includes(g.assetType)) {result.investmentValue += v.cur;result.investmentCost += v.cost;}
    else if (g.assetType === 'Cash') result.cash += v.cur;
    else if (g.assetType === 'Property') result.property += v.cur;
  });
  result.manual = otherSrc.filter(s => s.included !== false && (s.type === 'realized' || (s.type === 'unrealized' && includeUnrealized))).reduce((sum,s)=>sum+pN(s.value),0);
  result.sourcesValue = result.cash + result.property + result.manual;
  return result;
}

(function () {
  let _lastScrollY = 0,
    _downAcc = 0,
    _upAcc = 0,
    _barTick = false;
  function _onBarScroll() {
    const y = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
    const dy = y - _lastScrollY;
    if (Math.abs(dy) > 250) {
      _lastScrollY = y;
      _downAcc = 0;
      _upAcc = 0;
      return;
    }
    if (dy > 0) {
      _downAcc += dy;
      _upAcc = 0;
    } else if (dy < 0) {
      _upAcc -= dy;
      _downAcc = 0;
    }
    const tb = document.querySelector('.top-app-bar'),
      sb = document.querySelector('.sidebar'),
      fb = document.getElementById('fabAdd');
    if (y <= 8 || _upAcc > 34) {
      if (tb) tb.classList.remove('bar-hidden');
      if (sb) sb.classList.remove('bar-hidden');
      if (fb) fb.classList.remove('bar-hidden');
    } else if (_downAcc > 3) {
      if (tb) tb.classList.add('bar-hidden');
      if (sb) sb.classList.add('bar-hidden');
      if (fb) fb.classList.add('bar-hidden');
    }
    _lastScrollY = y;
  }
  window.addEventListener('scroll', function () {
    if (!document.documentElement.classList.contains('is-mobile') || document.documentElement.classList.contains('desk')) return;
    if (_barTick) return;
    _barTick = true;
    requestAnimationFrame(function () {
      _onBarScroll();
      _barTick = false;
    });
  }, {
    passive: true
  });
})();
let pfFilter = 'all',
  pfOpenRow = null;
function setPfFilter(f) {
  pfFilter = f;
  renderPortfolio();
}
function togglePfRow(rowEl) {
  if (!rowEl) return;
  const id = rowEl.getAttribute('data-pfid');
  const wasOpen = rowEl.classList.contains('open');
  document.querySelectorAll('#pfList .mkt-row.open').forEach(r => r.classList.remove('open'));
  if (wasOpen) {
    pfOpenRow = null;
    return;
  }
  rowEl.classList.add('open');
  pfOpenRow = id;
}
function pfQuickTxn(name) {
  openAdd();
  setTimeout(() => {
    const s = $('aAsset');
    if (s) {
      s.value = name;
      if (typeof onAssetSelect === 'function') onAssetSelect();
    }
  }, 100);
}
function pfEditAsset(name) {
  const a = findAsset(name);
  if (a && typeof openEditAsset === 'function') openEditAsset(a.id);
}
const PF_TYPES = {
  Cash: {
    l: 'نقدي',
    i: 'ti-cash',
    c: '#D4B96A'
  },
  Property: {
    l: 'أملاك',
    i: 'ti-building',
    c: '#BD9840'
  },
  Stock: {
    l: 'أسهم',
    i: 'ti-chart-bar',
    c: '#8A6D2F'
  },
  Gold: {
    l: 'ذهب',
    i: 'ti-coin',
    c: '#6e6048'
  }
};
function renderPfMobile(grps) {
  const alloc = $('pfAllocCard'),
    flt = $('pfFilters'),
    list = $('pfList');
  if (!alloc || !flt || !list) return;
  if (!isMobile()) {
    alloc.style.display = 'none';
    flt.style.display = 'none';
    list.style.display = 'none';
    const _r = $('pfRebal');
    if (_r) _r.style.display = 'none';
    return;
  }
  grps = (grps || buildGroups()).filter(g => ['Stock','Gold'].includes(g.assetType));
  const items = grps.map(g => {
    const v = groupCurrentValue(g);
    return {
      g,
      exited: isExited(g),
      cur: v.cur,
      cost: v.cost,
      hasPx: v.hasPx,
      netQ: g.buyQ - g.sellQ,
      profit: v.cur - v.cost,
      pct: v.cost > 0 ? (v.cur - v.cost) / v.cost * 100 : 0
    };
  });
  if (!items.length) {
    alloc.style.display = 'none';
    flt.style.display = 'none';
    list.style.display = 'none';
    return;
  }
  const sums = {};
  let total = 0;
  items.forEach(it => {
    sums[it.g.assetType] = (sums[it.g.assetType] || 0) + Math.max(0, it.cur);
    total += Math.max(0, it.cur);
  });
  const otherTotal = 0; // Manual sources have their own workspace and total.
  const grand = total + otherTotal;
  if (grand > 0) {
    let bar = '',
      leg = '';
    Object.keys(PF_TYPES).forEach(t => {
      if (!sums[t]) return;
      const p = sums[t] / grand * 100;
      bar += `<div style="width:${p.toFixed(2)}%;background:${PF_TYPES[t].c};cursor:pointer;opacity:${pfFilter === 'all' || pfFilter === t ? 1 : .25};transition:opacity .15s" onclick="setPfFilter(pfFilter==='${t}'?'all':'${t}')"></div>`;
      leg += `<span style="cursor:pointer" onclick="setPfFilter(pfFilter==='${t}'?'all':'${t}')"><i style="display:inline-block;width:8px;height:8px;border-radius:3px;background:${PF_TYPES[t].c};margin-left:4px;vertical-align:middle"></i>${PF_TYPES[t].l} <b style="color:var(--text);font-weight:600">${fmt(p, 1)}%</b></span>`;
    });
    if (otherTotal > 0) {
      const p = otherTotal / grand * 100;
      bar += `<div style="width:${p.toFixed(2)}%;background:#C9CBD1;opacity:${pfFilter === 'all' ? 1 : .25}"></div>`;
      leg += `<span><i style="display:inline-block;width:8px;height:8px;border-radius:3px;background:#C9CBD1;margin-left:4px;vertical-align:middle"></i>أخرى <b style="color:var(--text);font-weight:600">${fmt(p, 1)}%</b></span>`;
    }
    $('pfAllocBar').innerHTML = bar;
    $('pfAllocLeg').innerHTML = leg;
    alloc.style.display = '';
  } else alloc.style.display = 'none';
  const fch = (k, lb) => `<button class="mkt-fchip${pfFilter === k ? ' on' : ''}" onclick="setPfFilter('${k}')">${lb}</button>`;
  flt.innerHTML = fch('all', 'الكل') + fch('Stock', 'أسهم') + fch('Gold', 'ذهب') + fch('up', 'رابح ▲') + fch('down', 'خاسر ▼');
  flt.style.display = 'flex';
  let show = items;
  if (PF_TYPES[pfFilter]) show = items.filter(it => it.g.assetType === pfFilter);else if (pfFilter === 'up') show = items.filter(it => !it.exited && it.hasPx && it.profit > 1);else if (pfFilter === 'down') show = items.filter(it => !it.exited && it.hasPx && it.profit < -1);
  const ORD = {
    Stock: 0,
    Gold: 1,
    Property: 2,
    Cash: 3
  };
  show = show.slice().sort((a, b) => (ORD[a.g.assetType] ?? 9) + (a.exited ? 10 : 0) - ((ORD[b.g.assetType] ?? 9) + (b.exited ? 10 : 0)));
  const esc = s => String(s).replace(/'/g, "\\'").replace(/"/g, '&quot;');
  const cell = (l, v, vs = '') => `<div style="background:var(--surf);border:1px solid var(--bdr);border-radius:12px;padding:8px 11px"><div style="font-size:10px;color:var(--muted)">${l}</div><div style="font-size:12.5px;font-weight:600;font-family:inherit;margin-top:2px;direction:ltr;text-align:right;color:var(--muted);${vs}">${v}</div></div>`;
  const rows = show.map(it => {
    const g = it.g,
      T = PF_TYPES[g.assetType] || {
        l: g.assetType
      };
    const showPnl = it.hasPx && it.cost > 0 && Math.abs(it.profit) > 1 && g.assetType !== 'Cash';
    const pill = showPnl ? `<div style="display:inline-block;font-size:10.5px;font-weight:600;font-family:inherit;color:#fff;background:${it.profit >= 0 ? 'var(--green)' : 'var(--red)'};border-radius:7px;padding:2px 8px;margin-top:3px;direction:ltr;min-width:86px;text-align:center;box-sizing:border-box">${it.profit >= 0 ? '▲ ' : '▼ '}${fmtC(Math.abs(it.profit))} (${it.profit >= 0 ? '+' : ''}${fmt(it.pct, 1)}%)</div>` : '';
    let sub = '';
    if (it.exited) sub = `${(g.sellHistory || []).length} عملية بيع · متخارج بالكامل`;else if (g.assetType === 'Cash') sub = 'سيولة جاهزة';else if (g.assetType === 'Property') sub = `مستثمر: ${fmtC(it.cost)}`;else sub = `مستثمر: ${fmtC(it.cost)} · ${fmt(it.netQ, g.assetType === 'Gold' ? 1 : 2)} ${g.assetType === 'Gold' ? 'غ' : 'وحدة'}`;
    let cells = '';
    const weight = grand > 0 ? Math.max(0, it.cur) / grand * 100 : 0;
    if (!it.exited && (g.assetType === 'Gold' || g.assetType === 'Stock')) {
      const lp = getLivePrice(g.assetName);
      let pxTxt = '—',
        pxSub = '';
      if (lp && !lp.error) {
        if (g.assetType === 'Gold' && lp.gramSAR) {
          pxTxt = fmt(lp.gramSAR * sarToBase(1), 1) + ' ' + CUR_SYMS[baseCur] + '/غ';
          if (lp.price != null) pxSub = 'الأونصة عالمياً: $' + fmt(lp.price, 0);
        } else if (lp.price != null) {
          pxTxt = fmt(lp.price, 2) + ' ' + (lp.currency || '');
          if (lp.priceSAR != null) pxSub = '≈ ' + fmtC(lp.priceSAR);
        }
      }
      cells += cell('السعر الحالي', pxTxt + (pxSub ? `<div style="font-size:9px;color:var(--muted);font-weight:500;margin-top:2px">${pxSub}</div>` : ''), 'color:var(--gold)');
      cells += cell('متوسط تكلفتي', fmt((g.fifoAvgCost || 0) * sarToBase(1), 2) + ' ' + CUR_SYMS[baseCur]);
    }
    if (g.assetType === 'Cash') {
      cells += cell('إيداعات', fmtC(g.depSAR || 0));
      cells += cell('سحوبات', fmtC(g.wthSAR || 0));
    }
    if (!it.exited) cells += cell('وزنه من المحفظة', fmt(weight, 1) + '%', 'color:var(--gold)');
    if (g.realizedPnL) cells += cell(it.exited ? 'إجمالي المحقق' : 'ربح محقق سابق', (g.realizedPnL >= 0 ? '+' : '-') + fmtC(Math.abs(g.realizedPnL)), `color:${g.realizedPnL >= 0 ? 'var(--green)' : 'var(--red)'}`);
    let propEditor = '';
    if (g.assetType === 'Property') {
      const rawStored = propVals[g.assetName];
      const stored = rawStored && typeof rawStored === 'object' ? rawStored : {
        raw: rawStored ? String(rawStored) : '',
        cur: 'SAR',
        sar: pN(rawStored || 0)
      };
      const selCur = stored.cur || 'SAR';
      propEditor = `<div style="margin-top:10px">
        <div style="font-size:10px;color:var(--muted);margin-bottom:4px">القيمة السوقية الحالية</div>
        <div style="display:flex;gap:6px;align-items:center">
          <input class="market-input" type="number" step="any" style="margin-top:0;flex:1" placeholder="أدخل التقييم..." value="${stored.raw || ''}"
            onclick="event.stopPropagation()"
            onblur="savePropValWithCur('${esc(g.assetName)}',this.value,this.nextElementSibling.value)">
          <select style="background:var(--surf);border:1px solid var(--bdr);border-radius:7px;padding:6px 8px;color:var(--text);font-family:inherit;font-size:11px;outline:none;flex-shrink:0"
            onclick="event.stopPropagation()"
            onchange="savePropValWithCur('${esc(g.assetName)}',this.previousElementSibling.value,this.value)">
            <option value="SAR" ${selCur === 'SAR' ? 'selected' : ''}>﷼ SAR</option>
            <option value="JOD" ${selCur === 'JOD' ? 'selected' : ''}>د.أ JOD</option>
            <option value="USD" ${selCur === 'USD' ? 'selected' : ''}>$ USD</option>
          </select>
        </div>
      </div>`;
    }
    let sellH = '';
    if (g.sellHistory && g.sellHistory.length) {
      const last = g.sellHistory.slice().reverse();
      const unit = g.assetType === 'Gold' ? 'غ' : 'وحدة';
      const per = (v, q) => q > 0 ? fmt(v / q * sarToBase(1), 2) + ' ' + CUR_SYMS[baseCur] + '/' + unit : '—';
      sellH = `<div style="margin-top:12px">
        <div style="font-size:10px;color:var(--muted);margin-bottom:6px">عمليات البيع</div>
        ${last.map(s => {
        const c = s.pnl >= 0 ? 'var(--green)' : 'var(--red)';
        const box = (l, v, sub, col) => `<div style="background:var(--surf);border:1px solid var(--bdr);border-radius:12px;padding:8px 11px">
            <div style="font-size:10px;color:var(--muted)">${l}</div>
            <div style="font-size:12.5px;font-weight:600;font-family:inherit;margin-top:2px;direction:ltr;text-align:right;color:${col || 'var(--text)'}">${v}</div>
            <div style="font-size:9px;color:var(--muted);margin-top:1px;direction:ltr;text-align:right">${sub}</div>
          </div>`;
        return `<div style="background:var(--surf2);border:1px solid var(--bdr);border-radius:14px;padding:10px 11px;margin-bottom:7px">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px">
              <span style="font-size:11px;color:var(--text)">${s.date} · باع <b style="font-weight:600">${fmt(s.qty, g.assetType === 'Gold' ? 2 : 2)}</b> ${unit}</span>
              <span style="font-size:11px;font-weight:600;font-family:inherit;direction:ltr;color:#fff;background:${c};border-radius:7px;padding:2px 8px;white-space:nowrap">${s.pnl >= 0 ? '▲ +' : '▼ -'}${fmtC(Math.abs(s.pnl))} (${s.pnl >= 0 ? '+' : ''}${fmt(s.pct, 1)}%)</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">
              ${box('تكلفة الشراء (FIFO)', fmtC(s.costBasis), per(s.costBasis, s.qty), 'var(--muted)')}
              ${box('حصيلة البيع', fmtC(s.proceeds), per(s.proceeds, s.qty), 'var(--gold)')}
            </div>
          </div>`;
      }).join('')}
      </div>`;
    }
    const rz = g.realizedPnL || 0;
    const valHtml = it.exited ? `<div style="font-size:14px;font-weight:600;font-family:inherit;color:${rz >= 0 ? 'var(--green)' : 'var(--red)'}">${rz >= 0 ? '+' : '-'}${fmtC(Math.abs(rz))}</div>` : `<div style="font-size:14px;font-weight:600;font-family:inherit;color:var(--gold)">${fmtC(it.cur)}</div>`;
    const canEdit = !!findAsset(g.assetName);
    const acts = `<div style="display:flex;gap:8px;margin-top:10px">
      <button onclick="event.stopPropagation();pfQuickTxn('${esc(g.assetName)}')" style="flex:1;font-family:inherit;font-size:11.5px;font-weight:500;padding:9px;border-radius:11px;border:1px solid rgba(201,168,76,.35);background:rgba(201,168,76,.12);color:var(--gold);cursor:pointer"><i class="ti ti-plus"></i> حركة جديدة</button>
      ${canEdit ? `<button onclick="event.stopPropagation();pfEditAsset('${esc(g.assetName)}')" style="flex:1;font-family:inherit;font-size:11.5px;font-weight:500;padding:9px;border-radius:11px;border:1px solid rgba(201,168,76,.35);background:rgba(201,168,76,.12);color:var(--gold);cursor:pointer"><i class="ti ti-pencil"></i> تعديل الأصل</button>` : ''}
    </div>`;
    return `<div class="mkt-row" data-pfid="${esc(g.assetName)}">
      <div class="mkt-rhead" onclick="togglePfRow(this.parentNode)">
        <div style="flex:1;min-width:0">
          <div style="font-size:13.5px;font-weight:600;display:flex;align-items:center;gap:6px">${g.assetName} <span style="font-size:9px;font-weight:500;color:var(--muted);background:var(--surf2);border:1px solid var(--bdr);border-radius:99px;padding:1px 7px">${T.l}</span>${it.exited ? `<span style="font-size:9px;font-weight:500;color:var(--red);background:rgba(229,72,77,.1);border:1px solid rgba(229,72,77,.25);border-radius:99px;padding:1px 7px">متخارج</span>` : ''}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:1px">${sub}</div>
        </div>
        <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-start;direction:ltr">
          ${valHtml}
          ${it.exited ? '' : pill}
        </div>
      </div>
      <div class="mkt-rbody">
        <div class="mkt-dgrid" style="margin-top:8px">${cells}</div>
        ${propEditor}${sellH}${acts}
      </div>
    </div>`;
  }).join('');
  list.innerHTML = rows || '<div class="empty" style="border:none">لا نتائج لهذا الفلتر</div>';
  list.style.display = 'block';
  const rbc = $('pfRebal'),
    rbb = $('pfRebalBody');
  if (rbc && rbb) {
    const cats = [['Stock', 'أسهم'], ['Gold', 'ذهب'], ['Property', 'أملاك'], ['Cash', 'نقدي']];
    const sumGoals = cats.reduce((a, [k]) => a + (catGoals[k] || 0), 0);
    if (sumGoals > 0 && total > 0) {
      const devRows = cats.map(([k, l]) => {
        const tgt = (catGoals[k] || 0) / sumGoals,
          curV = sums[k] || 0;
        return {
          l,
          delta: tgt * total - curV,
          dev: curV / total * 100 - tgt * 100
        };
      }).filter(r => Math.abs(r.delta) >= total * 0.01).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
      if (devRows.length) {
        rbb.innerHTML = devRows.map(r => {
          const w = Math.min(30, Math.abs(r.dev) * 1.4);
          const col = r.dev > 0 ? 'var(--green)' : 'var(--red)';
          return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--wline);font-size:11.5px">
            <span style="width:46px;flex-shrink:0">${r.l}</span>
            <div style="flex:1;height:7px;background:var(--wline);border-radius:99px;position:relative;direction:ltr">
              <i style="position:absolute;top:0;bottom:0;${r.dev > 0 ? 'right:50%' : 'left:50%'};width:${w.toFixed(1)}%;background:${col};opacity:.8;border-radius:99px"></i>
              <i style="position:absolute;top:-2px;bottom:-2px;left:calc(50% - 1px);width:2px;background:var(--muted);border-radius:99px"></i>
            </div>
            <span style="width:96px;flex-shrink:0;text-align:left;direction:ltr;font-weight:600;font-family:inherit;font-size:11px;color:${col}">${r.dev > 0 ? '+' : '−'}${fmtC(Math.abs(r.delta))}</span>
          </div>`;
        }).join('') + `<div style="font-size:9.5px;color:var(--muted);opacity:.75;text-align:center;margin-top:8px">أخضر = فوق وزنه المستهدف · أحمر = أقل من المستهدف — التفاصيل بصفحة الأهداف</div>`;
      } else {
        rbb.innerHTML = '<div style="font-size:11.5px;color:var(--green);padding:4px 0">✓ محفظتك متوازنة مع أهدافك</div>';
      }
      rbc.style.display = '';
    } else rbc.style.display = 'none';
  }
  if (pfOpenRow) {
    const r = list.querySelector(`.mkt-row[data-pfid="${pfOpenRow.replace(/"/g, '&quot;')}"]`);
    if (r) r.classList.add('open');
  }
}
function renderPortfolio() {
  const grps = buildGroups();
  try {
    renderPfMobile(grps);
  } catch (_e) {}
  const byType = {
    Property: [],
    Gold: [],
    Stock: [],
    Cash: []
  };
  grps.forEach(g => {
    if (byType[g.assetType]) byType[g.assetType].push(g);
  });
  $('emptyPortfolio').style.display = grps.some(g=>['Stock','Gold'].includes(g.assetType)) ? 'none' : 'block';
  let tCost = 0,
    tVal = 0;
  const goldHTML = byType.Gold.filter(g => !isExited(g)).map(g => {
    const netQ = g.buyQ - g.sellQ,
      avgC = g.fifoAvgCost || 0,
      costB = netQ * avgC;
    const lp = getLivePrice(g.assetName),
      has = lp && !lp.error && lp.gramSAR;
    const curV = has ? netQ * lp.gramSAR : null,
      pnl = curV != null ? curV - costB : null,
      pct = costB > 0 && pnl != null ? pnl / costB * 100 : null;
    if (has) {
      tCost += costB;
      tVal += curV;
    } else {
      tCost += costB;
      tVal += costB;
    }
    const ast = findAsset(g.assetName);
    return `<div class="asset-card"><div class="ac-head"><div class="ac-name"><i class="ti ti-coin"></i> ${g.assetName}</div>${ast?.tvSym ? `<div class="ac-sym">${ast.tvSym}</div>` : ''}</div>
      <div class="ac-meta">${fmt(netQ, 3)} غرام · متوسط: ${fmt(avgC * sarToBase(1), 1)} ${CUR_SYMS[baseCur]}/g</div>
      <div class="ac-meta">التكلفة: ${fmtC(costB)}</div>
      ${has ? `<div style="font-size:10px;color:var(--muted)">${lp.src || ''}</div>
        <div class="ac-divider"><div><div class="ac-price-label">سعر الغرام (بيع)</div><div class="ac-price">${fmt(lp.gramSAR * sarToBase(1), 1)} ${CUR_SYMS[baseCur]}/g</div><div class="ac-price-sub">القيمة: ${fmtC(curV)}</div></div>
        <div class="pnl ${pnl >= 0 ? 'pos' : 'neg'}">${pnl >= 0 ? '▲' : '▼'} ${fmtC(Math.abs(pnl))}<br><span style="font-size:10px">${pct >= 0 ? '+' : ''}${fmt(pct, 1)}%</span></div></div>` : `<div class="ac-waiting">${lp?.error || 'اضغط تحديث الأسعار'}</div>`}
    </div>`;
  }).join('');
  byType.Gold.filter(g => isExited(g)).forEach(g => {});
  const stockHTML = byType.Stock.filter(g => !isExited(g)).map(g => {
    const netQ = g.buyQ - g.sellQ,
      avgC = g.fifoAvgCost || 0,
      costB = netQ * avgC;
    const lp = getLivePrice(g.assetName),
      has = lp && !lp.error && lp.priceSAR;
    const curV = has ? netQ * lp.priceSAR : null,
      pnl = curV != null ? curV - costB : null,
      pct = costB > 0 && pnl != null ? pnl / costB * 100 : null;
    if (has) {
      tCost += costB;
      tVal += curV;
    } else {
      tCost += costB;
      tVal += costB;
    }
    const sym = findAsset(g.assetName)?.tvSym || g.assetName;
    return `<div class="asset-card"><div class="ac-head"><div class="ac-name"><i class="ti ti-chart-bar"></i> ${g.assetName}</div><div class="ac-sym">${sym}</div></div>
      <div class="ac-meta">${fmt(netQ, 3)} وحدة · متوسط: ${fmt(avgC * sarToBase(1), 2)} ${CUR_SYMS[baseCur]}</div>
      <div class="ac-meta">التكلفة: ${fmtC(costB)}</div>
      ${has ? `<div class="ac-divider"><div><div class="ac-price-label">السعر (${lp.currency})</div><div class="ac-price" >${fmt(lp.price, 2)} <span style="font-size:10px">${lp.currency}</span></div><div class="ac-price-sub">≈ ${fmtC(lp.priceSAR)} · القيمة: ${fmtC(curV)}</div></div>
        <div class="pnl ${pnl >= 0 ? 'pos' : 'neg'}">${pnl >= 0 ? '▲' : '▼'} ${fmtC(Math.abs(pnl))}<br><span style="font-size:10px">${pct >= 0 ? '+' : ''}${fmt(pct, 1)}%</span></div></div>` : lp?.error ? `<div class="ac-waiting" style="color:var(--red)">${lp.error}</div>` : `<div class="ac-waiting">اضغط تحديث الأسعار</div>`}
    </div>`;
  }).join('');
  byType.Stock.filter(g => isExited(g)).forEach(g => {});
  const propHTML = byType.Property.filter(g => !isExited(g)).map(g => {
    const cost = g.buySAR - g.sellSAR;
    const rawStored = propVals[g.assetName];
    const stored = rawStored && typeof rawStored === 'object' ? rawStored : {
      raw: rawStored ? String(rawStored) : '',
      cur: 'SAR',
      sar: pN(rawStored || 0)
    };
    const mValSAR = pN(stored.sar || 0);
    if (mValSAR > 0) {
      tCost += cost;
      tVal += mValSAR;
    } else {
      tCost += cost;
      tVal += cost;
    }
    const pnl = mValSAR ? mValSAR - cost : null,
      pct = cost > 0 && pnl != null ? pnl / cost * 100 : null;
    const selCur = stored.cur || 'SAR';
    const dispVal = stored.raw || '';
    return sourcePositionCard(g.assetName, 'أملاك', fmtC(mValSAR > 0 ? mValSAR : cost), 'مستثمر: ' + fmtC(cost), `<div class="source-detail-title">تقييم الأصل</div>
      <div class="ac-meta">التكلفة: ${fmtC(cost)}</div>
      <label style="font-size:10px;color:var(--muted);margin-top:6px;display:block;margin-bottom:4px">القيمة السوقية الحالية</label>
      <div style="display:flex;gap:6px;align-items:center">
        <input class="market-input" type="number" step="any" style="margin-top:0;flex:1" placeholder="أدخل التقييم..."
          value="${dispVal}"
          onblur="savePropValWithCur('${g.assetName}',this.value,this.nextElementSibling.value)">
        <select style="background:var(--surf);border:1px solid var(--bdr);border-radius:7px;padding:6px 8px;color:var(--text);font-family:inherit;font-size:11px;outline:none;flex-shrink:0"
          onchange="savePropValWithCur('${g.assetName}',this.previousElementSibling.value,this.value)">
          <option value="SAR" ${selCur === 'SAR' ? 'selected' : ''}>﷼ SAR</option>
          <option value="JOD" ${selCur === 'JOD' ? 'selected' : ''}>د.أ JOD</option>
          <option value="USD" ${selCur === 'USD' ? 'selected' : ''}>$ USD</option>
        </select>
      </div>
      ${mValSAR > 0 ? `<div style="font-size:10px;color:var(--muted);margin-top:4px">= ${fmtC(mValSAR)}</div>` : ''}
      ${pnl != null ? `<div class="pnl ${pnl >= 0 ? 'pos' : 'neg'}" style="margin-top:4px">${pnl >= 0 ? '▲' : '▼'} ${fmtC(Math.abs(pnl))} (${pct >= 0 ? '+' : ''}${fmt(pct, 1)}%)</div>` : ''}
      <div class="source-actions"><button class="btn-sm" onclick="${escapePortfolioText('pfQuickTxn('+JSON.stringify(g.assetName)+')')}">إضافة حركة</button><button class="btn-sm" onclick="${escapePortfolioText('pfEditAsset('+JSON.stringify(g.assetName)+')')}">تعديل الأصل</button></div>
    `);
  }).join('');
  const cashHTML = byType.Cash.map(g => {
    const net = g.depSAR - g.wthSAR;
    return sourcePositionCard(g.assetName, 'نقدي', fmtC(net), 'سيولة جاهزة', `<div class="source-detail-title">حركة الرصيد</div>
      <div class="ac-meta">إيداع: ${fmtC(g.depSAR)} · سحب: ${fmtC(g.wthSAR)}</div>
      <div style="font-size:1rem;font-weight:600;font-family:inherit;color:${net >= 0 ? 'var(--green)' : 'var(--red)'};border-top:1px solid var(--bdr);padding-top:9px;margin-top:3px">${net >= 0 ? '+' : '-'}${fmtC(Math.abs(net))}</div>
      <div class="source-actions"><button class="btn-sm" onclick="${escapePortfolioText('pfQuickTxn('+JSON.stringify(g.assetName)+')')}">إضافة حركة</button><button class="btn-sm" onclick="${escapePortfolioText('pfEditAsset('+JSON.stringify(g.assetName)+')')}">تعديل الأصل</button></div>
    `);
  }).join('');
  const sellGroups = grps.filter(g => (g.assetType === 'Gold' || g.assetType === 'Stock' || g.assetType === 'Property') && g.sellHistory?.length);
  const exitedHTML = sellGroups.map(g => {
    const fullyExited = isExited(g);
    const realized = g.realizedPnL || 0;
    const totalPct = g.buySAR > 0 ? realized / g.buySAR * 100 : 0;
    const icon = {
      Gold: '<i class="ti ti-coin"></i>',
      Stock: '<i class="ti ti-chart-bar"></i>',
      Property: '<i class="ti ti-building"></i>'
    }[g.assetType] || '';
    const uid = g.assetName.replace(/[^a-z0-9]/gi, '_');
    const sellRows = g.sellHistory.map((s, idx) => {
      const isLastSell = idx === g.sellHistory.length - 1;
      const badgeHtml = isLastSell && fullyExited ? `<span style="background:rgba(239,68,68,.18);color:#f87171;border:1px solid rgba(239,68,68,.3);padding:2px 10px;border-radius:20px;font-size:11px">خروج كامل</span>` : `<span style="background:rgba(201,168,76,.18);color:var(--gold);border:1px solid rgba(201,168,76,.3);padding:2px 10px;border-radius:20px;font-size:11px">خروج جزئي</span>`;
      const pnlColor = s.pnl >= 0 ? 'var(--green)' : 'var(--red)';
      const pnlBorder = s.pnl >= 0 ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)';
      const pnlBg = s.pnl >= 0 ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.08)';
      return `<div style="background:var(--wline);border:1px solid var(--wline);border-radius:12px;padding:10px 12px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          ${badgeHtml}
          <span style="font-size:12px;color:var(--muted);direction:ltr">${s.date} · ${fmt(s.qty, 2)} وحدة</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
          <div style="background:var(--surf2);border-radius:9px;padding:8px 10px;text-align:center">
            <div style="font-size:10px;color:var(--muted);margin-bottom:4px">تكلفة الشراء</div>
            <div style="font-size:12px;font-weight:600;font-family:inherit">${fmtC(s.costBasis)}</div>
          </div>
          <div style="background:var(--surf2);border-radius:9px;padding:8px 10px;text-align:center">
            <div style="font-size:10px;color:var(--muted);margin-bottom:4px">حصيلة البيع</div>
            <div style="font-size:12px;font-weight:600;font-family:inherit">${fmtC(s.proceeds)}</div>
          </div>
          <div style="background:${pnlBg};border:1px solid ${pnlBorder};border-radius:9px;padding:8px 10px;text-align:center">
            <div style="font-size:10px;color:var(--muted);margin-bottom:4px">ربح / خسارة</div>
            <div style="font-size:12px;font-weight:500;color:${pnlColor}">${s.pnl >= 0 ? '▲' : '▼'} ${fmtC(Math.abs(s.pnl))}</div>
            <div style="font-size:10px;color:${pnlColor}">${s.pnl >= 0 ? '+' : ''}${fmt(s.pct, 1)}%</div>
          </div>
        </div>
      </div>`;
    }).join('');
    return `<div class="asset-card">
      <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" onclick="toggleSellCard('${uid}')">
        <div class="ac-name">${icon} ${g.assetName}</div>
        <div style="display:flex;align-items:center;gap:8px">
          ${!fullyExited ? `<div class="ac-sym" style="background:rgba(201,168,76,.12);color:var(--gold);font-size:11px">${fmt(g.buyQ - g.sellQ, 2)} متبقي</div>` : ''}
          <i class="ti ti-chevron-down" id="chev_${uid}" style="color:var(--muted);font-size:14px;transition:transform .2s"></i>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0 0;font-size:12px;color:var(--muted)">
        <span>${g.sellHistory.length} عملية بيع</span>
        <span style="color:${realized >= 0 ? 'var(--green)' : 'var(--red)'};font-weight:500">${realized >= 0 ? '▲' : '▼'} ${fmtC(Math.abs(realized))} (${realized >= 0 ? '+' : ''}${fmt(totalPct, 1)}%)</span>
      </div>
      <div id="body_${uid}" style="display:none;margin-top:12px">
        ${sellRows}
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--bdr)">
          <span style="font-size:12px;color:var(--muted)">إجمالي الأرباح المحققة</span>
          <span style="font-size:13px;font-weight:500;color:${realized >= 0 ? 'var(--green)' : 'var(--red)'};direction:ltr">
            ${realized >= 0 ? '▲' : '▼'} ${fmtC(Math.abs(realized))} (${realized >= 0 ? '+' : ''}${fmt(totalPct, 1)}%)
          </span>
        </div>
      </div>
    </div>`;
  }).join('');
  const exitedSec = $('secExited'),
    exitedCards = $('exitedCards');
  if (exitedSec && exitedCards) {
    exitedSec.style.display = sellGroups.length ? 'block' : 'none';
    exitedCards.innerHTML = exitedHTML || '<div class="empty">لا توجد عمليات بيع</div>';
  }
  [['secGold', 'goldCards', goldHTML, byType.Gold.filter(g => !isExited(g))], ['secStock', 'stockCards', stockHTML, byType.Stock.filter(g => !isExited(g))], ['secProp', 'propCards', propHTML, byType.Property], ['secCash', 'cashCards', cashHTML, byType.Cash]].forEach(([sec, cards, html, items]) => {
    const s = $(sec),
      c = $(cards);
    if (!s || !c) return;
    s.style.display = items.length ? 'block' : 'none';
    c.innerHTML = html || '<div class="empty">لا توجد بيانات</div>';
  });
  const sections = calcPortfolioSections(grps);
  tCost = sections.investmentCost; tVal = sections.investmentValue;
  [['sourcesTotal',sections.sourcesValue],['sourcesCash',sections.cash],['sourcesProperty',sections.property],['sourcesManual',sections.manual]].forEach(([id,value])=>st(id,fmtC(value)));
  $('totalsRow').style.display = 'grid';
  {
    const pnl = tVal - tCost;
    animNum('tCost', tCost, fmtC);
    animNum('tVal', tVal, fmtC);
    const el = $('tPnL');
    if (el) {
      el.textContent = (pnl >= 0 ? '+' : '-') + fmtC(Math.abs(pnl));
      el.style.color = pnl >= 0 ? 'var(--green)' : 'var(--red)';
    }
    const totalRealized = sections.realized;
    const rEl = $('tRealized');
    if (rEl) {
      if (totalRealized === 0) {
        rEl.textContent = '—';
        rEl.style.color = 'var(--muted)';
      } else {
        rEl.textContent = (totalRealized >= 0 ? '+' : '-') + fmtC(Math.abs(totalRealized));
        rEl.style.color = totalRealized >= 0 ? 'var(--green)' : 'var(--red)';
      }
    }
  }
}
function savePropValWithCur(name, rawVal, cur) {
  if (rawVal === '' || rawVal === null || rawVal === undefined) return;
  const raw = parseFloat(rawVal);
  if (isNaN(raw) || raw <= 0) return;
  const c = cur || 'SAR';
  let sar = raw;
  if (c === 'JOD') sar = raw * (fx.JOD || 5.30);else if (c === 'USD') sar = raw * (fx.USD || 3.75);else if (c === 'GBP') sar = raw * (fx.GBP || 4.73);
  propVals[name] = {
    raw: String(rawVal),
    cur: c,
    sar: sar
  };
  savePVals();
  renderAll();
}
function savePropVal(name, val) {
  savePropValWithCur(name, val, 'SAR');
}
function sourcePositionCard(name, type, value, subtitle, content, included = true) {
  const sourceKey = type + ':' + name;
  const open = [...document.querySelectorAll('details.source-position[open]')].some(el => el.dataset.sourceKey === sourceKey);
  return `<details class="asset-card source-position" data-source-key="${escapePortfolioText(sourceKey)}" ${open ? 'open' : ''} style="opacity:${included ? 1 : .6}"><summary class="mkt-rhead"><span class="source-identity"><strong>${escapePortfolioText(name)} <small>${type}</small></strong><span>${subtitle}</span></span><span class="source-value">${value}<i class="ti ti-chevron-down" aria-hidden="true"></i></span></summary><div class="source-body">${content}</div></details>`;
}
function renderOtherSources() {
  const el = $('otherList');
  if (!el) return;
  if (!otherSrc.length) {
    el.innerHTML = '<div class="empty" style="grid-column:span 2;padding:1.5rem">لم تضف أي مصادر بعد — مثال: وديعة، سيارة، ذهب غير مسجل...</div>';
    return;
  }
  el.innerHTML = otherSrc.map(s => {
    const inc = s.included !== false;
    return sourcePositionCard(s.name, s.type === 'realized' ? 'محققة' : 'غير محققة', fmtC(pN(s.value)), inc && (s.type === 'realized' || includeUnrealized) ? 'مضمّنة في الإجمالي' : 'مستثناة من الإجمالي', `
      <div class="ac-head">
        <label style="display:flex;align-items:center;gap:7px;cursor:pointer">
          <input type="checkbox" ${inc ? 'checked' : ''} style="width:15px;height:15px;accent-color:var(--gold);cursor:pointer;flex-shrink:0"
            onchange="toggleOtherIncluded(${s.id},this.checked)">
          <div class="ac-name"><i class="ti ti-layout-list"></i> ${s.name}</div>
        </label>
        <span class="other-type-tag ${s.type === 'realized' ? 'other-type-realized' : 'other-type-unrealized'}">${s.type === 'realized' ? 'محققة' : 'غير محققة'}</span>
      </div>
      <div class="ac-divider" style="margin-top:auto">
        <div>
          <div class="ac-price-label">${inc && (s.type === 'realized' || includeUnrealized) ? 'مضمّنة في الإجمالي' : 'مستثناة من الإجمالي'}</div>
          <div class="ac-price">${fmtC(pN(s.value))}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn-xs" onclick="openEditOther(${s.id})" style="color:var(--muted)"><i class="ti ti-edit"></i> تعديل</button>
          <button class="btn-xs" onclick="delOther(${s.id})"><i class="ti ti-trash"></i></button>
        </div>
      </div>
    `, inc);
  }).join('');
}
function toggleOtherIncluded(id, included) {
  const s = otherSrc.find(x => x.id === id);
  if (!s) return;
  s.included = included;
  saveOther();
  renderAll();
}
function delOther(id) {
  otherSrc = otherSrc.filter(s => s.id !== id);
  saveOther();
  renderAll();
}
function openEditOther(id) {
  const s = otherSrc.find(x => x.id === id);
  if (!s) return;
  $('otName').value = s.name;
  const rawCur = s.rawCur || 'SAR';
  const rawVal = s.rawValue || s.value;
  $('otValue').value = rawVal;
  $('otCurrency').value = rawCur;
  $('otRate').value = '';
  $('otRateRow').style.display = rawCur !== 'SAR' ? '' : 'none';
  $('otSarPreview').textContent = rawCur !== 'SAR' && s.value > 0 ? '≈ ' + fmt(s.value, 0) + ' ﷼' : '';
  $('otType').value = s.type || 'realized';
  $('otEditId').value = id;
  $('otModalTitle').innerHTML = '<i class="ti ti-edit"></i> تعديل المصدر';
  openModal('otherModal');
}
function renderRegistry(byType, totalCur) {
  const grid = $('regGrid');
  if (!grid) return;
  const typeIcon = {
    Gold: '<i class="ti ti-coin"></i>',
    Stock: '<i class="ti ti-chart-bar"></i>',
    Property: '<i class="ti ti-building"></i>',
    Cash: '<i class="ti ti-cash"></i>'
  };
  const typeLabel = {
    Gold: 'ذهب',
    Stock: 'أسهم وصناديق',
    Property: 'أملاك',
    Cash: 'نقدي'
  };
  const typeOrder = ['Property', 'Gold', 'Stock', 'Cash'];
  const groups = {};
  assets.forEach(a => {
    if (!groups[a.type]) groups[a.type] = [];
    groups[a.type].push(a);
  });
  const _chips = $('assetChips');
  if (_chips) {
    const mkt = a => {
      const m = (a.yahooSym || '').match(/\.([A-Za-z]{1,4})$/);
      return m ? m[1].toUpperCase() : a.currency || '—';
    };
    const nMarkets = new Set(assets.filter(a => a.type !== 'Cash' && a.type !== 'Property').map(mkt)).size;
    const nCurs = new Set(assets.map(a => a.currency).filter(Boolean)).size;
    _chips.innerHTML = `<div class="xr-chip"><div class="v gold">${assets.length}</div><div class="l">أصل</div></div>` + `<div class="xr-chip"><div class="v">${nMarkets}</div><div class="l">أسواق</div></div>` + `<div class="xr-chip"><div class="v">${nCurs}</div><div class="l">عملات</div></div>`;
  }
  const _tot = totalCur || 0;
  grid.innerHTML = typeOrder.filter(t => groups[t]?.length).map(type => {
    const _v = byType && byType[type] ? byType[type].cur : 0;
    const _w = _tot > 0 ? _v / _tot * 100 : 0;
    return `
    <div class="xr-card" style="margin-bottom:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:9px">
        <div style="font-size:12.5px;font-weight:500;display:flex;align-items:center;gap:7px">
          <span style="color:var(--gold);font-size:15px">${typeIcon[type] || ''}</span> ${typeLabel[type] || type}
        </div>
        <div style="text-align:left">
          <div style="font-size:12px;font-weight:600;font-family:inherit;color:var(--gold)">${fmtC(_v)}</div>
          <div style="font-size:9.5px;color:var(--muted)">${_w.toFixed(0)}% من المحفظة</div>
        </div>
      </div>
      <div class="xr-bar" style="margin-bottom:11px"><div style="width:${Math.min(100, _w)}%"></div></div>
      <div style="display:flex;flex-direction:column;gap:5px">
        ${groups[type].map(a => `
        <div class="glass-card" style="background:var(--surf2);border-radius:12px;padding:10px 14px;display:flex;align-items:center;gap:12px">
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:400;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.name}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:2px;display:flex;gap:10px;direction:ltr;text-align:left">
              <span>${a.currency || ''}</span>
              ${a.yahooSym ? `<span style="font-family:inherit">${a.yahooSym}</span>` : ''}
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            <button class="btn-xs" style="padding:4px 10px;font-size:11px" onclick="openEditAsset('${a.id}')"><i class="ti ti-edit"></i></button>
            ${!DEFAULT_ASSETS.find(d => d.id === a.id) ? `<button class="btn-xs" style="padding:4px 10px;font-size:11px;color:var(--red)" onclick="deleteAsset('${a.id}')"><i class="ti ti-trash"></i></button>` : ''}
          </div>
        </div>`).join('')}
      </div>
    </div>`;
  }).join('');
}
let selectedIds = new Set();
let _deletedBackup = null;
let editingId = null;
let _mobileEditId = null;
let collapsedMonths = new Set();
let txnCostExpanded = false;
let txnRateVisible = false;
let _txnLens = 'time';
function setTxnLens(v) {
  _txnLens = v;
  document.querySelectorAll('.txn-lens').forEach(b => b.classList.toggle('on', b.dataset.lens === v));
  const timeEls = [$('txnGrouped')];
  const assetEl = $('txnByAsset');
  if (v === 'asset') {
    timeEls.forEach(e => {
      if (e) e.style.display = 'none';
    });
    if (assetEl) assetEl.style.display = 'block';
    renderTxnByAsset();
  } else {
    timeEls.forEach(e => {
      if (e) e.style.display = '';
    });
    if (assetEl) assetEl.style.display = 'none';
  }
}
function toggleAssetRow(rowEl) {
  if (!rowEl) return;
  const open = rowEl.classList.contains('open');
  if (rowEl.closest('#txnByAsset')) document.querySelectorAll('#txnByAsset .mkt-row.open').forEach(r => r.classList.remove('open'));
  if (!open) rowEl.classList.add('open');
}
function renderTxnByAsset() {
  const box = $('txnByAsset');
  if (!box) return;
  let grps;
  try {
    grps = buildGroups();
  } catch (_e) {
    grps = [];
  }
  const CATL = {
    Stock: 'أسهم',
    Gold: 'ذهب',
    Property: 'أملاك',
    Cash: 'نقدي'
  };
  const ACTL = {
    Buy: 'شراء',
    Sell: 'بيع',
    Deposit: 'إيداع',
    Withdrawal: 'سحب'
  };
  const ACTC = {
    Buy: 'var(--gold)',
    Sell: 'var(--green)',
    Deposit: 'var(--green)',
    Withdrawal: 'var(--red)'
  };
  const ACTI = {
    Buy: 'ti-arrow-down-left',
    Sell: 'ti-arrow-up-right',
    Deposit: 'ti-arrow-bar-to-down',
    Withdrawal: 'ti-arrow-bar-up'
  };
  const rows = grps.map(g => {
    const cnt = (g.txns || []).length;
    const last = (g.txns || []).reduce((mx, t) => t.date > mx ? t.date : mx, '');
    const net = g.assetType === 'Cash' ? (g.depSAR || 0) - (g.wthSAR || 0) : (g.buySAR || 0) - (g.sellSAR || 0);
    const initials = (g.assetName || '?').replace(/[^A-Za-z\u0600-\u06FF]/g, '').slice(0, 2).toUpperCase() || '؟';
    return {
      g,
      cnt,
      last,
      net,
      catL: CATL[g.assetType] || g.assetType,
      initials
    };
  }).filter(r => r.cnt > 0);
  const TORD = {
    Stock: 0,
    Gold: 1,
    Property: 2,
    Cash: 3
  };
  rows.sort((a, b) => {
    const d = (TORD[a.g.assetType] ?? 9) - (TORD[b.g.assetType] ?? 9);
    return d !== 0 ? d : b.net - a.net;
  });
  if (!rows.length) {
    box.innerHTML = '<div class="empty">لا توجد حركات</div>';
    return;
  }
  box.innerHTML = `<div style="font-size:10.5px;color:var(--muted);margin:-2px 2px 12px">حركاتك على كل أصل — اضغط أي أصل لرؤية حركاته الزمنية</div>
  <div class="mkt-list">` + rows.map(r => {
    const txns = [...(r.g.txns || [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const inner = txns.map(t => {
      const c = ACTC[t.action] || 'var(--text)';
      const v = Math.abs(pN(t.totalCostSAR));
      const cur = t.currency || 'SAR';
      const sign = t.action === 'Sell' || t.action === 'Deposit' ? '+' : t.action === 'Withdrawal' ? '-' : '';
      const icoBg = {
        ['var(--gold)']: 'rgba(189,152,64,.13)',
        ['var(--green)']: 'rgba(52,168,83,.12)',
        ['var(--red)']: 'rgba(229,72,77,.1)'
      }[c] || 'var(--surf2)';
      const cells = [];
      if (t.qty) cells.push(['الكمية', fmt(pN(t.qty), r.g.assetType === 'Gold' ? 1 : 2) + (r.g.assetType === 'Gold' ? ' غ' : '')]);
      if (t.price) cells.push(['سعر الوحدة', fmt(pN(t.price), 2) + ' ' + cur]);
      if (t.rate && cur !== 'SAR') cells.push(['سعر الصرف وقتها', '1 ' + cur + ' = ' + fmt(pN(t.rate), 3) + ' ﷼']);
      if (t.fees && pN(t.fees) > 0) cells.push(['الرسوم', fmt(pN(t.fees), 2) + ' ' + cur]);
      const cellsHtml = cells.map(cc => `<div style="background:var(--surf);border:1px solid var(--bdr);border-radius:12px;padding:8px 11px"><div style="font-size:10px;color:var(--muted)">${cc[0]}</div><div style="font-size:12.5px;font-weight:600;font-family:inherit;margin-top:2px;direction:ltr;text-align:right;color:var(--gold)">${cc[1]}</div></div>`).join('');
      const linkHtml = t.linkedTxnId ? `<div style="display:flex;align-items:center;gap:7px;background:rgba(189,152,64,.07);border:1px solid rgba(189,152,64,.2);border-radius:11px;padding:8px 11px;margin-top:8px;font-size:10.5px;color:var(--gold)"><i class="ti ti-link"></i> مرتبطة بحركة كاش تلقائية</div>` : '';
      const remHtml = t.remarks ? `<div style="font-size:10.5px;color:var(--muted);margin-top:8px">${t.remarks}</div>` : '';
      return `<div class="mkt-row" data-txid="${t.id}">
        <div class="mkt-rhead" style="padding:11px 0;gap:10px" onclick="toggleTxnRow(this.parentNode)">
          <div style="width:28px;height:28px;border-radius:9px;background:${icoBg};color:${c};display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0"><i class="ti ${ACTI[t.action] || 'ti-circle'}"></i></div>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:500">${t.incomeType==='Dividend'?'إيداع توزيعات · '+escapePortfolioText(t.sourceAssetName):ACTL[t.action] || t.action}</div>
            <div style="font-size:9.5px;color:var(--muted);margin-top:1px">${t.date || ''}${t.qty ? ' · ' + fmt(pN(t.qty), r.g.assetType === 'Gold' ? 1 : 2) + (r.g.assetType === 'Gold' ? ' غ' : ' وحدة') : ''}</div>
          </div>
          <div style="flex-shrink:0;text-align:left;direction:ltr;font-size:12.5px;font-weight:600;font-family:inherit;color:${c}">${sign}${fmtC(v)}</div>
        </div>
        <div class="mkt-rbody" style="padding-left:0;padding-right:0">
          ${cellsHtml ? `<div class="mkt-dgrid" style="margin-top:8px">${cellsHtml}</div>` : ''}
          ${linkHtml}${remHtml}
          <div style="display:flex;gap:8px;margin-top:10px">
            <button onclick="event.stopPropagation();startEdit(${t.id})" style="flex:1;font-family:inherit;font-size:11.5px;font-weight:500;padding:9px;border-radius:11px;border:1px solid rgba(189,152,64,.35);background:rgba(189,152,64,.12);color:var(--gold);cursor:pointer"><i class="ti ti-pencil"></i> تعديل</button>
            <button onclick="event.stopPropagation();delTxn(${t.id})" style="flex:1;font-family:inherit;font-size:11.5px;font-weight:500;padding:9px;border-radius:11px;border:1px solid rgba(229,72,77,.3);background:rgba(229,72,77,.08);color:var(--red);cursor:pointer"><i class="ti ti-trash"></i> حذف</button>
          </div>
        </div>
      </div>`;
    }).join('');
    return `<div class="mkt-row" data-aid="${r.g.assetName}">
      <div class="mkt-rhead" onclick="toggleAssetRow(this.parentNode)">
        <div style="width:34px;height:34px;border-radius:10px;background:var(--surf2);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--gold);flex-shrink:0;font-family:inherit">${r.initials}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600">${r.g.assetName} <span style="font-size:9px;font-weight:500;color:var(--muted);background:var(--surf2);border:1px solid var(--bdr);border-radius:99px;padding:1px 7px">${r.catL}</span></div>
          <div style="font-size:9.5px;color:var(--muted);margin-top:1px">${r.cnt} حركة${r.last ? ' · آخرها ' + r.last : ''}</div>
        </div>
        <div style="flex-shrink:0;text-align:left;direction:ltr">
          <div style="font-size:13px;font-weight:600;font-family:inherit;color:var(--gold)">${fmtC(r.net)}</div>
          <div style="font-size:9px;color:var(--muted)">صافي مستثمر</div>
        </div>
      </div>
      <div class="mkt-rbody" style="padding-top:2px">${inner}</div>
    </div>`;
  }).join('') + `</div>`;
}
function updateTxnInsightLine() {
  const line = $('txnInsightLine');
  if (!line) return;
  const buyByMonth = {};
  txns.forEach(t => {
    if (t.action === 'Buy') {
      const m = (t.date || '').slice(0, 7);
      if (m) buyByMonth[m] = (buyByMonth[m] || 0) + Math.abs(pN(t.totalCostSAR));
    }
  });
  const months = Object.keys(buyByMonth);
  if (!months.length) {
    line.style.display = 'none';
    return;
  }
  const avg = months.reduce((a, m) => a + buyByMonth[m], 0) / months.length;
  if (avg <= 0) {
    line.style.display = 'none';
    return;
  }
  let totalNow = 0;
  try {
    buildGroups().forEach(g => {
      const v = groupCurrentValue(g);
      totalNow += v.cur;
    });
  } catch (_e) {}
  const remaining = Math.max(0, retireGoal - totalNow);
  const monthsLeft = Math.ceil(remaining / avg);
  const yrs = Math.floor(monthsLeft / 12),
    mo = monthsLeft % 12;
  const dur = yrs > 0 ? yrs + ' سنة' + (mo ? ' و' + mo + ' شهر' : '') : monthsLeft + ' شهر';
  line.innerHTML = `متوسطك <b style="color:var(--gold)">${fmtC(avg)}/شهر</b> — بهذا الإيقاع تبلغ هدف التقاعد خلال <b style="color:var(--gold)">${dur}</b>`;
  line.style.display = 'block';
}
let _txnMobileFilter = 'all';
let _txnYear = null;
let _txnSelectedMonth = null;
function selectTxnMonth(m) {
  _txnSelectedMonth = _txnSelectedMonth === m ? null : m;
  renderTxnTable();
  setTxnLens('time');
  window.revealPortfolioSection?.($('txnGrouped'));
}
function setTxnMobileFilter(v) {
  _txnMobileFilter = v;
  renderTxnTable();
}
function setTxnYear(y) {
  _txnYear = y;
  _txnSelectedMonth = null;
  renderTxnTable();
}
function renderTxnYearSeg(years, active) {
  const seg = $('txnYearSeg');
  if (!seg) return;
  if (years.length < 2) {
    seg.style.display = 'none';
    return;
  }
  seg.innerHTML = years.map(y => `<button class="tyr-btn${y === active ? ' on' : ''}" onclick="setTxnYear('${y}')">${y}</button>`).join('');
  seg.style.display = 'flex';
}
function renderTxnBarsMobile(months, groups, selM) {
  const box = $('txnBarsMobile'),
    leg = $('txnBarsLeg');
  if (!box) return;
  const CATC = {
    Stock: '#8A6D2F',
    Gold: '#BD9840',
    Property: '#D4B96A'
  };
  const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const ord = [...months].sort();
  let maxUp = 1,
    maxDn = 1;
  const data = ord.map(m => {
    const items = groups[m] || [];
    const cat = {
      Stock: 0,
      Gold: 0,
      Property: 0
    };
    let sell = 0;
    items.forEach(t => {
      const v = Math.abs(pN(t.totalCostSAR));
      if (t.action === 'Buy' && cat[t.assetType] != null) cat[t.assetType] += v;else if (t.action === 'Sell') sell += v;
    });
    const up = cat.Stock + cat.Gold + cat.Property;
    if (up > maxUp) maxUp = up;
    if (sell > maxDn) maxDn = sell;
    return {
      m,
      cat,
      sell,
      up
    };
  });
  const UPMAX = isMobile() ? 46 : 92,
    DNMAX = isMobile() ? 16 : 32;
  box.innerHTML = `<div id="tmbars">` + data.map(d => {
    const [, mo] = d.m.split('-');
    const lbl = monthShort[parseInt(mo) - 1] || mo;
    const seg = k => d.cat[k] > 0 ? `<i style="height:${(d.cat[k] / maxUp * UPMAX).toFixed(1)}px;background:${CATC[k]}"></i>` : '';
    const dn = d.sell > 0 ? `<i style="height:${(d.sell / maxDn * DNMAX).toFixed(1)}px"></i>` : '';
    return `<button type="button" title="${d.m}" class="tmb${d.m === selM ? ' sel' : ''}" onclick="selectTxnMonth('${d.m}')">
      <div class="up">${seg('Stock')}${seg('Gold')}${seg('Property')}</div>
      <div class="dn">${dn}</div>
      <b>${lbl}</b>
    </button>`;
  }).join('') + `</div>`;
  box.style.display = 'block';
  if (leg) {
    leg.innerHTML = `<div class="tmb-leg">
      <span><i class="sw" style="background:#8A6D2F"></i>أسهم</span>
      <span><i class="sw" style="background:#BD9840"></i>ذهب</span>
      <span><i class="sw" style="background:#D4B96A"></i>أملاك</span>
      <span><i class="sw" style="background:#9aa0ad"></i>مبيعات (تحت الخط)</span>
    </div>`;
    leg.style.display = 'block';
  }
  const sel = box.querySelector('.tmb.sel');
  if (sel) sel.scrollIntoView({
    inline: 'center',
    block: 'nearest'
  });
}
function renderTxnSummaryMobile(invested, liquidated, netToMkt, year, byCat) {
  const box = $('txnSummaryMobile');
  if (!box) return;
  const posC = netToMkt >= 0 ? 'var(--gold)' : 'var(--red)';
  const posArrow = netToMkt >= 0 ? '▲' : '▼';
  const CATC = {
    Stock: '#8A6D2F',
    Gold: '#BD9840',
    Property: '#D4B96A',
    Cash: '#9c958a'
  };
  const CATL = {
    Stock: 'أسهم',
    Gold: 'ذهب',
    Property: 'أملاك',
    Cash: 'نقدي'
  };
  const ORD = ['Stock', 'Gold', 'Property', 'Cash'];
  const cats = ORD.filter(k => (byCat && byCat[k]) > 0);
  const investedTotal = cats.reduce((a, k) => a + byCat[k], 0) || 1;
  const R = 15.9,
    C = 2 * Math.PI * R;
  let offset = 0;
  const segs = cats.map(k => {
    const frac = byCat[k] / investedTotal;
    const len = frac * C;
    const s = `<circle cx="21" cy="21" r="${R}" fill="none" stroke="${CATC[k]}" stroke-width="5" stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}"/>`;
    offset += len;
    return s;
  }).join('');
  const donutSvg = cats.length ? `<svg width="96" height="96" viewBox="0 0 42 42" style="transform:rotate(-90deg)"><circle cx="21" cy="21" r="${R}" fill="none" stroke="var(--wline)" stroke-width="5"/>${segs}</svg>` : `<svg width="96" height="96" viewBox="0 0 42 42"><circle cx="21" cy="21" r="${R}" fill="none" stroke="var(--wline)" stroke-width="5"/></svg>`;
  const legHtml = cats.length ? `<div style="display:flex;flex-direction:column;gap:7px;font-size:9.5px;color:var(--muted)">` + cats.map(k => `<span style="white-space:nowrap"><i style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${CATC[k]};margin-left:5px;vertical-align:middle"></i>${CATL[k]} <b style="color:var(--text);font-weight:600;font-family:inherit;direction:ltr">${Math.round(byCat[k] / investedTotal * 100)}%</b></span>`).join('') + `</div>` : '';
  box.innerHTML = `<div class="card" style="margin-bottom:0">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:14px">
      <div>
        <div style="font-size:10.5px;color:var(--gold)">صافي ما وجّهته للسوق${year ? ` · ${year}` : ''}</div>
        <div style="font-size:19px;font-weight:600;font-family:inherit;direction:ltr;color:${posC};margin-top:3px">${posArrow} ${fmtC(Math.abs(netToMkt))}</div>
        <div style="margin-top:9px;display:flex;flex-direction:column;gap:5px">
          <div style="font-size:10.5px;color:var(--muted);display:flex;align-items:center;gap:6px"><i style="width:8px;height:8px;border-radius:3px;background:var(--bronze);display:inline-block"></i> استثمرت <b style="color:var(--gold);font-weight:600;font-family:inherit;direction:ltr;margin-inline-start:auto">${fmtC(invested)}</b></div>
          <div style="font-size:10.5px;color:var(--muted);display:flex;align-items:center;gap:6px"><i style="width:8px;height:8px;border-radius:3px;background:var(--muted);display:inline-block"></i> سيّلت <b style="color:var(--muted);font-weight:600;font-family:inherit;direction:ltr;margin-inline-start:auto">${fmtC(liquidated)}</b></div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:11px;flex-shrink:0">
        ${legHtml}
        <div style="position:relative;width:96px;height:96px;flex-shrink:0">${donutSvg}</div>
      </div>
    </div>
  </div>`;
  box.style.display = 'block';
}
function toggleTxnRow(rowEl) {
  if (!rowEl) return;
  const open = rowEl.classList.contains('open');
  const parent = rowEl.parentNode;
  if (parent) parent.querySelectorAll(':scope > .mkt-row.open').forEach(r => {
    if (r !== rowEl) r.classList.remove('open');
  });
  rowEl.classList.toggle('open', !open);
}
function showTxnMonthSummary(m) {
  const box = $('txnMonthSummary'),
    d = (window._txnMonthData || {})[m];
  if (!box || !d) return;
  const CATC = {
    Stock: '#8A6D2F',
    Gold: '#BD9840',
    Property: '#D4B96A'
  };
  const CATL = {
    Stock: 'أسهم',
    Gold: 'ذهب',
    Property: 'أملاك'
  };
  const netC = d.net >= 0 ? 'var(--gold)' : 'var(--red)',
    netA = d.net >= 0 ? '▲' : '▼';
  const tot = Object.values(d.byCat).reduce((a, b) => a + b, 0) || 1;
  let bar = '',
    leg = '';
  ['Stock', 'Gold', 'Property'].forEach(k => {
    if (d.byCat[k]) {
      bar += `<div style="flex:${d.byCat[k].toFixed(0)};background:${CATC[k]}"></div>`;
      leg += `<span><i style="display:inline-block;width:8px;height:8px;border-radius:3px;background:${CATC[k]};margin-left:4px;vertical-align:middle"></i>${CATL[k]} <b style="color:var(--text);font-weight:600;font-family:inherit;direction:ltr">${fmtC(d.byCat[k])}</b></span>`;
    }
  });
  const topCat = Object.entries(d.byCat).sort((a, b) => b[1] - a[1])[0];
  const topPct = topCat ? Math.round(topCat[1] / tot * 100) : 0;
  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <div style="font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px"><i class="ti ti-calendar-stats" style="color:var(--gold)"></i> ملخص ${d.label}</div>
      <div style="font-size:15px;color:var(--muted);cursor:pointer;line-height:1" onclick="$('txnMonthSummary').style.display='none'">✕</div>
    </div>
    <div style="margin-bottom:14px">
      <div style="font-size:10px;color:var(--muted)">صافي ما وجّهته للسوق</div>
      <div style="font-size:19px;font-weight:600;font-family:inherit;direction:ltr;color:${netC};margin-top:2px">${netA} ${fmtC(Math.abs(d.net))}</div>
      <div style="font-size:10px;color:var(--muted);margin-top:3px">استثمرت <b style="color:var(--gold);font-family:inherit;font-weight:600">${fmtC(d.inv)}</b> · سيّلت <b style="color:var(--muted);font-family:inherit;font-weight:600">${fmtC(d.liq)}</b></div>
    </div>
    ${bar ? `<div style="display:flex;height:7px;border-radius:99px;overflow:hidden;margin:10px 0 8px">${bar}</div><div style="display:flex;flex-wrap:wrap;gap:12px;font-size:10px;color:var(--muted)">${leg}</div>` : ''}
    ${d.big ? `<div style="font-size:10px;color:var(--muted);margin-top:13px;padding-top:11px;border-top:1px solid var(--wline);line-height:1.6">ركّزت على <b style="color:var(--text);font-weight:600">${CATL[topCat && topCat[0]] || '—'} (${topPct}٪)</b> · أكبر حركة: <b style="color:var(--text);font-weight:600">شراء ${d.big.assetName} بـ ${fmtC(Math.abs(pN(d.big.totalCostSAR)))}</b></div>` : ''}`;
  box.style.display = 'block';
  box.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}
function renderTxnTable() {
  populateMonthSelect();
  const srch = ($('srch')?.value || '').toLowerCase();
  const fTypes = [...(_msState?.fType || [])];
  const fActs = [...(_msState?.fAction || [])];
  const fMonths = [...(_msState?.fMonth || [])];
  let f = [...txns].sort((a, b) => b.date.localeCompare(a.date));
  if (srch) f = f.filter(t => t.assetName.toLowerCase().includes(srch) || (t.date || '').includes(srch));
  if (fTypes.length) f = f.filter(t => fTypes.includes(t.assetType));
  if (fActs.length) f = f.filter(t => fActs.includes(t.action));
  if (fMonths.length) f = f.filter(t => fMonths.some(m => (t.date || '').startsWith(m)));
  window._visibleTxnIds = f.map(t => t.id);
  let sumIn = 0,
    sumOut = 0;
  f.forEach(t => {
    const v = Math.abs(pN(t.totalCostSAR));
    if (t.action === 'Buy' || t.action === 'Deposit') sumIn += v;else sumOut += v;
  });
  const netCost = sumIn - sumOut;
  st('fSumCount', f.length);
  st('fSumCost', (netCost >= 0 ? '+' : '-') + fmtC(Math.abs(netCost)));
  st('fSumIn', '+' + fmtC(sumIn));
  st('fSumOut', '-' + fmtC(sumOut));
  const costEl = document.getElementById('fSumCost');
  if (costEl) costEl.style.color = netCost >= 0 ? 'var(--green)' : 'var(--red)';
  const groups = {};
  f.forEach(t => {
    const m = (t.date || '????-??').slice(0, 7);
    if (!groups[m]) groups[m] = [];
    groups[m].push(t);
  });
  const months = Object.keys(groups).sort().reverse();
  const typeC = {
    Property: 'var(--text)',
    Gold: 'var(--text)',
    Stock: 'var(--text)',
    Cash: 'var(--text)'
  };
  const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const container = $('txnGrouped');
  if (!container) return;
  if (!months.length) {
    container.innerHTML = '<div class="empty">لا توجد حركات</div>';
    renderTxnBarsMobile([], {}, null);renderTxnSummaryMobile(0,0,0,'',{});renderTxnYearSeg([], '');
    if ($('txnInsightLine')) $('txnInsightLine').style.display='none';
    window._visibleTxnIds=[];updateSelectionBar();
    return;
  }
  { // One transaction presentation shared by phone and desktop.
    const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const CATC = {
      Stock: '#8A6D2F',
      Gold: '#BD9840',
      Property: '#D4B96A'
    };
    const CATL = {
      Stock: 'أسهم',
      Gold: 'ذهب',
      Property: 'أملاك',
      Cash: 'نقدي'
    };
    const ACTL = {
      Buy: 'شراء',
      Sell: 'بيع',
      Deposit: 'إيداع',
      Withdrawal: 'سحب'
    };
    const allYears = [...new Set(f.map(t => (t.date || '').slice(0, 4)).filter(Boolean))].sort().reverse();
    const activeYear = _txnYear && allYears.includes(_txnYear) ? _txnYear : allYears[0] || '';
    renderTxnYearSeg(allYears, activeYear);
    const fy = activeYear ? f.filter(t => (t.date || '').startsWith(activeYear)) : f;
    const invested = fy.filter(t => t.action === 'Buy').reduce((a, t) => a + Math.abs(pN(t.totalCostSAR)), 0);
    const liquidated = fy.filter(t => t.action === 'Sell').reduce((a, t) => a + Math.abs(pN(t.totalCostSAR)), 0);
    const netToMkt = invested - liquidated;
    let realizedY = 0;
    try {
      buildGroups().forEach(g => {
        (g.sellHistory || []).forEach(s => {
          realizedY += s.pnl || 0;
        });
      });
    } catch (_e) {}
    const byCat = {};
    fy.filter(t => t.action === 'Buy').forEach(t => {
      byCat[t.assetType] = (byCat[t.assetType] || 0) + Math.abs(pN(t.totalCostSAR));
    });
    fy.filter(t => t.action === 'Sell').forEach(t => {
      byCat[t.assetType] = (byCat[t.assetType] || 0) - Math.abs(pN(t.totalCostSAR));
    });
    const investedTotal = Object.values(byCat).reduce((a, b) => a + b, 0) || 1;
    const posC = netToMkt >= 0 ? 'var(--gold)' : 'var(--red)';
    const posArrow = netToMkt >= 0 ? '▲' : '▼';
    renderTxnSummaryMobile(invested, liquidated, netToMkt, activeYear, byCat);
    const mobF = _txnMobileFilter === 'all' ? fy : fy.filter(t => _txnMobileFilter==='Dividend'?t.incomeType==='Dividend':t.action === _txnMobileFilter);
    const mGroups = {};
    mobF.forEach(t => {
      const mm = (t.date || '????-??').slice(0, 7);
      (mGroups[mm] = mGroups[mm] || []).push(t);
    });
    const mMonths = Object.keys(mGroups).sort().reverse();
    let html = `<div class="card" id="txnMonthSummary" style="display:none;margin-bottom:14px"></div>`;
    const FILT = [['all', 'الكل'], ['Buy', 'شراء'], ['Sell', 'بيع'], ['Deposit', 'إيداع'], ['Dividend', 'توزيعات'], ['Withdrawal', 'سحب']];
    html += `<div class="mkt-filters" style="margin-bottom:12px">` + FILT.map(([k, l]) => `<button class="mkt-fchip${_txnMobileFilter === k ? ' on' : ''}" onclick="setTxnMobileFilter('${k}')">${l}</button>`).join('') + `</div>`;
    const selValid = _txnSelectedMonth && mGroups[_txnSelectedMonth];
    const listMonths = selValid ? [_txnSelectedMonth] : mMonths;
    window._visibleTxnIds = listMonths.flatMap(m => mGroups[m].map(t => t.id));
    if (selValid) {
      const [yy, mm2] = _txnSelectedMonth.split('-');
      const mLbl = `${monthNamesAr[parseInt(mm2) - 1] || mm2} ${yy}`;
      html += `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.22);border-radius:11px;padding:8px 12px;margin-bottom:12px;font-size:10.5px;color:var(--gold)"><span><i class="ti ti-filter" style="font-size:12px"></i> تعرض حركات ${mLbl} فقط</span><span onclick="selectTxnMonth('${_txnSelectedMonth}')" style="cursor:pointer;text-decoration:underline;text-underline-offset:3px;color:var(--muted)">إظهار الكل</span></div>`;
    }
    if (!listMonths.length) html += '<div class="empty" style="border:none">لا حركات بهذا الفلتر</div>';else html += listMonths.map(m => {
      const items = mGroups[m];
      const [y, mo] = m.split('-');
      const monthLabel = `${monthNamesAr[parseInt(mo) - 1] || mo} ${y}`;
      const collapsed = collapsedMonths.has(m);
      const mInv = items.filter(t => t.action === 'Buy').reduce((a, t) => a + Math.abs(pN(t.totalCostSAR)), 0);
      const mLiq = items.filter(t => t.action === 'Sell').reduce((a, t) => a + Math.abs(pN(t.totalCostSAR)), 0);
      const mNet = mInv - mLiq;
      const netC = mNet >= 0 ? 'var(--gold)' : 'var(--red)';
      const netA = mNet >= 0 ? '▲' : '▼';
      return `<div class="mkt-list" style="margin-bottom:14px">
        <div onclick="toggleMonth('${m}')" style="display:flex;justify-content:space-between;align-items:center;padding:11px 16px;background:linear-gradient(180deg,var(--surf2),var(--surf));border-bottom:1px solid var(--wline);cursor:pointer">
          <div style="display:flex;align-items:baseline;gap:8px">
            <span style="font-size:13px;font-weight:700">${monthLabel}</span>
            <span style="font-size:9px;color:var(--muted);background:var(--surf);border:1px solid var(--bdr);border-radius:99px;padding:2px 9px">${items.length} حركة</span>
          </div>
          <div style="font-size:12.5px;font-weight:600;font-family:inherit;direction:ltr;color:${netC};display:flex;align-items:center;gap:5px">${netA} ${fmtC(Math.abs(mNet))} <span style="font-size:9px;color:var(--muted);font-weight:500">${mNet >= 0 ? 'للسوق' : 'تسييل'}</span> <i class="ti ti-chevron-${collapsed ? 'down' : 'up'}" style="font-size:13px;color:var(--muted)"></i></div>
        </div>
        ${collapsed ? '' : items.map(t => {
        const isBuy = t.action === 'Buy',
          isSell = t.action === 'Sell',
          isDep = t.action === 'Deposit';
        const ico = isBuy ? ['buy', 'ti-arrow-down-left', 'var(--gold)', 'rgba(189,152,64,.13)'] : isSell ? ['sell', 'ti-arrow-up-right', 'var(--green)', 'rgba(52,168,83,.12)'] : isDep ? ['dep', 'ti-arrow-bar-to-down', 'var(--green)', 'rgba(52,168,83,.12)'] : ['wth', 'ti-arrow-bar-up', 'var(--red)', 'rgba(229,72,77,.1)'];
        const cur = t.currency || 'SAR';
        const nativeAmt = (() => {
          if (cur === 'SAR') return null;
          const v = Math.abs(pN(t.totalCostSAR));
          const rt = pN(t.rate);
          if (rt > 0) return v / rt;
          const live = cur === 'GBp' ? fx.GBP ? fx.GBP / 100 : 0 : cur === 'GBP' ? fx.GBP || 0 : fx[cur] || 0;
          return live > 0 ? v / live : null;
        })();
        const mainVal = isSell ? `+${fmtC(Math.abs(pN(t.totalCostSAR)))}` : isDep ? `+${fmtC(Math.abs(pN(t.totalCostSAR)))}` : t.action === 'Withdrawal' ? `-${fmtC(Math.abs(pN(t.totalCostSAR)))}` : fmtC(Math.abs(pN(t.totalCostSAR)));
        const mainColor = isSell || isDep ? 'var(--green)' : t.action === 'Withdrawal' ? 'var(--red)' : 'var(--gold)';
        const qtyTxt = t.qty ? fmt(pN(t.qty), t.assetType === 'Gold' ? 1 : 2) + (t.assetType === 'Gold' ? ' غ' : ' وحدة') : '';
        const subTxt = `${t.date || ''}${qtyTxt ? ' · ' + qtyTxt : ''}`;
        const cells = [];
        if (t.qty) cells.push(['الكمية', fmt(pN(t.qty), t.assetType === 'Gold' ? 1 : 2) + (t.assetType === 'Gold' ? ' غ' : '')]);
        if (t.price) cells.push(['سعر الوحدة', fmt(pN(t.price), 2) + ' ' + cur]);
        if (t.rate && cur !== 'SAR') cells.push(['سعر الصرف وقتها', '1 ' + cur + ' = ' + fmt(pN(t.rate), 3) + ' ﷼']);
        if (t.fees && pN(t.fees) > 0) cells.push(['الرسوم', fmt(pN(t.fees), 2) + ' ' + cur]);
        const cellsHtml = cells.map(c => `<div style="background:var(--surf);border:1px solid var(--bdr);border-radius:12px;padding:8px 11px"><div style="font-size:10px;color:var(--muted)">${c[0]}</div><div style="font-size:12.5px;font-weight:600;font-family:inherit;margin-top:2px;direction:ltr;text-align:right;color:var(--gold)">${c[1]}</div></div>`).join('');
        const linkHtml = t.linkedTxnId ? `<div style="display:flex;align-items:center;gap:7px;background:rgba(189,152,64,.07);border:1px solid rgba(189,152,64,.2);border-radius:11px;padding:8px 11px;margin-top:8px;font-size:10.5px;color:var(--gold)"><i class="ti ti-link"></i> مرتبطة بحركة كاش تلقائية</div>` : '';
        const remHtml = t.remarks ? `<div style="font-size:10.5px;color:var(--muted);margin-top:8px">${t.remarks}</div>` : '';
        return `<div class="mkt-row" data-txid="${t.id}">
            <div class="mkt-rhead" onclick="toggleTxnRow(this.parentNode)">
              <div style="width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;background:${ico[3]};color:${ico[2]}"><i class="ti ${ico[1]}"></i></div>
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:600">${t.incomeType==='Dividend'?'إيداع توزيعات · '+escapePortfolioText(t.sourceAssetName):ACTL[t.action] || t.action} · ${t.assetName}</div>
                <div style="font-size:10px;color:var(--muted);margin-top:1px">${subTxt}</div>
              </div>
              <div style="flex-shrink:0;text-align:left;direction:ltr">
                <div style="font-size:13.5px;font-weight:600;font-family:inherit;color:${mainColor}">${mainVal}</div>
                ${nativeAmt ? `<div style="font-size:9.5px;color:var(--muted);margin-top:1px">${fmt(nativeAmt, cur === 'GBp' ? 0 : 2)} ${cur}</div>` : ''}
              </div>
            </div>
            <div class="mkt-rbody">
              <label class="th-txn-select" onclick="event.stopPropagation()"><input type="checkbox" ${selectedIds.has(t.id) ? 'checked' : ''} onchange="toggleSel(${t.id},this.checked)"> تحديد الحركة</label>
              ${cellsHtml ? `<div class="mkt-dgrid" style="margin-top:8px">${cellsHtml}</div>` : ''}
              ${linkHtml}${remHtml}
              <div style="display:flex;gap:8px;margin-top:10px">
                <button onclick="event.stopPropagation();startEdit(${t.id})" style="flex:1;font-family:inherit;font-size:11.5px;font-weight:500;padding:9px;border-radius:11px;border:1px solid rgba(189,152,64,.35);background:rgba(189,152,64,.12);color:var(--gold);cursor:pointer"><i class="ti ti-pencil"></i> تعديل</button>
                <button onclick="event.stopPropagation();delTxn(${t.id})" style="flex:1;font-family:inherit;font-size:11.5px;font-weight:500;padding:9px;border-radius:11px;border:1px solid rgba(229,72,77,.3);background:rgba(229,72,77,.08);color:var(--red);cursor:pointer"><i class="ti ti-trash"></i> حذف</button>
              </div>
            </div>
          </div>`;
      }).join('')}
      </div>`;
    }).join('');
    container.innerHTML = html;
    const _ct = $('txnChartTitle');
    if (_ct) _ct.textContent = 'إيقاع استثمارك';
    const _lens = $('txnLens');
    if (_lens) _lens.style.display = 'flex';
    const yGroups = {};
    fy.forEach(t => {
      const mm = (t.date || '????-??').slice(0, 7);
      (yGroups[mm] = yGroups[mm] || []).push(t);
    });
    const yMonths = Object.keys(yGroups).sort().reverse();
    renderTxnBarsMobile(yMonths, yGroups, _txnSelectedMonth || yMonths[0]);
    setTimeout(updateTxnInsightLine, 50);
    setTimeout(() => {
      if (_txnSelectedMonth) showTxnMonthSummary(_txnSelectedMonth);else {
        const _b = $('txnMonthSummary');
        if (_b) _b.style.display = 'none';
      }
    }, 0);
    window._txnMonthData = {};
    yMonths.forEach(m => {
      const groups = yGroups;
      const items = groups[m];
      const inv = items.filter(t => t.action === 'Buy').reduce((a, t) => a + Math.abs(pN(t.totalCostSAR)), 0);
      const liq = items.filter(t => t.action === 'Sell').reduce((a, t) => a + Math.abs(pN(t.totalCostSAR)), 0);
      const bc = {};
      items.filter(t => t.action === 'Buy').forEach(t => {
        bc[t.assetType] = (bc[t.assetType] || 0) + Math.abs(pN(t.totalCostSAR));
      });
      let big = null;
      items.forEach(t => {
        if (t.action === 'Buy' && (!big || Math.abs(pN(t.totalCostSAR)) > Math.abs(pN(big.totalCostSAR)))) big = t;
      });
      const [y, mo] = m.split('-');
      window._txnMonthData[m] = {
        label: `${monthNamesAr[parseInt(mo) - 1] || mo} ${y}`,
        inv,
        liq,
        net: inv - liq,
        byCat: bc,
        big
      };
    });
    updateSelectionBar();
    return;
  }
}
function toggleCostColumns() {
  txnCostExpanded = !txnCostExpanded;
  renderTxnTable();
}
function toggleRateCol() {
  txnRateVisible = !txnRateVisible;
  renderTxnTable();
}
function toggleMonth(m) {
  if (collapsedMonths.has(m)) collapsedMonths.delete(m);else collapsedMonths.add(m);
  renderTxnTable();
}
function toggleSel(id, checked) {
  if (checked) selectedIds.add(id);else selectedIds.delete(id);
  updateSelectionBar();
  renderTxnTable();
}
function toggleMonthSel(m, checked) {
  const visible = new Set(window._visibleTxnIds || []);
  const items = txns.filter(t => visible.has(t.id) && (t.date || '').startsWith(m));
  items.forEach(t => {
    if (checked) selectedIds.add(t.id);else selectedIds.delete(t.id);
  });
  updateSelectionBar();
  renderTxnTable();
}
function clearSelection() {
  selectedIds.clear();
  updateSelectionBar();
  renderTxnTable();
}
function toggleSelAll() {
  if (selectedIds.size) selectedIds.clear();
  else (window._visibleTxnIds || []).forEach(id => selectedIds.add(id));
  updateSelectionBar();
  renderTxnTable();
}

function exportToExcel() {
  return window.downloadTransactions(txns);
}
function toggleAllSel(checked) {
  (window._visibleTxnIds || []).forEach(id => checked ? selectedIds.add(id) : selectedIds.delete(id));
  updateSelectionBar();
  renderTxnTable();
}

function updateSelectionBar() {
  const bar = $('selectionBar');
  if (!bar) return;
  const n = selectedIds.size;
  bar.style.display = n > 0 ? 'flex' : 'none';
  st('selCount', `${n} حركة محددة`);
  const btn = document.getElementById('btnToggleSel');
  if (btn && n > 0) btn.textContent = '☐ إلغاء التحديد';
  if (btn && n === 0) {
    btn.textContent = '☑ اختيار الكل';
    btn.style.color = 'var(--gold)';
  }
}
function startEdit(id) {
  const t = txns.find(x => x.id === id);
  if (!t) return;
  if(t.incomeType==='Dividend'){window.openDividendEditor(t.id);return;}
  populateAssetDropdown();
  setTimeout(() => {
    $('aDate').value = t.date || '';
    const asel = $('aAsset');
    if (asel) {
      const aRec = assets.find(a => a.name === t.assetName);
      asel.value = aRec ? aRec.id : t.assetName;
    }
    $('aAction').value = t.action || 'Buy';
    $('aQty').value = t.qty || '';
    $('aPrice').value = t.price || '';
    $('aFees').value = t.fees || '';
    $('aCur').value = t.currency || 'SAR';
    $('aRate').value = t.rate || 1;
    const pivFxEdit = pivotCur === 'SAR' ? 1 : fx[pivotCur] || 1;
    $('aTotal').value = t.totalCostSAR ? fmt(Math.abs(pN(t.totalCostSAR)) / pivFxEdit, 2) : '';
    $('aRemarks').value = t.remarks || '';
    const linkRow = document.getElementById('linkedAccRow');
    if (linkRow) linkRow.style.display = 'none';
    _mobileEditId = id;
    const titleEl = document.querySelector('#addModal .modal-title');
    if (titleEl) titleEl.innerHTML = '<i class="ti ti-edit"></i> تعديل حركة';
  }, 0);
  openModal('addModal');
}
function editField(id, field, val) {
  const t = txns.find(t => t.id === id);
  if (!t) return;
  if (['qty', 'price', 'fees', 'totalCostSAR', 'rate'].includes(field)) {
    t[field] = pN(val);
  } else {
    t[field] = val;
  }
  if (field === 'totalCostSAR') {
    const sg = t.action === 'Sell' || t.action === 'Withdrawal' ? -1 : 1;
    t.totalCostSAR = sg * Math.abs(pN(val));
  }
  if (['qty', 'price', 'fees', 'rate'].includes(field)) {
    const qty = Math.abs(pN(t.qty) || 0);
    const price = Math.abs(pN(t.price) || 0);
    const fees = Math.abs(pN(t.fees) || 0);
    const rate = Math.abs(pN(t.rate) || 1);
    if (qty > 0 && price > 0) {
      const rawTotal = (qty * price + fees) * rate;
      const sg = t.action === 'Sell' || t.action === 'Withdrawal' ? -1 : 1;
      t.totalCostSAR = sg * rawTotal;
      const row = document.querySelector(`[data-txn-id="${id}"]`);
      if (row) {
        const totalInput = row.querySelector('[data-field="totalCostSAR"]');
        if (totalInput) totalInput.value = rawTotal.toFixed(2);
      }
    }
  }
  const absTot = Math.abs(pN(t.totalCostSAR));
  const row = document.querySelector(`[data-txn-id="${id}"]`);
  if (row) {
    const jodEl = row.querySelector('[data-conv="jod"]');
    const usdEl = row.querySelector('[data-conv="usd"]');
    if (jodEl) jodEl.textContent = fmt(absTot / (fx.JOD || 5.30), 1);
    if (usdEl) usdEl.textContent = fmt(absTot / (fx.USD || 3.75), 1);
  }
}
function saveEdit(id) {
  const t = txns.find(x => x.id === id);
  if (t?.linkedTxnId) {
    const linked = txns.find(x => x.id === t.linkedTxnId);
    if (linked) {
      const newTotal = Math.abs(pN(t.totalCostSAR));
      linked.date = t.date;
      linked.qty = newTotal;
      linked.price = 1;
      linked.totalCostSAR = newTotal;
      linked.remarks = `مرتبطة: ${t.action === 'Buy' ? 'شراء' : 'بيع'} ${t.assetName}`;
      
    }
  }
  if(t) portfolioAPI.updateTxns(txns.filter(x=>x.id===t.id||x.id===t.linkedTxnId));
  saveTxns();
  editingId = null;
  renderAll();
}
function copySelected() {
  const sel = txns.filter(t => selectedIds.has(t.id));
  if (!sel.length) return;
  const rows = sel.map(t => [t.date, t.assetType, t.assetName, t.action, t.qty, t.price, t.fees, t.currency, t.rate, t.totalCostSAR].join('\t')).join('\n');
  navigator.clipboard.writeText(rows).then(() => {
    const btn = document.querySelector('[onclick="copySelected()"]');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ تم النسخ';
      setTimeout(() => btn.textContent = orig, 1500);
    }
  });
}
function openDeleteSelected() {
  for(const t of txns)if(selectedIds.has(t.id)&&t.linkedTxnId)selectedIds.add(t.linkedTxnId);
  const n = selectedIds.size;
  if (!n) return;
  $('confirmMsg').textContent = `سيتم حذف ${n} حركة — ستُحفظ في سلة المحذوفات ويمكن استرجاعها.`;
  const toArchive = txns.filter(t => selectedIds.has(t.id));
  const delIds = [...selectedIds];
  pendingDeleteFn = () => {
    txns = txns.filter(t => !selectedIds.has(t.id));
    selectedIds.clear();
    portfolioAPI.archiveDeletedTxns(toArchive);
    closeModal('confirmModal');
    renderAll();
  };
  openModal('confirmModal');
}
function delTxn(id) {
  const deleted = txns.find(t => t.id === id);
  if (!deleted) return;
  const sg = deleted.action === 'Buy' || deleted.action === 'Deposit' ? '' : '-';
  const linked = deleted.linkedTxnId ? txns.find(t => t.id === deleted.linkedTxnId) : null;
  const linkedInfo = linked ? `\nسيتم أيضاً حذف الحركة المرتبطة: ${linked.action} · ${linked.assetName}` : '';
  $('confirmMsg').textContent = `حذف: ${deleted.assetName} · ${deleted.action} · ${sg}${fmtS(Math.abs(pN(deleted.totalCostSAR)))}${linkedInfo}`;
  pendingDeleteFn = () => {
    const toArchive = linked ? [deleted, linked] : [deleted];
    const idsToDelete = new Set(toArchive.map(t => t.id));
    txns = txns.filter(t => !idsToDelete.has(t.id));
    portfolioAPI.archiveDeletedTxns(toArchive);
    closeModal('confirmModal');
    renderAll();
  };
  openModal('confirmModal');
}
const AP_TYPE_LABELS = {
  Property: 'أملاك',
  Gold: 'ذهب',
  Stock: 'أسهم وصناديق',
  Cash: 'نقدي'
};
const AP_TYPE_ICONS = {
  Property: 'ti-building',
  Gold: 'ti-coin',
  Stock: 'ti-chart-bar',
  Cash: 'ti-cash'
};
const AP_TYPE_ORDER = ['Property', 'Gold', 'Stock', 'Cash'];
function populateAssetDropdown() {
  const sel = $('aAsset');
  if (!sel) return;
  const cur = sel.value;
  let html = '<option value="">— اختر أصل —</option>';
  AP_TYPE_ORDER.forEach(type => {
    const group = assets.filter(a => a.type === type);
    if (!group.length) return;
    html += group.map(a => `<option value="${a.id}">${a.name} (${a.type})</option>`).join('');
  });
  sel.innerHTML = html;
  if (cur) sel.value = cur;
}
function onAssetSelect() {
  const id = $('aAsset')?.value;
  const asset = assets.find(a => a.id === id);
  if (!asset) return;
  const ci = $('aCur');
  if (ci && asset.currency) ci.value = asset.currency;
  const actSel = $('aAction');
  if (actSel) actSel.value = asset.type === 'Cash' ? 'Deposit' : 'Buy';
  updateLinkedRow();
}
function updateLinkedRow() {
  const action = $('aAction')?.value;
  const row = $('linkedAccRow'),
    lbl = $('aLinkLabel');
  if (!row) return;
  if (action === 'Buy' || action === 'Sell') {
    row.style.display = '';
    if (lbl) lbl.textContent = action === 'Buy' ? 'اسحب تلقائياً من حساب' : 'أودع تلقائياً في حساب';
    populateCashAccounts();
  } else {
    row.style.display = 'none';
    if ($('aLinkChk')) $('aLinkChk').checked = false;
    toggleLinkAccount();
  }
}
function toggleLinkAccount() {
  const checked = $('aLinkChk')?.checked;
  const sel = $('aLinkedAcc'),
    note = $('aLinkNote');
  if (sel) sel.style.display = checked ? '' : 'none';
  if (note) note.style.display = checked ? '' : 'none';
}
function populateCashAccounts() {
  const sel = $('aLinkedAcc');
  if (!sel) return;
  const cash = assets.filter(a => a.type === 'Cash');
  sel.innerHTML = '<option value="">— اختر الحساب —</option>' + cash.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
}
function onNewAssetTypeChange() {
  const type = $('naType')?.value,
    row = $('naYahooRow');
  if (row) row.style.display = type === 'Property' || type === 'Cash' ? 'none' : 'block';
}
function openEditAsset(id) {
  const a = assets.find(x => x.id === id);
  if (!a) return;
  $('eaId').value = id;
  $('eaName').value = a.name;
  $('eaType').value = a.type;
  $('eaCurrency').value = a.currency || 'USD';
  $('eaYahoo').value = a.yahooSym || '';
  $('eaTv').value = a.tvSym || '';
  openModal('editAssetModal');
}
function deleteAsset(id) {
  if (!confirm('حذف هذا الأصل؟')) return;
  assets = assets.filter(a => a.id !== id);
  saveAssets();
  renderAll();
}
function chartGrid() {
  return document.documentElement.classList.contains('ios-light') ? 'rgba(60,60,67,.16)' : 'rgba(255,255,255,.05)';
}
const _animVals = {};
function animNum(id, val, fmtFn, dur = 650) {
  const el = $(id);
  if (el == null) return;
  if (!isFinite(val)) {
    el.textContent = fmtFn(val);
    _animVals[id] = val;
    return;
  }
  const from = _animVals[id] !== undefined && isFinite(_animVals[id]) ? _animVals[id] : 0;
  _animVals[id] = val;
  if (Math.abs(val - from) <= Math.max(0.5, Math.abs(val) * 0.002)) {
    el.textContent = fmtFn(val);
    return;
  }
  const t0 = performance.now();
  (function step(t) {
    const p = Math.min(1, (t - t0) / dur),
      e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmtFn(from + (val - from) * e);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}
let priceAlerts = [];
function renderRebalance(byType) {
  const el = $('rebalBody');
  if (!el) return;
  const cats = [['Property', 'الأملاك'], ['Gold', 'الذهب'], ['Stock', 'الأسهم'], ['Cash', 'النقدي']];
  const sumGoals = cats.reduce((a, [k]) => a + (catGoals[k] || 0), 0);
  const total = cats.reduce((a, [k]) => a + byType[k].cur, 0);
  if (sumGoals <= 0 || total <= 0) {
    el.innerHTML = '<div style="font-size:11.5px;color:var(--muted)">حدد أهداف الفئات من صفحة الأهداف لتفعيل الحاسبة — تخبرك بالضبط كم تضيف أو تقلل من كل فئة</div>';
    return;
  }
  el.innerHTML = cats.map(([k, l]) => {
    const tgtShare = (catGoals[k] || 0) / sumGoals;
    const curV = byType[k].cur,
      desired = tgtShare * total,
      delta = desired - curV;
    const curP = curV / total * 100,
      tgtP = tgtShare * 100;
    const sig = Math.abs(delta) >= total * 0.01;
    const act = !sig ? '<span style="color:var(--green)">✓ متوازن</span>' : delta > 0 ? `<span style="color:var(--green)">أضف ${fmtC(delta)}</span>` : `<span style="color:#f0a050">قلّل ${fmtC(-delta)}</span>`;
    return `<div class="rb-row"><div class="nm">${l}</div><div class="mini">${fmt(curP, 1)}% الآن ← هدفك ${fmt(tgtP, 1)}%</div><div class="act">${act}</div></div>`;
  }).join('') + '<div style="font-size:10px;color:var(--muted);opacity:.7;margin-top:8px">نِسَب الهدف مشتقة من أهداف الفئات — فرق أقل من 1% يُعتبر متوازناً</div>';
}
function calcMonthlyInvest() {
  const now = Date.now();
  const months = {};
  txns.forEach(t => {
    if (t.action !== 'Buy') return;
    if (!['Stock', 'Gold', 'Property'].includes(t.assetType)) return;
    const d = pDate(t.date || '');
    if (!/^\d{4}-\d{2}/.test(d)) return;
    if (now - new Date(d).getTime() > 366 * 86400000) return;
    const k = d.slice(0, 7);
    months[k] = (months[k] || 0) + Math.abs(pN(t.totalCostSAR));
  });
  const vals = Object.values(months);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}
let _projTotal = 0;
function projectGoalMonths(P, goal, m, annualR) {
  if (P >= goal) return 0;
  if (m <= 0 && annualR <= 0) return null;
  const r = annualR / 12;
  let v = P,
    n = 0;
  while (v < goal && n < 600) {
    v = v * (1 + r) + m;
    n++;
  }
  return n >= 600 ? null : n;
}
function renderGoalProjection(totalCur) {
  _projTotal = totalCur;
  const inp = $('gProjMonthly');
  if (inp && !inp.dataset.touched) inp.placeholder = fmt(calcMonthlyInvest() * sarToBase(1));
  const c = $('gProjCur');
  if (c) c.textContent = 'بالـ' + baseCur + ' — المتوسط التلقائي من حركاتك: ' + fmtC(calcMonthlyInvest());
  updateProjRows();
}
function updateProjRows() {
  const el = $('gProjRows');
  if (!el) return;
  if (retireGoal <= 0) {
    el.innerHTML = '<div style="font-size:11.5px;color:var(--muted)">حدد أهداف الفئات أولاً</div>';
    return;
  }
  const inp = $('gProjMonthly');
  const ovr = inp ? pN(inp.value) : 0;
  const m = ovr > 0 ? xrBaseToSar(ovr) : calcMonthlyInvest();
  const scen = [[0, 'ادخار فقط — بدون عائد'], [0.04, 'عائد متحفظ 4%'], [0.07, 'عائد متوسط 7%'], [0.10, 'عائد متفائل 10%']];
  const nowD = new Date();
  el.innerHTML = scen.map(([r, l]) => {
    const n = projectGoalMonths(_projTotal, retireGoal, m, r);
    let res;
    if (_projTotal >= retireGoal) res = '<span style="color:var(--green);font-weight:600">تحقق الهدف ✓</span>';else if (n == null) res = '<span style="color:var(--muted)">أكثر من 50 سنة — زد الادخار</span>';else {
      const y = Math.floor(n / 12),
        mo = n % 12;
      const yr = nowD.getFullYear() + Math.floor((nowD.getMonth() + n) / 12);
      const dur = (y ? y + ' سنة' : '') + (y && mo ? ' و' : '') + (mo ? mo + ' شهر' : '') || 'أقل من شهر';
      res = `<b style="color:var(--gold);font-size:14px">${yr}</b> <span style="color:var(--muted);font-size:10.5px">(${dur})</span>`;
    }
    return `<div class="proj-row"><div class="sc">${l}</div><div class="res">${res}</div></div>`;
  }).join('');
}
const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
function renderTxnInsights() {
  const el = $('txnInsights');
  if (!el) return;
  if (!txns.length) {
    el.innerHTML = '';
    return;
  }
  const mAvg = calcMonthlyInvest();
  let big = null;
  txns.forEach(t => {
    if (t.action !== 'Buy') return;
    const v = Math.abs(pN(t.totalCostSAR));
    if (!big || v > big.v) big = {
      v,
      n: t.assetName
    };
  });
  const mCount = {};
  txns.forEach(t => {
    const d = pDate(t.date || '');
    if (/^\d{4}-\d{2}/.test(d)) {
      const k = d.slice(0, 7);
      mCount[k] = (mCount[k] || 0) + 1;
    }
  });
  const topM = Object.entries(mCount).sort((a, b) => b[1] - a[1])[0];
  const topMLabel = topM ? AR_MONTHS[parseInt(topM[0].slice(5, 7), 10) - 1] + ' ' + topM[0].slice(0, 4) : '—';
  el.innerHTML = `
    <div class="xr-chip"><div class="v gold">${mAvg > 0 ? fmtC(mAvg) : '—'}</div><div class="l">متوسط استثمارك الشهري (12 شهر)</div></div>
    <div class="xr-chip"><div class="v">${big ? fmtC(big.v) : '—'}</div><div class="l">أكبر صفقة شراء ${big ? '— ' + big.n : ''}</div></div>
    <div class="xr-chip"><div class="v">${topMLabel}</div><div class="l">أنشط شهر (${topM ? topM[1] + ' حركة' : '—'})</div></div>
    <div class="xr-chip"><div class="v gold">${txns.length}</div><div class="l">إجمالي الحركات المسجلة</div></div>`;
}
function savePriceAlerts() {
  const v = JSON.stringify(priceAlerts);
  portfolioAPI.saveSetting('priceAlerts', v);
  localStorage.setItem('pf_alerts', v);
}
function renderPriceAlerts() {
  const sel = $('alAsset');
  if (sel) {
    const prev = sel.value;
    sel.innerHTML = assets.filter(a => a.yahooSym && a.type !== 'Property' && a.type !== 'Cash').map(a => `<option value="${a.name}">${a.name}${a.isGold || a.type === 'Gold' ? ' (﷼/غ)' : ' (' + a.currency + ')'}</option>`).join('');
    if (prev) sel.value = prev;
  }
  const list = $('alList');
  if (!list) return;
  if (!priceAlerts.length) {
    list.innerHTML = '<div style="font-size:11px;color:var(--muted)">لا توجد تنبيهات — أضف أول تنبيه فوق</div>';
    return;
  }
  list.innerHTML = priceAlerts.map(a => `
    <div class="al-row ${a.triggered ? 'hit' : ''}">
      <i class="ti ${a.triggered ? 'ti-bell-check' : 'ti-bell'}" style="color:${a.triggered ? 'var(--green)' : 'var(--gold)'};font-size:15px"></i>
      <span><b>${a.assetName}</b> ${a.dir === '>=' ? '≥' : '≤'} <span style="color:var(--gold);font-weight:600;font-family:inherit">${fmt(a.price, 2)}</span></span>
      ${a.triggered ? `<span style="color:var(--green);font-size:10.5px">تحقق ${a.trigAt || ''} — <span style="text-decoration:underline;cursor:pointer" onclick="rearmAlert(${a.id})">أعد تفعيله</span></span>` : ''}
      <span class="del" onclick="delPriceAlert(${a.id})" title="حذف"><i class="ti ti-x"></i></span>
    </div>`).join('');
}
function addPriceAlert() {
  const name = ($('alAsset') || {}).value,
    dir = ($('alDir') || {}).value,
    price = pN(($('alPrice') || {}).value);
  if (!name || price <= 0) {
    showToast('اختر أصلاً واكتب سعراً صحيحاً', 'error');
    return;
  }
  priceAlerts.push({
    id: Date.now(),
    assetName: name,
    dir,
    price,
    triggered: false
  });
  if ($('alPrice')) $('alPrice').value = '';
  savePriceAlerts();
  renderPriceAlerts();
  showToast('تمت إضافة التنبيه', 'success');
}
function delPriceAlert(id) {
  priceAlerts = priceAlerts.filter(a => a.id !== id);
  savePriceAlerts();
  renderPriceAlerts();
  if ($('alertsPanel')?.style.display === 'block') renderAlertsPanel();
  updateAlertsBadge();
}
function rearmAlert(id) {
  const a = priceAlerts.find(x => x.id === id);
  if (a) {
    a.triggered = false;
    a.trigAt = '';
    savePriceAlerts();
    renderPriceAlerts();
    if ($('alertsPanel')?.style.display === 'block') renderAlertsPanel();
    updateAlertsBadge();
  }
}
function checkPriceAlerts() {
  let hit = false;
  priceAlerts.forEach(a => {
    if (a.triggered) return;
    const lp = getLivePrice(a.assetName);
    if (!lp || lp.error) return;
    const ast = findAsset(a.assetName);
    const p = ast && (ast.isGold || ast.type === 'Gold') ? lp.gramSAR : lp.price;
    if (p == null) return;
    if (a.dir === '>=' && p >= a.price || a.dir === '<=' && p <= a.price) {
      a.triggered = true;
      a.seen = false;
      a.lastPrice = p;
      a.trigAt = new Date().toLocaleDateString('ar-EG');
      showToast(`🔔 ${a.assetName} ${a.dir === '>=' ? 'وصل' : 'نزل إلى'} ${fmt(p, 2)}`, 'success');
      hit = true;
    }
  });
  if (hit) {
    savePriceAlerts();
    if ($('page-market')?.classList.contains('active')) renderPriceAlerts();
    if ($('alertsPanel')?.style.display === 'block') renderAlertsPanel();
  }
  updateAlertsBadge();
}
function applyIosTheme(t, persist = true) {
  const h = document.documentElement;
  h.classList.toggle('ios-light', t === 'light');
  h.classList.toggle('ios-dark', t !== 'light');
  const ic = $('themeIcon');
  if (ic) ic.className = t === 'light' ? 'ti ti-sun' : 'ti ti-moon';
  localStorage.setItem('pf_ios_theme', t);
  if (persist) portfolioAPI.saveSetting('iosTheme', t);
  if (typeof renderAll === 'function') renderAll();
  if ($('page-transactions')?.classList.contains('active')) setTimeout(renderMonthlyChart, 60);
}
function toggleIosTheme() {
  const cur = document.documentElement.classList.contains('ios-light') ? 'light' : 'dark';
  applyIosTheme(cur === 'light' ? 'dark' : 'light');
}
setTimeout(() => {
  const ic = $('themeIcon');
  if (ic && document.documentElement.classList.contains('ios-light')) ic.className = 'ti ti-sun';
}, 0);
function toggleAlertsPanel() {
  const p = $('alertsPanel'),
    b = $('alertsPanelBackdrop');
  if (!p) return;
  if (p.style.display === 'block') {
    closeAlertsPanel();
    return;
  }
  renderAlertsPanel();
  p.style.display = 'block';
  if (b) b.style.display = 'block';
}
function closeAlertsPanel() {
  const p = $('alertsPanel'),
    b = $('alertsPanelBackdrop');
  if (p) p.style.display = 'none';
  if (b) b.style.display = 'none';
}
function renderAlertsPanel() {
  const el = $('alertsPanelList');
  if (!el) return;
  const notifs = priceAlerts.filter(a => a.triggered && !a.seen);
  if (!notifs.length) {
    el.innerHTML = '<div style="font-size:11.5px;color:var(--muted);padding:8px 0;text-align:center">🔕 لا توجد إشعارات جديدة</div>';
  } else {
    el.innerHTML = notifs.map(a => `
      <div class="al-row hit">
        <i class="ti ti-bell-check" style="color:var(--green);font-size:15px"></i>
        <div style="flex:1">
          <div style="font-size:12px;color:var(--text)"><b>${a.assetName}</b> ${a.dir === '>=' ? 'تجاوز' : 'نزل إلى'} ${fmt(a.price, 2)}${a.lastPrice ? ` <span style="color:var(--muted);font-size:10px">(السعر: ${fmt(a.lastPrice, 2)})</span>` : ''}</div>
          <div style="font-size:9.5px;color:var(--muted)">${a.trigAt || ''}</div>
        </div>
        <span class="del" onclick="markAlertSeen(${a.id})" title="مسح الإشعار"><i class="ti ti-x"></i></span>
      </div>`).join('') + `<div style="text-align:center;margin-top:8px"><span style="font-size:10.5px;color:var(--muted);cursor:pointer;text-decoration:underline;text-underline-offset:3px" onclick="markAllAlertsSeen()">مسح الكل</span></div>`;
  }
  updateAlertsBadge();
}
function markAlertSeen(id) {
  const a = priceAlerts.find(x => x.id === id);
  if (a) {
    a.seen = true;
    savePriceAlerts();
    renderAlertsPanel();
  }
}
function markAllAlertsSeen() {
  priceAlerts.forEach(a => {
    if (a.triggered) a.seen = true;
  });
  savePriceAlerts();
  renderAlertsPanel();
}
function updateAlertsBadge() {
  const b = $('alertsBadge');
  if (!b) return;
  const n = priceAlerts.filter(a => a.triggered && !a.seen).length;
  b.style.display = n ? 'flex' : 'none';
  b.textContent = n;
  const ic = $('alertsBellIcon');
  if (ic) ic.className = n ? 'ti ti-bell-ringing' : 'ti ti-bell';
}
let zkDb = {};
let zkRule = {};
let zkAsst = {};
let zkOpt = {
  apiKey: '',
  margin: 10,
  rate: 2.5,
  cacheDays: 120,
  pctVal: 30,
  topN: 20,
  nisabBase: 'gold',
  goldGram: 0,
  silverGram: 0,
  hawlStart: '',
  debts: 0
};
let zkBusy = false,
  zkLog = [];
const ZK_ITEM = {
  cashAndEquivalents: {
    ar: 'نقد وما في حكمه',
    cls: 'z'
  },
  shortTermInvestments: {
    ar: 'استثمارات قصيرة الأجل',
    cls: 'z'
  },
  marketableSecurities: {
    ar: 'أوراق مالية متداولة',
    cls: 'z'
  },
  tradeReceivables: {
    ar: 'ذمم مدينة',
    cls: 'z'
  },
  accountsReceivable: {
    ar: 'ذمم تجارية',
    cls: 'z'
  },
  inventory: {
    ar: 'مخزون',
    cls: 'z'
  },
  otherReceivables: {
    ar: 'أصول متداولة أخرى',
    cls: 'r'
  }
};
const ZK_SKIP = {
  totalAssets: 1,
  currentAssets: 1,
  cashAndShortTerm: 1
};
const ZK_TYPE = {
  Cash: 'نقدي',
  Gold: 'ذهب',
  Stock: 'أسهم وصناديق',
  Property: 'أملاك',
  Other: 'مصادر أخرى'
};
const ZK_ICON = {
  Cash: 'ti-cash',
  Gold: 'ti-coin',
  Stock: 'ti-chart-bar',
  Property: 'ti-building',
  Other: 'ti-layout-list'
};
const ZK_ORD = ['Cash', 'Gold', 'Stock', 'Property', 'Other'];
const ZK_NOTCO = /cash|collateral|future|option|forward|derivative|money\s*market|repo|swap|liquidity|margin/i;
function zkSave() {
  const p = {
    zakatDb: JSON.stringify(zkDb),
    zakatRule: JSON.stringify(zkRule),
    zakatAsst: JSON.stringify(zkAsst),
    zakatOpt: JSON.stringify(zkOpt)
  };
  Object.keys(p).forEach(k => portfolioAPI.saveSetting(k, p[k]));
  try {
    Object.keys(p).forEach(k => localStorage.setItem('pf_' + k, p[k]));
  } catch (e) {}
}
function zkLoad(s) {
  const g = (k, fb) => {
    try {
      return JSON.parse(s && s[k] || localStorage.getItem('pf_' + k) || fb);
    } catch (e) {
      return JSON.parse(fb);
    }
  };
  zkDb = g('zakatDb', '{}');
  zkRule = g('zakatRule', '{}');
  zkAsst = g('zakatAsst', '{}');
  zkOpt = Object.assign(zkOpt, g('zakatOpt', '{}'));
}
function zkRows() {
  const out = [];
  buildGroups().forEach(g => {
    if (isExited(g)) return;
    const v = groupCurrentValue(g).cur;
    if (v <= 0.5) return;
    out.push({
      key: g.assetName,
      name: g.assetName,
      type: g.assetType,
      val: v
    });
  });
  (otherSrc || []).forEach(s => {
    if (s.included === false) return;
    const v = pN(s.value);
    if (v <= 0.5) return;
    out.push({
      key: 'other:' + s.id,
      name: s.name,
      type: 'Other',
      otherType: s.type,
      val: v
    });
  });
  return out;
}
function zkKindOf(r) {
  if (r.type !== 'Stock') return 'direct';
  const a = findAsset(r.name),
    d = xrayLookup(r.name, a && a.id);
  return d && d.kind === 'etf' ? 'fund' : 'stock';
}
function zkDefault(r) {
  if (r.type === 'Property') return 'exempt';
  if (r.type === 'Other') return r.otherType === 'unrealized' ? 'exempt' : 'full';
  if (r.type === 'Stock') return 'auto';
  return 'full';
}
function zkTreat(r) {
  return zkAsst[r.key] || zkDefault(r);
}
function zkSetTreat(k, v) {
  const r = zkRows().find(x => x.key === k);
  if (r && v === zkDefault(r)) delete zkAsst[k];else zkAsst[k] = v;
  zkSave();
  zkRender();
}
function zkTickerOf(name) {
  const a = findAsset(name);
  if (!a) return String(name).toUpperCase();
  const y = String(a.yahooSym || '').trim();
  return y ? y.split('.')[0].toUpperCase() : String(a.name).toUpperCase();
}
function zkSymbolOf(name) {
  const a = findAsset(name);
  return a && String(a.yahooSym || '').trim() || '';
}
function zkItemCls(k) {
  const r = zkRule[k];
  return r == null ? (ZK_ITEM[k] || {}).cls || 'r' : r;
}
function zkItemF(k) {
  const c = zkItemCls(k);
  if (c === 'n') return 0;
  if (c === 'z' || c === 'r') return 1;
  const n = parseFloat(c);
  return isFinite(n) ? Math.max(0, Math.min(1, n / 100)) : 1;
}
function zkCalcRatio(co) {
  if (!co || !co.items || !co.items.totalAssets) return null;
  let z = 0;
  const used = [];
  Object.keys(co.items).forEach(k => {
    if (ZK_SKIP[k]) return;
    const v = Number(co.items[k]) || 0;
    if (!v) return;
    const f = zkItemF(k);
    if (f > 0) z += v * f;
    used.push({
      key: k,
      ar: (ZK_ITEM[k] || {}).ar || k,
      val: v,
      cls: zkItemCls(k),
      f: f,
      tag: (co.itemTags || {})[k]
    });
  });
  const total = Number(co.items.totalAssets) || 0;
  if (total <= 0) return null;
  const orig = z / total;
  const fin = Math.min(1, orig * (1 + (pN(zkOpt.margin) || 0) / 100));
  return {
    zakatable: z,
    total: total,
    orig: orig,
    fin: fin,
    items: used
  };
}
function zkCoRatio(tk) {
  const co = zkDb[String(tk).toUpperCase()];
  if (!co) return null;
  if (co.manual != null) return {
    fin: Math.max(0, Math.min(1, co.manual)),
    manual: true,
    co: co
  };
  const c = zkCalcRatio(co);
  return c ? {
    fin: c.fin,
    orig: c.orig,
    calc: c,
    co: co
  } : null;
}
function zkFundTop(name) {
  const a = findAsset(name),
    d = xrayLookup(name, a && a.id);
  if (!d || !Array.isArray(d.top)) return null;
  const top = d.top.filter(x => x && x[1] && !ZK_NOTCO.test(String(x[1])) && !ZK_NOTCO.test(String(x[0] || ''))).slice(0, Math.max(1, Math.min(50, pN(zkOpt.topN) || 20))).map(x => ({
    ticker: String(x[0] || '').toUpperCase(),
    name: String(x[1] || ''),
    cc: x[2] || '',
    w: Number(x[3]) || 0
  }));
  const cx = customXray[name] || {};
  return {
    top,
    csvUrl: cx._csvUrl || null,
    count: Number(cx._count) || 0,
    at: cx._at || ''
  };
}
function zkFundRatio(name) {
  const h = zkFundTop(name);
  if (!h || !h.top.length) return null;
  let sumW = 0,
    contrib = 0,
    known = 0;
  const missing = [];
  h.top.forEach(x => {
    const w = Math.max(0, x.w);
    sumW += w;
    const r = zkCoRatio(x.ticker);
    if (r) {
      contrib += w * r.fin;
      known++;
    } else {
      contrib += w * 1;
      missing.push(x.ticker || x.name);
    }
  });
  const rest = Math.max(0, 100 - sumW);
  return {
    fin: Math.min(1, (contrib + rest) / 100),
    sumW,
    rest,
    known,
    missing,
    top: h.top,
    csvUrl: h.csvUrl,
    cut: 1 - Math.min(1, (contrib + rest) / 100)
  };
}
function zkRowRatio(r) {
  const t = zkTreat(r);
  if (t === 'exempt') return {
    ratio: 0,
    src: 'معفى يدوياً'
  };
  if (t === 'pct') return {
    ratio: (pN(zkOpt.pctVal) || 0) / 100,
    src: 'نسبة يدوية'
  };
  const k = zkKindOf(r);
  if (k === 'direct') return {
    ratio: 1,
    src: 'أصل مباشر'
  };
  if (t === 'full') return {
    ratio: 1,
    src: 'كامل يدوياً'
  };
  if (k === 'fund') {
    const f = zkFundRatio(r.name);
    return f ? {
      ratio: f.fin,
      src: 'من مكوّنات الصندوق',
      fund: f
    } : {
      ratio: 1,
      src: 'تركيبة غير متوفرة — 100% احتياطي',
      warn: true
    };
  }
  const c = zkCoRatio(zkTickerOf(r.name));
  return c ? {
    ratio: c.fin,
    src: c.manual ? 'يدوي' : 'من القوائم المالية',
    co: c
  } : {
    ratio: 1,
    src: 'بلا قوائم مالية — 100% احتياطي',
    warn: true
  };
}
function zkGoldGram() {
  if (pN(zkOpt.goldGram) > 0) return pN(zkOpt.goldGram);
  const ga = assets.find(a => a.isGold || a.type === 'Gold');
  const lp = ga ? getLivePrice(ga.name) : null;
  return lp && lp.price ? lp.price / 31.1035 * (fx.USD || 3.75) : 0;
}
function zkNisab() {
  if (zkOpt.nisabBase === 'silver') {
    const g = pN(zkOpt.silverGram);
    return g > 0 ? g * 595 : 0;
  }
  const g = zkGoldGram();
  return g > 0 ? g * 85 : 0;
}
function zkCalc() {
  const rows = zkRows();
  let pool = 0;
  rows.forEach(r => {
    r.treat = zkTreat(r);
    r.kind = zkKindOf(r);
    const x = zkRowRatio(r);
    r.ratio = x.ratio;
    r.src = x.src;
    r.warn = !!x.warn;
    r.fund = x.fund || null;
    r.co = x.co || null;
    r.zVal = r.val * r.ratio;
    pool += r.zVal;
  });
  const debts = Math.max(0, xrBaseToSar(pN(zkOpt.debts)));
  const net = Math.max(0, pool - debts);
  const nisab = zkNisab();
  const rate = (pN(zkOpt.rate) || 2.5) / 100;
  const reached = nisab > 0 && net >= nisab;
  return {
    rows,
    pool,
    debts,
    net,
    nisab,
    rate,
    reached,
    due: reached ? net * rate : 0
  };
}
function zkHawl() {
  const s = zkOpt.hawlStart;
  if (!s) return null;
  const st = new Date(s + 'T00:00:00');
  if (isNaN(st.getTime())) return null;
  const days = 354,
    due = new Date(st.getTime() + days * 86400000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    due,
    days,
    elapsed: Math.floor((today - st) / 86400000),
    remaining: Math.ceil((due - today) / 86400000),
    dueStr: due.toISOString().slice(0, 10)
  };
}
function zkStale(tk) {
  const co = zkDb[String(tk).toUpperCase()];
  if (!co || !co.fetchedAt) return true;
  return Date.now() - new Date(co.fetchedAt).getTime() > (pN(zkOpt.cacheDays) || 120) * 86400000;
}
function zkNeeded() {
  const m = {};
  zkRows().forEach(r => {
    const k = zkKindOf(r);
    if (k === 'stock') {
      const t = zkTickerOf(r.name);
      m[t] = {
        ticker: t,
        name: r.name,
        symbol: zkSymbolOf(r.name),
        cc: ''
      };
    } else if (k === 'fund') {
      const h = zkFundTop(r.name);
      if (h) h.top.forEach(x => {
        if (x.ticker && !m[x.ticker]) m[x.ticker] = {
          ticker: x.ticker,
          name: x.name,
          cc: x.cc || '',
          symbol: ''
        };
      });
    }
  });
  return Object.values(m);
}
function zkSetProg(msg, pct) {
  zkLog.push({
    t: new Date().toLocaleTimeString('ar-EG'),
    m: msg
  });
  st('zkProgTxt', msg);
  const b = $('zkProgFill');
  if (b && pct != null) b.style.width = Math.max(0, Math.min(100, pct)) + '%';
  const l = $('zkLogBox');
  if (l) l.innerHTML = zkLog.slice(-40).map(x => `<div style="font-size:10px;color:var(--muted);padding:1px 0"><span style="opacity:.6">${x.t}</span> — ${x.m}</div>`).join('');
}
async function zkUpdate(force, onProgress) {
  if (zkBusy) return {ok:false,message:'يوجد تحديث قيد التنفيذ، انتظر اكتماله'};
  const progress=(message,pct)=>{zkSetProg(message,pct);if(onProgress)onProgress(message,pct);};
  if (!_cloudMode) {
    showToast('الجلب يتطلب اتصالاً بخدمة السوق', 'error');
    return {ok:false,message:'التحديث يتطلب اتصالاً بخدمة السوق؛ غير متاح في وضع التجربة'};
  }
  zkBusy = true;
  zkLog = [];
  const w = $('zkProgWrap');
  if (w) w.style.display = 'block';
  const b = $('zkBtnUpd');
  if (b) {
    b.disabled = true;
    b.style.opacity = '.6';
  }
  try {
    progress('قراءة المحفظة...', 5);
    const all = zkNeeded();
    if (!all.length) {
      progress('لا توجد أسهم أو صناديق', 100);
      return {ok:true,updated:0,failed:0,message:'لا توجد أسهم أو صناديق تحتاج تحديث النسب'};
    }
    const need = force ? all : all.filter(x => zkStale(x.ticker));
    if (!need.length) {
      progress('كل البيانات حديثة', 100);
      zkRender();
      return {ok:true,updated:0,failed:0,message:'كل البيانات حديثة'};
    }
    progress(`${need.length} شركة تحتاج تحديثاً${zkOpt.apiKey ? ' — عبر FMP' : ' — عبر ياهو'}...`, 15);
    const res = await new Promise((ok, bad) => {
      const t = setTimeout(() => bad(new Error('انتهت المهلة')), 300000);
      portfolioAPI.withSuccessHandler(r => {
        clearTimeout(t);
        ok(r);
      }).withFailureHandler(() => {
        clearTimeout(t);
        bad(new Error('تعذّر الاتصال بخدمة القوائم المالية'));
      }).zkFetchBatch(JSON.stringify(need), zkOpt.apiKey || '');
    });
    if (res && res.ok === false && res.phase === 'provider') {
      progress('توقف: ' + res.err, 100);
      showToast(res.err, 'error');
      return {ok:false,message:res.err||'تعذّر الاتصال بمصدر القوائم المالية'};
    }
    if (!res || !res.ok) {
      progress('فشل: ' + (res && res.err || 'غير معروف'), 100);
      return {ok:false,message:res && res.err || 'لم يرجع المصدر بيانات صالحة'};
    }
    let okN = 0,
      failN = 0;
    res.results.forEach((r, i) => {
      const tk = String(r.ticker || '').toUpperCase();
      const prev = zkDb[tk] || {};
      if (r.ok) {
        const hist = (prev.history || []).slice(-4);
        if (prev.fetchedAt) hist.push({
          at: prev.fetchedAt,
          date: prev.reportDate,
          ratio: prev.orig
        });
        zkDb[tk] = Object.assign({}, prev, r, {
          manual: prev.manual != null ? prev.manual : null,
          history: hist
        });
        const c = zkCalcRatio(zkDb[tk]);
        if (c) {
          zkDb[tk].zakatable = c.zakatable;
          zkDb[tk].orig = c.orig;
          zkDb[tk].fin = c.fin;
        }
        okN++;
      } else {
        zkDb[tk] = Object.assign({}, prev, {
          ticker: tk,
          companyName: prev.companyName || r.companyName || tk,
          status: r.status || 'error',
          lastErr: r.err || '',
          failedAt: new Date().toISOString()
        });
        failN++;
      }
      progress(`${tk}: ${r.ok ? 'تم عبر ' + r.via : 'فشل — ' + (r.err || '')}`, 15 + (i + 1) / res.results.length * 80);
    });
    zkSave();
    const via = res.via ? Object.keys(res.via).map(k => k + ' ' + res.via[k]).join(' · ') : '';
    progress(`اكتمل — نجح ${okN}، فشل ${failN}${via ? ' · ' + via : ''}`, 100);
    if (okN === 0) showToast('لم تنجح أي شركة — افتح الإعدادات وشغّل التشخيص', 'error');
    zkRender();
    return {ok:okN>0,updated:okN,failed:failN,message:okN>0?`تم تحديث ${okN} شركة${failN?`، وتعذّر تحديث ${failN} شركة؛ بقيت نسبها السابقة أو الاحتياطية`:''}`:'لم تنجح أي شركة؛ بقيت النسب السابقة أو الاحتياطية'};
  } catch (e) {
    progress('خطأ: ' + (e && e.message || e), 100);
    showToast(String(e && e.message || e), 'error');
    return {ok:false,message:String(e && e.message || e)};
  } finally {
    zkBusy = false;
    const b2 = $('zkBtnUpd');
    if (b2) {
      b2.disabled = false;
      b2.style.opacity = '1';
    }
  }
}
function zkUpdateOne(tk) {
  if (!_cloudMode) {
    showToast("\u064A\u062A\u0637\u0644\u0628 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642", 'error');
    return;
  }
  const info = zkNeeded().find(x => x.ticker === tk) || {
    ticker: tk
  };
  showToast('جاري تحديث ' + tk + '...', 'info');
  portfolioAPI.withSuccessHandler(res => {
    const r = res && res.results && res.results[0];
    if (r && r.ok) {
      const prev = zkDb[tk] || {};
      zkDb[tk] = Object.assign({}, prev, r, {
        manual: prev.manual != null ? prev.manual : null
      });
      const c = zkCalcRatio(zkDb[tk]);
      if (c) {
        zkDb[tk].zakatable = c.zakatable;
        zkDb[tk].orig = c.orig;
        zkDb[tk].fin = c.fin;
      }
      zkSave();
      zkRender();
      showToast('حُدّثت ' + tk + ' عبر ' + r.via, 'success');
    } else showToast('فشل: ' + (r && r.err || res && res.err || 'غير معروف'), 'error');
  }).withFailureHandler(() => showToast("\u062F\u0648\u0627\u0644 \u0627\u0644\u0632\u0643\u0627\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629 \u0641\u064A \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642", 'error')).zkFetchBatch(JSON.stringify([info]), zkOpt.apiKey || '');
}
function zkRefreshAllFunds() {
  if (!_cloudMode) {
    showToast("\u064A\u062A\u0637\u0644\u0628 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642", 'error');
    return;
  }
  const list = zkCalc().rows.filter(r => r.kind === 'fund').map(r => ({
    name: r.name,
    url: (zkFundTop(r.name) || {}).csvUrl
  })).filter(x => x.url);
  if (!list.length) {
    showToast('لا توجد صناديق لها رابط مكوّنات محفوظ', 'error');
    return;
  }
  const want = Math.max(1, Math.min(50, pN(zkOpt.topN) || 20));
  const b = $('zkBtnFunds');
  if (b) {
    b.disabled = true;
    b.style.opacity = '.6';
  }
  let i = 0,
    ok = 0,
    errs = [];
  const next = () => {
    if (i >= list.length) {
      if (b) {
        b.disabled = false;
        b.style.opacity = '1';
      }
      zkRender();
      if (errs.length) {
        zkFundsFail(errs, ok);
      } else {
        showToast('اكتمل — حُدّث ' + ok + ' صندوق', 'success');
        showToast('اضغط «تحديث» لجلب قوائم الشركات الجديدة', 'info');
      }
      return;
    }
    const f = list[i++];
    showToast('(' + i + '/' + list.length + ') ' + f.name + '...', 'info');
    portfolioAPI.withSuccessHandler(r => {
      if (r && r.ok && Array.isArray(r.top)) {
        const cur = customXray[f.name] || {};
        customXray[f.name] = Object.assign({}, cur, {
          label: cur.label || f.name,
          kind: 'etf',
          desc: 'تركيبة رسمية — ' + (r.count || 0) + ' مكوّن',
          countries: r.countries || cur.countries,
          sectors: r.sectors || cur.sectors,
          top: r.top,
          _count: r.count || 0,
          _csvUrl: f.url,
          _at: new Date().toISOString()
        });
        saveCustomXray();
        if (r.top.length < want && (r.count || 0) > r.top.length) {
          errs.push({
            name: f.name,
            url: f.url,
            r: {
              err: 'وصلت ' + r.top.length + ' شركة فقط بدل ' + want + ' (الملف فيه ' + (r.count || 0) + ')',
              hintOverride: r.topN === undefined ? "\u062A\u0639\u0630\u0651\u0631 \u062C\u0644\u0628 \u0627\u0644\u0645\u0635\u062F\u0631. \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u0648\u0625\u0639\u062F\u0627\u062F\u0627\u062A\u0647\u0627." : 'الخادم استلم الطلب لكن أعاد عدداً أقل — أعد المحاولة.'
            }
          });
        } else ok++;
      } else {
        errs.push({
          name: f.name,
          url: f.url,
          r: r || {
            err: 'رد فارغ من الخادم'
          }
        });
      }
      next();
    }).withFailureHandler(e => {
      errs.push({
        name: f.name,
        url: f.url,
        r: {
          err: 'تعذّر استدعاء fetchFundCsv',
          hintOverride: "\u062A\u0639\u0630\u0651\u0631 \u062C\u0644\u0628 \u0627\u0644\u0645\u0635\u062F\u0631. \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u0648\u0625\u0639\u062F\u0627\u062F\u0627\u062A\u0647\u0627." + (e && e.message ? '<br><br>رسالة النظام: ' + String(e.message).slice(0, 200) : '')
        }
      });
      next();
    }).fetchFundCsv(f.url, want);
  };
  next();
}
function zkRefreshFund(name) {
  const h = zkFundTop(name);
  if (!h || !h.csvUrl) {
    showToast('لا يوجد رابط Holdings محفوظ', 'error');
    return;
  }
  if (!_cloudMode) {
    showToast("\u064A\u062A\u0637\u0644\u0628 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642", 'error');
    return;
  }
  showToast('جاري تحديث مكوّنات ' + name + '...', 'info');
  portfolioAPI.withSuccessHandler(r => {
    if (!r || !r.ok) {
      zkCsvFail(name, r);
      return;
    }
    const want = Math.max(1, Math.min(50, pN(zkOpt.topN) || 20));
    const got = Array.isArray(r.top) ? r.top.length : 0;
    if (r.topN === undefined && got < want && (r.count || 0) > got) {
      zkCsvFail(name, {
        err: 'وصلت ' + got + ' شركة فقط بدل ' + want,
        hintOverride: "\u0645\u0644\u0641 <b>\u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642</b> \u0641\u064A \u0645\u0634\u0631\u0648\u0639\u0643 \u0644\u0645 \u064A\u064F\u062D\u062F\u064E\u0651\u062B \u0628\u0639\u062F \u2014 \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0642\u062F\u064A\u0645\u0629 \u062A\u064F\u0631\u062C\u0639 10 \u0634\u0631\u0643\u0627\u062A \u062F\u0627\u0626\u0645\u0627\u064B \u0648\u062A\u062A\u062C\u0627\u0647\u0644 \u0627\u0644\u0625\u0639\u062F\u0627\u062F.<br><br>" + "\u062A\u0639\u0630\u0651\u0631 \u062C\u0644\u0628 \u0627\u0644\u0645\u0635\u062F\u0631. \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u0648\u0625\u0639\u062F\u0627\u062F\u0627\u062A\u0647\u0627." + 'للتأكد أن النسخة حديثة: ابحث فيها عن دالة <code>zkCheckCsv</code> — إن لم تجدها فالنسخة قديمة.'
      });
      return;
    }
    const cur = customXray[name] || {};
    customXray[name] = Object.assign({}, cur, {
      label: cur.label || name,
      kind: 'etf',
      desc: 'تركيبة رسمية — ' + (r.count || 0) + ' مكوّن',
      countries: r.countries || cur.countries,
      sectors: r.sectors || cur.sectors,
      top: Array.isArray(r.top) ? r.top : cur.top || [],
      _count: r.count || 0,
      _csvUrl: h.csvUrl,
      _at: new Date().toISOString()
    });
    saveCustomXray();
    zkRender();
    showToast('حُدّثت مكوّنات ' + name + ' — ' + (Array.isArray(r.top) ? r.top.length : 0) + ' شركة من أصل ' + (r.count || 0), 'success');
  }).withFailureHandler(() => zkCsvFail(name, {
    err: "\u062F\u0627\u0644\u0629 fetchFundCsv \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629 \u0641\u064A \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642",
    hintOverride: "\u062A\u0639\u0630\u0651\u0631 \u062C\u0644\u0628 \u0627\u0644\u0645\u0635\u062F\u0631. \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u0648\u0625\u0639\u062F\u0627\u062F\u0627\u062A\u0647\u0627."
  })).fetchFundCsv(h.csvUrl, Math.max(1, Math.min(50, pN(zkOpt.topN) || 20)));
}
function zkRunDiag() {
  const o = $('zkDiagOut');
  if (!o) return;
  if (!_cloudMode) {
    o.style.display = 'block';
    o.innerHTML = "<span style=\"color:var(--red)\">\u064A\u062A\u0637\u0644\u0628 \u0641\u062A\u062D \u0627\u0644\u0623\u062F\u0627\u0629 \u0645\u0646 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642</span>";
    return;
  }
  o.style.display = 'block';
  o.innerHTML = '⏳ جاري التشخيص...';
  portfolioAPI.withSuccessHandler(r => {
    const rows = (r.steps || []).map(s => `<div style="display:flex;gap:6px;padding:2px 0">
        <span style="color:${s.ok ? 'var(--green)' : 'var(--red)'}">${s.ok ? '✓' : '✗'}</span>
        <span style="flex:1">${s.name}${s.code ? ' <span style="opacity:.6">(' + s.code + ')</span>' : ''}
        ${s.note ? '<br><span style="opacity:.7;font-size:9.5px">' + s.note + '</span>' : ''}</span></div>`).join('');
    let extra = '';
    if (r.summary) extra = `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--wline)">
        إجمالي الأصول: ${Number(r.summary.totalAssets).toLocaleString('en-US')}<br>
        الأصول الزكوية: ${Number(r.summary.zakatableRaw).toLocaleString('en-US')}<br>
        النسبة قبل الاحتياط: <b style="color:var(--gold)">${fmt(r.summary.ratio * 100, 2)}%</b></div>`;
    o.style.background = r.ok ? 'rgba(62,207,142,.09)' : 'rgba(246,109,109,.08)';
    o.style.color = r.ok ? 'var(--green)' : 'var(--red)';
    o.innerHTML = (r.ok ? '✓ المصدر يعمل' : '✗ فشل') + '<div style="margin-top:6px;color:var(--text)">' + rows + extra + '</div>';
  }).withFailureHandler(() => {
    o.style.background = 'rgba(246,109,109,.08)';
    o.style.color = 'var(--red)';
    o.innerHTML = "\u062A\u0639\u0630\u0651\u0631 \u062C\u0644\u0628 \u0627\u0644\u0645\u0635\u062F\u0631. \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u0648\u0625\u0639\u062F\u0627\u062F\u0627\u062A\u0647\u0627.";
  }).zkDiag('MSFT');
}
function zkTestApiKey() {
  const o = $('zkKeyOut');
  if (!o) return;
  const k = ($('zkKeyIn') && $('zkKeyIn').value || '').trim() || zkOpt.apiKey;
  if (!k) {
    o.style.display = 'block';
    o.style.color = 'var(--red)';
    o.innerHTML = 'الصق المفتاح أولاً';
    return;
  }
  if (!_cloudMode) {
    o.style.display = 'block';
    o.style.color = 'var(--red)';
    o.innerHTML = "\u064A\u062A\u0637\u0644\u0628 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642";
    return;
  }
  o.style.display = 'block';
  o.style.color = 'var(--muted)';
  o.innerHTML = '⏳ جاري الاختبار...';
  portfolioAPI.withSuccessHandler(r => {
    if (r && r.ok) {
      zkOpt.apiKey = k;
      zkSave();
      o.style.color = 'var(--green)';
      o.innerHTML = '✓ المفتاح يعمل وحُفظ<br>تقرير ' + (r.reportDate || '') + ' · نسبة تقديرية ' + fmt((r.previewRatio || 0) * 100, 2) + '%';
      zkRender();
    } else {
      o.style.color = 'var(--red)';
      o.innerHTML = '✗ ' + (r && r.err || 'فشل');
    }
  }).withFailureHandler(() => {
    o.style.color = 'var(--red)';
    o.innerHTML = "\u2717 \u062F\u0627\u0644\u0629 zkTestKey \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629 \u0641\u064A \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642";
  }).zkTestKey(k, 'MSFT');
}
function zkSetOpt(k, v) {
  if (['margin', 'rate', 'cacheDays', 'pctVal', 'goldGram', 'silverGram', 'debts', 'topN'].includes(k)) zkOpt[k] = pN(v);else zkOpt[k] = v;
  zkSave();
  zkRender();
}
function zkSetRule(k, v) {
  if (v === 'auto') delete zkRule[k];else zkRule[k] = v;
  Object.keys(zkDb).forEach(t => {
    const c = zkCalcRatio(zkDb[t]);
    if (c) {
      zkDb[t].zakatable = c.zakatable;
      zkDb[t].orig = c.orig;
      zkDb[t].fin = c.fin;
    }
  });
  zkSave();
  zkRender();
}
function zkManual(tk) {
  const co = zkDb[tk];
  const cur = co && co.manual != null ? (co.manual * 100).toFixed(2) : '';
  const v = prompt('النسبة الزكوية اليدوية لـ ' + tk + ' (%)\nاتركها فارغة للعودة للتلقائي:', cur);
  if (v === null) return;
  if (!zkDb[tk]) zkDb[tk] = {
    ticker: tk,
    companyName: tk,
    status: 'manual'
  };
  if (String(v).trim() === '') {
    zkDb[tk].manual = null;
    showToast('رجعت للتلقائي', 'success');
  } else {
    const n = parseFloat(v);
    if (!isFinite(n) || n < 0 || n > 100) {
      showToast('نسبة غير صالحة', 'error');
      return;
    }
    zkDb[tk].manual = n / 100;
    zkDb[tk].manualAt = new Date().toISOString();
    showToast('طُبّقت نسبة يدوية', 'success');
  }
  zkSave();
  zkRender();
}
const ZK_ST = {
  ok: {
    ar: 'محدّثة',
    c: 'var(--green)'
  },
  stale: {
    ar: 'قديمة',
    c: '#e0a050'
  },
  manual: {
    ar: 'يدوية',
    c: 'var(--blue)'
  },
  not_found: {
    ar: 'لم يعثر عليها المزوّد',
    c: 'var(--red)'
  },
  no_total: {
    ar: 'بلا إجمالي أصول',
    c: 'var(--red)'
  },
  auth: {
    ar: 'مفتاح مرفوض',
    c: 'var(--red)'
  },
  limit: {
    ar: 'تجاوز الحد',
    c: '#e0a050'
  },
  error: {
    ar: 'فشل الجلب',
    c: 'var(--red)'
  },
  bad_symbol: {
    ar: 'رمز غير صالح',
    c: 'var(--red)'
  },
  none: {
    ar: 'لم تُجلب',
    c: 'var(--muted)'
  }
};
function zkStOf(tk) {
  const co = zkDb[String(tk).toUpperCase()];
  if (!co) return 'none';
  if (co.manual != null) return 'manual';
  if (!co.items || !co.items.totalAssets) return co.status || 'error';
  return zkStale(tk) ? 'stale' : 'ok';
}
const zkP = r => fmt((r || 0) * 100, 1) + '%';
function zkRender() {
  const z = zkCalc(),
    rows = z.rows;
  const funds = rows.filter(r => r.kind === 'fund'),
    stocks = rows.filter(r => r.kind === 'stock'),
    direct = rows.filter(r => r.kind === 'direct');
  const S = a => a.reduce((s, r) => s + r.val, 0);
  const rev = zkReview();
  st('zkSrcNow', zkOpt.apiKey ? 'Financial Modeling Prep' : 'Yahoo Finance');
  const ch = $('zkChips');
  if (ch) ch.innerHTML = `<div class="xr-chip"><div class="v">${fmtC(S(rows))}</div><div class="l">إجمالي المحفظة</div></div>` + `<div class="xr-chip"><div class="v">${fmtC(S(direct))}</div><div class="l">أصول مباشرة</div></div>` + `<div class="xr-chip"><div class="v">${fmtC(S(stocks))}</div><div class="l">أسهم</div></div>` + `<div class="xr-chip"><div class="v">${fmtC(S(funds))}</div><div class="l">صناديق</div></div>` + `<div class="xr-chip"><div class="v gold">${fmtC(z.pool)}</div><div class="l">الوعاء الزكوي</div></div>` + `<div class="xr-chip"><div class="v gold">${fmtC(z.due)}</div><div class="l">الزكاة الواجبة</div></div>` + `<div class="xr-chip"><div class="v">${S(rows) > 0 ? fmt(z.due / S(rows) * 100, 2) : '0'}%</div><div class="l">النسبة الفعلية</div></div>` + `<div class="xr-chip"><div class="v" style="color:${rev.length ? '#e0a050' : 'var(--green)'}">${rev.length}</div><div class="l">تحتاج مراجعة</div></div>`;
  const pct = z.nisab > 0 ? Math.min(100, z.net / z.nisab * 100) : 0;
  const ring = $('zkRing');
  if (ring) {
    ring.style.stroke = z.reached ? 'var(--green)' : 'var(--gold)';
    ring.style.strokeDashoffset = (263.9 * (1 - pct / 100)).toFixed(1);
  }
  st('zkRingPct', z.nisab > 0 ? fmt(pct, 0) + '%' : '—');
  st('zkDue', z.reached ? fmtC(z.due) : '—');
  st('zkPool', fmtC(z.pool));
  st('zkDebtV', z.debts > 0 ? '− ' + fmtC(z.debts) : '—');
  st('zkNet', fmtC(z.net));
  st('zkNis', z.nisab > 0 ? fmtC(z.nisab) : 'حدّد سعر المعدن');
  const se = $('zkStat');
  if (se) se.innerHTML = z.nisab <= 0 ? '<span style="color:var(--muted)">أدخل سعر الغرام من الإعدادات</span>' : z.reached ? '<span style="color:var(--green);font-weight:600">✓ بلغت النصاب</span>' : '<span style="color:var(--muted)">لم تبلغ النصاب — يتبقى ' + fmtC(z.nisab - z.net) + '</span>';
  const fc = $('zkFundsC'),
    fe = $('zkFunds');
  if (fc) fc.style.display = funds.length ? 'block' : 'none';
  const wantN = Math.max(1, Math.min(50, pN(zkOpt.topN) || 20));
  const short = funds.filter(r => {
    const t = zkFundTop(r.name);
    return t && t.csvUrl && t.top.length < wantN && (t.count || 0) > t.top.length;
  });
  const fw = $('zkFundsWarn');
  if (fw) {
    if (short.length) {
      fw.style.display = 'block';
      fw.innerHTML = '<b style="color:#e0a050">المكوّنات المحفوظة أقل من الإعداد الحالي (' + wantN + ' شركة)</b><br>' + short.map(r => {
        const t = zkFundTop(r.name);
        return r.name + ': ' + t.top.length + ' محفوظة' + (t.count > t.top.length ? ' من أصل ' + t.count : '');
      }).join(' · ') + '<br><span style="color:var(--muted)">اضغط «تحديث المكوّنات» بالأعلى لإعادة قراءة الملفات، ثم «تحديث».</span>';
    } else fw.style.display = 'none';
  }
  if (fe) fe.innerHTML = funds.map(r => {
    const f = r.fund,
      e = String(r.name).replace(/'/g, "\\'");
    return `<div style="border-bottom:1px solid var(--wline);padding:11px 0">
      <div style="display:flex;align-items:center;gap:9px">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600">${r.name}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px">${fmtC(r.val)}${f ? ' · أكبر ' + fmt(f.sumW, 1) + '% · باقي ' + fmt(f.rest, 1) + '%' : ' · التركيبة غير متوفرة'}</div>
          ${(customXray[r.name] || {})._at ? `<div style="font-size:9.5px;color:var(--muted);margin-top:2px"><i class="ti ti-file-download" style="font-size:10px"></i> مكوّنات محدّثة ${(customXray[r.name]._at || '').slice(0, 10)}${customXray[r.name]._count ? ' · ' + customXray[r.name]._count + ' شركة' : ''}</div>` : ''}
        </div>
        <div style="text-align:left;flex-shrink:0">
          <div style="font-size:13px;font-weight:600;font-family:inherit;color:var(--gold);direction:ltr">${zkP(r.ratio)}</div>
          <div style="font-size:9.5px;color:var(--muted)">نسبة زكوية</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:7px">
        <span style="font-size:10px;color:${f && f.missing.length ? '#e0a050' : 'var(--muted)'}">${f ? f.known + '/' + f.top.length + ' شركة محدّثة' + (f.missing.length ? ' · ' + f.missing.length + ' بـ100% احتياطي' : '') : '—'}</span>
        <div style="display:flex;gap:6px">
          <button class="btn-xs" onclick="zkOpenFund('${e}')">تفاصيل</button>
          ${f && f.csvUrl ? `<button class="btn-xs" onclick="zkRefreshFund('${e}')">تحديث المكوّنات</button>` : ''}
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10.5px;margin-top:6px;color:var(--muted)">
        <span>الوعاء منه</span><span style="font-weight:600;font-family:inherit;color:var(--gold);direction:ltr">${fmtC(r.zVal)}</span>
      </div></div>`;
  }).join('');
  const sc = $('zkStocksC'),
    se2 = $('zkStocks');
  if (sc) sc.style.display = stocks.length ? 'block' : 'none';
  if (se2) se2.innerHTML = stocks.map(r => {
    const tk = zkTickerOf(r.name),
      s = zkStOf(tk),
      M = ZK_ST[s] || ZK_ST.none,
      co = zkDb[tk];
    return `<div style="border-bottom:1px solid var(--wline);padding:11px 0">
      <div style="display:flex;align-items:center;gap:9px">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600">${r.name} <span style="font-size:9.5px;color:var(--muted);direction:ltr">${co && co.symbol ? co.symbol : tk}</span></div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px">${fmtC(r.val)}</div>
          ${co && co.reportDate ? `<div style="font-size:9.5px;color:var(--muted);margin-top:2px"><i class="ti ti-database" style="font-size:10px"></i> ${co.sourceName || ''} · تقرير ${co.reportDate}${co.fetchedAt ? ' · جُلبت ' + co.fetchedAt.slice(0, 10) : ''}</div>` : ''}
        </div>
        <div style="text-align:left;flex-shrink:0">
          <div style="font-size:13px;font-weight:600;font-family:inherit;color:var(--gold);direction:ltr">${zkP(r.ratio)}</div>
          <div style="font-size:9.5px;color:${M.c}">${M.ar}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:7px">
        <span style="font-size:10.5px;color:var(--muted)">الوعاء <b style="color:var(--gold);font-family:inherit">${fmtC(r.zVal)}</b></span>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn-xs" onclick="zkOpenCo('${tk}')">تفاصيل</button>
          <button class="btn-xs" onclick="zkUpdateOne('${tk}')">تحديث</button>
          <button class="btn-xs" onclick="zkManual('${tk}')">يدوي</button>
        </div>
      </div></div>`;
  }).join('');
  const de = $('zkDirect');
  if (de) {
    let h = '';
    ZK_ORD.forEach(tp => {
      const it = direct.filter(r => r.type === tp);
      if (!it.length) return;
      const sub = it.reduce((a, r) => a + r.zVal, 0);
      h += `<div style="margin-top:12px"><div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:6px;border-bottom:1px solid var(--wline);margin-bottom:4px">
        <span style="font-size:11.5px;font-weight:600;display:flex;align-items:center;gap:6px"><i class="ti ${ZK_ICON[tp]}" style="color:var(--gold);font-size:14px"></i> ${ZK_TYPE[tp]}</span>
        <span style="font-size:11px;font-weight:600;font-family:inherit;color:${sub > 0 ? 'var(--gold)' : 'var(--muted)'};direction:ltr">${sub > 0 ? fmtC(sub) : 'معفى'}</span></div>`;
      it.forEach(r => {
        const e = String(r.key).replace(/'/g, "\\'");
        const o = (v, l) => `<option value="${v}" ${r.treat === v ? 'selected' : ''}>${l}</option>`;
        h += `<div style="display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid var(--wline)">
          <div style="flex:1;min-width:0"><div style="font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.name}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:1px;direction:ltr;text-align:right">${fmtC(r.val)}</div></div>
          <select onchange="zkSetTreat('${e}',this.value)" style="flex-shrink:0;background:var(--surf2);border:1px solid var(--bdr2);color:${r.treat === 'exempt' ? 'var(--muted)' : 'var(--gold)'};border-radius:9px;padding:6px 8px;font-size:11px;font-family:inherit;outline:none;cursor:pointer">
            ${o('full', 'زكوي كامل')}${o('pct', 'جزء (' + fmt(pN(zkOpt.pctVal) || 0, 0) + '%)')}${o('exempt', 'معفى')}</select>
          <div style="flex-shrink:0;width:84px;text-align:left;direction:ltr;font-size:11.5px;font-weight:600;font-family:inherit;color:${r.zVal > 0 ? 'var(--gold)' : 'var(--muted)'}">${r.zVal > 0 ? fmtC(r.zVal) : '—'}</div>
        </div>`;
      });
      h += '</div>';
    });
    de.innerHTML = h || '<div style="font-size:11.5px;color:var(--muted);padding:8px 0">لا توجد أصول</div>';
  }
  const hi = $('zkHawlIn');
  if (hi && hi.value !== zkOpt.hawlStart) hi.value = zkOpt.hawlStart || '';
  const he = $('zkHawlInfo'),
    hw = zkHawl();
  if (he) he.innerHTML = !hw ? '<span style="color:var(--muted)">حدّد التاريخ ليُحسب الاستحقاق</span>' : hw.remaining <= 0 ? '<span style="color:var(--green);font-weight:600">✓ تم الحول</span> — استحقّت ' + hw.dueStr : 'مضى <b style="color:var(--text)">' + Math.max(0, hw.elapsed) + '</b> من ' + hw.days + ' يوم — يتبقى <b style="color:var(--gold)">' + hw.remaining + '</b> يوم (' + hw.dueStr + ')';
  const rc = $('zkRevC'),
    re = $('zkRev');
  if (rc) rc.style.display = rev.length ? 'block' : 'none';
  st('zkRevN', rev.length ? '(' + rev.length + ')' : '');
  if (re) re.innerHTML = rev.map(x => `<div style="display:flex;gap:9px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--wline)">
    <i class="ti ${x.icon || 'ti-alert-circle'}" style="color:${x.color || '#e0a050'};font-size:15px;flex-shrink:0;margin-top:1px"></i>
    <div style="flex:1;min-width:0"><div style="font-size:12px;color:var(--text)">${x.t}</div>
    <div style="font-size:10px;color:var(--muted);margin-top:2px;line-height:1.7">${x.d}</div></div>
    ${x.a ? `<button class="btn-xs" onclick="${x.a}">${x.al || 'إصلاح'}</button>` : ''}</div>`).join('');
  const ru = $('zkRules');
  if (ru) ru.innerHTML = Object.keys(ZK_ITEM).map(k => {
    const d = ZK_ITEM[k],
      c = zkItemCls(k),
      isD = zkRule[k] == null;
    const o = (v, l) => `<option value="${v}" ${String(c) === v ? 'selected' : ''}>${l}</option>`;
    return `<div style="display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--wline)">
      <div style="flex:1;min-width:0"><div style="font-size:12px">${d.ar}</div>
      <div style="font-size:9.5px;color:var(--muted);direction:ltr;text-align:right">${k}${isD ? '' : ' · معدّل'}</div></div>
      <select onchange="zkSetRule('${k}',this.value)" style="flex-shrink:0;background:var(--surf2);border:1px solid var(--bdr2);color:${c === 'n' ? 'var(--muted)' : 'var(--gold)'};border-radius:9px;padding:6px 8px;font-size:11px;font-family:inherit;outline:none;cursor:pointer">
        <option value="auto" ${isD ? 'selected' : ''}>افتراضي (${d.cls === 'z' ? 'زكوي' : d.cls === 'n' ? 'غير زكوي' : 'مراجعة'})</option>
        ${o('z', 'زكوي 100%')}${o('n', 'غير زكوي')}${o('50', 'جزئي 50%')}</select></div>`;
  }).join('');
  const g = zkOpt.nisabBase !== 'silver';
  $('zkNisG')?.classList.toggle('active', g);
  $('zkNisS')?.classList.toggle('active', !g);
  const gr = $('zkGoldRow'),
    sr = $('zkSilvRow');
  if (gr) gr.style.display = g ? 'flex' : 'none';
  if (sr) sr.style.display = g ? 'none' : 'flex';
  const sv = (id, v) => {
    const e = $(id);
    if (e && document.activeElement !== e) e.value = v;
  };
  const gi = $('zkGoldIn');
  if (gi && document.activeElement !== gi) {
    const au = zkGoldGram();
    gi.placeholder = au > 0 ? 'تلقائي: ' + fmt(au * sarToBase(1), 1) + ' ' + CUR_SYMS[baseCur] : 'أدخل السعر';
    gi.value = pN(zkOpt.goldGram) > 0 ? fmt(pN(zkOpt.goldGram), 2) : '';
  }
  sv('zkSilvIn', pN(zkOpt.silverGram) > 0 ? fmt(pN(zkOpt.silverGram), 2) : '');
  sv('zkDebtIn', pN(zkOpt.debts) > 0 ? fmt(pN(zkOpt.debts), 2) : '');
  sv('zkRateIn', pN(zkOpt.rate) || 2.5);
  sv('zkMarginIn', pN(zkOpt.margin) || 10);
  sv('zkCacheIn', pN(zkOpt.cacheDays) || 120);
  sv('zkPctIn', pN(zkOpt.pctVal) || 30);
  sv('zkTopIn', pN(zkOpt.topN) || 20);
  const th2 = $('zkTopHint');
  if (th2) {
    const cov = funds.map(r => r.fund).filter(Boolean);
    const avg = cov.length ? cov.reduce((s, f) => s + f.sumW, 0) / cov.length : 0;
    th2.innerHTML = 'كلما زاد العدد قلّ الجزء المحتسب 100% احتياطاً ودقّت النتيجة — لكن الجلب يستغرق وقتاً أطول.' + (cov.length ? `<br>التغطية الحالية: <b style="color:var(--gold)">${fmt(avg, 1)}%</b> من وزن الصندوق وسطياً.` : '') + '<br>بعد التغيير اضغط «تحديث المكوّنات» لكل صندوق ثم «تحديث».';
  }
  st('zkKeyState', zkOpt.apiKey ? '✓ مفتاح محفوظ (مخفي)' : 'لا يوجد مفتاح — تُستخدم بيانات ياهو');
  st('zkCurLbl', CUR_SYMS[baseCur] + ' ' + baseCur);
}
function zkReview() {
  const out = [];
  zkRows().forEach(r => {
    const k = zkKindOf(r);
    if (k === 'stock') {
      const tk = zkTickerOf(r.name),
        s = zkStOf(tk);
      if (s === 'none') out.push({
        t: r.name + ' — لم تُجلب قوائمها',
        d: 'تُحتسب 100% احتياطاً.',
        a: `zkUpdateOne('${tk}')`,
        al: 'تحديث'
      });else if (s === 'auth') out.push({
        t: 'المفتاح مرفوض',
        d: 'افتح الإعدادات وأعد إدخال مفتاح FMP.',
        a: "openModal('zkSetM')",
        al: 'الإعدادات',
        color: 'var(--red)'
      });else if (s === 'limit') out.push({
        t: 'تجاوزت حد الطلبات',
        d: 'انتظر حتى الغد أو رقّ خطتك.',
        color: '#e0a050'
      });else if (s === 'not_found') out.push({
        t: r.name + ' — لم يعثر عليها المزوّد',
        d: 'قد تكون خارج التغطية المجانية. أدخل النسبة يدوياً.',
        a: `zkManual('${tk}')`,
        al: 'يدوي',
        color: 'var(--red)'
      });else if (s === 'no_total' || s === 'error') out.push({
        t: r.name + ' — فشل الجلب',
        d: zkDb[tk] && zkDb[tk].lastErr || '',
        a: `zkUpdateOne('${tk}')`,
        al: 'إعادة',
        color: 'var(--red)'
      });else if (s === 'stale') out.push({
        t: r.name + ' — بيانات قديمة',
        d: 'مضت مدة الصلاحية.',
        a: `zkUpdateOne('${tk}')`,
        al: 'تحديث'
      });
    }
    if (k === 'fund') {
      const f = zkFundRatio(r.name);
      if (!f) out.push({
        t: r.name + ' — تركيبة غير متوفرة',
        d: 'يُحتسب 100%. عرّفها من صفحة الخريطة.',
        color: 'var(--red)'
      });else {
        if (f.missing.length) out.push({
          t: r.name + ' — ' + f.missing.length + ' شركة بلا بيانات',
          d: 'تُحتسب 100%: ' + f.missing.slice(0, 6).join('، '),
          a: 'zkUpdate(false)',
          al: 'تحديث'
        });
        if (f.sumW > 0 && f.sumW < 15) out.push({
          t: r.name + ' — تغطية ضعيفة',
          d: 'أكبر الشركات ' + fmt(f.sumW, 1) + '% فقط، والباقي 100%. النتيجة متحفظة.'
        });
      }
    }
  });
  const amb = Object.keys(ZK_ITEM).filter(k => ZK_ITEM[k].cls === 'r' && zkRule[k] == null);
  if (amb.length) out.push({
    t: 'بنود بحاجة قرار',
    d: 'تُحتسب زكوية مؤقتاً: ' + amb.map(k => ZK_ITEM[k].ar).join('، '),
    icon: 'ti-list-details'
  });
  return out;
}
function zkOpenCo(tk) {
  const co = zkDb[tk],
    b = $('zkCoB');
  st('zkCoT', co && co.companyName || tk);
  if (!b) return;
  if (!co || !co.items) {
    b.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:10px 0">لا توجد بيانات محفوظة.<br>' + (co && co.lastErr ? '<span style="color:var(--red)">' + co.lastErr + '</span>' : 'اضغط «تحديث» لجلبها.') + '</div>';
    openModal('zkCoM');
    return;
  }
  const c = zkCalcRatio(co);
  const m = n => Number(n).toLocaleString('en-US');
  const cur = co.reportingCurrency && co.reportingCurrency !== '—' ? ' ' + co.reportingCurrency : '';
  const age = co.fetchedAt ? Math.floor((Date.now() - new Date(co.fetchedAt).getTime()) / 86400000) : null;
  const stale = zkStale(tk);
  let html = `<div style="background:var(--surf2);border:1px solid var(--bdr);border-radius:14px;padding:12px;margin-bottom:12px">
    <div style="font-size:11px;font-weight:600;color:var(--gold);margin-bottom:8px"><i class="ti ti-database"></i> مصدر البيانات</div>
    <div style="display:grid;grid-template-columns:auto 1fr;gap:6px 10px;font-size:11px">
      <span style="color:var(--muted)">المزوّد</span><span>${co.sourceName || '—'}${co.sourceType === 'official' ? ' <span style="color:var(--green)">· رسمي</span>' : ' <span style="color:var(--muted)">· مزوّد بيانات</span>'}</span>
      <span style="color:var(--muted)">الرمز المستخدم</span><span style="direction:ltr;text-align:right">${co.symbol || tk}</span>
      <span style="color:var(--muted)">نوع التقرير</span><span>${co.reportType === 'annual' ? 'سنوي' : 'فصلي'}${co.reportForm ? ' · ' + co.reportForm : ''}</span>
      <span style="color:var(--muted)">تاريخ التقرير</span><span style="direction:ltr;text-align:right">${co.reportDate || '—'}</span>
      <span style="color:var(--muted)">عملة القوائم</span><span>${co.reportingCurrency || 'غير محددة'}</span>
      <span style="color:var(--muted)">تاريخ الجلب</span><span style="direction:ltr;text-align:right">${(co.fetchedAt || '').slice(0, 16).replace('T', ' ')}${age != null ? ' <span style="color:' + (stale ? '#e0a050' : 'var(--muted)') + '">(' + age + ' يوم)</span>' : ''}</span>
      ${co.via ? `<span style="color:var(--muted)">مسار الجلب</span><span style="font-size:10px;direction:ltr;text-align:right">${co.via}</span>` : ''}
    </div>
    ${co.sourceUrl ? `<a href="${co.sourceUrl}" target="_blank" style="display:inline-flex;align-items:center;gap:5px;margin-top:9px;font-size:11px;color:var(--gold)"><i class="ti ti-external-link"></i> افتح القوائم المالية في المصدر للمراجعة</a>` : ''}
    ${co.filingUrl && co.filingUrl !== co.sourceUrl ? `<br><a href="${co.filingUrl}" target="_blank" style="font-size:11px;color:var(--gold)"><i class="ti ti-file-text"></i> الإيداع الرسمي الأصلي</a>` : ''}
    ${stale ? '<div style="margin-top:8px;font-size:10px;color:#e0a050">مضت مدة الصلاحية — يُنصح بالتحديث</div>' : ''}
  </div>`;
  if (c) {
    const marg = pN(zkOpt.margin) || 0;
    html += `<div style="font-size:11px;font-weight:600;color:var(--gold);margin:14px 0 8px"><i class="ti ti-math-symbols"></i> كيف حُسبت النسبة</div>`;
    html += `<div style="background:var(--surf2);border-radius:12px;padding:10px 12px;margin-bottom:8px">
      <div style="font-size:10.5px;color:var(--text);margin-bottom:7px"><b>١</b> جمع الأصول الزكوية من قائمة المركز المالي</div>`;
    c.items.forEach(i2 => {
      const inc = i2.f > 0;
      html += `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--wline)">
        <span style="color:${inc ? 'var(--green)' : 'var(--muted)'};font-size:11px;width:12px">${inc ? '+' : '−'}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:11px;color:${inc ? 'var(--text)' : 'var(--muted)'}">${i2.ar}</div>
          <div style="font-size:9px;color:var(--muted);direction:ltr;text-align:right">${i2.tag ? i2.tag.tag : ''}${i2.tag && i2.tag.end ? ' · ' + i2.tag.end : ''}</div>
        </div>
        <div style="font-size:11px;direction:ltr;color:${inc ? 'var(--text)' : 'var(--muted)'};text-decoration:${inc ? 'none' : 'line-through'}">${m(i2.val)}</div>
        <div style="font-size:9.5px;min-width:52px;text-align:left;color:${inc ? 'var(--gold)' : 'var(--muted)'}">${i2.f === 1 ? 'كامل' : i2.f === 0 ? 'مستبعد' : 'جزئي ' + fmt(i2.f * 100, 0) + '%'}</div>
      </div>`;
    });
    html += `<div style="display:flex;justify-content:space-between;padding-top:8px;font-size:11.5px">
      <b style="color:var(--text)">مجموع الأصول الزكوية</b>
      <b style="color:var(--gold);direction:ltr">${m(c.zakatable)}${cur}</b></div></div>`;
    html += `<div style="background:var(--surf2);border-radius:12px;padding:10px 12px;margin-bottom:8px">
      <div style="font-size:10.5px;color:var(--text);margin-bottom:7px"><b>٢</b> القسمة على إجمالي أصول الشركة</div>
      <div style="display:flex;justify-content:space-between;font-size:11px;padding:4px 0">
        <span style="color:var(--muted)">إجمالي أصول الشركة</span><span style="direction:ltr">${m(c.total)}${cur}</span></div>
      <div style="background:var(--surf);border-radius:9px;padding:8px 10px;margin-top:7px;direction:ltr;text-align:center;font-size:11px;color:var(--muted)">
        ${m(c.zakatable)} ÷ ${m(c.total)} = <b style="color:var(--gold)">${zkP(c.orig)}</b></div></div>`;
    html += `<div style="background:var(--surf2);border-radius:12px;padding:10px 12px;margin-bottom:8px">
      <div style="font-size:10.5px;color:var(--text);margin-bottom:7px"><b>٣</b> إضافة هامش الاحتياط (${marg}% نسبية)</div>
      <div style="background:var(--surf);border-radius:9px;padding:8px 10px;direction:ltr;text-align:center;font-size:11px;color:var(--muted)">
        ${zkP(c.orig)} × ${(1 + marg / 100).toFixed(2)} = <b style="color:var(--gold)">${zkP(c.fin)}</b>${c.orig * (1 + marg / 100) > 1 ? ' <span style="color:#e0a050">(حُدّت عند 100%)</span>' : ''}</div></div>`;
    const eff = co.manual != null ? co.manual : c.fin;
    html += `<div style="background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.25);border-radius:12px;padding:11px 12px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:11.5px;color:var(--text)">النسبة الزكوية المعتمدة</span>
        <span style="font-size:17px;font-weight:600;color:var(--gold);direction:ltr">${zkP(eff)}</span></div>
      ${co.manual != null ? `<div style="font-size:10px;color:var(--blue);margin-top:5px">تعديل يدوي — التلقائية كانت ${zkP(c.fin)}${co.manualAt ? ' · ' + co.manualAt.slice(0, 10) : ''}</div>` : ''}
    </div>`;
  }
  const row = zkCalc().rows.find(r => r.kind === 'stock' && zkTickerOf(r.name) === tk);
  if (row) {
    html += `<div style="font-size:11px;font-weight:600;color:var(--gold);margin:14px 0 8px"><i class="ti ti-wallet"></i> الأثر على محفظتك</div>
    <div style="background:var(--surf2);border-radius:12px;padding:10px 12px">
      <div style="display:flex;justify-content:space-between;font-size:11px;padding:4px 0"><span style="color:var(--muted)">قيمة استثمارك</span><span style="direction:ltr">${fmtC(row.val)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:11px;padding:4px 0"><span style="color:var(--muted)">× النسبة الزكوية</span><span style="direction:ltr;color:var(--gold)">${zkP(row.ratio)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:11.5px;padding:7px 0 0;border-top:1px solid var(--wline);margin-top:4px"><b>الوعاء من هذا السهم</b><b style="color:var(--gold);direction:ltr">${fmtC(row.zVal)}</b></div>
    </div>`;
  }
  if (co.history && co.history.length) {
    html += `<div style="font-size:11px;font-weight:600;color:var(--gold);margin:14px 0 6px"><i class="ti ti-history"></i> سجل التحديثات</div>`;
    html += co.history.slice().reverse().map(x => `<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);padding:4px 0;border-bottom:1px solid var(--wline)">
      <span>${(x.at || '').slice(0, 10)}</span><span>تقرير ${x.date || '—'}</span><span style="direction:ltr">${x.ratio != null ? zkP(x.ratio) : '—'}</span></div>`).join('');
  }
  html += `<div style="display:flex;gap:8px;margin-top:14px">
    <button class="btn-outline" style="flex:1" onclick="closeModal('zkCoM');zkUpdateOne('${tk}')"><i class="ti ti-refresh"></i> تحديث</button>
    <button class="btn-outline" style="flex:1" onclick="closeModal('zkCoM');zkManual('${tk}')"><i class="ti ti-pencil"></i> نسبة يدوية</button>
  </div>`;
  b.innerHTML = html;
  openModal('zkCoM');
}
function zkFundsFail(errs, okN) {
  const b = $('zkFundB');
  st('zkFundT', 'نتيجة تحديث المكوّنات');
  if (!b) {
    showToast('فشل ' + errs.length + ' صندوق', 'error');
    return;
  }
  let html = '';
  if (okN) html += `<div style="background:rgba(62,207,142,.09);border:1px solid rgba(62,207,142,.25);border-radius:12px;padding:10px 12px;font-size:11.5px;color:var(--green);margin-bottom:11px">✓ نجح ${okN} صندوق</div>`;
  html += `<div style="font-size:11px;color:var(--muted);margin-bottom:10px">تعذّر تحديث ${errs.length} صندوق — التفاصيل أدناه. المكوّنات القديمة ما زالت محفوظة والحساب مستمر بها.</div>`;
  errs.forEach(e => {
    const r = e.r || {};
    let hint = r.hintOverride;
    const looksPage = e.url && !(String(e.url).includes('.ajax?') && String(e.url).includes('fileType=csv'));
    if (!hint && looksPage) hint = '<b style="color:#e0a050">الرابط المحفوظ يبدو رابط صفحة لا ملف بيانات.</b><br>' + 'الرابط الصحيح يحوي <code>.ajax?</code> و <code>fileType=csv</code>.<br><br>' + 'افتح صفحة الصندوق على iShares ← <b>Holdings</b> ← اضغط <b>Detailed Holdings and Analytics</b> ← ' + 'انقر بزر الفأرة الأيمن على <b>Download</b> واختر <b>نسخ عنوان الرابط</b> ← الصقه من صفحة الخريطة الاستثمارية.';
    if (!hint) {
      if (r.kind === 'html') hint = 'الرابط أعاد صفحة ويب لا ملف بيانات. افتح صفحة الصندوق على iShares ← <b>Detailed Holdings and Analytics</b> ← <b>Download</b> ← انسخ رابط الملف المباشر.';else if (r.kind === 'no_header') hint = 'الملف وصل لكن لا يحوي صف أعمدة معروف — تأكد أنه ملف Holdings.';else if (r.kind === 'no_weight' || r.kind === 'no_name') hint = 'تسمية الأعمدة غير متوقعة. أرسل لي قائمة الأعمدة أدناه.';else if (r.code) hint = 'الخادم رفض التحميل (رمز ' + r.code + '). جرّب فتح الرابط في المتصفح.';else hint = 'افتح الرابط للتحقق، أو جرّب تحديث هذا الصندوق وحده من زر «تحديث المكوّنات» بجانبه.';
    }
    html += `<div style="border:1px solid var(--bdr);border-radius:12px;padding:11px 12px;margin-bottom:10px">
      <div style="font-size:12.5px;font-weight:600;margin-bottom:5px">${e.name}</div>
      <div style="font-size:11px;color:var(--red);line-height:1.7">${r.err || 'سبب غير معروف'}${r.code ? ' <span style="opacity:.7">(رمز ' + r.code + ')</span>' : ''}</div>
      <div style="font-size:10.5px;color:var(--text);line-height:1.8;margin-top:7px">${hint}</div>
      ${r.columns && r.columns.length ? `<div style="margin-top:8px;font-size:9.5px;color:var(--muted);direction:ltr;text-align:left;word-break:break-all"><b>الأعمدة:</b> ${r.columns.join(' · ')}</div>` : ''}
      ${r.sampleLine ? `<div style="margin-top:6px;background:var(--surf2);border-radius:9px;padding:7px 9px;font-size:9px;direction:ltr;text-align:left;word-break:break-all">${String(r.sampleLine).replace(/</g, '&lt;')}</div>` : ''}
      ${r.preview && r.preview.length ? `<div style="margin-top:6px;background:var(--surf2);border-radius:9px;padding:7px 9px;font-size:9px;direction:ltr;text-align:left;max-height:150px;overflow:auto;line-height:1.6">${r.preview.map(l => String(l).replace(/</g, '&lt;')).join('<br>')}</div>` : ''}
      ${e.url ? `<div style="margin-top:8px"><a href="${e.url}" target="_blank" style="font-size:10.5px;color:var(--gold)"><i class="ti ti-external-link"></i> افتح الرابط للتحقق</a></div>` : ''}
    </div>`;
  });
  b.innerHTML = html;
  openModal('zkFundM');
}
function zkProbe(name) {
  const o = $('zkProbeOut');
  if (!o) return;
  const t = zkFundTop(name);
  if (!t || !t.csvUrl) {
    o.style.display = 'block';
    o.innerHTML = '<span style="color:var(--red)">لا يوجد رابط محفوظ لهذا الصندوق</span>';
    return;
  }
  if (!_cloudMode) {
    o.style.display = 'block';
    o.innerHTML = "<span style=\"color:var(--red)\">\u064A\u062A\u0637\u0644\u0628 \u0641\u062A\u062D \u0627\u0644\u0623\u062F\u0627\u0629 \u0645\u0646 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642</span>";
    return;
  }
  o.style.display = 'block';
  o.innerHTML = '⏳ جاري الفحص...';
  const want = Math.max(1, Math.min(50, pN(zkOpt.topN) || 20));
  portfolioAPI.withSuccessHandler(r => {
    if (!r) {
      o.innerHTML = '<span style="color:var(--red)">لا رد من الخادم</span>';
      return;
    }
    if (!r.ok) {
      o.innerHTML = '<span style="color:var(--red)">✗ ' + (r.err || 'فشل') + '</span>' + (r.code ? ' <span style="opacity:.7">(رمز ' + r.code + ')</span>' : '') + (r.preview ? '<div style="direction:ltr;text-align:left;margin-top:6px;max-height:120px;overflow:auto">' + r.preview.map(l => String(l).replace(/</g, '&lt;')).join('<br>') + '</div>' : '');
      return;
    }
    const got = Array.isArray(r.top) ? r.top.length : 0;
    const oldGs = r.topN === undefined;
    o.innerHTML = '<span style="color:' + (got >= Math.min(want, r.count || want) ? 'var(--green)' : '#e0a050') + '">' + (got >= Math.min(want, r.count || want) ? '✓' : '⚠') + ' الخادم أعاد ' + got + ' شركة من أصل ' + (r.count || 0) + '</span>' + (oldGs ? "\u062A\u0639\u0630\u0651\u0631 \u062C\u0644\u0628 \u0627\u0644\u0645\u0635\u062F\u0631. \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u0648\u0625\u0639\u062F\u0627\u062F\u0627\u062A\u0647\u0627." : '<br><span style="opacity:.7">النسخة تدعم العدد (حدّ ' + r.topN + ')</span>') + '<div style="margin-top:6px"><button class="btn-xs" onclick="zkApplyProbe(\'' + String(name).replace(/'/g, "\\'") + '\')">حفظ هذه النتيجة الآن</button></div>';
    window._zkProbeData = {
      name: name,
      r: r
    };
  }).withFailureHandler(e => {
    o.innerHTML = '<span style="color:var(--red)">✗ تعذّر استدعاء fetchFundCsv — النسخة المنشورة قديمة</span>';
  }).fetchFundCsv(t.csvUrl, want);
}
function zkApplyProbe(name) {
  const d = window._zkProbeData;
  if (!d || d.name !== name || !d.r || !d.r.ok) {
    showToast('لا توجد نتيجة فحص صالحة', 'error');
    return;
  }
  const r = d.r,
    cur = customXray[name] || {};
  customXray[name] = Object.assign({}, cur, {
    label: cur.label || name,
    kind: 'etf',
    desc: 'تركيبة رسمية — ' + (r.count || 0) + ' مكوّن',
    countries: r.countries || cur.countries,
    sectors: r.sectors || cur.sectors,
    top: r.top,
    _count: r.count || 0,
    _csvUrl: (zkFundTop(name) || {}).csvUrl,
    _at: new Date().toISOString()
  });
  saveCustomXray();
  zkRender();
  showToast('حُفظت ' + r.top.length + ' شركة لـ ' + name, 'success');
  closeModal('zkFundM');
}
function zkCsvFail(name, r) {
  r = r || {};
  const b = $('zkFundB');
  st('zkFundT', 'تعذّر تحديث مكوّنات ' + name);
  if (!b) {
    showToast(r.err || 'فشل', 'error');
    return;
  }
  let hint = '';
  if (r.hintOverride) hint = r.hintOverride;else if (r.kind === 'html') hint = 'افتح صفحة الصندوق على iShares ← اضغط <b>Detailed Holdings and Analytics</b> ← <b>Download</b> ← انسخ رابط الملف المباشر (ينتهي بـ fileType=csv).';else if (r.kind === 'no_header') hint = 'الملف لا يحوي صف أعمدة معروف. تأكد أنه ملف Holdings وليس ملفاً آخر (مثل Performance أو Distributions).';else if (r.kind === 'no_weight' || r.kind === 'no_name') hint = 'الملف وصل لكن تسمية الأعمدة غير متوقعة. أرسل لي قائمة الأعمدة أدناه لأضيفها.';else if (r.code) hint = 'الخادم رفض التحميل. جرّب فتح الرابط في المتصفح للتأكد أنه يعمل.';else hint = "\u062A\u0639\u0630\u0651\u0631 \u062C\u0644\u0628 \u0627\u0644\u0645\u0635\u062F\u0631. \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u0648\u0625\u0639\u062F\u0627\u062F\u0627\u062A\u0647\u0627.";
  let html = `<div class="warnbox" style="background:rgba(246,109,109,.07);border:1px solid rgba(246,109,109,.25);border-radius:12px;padding:11px 13px;font-size:11.5px;color:var(--red);line-height:1.8">
    <b>${r.err || 'فشل غير معروف'}</b>${r.code ? ' <span style="opacity:.7">(رمز ' + r.code + ')</span>' : ''}</div>
    <div style="font-size:11px;color:var(--text);line-height:1.9;margin-top:11px">${hint}</div>`;
  if (r.columns && r.columns.length) html += `<div style="margin-top:12px"><div style="font-size:11px;font-weight:600;color:var(--gold);margin-bottom:5px">الأعمدة التي وُجدت</div>
      <div style="background:var(--surf2);border-radius:10px;padding:9px 11px;font-size:10px;direction:ltr;text-align:left;line-height:1.8;word-break:break-all">${r.columns.join(' · ')}</div></div>`;
  if (r.sampleLine) html += `<div style="margin-top:12px"><div style="font-size:11px;font-weight:600;color:var(--gold);margin-bottom:5px">عيّنة من الملف</div>
      <div style="background:var(--surf2);border-radius:10px;padding:9px 11px;font-size:9.5px;direction:ltr;text-align:left;word-break:break-all">${String(r.sampleLine).replace(/</g, '&lt;')}</div></div>`;
  if (r.preview && r.preview.length) html += `<div style="margin-top:12px"><div style="font-size:11px;font-weight:600;color:var(--gold);margin-bottom:5px">أول أسطر الملف${r.totalLines ? ' (من ' + r.totalLines + ' سطر)' : ''}</div>
      <div style="background:var(--surf2);border-radius:10px;padding:9px 11px;font-size:9px;direction:ltr;text-align:left;max-height:200px;overflow:auto;line-height:1.7">${r.preview.map(l => String(l).replace(/</g, '&lt;')).join('<br>')}</div></div>`;
  const h2 = zkFundTop(name);
  if (h2 && h2.csvUrl) html += `<div style="margin-top:12px"><div style="font-size:11px;font-weight:600;color:var(--gold);margin-bottom:5px">الرابط المحفوظ</div>
      <div style="background:var(--surf2);border-radius:10px;padding:9px 11px;font-size:9.5px;direction:ltr;text-align:left;word-break:break-all">${h2.csvUrl}</div>
      <a href="${h2.csvUrl}" target="_blank" style="font-size:11px;color:var(--gold);display:inline-block;margin-top:7px"><i class="ti ti-external-link"></i> افتح الرابط للتحقق</a></div>`;
  html += `<div style="font-size:10px;color:var(--muted);margin-top:14px;line-height:1.8">
    مكوّنات الصندوق الحالية ما زالت محفوظة ولم تتأثر — الحساب مستمر بها.</div>`;
  b.innerHTML = html;
  openModal('zkFundM');
}
function zkOpenFund(name) {
  const f = zkFundRatio(name),
    h = zkFundTop(name),
    b = $('zkFundB');
  st('zkFundT', name);
  if (!b) return;
  if (!f) {
    b.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:10px 0">تركيبة غير معرّفة — عرّفها من صفحة الخريطة الاستثمارية.</div>';
    openModal('zkFundM');
    return;
  }
  const kv = (l, v, col) => `<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--wline);font-size:11.5px"><span style="color:var(--muted)">${l}</span><span style="font-weight:600;direction:ltr;color:${col || 'var(--text)'}">${v}</span></div>`;
  const cxr = customXray[name] || {};
  const srcNote = cxr.top ? 'سجل مخصص · ' + cxr.top.length + ' شركة' : 'القيم الافتراضية المثبتة (لم يُحدَّث بعد)';
  b.innerHTML = `<div style="background:${cxr.top ? 'var(--surf2)' : 'rgba(224,160,80,.09)'};border:1px solid ${cxr.top ? 'var(--bdr)' : 'rgba(224,160,80,.3)'};border-radius:11px;padding:9px 11px;margin-bottom:11px;font-size:10.5px;line-height:1.8">
    <b>مصدر التركيبة الحالية:</b> ${srcNote}
    ${!cxr.top ? '<br><span style="color:#e0a050">لم يُقرأ ملف المكوّنات بنجاح بعد — الأرقام من قائمة مثبّتة في الأداة.</span>' : ''}
    <div style="margin-top:7px"><button class="btn-xs" onclick="zkProbe('${String(name).replace(/'/g, "\\'")}')"><i class="ti ti-stethoscope"></i> فحص الرابط الآن</button></div>
    <div id="zkProbeOut" style="display:none;margin-top:8px;padding:8px 10px;border-radius:9px;background:var(--surf);font-size:9.5px;line-height:1.7"></div>
  </div>` + kv('رابط المكوّنات', h.csvUrl ? '<a href="' + h.csvUrl + '" target="_blank" style="color:var(--gold)">محفوظ ✓</a>' : 'غير محفوظ') + kv('آخر تحديث', ((customXray[name] || {})._at || '').slice(0, 10) || '—') + kv('عدد المكوّنات', h.count || h.top.length) + kv('وزن أكبر الشركات', fmt(f.sumW, 2) + '%') + kv('وزن الباقي', fmt(f.rest, 2) + '% (يُحتسب 100%)') + kv('شركات محدّثة', f.known + ' من ' + f.top.length) + kv('نسبة الصندوق', zkP(f.fin), 'var(--gold)') + kv('التخفيض مقابل 100%', fmt(f.cut * 100, 2) + ' نقطة', 'var(--green)') + `<div style="font-size:11.5px;font-weight:600;margin:14px 0 6px">أكبر الشركات ومساهماتها</div>` + f.top.map(x => {
    const r = zkCoRatio(x.ticker),
      rr = r ? r.fin : 1;
    return `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--wline)">
        <div style="flex:1;min-width:0"><div style="font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${x.name}</div>
        <div style="font-size:9px;color:var(--muted);direction:ltr;text-align:right">${x.ticker}</div></div>
        <div style="font-size:10.5px;color:var(--muted);direction:ltr;min-width:46px;text-align:left">${fmt(x.w, 2)}%</div>
        <div style="font-size:10.5px;direction:ltr;min-width:52px;text-align:left;color:${r ? 'var(--gold)' : '#e0a050'}">${zkP(rr)}</div>
        <div style="font-size:10.5px;direction:ltr;min-width:52px;text-align:left">${fmt(x.w * rr, 2)}%</div></div>`;
  }).join('') + `<div style="font-size:9.5px;color:var(--muted);margin-top:8px;line-height:1.7">الأعمدة: الوزن · النسبة · المساهمة. الشركات بلا بيانات بـ100% احتياطاً.</div>`;
  openModal('zkFundM');
}
function zkReport() {
  const z = zkCalc(),
    rows = z.rows;
  const funds = rows.filter(r => r.kind === 'fund');
  const stocks = rows.filter(r => r.kind === 'stock');
  const direct = rows.filter(r => r.kind === 'direct');
  const S = a => a.reduce((s, r) => s + r.val, 0);
  const Z = a => a.reduce((s, r) => s + r.zVal, 0);
  const rv = zkReview();
  const fb = rows.filter(r => r.warn);
  const m = n => Number(n).toLocaleString('en-US');
  const src = zkOpt.apiKey ? 'Financial Modeling Prep' : 'Yahoo Finance';
  const hw = zkHawl();
  const dirByType = {};
  direct.forEach(r => {
    (dirByType[r.type] = dirByType[r.type] || []).push(r);
  });
  const th = (t, w) => `<th style="width:${w || 'auto'}">${t}</th>`;
  const td = (v, a) => `<td${a ? ' class="' + a + '"' : ''}>${v}</td>`;
  let dirRows = '';
  ZK_ORD.forEach(tp => {
    const it = dirByType[tp];
    if (!it || !it.length) return;
    dirRows += `<tr class="grp"><td colspan="4">${ZK_TYPE[tp] || tp}</td></tr>`;
    it.forEach(r => {
      dirRows += `<tr>${td(r.name)}${td(fmtC(r.val), 'n')}${td(zkP(r.ratio), 'n')}${td(fmtC(r.zVal), 'n')}</tr>`;
    });
    dirRows += `<tr class="sub">${td('مجموع ' + (ZK_TYPE[tp] || tp))}${td(fmtC(S(it)), 'n')}${td('', 'n')}${td(fmtC(Z(it)), 'n')}</tr>`;
  });
  const stkRows = stocks.map(r => {
    const tk = zkTickerOf(r.name),
      co = zkDb[tk] || {};
    const st = zkStOf(tk),
      lbl = (ZK_ST[st] || {}).ar || '';
    return `<tr>
      ${td('<b>' + r.name + '</b><div class="sm">' + (co.symbol || tk) + '</div>')}
      ${td(fmtC(r.val), 'n')}
      ${td(co.orig != null ? zkP(co.orig) : '—', 'n')}
      ${td(zkP(r.ratio) + (co.manual != null ? '<div class="sm">يدوي</div>' : ''), 'n')}
      ${td(fmtC(r.zVal), 'n')}
      ${td('<div class="sm">' + (co.sourceName || '—') + '</div><div class="sm">' + (co.reportDate ? 'تقرير ' + co.reportDate : '—') + '</div><div class="sm">' + lbl + '</div>')}
    </tr>`;
  }).join('');
  const fndRows = funds.map(r => {
    const f = r.fund,
      cx = customXray[r.name] || {};
    return `<tr>
      ${td('<b>' + r.name + '</b>')}
      ${td(fmtC(r.val), 'n')}
      ${td(f ? fmt(f.sumW, 1) + '%' : '—', 'n')}
      ${td(f ? fmt(f.rest, 1) + '%' : '—', 'n')}
      ${td(zkP(r.ratio), 'n')}
      ${td(fmtC(r.zVal), 'n')}
      ${td('<div class="sm">' + (f ? f.known + '/' + f.top.length + ' محدّثة' : '—') + '</div><div class="sm">' + (cx._at ? 'مكوّنات ' + cx._at.slice(0, 10) : '—') + '</div>')}
    </tr>`;
  }).join('');
  const fndDetail = funds.map(r => {
    const f = r.fund;
    if (!f) return '';
    const rowsH = f.top.map(x => {
      const c = zkCoRatio(x.ticker),
        rr = c ? c.fin : 1;
      const co = c ? c.co : null;
      return `<tr>${td(x.name + '<div class="sm">' + x.ticker + '</div>')}${td(fmt(x.w, 2) + '%', 'n')}
        ${td(zkP(rr) + (c ? '' : '<div class="sm warn">احتياطي</div>'), 'n')}
        ${td(fmt(x.w * rr, 2) + '%', 'n')}
        ${td('<div class="sm">' + (co && co.reportDate ? co.reportDate : '—') + '</div>')}</tr>`;
    }).join('');
    return `<div class="blk">
      <h3>${r.name} — مكوّنات الصندوق</h3>
      <div class="m">رابط المكوّنات: ${f.csvUrl ? '<span class="url">' + f.csvUrl + '</span>' : 'غير محفوظ'}</div>
      <table><thead><tr>${th('الشركة')}${th('الوزن', '12%')}${th('نسبتها', '12%')}${th('المساهمة', '12%')}${th('تاريخ التقرير', '18%')}</tr></thead>
      <tbody>${rowsH}
      <tr class="sub">${td('باقي الصندوق (يُحتسب 100%)')}${td(fmt(f.rest, 2) + '%', 'n')}${td('100.0%', 'n')}${td(fmt(f.rest, 2) + '%', 'n')}${td('')}</tr>
      <tr class="tot">${td('نسبة الصندوق النهائية')}${td('', 'n')}${td('', 'n')}${td(zkP(f.fin), 'n')}${td('')}</tr>
      </tbody></table></div>`;
  }).join('');
  const coIndex = {};
  stocks.forEach(r => {
    const tk = zkTickerOf(r.name);
    if (!coIndex[tk]) coIndex[tk] = {
      tk,
      label: r.name,
      via: [],
      direct: true,
      val: r.val
    };
    coIndex[tk].direct = true;
  });
  funds.forEach(r => {
    const f = r.fund;
    if (!f) return;
    f.top.forEach(x => {
      if (!x.ticker) return;
      if (!coIndex[x.ticker]) coIndex[x.ticker] = {
        tk: x.ticker,
        label: x.name,
        via: [],
        direct: false
      };
      coIndex[x.ticker].via.push({
        fund: r.name,
        w: x.w
      });
    });
  });
  const coList = Object.values(coIndex).sort((a, b) => {
    if (a.direct !== b.direct) return a.direct ? -1 : 1;
    const aw = a.via.reduce((s, v) => s + v.w, 0),
      bw = b.via.reduce((s, v) => s + v.w, 0);
    return bw - aw;
  });
  const coSheets = coList.map(e => {
    const tk = e.tk,
      co = zkDb[tk];
    const origin = [];
    if (e.direct) origin.push('سهم مباشر');
    e.via.forEach(v => origin.push(v.fund + ' (' + fmt(v.w, 2) + '%)'));
    const originH = '<div class="sm">يظهر عبر: ' + origin.join(' · ') + '</div>';
    if (!co || !co.items) {
      return `<div class="blk">
        <h3>${e.label} <span class="sm">(${tk})</span></h3>${originH}
        <div class="warnbox">لا توجد قوائم مالية لهذه الشركة — احتُسبت بنسبة <b>100%</b> احتياطاً، وهو الخيار الأكثر تحفظاً.${co && co.lastErr ? '<br>السبب: ' + co.lastErr : ''}</div>
      </div>`;
    }
    const c = zkCalcRatio(co);
    if (!c) return '';
    const cur = co.reportingCurrency && co.reportingCurrency !== '—' ? ' ' + co.reportingCurrency : '';
    const items = c.items.map(i2 => `<tr>
      ${td(i2.ar + '<div class="sm">' + (i2.tag ? i2.tag.tag : '') + '</div>')}
      ${td(m(i2.val), 'n')}
      ${td(i2.f === 1 ? 'زكوي' : i2.f === 0 ? 'مستبعد' : 'جزئي ' + fmt(i2.f * 100, 0) + '%', 'n')}
      ${td(i2.f > 0 ? m(i2.val * i2.f) : '—', 'n')}</tr>`).join('');
    let contribH = '';
    if (e.via.length) {
      const eff = co.manual != null ? co.manual : c.fin;
      contribH = `<table class="kv"><tbody>` + e.via.map(v => {
        const fr2 = funds.find(x => x.name === v.fund);
        const share = fr2 ? fr2.val * v.w / 100 : 0;
        return `<tr>${td('داخل ' + v.fund)}${td('وزن ' + fmt(v.w, 2) + '% ← ' + fmtC(share) + ' × ' + zkP(eff) + ' = <b>' + fmtC(share * eff) + '</b>')}</tr>`;
      }).join('') + `</tbody></table>`;
    }
    return `<div class="blk">
      <h3>${co.companyName || e.label} <span class="sm">(${co.symbol || tk})</span></h3>${originH}
      <table class="kv"><tbody>
        <tr>${td('المصدر')}${td(co.sourceName || '—')}</tr>
        <tr>${td('نوع التقرير')}${td((co.reportType === 'annual' ? 'سنوي' : 'فصلي') + ' · ' + (co.reportDate || '—'))}</tr>
        <tr>${td('تاريخ الجلب')}${td((co.fetchedAt || '').slice(0, 10))}</tr>
        <tr>${td('رابط المصدر')}${td('<span class="url">' + (co.sourceUrl || '—') + '</span>')}</tr>
      </tbody></table>
      <table><thead><tr>${th('البند')}${th('القيمة' + cur, '22%')}${th('التصنيف', '16%')}${th('الداخل بالحساب', '22%')}</tr></thead>
      <tbody>${items}
      <tr class="sub">${td('مجموع الأصول الزكوية')}${td('', 'n')}${td('', 'n')}${td(m(c.zakatable), 'n')}</tr>
      <tr>${td('إجمالي أصول الشركة')}${td('', 'n')}${td('', 'n')}${td(m(c.total), 'n')}</tr>
      </tbody></table>
      <div class="calc">${m(c.zakatable)} ÷ ${m(c.total)} = <b>${zkP(c.orig)}</b> &nbsp;×&nbsp; ${(1 + (pN(zkOpt.margin) || 0) / 100).toFixed(2)} (احتياط) = <b>${zkP(c.fin)}</b>${co.manual != null ? ' &nbsp;→&nbsp; يدوي <b>' + zkP(co.manual) + '</b>' : ''}</div>
      ${contribH}
    </div>`;
  }).join('');
  const coDone = coList.filter(e => zkDb[e.tk] && zkDb[e.tk].items).length;
  const w = window.open('', '_blank');
  if (!w) {
    showToast('اسمح بالنوافذ المنبثقة', 'error');
    return;
  }
  w.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><title>تقرير الزكاة</title>
<style>
@page{size:A4;margin:16mm 14mm}
*{box-sizing:border-box}
body{font-family:system-ui,'IBM Plex Sans Arabic',sans-serif;color:#1a1a1a;margin:0;font-size:12px;line-height:1.6}
.page{page-break-after:always}
.page:last-child{page-break-after:auto}
h1{font-size:22px;margin:0 0 4px;color:#111}
h2{font-size:15px;margin:0 0 12px;padding-bottom:6px;border-bottom:2px solid #c9a84c;color:#111}
h3{font-size:13px;margin:0 0 6px;color:#111}
.head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #c9a84c;padding-bottom:10px;margin-bottom:18px}
.m{color:#666;font-size:11px}
.sm{color:#777;font-size:9.5px;font-weight:400}
.url{font-size:9px;color:#666;word-break:break-all;direction:ltr;display:inline-block}
.hero{display:flex;gap:14px;margin:14px 0 20px}
.card{flex:1;border:1px solid #e2ddd0;border-radius:9px;padding:12px;background:#fdfcf8}
.card .l{font-size:10px;color:#777;margin-bottom:3px}
.card .v{font-size:17px;font-weight:700;color:#8a6a1c;direction:ltr}
.big{font-size:27px;font-weight:700;color:#8a6a1c;direction:ltr}
table{width:100%;border-collapse:collapse;font-size:11px;margin:8px 0 14px}
th{background:#f4f1ea;text-align:right;padding:7px 9px;font-size:10px;font-weight:600;border-bottom:1.5px solid #d8d0bd}
td{padding:6px 9px;border-bottom:1px solid #ece8dd;vertical-align:top}
td.n{text-align:left;direction:ltr;white-space:nowrap}
tr.grp td{background:#f8f6f0;font-weight:700;font-size:10.5px;color:#6b5518;padding:5px 9px}
tr.sub td{background:#fbfaf6;font-weight:600;border-top:1px solid #ded7c6}
tr.tot td{background:#f4f1ea;font-weight:700;color:#6b5518}
.blk{margin-bottom:20px;page-break-inside:avoid}
.calc{background:#f8f6f0;border:1px solid #e2ddd0;border-radius:8px;padding:9px 12px;font-size:11px;direction:ltr;text-align:center;margin-top:4px}
.warnbox{background:#fff8e6;border:1px solid #e8d9a8;padding:9px 12px;border-radius:8px;font-size:11px;line-height:1.9}
.warn{color:#a8752a}
table.kv{margin:4px 0 10px}
table.kv td:first-child{color:#777;width:120px;font-size:10.5px}
table.kv td{border-bottom:1px solid #f0ece2;padding:4px 0}
ul{margin:6px 0;padding-right:18px}li{margin:3px 0}
.foot{margin-top:22px;padding-top:10px;border-top:1px solid #ddd;font-size:9.5px;color:#888;text-align:center}
</style></head><body>

<!-- ═══ صفحة 1: الملخص ═══ -->
<div class="page">
  <div class="head">
    <div><h1>تقرير الزكاة</h1>
      <div class="m">${new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}</div></div>
    <div class="m" style="text-align:left">
      العملة: ${baseCur}<br>مصدر القوائم: ${src}<br>
      نسبة الزكاة: ${fmt(z.rate * 100, 3)}% · احتياط: ${pN(zkOpt.margin) || 10}%
    </div>
  </div>

  <div class="hero">
    <div class="card"><div class="l">إجمالي المحفظة</div><div class="v">${fmtC(S(rows))}</div></div>
    <div class="card"><div class="l">الوعاء الزكوي</div><div class="v">${fmtC(z.pool)}</div></div>
    <div class="card"><div class="l">الزكاة الواجبة</div><div class="v">${fmtC(z.due)}</div></div>
  </div>

  <h2>الخلاصة</h2>
  <table><tbody>
    <tr class="grp"><td colspan="4">توزيع المحفظة</td></tr>
    <tr><td>الأصول المباشرة</td><td class="n">${fmtC(S(direct))}</td><td class="n">${S(direct) > 0 ? fmt(Z(direct) / S(direct) * 100, 1) + '%' : '—'}</td><td class="n">${fmtC(Z(direct))}</td></tr>
    <tr><td>الأسهم المباشرة</td><td class="n">${fmtC(S(stocks))}</td><td class="n">${S(stocks) > 0 ? fmt(Z(stocks) / S(stocks) * 100, 1) + '%' : '—'}</td><td class="n">${fmtC(Z(stocks))}</td></tr>
    <tr><td>الصناديق</td><td class="n">${fmtC(S(funds))}</td><td class="n">${S(funds) > 0 ? fmt(Z(funds) / S(funds) * 100, 1) + '%' : '—'}</td><td class="n">${fmtC(Z(funds))}</td></tr>
    <tr class="sub"><td>الإجمالي</td><td class="n">${fmtC(S(rows))}</td><td class="n">${S(rows) > 0 ? fmt(z.pool / S(rows) * 100, 1) + '%' : '—'}</td><td class="n">${fmtC(z.pool)}</td></tr>
  </tbody></table>

  <h2>احتساب الزكاة</h2>
  <table><tbody>
    <tr><td>إجمالي الوعاء الزكوي</td><td class="n">${fmtC(z.pool)}</td></tr>
    <tr><td>− الخصوم</td><td class="n">${fmtC(z.debts)}</td></tr>
    <tr class="sub"><td>الصافي الخاضع</td><td class="n">${fmtC(z.net)}</td></tr>
    <tr><td>النصاب (${zkOpt.nisabBase === 'silver' ? 'فضة 595غ' : 'ذهب 85غ'})</td><td class="n">${fmtC(z.nisab)}</td></tr>
    <tr><td>بلوغ النصاب</td><td class="n">${z.reached ? 'نعم' : 'لا'}</td></tr>
    <tr class="tot"><td>الزكاة الواجبة (${fmt(z.rate * 100, 3)}%)</td><td class="n">${fmtC(z.due)}</td></tr>
  </tbody></table>
  ${hw ? `<div class="m">الحول: بدأ ${zkOpt.hawlStart} · ${hw.remaining <= 0 ? 'تم الحول — استحقّت ' + hw.dueStr : 'يتبقى ' + hw.remaining + ' يوم — يستحق ' + hw.dueStr}</div>` : ''}

  ${fb.length ? `<h2>أصول احتُسبت بنسبة 100% احتياطاً</h2>
  <div class="warnbox">تعذّر الحصول على قوائمها المالية، فاحتُسبت بالكامل — وهو الخيار الأكثر تحفظاً:<ul>${fb.map(r => '<li>' + r.name + ' — ' + fmtC(r.val) + '</li>').join('')}</ul></div>` : ''}
  ${rv.length ? `<h2>ملاحظات المراجعة</h2><div class="warnbox"><ul>${rv.map(x => '<li><b>' + x.t + '</b> — ' + x.d + '</li>').join('')}</ul></div>` : ''}
</div>

<!-- ═══ صفحة 2: الأصول المباشرة والأسهم ═══ -->
<div class="page">
  <h2>الأصول المباشرة</h2>
  <table><thead><tr>${th('الأصل')}${th('القيمة', '20%')}${th('النسبة', '14%')}${th('الوعاء', '20%')}</tr></thead>
  <tbody>${dirRows || '<tr><td colspan="4">لا توجد</td></tr>'}</tbody></table>

  ${stocks.length ? `<h2>الأسهم المباشرة</h2>
  <table><thead><tr>${th('السهم')}${th('القيمة', '15%')}${th('قبل الاحتياط', '13%')}${th('النسبة', '12%')}${th('الوعاء', '15%')}${th('المصدر', '20%')}</tr></thead>
  <tbody>${stkRows}<tr class="sub">${td('الإجمالي')}${td(fmtC(S(stocks)), 'n')}${td('', 'n')}${td('', 'n')}${td(fmtC(Z(stocks)), 'n')}${td('')}</tr></tbody></table>` : ''}
</div>

${funds.length ? `<!-- ═══ صفحة 3: الصناديق ═══ -->
<div class="page">
  <h2>الصناديق</h2>
  <table><thead><tr>${th('الصندوق')}${th('القيمة', '14%')}${th('أكبر الشركات', '12%')}${th('الباقي', '10%')}${th('النسبة', '11%')}${th('الوعاء', '14%')}${th('الحالة', '16%')}</tr></thead>
  <tbody>${fndRows}<tr class="sub">${td('الإجمالي')}${td(fmtC(S(funds)), 'n')}${td('', 'n')}${td('', 'n')}${td('', 'n')}${td(fmtC(Z(funds)), 'n')}${td('')}</tr></tbody></table>
  ${fndDetail}
</div>` : ''}

${coSheets ? `<!-- ═══ أوراق عمل الشركات ═══ -->
<div class="page">
  <h2>أوراق عمل الشركات</h2>
  <div class="m" style="margin-bottom:14px">
    تفصيل البنود المستخدمة في حساب نسبة كل شركة — للمراجعة والتحقق من المصدر.<br>
    يشمل الأسهم المباشرة وكل مكوّنات الصناديق.
    <b>${coDone} من ${coList.length}</b> شركة لديها قوائم مالية${coList.length > coDone ? ` · ${coList.length - coDone} احتُسبت 100% احتياطاً` : ''}.
  </div>
  ${coSheets}
</div>` : ''}

<!-- ═══ صفحة المنهجية ═══ -->
<div class="page">
  <h2>المنهجية</h2>
  <h3>المبدأ</h3>
  <p>لا تُضرب قيمة المحفظة كاملة في نسبة الزكاة. تُحسب لكل شركة نسبة زكوية من قوائمها المالية المنشورة، ثم تُطبَّق على قيمة الاستثمار فيها. الحساب مخصص أساساً للمستثمر طويل الأجل.</p>

  <h3>معادلة الشركة</h3>
  <div class="calc">النسبة الأصلية = الأصول الزكوية ÷ إجمالي أصول الشركة</div>
  <p><b>تدخل:</b> النقد وما في حكمه · الاستثمارات قصيرة الأجل · الأوراق المالية المتداولة · الذمم المدينة · أوراق القبض · المخزون.<br>
  <b>لا تدخل:</b> الممتلكات والمعدات · الأصول غير الملموسة · الشهرة · الاستثمارات الاستراتيجية.<br>
  <b>مستبعدة لمنع الازدواج:</b> البنود الإجمالية مثل «مجموع الأصول المتداولة».</p>

  <h3>القيمة السوقية</h3>
  <p>لا تُستخدم كمقام في نسبة الشركة — تُستخدم فقط لتحديد قيمة استثمارك.</p>

  <h3>الالتزامات</h3>
  <p>لا تُخصم التزامات الشركة في هذه النسخة. اختيار محافظ يعطي زكاة أعلى من المناهج التي تخصمها.</p>

  <h3>هامش الاحتياط</h3>
  <div class="calc">النسبة النهائية = النسبة الأصلية × ${(1 + (pN(zkOpt.margin) || 0) / 100).toFixed(2)}</div>
  <p>زيادة نسبية لا نقاط مئوية — 40% تصبح 44%. بحد أقصى 100%.</p>

  <h3>الصناديق</h3>
  <div class="calc">نسبة الصندوق = Σ(وزن الشركة × نسبتها) + وزن الباقي × 100%</div>
  <p>باقي الصندوق بعد أكبر الشركات يُحتسب بنسبة 100%. النقد والمشتقات داخل الصندوق تبقى ضمن الباقي.</p>

  <h3>تعذّر البيانات</h3>
  <p>الشركة التي يتعذّر جلب قوائمها تُحتسب مؤقتاً بنسبة 100% — الخيار الأكثر تحفظاً — مع إدراجها في قائمة المراجعة.</p>

  <h3>مصدر البيانات</h3>
  <p>القوائم المالية من <b>${src}</b>. ${zkOpt.apiKey ? 'مزوّد بيانات موثّق يوفر رابط الإيداع الأصلي.' : 'بيانات من مزوّد وسيط وليست من التقرير الرسمي مباشرة — يُنصح بمراجعة الأرقام مع تقرير الشركة المنشور.'}</p>

  <div class="warnbox" style="margin-top:18px">
    <b>تنبيه</b><br>
    هذا الحساب تقديري ومبني على منهجية اجتهادية، وليس فتوى شرعية. في تفاصيل زكاة الأسهم اختلافات فقهية معتبرة. راجع المنهجية والنتيجة مع جهة شرعية موثوقة قبل الاعتماد النهائي.
  </div>

  <div class="foot">O.db — تقرير الزكاة · ${new Date().toLocaleDateString('ar-EG')}</div>
</div>

<script>setTimeout(function(){window.print()},500)<\/script>
</body></html>`);
  w.document.close();
}
const XRAY_ASOF = '2026';
const xrayInc = {
  cash: false,
  gold: false,
  prop: false
};
const GEO_AR = {
  UN: 'غير محدد',
  EZ: 'منطقة اليورو',
  US: 'الولايات المتحدة',
  JP: 'اليابان',
  GB: 'بريطانيا',
  CA: 'كندا',
  CH: 'سويسرا',
  FR: 'فرنسا',
  NL: 'هولندا',
  DE: 'ألمانيا',
  AU: 'أستراليا',
  DK: 'الدنمارك',
  SE: 'السويد',
  IE: 'أيرلندا',
  KR: 'كوريا الجنوبية',
  TW: 'تايوان',
  IN: 'الهند',
  CN: 'الصين',
  SA: 'السعودية',
  BR: 'البرازيل',
  ZA: 'جنوب أفريقيا',
  AE: 'الإمارات',
  TH: 'تايلاند',
  MY: 'ماليزيا',
  ID: 'إندونيسيا',
  MX: 'المكسيك',
  QA: 'قطر',
  KW: 'الكويت',
  JO: 'الأردن',
  HK: 'هونغ كونغ',
  SG: 'سنغافورة',
  ES: 'إسبانيا',
  IT: 'إيطاليا',
  FI: 'فنلندا',
  NO: 'النرويج'
};
const XRAY_DEV = {
  US: 1,
  JP: 1,
  GB: 1,
  CA: 1,
  CH: 1,
  FR: 1,
  NL: 1,
  DE: 1,
  AU: 1,
  DK: 1,
  SE: 1,
  IE: 1,
  SG: 1,
  HK: 1,
  ES: 1,
  IT: 1,
  FI: 1,
  NO: 1
};
function geoFlag(cc) {
  if (!cc || cc === 'UN') return '🌐';
  if (cc === 'EZ') return '🇪🇺';
  try {
    return String.fromCodePoint(...[...cc].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
  } catch (e) {
    return '🌐';
  }
}
const YH_GEO = {
  HK: 'CN',
  SS: 'CN',
  SZ: 'CN',
  L: 'GB',
  DE: 'DE',
  F: 'DE',
  PA: 'FR',
  AS: 'NL',
  MI: 'IT',
  MC: 'ES',
  SW: 'CH',
  VX: 'CH',
  T: 'JP',
  KS: 'KR',
  KQ: 'KR',
  TW: 'TW',
  TWO: 'TW',
  NS: 'IN',
  BO: 'IN',
  AX: 'AU',
  TO: 'CA',
  SR: 'SA',
  QA: 'QA',
  KW: 'KW',
  AE: 'AE',
  DU: 'AE',
  AM: 'JO',
  JK: 'ID',
  BK: 'TH',
  KL: 'MY',
  MX: 'MX',
  SA: 'BR',
  IS: 'TR'
};
const SECTOR_AR = {
  'Technology': 'تكنولوجيا',
  'Communication Services': 'اتصالات',
  'Consumer Cyclical': 'سلع كمالية',
  'Consumer Defensive': 'سلع أساسية',
  'Financial Services': 'مالية',
  'Financial': 'مالية',
  'Healthcare': 'رعاية صحية',
  'Energy': 'طاقة',
  'Industrials': 'صناعة',
  'Basic Materials': 'مواد وتعدين',
  'Utilities': 'مرافق',
  'Real Estate': 'عقارات'
};
function arSector(s) {
  if (!s) return null;
  const t = String(s).trim();
  return SECTOR_AR[t] || t;
}
function geoFromYahoo(sym) {
  if (!sym) return null;
  const s = String(sym).toUpperCase().trim();
  if (!s.includes('.')) return 'US';
  return YH_GEO[s.split('.').pop()] || null;
}
function geoName(cc) {
  return GEO_AR[cc] || cc;
}
const XRAY_DATA = {
  ISWD: {
    kind: 'etf',
    label: 'iShares MSCI World Islamic',
    desc: 'أسواق العالم المتقدمة — متوافق مع الشريعة · ~391 شركة',
    countries: {
      US: 66,
      JP: 6.5,
      GB: 4.5,
      CA: 4.5,
      CH: 4,
      FR: 3.5,
      NL: 2.5,
      DE: 2.5,
      AU: 2,
      DK: 1,
      SE: 1,
      IE: 0.5
    },
    sectors: {
      'تكنولوجيا': 28,
      'رعاية صحية': 16,
      'صناعة': 12,
      'طاقة': 9,
      'سلع كمالية': 8,
      'سلع أساسية': 8,
      'مواد': 7,
      'اتصالات': 4,
      'أخرى': 8
    },
    top: [['MSFT', 'مايكروسوفت', 'US', 12.0], ['TSLA', 'تسلا', 'US', 4.9], ['XOM', 'إكسون موبيل', 'US', 2.8], ['JNJ', 'جونسون آند جونسون', 'US', 2.6], ['ASML', 'ASML', 'NL', 2.45], ['MU', 'مايكرون', 'US', 2.0], ['PG', 'بروكتر آند غامبل', 'US', 1.7], ['CVX', 'شيفرون', 'US', 1.55], ['AMD', 'AMD', 'US', 1.4], ['NVS', 'نوفارتس', 'CH', 1.4]]
  },
  ISDU: {
    kind: 'etf',
    label: 'iShares MSCI USA Islamic',
    desc: 'السوق الأمريكي — متوافق مع الشريعة · ~110 شركة',
    countries: {
      US: 100
    },
    sectors: {
      'تكنولوجيا': 34,
      'رعاية صحية': 17,
      'طاقة': 10,
      'سلع كمالية': 9,
      'صناعة': 9,
      'سلع أساسية': 8,
      'مواد': 5,
      'اتصالات': 4,
      'أخرى': 4
    },
    top: [['MSFT', 'مايكروسوفت', 'US', 16.5], ['TSLA', 'تسلا', 'US', 6.6], ['XOM', 'إكسون موبيل', 'US', 3.8], ['JNJ', 'جونسون آند جونسون', 'US', 3.5], ['MU', 'مايكرون', 'US', 2.7], ['PG', 'بروكتر آند غامبل', 'US', 2.3], ['CVX', 'شيفرون', 'US', 2.1], ['AMD', 'AMD', 'US', 1.9], ['MRK', 'ميرك', 'US', 1.8], ['ABT', 'مختبرات أبوت', 'US', 1.7]]
  },
  ISDE: {
    kind: 'etf',
    label: 'iShares MSCI EM Islamic',
    desc: 'الأسواق الناشئة — متوافق مع الشريعة · ~455 شركة',
    countries: {
      KR: 21,
      IN: 16,
      CN: 15,
      TW: 13,
      SA: 6,
      BR: 4,
      ZA: 3,
      AE: 2.5,
      TH: 2,
      MY: 2,
      ID: 2,
      MX: 2,
      QA: 1.5,
      KW: 1.5
    },
    sectors: {
      'تكنولوجيا إلكترونية': 40,
      'تعدين ومعادن': 11,
      'طاقة': 9,
      'تصنيع': 7,
      'مالية': 6,
      'رعاية صحية': 5,
      'سلع معمرة': 4,
      'أخرى': 18
    },
    top: [['SMSN', 'سامسونج للإلكترونيات', 'KR', 12.0], ['HYNX', 'SK هاينكس', 'KR', 7.5], ['RELI', 'ريلاينس إندستريز', 'IN', 3.2], ['HONH', 'هون هاي (فوكسكون)', 'TW', 2.8], ['XIAO', 'شاومي', 'CN', 2.65], ['INFY', 'إنفوسيس', 'IN', 1.8], ['RJHI', 'مصرف الراجحي', 'SA', 1.5], ['VALE', 'فالي', 'BR', 1.4], ['CEO', 'CNOOC', 'CN', 1.3], ['ARMC', 'أرامكو السعودية', 'SA', 1.2]]
  },
  BYD: {
    kind: 'stock',
    label: 'BYD Company',
    desc: 'سهم مباشر — السيارات الكهربائية والبطاريات · مدرج في هونغ كونغ',
    countries: {
      CN: 100
    },
    sectors: {
      'سيارات كهربائية وبطاريات': 100
    },
    top: [['BYD', 'BYD', 'CN', 100]]
  }
};
let customXray = {};
function saveCustomXray() {
  const v = JSON.stringify(customXray);
  portfolioAPI.saveSetting('customXray', v);
  localStorage.setItem('pf_custom_xray', v);
}
function xrayLookup(name, id) {
  return customXray[name] || customXray[id || ''] || XRAY_DATA[name] || XRAY_DATA[id || ''] || null;
}
function computeXray(extra) {
  const X = {
    total: 0,
    mapped: 0,
    countries: {},
    sectors: {},
    companies: {},
    funds: [],
    globalVal: 0,
    unknownVal: 0,
    dev: 0,
    em: 0,
    coCount: 0
  };
  const addC = (cc, v) => {
    X.countries[cc] = (X.countries[cc] || 0) + v;
    X.mapped += v;
    if (XRAY_DEV[cc]) X.dev += v;else X.em += v;
  };
  const addS = (s, v) => {
    X.sectors[s] = (X.sectors[s] || 0) + v;
  };
  buildGroups().forEach(g => {
    if (isExited(g)) return;
    const v = groupCurrentValue(g).cur;
    if (v <= 0) return;
    if (g.assetType === 'Gold') {
      if (!xrayInc.gold) return;
      X.total += v;
      X.globalVal += v;
      addS('ذهب — سلعة عالمية', v);
      return;
    }
    if (g.assetType === 'Property') {
      if (!xrayInc.prop) return;
      X.total += v;
      addC('JO', v);
      addS('عقار', v);
      return;
    }
    if (g.assetType === 'Cash') {
      if (!xrayInc.cash) return;
      X.total += v;
      const a = findAsset(g.assetName);
      const cc = {
        SAR: 'SA',
        JOD: 'JO',
        USD: 'US'
      }[a && a.currency];
      if (cc) addC(cc, v);else X.unknownVal += v;
      addS('سيولة نقدية', v);
      return;
    }
    X.total += v;
    const ast = findAsset(g.assetName);
    const d = xrayLookup(g.assetName, ast && ast.id);
    if (!d) {
      const cc = geoFromYahoo(ast && ast.yahooSym);
      if (cc) addC(cc, v);else X.unknownVal += v;
      const sec = arSector(ast && ast.sector) || 'أسهم مباشرة أخرى';
      addS(sec, v);
      const key = 'DIRECT_' + g.assetName;
      if (!X.companies[key]) X.companies[key] = {
        key,
        ar: g.assetName,
        cc: cc || 'UN',
        val: 0,
        via: []
      };
      X.companies[key].val += v;
      X.companies[key].via.push('سهم مباشر');
      X.coCount += 1;
      X.funds.push({
        id: g.assetName,
        val: v,
        direct: true,
        data: {
          kind: 'stock',
          label: g.assetName,
          desc: 'سهم مباشر — ' + (cc ? geoName(cc) : 'الدولة غير محددة') + ' · ' + sec,
          countries: cc ? {
            [cc]: 100
          } : {
            UN: 100
          },
          sectors: {
            [sec]: 100
          },
          top: [[key, g.assetName, cc || 'UN', 100]]
        }
      });
      return;
    }
    const csum = Object.values(d.countries).reduce((a, b) => a + b, 0);
    Object.entries(d.countries).forEach(([cc, w]) => addC(cc, v * w / 100));
    if (csum < 100) X.unknownVal += v * (100 - csum) / 100;
    Object.entries(d.sectors).forEach(([s, w]) => addS(s, v * w / 100));
    d.top.forEach(([key, ar, cc, w]) => {
      if (!X.companies[key]) X.companies[key] = {
        key,
        ar,
        cc,
        val: 0,
        via: []
      };
      X.companies[key].val += v * w / 100;
      X.companies[key].via.push(g.assetName);
    });
    X.coCount += d._count || (d.top ? d.top.length : 0);
    X.funds.push({
      id: g.assetName,
      val: v,
      data: d,
      custom: !!(customXray[g.assetName] || customXray[ast && ast.id || ''])
    });
  });
  if (extra && extra.valSAR > 0) {
    const d = xrayLookup(extra.name, extra.name);
    if (d) {
      const v = extra.valSAR;
      X.total += v;
      Object.entries(d.countries).forEach(([cc, w]) => addC(cc, v * w / 100));
      const csum = Object.values(d.countries).reduce((a, b) => a + b, 0);
      if (csum < 100) X.unknownVal += v * (100 - csum) / 100;
      Object.entries(d.sectors).forEach(([s, w]) => addS(s, v * w / 100));
      d.top.forEach(([key, ar, cc, w]) => {
        if (!X.companies[key]) X.companies[key] = {
          key,
          ar,
          cc,
          val: 0,
          via: []
        };
        X.companies[key].val += v * w / 100;
        X.companies[key].via.push(extra.name);
      });
    }
  }
  return X;
}
const XR_CUR_OF = {
  US: 'USD',
  CA: 'USD',
  SA: 'SAR',
  AE: 'USD',
  QA: 'USD',
  KW: 'USD',
  JO: 'JOD',
  JP: 'JPY',
  GB: 'GBP',
  CH: 'CHF',
  FR: 'EUR',
  NL: 'EUR',
  DE: 'EUR',
  IE: 'EUR',
  DK: 'EUR',
  SE: 'EUR',
  AU: 'AUD',
  KR: 'KRW',
  TW: 'TWD',
  IN: 'INR',
  CN: 'CNY',
  HK: 'CNY',
  BR: 'BRL',
  ZA: 'ZAR',
  TH: 'THB',
  MY: 'MYR',
  ID: 'IDR',
  MX: 'MXN'
};
function xrMetrics(X) {
  const T = X.total || 1,
    mapped = X.mapped || 1;
  const cShares = Object.values(X.countries).map(v => v / mapped * 100);
  const hhiGeo = cShares.reduce((a, s) => a + s * s, 0);
  const sShares = Object.values(X.sectors).map(v => v / T * 100);
  const hhiSec = sShares.reduce((a, s) => a + s * s, 0);
  const curMap = {};
  Object.entries(X.countries).forEach(([cc, v]) => {
    const c = XR_CUR_OF[cc] || 'أخرى';
    curMap[c] = (curMap[c] || 0) + v;
  });
  const maxCur = Math.max(0, ...Object.values(curMap)) / mapped * 100;
  const sharedVal = Object.values(X.companies).filter(c => new Set(c.via).size > 1).reduce((a, c) => a + c.val, 0);
  const ovlPct = sharedVal / T * 100;
  const emPct = X.em / (X.dev + X.em || 1) * 100;
  const usPct = (X.countries.US || 0) / T * 100;
  const clamp = v => Math.max(0, Math.min(100, v));
  const scores = {
    geo: clamp(100 - (hhiGeo - 800) / 55),
    sec: clamp(100 - (hhiSec - 800) / 55),
    cur: clamp(100 - (maxCur - 40) * 1.6),
    ovl: clamp(100 - ovlPct * 2.2),
    bal: clamp(emPct >= 10 && emPct <= 40 ? 100 : 100 - (emPct < 10 ? 10 - emPct : emPct - 40) * 2)
  };
  const total = Math.round(scores.geo * .25 + scores.sec * .2 + scores.cur * .2 + scores.ovl * .2 + scores.bal * .15);
  return {
    hhiGeo,
    hhiSec,
    maxCur,
    ovlPct,
    emPct,
    usPct,
    scores,
    total,
    curMap,
    sharedVal
  };
}
function renderGeoPage() {
  const X = computeXray();
  const T = X.total || 1;
  const pc = v => fmt(v / T * 100, 1) + '%';
  const cList = Object.entries(X.countries).sort((a, b) => b[1] - a[1]);
  const nCountries = cList.filter(([, v]) => v > 0).length;
  const topC = cList[0];
  const nCompanies = X.coCount || Object.keys(X.companies).length;
  const chips = $('xrChips');
  if (chips) chips.innerHTML = `
    <div class="xr-chip"><div class="v gold" id="xrCuCountries">${nCountries}</div><div class="l">دولة تستثمر فيها</div></div>
    <div class="xr-chip"><div class="v">${topC ? geoFlag(topC[0]) + ' ' + geoName(topC[0]) : '—'}</div><div class="l">أكبر تمركز ${topC ? '(' + pc(topC[1]) + ')' : ''}</div></div>
    <div class="xr-chip"><div class="v">${nCompanies}</div><div class="l">شركة تملك حصة فيها عبر الصناديق</div></div>
    <div class="xr-chip"><div class="v gold" id="xrCuTotal">${fmtC(X.total)}</div><div class="l">قيمة الأسهم والصناديق في التحليل</div></div>`;
  const maxC = topC ? topC[1] : 1;
  const cEl = $('xrCountries');
  if (cEl) cEl.innerHTML = cList.slice(0, 12).map(([cc, v]) => `
    <div class="xr-row">
      <div class="nm"><span class="flag">${geoFlag(cc)}</span>${geoName(cc)}</div>
      <div class="xr-bar"><div style="width:${Math.max(2, v / maxC * 100)}%"></div></div>
      <div class="pct">${pc(v)}</div><div class="val">${fmtC(v)}</div>
    </div>`).join('') + (X.unknownVal > 1 ? `<div class="xr-row"><div class="nm"><span class="flag">🌐</span>دول أخرى متفرقة</div><div class="xr-bar"><div style="width:${Math.max(2, X.unknownVal / maxC * 100)}%;background:var(--surf2)"></div></div><div class="pct" style="color:var(--muted)">${pc(X.unknownVal)}</div><div class="val"></div></div>` : '');
  const coList = Object.values(X.companies).sort((a, b) => b.val - a.val).slice(0, 10);
  const coEl = $('xrCompanies');
  if (coEl) coEl.innerHTML = coList.length ? coList.map((c, i) => `
    <div class="xr-co">
      <div class="rank">${i + 1}</div>
      <div class="who"><div class="n">${geoFlag(c.cc)} ${c.ar}</div><div class="via">عبر: ${[...new Set(c.via)].join(' + ')}</div></div>
      <div class="amt"><div class="v">${fmtC(c.val)}</div><div class="p">${pc(c.val)} من المحفظة</div></div>
    </div>`).join('') : '<div style="font-size:12px;color:var(--muted)">لا توجد صناديق معروفة بعد</div>';
  const sList = Object.entries(X.sectors).sort((a, b) => b[1] - a[1]);
  const maxS = sList.length ? sList[0][1] : 1;
  const sEl = $('xrSectors');
  if (sEl) sEl.innerHTML = sList.slice(0, 10).map(([s, v]) => `
    <div class="xr-row">
      <div class="nm" style="min-width:150px">${s}</div>
      <div class="xr-bar"><div style="width:${Math.max(2, v / maxS * 100)}%"></div></div>
      <div class="pct">${pc(v)}</div>
    </div>`).join('');
  const geo = X.dev + X.em || 1;
  const devP = X.dev / geo * 100,
    emP = X.em / geo * 100;
  let hhi = 0;
  cList.forEach(([, v]) => {
    const s = v / (X.mapped || 1) * 100;
    hhi += s * s;
  });
  const hhiTxt = hhi < 1500 ? ['توزيع ممتاز', 'var(--green)'] : hhi < 2500 ? ['توزيع جيد', 'var(--gold)'] : hhi < 5000 ? ['تمركز مرتفع', '#f0a050'] : ['تمركز عالٍ جداً', 'var(--red)'];
  const spEl = $('xrSplit');
  if (spEl) spEl.innerHTML = `
    <div class="xr-split"><div style="width:${devP}%;background:linear-gradient(90deg,var(--gold),var(--goldL))"></div><div style="width:${emP}%;background:#5c9fff"></div></div>
    <div class="xr-legend">
      <span><span class="dot" style="background:var(--gold)"></span>أسواق متقدمة ${fmt(devP, 1)}% (${fmtC(X.dev)})</span>
      <span><span class="dot" style="background:#5c9fff"></span>أسواق ناشئة ${fmt(emP, 1)}% (${fmtC(X.em)})</span>
    </div>
    <div style="margin-top:9px;font-size:11px;color:${emP >= 10 && emP <= 40 ? 'var(--green)' : emP <= 55 ? 'var(--gold)' : '#f0a050'}">
      ${emP < 10 ? 'ميل قوي نحو الأسواق المتقدمة' : emP <= 40 ? 'ضمن النطاق الشائع عالمياً (10–40% ناشئة)' : emP <= 55 ? 'ميل ملحوظ نحو الأسواق الناشئة' : 'ميل قوي نحو الأسواق الناشئة — عوائد محتملة أعلى مقابل تقلبات أعلى'}
    </div>
    <div style="margin-top:16px;padding-top:13px;border-top:1px solid var(--bdr)">
      <div style="font-size:11px;color:var(--muted);margin-bottom:6px">مقياس منفصل: التمركز بين الدول (HHI) — كم فلوسك مكدسة في دول قليلة؟</div>
      <div style="display:flex;align-items:center;gap:10px">
        <div style="font-size:24px;font-weight:600;color:${hhiTxt[1]}">${fmt(hhi, 0)}</div>
        <div><div style="font-size:12px;color:${hhiTxt[1]};font-weight:600">${hhiTxt[0]}</div><div style="font-size:10px;color:var(--muted)">أقل من 1500 يعني توزيعاً صحياً بين الدول</div></div>
      </div>
    </div>`;
  const shared = Object.values(X.companies).filter(c => new Set(c.via).size > 1).sort((a, b) => b.val - a.val);
  const ovEl = $('xrOverlap');
  if (ovEl) {
    if (shared.length) {
      const sharedVal = shared.reduce((a, c) => a + c.val, 0);
      const usPct = X.countries.US ? X.countries.US / T * 100 : 0;
      ovEl.innerHTML = `
        <div class="xr-alert"><i class="ti ti-alert-triangle"></i><div>
          عندك <b>${shared.length} شركات مشتركة</b> بين أكثر من صندوق بقيمة فعلية <b>${fmtC(sharedVal)}</b>.
          ${usPct > 50 ? `تعرّضك الإجمالي لأمريكا <b>${fmt(usPct, 1)}%</b> — كل ريال إضافي في ISDU يزيد هذا التمركز لأن ISWD يحمل نفس الشركات الأمريكية الكبرى.` : ''}
        </div></div>
        ${shared.slice(0, 6).map(c => `
        <div class="xr-co">
          <div class="rank"><i class="ti ti-copy" style="font-size:11px"></i></div>
          <div class="who"><div class="n">${geoFlag(c.cc)} ${c.ar}</div><div class="via">موجودة في: ${[...new Set(c.via)].join(' و ')}</div></div>
          <div class="amt"><div class="v">${fmtC(c.val)}</div><div class="p">مجموع الحصتين</div></div>
        </div>`).join('')}`;
    } else ovEl.innerHTML = '<div style="font-size:12px;color:var(--muted)">لا يوجد تداخل بين صناديقك الحالية</div>';
  }
  const fEl = $('xrFunds');
  if (fEl) fEl.innerHTML = X.funds.sort((a, b) => b.val - a.val).map((f, i) => {
    const d = f.data;
    const fc = Object.entries(d.countries).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return `
    <div class="xr-fund" id="xrFund${i}">
      <div class="xr-fund-head" onclick="document.getElementById('xrFund${i}').classList.toggle('open')">
        <div class="ic"><i class="ti ${d.kind === 'etf' ? 'ti-stack-2' : 'ti-building'}"></i></div>
        <div><div class="t1">${f.id} — ${d.label}</div><div class="t2">${d.desc}</div></div>
        <div class="amt"><div class="v">${fmtC(f.val)}</div><div class="p">${pc(f.val)} من المحفظة</div></div>
        <i class="ti ti-chevron-down chev"></i>
      </div>
      <div class="xr-fund-body">
        <div style="font-size:11px;color:var(--gold);margin:10px 0 6px;font-weight:600">أكبر المراكز</div>
        ${d.top.map(([k, ar, cc, w]) => `
          <div class="xr-row">
            <div class="nm" style="min-width:160px"><span class="flag">${geoFlag(cc)}</span>${ar}</div>
            <div class="xr-bar"><div style="width:${Math.max(3, w / (d.top[0][3] || 1) * 100)}%"></div></div>
            <div class="pct">${fmt(w, 1)}%</div>
            <div class="val">${fmtC(f.val * w / 100)}</div>
          </div>`).join('')}
        ${f.direct ? `<div style="margin-top:10px;display:flex;gap:14px;flex-wrap:wrap">
          <span style="font-size:11px;color:var(--gold);cursor:pointer;text-decoration:underline;text-underline-offset:3px" onclick="xrEditFund(this.dataset.n)" data-n="${f.id}"><i class="ti ti-puzzle" style="font-size:12px"></i> هذا صندوق؟ عرّف تركيبته</span>
          <span style="font-size:11px;color:var(--muted);cursor:pointer;text-decoration:underline;text-underline-offset:3px" onclick="xrSetSector(this.dataset.n)" data-n="${f.id}"><i class="ti ti-pencil" style="font-size:12px"></i> تحديد القطاع (سهم مباشر)</span>
        </div>` : `<div style="margin-top:10px;display:flex;gap:14px;flex-wrap:wrap"><span style="font-size:11px;color:${f.custom ? 'var(--gold)' : 'var(--muted)'};cursor:pointer;text-decoration:underline;text-underline-offset:3px" onclick="xrEditFund(this.dataset.n)" data-n="${f.id}"><i class="ti ti-puzzle" style="font-size:12px"></i> ${f.custom ? 'تعديل تركيبتك المخصصة' : 'تحديث التركيبة (الافتراضية قد تتقادم)'}</span>${customXray[f.id] && customXray[f.id]._csvUrl ? `<span style="font-size:11px;color:var(--gold);cursor:pointer;text-decoration:underline;text-underline-offset:3px" onclick="quickRefreshFund(this.dataset.n)" data-n="${f.id}"><i class="ti ti-refresh" style="font-size:12px"></i> تحديث من نفس الرابط</span>` : ''}</div>`}
        <div style="font-size:11px;color:var(--gold);margin:14px 0 6px;font-weight:600">التوزيع الجغرافي داخل الصندوق</div>
        ${fc.map(([cc, w]) => `
          <div class="xr-row">
            <div class="nm"><span class="flag">${geoFlag(cc)}</span>${geoName(cc)}</div>
            <div class="xr-bar"><div style="width:${Math.max(3, w / (fc[0][1] || 1) * 100)}%"></div></div>
            <div class="pct">${fmt(w, 1)}%</div>
            <div class="val">${fmtC(f.val * w / 100)}</div>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('') || '<div style="font-size:12px;color:var(--muted);margin-top:8px">أضف حركات شراء لصناديقك لتظهر هنا</div>';
  const fn = $('xrFootnote');
  if (fn) fn.textContent = `أوزان الصناديق تقريبية ومبنية على نشرات iShares/BlackRock الرسمية (${XRAY_ASOF}) وتتغير مع إعادة التوازن الربع سنوية. التحليل يشمل الأسهم والصناديق فقط — الكاش والذهب والأملاك خارج الخريطة. الأسهم المباشرة غير المعرّفة تُنسب تلقائياً لدولة بورصتها من رمز Yahoo.`;
  autoFetchSectors();
  _xrLast = X;
  renderXrHealth(X);
  renderXrScenBtns();
  updateXrStress();
  xrSimPopulate();
  xrSimRun();
  if (_xrAnim) {
    _xrAnim = false;
    const c1 = $('xrCuCountries');
    if (c1) xrCountUp(c1, nCountries, v => fmt(v, 0));
    const c2 = $('xrCuTotal');
    if (c2) xrCountUp(c2, X.total, v => fmtC(v));
  }
  drawGeoMap(X);
}
let _xrAnim = false,
  _xrLast = null,
  _xrRadarChart = null,
  _xrScen = null;
function xrCountUp(el, to, fmtFn, dur = 900) {
  const t0 = performance.now();
  (function step(t) {
    const p = Math.min(1, (t - t0) / dur),
      e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmtFn(to * e);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}
function renderXrHealth(X) {
  const m = xrMetrics(X);
  const grade = m.total >= 80 ? ['ممتاز', 'var(--green)'] : m.total >= 65 ? ['جيد جداً', 'var(--gold)'] : m.total >= 50 ? ['جيد', '#f0a050'] : ['يحتاج تنويع', 'var(--red)'];
  const arc = $('xrRingArc');
  if (arc) {
    arc.style.stroke = grade[1];
    arc.style.transition = 'stroke-dasharray 1s cubic-bezier(.34,1.2,.64,1)';
    requestAnimationFrame(() => {
      arc.setAttribute('stroke-dasharray', m.total / 100 * 302 + ' 302');
    });
  }
  st('xrScoreNum', m.total);
  const gEl = $('xrScoreGrade');
  if (gEl) {
    gEl.textContent = grade[0];
    gEl.style.color = grade[1];
  }
  const rows = [['تنويع جغرافي', m.scores.geo], ['تنويع قطاعي', m.scores.sec], ['تنويع عملات', m.scores.cur], ['قلة التداخل', m.scores.ovl], ['توازن متقدمة/ناشئة*', m.scores.bal]];
  const rEl = $('xrScoreRows');
  if (rEl) rEl.innerHTML = rows.map(([n, v]) => `
    <div class="xr-row">
      <div class="nm" style="font-size:11px">${n}</div>
      <div class="xr-bar"><div style="width:${Math.max(2, v)}%"></div></div>
      <div class="pct">${fmt(v, 0)}</div>
    </div>`).join('') + `<div style="font-size:10px;color:var(--muted);opacity:.7;margin-top:6px">* مقارنةً بنطاق شائع 10–40% للأسواق الناشئة — الميل المتعمد خيار مشروع</div>`;
  const cv = $('xrRadar');
  if (cv && typeof Chart !== 'undefined') {
    if (_xrRadarChart) _xrRadarChart.destroy();
    _xrRadarChart = new Chart(cv, {
      type: 'radar',
      data: {
        labels: ['جغرافي', 'قطاعي', 'عملات', 'تداخل', 'توازن'],
        datasets: [{
          data: [m.scores.geo, m.scores.sec, m.scores.cur, m.scores.ovl, m.scores.bal],
          backgroundColor: 'rgba(201,168,76,.18)',
          borderColor: '#c9a84c',
          borderWidth: 2,
          pointBackgroundColor: '#e8c97a',
          pointBorderColor: '#c9a84c',
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              display: false
            },
            grid: {
              color: document.documentElement.classList.contains('ios-light') ? 'rgba(60,60,67,.16)' : 'rgba(255,255,255,.14)'
            },
            angleLines: {
              color: document.documentElement.classList.contains('ios-light') ? 'rgba(60,60,67,.16)' : 'rgba(255,255,255,.14)'
            },
            pointLabels: {
              color: document.documentElement.classList.contains('ios-light') ? '#7a7d8a' : '#b8bac4',
              font: {
                family: FONT_CANVAS,
                size: 11
              }
            }
          }
        }
      }
    });
  }
}
const XR_SCEN = {
  us: {
    t: 'انهيار أمريكا −25%',
    f: (X, m) => (X.countries.US || 0) * 0.25
  },
  em: {
    t: 'أزمة أسواق ناشئة −30%',
    f: (X, m) => X.em * 0.30
  },
  tech: {
    t: 'انفجار فقاعة التقنية −35%',
    f: (X, m) => ((X.sectors['تكنولوجيا'] || 0) + (X.sectors['تكنولوجيا إلكترونية'] || 0)) * 0.35
  },
  usd: {
    t: 'هبوط الدولار −10%',
    f: (X, m) => {
      let v = 0;
      Object.entries(X.countries).forEach(([cc, x]) => {
        if ((XR_CUR_OF[cc] || '') === 'USD' && cc !== 'SA') v += x;
      });
      return v * 0.10;
    }
  },
  global: {
    t: 'يوم أسود عالمي −15%',
    f: (X, m) => X.total * 0.15
  }
};
function renderXrScenBtns() {
  const el = $('xrScenBtns');
  if (!el || el.children.length) return;
  el.innerHTML = Object.entries(XR_SCEN).map(([k, s]) => `<button id="xrScen_${k}" onclick="xrPickScen('${k}')">${s.t}</button>`).join('');
}
function xrPickScen(k) {
  _xrScen = _xrScen === k ? null : k;
  updateXrStress();
}
function updateXrStress() {
  Object.keys(XR_SCEN).forEach(k => {
    const b = $('xrScen_' + k);
    if (b) b.classList.toggle('active', _xrScen === k);
  });
  const out = $('xrStressOut');
  if (!out) return;
  if (!_xrScen || !_xrLast) {
    out.classList.remove('show');
    return;
  }
  const X = _xrLast,
    s = XR_SCEN[_xrScen];
  const loss = s.f(X, null),
    pct = loss / (X.total || 1) * 100,
    remain = X.total - loss;
  out.classList.add('show');
  out.innerHTML = `
    <div style="font-size:11px;color:var(--muted);margin-bottom:4px">${s.t} — الخسارة المتوقعة على أسهمك وصناديقك:</div>
    <div class="big">−${fmtC(loss)} <span style="font-size:13px">(−${fmt(pct, 1)}%)</span></div>
    <div class="xr-stress-bar"><div style="width:${Math.min(100, pct)}%"></div></div>
    <div style="font-size:11.5px;color:var(--text)">قيمة المحفظة بعد الصدمة: <b>${fmtC(remain)}</b></div>
    <div style="font-size:10px;color:var(--muted);margin-top:8px;opacity:.7">محاكاة تقريبية بافتراض هبوط متساوٍ داخل الفئة — الواقع قد يختلف</div>`;
}
function xrBaseToSar(v) {
  if (!baseCur || baseCur === 'SAR') return v;
  const r = fx[baseCur];
  return r && r > 0 ? v * r : v / (CUR_RATES[baseCur] || 1);
}
function xrSimPopulate() {
  const sel = $('xrSimAsset');
  if (!sel) return;
  const prev = sel.value;
  const allX = Object.assign({}, XRAY_DATA, customXray);
  sel.innerHTML = Object.entries(allX).map(([k, d]) => `<option value="${k}">${k} — ${d.label || k}</option>`).join('');
  if (prev && allX[prev]) sel.value = prev;
  if (!sel.onchange) sel.onchange = () => xrSimRun();
  const c = $('xrSimCur');
  if (c) c.textContent = 'بالـ' + baseCur;
}
function xrSimRun() {
  const out = $('xrSimOut');
  if (!out || !_xrLast) return;
  const amt = pN(($('xrSimAmt') || {}).value);
  if (amt <= 0) {
    out.innerHTML = '<div style="font-size:11.5px;color:var(--muted);grid-column:1/-1">اكتب مبلغاً لرؤية الأثر — مثلاً: 10,000</div>';
    return;
  }
  const name = ($('xrSimAsset') || {}).value;
  if (!name) return;
  const A = xrMetrics(_xrLast);
  const X2 = computeXray({
    name,
    valSAR: xrBaseToSar(amt)
  });
  const B = xrMetrics(X2);
  const cell = (l, a, b, fmtFn, goodDown) => {
    const better = goodDown ? b < a - 0.05 : b > a + 0.05;
    const worse = goodDown ? b > a + 0.05 : b < a - 0.05;
    const col = better ? 'var(--green)' : worse ? 'var(--red)' : 'var(--text)';
    return `<div class="cell"><div class="l">${l}</div><div class="vals"><span class="from">${fmtFn(a)}</span><span class="arr">←</span><span style="color:${col}">${fmtFn(b)}</span></div></div>`;
  };
  const topB = Object.entries(X2.countries).sort((x, y) => y[1] - x[1])[0];
  out.innerHTML = cell('التعرض لأمريكا', A.usPct, B.usPct, v => fmt(v, 1) + '%', true) + cell('تمركز جغرافي (HHI)', A.hhiGeo, B.hhiGeo, v => fmt(v, 0), true) + cell('أسواق ناشئة', A.emPct, B.emPct, v => fmt(v, 1) + '%', false) + cell('درجة الصحة', A.total, B.total, v => fmt(v, 0) + '/100', false) + `<div class="cell"><div class="l">أكبر تمركز بعد الشراء</div><div class="vals" style="direction:rtl;justify-content:flex-start">${topB ? geoFlag(topB[0]) + ' ' + geoName(topB[0]) + ' ' + fmt(topB[1] / (X2.total || 1) * 100, 1) + '%' : '—'}</div></div>`;
}
let _sectorsTried = false;
function autoFetchSectors() {
  if (_sectorsTried || !_cloudMode) return;
  const need = assets.filter(a => a.type === 'Stock' && a.yahooSym && !a.sector && !xrayLookup(a.name, a.id));
  if (!need.length) return;
  _sectorsTried = true;
  try {
    portfolioAPI.withSuccessHandler(function (map) {
      if (!map) return;
      let changed = false;
      need.forEach(a => {
        const s = map[a.yahooSym];
        if (s) {
          a.sector = s;
          changed = true;
        }
      });
      if (changed) {
        saveAssets();
        if ($('page-geo')?.classList.contains('active')) renderGeoPage();
      }
    }).withFailureHandler(function () {}).getSectors(need.map(a => a.yahooSym).join(','));
  } catch (e) {}
}
let _xrfTarget = '';
const XRF_TEMPLATE = {
  label: "اسم الصندوق الكامل",
  desc: "وصف قصير يظهر تحت الاسم",
  kind: "etf",
  countries: {
    US: 60,
    JP: 10,
    GB: 5
  },
  sectors: {
    "تكنولوجيا": 30,
    "رعاية صحية": 15,
    "طاقة": 10,
    "أخرى": 45
  },
  top: [["MSFT", "مايكروسوفت", "US", 7.5], ["TSLA", "تسلا", "US", 3.2]]
};
function xrEditFund(name) {
  _xrfTarget = name;
  const ast = findAsset(name);
  const builtin = XRAY_DATA[name] || XRAY_DATA[ast && ast.id || ''];
  const t = $('xrfName');
  if (t) t.textContent = name;
  const ta = $('xrfJson');
  if (ta) ta.value = JSON.stringify(customXray[name] || builtin || XRF_TEMPLATE, null, 2);
  const del = $('btnXrfDelete');
  if (del) {
    del.style.display = customXray[name] ? '' : 'none';
    del.textContent = builtin ? 'العودة للافتراضي' : 'حذف التعريف';
  }
  const cu = $('xrfCsvUrl');
  if (cu) cu.value = '';
  const er = $('xrfErr');
  if (er) {
    er.style.color = 'var(--red)';
    er.textContent = builtin && !customXray[name] ? 'هذه التركيبة الافتراضية المثبتة — عدّلها واحفظ لتصبح تركيبتك المعتمدة' : '';
  }
  openModal('xrFundModal');
}
const YH_SEC_AR = {
  technology: 'تكنولوجيا',
  healthcare: 'رعاية صحية',
  financial_services: 'مالية',
  consumer_cyclical: 'سلع كمالية',
  consumer_defensive: 'سلع أساسية',
  communication_services: 'اتصالات',
  industrials: 'صناعة',
  energy: 'طاقة',
  basic_materials: 'مواد وتعدين',
  utilities: 'مرافق',
  realestate: 'عقارات'
};
function xrfAutoFetch() {
  const er = $('xrfErr');
  if (!_cloudMode) {
    if (er) er.textContent = "\u26A0\uFE0F \u0627\u0644\u062C\u0644\u0628 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u064A\u0639\u0645\u0644 \u0645\u0646 \u062F\u0627\u062E\u0644 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u0641\u0642\u0637 \u2014 \u0627\u0645\u0644\u0623 \u064A\u062F\u0648\u064A\u0627\u064B \u0623\u0648 \u0627\u0637\u0644\u0628 JSON \u0645\u0646 Claude";
    return;
  }
  const ast = findAsset(_xrfTarget);
  const sym = ast && ast.yahooSym;
  if (!sym) {
    if (er) er.textContent = '⚠️ الأصل بدون رمز Yahoo';
    return;
  }
  if (er) {
    er.style.color = 'var(--muted)';
    er.textContent = '⏳ جاري الجلب من Yahoo...';
  }
  portfolioAPI.withSuccessHandler(function (r) {
    if (er) er.style.color = 'var(--red)';
    if (!r || !r.ok) {
      if (er) er.textContent = '⚠️ فشل الجلب — ' + (r && r.err || "\u0623\u0636\u0641 getFundComposition \u0625\u0644\u0649 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642") + '. املأ يدوياً.';
      return;
    }
    const top = (r.top || []).filter(h => h[0] || h[1]).map(h => {
      const tk = String(h[0] || h[1]).toUpperCase();
      return [tk.split('.')[0], String(h[1] || h[0]), geoFromYahoo(tk) || 'US', Math.round((h[2] || 0) * 100) / 100];
    });
    const sectors = {};
    Object.entries(r.sectors || {}).forEach(([k, v]) => {
      if (v > 0.05) sectors[YH_SEC_AR[k] || k] = Math.round(v * 10) / 10;
    });
    const cw = {};
    let tw = 0;
    top.forEach(h => {
      cw[h[2]] = (cw[h[2]] || 0) + h[3];
      tw += h[3];
    });
    const countries = {};
    if (tw > 0) Object.entries(cw).forEach(([cc, w]) => {
      countries[cc] = Math.round(w / tw * 1000) / 10;
    });
    const cur = customXray[_xrfTarget] || {};
    const d = {
      label: cur.label || ast && ast.name || _xrfTarget,
      desc: 'تركيبة من Yahoo — راجع توزيع الدول (تقديري من أكبر المراكز)',
      kind: 'etf',
      countries: Object.keys(countries).length ? countries : cur.countries || {
        US: 100
      },
      sectors: Object.keys(sectors).length ? sectors : cur.sectors || {
        'أخرى': 100
      },
      top: top
    };
    const ta = $('xrfJson');
    if (ta) ta.value = JSON.stringify(d, null, 2);
    if (er) {
      er.style.color = 'var(--green)';
      er.textContent = '✓ تم الجلب — راجع توزيع الدول خصوصاً ثم احفظ';
    }
  }).withFailureHandler(function (e) {
    if (er) {
      er.style.color = 'var(--red)';
      er.textContent = "\u26A0\uFE0F \u0627\u0644\u062F\u0627\u0644\u0629 getFundComposition \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629 \u0641\u064A \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u2014 \u0627\u0646\u0633\u062E\u0647\u0627 \u0645\u0646 \u062F\u0644\u064A\u0644 \u0627\u0644\u062A\u062D\u062F\u064A\u062B";
    }
  }).getFundComposition(sym);
}
function quickRefreshFund(name) {
  const saved = customXray[name];
  const url = saved && saved._csvUrl;
  if (!url) {
    showToast('لا يوجد رابط محفوظ لهذا الصندوق — افتح "تعديل التركيبة" والصق الرابط مرة واحدة', 'error');
    return;
  }
  if (!_cloudMode) {
    showToast("\u0627\u0644\u062A\u062D\u062F\u064A\u062B \u064A\u0639\u0645\u0644 \u0645\u0646 \u062F\u0627\u062E\u0644 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u0641\u0642\u0637", 'error');
    return;
  }
  showToast('⏳ جاري تحديث ' + name + ' من iShares...', 'info');
  portfolioAPI.withSuccessHandler(function (r) {
    if (!r || !r.ok) {
      showToast('⚠️ فشل التحديث — ' + (r && r.err || 'تحقق من الرابط'), 'error');
      return;
    }
    const cur = customXray[name] || {};
    customXray[name] = {
      label: cur.label || name,
      desc: 'تركيبة رسمية من iShares CSV — توزيع جغرافي فعلي',
      kind: 'etf',
      countries: r.countries && Object.keys(r.countries).length ? r.countries : cur.countries,
      sectors: r.sectors && Object.keys(r.sectors).length ? r.sectors : cur.sectors,
      top: Array.isArray(r.top) ? r.top : cur.top || [],
      _count: r.count || cur._count || 0,
      _csvUrl: url
    };
    saveCustomXray();
    renderGeoPage();
    showToast('✓ حُدّثت تركيبة ' + name, 'success');
  }).withFailureHandler(function () {
    showToast("\u26A0\uFE0F \u062F\u0627\u0644\u0629 fetchFundCsv \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629 \u0641\u064A \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642", 'error');
  }).fetchFundCsv(url, Math.max(1, Math.min(50, (typeof zkOpt !== 'undefined' ? pN(zkOpt.topN) : 0) || 20)));
}
function fetchFundCsvUI() {
  const er = $('xrfErr'),
    url = ($('xrfCsvUrl') || {}).value || '';
  if (!url.trim()) {
    if (er) {
      er.style.color = 'var(--red)';
      er.textContent = '⚠️ الصق رابط CSV من iShares أولاً';
    }
    return;
  }
  if (!_cloudMode) {
    if (er) {
      er.style.color = 'var(--red)';
      er.textContent = "\u26A0\uFE0F \u0627\u0644\u062C\u0644\u0628 \u064A\u0639\u0645\u0644 \u0645\u0646 \u062F\u0627\u062E\u0644 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u0641\u0642\u0637 \u2014 \u0623\u0636\u0641 \u062F\u0627\u0644\u0629 fetchFundCsv \u0625\u0644\u0649 \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642";
    }
    return;
  }
  if (er) {
    er.style.color = 'var(--muted)';
    er.textContent = '⏳ جاري جلب الملف من iShares وتحليله...';
  }
  portfolioAPI.withSuccessHandler(function (r) {
    if (!r || !r.ok) {
      if (er) {
        er.style.color = 'var(--red)';
        er.textContent = '⚠️ ' + (r && r.err || 'فشل التحليل');
      }
      return;
    }
    const ast = findAsset(_xrfTarget),
      cur = customXray[_xrfTarget] || {};
    const d = {
      label: cur.label || ast && ast.name || _xrfTarget,
      desc: 'تركيبة رسمية من iShares CSV — توزيع جغرافي فعلي',
      kind: 'etf',
      countries: r.countries && Object.keys(r.countries).length ? r.countries : cur.countries || {
        US: 100
      },
      sectors: r.sectors && Object.keys(r.sectors).length ? r.sectors : cur.sectors || {
        'أخرى': 100
      },
      top: Array.isArray(r.top) ? r.top : [],
      _count: r.count || 0,
      _csvUrl: url.trim()
    };
    const ta = $('xrfJson');
    if (ta) ta.value = JSON.stringify(d, null, 2);
    if (er) {
      er.style.color = 'var(--green)';
      er.textContent = '✓ تم الجلب والتحليل — راجع الأرقام ثم احفظ';
    }
  }).withFailureHandler(function (e) {
    if (er) {
      er.style.color = 'var(--red)';
      er.textContent = "\u26A0\uFE0F \u0627\u0644\u062F\u0627\u0644\u0629 fetchFundCsv \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629 \u0641\u064A \u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u2014 \u0623\u0636\u0641\u0647\u0627 \u0645\u0646 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0645\u0631\u0641\u0642";
    }
  }).fetchFundCsv(url.trim(), Math.max(1, Math.min(50, (typeof zkOpt !== 'undefined' ? pN(zkOpt.topN) : 0) || 20)));
}
function xrfDelete() {
  if (!_xrfTarget) return;
  const ast = findAsset(_xrfTarget);
  const builtin = XRAY_DATA[_xrfTarget] || XRAY_DATA[ast && ast.id || ''];
  delete customXray[_xrfTarget];
  saveCustomXray();
  closeModal('xrFundModal');
  renderGeoPage();
  showToast(builtin ? 'رجع للتركيبة الافتراضية' : 'حُذف تعريف الصندوق', 'success');
}
function xrfSave() {
  const er = $('xrfErr');
  try {
    const d = JSON.parse(($('xrfJson') || {}).value || '{}');
    if (!d.countries || typeof d.countries !== 'object' || !Object.keys(d.countries).length) throw new Error('countries مطلوب — كائن {دولة: وزن}');
    if (!d.sectors || typeof d.sectors !== 'object') d.sectors = {
      'أخرى': 100
    };
    if (!Array.isArray(d.top)) d.top = [];
    d.top = d.top.filter(r => Array.isArray(r) && r.length >= 4).map(r => [String(r[0]), String(r[1]), String(r[2]), parseFloat(r[3]) || 0]);
    Object.keys(d.countries).forEach(k => {
      d.countries[k] = parseFloat(d.countries[k]) || 0;
    });
    Object.keys(d.sectors).forEach(k => {
      d.sectors[k] = parseFloat(d.sectors[k]) || 0;
    });
    d.kind = d.kind || 'etf';
    d.label = d.label || _xrfTarget;
    d.desc = (d.desc || 'تركيبة مخصصة') + ' · معرّف يدوياً';
    customXray[_xrfTarget] = d;
    saveCustomXray();
    closeModal('xrFundModal');
    renderGeoPage();
    showToast('حُفظت تركيبة ' + _xrfTarget + ' — دخل التحليل بالكامل', 'success');
  } catch (e) {
    if (er) er.textContent = '⚠️ ' + (e.message || 'JSON غير صالح');
  }
}
function xrSetSector(name) {
  const a = findAsset(name);
  if (!a) return;
  const cur = a.sector || '';
  const v = prompt('قطاع السهم "' + name + '"؟\nمثال: تكنولوجيا، طاقة، اتصالات، رعاية صحية...', cur);
  if (v === null) return;
  a.sector = v.trim();
  saveAssets();
  renderGeoPage();
}
let _geoLibPromise = null,
  _geoMapObj = null;
function loadGeoLibs() {
  if (window.jsVectorMap && window._geoWorldLoaded) return Promise.resolve();
  if (!_geoLibPromise) _geoLibPromise = window.loadTharwaMap().catch(error => {
    _geoLibPromise = null;
    throw error;
  });
  return _geoLibPromise;
}

function drawGeoMap(X) {
  const el = $('geoMap');
  if (!el) return;
  const status = $('geoMapStatus');
  if (status) status.textContent = 'جاري تحميل الخريطة...';
  loadGeoLibs().then(() => {
    if (!$('page-geo') || !$('page-geo').classList.contains('active')) return;
    _geoMapObj?.destroy();
    el.innerHTML = '';
    _geoMapObj = null;
    const vals = {};
    Object.entries(X.countries).forEach(([cc, v]) => {
      if (v > 0) vals[cc] = v;
    });
    const T = X.total || 1;
    const _lt = document.documentElement.classList.contains('ios-light');
    _geoMapObj = new jsVectorMap({
      selector: '#geoMap',
      map: 'world',
      backgroundColor: 'transparent',
      zoomButtons: true,
      zoomOnScroll: false,
      zoomMax: 8,
      regionStyle: {
        initial: {
          fill: _lt ? '#E4E2DC' : '#2C2C2E',
          stroke: _lt ? '#F2F2F7' : '#000000',
          strokeWidth: 0.4
        },
        hover: {
          fill: _lt ? '#D2CFC6' : '#3A3A3C',
          cursor: 'pointer'
        }
      },
      visualizeData: {
        scale: [_lt ? '#EFE9DA' : '#33394f', '#c9a84c'],
        values: vals
      },
      onRegionTooltipShow(event, tooltip, code) {
        const v = vals[code];
        const name = geoName(code) !== code ? geoName(code) : tooltip.text();
        if (v) tooltip.text(`<div style="font-weight:600;margin-bottom:3px">${geoFlag(code)} ${name}</div><div style="color:#c9a84c;font-weight:600">${fmtC(v)}</div><div style="color:#9aa">${fmt(v / T * 100, 1)}% من المحفظة</div>`, true);else tooltip.text(`<div>${geoFlag(code)} ${name}</div><div style="color:#9aa">لا استثمارات</div>`, true);
      }
    });
    if (status) status.textContent = 'مرّر على أي دولة لرؤية استثماراتك فيها · الذهب أصل عالمي غير مرتبط بدولة';
  }).catch(() => {
    if (status) status.textContent = 'تعذّر تحميل مكتبة الخريطة — تحقق من الاتصال بالإنترنت. باقي التحليل يعمل بشكل طبيعي.';
  });
}
function showPage(id, el) {
  window.syncPageChrome?.(id);
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');else document.querySelector(`[data-page="${id}"]`)?.classList.add('active');
  $('page-' + id)?.classList.add('active');
  renderAll();
  if (id === 'transactions') setTimeout(renderMonthlyChart, 50);
  if (id === 'notes') setTimeout(() => {
    adjustNotesLayout();
    renderNotes();
  }, 50);
  if (id === 'appearance') setTimeout(initAppearancePage, 50);
  if (id === 'market') setTimeout(() => {
    renderMarketTable();
    renderPriceAlerts();
  }, 50);
  if (id === 'zakat') setTimeout(zkRender, 50);
  if (id === 'geo') setTimeout(() => {
    _xrAnim = true;
    renderGeoPage();
  }, 60);
}
document.querySelectorAll('.nav-item').forEach(el => {
  if (el.id === 'navMoreBtn') return;
  el.addEventListener('click', () => showPage(el.dataset.page, el));
});
['alertModal', 'addModal', 'importModal', 'newAssetModal', 'editAssetModal', 'otherModal', 'clearModal', 'confirmModal', 'appsScriptModal', 'restoreModal', 'zkCoM', 'zkFundM', 'zkMethodM', 'zkSetM'].forEach(id => {
  $(id)?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal(id);
  });
});
const openAdd = () => {
  $('aDate').value = new Date().toISOString().slice(0, 10);
  populateAssetDropdown();
  if ($('aLinkChk')) $('aLinkChk').checked = false;
  if ($('aLinkedAcc')) $('aLinkedAcc').style.display = 'none';
  if ($('aLinkNote')) $('aLinkNote').style.display = 'none';
  updateLinkedRow();
  openModal('addModal');
};
['btnOpenAdd', 'btnOpenAdd2'].forEach(id => $(id)?.addEventListener('click', openAdd));
$('btnCloseAdd')?.addEventListener('click', () => {
  _mobileEditId = null;
  const titleEl = document.querySelector('#addModal .modal-title');
  if (titleEl) titleEl.textContent = '➕ إضافة حركة';
  const linkRow = document.getElementById('linkedAccRow');
  if (linkRow) linkRow.style.display = '';
  const aHid = $('aAsset');
  if (aHid) aHid.value = '';
  closeModal('addModal');
});
$('aAction')?.addEventListener('change', updateLinkedRow);
$('btnDoAdd')?.addEventListener('click', () => {
  const date = $('aDate').value;
  if (!date) {
    alert('اختر التاريخ');
    return;
  }
  const qty = pN($('aQty').value),
    price = pN($('aPrice').value),
    fees = pN($('aFees').value),
    rate = pN($('aRate').value) || 1;
  let total = pN($('aTotal').value);
  if (!total && qty && price) total = (qty * price + fees) * rate;
  const remarks = ($('aRemarks')?.value || '').trim();
  const currency = $('aCur')?.value || 'SAR';
  const action = $('aAction').value;
  const pivFx = pivotCur === 'SAR' ? 1 : fx[pivotCur] || 1;
  const totalSAR = total * pivFx;
  {
    const _assetSelV = $('aAsset');
    const _assetRecV = assets.find(a => a.id === _assetSelV?.value);
    if (_assetRecV && (action === 'Sell' || action === 'Withdrawal')) {
      const _grps = buildGroups();
      const _grp = _grps.find(g => g.assetName === _assetRecV.name);
      if (action === 'Sell') {
        const netQty = _grp ? _grp.buyQ - _grp.sellQ : 0;
        if (netQty <= 0.0001) {
          showToast('لا توجد وحدات متاحة للبيع في هذا الأصل', 'error');
          return;
        }
        if (qty > netQty + 0.0001) {
          showToast(`الكمية (${fmt(qty, 3)}) أكبر من المتاح (${fmt(netQty, 3)})`, 'error');
          return;
        }
      }
      if (action === 'Withdrawal') {
        const bal = _grp ? _grp.depSAR - _grp.wthSAR : 0;
        if (bal <= 0.01) {
          showToast('رصيد هذا الحساب صفر — لا يمكن السحب', 'error');
          return;
        }
        if (totalSAR > bal + 0.01) {
          showToast(`مبلغ السحب (${fmtC(totalSAR)}) أكبر من الرصيد (${fmtC(bal)})`, 'error');
          return;
        }
      }
    }
  }
  if (_mobileEditId !== null) {
    const idx = txns.findIndex(x => x.id === _mobileEditId);
    if (idx >= 0) {
      const assetSel = $('aAsset');
      const assetRec = assets.find(a => a.id === assetSel?.value) || assets.find(a => a.name === txns[idx].assetName);
      const sg = action === 'Sell' || action === 'Withdrawal' ? -1 : 1;
      txns[idx] = {
        ...txns[idx],
        date,
        assetType: assetRec?.type || txns[idx].assetType,
        assetName: assetRec?.name || txns[idx].assetName,
        action,
        qty,
        price,
        fees,
        currency,
        rate,
        totalCostSAR: sg * Math.abs(totalSAR),
        remarks
      };

      const linkedId = txns[idx].linkedTxnId;
      if (linkedId) {
        const li = txns.findIndex(x => x.id === linkedId);
        if (li >= 0) {
          const newTotalSAR = Math.abs(totalSAR);
          txns[li] = {
            ...txns[li],
            date,
            qty: newTotalSAR,
            price: 1,
            totalCostSAR: newTotalSAR,
            remarks: `مرتبطة: ${action === 'Buy' ? 'شراء' : 'بيع'} ${txns[idx].assetName}`
          };

        }
      }
    }
    if(idx>=0)portfolioAPI.updateTxns(txns.filter(x=>x.id===txns[idx].id||x.id===txns[idx].linkedTxnId));
    _mobileEditId = null;
    const titleEl = document.querySelector('#addModal .modal-title');
    if (titleEl) titleEl.textContent = '➕ إضافة حركة';
    const linkRowR = document.getElementById('linkedAccRow');
    if (linkRowR) linkRowR.style.display = '';
    const _aHid2 = $('aAsset');
    if (_aHid2) _aHid2.value = '';
    saveTxns();
    closeModal('addModal');
    renderAll();
    return;
  }
  const assetSel = $('aAsset'),
    assetRec = assets.find(a => a.id === assetSel?.value);
  if (!assetRec) {
    alert('اختر أصلاً');
    return;
  }
  const linkEnabled = $('aLinkChk')?.checked;
  const linkedAccId = $('aLinkedAcc')?.value;
  const linkedAcc = linkEnabled && linkedAccId ? assets.find(a => a.id === linkedAccId) : null;
  const mainId = Date.now();
  const sg = action === 'Sell' || action === 'Withdrawal' ? -1 : 1;
  if (linkedAcc && (action === 'Buy' || action === 'Sell')) {
    const linkId = mainId + 1;
    const linkedAction = action === 'Buy' ? 'Withdrawal' : 'Deposit';
    const mainTxn = {
      id: mainId,
      date,
      assetType: assetRec.type,
      assetName: assetRec.name,
      action,
      qty,
      price,
      fees,
      currency,
      rate,
      totalCostSAR: sg * Math.abs(totalSAR),
      remarks,
      linkedTxnId: linkId
    };
    const linkedTxn = {
      id: linkId,
      date,
      assetType: 'Cash',
      assetName: linkedAcc.name,
      action: linkedAction,
      qty: Math.abs(totalSAR),
      price: 1,
      fees: 0,
      currency: pivotCur,
      rate: pivFx,
      totalCostSAR: Math.abs(totalSAR),
      remarks: `مرتبطة: ${action === 'Buy' ? 'شراء' : 'بيع'} ${assetRec.name}`,
      linkedTxnId: mainId
    };
    txns.unshift(linkedTxn);
    txns.unshift(mainTxn);
    portfolioAPI.addTxns([mainTxn, linkedTxn]);
  } else {
    const txn = {
      id: mainId,
      date,
      assetType: assetRec.type,
      assetName: assetRec.name,
      action,
      qty,
      price,
      fees,
      currency,
      rate,
      totalCostSAR: sg * Math.abs(totalSAR),
      remarks
    };
    txns.unshift(txn);
    portfolioAPI.addTxn(txn);
  }
  const _aHid = $('aAsset');
  if (_aHid) _aHid.value = '';
  saveTxns();
  closeModal('addModal');
  renderAll();
});
['btnOpenImport', 'btnOpenImport2'].forEach(id => $(id)?.addEventListener('click', () => openModal('importModal')));
$('btnCloseImport')?.addEventListener('click', () => {
  closeModal('importModal');
  $('importArea').value = '';
  $('importMsg').textContent = '';
});
$('btnDoImport')?.addEventListener('click', () => {
  const raw = $('importArea').value.trim();
  if (!raw) {
    alert('الصق البيانات');
    return;
  }
  const lines = raw.split('\n').filter(l => l.trim());
  let added = 0,
    skip = 0;
  const newT = [];
  lines.forEach((line, i) => {
    const cols = line.split('\t').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length < 9) {
      skip++;
      return;
    }
    const [dr, atype, aname, action, qr, pr, fr, cur, rater, ...rest] = cols;
    if (dr.toLowerCase() === 'date') return;
    const date = pDate(dr);
    if (!date) {
      skip++;
      return;
    }
    if (!['Property', 'Gold', 'Stock', 'Cash'].includes(atype) || !['Buy', 'Sell', 'Deposit', 'Withdrawal'].includes(action)) {
      skip++;
      return;
    }
    const remarks = rest[1] || '';
    const rawTotal = pN(rest[0] || '0');
    newT.push({
      id: Date.now() + i + Math.random(),
      date,
      assetType: atype,
      assetName: aname || '?',
      action,
      qty: pN(qr),
      price: pN(pr),
      fees: pN(fr),
      currency: cur || 'SAR',
      rate: pN(rater) || 1,
      totalCostSAR: rawTotal,
      remarks
    });
    added++;
    if (aname && !assets.find(a => a.name === aname)) {
      assets.push({
        id: aname,
        name: aname,
        type: atype,
        currency: cur || 'SAR',
        yahooSym: '',
        tvSym: ''
      });
      saveAssets();
    }
  });
  const exist = new Set(txns.map(t => `${t.date}|${t.assetName}|${t.action}|${t.totalCostSAR}`));
  const fresh = newT.filter(t => !exist.has(`${t.date}|${t.assetName}|${t.action}|${t.totalCostSAR}`));
  const msg = $('importMsg');
  if (!fresh.length) {
    if (msg) msg.innerHTML = '<span style="color:#fb923c">⚠️ لا توجد صفوف جديدة</span>';
    return;
  }
  txns = [...txns, ...fresh].sort((a, b) => b.date.localeCompare(a.date));
  portfolioAPI.addTxns(fresh);
  saveTxns();
  if (msg) msg.innerHTML = `<span style="color:var(--green)">تم استيراد ${fresh.length} حركة${skip ? ` · تجاهل ${skip}` : ''}</span>`;
  setTimeout(() => {
    closeModal('importModal');
    $('importArea').value = '';
    if (msg) msg.textContent = '';
    renderAll();
  }, 1400);
});
function updateScriptUrl() {
  showToast("\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0645\u062A\u0635\u0644\u0629 \u0628\u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0645\u0633\u062A\u0642\u0644\u0629", "info");
}
function showAppsScriptGuide(newAssetYahooSym) {
  showToast("\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0645\u062A\u0635\u0644\u0629 \u0628\u062E\u062F\u0645\u0629 \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0645\u0633\u062A\u0642\u0644\u0629", "info");
}
$('btnOpenNewAsset')?.addEventListener('click', () => {
  $('naName').value = '';
  $('naYahoo').value = '';
  $('naTv').value = '';
  $('naType').value = 'Stock';
  $('naCurrency').value = 'USD';
  onNewAssetTypeChange();
  openModal('newAssetModal');
});
$('btnCloseNewAsset')?.addEventListener('click', () => closeModal('newAssetModal'));
$('btnDoNewAsset')?.addEventListener('click', () => {
  const name = $('naName').value.trim();
  if (!name) {
    alert('أدخل الاسم');
    return;
  }
  if (assets.find(a => a.name === name)) {
    alert('موجود مسبقاً');
    return;
  }
  const naType = $('naType').value;
  const naYahoo = $('naYahoo').value.trim();
  assets.push({
    id: name,
    name,
    type: naType,
    currency: $('naCurrency').value,
    yahooSym: naYahoo,
    tvSym: $('naTv').value.trim(),
    isGold: naType === 'Gold'
  });
  saveAssets();
  closeModal('newAssetModal');
  renderAll();
});
$('btnCloseEditAsset')?.addEventListener('click', () => closeModal('editAssetModal'));
$('btnDoEditAsset')?.addEventListener('click', () => {
  const id = $('eaId').value,
    idx = assets.findIndex(a => a.id === id);
  if (idx < 0) return;
  assets[idx] = {
    ...assets[idx],
    name: $('eaName').value.trim(),
    type: $('eaType').value,
    currency: $('eaCurrency').value,
    yahooSym: $('eaYahoo').value.trim(),
    tvSym: $('eaTv').value.trim(),
    isGold: $('eaType').value === 'Gold'
  };
  saveAssets();
  closeModal('editAssetModal');
  renderAll();
});
function otUpdateSar() {
  const cur = $('otCurrency')?.value || 'SAR';
  const rateRow = $('otRateRow'),
    sarPrev = $('otSarPreview');
  const val = parseFloat($('otValue')?.value) || 0;
  if (cur === 'SAR') {
    if (rateRow) rateRow.style.display = 'none';
    if (sarPrev) sarPrev.textContent = '';
  } else {
    const liveFx = fx[cur] || typeof FX_RATES !== 'undefined' && FX_RATES?.[cur];
    const rateInp = $('otRate');
    if (liveFx && rateInp && !rateInp.value) rateInp.value = fmt(liveFx, 4);
    if (rateRow) rateRow.style.display = '';
    const rate = parseFloat($('otRate')?.value) || liveFx || 1;
    const sarVal = val * rate;
    if (sarPrev) sarPrev.textContent = sarVal > 0 ? '≈ ' + fmt(sarVal, 0) + ' ﷼' : '';
  }
}
$('btnOpenOther')?.addEventListener('click', () => {
  $('otName').value = '';
  $('otValue').value = '';
  $('otCurrency').value = 'SAR';
  $('otRate').value = '';
  $('otRateRow').style.display = 'none';
  $('otSarPreview').textContent = '';
  $('otType').value = 'realized';
  $('otEditId').value = '';
  $('otModalTitle').innerHTML = '<i class="ti ti-layout-list"></i> إضافة مصدر آخر';
  openModal('otherModal');
});
$('btnCloseOther')?.addEventListener('click', () => closeModal('otherModal'));
$('btnDoOther')?.addEventListener('click', () => {
  const name = $('otName').value.trim(),
    rawVal = parseFloat($('otValue').value) || 0;
  if (!name || !rawVal) {
    alert('أدخل الوصف والقيمة');
    return;
  }
  const cur = $('otCurrency').value || 'SAR';
  let sarVal = rawVal;
  if (cur !== 'SAR') {
    const rate = parseFloat($('otRate').value) || fx[cur] || 1;
    sarVal = rawVal * rate;
  }
  const editId = pN($('otEditId').value);
  const obj = {
    name,
    value: sarVal,
    rawValue: rawVal,
    rawCur: cur,
    type: $('otType').value
  };
  if (editId) {
    const idx = otherSrc.findIndex(s => s.id === editId);
    if (idx >= 0) otherSrc[idx] = {
      ...otherSrc[idx],
      ...obj
    };
  } else {
    otherSrc.push({
      id: Date.now(),
      ...obj
    });
  }
  saveOther();
  closeModal('otherModal');
  renderAll();
});
let pendingDeleteFn = null;
function getClearTargets(range, from, to) {
  const sorted = [...txns].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  switch (range) {
    case 'all':
      return sorted;
    case 'last':
      return sorted.slice(0, 1);
    case 'custom':
      if (!from || !to) return [];
      return sorted.filter(t => t.date && t.date >= from && t.date <= to);
    default:
      return [];
  }
}
function updateClearPreview() {
  const range = document.querySelector('input[name="clearRange"]:checked')?.value;
  const btn = $('btnDoClear'),
    prev = $('clearPreview'),
    cdDiv = $('customDateRange');
  if (cdDiv) cdDiv.style.display = range === 'custom' ? 'block' : 'none';
  if (!range) {
    prev.textContent = 'اختر خياراً أولاً';
    btn.disabled = true;
    btn.style.opacity = '.35';
    btn.style.pointerEvents = 'none';
    return;
  }
  const from = $('clearFrom')?.value || '',
    to = $('clearTo')?.value || '';
  if (range === 'custom' && (!from || !to)) {
    prev.textContent = 'اختر تاريخ البداية والنهاية';
    btn.disabled = true;
    btn.style.opacity = '.35';
    btn.style.pointerEvents = 'none';
    return;
  }
  if (range === 'custom' && from > to) {
    prev.textContent = 'تاريخ البداية يجب أن يكون قبل النهاية';
    btn.disabled = true;
    btn.style.opacity = '.35';
    btn.style.pointerEvents = 'none';
    return;
  }
  const targets = getClearTargets(range, from, to);
  if (!targets.length) {
    prev.textContent = 'لا توجد حركات';
    btn.disabled = true;
    btn.style.opacity = '.35';
    btn.style.pointerEvents = 'none';
  } else {
    const label = range === 'last' ? 'آخر حركة' : range === 'all' ? 'كل الحركات' : `من ${from} إلى ${to}`;
    prev.textContent = `سيتم حذف ${targets.length} حركة — ${label}`;
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
  }
}
$('btnOpenClear')?.addEventListener('click', () => {
  document.querySelectorAll('input[name="clearRange"]').forEach(r => {
    r.checked = false;
    r.addEventListener('change', updateClearPreview);
  });
  $('clearFrom')?.addEventListener('change', updateClearPreview);
  $('clearTo')?.addEventListener('change', updateClearPreview);
  const btn = $('btnDoClear');
  btn.disabled = true;
  btn.style.opacity = '.35';
  btn.style.pointerEvents = 'none';
  $('clearPreview').textContent = 'اختر خياراً أولاً';
  const cdDiv = $('customDateRange');
  if (cdDiv) cdDiv.style.display = 'none';
  openModal('clearModal');
});
$('btnCloseClear')?.addEventListener('click', () => closeModal('clearModal'));
$('btnDoClear')?.addEventListener('click', () => {
  const range = document.querySelector('input[name="clearRange"]:checked')?.value;
  const from = $('clearFrom')?.value || '',
    to = $('clearTo')?.value || '';
  if (!range) return;
  const targets = getClearTargets(range, from, to);
  if (!targets.length) return;
  const label = range === 'last' ? 'آخر حركة' : range === 'all' ? 'كل الحركات' : `من ${from} إلى ${to}`;
  $('confirmMsg').textContent = `سيتم حذف ${targets.length} حركة (${label}) مع حفظها في سلة المحذوفات.`;
  pendingDeleteFn = () => {
    const ids = new Set(targets.map(t => t.id));
    for(const t of txns)if(ids.has(t.id)&&t.linkedTxnId)ids.add(t.linkedTxnId);
    portfolioAPI.archiveDeletedTxns(txns.filter(t=>ids.has(t.id)));
    txns = txns.filter(t => !ids.has(t.id));
    saveTxns();
    closeModal('confirmModal');
    closeModal('clearModal');
    renderAll();
  };
  closeModal('clearModal');
  openModal('confirmModal');
});
$('btnConfirmDel')?.addEventListener('click', () => {
  if (pendingDeleteFn) pendingDeleteFn();
});
$('btnCancelConfirm')?.addEventListener('click', () => {
  pendingDeleteFn = null;
  closeModal('confirmModal');
  openModal('clearModal');
});
$('btnClear')?.addEventListener('click', () => {
  $('srch').value = '';
  ['fType', 'fAction', 'fMonth'].forEach(id => {
    const el = $(id);
    if (!el) return;
    [...el.options].forEach(o => o.selected = false);
  });
  renderTxnTable();
});
const _msState = {
  fMonth: new Set(),
  fType: new Set(),
  fAction: new Set()
};
const _msDefault = {
  fMonth: 'كل الأشهر',
  fType: 'كل الأنواع',
  fAction: 'كل العمليات'
};
let _msOpen = null;
function msToggle(id) {
  if (_msOpen && _msOpen !== id) {
    msClose(_msOpen);
  }
  const menu = document.getElementById('msMenu-' + id);
  if (!menu) return;
  const isOpen = menu.style.display !== 'none';
  if (isOpen) {
    msClose(id);
  } else {
    if (id === 'fMonth') msBuildMonths();
    if (menu.parentElement !== document.body) document.body.appendChild(menu);
    const btn = document.getElementById('msBtn-' + id);
    if (btn) {
      const r = btn.getBoundingClientRect();
      menu.style.top = r.bottom + 5 + 'px';
      menu.style.right = window.innerWidth - r.right + 'px';
    }
    menu.style.display = 'block';
    _msOpen = id;
  }
}
function msClose(id) {
  const menu = document.getElementById('msMenu-' + id);
  if (menu) menu.style.display = 'none';
  if (_msOpen === id) _msOpen = null;
}
function msSelectSingle(id, val) {
  _msState[id].clear();
  _msState[id].add(val);
  msRefreshItems(id);
  msUpdateLabel(id);
  renderTxnTable();
}
function msToggleCheck(id, val, cb) {
  if (cb.checked) _msState[id].add(val);else _msState[id].delete(val);
  msRefreshItems(id);
  msUpdateLabel(id);
  renderTxnTable();
}
function msRefreshItems(id) {
  const menu = document.getElementById('msMenu-' + id);
  if (!menu) return;
  menu.querySelectorAll('.ms-item').forEach(el => {
    const val = el.dataset.val;
    const sel = _msState[id].has(val);
    el.classList.toggle('sel', sel);
    const chk = el.querySelector('.ms-chk');
    if (chk) chk.checked = sel;
  });
}
function msUpdateLabel(id) {
  const state = _msState[id];
  const lbl = document.getElementById('msLabel-' + id);
  const btn = document.getElementById('msBtn-' + id);
  if (!lbl || !btn) return;
  if (state.size === 0) {
    lbl.textContent = _msDefault[id];
    btn.classList.remove('has-sel');
  } else {
    lbl.textContent = [...state].join('، ');
    btn.classList.add('has-sel');
  }
}
function msBuildMonths() {
  const menu = document.getElementById('msMenu-fMonth');
  if (!menu) return;
  const months = [...new Set(txns.map(t => (t.date || '').slice(0, 7)).filter(Boolean))].sort().reverse();
  const names = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  menu.innerHTML = months.map(m => {
    const [y, mo] = m.split('-');
    const label = `${names[parseInt(mo) - 1] || mo} ${y}`;
    const sel = _msState.fMonth.has(m);
    return `<div class="ms-item${sel ? ' sel' : ''}" data-val="${m}" onclick="msSelectSingle('fMonth','${m}')">
      <input type="checkbox" class="ms-chk" ${sel ? 'checked' : ''} onclick="event.stopPropagation();msToggleCheck('fMonth','${m}',this)">
      ${label}
    </div>`;
  }).join('');
}
document.addEventListener('click', function (e) {
  if (!_msOpen) return;
  const wrap = document.getElementById('msWrap-' + _msOpen);
  if (wrap && !wrap.contains(e.target)) msClose(_msOpen);
});
function msClearAll() {
  ['fMonth', 'fType', 'fAction'].forEach(id => {
    _msState[id].clear();
    msUpdateLabel(id);
    msRefreshItems(id);
  });
}
$('srch')?.addEventListener('input', () => renderTxnTable());
$('btnClear')?.addEventListener('click', () => {
  $('srch').value = '';
  msClearAll();
  renderTxnTable();
});
function populateMonthSelect() {
  if (_msOpen === 'fMonth') msBuildMonths();
}
$('dateBadge').textContent = new Date().toLocaleDateString('ar-AE', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
console.log('=== DEBUG ===');
console.log('_cloudMode:', _cloudMode);
console.log('txns in localStorage:', localStorage.getItem('pf_txns') ? JSON.parse(localStorage.getItem('pf_txns')).length + ' txns' : 'none');
function updateDebug(msg) {
  const el = document.getElementById('dbMsg');
  if (el) el.textContent = msg;
}
function updateDebugMode() {
  const el = document.getElementById('dbMode');
  if (el) el.textContent = _cloudMode ? '✅ قاعدة البيانات' : '📦 Local';
  const el2 = document.getElementById('dbTxns');
  if (el2) el2.textContent = txns.length;
}
function setRetireGoal(v) {
  const n = parseFloat(v);
  if (n > 0) {
    retireGoal = n;
    portfolioAPI.saveSetting('retireGoal', n);
    renderAll();
  }
}
['Property', 'Gold', 'Stock', 'Cash', 'Emergency'].forEach(k => {
  if (!catGoals[k]) catGoals[k] = 0;
});
function renderRetireGoal(totalCur, byType, otherTotal) {
  const pct = Math.min(100, totalCur / retireGoal * 100);
  const remaining = Math.max(0, retireGoal - totalCur);
  const bar = $('retireBar');
  if (bar) bar.style.width = pct.toFixed(1) + '%';
  const _ring = $('retireRing');
  if (_ring) {
    const _c = 226.2;
    _ring.style.strokeDashoffset = (_c * (1 - Math.min(100, pct) / 100)).toFixed(1);
  }
  animNum('retirePct', pct, v => v.toFixed(1) + '%');
  st('retireGoalFmt', CUR_SYMS[baseCur] + ' ' + fmt(retireGoal * sarToBase(1)));
  st('retireRemaining', fmtC(remaining));
  renderDashPulse();
}
function renderGoalsPage(totalCur, byType, otherTotal) {
  const cats = [{
    key: 'Property',
    label: 'الأملاك',
    cur: byType.Property.cur
  }, {
    key: 'Gold',
    label: 'الذهب',
    cur: byType.Gold.cur
  }, {
    key: 'Stock',
    label: 'الأسهم',
    cur: byType.Stock.cur
  }, {
    key: 'Cash',
    label: 'النقدي',
    cur: byType.Cash.cur
  }];

  // الهدف الكلي = مجموع أهداف الفئات
  const sumGoals = cats.reduce((a, c) => a + (catGoals[c.key] || 0), 0);
  if (sumGoals > 0 && sumGoals !== retireGoal) {
    retireGoal = sumGoals;

  }
  const totalPct = retireGoal > 0 ? totalCur / retireGoal * 100 : 0;
  const remaining = Math.max(0, retireGoal - totalCur);
  if (retireGoal > 0) animNum('gTotalPct', totalPct, v => v.toFixed(1) + '%');else st('gTotalPct', '—');
  st('gTotalGoal', fmtC(retireGoal));
  animNum('gTotalCur', totalCur, fmtC);
  st('gTotalRem', fmtC(remaining));
  const gb = $('gTotalBar');
  if (gb) gb.style.width = Math.min(100, totalPct).toFixed(1) + '%';
  const gi = $('gGoalInput');
  if (gi) gi.value = '';
  const grid = $('catGoalsGrid');
  if (!grid) return;
  // تحديث الحلقة + الرقائق
  const _ring = $('gTotalRing');
  if (_ring) {
    const _c = 263.9;
    _ring.style.strokeDashoffset = (_c * (1 - Math.min(100, totalPct) / 100)).toFixed(1);
  }
  st('gChipPct', retireGoal > 0 ? totalPct.toFixed(0) + '%' : '—');
  const _done = cats.filter(c => {
    const g = catGoals[c.key] || 0;
    return g > 0 && c.cur >= g;
  }).length;
  const _withGoal = cats.filter(c => (catGoals[c.key] || 0) > 0).length;
  st('gChipDone', _withGoal > 0 ? _done + ' / ' + _withGoal : '—');
  st('gChipRem', fmtC(remaining));
  grid.innerHTML = '<div class="xr-card">' + cats.map(cat => {
    const goal = catGoals[cat.key] || 0;
    const pp = goal > 0 ? cat.cur / goal * 100 : 0;
    const barPct = Math.min(100, pp);
    const exceeded = pp > 100;
    const icon = {
      Property: 'ti-building',
      Gold: 'ti-coin',
      Stock: 'ti-chart-bar',
      Cash: 'ti-cash'
    }[cat.key] || 'ti-circle';
    return `<div class="xr-row" style="cursor:pointer" onclick="openGoalEdit('${cat.key}','${cat.label}',${goal})">
        <div class="nm"><i class="ti ${icon}" style="color:var(--gold);font-size:14px"></i> ${cat.label}</div>
        <div class="xr-bar"><div style="width:${goal > 0 ? barPct : 0}%;${exceeded ? 'background:var(--green)' : ''}"></div></div>
        <div class="pct" style="${exceeded ? 'color:var(--green)' : ''}">${goal > 0 ? pp.toFixed(0) + '%' : '+ هدف'}</div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);padding:0 0 8px;margin-bottom:6px;${cat.key !== 'Cash' ? 'border-bottom:1px solid var(--wline)' : ''}">
        <span>الحالي: <b style="color:var(--gold);font-weight:600;font-family:inherit">${fmtC(cat.cur)}</b></span>
        ${goal > 0 ? `<span>${exceeded ? 'تجاوز' : 'متبقي'}: <b style="color:${exceeded ? 'var(--green)' : 'var(--muted)'};font-weight:600;font-family:inherit">${fmtC(Math.abs(goal - cat.cur))}</b></span>` : `<span style="color:var(--gold)">حدّد هدفاً ←</span>`}
      </div>`;
  }).join('') + '</div>';
}
// btnRefreshHome removed — using globalRefresh
document.querySelectorAll('.cur-btn').forEach(b => b.classList.toggle('active', b.dataset.cur === baseCur));
renderAll();
async function refreshMarket() {
  const btn = $('btnRefreshMarket'),
    spin = $('spinMarket');
  if (btn) {
    btn.disabled = true;
  }
  if (spin) spin.className = 'spinning';
  $('marketStatus').textContent = 'جاري جلب البيانات...';
  const stockSyms = assets.filter(a => a.yahooSym && a.type !== 'Property' && a.type !== 'Cash').map(a => a.yahooSym);
  const allSyms = [...new Set(['GBPSAR=X', 'HKDSAR=X', 'USDSAR=X', 'JODSAR=X', ...stockSyms])];
  try {
    let raw;
    raw = await new Promise((res, rej) => {
      portfolioAPI.withSuccessHandler(res).withFailureHandler(rej).getPrices(allSyms.join(','));
    });
    const fxMap = {
      'GBPSAR=X': 'GBP',
      'HKDSAR=X': 'HKD',
      'USDSAR=X': 'USD',
      'JODSAR=X': 'JOD'
    };
    Object.entries(fxMap).forEach(([sym, cur]) => {
      const v = raw[sym];
      const p = typeof v === 'object' ? v?.price : v;
      if (p) {
        fx[cur] = p;
        if (cur === 'GBP') fx.GBp = p / 100;
      }
    });
    marketData = raw;
    const firstSym = Object.keys(raw).find(k => !k.includes('SAR=X') && !k.includes('HKD'));
    if (firstSym) console.log('Sample data for', firstSym, ':', JSON.stringify(raw[firstSym]));
    renderMarketTable();
    renderPortfolio();
    const good=Object.values(raw).filter(x=>x&&Number.isFinite(x.price)).length; $('marketStatus').textContent = good ? 'تم جلب '+good+' أسعار — '+new Date().toLocaleTimeString('ar-EG') : 'لا توجد أسعار متاحة — القيم بالتكلفة';
  } catch (e) {
    $('marketStatus').textContent = 'خطأ: ' + e.message;
  }
  if (btn) {
    btn.disabled = false;
  }
  if (spin) spin.className = '';
}
let marketOrder = [];
let marketHidden = new Set();
function initMarketOrder() {
  const allMkt = assets.filter(a => a.yahooSym && a.type !== 'Property' && a.type !== 'Cash');
  if (!marketOrder.length) {
    marketOrder = allMkt.map(a => a.id);
  } else {
    allMkt.forEach(a => {
      if (!marketOrder.includes(a.id)) marketOrder.push(a.id);
    });
    marketOrder = marketOrder.filter(id => allMkt.find(a => a.id === id));
  }
}
function toggleMarketManage() {
  const panel = $('marketManagePanel');
  if (!panel) return;
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) renderMarketManageList();
}
function renderMarketManageList() {
  const list = $('marketManageList');
  if (!list) return;
  initMarketOrder();
  const allMkt = assets.filter(a => a.yahooSym && a.type !== 'Property' && a.type !== 'Cash');
  list.innerHTML = marketOrder.map((id, idx) => {
    const a = allMkt.find(x => x.id === id);
    if (!a) return '';
    const hidden = marketHidden.has(id);
    return `<div draggable="true" data-id="${id}" data-idx="${idx}"
      ondragstart="mktDragStart(event)" ondragover="mktDragOver(event)" ondrop="mktDrop(event)" ondragend="mktDragEnd(event)"
      style="display:flex;align-items:center;gap:10px;background:var(--surf2);border-radius:10px;padding:8px 12px;cursor:grab;user-select:none;opacity:${hidden ? '.4' : '1'}">
      <i class="ti ti-grip-vertical" style="color:var(--muted);font-size:16px;flex-shrink:0"></i>
      <div style="flex:1;font-size:13px;font-weight:400">${a.name}</div>
      <div style="font-size:11px;color:var(--muted);font-family:inherit">${a.yahooSym}</div>
      <button onclick="toggleMarketHide('${id}')" style="border:none;background:transparent;cursor:pointer;font-size:16px;color:${hidden ? 'var(--muted)' : 'var(--text)'};padding:2px 4px">
        <i class="ti ti-${hidden ? 'eye-off' : 'eye'}"></i>
      </button>
    </div>`;
  }).join('');
}
let _mktDragId = null,
  _mktDragEl = null;
function mktDragStart(e) {
  _mktDragId = e.currentTarget.dataset.id;
  _mktDragEl = e.currentTarget;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', _mktDragId);
  setTimeout(() => {
    if (_mktDragEl) _mktDragEl.style.opacity = '.4';
  }, 0);
}
function mktDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';
  document.querySelectorAll('[data-id]').forEach(el => el.style.borderTop = '');
  e.currentTarget.style.borderTop = '2px solid var(--gold)';
}
function mktDragEnd(e) {
  if (_mktDragEl) _mktDragEl.style.opacity = '1';
  document.querySelectorAll('[data-id]').forEach(el => el.style.borderTop = '');
  _mktDragEl = null;
}
function mktDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.querySelectorAll('[data-id]').forEach(el => el.style.borderTop = '');
  if (_mktDragEl) _mktDragEl.style.opacity = '1';
  const targetId = e.currentTarget.dataset.id;
  if (!_mktDragId || _mktDragId === targetId) return;
  const fi = marketOrder.indexOf(_mktDragId),
    ti = marketOrder.indexOf(targetId);
  if (fi < 0 || ti < 0) return;
  marketOrder.splice(fi, 1);
  marketOrder.splice(ti, 0, _mktDragId);
  _mktDragId = null;
  _mktDragEl = null;
  renderMarketManageList();
}
function toggleMarketHide(id) {
  if (marketHidden.has(id)) marketHidden.delete(id);else marketHidden.add(id);
  renderMarketManageList();
}
function saveMarketOrder() {
  portfolioAPI.saveSetting('marketOrder', JSON.stringify(marketOrder));
  portfolioAPI.saveSetting('marketHidden', JSON.stringify([...marketHidden]));
  $('marketManagePanel').style.display = 'none';
  renderMarketTable();
  showToast('تم حفظ ترتيب السوق', 'success');
}
function loadMarketSettings() {
  return;
  try {
    const o = localStorage.getItem('pf_market_order');
    if (o) marketOrder = JSON.parse(o);
    const h = localStorage.getItem('pf_market_hidden');
    if (h) marketHidden = new Set(JSON.parse(h));
  } catch (e) {}
}
let mktFilter = 'all',
  mktOpenRow = null;
function setMktFilter(f) {
  mktFilter = f;
  renderMarketTable();
}
function toggleMktRow(rowEl) {
  if (!rowEl) return;
  const id = rowEl.getAttribute('data-mid');
  const wasOpen = rowEl.classList.contains('open');
  document.querySelectorAll('#marketTable .mkt-row.open').forEach(r => {r.classList.remove('open');r.querySelector('.quote-head')?.setAttribute('aria-expanded','false');});
  if (wasOpen) {
    mktOpenRow = null;
    return;
  }
  rowEl.classList.add('open');
  mktOpenRow = id;
  rowEl.querySelector('.quote-head')?.setAttribute('aria-expanded','true');
}
function mktQuickAlert(name) {
  openAlertModal(name);
}
function openAlertModal(name) {
  if (name) {
    const sel = $('alAsset');
    if (sel) sel.value = name;
  }
  const ov = $('alertModal');
  if (ov && !ov._bk) {
    ov._bk = 1;
    ov.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal('alertModal');
    });
  }
  openModal('alertModal');
  setTimeout(() => {
    const p = $('alPrice');
    if (p) p.focus();
  }, 180);
}
function submitAlertModal() {
  const n = priceAlerts.length;
  addPriceAlert();
  if (priceAlerts.length > n) closeModal('alertModal');
}
function renderMarketTable() {
  const el = $('marketTable');
  if (!el) return;
  try {
    renderDashPulse();
  } catch (_e) {}
  const grps = buildGroups();
  const _allStockAssets = assets.filter(a => a.yahooSym && a.type !== 'Property' && a.type !== 'Cash');
  initMarketOrder();
  const stockAssets = marketOrder.map(id => _allStockAssets.find(a => a.id === id)).filter(a => a && !marketHidden.has(a.id));
  if (!stockAssets.length) {
    el.innerHTML = '<div class="empty">لا توجد أسهم أو صناديق مضافة</div>';
    return;
  }
  const rows = stockAssets.map(a => {
    const raw = marketData[a.yahooSym];
    const isGoldAsset = a.isGold || a.type === 'Gold';
    const cur = typeof raw === 'object' && raw?.currency || a.currency || 'USD';
    const price = typeof raw === 'object' ? raw?.price : raw;
    const change = typeof raw === 'object' ? raw?.change ?? null : null;
    const changePct = typeof raw === 'object' ? raw?.changePct ?? null : null;
    const high52 = typeof raw === 'object' ? raw?.high52 ?? null : null;
    const low52 = typeof raw === 'object' ? raw?.low52 ?? null : null;
    const ma200 = typeof raw === 'object' ? raw?.ma200 ?? null : null;
    const aname = typeof raw === 'object' ? raw?.name || null : null;
    const grp = grps.find(g => g.assetName === a.name);
    const netQ = grp ? grp.buyQ - grp.sellQ : 0;
    const isOwned = netQ > 0;
    let displayPrice = '—',
      displayCur = '';
    if (price != null) {
      if (isGoldAsset) {
        const gramSAR = (price * 0.997 * 0.02055 - 5) / 0.188;
        const gramDisp = gramSAR * sarToBase(1);
        displayPrice = fmt(gramDisp, 1) + ' ' + CUR_SYMS[baseCur] + '/غ';
      } else {
        displayPrice = fmt(price, 2);
        displayCur = cur;
      }
    }
    let pnlSAR = null,
      pnlPct = null;
    if (isOwned && grp && price != null) {
      const avgCostSAR = grp.fifoAvgCost || 0;
      let curPriceSAR;
      if (isGoldAsset) {
        curPriceSAR = (price * 0.997 * 0.02055 - 5) / 0.188;
      } else {
        curPriceSAR = toSAR(price, cur);
      }
      const curValSAR = netQ * curPriceSAR;
      const costValSAR = netQ * avgCostSAR;
      pnlSAR = curValSAR - costValSAR;
      pnlPct = costValSAR > 0 ? pnlSAR / costValSAR * 100 : null;
    }
    const avgCostSAR = grp && (grp.fifoAvgCost || 0);
    let avgDisplay = '—';
    if (isOwned && avgCostSAR) {
      if (isGoldAsset) {
        avgDisplay = fmt(avgCostSAR * sarToBase(1), 1) + ' ' + CUR_SYMS[baseCur] + '/غ';
      } else {
        const fxRate = fx[cur] || 1;
        const avgInCur = cur === 'GBp' ? avgCostSAR / fx.GBP * 100 : cur === 'SAR' ? avgCostSAR : avgCostSAR / fxRate;
        avgDisplay = fmt(avgInCur, 2) + ' ' + cur + '/وحدة';
      }
    }
    let ma200Display = '—';
    if (ma200 != null) {
      if (isGoldAsset) {
        const gramMA = (ma200 * 0.997 * 0.02055 - 5) / 0.188;
        ma200Display = fmt(gramMA * sarToBase(1), 1) + ' ' + CUR_SYMS[baseCur] + '/غ';
      } else {
        ma200Display = fmt(ma200, 2) + ' ' + cur;
      }
    }
    let bar52 = '';
    if (price && high52 && low52 && high52 > low52) {
      const pct = Math.min(100, Math.max(0, (price - low52) / (high52 - low52) * 100));
      const barColor = pct > 66 ? 'var(--green)' : pct > 33 ? 'var(--gold)' : 'var(--red)';
      const lo = isGoldAsset ? fmt((low52 * 0.997 * 0.02055 - 5) / 0.188 * sarToBase(1), 1) + CUR_SYMS[baseCur] : fmt(low52, 2);
      const hi = isGoldAsset ? fmt((high52 * 0.997 * 0.02055 - 5) / 0.188 * sarToBase(1), 1) + CUR_SYMS[baseCur] : fmt(high52, 2);
      bar52 = `<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-bottom:2px"><span>${lo}</span><span>${hi}</span></div><div class="mkt-bar"><div class="mkt-bar-fill" style="width:${pct.toFixed(0)}%;background:${barColor}"></div></div>`;
    }
    const pnlClass = pnlSAR != null ? pnlSAR >= 0 ? 'mkt-pos' : 'mkt-neg' : '';
    const chgClass = changePct != null ? changePct >= 0 ? 'mkt-pos' : 'mkt-neg' : '';
    return `<tr class="${isOwned ? 'mkt-owned' : ''}">
      <td>
        <div style="font-weight:500">${a.name}${isOwned ? '<span style="font-size:9px;background:rgba(201,168,76,.15);color:var(--gold);padding:1px 6px;border-radius:10px;margin-right:6px">مشتري</span>' : ''}</div>
        ${aname ? `<div style="font-size:10px;color:var(--muted);margin-top:2px">${aname}</div>` : ''}
      </td>
      <td class="mkt-num" style="font-weight:600;color:var(--gold)">${displayPrice}${displayCur ? ` <span style="font-size:10px;color:var(--muted)">${displayCur}</span>` : ''}${isGoldAsset ? `<div class="quote-ounce-desktop">الأونصة <b dir="ltr">${price != null ? '$' + fmt(price, 2) + ' USD' : '—'}</b></div>` : ''}</td>
      <td class="mkt-num ${chgClass}">${changePct != null ? (changePct >= 0 ? '▲ +' : '▼ ') + fmt(Math.abs(changePct), 2) + '%' : '—'}</td>
      <td>${bar52 || '—'}</td>
      <td class="mkt-num" style="color:var(--muted)">${ma200Display}</td>
      <td class="mkt-num" style="color:var(--muted)">${isOwned ? fmt(netQ, isGoldAsset ? 1 : 2) + (isGoldAsset ? ' غ' : ' وحدة') : '—'}</td>
      <td class="mkt-num" style="color:var(--muted)">${avgDisplay}</td>
      <td class="mkt-num ${pnlClass}">${pnlSAR != null ? (pnlSAR >= 0 ? '▲ ' : '▼ ') + fmtC(Math.abs(pnlSAR)) + '<br><span style="font-size:10px">' + (pnlPct != null ? (pnlPct >= 0 ? '+' : '') + fmt(pnlPct, 1) + '%' : '') + '</span>' : '—'}</td>
    </tr>`;
  }).join('');
  if (isMobile()) {
    const items = stockAssets.map(a => {
      const raw = marketData[a.yahooSym];
      const isGoldAsset = a.isGold || a.type === 'Gold';
      const cur = typeof raw === 'object' && raw?.currency || a.currency || 'USD';
      const price = typeof raw === 'object' ? raw?.price : raw;
      const changePct = typeof raw === 'object' ? raw?.changePct ?? null : null;
      const high52 = typeof raw === 'object' ? raw?.high52 ?? null : null;
      const low52 = typeof raw === 'object' ? raw?.low52 ?? null : null;
      const ma200 = typeof raw === 'object' ? raw?.ma200 ?? null : null;
      const aname = typeof raw === 'object' ? raw?.name || null : null;
      const grp = grps.find(g => g.assetName === a.name);
      const netQ = grp ? grp.buyQ - grp.sellQ : 0;
      const isOwned = netQ > 0;
      let displayPrice = '—',
        displayCur = '';
      if (price != null) {
        if (isGoldAsset) {
          displayPrice = fmt((price * 0.997 * 0.02055 - 5) / 0.188 * sarToBase(1), 1) + ' ' + CUR_SYMS[baseCur] + '/غ';
        } else {
          displayPrice = fmt(price, 2);
          displayCur = cur;
        }
      }
      let ma200Txt = '—';
      if (ma200 != null) {
        if (isGoldAsset) ma200Txt = fmt((ma200 * 0.997 * 0.02055 - 5) / 0.188 * sarToBase(1), 1) + ' ' + CUR_SYMS[baseCur] + '/غ';else ma200Txt = fmt(ma200, 2) + ' ' + cur;
      }
      const avgCostSAR = grp && (grp.fifoAvgCost || 0);
      let avgTxt = '—';
      if (isOwned && avgCostSAR) {
        if (isGoldAsset) avgTxt = fmt(avgCostSAR * sarToBase(1), 1) + ' ' + CUR_SYMS[baseCur] + '/غ';else {
          const fxRate = fx[cur] || 1;
          const avgInCur = cur === 'GBp' ? avgCostSAR / fx.GBP * 100 : cur === 'SAR' ? avgCostSAR : avgCostSAR / fxRate;
          avgTxt = fmt(avgInCur, 2) + ' ' + cur;
        }
      }
      const qtyTxt = isOwned ? fmt(netQ, isGoldAsset ? 1 : 2) + (isGoldAsset ? ' غ' : ' وحدة') : '—';
      let pnlSAR = null,
        pnlPct = null;
      if (isOwned && grp && price != null) {
        const curP = isGoldAsset ? (price * 0.997 * 0.02055 - 5) / 0.188 : toSAR(price, cur);
        pnlSAR = netQ * curP - netQ * avgCostSAR;
        pnlPct = netQ * avgCostSAR > 0 ? pnlSAR / (netQ * avgCostSAR) * 100 : null;
      }
      return {
        a,
        isGoldAsset,
        cur,
        price,
        changePct,
        high52,
        low52,
        aname,
        netQ,
        isOwned,
        displayPrice,
        displayCur,
        ma200Txt,
        avgTxt,
        qtyTxt,
        pnlSAR,
        pnlPct
      };
    });
    const withChg = items.filter(it => it.changePct != null);
    const ups = withChg.filter(it => it.changePct > 0).length;
    const downs = withChg.filter(it => it.changePct < 0).length;
    let big = null;
    withChg.forEach(it => {
      if (!big || Math.abs(it.changePct) > Math.abs(big.changePct)) big = it;
    });
    const ownedN = items.filter(it => it.isOwned).length;
    const pulse = `<div class="mkt-pulse">
      <div class="mkt-pchip"><div class="v" style="color:var(--green)">${ups} ▲</div><div class="l">رابح اليوم</div></div>
      <div class="mkt-pchip"><div class="v" style="color:var(--red)">${downs} ▼</div><div class="l">خاسر اليوم</div></div>
      <div class="mkt-pchip"><div class="v" style="color:var(--gold)">${big ? (big.changePct >= 0 ? '+' : '') + fmt(big.changePct, 2) + '%' : '—'}</div><div class="l">أكبر حركة${big ? ' · ' + escapePortfolioText(big.a.name) : ''}</div></div>
      <div class="mkt-pchip"><div class="v">${ownedN}</div><div class="l">أصل مشتري</div></div>
    </div>`;
    const fch = (k, lb) => `<button class="mkt-fchip${mktFilter === k ? ' on' : ''}" onclick="setMktFilter('${k}')">${lb}</button>`;
    const filters = `<div class="mkt-filters">${fch('all', 'الكل')}${fch('up', 'رابح ▲')}${fch('down', 'خاسر ▼')}${fch('owned', 'مشتري')}</div>`;
    let list = items;
    if (mktFilter === 'up') list = items.filter(it => it.changePct != null && it.changePct > 0);else if (mktFilter === 'down') list = items.filter(it => it.changePct != null && it.changePct < 0);else if (mktFilter === 'owned') list = items.filter(it => it.isOwned);
    const rowsHtml = list.map(it => {
      const pill = `<span class="quote-change ${it.changePct == null ? 'quote-neutral' : it.changePct >= 0 ? 'quote-up' : 'quote-down'}">${it.changePct != null ? (it.changePct >= 0 ? '+' : '−') + fmt(Math.abs(it.changePct),2) + '%' : '—'}</span>`;
      let pct52 = null,
        barColor = 'var(--gold)',
        lo = '',
        hi = '';
      if (it.price && it.high52 && it.low52 && it.high52 > it.low52) {
        pct52 = Math.min(100, Math.max(0, (it.price - it.low52) / (it.high52 - it.low52) * 100));
        barColor = pct52 > 66 ? 'var(--green)' : pct52 > 33 ? 'var(--gold)' : 'var(--red)';
        lo = it.isGoldAsset ? fmt((it.low52 * 0.997 * 0.02055 - 5) / 0.188 * sarToBase(1), 0) + CUR_SYMS[baseCur] : fmt(it.low52, 1);
        hi = it.isGoldAsset ? fmt((it.high52 * 0.997 * 0.02055 - 5) / 0.188 * sarToBase(1), 0) + CUR_SYMS[baseCur] : fmt(it.high52, 1);

      }
      const cell = (l, v, vs = '') => `<div style="background:var(--surf);border:1px solid var(--bdr);border-radius:12px;padding:8px 11px"><div style="font-size:10px;color:var(--muted)">${l}</div><div style="font-size:12.5px;font-weight:600;font-family:inherit;margin-top:2px;direction:ltr;text-align:right;color:var(--muted);${vs}">${v}</div></div>`;
      const pnlColor = it.pnlSAR != null ? it.pnlSAR >= 0 ? 'var(--green)' : 'var(--red)' : 'var(--muted)';
      const pnlVal = it.pnlSAR != null ? (it.pnlSAR >= 0 ? '▲ ' : '▼ ') + fmtC(Math.abs(it.pnlSAR)) + (it.pnlPct != null ? ' (' + (it.pnlPct >= 0 ? '+' : '') + fmt(it.pnlPct, 1) + '%)' : '') : null;
      const bar52full = pct52 != null ? `<div style="margin:8px 0 12px">
        <div style="display:flex;justify-content:space-between;font-size:9.5px;color:var(--muted);margin-bottom:4px"><span>أدنى 52 أسبوع · ${lo}</span><span>أعلى · ${hi}</span></div>
        <div style="height:7px;background:var(--wline);border-radius:99px;position:relative"><div style="position:absolute;left:${pct52.toFixed(0)}%;top:50%;transform:translate(-50%,-50%);width:13px;height:13px;border-radius:50%;background:${barColor};border:2.5px solid var(--surf);box-shadow:0 1px 4px rgba(0,0,0,.18)"></div></div>
      </div>` : '<div class="quote-range-missing"><span>نطاق 52 أسبوع غير متوفر</span><div class="quote-range-empty"></div></div>';
      const body = `<div class="mkt-rbody">
        <div class="mkt-dgrid">
          ${cell('متوسط 200 يوم', it.ma200Txt)}
          ${it.isOwned ? cell('الكمية', it.qtyTxt) : ''}
          ${it.isOwned ? cell('متوسط تكلفتي', it.avgTxt) : ''}
          ${pnlVal ? cell('الربح / الخسارة', pnlVal, `color:${pnlColor}`) : ''}
        </div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button onclick="event.stopPropagation();mktQuickAlert('${(it.a.name || '').replace(/'/g, "\\'")}')" style="flex:1;font-family:inherit;font-size:11.5px;font-weight:500;padding:9px;border-radius:11px;border:1px solid rgba(201,168,76,.35);background:rgba(201,168,76,.12);color:var(--gold);cursor:pointer"><i class="ti ti-bell-plus"></i> نبّهني عند سعر…</button>
        </div>
      </div>`;
      return `<div class="mkt-row quote-row" data-mid="${escapePortfolioText(it.a.id)}">
        <button type="button" class="mkt-rhead quote-head${it.isGoldAsset ? ' quote-head-gold' : ''}" aria-expanded="false" onclick="toggleMktRow(this.parentNode)">
          <span class="quote-identity"><strong>${escapePortfolioText(it.a.name)}</strong><span class="quote-symbol">${escapePortfolioText(it.a.yahooSym || it.aname || '—')}</span><span class="quote-owned">${it.isOwned ? 'في محفظتك' : 'متابعة فقط'}</span></span>
          <span class="quote-price"><span class="quote-caption">آخر سعر</span><strong>${it.isGoldAsset && it.price != null ? fmt((it.price * 0.997 * 0.02055 - 5) / 0.188 * sarToBase(1), 1) : it.displayPrice}</strong><span class="quote-currency">${it.isGoldAsset ? CUR_SYMS[baseCur] + ' / غرام' : it.displayCur || '—'}</span></span>
          <span class="quote-day"><span class="quote-caption">التغيّر اليومي</span>${pill}<i class="ti ti-chevron-down" aria-hidden="true"></i></span>
          ${it.isGoldAsset ? `<span class="quote-price quote-ounce"><span class="quote-caption">الأونصة عالميًا</span><strong>${it.price != null ? '$' + fmt(it.price, 2) : '—'}</strong><span class="quote-currency">USD / أونصة</span></span>` : ''}
        </button>
        <div class="quote-range-visible">${bar52full}</div>
        ${body}
      </div>`;
    }).join('');
    el.innerHTML = pulse + filters + `<div class="mkt-list">${rowsHtml || '<div class="empty">لا نتائج لهذا الفلتر</div>'}</div>`;
    if (mktOpenRow) {
      const r = el.querySelector(`.mkt-row[data-mid="${mktOpenRow}"]`);
      if (r) {r.classList.add('open');r.querySelector('.quote-head')?.setAttribute('aria-expanded','true');}
    }
    return;
  }
  el.innerHTML = `<div class="tbl-wrap"><table class="mkt-table">
    <thead><tr>
      <th style="min-width:140px">الأصل</th>
      <th style="min-width:110px">السعر الحالي</th>
      <th style="min-width:100px">التغيير اليوم</th>
      <th style="min-width:140px">نطاق 52 أسبوع</th>
      <th style="min-width:110px">متوسط 200 يوم</th>
      <th style="min-width:90px">الكمية</th>
      <th style="min-width:110px">متوسط تكلفتي</th>
      <th style="min-width:120px">الربح / الخسارة</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}
function showUndoToast() {
  const btn = document.getElementById('btnUndo');
  if (btn) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
    btn.style.color = 'var(--gold)';
    btn.style.borderColor = 'rgba(201,168,76,.4)';
  }
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '.3';
      btn.style.cursor = 'not-allowed';
      btn.style.color = 'var(--muted)';
      btn.style.borderColor = '';
    }
    _deletedBackup = null;
  }, 10000);
}
function undoDelete() {
  if (!_deletedBackup) return;
  _deletedBackup.txns.forEach(t => {
    if (!txns.find(x => x.id === t.id)) txns.push(t);
  });
  txns.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  saveTxns();
  portfolioAPI.addTxns(_deletedBackup.txns);
  _deletedBackup = null;
  const btn = document.getElementById('btnUndo');
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '.3';
    btn.style.cursor = 'not-allowed';
    btn.style.color = 'var(--muted)';
  }
  if (_toastTimer) {
    clearTimeout(_toastTimer);
    _toastTimer = null;
  }
  renderAll();
}
function openRestoreModal() {
  openModal('restoreModal');
  const list = document.getElementById('deletedList');
  if (list) list.innerHTML = '<div class="empty">جاري التحميل...</div>';
  portfolioAPI.withSuccessHandler(renderDeletedList).withFailureHandler(() => {
    if (list) list.innerHTML = '<div class="empty">تعذر التحميل</div>';
  }).getDeletedTxns();
}
let _restoreSelected = new Set();
function renderDeletedList(items) {
  const list = document.getElementById('deletedList');
  const btn = document.getElementById('btnDoRestore');
  _restoreSelected.clear();
  if (!list) return;
  if (!items || !items.length) {
    list.innerHTML = '<div class="empty">لا توجد حركات محذوفة</div>';
    return;
  }
  list.innerHTML = items.map(t => {
    const deletedAt = t.deletedAt ? new Date(t.deletedAt).toLocaleString('ar-EG') : '—';
    const sg = t.action === 'Buy' || t.action === 'Deposit' ? '' : '-';
    const costColor = sg ? 'var(--red)' : 'var(--green)';
    return `<label style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--surf2);border-radius:9px;cursor:pointer;border:1px solid var(--bdr)">
      <input type="checkbox" style="accent-color:var(--gold)" value="${t.id}" onchange="toggleRestoreSel(this)">
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-weight:500;font-size:12px">${t.assetName}</span>
          <span style="font-weight:600;font-family:inherit;font-size:12px;color:${costColor}">${sg}${fmtS(Math.abs(pN(t.totalCostSAR)))}</span>
        </div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px">${t.date} · ${t.action} · حُذف: ${deletedAt}</div>
      </div>
    </label>`;
  }).reverse().join('');
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '.4';
    btn.style.pointerEvents = 'none';
  }
}
function toggleRestoreSel(cb) {
  if (cb.checked) _restoreSelected.add(String(cb.value));else _restoreSelected.delete(String(cb.value));
  const btn = document.getElementById('btnDoRestore');
  if (btn) {
    const has = _restoreSelected.size > 0;
    btn.disabled = !has;
    btn.style.opacity = has ? '1' : '.4';
    btn.style.pointerEvents = has ? 'auto' : 'none';
    btn.textContent = `↩ استرجاع ${_restoreSelected.size} حركة`;
  }
}
document.getElementById('btnDoRestore')?.addEventListener('click', () => {
  if (!_restoreSelected.size) return;
  const ids = [..._restoreSelected];
  portfolioAPI.withSuccessHandler(r => {
    closeModal('restoreModal');
    portfolioAPI.withSuccessHandler(initApp).loadAll();
  }).withFailureHandler(e => alert('فشل الاسترجاع: ' + e.message)).restoreTxns(ids);
});
function clearAllDeleted() {
  if (!confirm('سيتم مسح كل الحركات المحذوفة نهائياً — هل أنت متأكد؟')) return;
  portfolioAPI.withSuccessHandler(() => {
    closeModal('restoreModal');
    alert('✅ تم المسح');
  }).clearDeletedTxns();
}
function toggleUnrealized(val) {
  includeUnrealized = val;
  renderAll();
}
async function globalRefresh() {
  const btn = $('btnGlobalRefresh'),
    spin = $('globalSpin');
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '.6';
  }
  if (spin) spin.classList.add('spinning');
  st('statusTxt', 'جاري تحديث الأسعار...');
  try {
    await refreshPrices();
    await refreshMarket();
    st('statusTxt', 'آخر تحديث: ' + new Date().toLocaleTimeString('ar-EG'));
    showToast('تم تحديث الأسعار', 'success');
  } catch (e) {
    st('statusTxt', 'خطأ: ' + e.message);
  }
  if (btn) {
    btn.disabled = false;
    btn.style.opacity = '1';
  }
  if (spin) spin.classList.remove('spinning');
}
function initApp(data) {
  window.portfolioLoaded = true;
  if (data) {
    txns = (data.txns || []).map(t => ({
      id: parseFloat(t.id) || Date.now(),
      date: String(t.date || ''),
      assetType: String(t.assetType || ''),
      assetName: String(t.assetName || ''),
      action: String(t.action || ''),
      qty: parseFloat(t.qty) || 0,
      price: parseFloat(t.price) || 0,
      fees: parseFloat(t.fees) || 0,
      currency: String(t.currency || 'SAR'),
      rate: parseFloat(t.rate) || 1,
      totalCostSAR: parseFloat(t.totalCostSAR) || 0,
      remarks: String(t.remarks || ''),
      linkedTxnId: t.linkedTxnId || null,
      ...(t.incomeType==='Dividend'?{incomeType:'Dividend',sourceAssetId:String(t.sourceAssetId),sourceAssetName:String(t.sourceAssetName||''),...Object.fromEntries(['dividendShares','dividendPerShare','dividendWithholding','dividendCostSAR'].filter(k=>t[k]!=null&&t[k]!=='').map(k=>[k,Number(t[k])]))}: {})
    }));
    if (data.assets && data.assets.length > 0) {
      assets = data.assets.map(a => ({
        id: String(a.id || ''),
        name: String(a.name || ''),
        type: String(a.type || 'Stock'),
        currency: String(a.currency || 'USD'),
        yahooSym: String(a.yahooSym || ''),
        tvSym: String(a.tvSym || ''),
        isGold: String(a.isGold) === 'true'
      }));
    }
    if (data.otherSources) {
      otherSrc = data.otherSources.map(s => ({
        id: parseFloat(s.id) || Date.now(),
        name: String(s.name || ''),
        value: parseFloat(s.value) || 0,
        type: String(s.type || 'realized'),
        included: String(s.included) === 'false' ? false : true
      }));
    }
    const s = data.settings || {};
    if (s.baseCur) baseCur = String(s.baseCur);
    if (s.priceAlerts) {
      try {
        priceAlerts = JSON.parse(s.priceAlerts) || [];
      } catch (e) {}
    }
    zkLoad(s);
    if (s.customXray) {
      try {
        customXray = JSON.parse(s.customXray) || {};
      } catch (e) {}
    }
    if (s.iosTheme) applyIosTheme(String(s.iosTheme), false);
    if (s.pivotCur) pivotCur = String(s.pivotCur);
    if (s.retireGoal) retireGoal = parseFloat(s.retireGoal) || 2800000;
    if (s.propVals) {
      try {
        propVals = JSON.parse(s.propVals);
      } catch (e) {}
    }
    if (s.catGoals) {
      try {
        catGoals = JSON.parse(s.catGoals);
      } catch (e) {}
    }
    if (s.marketOrder) {
      try {
        marketOrder = JSON.parse(s.marketOrder);
      } catch (e) {}
    }
    if (s.marketHidden) {
      try {
        marketHidden = new Set(JSON.parse(s.marketHidden));
      } catch (e) {}
    }
    if (s.includeUnrealized !== undefined) includeUnrealized = s.includeUnrealized !== 'false';
    if (s.notes) {
      try {
        notes = JSON.parse(s.notes).map(n=>({...n,body:n.body??n.content??''}));
      } catch (e) {}
    }
    if (false && s.appearance) {
      try {
        const ap = JSON.parse(s.appearance);
        if (ap.accentColor) {
          _accentColor = ap.accentColor;
          applyAccentColorFree(ap.accentColor);
        }
        if (ap.textPrimary) {
          _textPrimary = ap.textPrimary;
          document.documentElement.style.setProperty('--text', ap.textPrimary);
        }
        if (ap.textSecondary) {
          _textSecondary = ap.textSecondary;
          document.documentElement.style.setProperty('--muted', ap.textSecondary);
        }
        if (ap.thColor) {
          _thColor = ap.thColor;
          document.documentElement.style.setProperty('--th-bg', ap.thColor);
        }
        if (ap.heroValColor) {
          _heroValColor = ap.heroValColor;
          document.documentElement.style.setProperty('--hero-val-color', ap.heroValColor);
        }
        if (ap.pageTitleColor) {
          _pageTitleColor = ap.pageTitleColor;
          document.documentElement.style.setProperty('--page-title-color', ap.pageTitleColor);
        }
        if (ap.cardOpacity !== undefined) {
          _cardOpacity = parseInt(ap.cardOpacity);
        }
        if (ap.cardBlur !== undefined) {
          _cardBlur = parseInt(ap.cardBlur);
        }
        if (ap.cardTint) {
          _cardTint = ap.cardTint;
        }
        if (ap.cardTintColor) {
          _cardTintColor = ap.cardTintColor;
        }
        if (ap.bgOverlay !== undefined) {
          _bgOverlay = parseInt(ap.bgOverlay);
        }
        if (ap.bgBlur !== undefined) {
          _bgBlur = parseInt(ap.bgBlur);
        }
        if (ap.bgId) {
          _activeBgId = ap.bgId;
        }
        if (ap.bgUrlDesktop) {
          _bgUrlDesktop = ap.bgUrlDesktop;
          localStorage.setItem('bgUrl_desktop', ap.bgUrlDesktop);
        }
        if (ap.bgUrlMobile) {
          _bgUrlMobile = ap.bgUrlMobile;
          localStorage.setItem('bgUrl_mobile', ap.bgUrlMobile);
        }
        if (_bgUrlDesktop || _bgUrlMobile) _activeBgId = 'custom';
        if (ap.bgFitDesktop) localStorage.setItem('bgFitDesktop', ap.bgFitDesktop);
        if (ap.bgFitMobile) localStorage.setItem('bgFitMobile', ap.bgFitMobile);
        applyBodyBg();
        applyCardOpacity(_cardOpacity);
        applyCardBlur(_cardBlur);
        applyBgOverlay(_bgOverlay);
        applyGlassBlur(_bgBlur);
        _applyCardTintCSS();
      } catch (e) {
        console.log('appearance load error:', e);
      }
    }
    setSyncStatus('✅ محمّل من قاعدة البيانات — ' + txns.length + ' حركة', 'var(--green)');
    updateDebug('✅ قاعدة البيانات: ' + txns.length + ' txns, ' + otherSrc.length + ' other, assets:' + assets.length);
    updateDebugMode();
  } else {
    try {
      txns = JSON.parse(localStorage.getItem('pf_txns') || '[]');
    } catch (e) {}
    try {
      propVals = JSON.parse(localStorage.getItem('pf_pvals') || '{}');
    } catch (e) {}
    try {
      otherSrc = JSON.parse(localStorage.getItem('pf_other') || '[]');
    } catch (e) {}
    try {
      catGoals = JSON.parse(localStorage.getItem('pf_cat_goals') || '{}');
    } catch (e) {}
    const savedAssets = localStorage.getItem('pf_assets');
    if (savedAssets) try {
      assets = JSON.parse(savedAssets);
    } catch (e) {}
    try {
      customXray = JSON.parse(localStorage.getItem('pf_custom_xray') || '{}');
    } catch (e) {}
    zkLoad(null);
    try {
      priceAlerts = JSON.parse(localStorage.getItem('pf_alerts') || '[]');
    } catch (e) {}
    baseCur = localStorage.getItem('pf_basecur') || 'SAR';
    pivotCur = localStorage.getItem('pf_pivotcur') || 'SAR';
    retireGoal = parseFloat(localStorage.getItem('pf_retire_goal')) || 2800000;
    setSyncStatus('📦 بيانات محلية — ' + txns.length + ' حركة', 'var(--muted)');
    updateDebug('📦 Local: ' + txns.length + ' txns');
    updateDebugMode();
  }
  ['Property', 'Gold', 'Stock', 'Cash'].forEach(k => {
    if (!catGoals[k]) catGoals[k] = 0;
  });
  document.querySelectorAll('.cur-btn').forEach(b => b.classList.toggle('active', b.dataset.cur === baseCur));
  loadMarketSettings();
  updatePivotLabels();
  loadNotes();
  _doRenderAll();
  setTimeout(async () => {
    try {
      await refreshPrices();
    } catch (e) {
      console.log('auto refresh prices:', e);
    }
    try {
      await refreshMarket();
    } catch (e) {
      console.log('auto refresh market:', e);
    }
  }, 600);
  if (document.getElementById('page-notes')?.classList.contains('active')) renderNotes();
}
window.startPortfolio = () => portfolioAPI.withSuccessHandler(data => initApp(data)).withFailureHandler(window.cloudFailure).loadAll();
function saveCatGoals() {
  portfolioAPI.saveSetting('catGoals', JSON.stringify(catGoals));
}
function manualSave(force) {
  console.log('manualSave called, _cloudMode:', _cloudMode);
  updateDebug('⏳ جاري الحفظ...');
  if (!_cloudMode) {
    localStorage.setItem('pf_txns', JSON.stringify(txns));
    localStorage.setItem('pf_assets', JSON.stringify(assets));
    localStorage.setItem('pf_other', JSON.stringify(otherSrc));
    localStorage.setItem('pf_basecur', baseCur);
    localStorage.setItem('pf_cat_goals', JSON.stringify(catGoals));
    localStorage.setItem('pf_retire_goal', retireGoal);
    localStorage.setItem('pf_pvals', JSON.stringify(propVals));
    updateDebug('✅ محفوظ محلياً — ' + txns.length + ' حركة');
    setSyncStatus('✅ محفوظ محلياً', 'var(--green)');
    showToast('✅ محفوظ محلياً', 'success');
    return;
  }
  setSyncStatus('⏳ جاري الحفظ على قاعدة البيانات...');
  const sorted = [...txns].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  console.log('Sending ' + sorted.length + ' txns to قاعدة البيانات');
  portfolioAPI.withSuccessHandler(function (r) {
    const btnG = document.getElementById('btnManualSave');
    if (r && r.ok === false && r.needConfirm) {
      const msg = '⚠️ تنبيه قبل الحفظ\n\n' + 'عدد الحركات على قاعدة البيانات: ' + r.curCount + '\n' + 'العدد الذي سيُحفظ الآن: ' + r.newCount + '\n\n' + 'إذا كنت قد حذفت حركات فعلاً — اضغط "موافق".\n' + 'إذا لم تحذف شيئاً — اضغط "إلغاء"، وبياناتك على قاعدة البيانات تبقى سليمة.';
      if (confirm(msg)) manualSave(true);else {
        setSyncStatus('أُلغي الحفظ — قاعدة البيانات لم يتغير', 'var(--muted)');
        showToast('أُلغي الحفظ — بياناتك سليمة', 'info');
        if (btnG) {
          btnG.innerHTML = '<i class="ti ti-device-floppy"></i>';
        }
      }
      return;
    }
    if (r && r.ok === false) {
      setSyncStatus('لم يتم الحفظ: ' + (r.err || 'خطأ غير معروف'), 'var(--red)');
      showToast('لم يتم الحفظ — ' + (r.err || 'خطأ'), 'error');
      if (btnG) {
        const o = btnG.innerHTML;
        btnG.innerHTML = '<i class="ti ti-x"></i>';
        setTimeout(() => btnG.innerHTML = o, 2000);
      }
      return;
    }
    portfolioAPI.withSuccessHandler(function () {
      portfolioAPI.saveOtherSources(otherSrc);
      portfolioAPI.saveSetting('baseCur', baseCur);
      portfolioAPI.saveSetting('catGoals', JSON.stringify(catGoals));
      portfolioAPI.saveSetting('retireGoal', retireGoal);
      portfolioAPI.saveSetting('propVals', JSON.stringify(propVals));
      portfolioAPI.saveSetting('marketOrder', JSON.stringify(marketOrder));
      portfolioAPI.saveSetting('marketHidden', JSON.stringify([...marketHidden]));
      portfolioAPI.saveSetting('includeUnrealized', includeUnrealized);
      portfolioAPI.saveSetting('notes', JSON.stringify(notes));
      portfolioAPI.saveNotesToSheet(notes);
      setSyncStatus('تم الحفظ — ' + (r.count || 0) + ' حركة', 'var(--green)');
      showToast('تم الحفظ — ' + (r.count || 0) + ' حركة', 'success');
      const btn = document.getElementById('btnManualSave');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="ti ti-check"></i>';
        setTimeout(() => btn.innerHTML = orig, 2000);
      }
    }).saveAssets(assets);
  }).withFailureHandler(function (e) {
    setSyncStatus('خطأ: فشل الحفظ: ' + e.message, 'var(--red)');
    showToast('خطأ: فشل الحفظ — ' + e.message, 'error');
    const btn = document.getElementById('btnManualSave');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="ti ti-x"></i>';
      setTimeout(() => btn.innerHTML = orig, 2000);
    }
  }).syncTxns(sorted, {
    force: !!force
  });
}
let monthlyChartInst = null;
let monthlyChartVisible = true;
function toggleMonthlyChart() {
  const wrap = $('monthlyChartWrap');
  const icon = $('chartToggleIcon');
  if (!wrap || !icon) return;
  monthlyChartVisible = !monthlyChartVisible;
  wrap.style.display = monthlyChartVisible ? 'block' : 'none';
  icon.className = monthlyChartVisible ? 'ti ti-chevron-up' : 'ti ti-chevron-down';
}
function clearChartFilter() {
  delete window._chartMonthFilter;
  delete window._chartTypeFilter;
  delete window._chartActionFilter;
  renderTxnTable();
}
function applyChartFilter(month, assetType) {
  const fMonth = $('fMonth'),
    fType = $('fType');
  if (fMonth) fMonth.value = month || '';
  if (fType) fType.value = assetType || '';
  window._chartMonthFilter = month || null;
  window._chartTypeFilter = assetType || null;
  window._chartActionFilter = null;
  renderTxnTable();
  $('txnTable')?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}
function renderMonthlyChart() {
  if (document.body.classList.contains('workspaces-ready') || isMobile()) return;
  const dc = $('monthlyChart');
  if (!dc) return;
  if (!monthlyChartVisible) return;
  const mStockBuy = {},
    mGoldBuy = {},
    mStockSell = {},
    mGoldSell = {};
  txns.forEach(t => {
    const m = t.date ? t.date.slice(0, 7) : '';
    if (!m) return;
    if (t.assetType !== 'Stock' && t.assetType !== 'Gold') return;
    const v = Math.abs(pN(t.totalCostSAR) || 0);
    if (t.action === 'Buy') {
      if (t.assetType === 'Stock') mStockBuy[m] = (mStockBuy[m] || 0) + v;else mGoldBuy[m] = (mGoldBuy[m] || 0) + v;
    } else if (t.action === 'Sell') {
      if (t.assetType === 'Stock') mStockSell[m] = (mStockSell[m] || 0) + v;else mGoldSell[m] = (mGoldSell[m] || 0) + v;
    }
  });
  const allMonths = [...new Set([...Object.keys(mStockBuy), ...Object.keys(mGoldBuy), ...Object.keys(mStockSell), ...Object.keys(mGoldSell)])].sort().slice(-14);
  if (!allMonths.length) {
    if (monthlyChartInst) {
      monthlyChartInst.destroy();
      monthlyChartInst = null;
    }
    dc.getContext('2d')?.clearRect(0, 0, dc.width, dc.height);
    return;
  }
  const stockBuyVals = allMonths.map(m => mStockBuy[m] || 0);
  const goldBuyVals = allMonths.map(m => mGoldBuy[m] || 0);
  const stockSellVals = allMonths.map(m => -(mStockSell[m] || 0));
  const goldSellVals = allMonths.map(m => -(mGoldSell[m] || 0));
  const totalBuyVals = allMonths.map(m => (mStockBuy[m] || 0) + (mGoldBuy[m] || 0));
  const netVals = allMonths.map(m => (mStockBuy[m] || 0) + (mGoldBuy[m] || 0) - (mStockSell[m] || 0) - (mGoldSell[m] || 0));
  const zeroLinePlugin = {
    id: 'zeroLine',
    afterDraw(chart) {
      const {
        ctx,
        scales: {
          y,
          x
        }
      } = chart;
      if (!y) return;
      const zeroY = y.getPixelForValue(0);
      if (zeroY < y.top || zeroY > y.bottom) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x.left, zeroY);
      ctx.lineTo(x.right, zeroY);
      ctx.strokeStyle = 'rgba(201,168,76,.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.stroke();
      ctx.restore();
    }
  };
  const chartPlugin = {
    id: 'netLabel',
    afterDatasetsDraw(chart) {
      const {
        ctx,
        scales: {
          x,
          y
        }
      } = chart;
      allMonths.forEach((m, i) => {
        const net = netVals[i];
        if (Math.abs(net) < 100) return;
        const xPos = x.getPixelForValue(i);
        const yPos = net >= 0 ? y.getPixelForValue(totalBuyVals[i]) : y.getPixelForValue(0);
        const lbl = fmtC(Math.abs(net));
        ctx.save();
        const _lt = document.documentElement.classList.contains('ios-light');
        ctx.fillStyle = net >= 0 ? _lt ? '#8a6a1c' : 'rgba(232,200,106,.9)' : _lt ? '#a8432e' : 'rgba(178,84,62,.9)';
        ctx.font = 'bold 9px ' + FONT_CANVAS;
        ctx.textAlign = 'center';
        ctx.fillText(lbl, xPos, net >= 0 ? yPos - 5 : yPos + 13);
        ctx.restore();
      });
    }
  };
  if (monthlyChartInst) monthlyChartInst.destroy();
  const H = 175;
  const inner = $('monthlyChartInner');
  const minW = allMonths.length * 58;
  const containerW = $('monthlyChartWrap')?.clientWidth || 300;
  if (inner) {
    inner.style.width = Math.max(minW, containerW) + 'px';
    inner.style.height = H + 'px';
  }
  if (dc) {
    dc.style.width = '100%';
    dc.style.height = H + 'px';
  }
  monthlyChartInst = new Chart(dc, {
    type: 'bar',
    plugins: [zeroLinePlugin, chartPlugin],
    data: {
      labels: allMonths.map(m => {
        const [y, mo] = m.split('-');
        return `${mo}/${y.slice(2)}`;
      }),
      datasets: [{
        label: 'شراء أسهم',
        data: stockBuyVals,
        backgroundColor: 'rgba(201,168,76,.88)',
        hoverBackgroundColor: '#c9a84c',
        borderRadius: ctx => (goldBuyVals[ctx.dataIndex] || 0) > 0 ? 0 : {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0
        },
        borderSkipped: false,
        stack: 'buy',
        categoryPercentage: 0.62,
        barPercentage: 0.9
      }, {
        label: 'شراء ذهب',
        data: goldBuyVals,
        backgroundColor: 'rgba(232,201,122,.92)',
        hoverBackgroundColor: '#e8c97a',
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0
        },
        borderSkipped: false,
        stack: 'buy',
        categoryPercentage: 0.62,
        barPercentage: 0.9
      }, {
        label: 'بيع أسهم',
        data: stockSellVals,
        backgroundColor: 'rgba(178,84,62,.62)',
        hoverBackgroundColor: 'rgba(178,84,62,.88)',
        borderRadius: ctx => Math.abs(goldSellVals[ctx.dataIndex] || 0) > 0 ? 0 : {
          bottomLeft: 6,
          bottomRight: 6,
          topLeft: 0,
          topRight: 0
        },
        borderSkipped: true,
        stack: 'sell',
        categoryPercentage: 0.62,
        barPercentage: 0.9
      }, {
        label: 'بيع ذهب',
        data: goldSellVals,
        backgroundColor: 'rgba(178,84,62,.34)',
        hoverBackgroundColor: 'rgba(178,84,62,.58)',
        borderRadius: {
          bottomLeft: 6,
          bottomRight: 6,
          topLeft: 0,
          topRight: 0
        },
        borderSkipped: true,
        stack: 'sell',
        categoryPercentage: 0.62,
        barPercentage: 0.9
      }]
    },
    options: {
      grouped: false,
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          bottom: 2
        }
      },
      onHover(e) {
        e.native.target.style.cursor = isMobile() ? 'pointer' : 'default';
      },
      onClick(e, els) {
        if (isMobile() && els && els.length) {
          const m = allMonths[els[0].index];
          if (m && typeof showTxnMonthSummary === 'function') showTxnMonthSummary(m);
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: '#7a7d8a',
            font: {
              size: 10,
              family: FONT_CANVAS
            },
            boxWidth: 7,
            boxHeight: 7,
            padding: 10,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          position: 'nearest',
          callbacks: {
            title: ctx => {
              const m = allMonths[ctx[0].dataIndex];
              const [y, mo] = m.split('-');
              const names = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
              return `${names[parseInt(mo) - 1]} ${y}`;
            },
            beforeBody: ctx => {
              const m = allMonths[ctx[0].dataIndex];
              const sb = mStockBuy[m] || 0,
                gb = mGoldBuy[m] || 0;
              const ss = mStockSell[m] || 0,
                gs = mGoldSell[m] || 0;
              const net = sb + gb - (ss + gs);
              const lines = [];
              if (sb) lines.push(`شراء أسهم:  +${fmtC(sb)}`);
              if (gb) lines.push(`شراء ذهب:   +${fmtC(gb)}`);
              if (ss) lines.push(`بيع أسهم:    -${fmtC(ss)}`);
              if (gs) lines.push(`بيع ذهب:     -${fmtC(gs)}`);
              lines.push(`──────────────`);
              lines.push(`الإجمالي: ${net >= 0 ? '+' : ''}${fmtC(net)}`);
              return lines;
            },
            label: () => null
          },
          backgroundColor: 'rgba(20,23,31,.96)',
          titleColor: '#e8e6df',
          bodyColor: '#a0a0a8',
          borderColor: 'rgba(255,255,255,.1)',
          borderWidth: 1,
          padding: 7,
          cornerRadius: 8,
          displayColors: false,
          titleFont: {
            size: 10,
            family: FONT_CANVAS
          },
          bodyFont: {
            size: 10,
            family: FONT_CANVAS
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            color: chartGrid(),
            drawTicks: false
          },
          ticks: {
            color: '#a0a0a8',
            font: {
              size: 9,
              family: FONT_CANVAS
            },
            maxRotation: 0
          }
        },
        y: {
          stacked: true,
          grid: {
            color: chartGrid(),
            lineWidth: 1
          },
          ticks: {
            display: true,
            color: 'rgba(160,160,168,.45)',
            font: {
              size: 8,
              family: FONT_CANVAS
            },
            callback: v => v === 0 ? '0' : Math.abs(v) >= 1000 ? (v / 1000).toFixed(0) + 'k' : ''
          }
        }
      }
    }
  });
}
let notes = [];
let _activeNoteId = null;
let _notesSidebarOpen = true;
function _applyNotesSidebar() {
  const sb = document.getElementById('notesSidebar');
  const ic = document.getElementById('notesSidebarToggleIcon');
  const bd = document.getElementById('notesSidebarBackdrop');
  if (!sb) return;
  if (_notesSidebarOpen) {
    sb.style.padding = '10px 8px';
    sb.style.overflowY = 'auto';
    if (isMobile()) {
      sb.style.position = 'fixed';
      sb.style.top = '56px';
      sb.style.right = '0';
      sb.style.left = '';
      sb.style.bottom = 'calc(62px + env(safe-area-inset-bottom))';
      sb.style.width = isMobile() ? '220px' : '220px';
      sb.style.zIndex = '200';
      sb.style.boxShadow = '4px 0 24px rgba(0,0,0,.5)';
      sb.style.borderRadius = '0 0 0 16px';
      if (bd) bd.style.display = 'block';
    } else {
      sb.style.position = '';
      sb.style.top = '';
      sb.style.right = '';
      sb.style.left = '';
      sb.style.bottom = '';
      sb.style.zIndex = '';
      sb.style.boxShadow = '';
      sb.style.borderRadius = '16px';
      sb.style.width = isMobile() ? '272px' : '250px';
      if (bd) bd.style.display = 'none';
    }
  } else {
    sb.style.width = '0';
    sb.style.padding = '0';
    sb.style.overflowY = 'hidden';
    sb.style.boxShadow = 'none';
    if (bd) bd.style.display = 'none';
  }
  if (ic) ic.className = _notesSidebarOpen ? 'ti ti-layout-sidebar' : 'ti ti-layout-sidebar-right';
}
function toggleNotesSidebar() {
  _notesSidebarOpen = !_notesSidebarOpen;
  _applyNotesSidebar();
  renderNotesSidebar();
}
let _moreMenuOpen = false;
function toggleMoreMenu() {
  if (_moreMenuOpen) closeMoreMenu();else openMoreMenu();
}
function openMoreMenu() {
  if (_moreMenuOpen) return;
  _moreMenuOpen = true;
  const menu = document.getElementById('moreMenu');
  const backdrop = document.getElementById('moreMenuBackdrop');
  if (menu) menu.classList.add('open');
  if (backdrop) backdrop.style.display = 'block';
}
function closeMoreMenu() {
  if (!_moreMenuOpen) return;
  _moreMenuOpen = false;
  const menu = document.getElementById('moreMenu');
  const backdrop = document.getElementById('moreMenuBackdrop');
  if (menu) menu.classList.remove('open');
  if (backdrop) backdrop.style.display = 'none';
}
function pickMorePage(pg) {
  _moreMenuOpen = false;
  const menu = document.getElementById('moreMenu');
  const backdrop = document.getElementById('moreMenuBackdrop');
  if (menu) menu.classList.remove('open');
  if (backdrop) {
    backdrop.classList.remove('open');
    backdrop.style.display = 'none';
  }
  requestAnimationFrame(() => {
    showPage(pg, null);
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('navMoreBtn')?.classList.add('active');
  });
}
document.addEventListener('click', function (e) {
  if (!_moreMenuOpen) return;
  const menu = document.getElementById('moreMenu');
  const btn = document.getElementById('navMoreBtn');
  if (menu && !menu.contains(e.target) && !btn?.contains(e.target)) {
    closeMoreMenu();
  }
}, {
  capture: false
});
document.querySelectorAll('#navExtra .nav-item').forEach(el => {
  el.addEventListener('click', () => showPage(el.dataset.page, el));
});
function loadNotes() {
  portfolioAPI.withSuccessHandler(function (result) {
    if (result && Array.isArray(result)) {
      notes = result;
      if(document.getElementById("page-notes")?.classList.contains("active"))renderNotes();
    }
  }).withFailureHandler(function () {}).getNotes();
  return;
  try {
    notes = JSON.parse(localStorage.getItem('pf_notes') || '[]');
  } catch (e) {}
}
let _notesSaveTimer = null;
function saveNotes(immediate) {
  if (immediate) {
    clearTimeout(_notesSaveTimer);
    _notesSaveTimer = null;
    _doSaveNotes();
    return;
  }
  clearTimeout(_notesSaveTimer);
  _notesSaveTimer = setTimeout(_doSaveNotes, 700);
}
function _doSaveNotes() {
  _notesSaveTimer = null;

  if (_cloudMode && _cloudMode) {
    portfolioAPI.withFailureHandler(function () {
      portfolioAPI.saveSetting('notes', JSON.stringify(notes));
    }).saveNotesToSheet(notes);
  }
}
function renderNotes() {
  renderNotesSidebar();
  const activeExists = _activeNoteId && notes.find(n => n.id == _activeNoteId);
  if (activeExists) {
    renderNoteEditor(_activeNoteId);
  } else {
    _activeNoteId = null;
    const editor = document.getElementById('noteEditor');
    if (editor) editor.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:60px 20px;gap:14px;opacity:.5">
        <i class="ti ti-notes" style="font-size:40px;color:var(--muted)"></i>
        <div style="font-size:13px;color:var(--muted);text-align:center">اختر ملاحظة أو أنشئ واحدة جديدة</div>
      </div>`;
  }
}
const _collapsedCats = new Set();
function renderNotesSidebar() {
  const sb = document.getElementById('notesSidebar');
  if (!sb) return;
  if (!notes.length) {
    sb.innerHTML = '<div style="font-size:11px;color:var(--muted);padding:8px 4px">لا توجد ملاحظات</div>';
    return;
  }
  const cats = [...new Set(notes.map(n => n.category || 'عام'))];
  const dl = document.getElementById('noteCatSuggestions');
  if (dl) dl.innerHTML = cats.map(c => `<option value="${c}">`).join('');
  const groups = {};
  notes.forEach(n => {
    const cat = n.category || 'عام';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(n);
  });
  let html = '';
  Object.entries(groups).forEach(([cat, items]) => {
    const collapsed = _collapsedCats.has(cat);
    html += `<div style="margin-bottom:2px">
      <div onclick="_collapsedCats.has('${cat}')?_collapsedCats.delete('${cat}'):_collapsedCats.add('${cat}');renderNotesSidebar()"
        style="display:flex;align-items:center;gap:5px;padding:5px 8px;cursor:pointer;border-radius:8px;user-select:none"
        onmouseover="this.style.background='var(--surf3)'" onmouseout="this.style.background='transparent'">
        <i class="ti ti-chevron-${collapsed ? 'left' : 'down'}" style="font-size:11px;color:var(--muted)"></i>
        <span style="font-size:10px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;flex:1">${cat}</span>
        <span style="font-size:9px;color:var(--muted);background:var(--surf3);border-radius:8px;padding:1px 6px">${items.length}</span>
      </div>
      ${collapsed ? '' : items.map(n => {
      const timeStr = n.updatedAt ? new Date(n.updatedAt).toLocaleDateString('ar-EG', {
        day: '2-digit',
        month: '2-digit'
      }) : n.date || '';
      const isActive = n.id === _activeNoteId;
      return `
        <div style="padding:5px 8px 5px 6px;border-radius:10px;cursor:pointer;background:${isActive ? 'var(--surf3)' : 'transparent'};transition:background .15s;display:flex;align-items:center;gap:4px"
          onclick="openNote(${n.id})"
          onmouseover="if(${!isActive}) this.style.background='var(--wline)'" onmouseout="if(${!isActive}) this.style.background='transparent'">
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;color:${isActive ? 'var(--text)' : 'var(--muted)'};white-space:normal;overflow-wrap:break-word;word-break:break-word;line-height:1.4">${n.title || 'بدون عنوان'}</div>
            <div style="font-size:9px;color:rgba(122,125,138,.5);margin-top:1px">${timeStr}</div>
          </div>
          <!-- زر الحذف — دائماً مرئي -->
          <button onclick="event.stopPropagation();confirmDeleteNote(${n.id},'${(n.title || 'بدون عنوان').replace(/'/g, '&#39;')}')"
            title="حذف الملاحظة"
            style="border:none;background:transparent;color:rgba(122,125,138,.45);cursor:pointer;font-size:13px;padding:3px 5px;border-radius:6px;flex-shrink:0;transition:color .15s,background .15s;line-height:1"
            onmouseover="this.style.color='var(--red)';this.style.background='rgba(246,109,109,.12)'"
            onmouseout="this.style.color='rgba(122,125,138,.45)';this.style.background='transparent'">
            <i class="ti ti-trash" style="font-size:12px"></i>
          </button>
        </div>`;
    }).join('')}
    </div>`;
  });
  sb.innerHTML = html;
}
document.getElementById('notesSidebarBackdrop')?.addEventListener('click', function () {
  if (_notesSidebarOpen) {
    _notesSidebarOpen = false;
    _applyNotesSidebar();
  }
});
function openNote(id) {
  if (_activeNoteId && _notesSaveTimer) {
    saveNotes(true);
  }
  _activeNoteId = id;
  if (isMobile() && _notesSidebarOpen) {
    _notesSidebarOpen = false;
    _applyNotesSidebar();
  }
  renderNotesSidebar();
  renderNoteEditor(id);
}
function renderNoteEditor(id) {
  const note = notes.find(n => n.id == id);
  const editor = document.getElementById('noteEditor');
  if (!editor || !note) return;
  const scrollY = editor.scrollTop;
  editor.innerHTML = `
    <div style="background:var(--surf2);border-radius:20px;padding:18px;display:flex;flex-direction:column;gap:12px;flex:1">

      <!-- عنوان + حذف -->
      <div style="display:flex;align-items:flex-start;gap:8px;border-bottom:1px solid var(--bdr);padding-bottom:10px">
        <input id="noteTitleInput_${id}" value="${(note.title || '').replace(/"/g, '&quot;')}"
          placeholder="عنوان الملاحظة..."
          style="flex:1;background:transparent;border:none;outline:none;font-family:inherit;font-size:18px;font-weight:500;color:var(--text);width:100%"
          oninput="updateNoteField(${id},'title',this.value)">
        <button onclick="confirmDeleteNote(${id},'${(note.title || '').replace(/'/g, "&#39;")}')"
          style="border:none;background:transparent;color:var(--muted);cursor:pointer;font-size:16px;padding:4px 6px;border-radius:8px;flex-shrink:0;transition:color .15s"
          title="حذف الملاحظة" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--muted)'">
          <i class="ti ti-trash"></i>
        </button>
      </div>

      <!-- التصنيف -->
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:11px;color:var(--muted);flex-shrink:0">التصنيف:</span>
        <input id="noteCatInput_${id}" value="${(note.category || '').replace(/"/g, '&quot;')}"
          placeholder="مثال: استراتيجية، أفكار، مراجعة..."
          style="flex:1;background:var(--surf);border:none;outline:none;border-radius:8px;padding:5px 10px;font-family:inherit;font-size:12px;color:var(--text)"
          oninput="updateNoteField(${id},'category',this.value)">
      </div>

      <!-- شريط أدوات المحرر -->
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:4px 0;border-bottom:1px solid var(--bdr);margin-bottom:4px">
        <button onclick="insertTable(${id})" title="إدراج جدول فارغ"
          style="border:none;background:var(--surf3);color:var(--muted);cursor:pointer;font-size:11px;padding:4px 9px;border-radius:7px;font-family:inherit;display:flex;align-items:center;gap:4px;transition:color .15s,background .15s"
          onmouseover="this.style.color='var(--text)';this.style.background='var(--surf)'" onmouseout="this.style.color='var(--muted)';this.style.background='var(--surf3)'">
          <i class="ti ti-table" style="font-size:13px"></i> جدول فارغ
        </button>
        <button onclick="pasteTableFromClipboard(${id})" title="لصق جدول من Excel أو قاعدة البيانات"
          style="border:none;background:rgba(99,179,237,.12);color:var(--accent,#63b3ed);cursor:pointer;font-size:11px;padding:4px 9px;border-radius:7px;font-family:inherit;display:flex;align-items:center;gap:4px;transition:color .15s,background .15s"
          onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
          <i class="ti ti-clipboard-data" style="font-size:13px"></i> لصق جدول
        </button>
        <div style="flex:1"></div>
        <!-- Toggle edit/preview -->
        <div style="display:flex;background:var(--surf3);border-radius:8px;padding:2px;gap:2px">
          <button id="noteTabEdit_${id}" onclick="setNoteViewMode(${id},'edit')"
            style="border:none;cursor:pointer;font-size:11px;padding:3px 10px;border-radius:6px;font-family:inherit;transition:all .15s;background:transparent;color:var(--muted)">
            <i class="ti ti-pencil" style="font-size:11px"></i> تحرير
          </button>
          <button id="noteTabPreview_${id}" onclick="setNoteViewMode(${id},'preview')"
            style="border:none;cursor:pointer;font-size:11px;padding:3px 10px;border-radius:6px;font-family:inherit;transition:all .15s;background:transparent;color:var(--muted)">
            <i class="ti ti-eye" style="font-size:11px"></i> معاينة
          </button>
        </div>
      </div>

      <!-- Body textarea (edit mode) -->
      <textarea id="noteBodyInput_${id}"
        placeholder="اكتب ملاحظتك..."
        style="display:none;flex:1;background:transparent;border:none;outline:none;font-family:inherit;font-size:13px;color:var(--text);resize:none;line-height:1.8;min-height:300px;width:100%"
        oninput="updateNoteField(${id},'body',this.value)"
      >${(note.body || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>

      <!-- Preview panel (hidden by default) -->
      <div id="noteBodyPreview_${id}"
        style="display:block;flex:1;min-height:300px;overflow-y:auto;font-size:13px;line-height:1.8;color:var(--text)"
        class="note-preview-panel">
      </div>

      <!-- شريط الحفظ -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--bdr)">
        <span style="font-size:10px;color:var(--muted)">${note.updatedAt ? 'آخر تعديل: ' + new Date(note.updatedAt).toLocaleString('ar-EG', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }) : note.date || ''}</span>
        <button onclick="saveNotes(true);showToast('تم الحفظ','success')"
          style="border:none;background:rgba(201,168,76,.15);color:var(--gold);border-radius:10px;padding:6px 16px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:500">
          <i class="ti ti-device-floppy"></i> حفظ
        </button>
      </div>
    </div>`;
  editor.scrollTop = scrollY;
  const mode = _noteViewModes[id] || 'preview';
  setTimeout(() => setNoteViewMode(id, mode), 0);
}
function insertText(id, text) {
  const ta = document.getElementById('noteBodyInput_' + id);
  if (!ta) return;
  const start = ta.selectionStart,
    end = ta.selectionEnd;
  const newVal = ta.value.slice(0, start) + text + ta.value.slice(end);
  ta.value = newVal;
  ta.selectionStart = ta.selectionEnd = start + text.length;
  ta.focus();
  updateNoteField(id, 'body', newVal);
}
function insertTable(id) {
  const tbl = '\n| العمود 1 | العمود 2 | العمود 3 |\n|---|---|---|\n| | | |\n| | | |\n';
  insertText(id, tbl);
}
const _noteViewModes = {};
function setNoteViewMode(id, mode) {
  _noteViewModes[id] = mode;
  const ta = document.getElementById('noteBodyInput_' + id);
  const pv = document.getElementById('noteBodyPreview_' + id);
  const btnEdit = document.getElementById('noteTabEdit_' + id);
  const btnPrev = document.getElementById('noteTabPreview_' + id);
  if (!ta || !pv) return;
  if (mode === 'preview') {
    const raw = ta.value;
    if (typeof marked !== 'undefined') {
      marked.setOptions({
        breaks: true,
        gfm: true
      });
      pv.innerHTML = marked.parse(raw);
    } else {
      pv.innerHTML = simpleMarkdownToHtml(raw);
    }
    ta.style.display = 'none';
    pv.style.display = 'block';
    if (btnEdit) {
      btnEdit.style.background = 'transparent';
      btnEdit.style.color = 'var(--muted)';
    }
    if (btnPrev) {
      btnPrev.style.background = 'var(--surf)';
      btnPrev.style.color = 'var(--text)';
    }
  } else {
    ta.style.display = 'block';
    pv.style.display = 'none';
    if (btnEdit) {
      btnEdit.style.background = 'var(--surf)';
      btnEdit.style.color = 'var(--text)';
    }
    if (btnPrev) {
      btnPrev.style.background = 'transparent';
      btnPrev.style.color = 'var(--muted)';
    }
  }
}
function simpleMarkdownToHtml(md) {
  let html = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  const lines = html.split('\n');
  let out = [];
  let inTable = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l.startsWith('|') && l.endsWith('|')) {
      const cells = l.slice(1, -1).split('|').map(c => c.trim());
      if (/^[-: |]+$/.test(l.replace(/[|]/g, ''))) {
        if (!inTable) {
          out.push('<table style="border-collapse:collapse;width:100%;margin:8px 0">');
          inTable = true;
        }
        continue;
      }
      if (!inTable) {
        out.push('<table style="border-collapse:collapse;width:100%;margin:8px 0">');
        inTable = true;
      }
      const tag = !inTable || i === 0 ? 'th' : 'td';
      out.push('<tr>' + cells.map(c => `<${tag} style="border:1px solid var(--bdr);padding:6px 10px;text-align:right">${c}</${tag}>`).join('') + '</tr>');
    } else {
      if (inTable) {
        out.push('</table>');
        inTable = false;
      }
      out.push(l ? `<p style="margin:4px 0">${l}</p>` : '<br>');
    }
  }
  if (inTable) out.push('</table>');
  return out.join('\n');
}
async function pasteTableFromClipboard(id) {
  try {
    const text = await navigator.clipboard.readText();
    if (!text.trim()) {
      showToast('الحافظة فارغة', 'error');
      return;
    }
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 1) {
      showToast('لا يوجد جدول للصق', 'error');
      return;
    }
    const sep = lines[0].includes('\t') ? '\t' : ',';
    const rows = lines.map(l => l.split(sep).map(c => c.trim().replace(/\|/g, '\\|')));
    const colCount = Math.max(...rows.map(r => r.length));
    rows.forEach(r => {
      while (r.length < colCount) r.push('');
    });
    const header = '| ' + rows[0].join(' | ') + ' |';
    const divider = '|' + Array(colCount).fill('---|').join('');
    const body = rows.slice(1).map(r => '| ' + r.join(' | ') + ' |').join('\n');
    const md = '\n' + header + '\n' + divider + '\n' + body + '\n';
    insertText(id, md);
    showToast('تم لصق الجدول ✓', 'success');
  } catch (e) {
    const raw = prompt('الصق محتوى الجدول هنا (من Excel أو قاعدة البيانات):');
    if (!raw) return;
    const lines = raw.trim().split(/\r?\n/);
    const sep = lines[0].includes('\t') ? '\t' : ',';
    const rows = lines.map(l => l.split(sep).map(c => c.trim().replace(/\|/g, '\\|')));
    const colCount = Math.max(...rows.map(r => r.length));
    rows.forEach(r => {
      while (r.length < colCount) r.push('');
    });
    const header = '| ' + rows[0].join(' | ') + ' |';
    const divider = '|' + Array(colCount).fill('---|').join('');
    const body = rows.slice(1).map(r => '| ' + r.join(' | ') + ' |').join('\n');
    const md = '\n' + header + '\n' + divider + '\n' + body + '\n';
    insertText(id, md);
    showToast('تم لصق الجدول ✓', 'success');
  }
}
function updateNoteField(id, field, val) {
  const n = notes.find(x => x.id == id);
  if (!n) return;
  n[field] = val;
  n.updatedAt = new Date().toISOString();
  saveNotes();
  if (field === 'title') renderNotesSidebar();
}
function addNote() {
  openModal('newNoteModal');
  setTimeout(() => document.getElementById('newNoteTitleInput')?.focus(), 100);
}
function confirmAddNote() {
  const title = (document.getElementById('newNoteTitleInput')?.value || '').trim();
  const cat = (document.getElementById('newNoteCatInput')?.value || '').trim();
  const now = new Date().toISOString();
  const n = {
    id: Date.now(),
    title: title || 'ملاحظة جديدة',
    category: cat || 'عام',
    body: '',
    date: new Date().toLocaleDateString('ar-EG'),
    createdAt: now,
    updatedAt: now,
    pinned: false,
    archived: false
  };
  notes.unshift(n);
  _activeNoteId = n.id;
  saveNotes(true);
  closeModal('newNoteModal');
  document.getElementById('newNoteTitleInput').value = '';
  document.getElementById('newNoteCatInput').value = '';
  renderNotes();
  setTimeout(() => document.getElementById('noteBodyInput_' + n.id)?.focus(), 150);
}
function confirmDeleteNote(id, title) {
  const displayTitle = title || 'هذه الملاحظة';
  if (!confirm(`حذف "${displayTitle}" نهائياً؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) return;
  deleteNote(id, true);
}
function deleteNote(id, skipConfirm) {
  if (!skipConfirm && !confirm('حذف هذه الملاحظة؟')) return;
  notes = notes.filter(n => n.id != id);
  if (_activeNoteId == id) {
    _activeNoteId = notes[0]?.id || null;
    const editor = document.getElementById('noteEditor');
    if (editor && !_activeNoteId) {
      editor.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:40px 0;text-align:center">اختر ملاحظة أو أنشئ واحدة جديدة</div>';
    }
  }
  saveNotes(true);
  renderNotes();
}
function adjustNotesLayout() {
  if (!isMobile()) _notesSidebarOpen = true;
  _applyNotesSidebar();
}

let _goalEditKey = null;
function openGoalEdit(key, label, current) {
  _goalEditKey = key;
  const lbl = $('goalEditLabel');
  if (lbl) lbl.textContent = label;
  const inp = $('goalEditInput');
  if (inp) {
    inp.value = current > 0 ? Math.round(sarToBase(current)) : '';
    inp.focus();
  }
  const hint = $('goalCurHint');
  if (hint) hint.textContent = '(' + CUR_SYMS[baseCur] + ' ' + baseCur + ')';
  openModal('goalEditModal');
}
function saveGoalEdit() {
  if (!_goalEditKey) return;
  const val = parseFloat($('goalEditInput')?.value) || 0;
  catGoals[_goalEditKey] = val > 0 ? val * (fx[baseCur] && baseCur !== 'SAR' ? fx[baseCur] : 1) : 0;
  saveCatGoals();
  closeModal('goalEditModal');
  renderAll();
}
$('goalEditModal')?.addEventListener('click', e => {
  if (e.target === $('goalEditModal')) closeModal('goalEditModal');
});
loadNotes();
adjustNotesLayout();
(function () {
  var btnR = document.getElementById('btnGlobalRefresh');
  if (btnR) btnR.addEventListener('click', globalRefresh);
  var btnM = document.getElementById('btnManualSave');
  if (btnM) btnM.addEventListener('click', ()=>manualSave(false));
})();
(function () {
  var isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  var isStandalone = window.navigator.standalone === true;
  var dismissed = localStorage.getItem('iosBannerDismissed');
  if (isIOS && !isStandalone && !dismissed) {
    setTimeout(function () {
      document.getElementById('iosBanner').style.display = 'block';
    }, 2500);
  }
})();
let _activeBgId = 'default';
let _accentColor = '#c9a84c';
let _cardOpacity = 60;
let _cardBlur = 0;
let _bgOverlay = 0;
let _bgBlur = 0;
let _textPrimary = '#e8e6df';
let _textSecondary = '#7a7d8a';
let _cardTint = 'dark';
let _cardTintColor = '#1a1d28';
let _thColor = '#7a7d8a';
let _heroValColor = '#ffffff';
let _pageTitleColor = '#e8e6df';
let _bgImgTab = 'desktop';
let _bgUrlDesktop = '';
let _bgUrlMobile = '';
const BG_PRESETS = [{
  id: 'default',
  label: 'ذهبي',
  dark: true,
  thumb: 'linear-gradient(135deg,rgba(201,168,76,0.9),rgba(92,159,255,0.6),rgba(62,207,142,0.5))',
  bg: `radial-gradient(ellipse 65% 55% at 12% 28%,rgba(201,168,76,0.13),transparent),radial-gradient(ellipse 55% 45% at 88% 12%,rgba(92,159,255,0.10),transparent),radial-gradient(ellipse 60% 50% at 68% 82%,rgba(62,207,142,0.08),transparent),#080a10`
}, {
  id: 'purple',
  label: 'بنفسجي',
  dark: true,
  thumb: 'linear-gradient(135deg,#4a0e8f,#7c3aed,#a855f7)',
  bg: `radial-gradient(ellipse 65% 55% at 15% 30%,rgba(124,58,237,0.20),transparent),radial-gradient(ellipse 55% 45% at 85% 15%,rgba(168,85,247,0.15),transparent),#06040e`
}, {
  id: 'ocean',
  label: 'محيطي',
  dark: true,
  thumb: 'linear-gradient(135deg,#0c4a6e,#0284c7,#06b6d4)',
  bg: `radial-gradient(ellipse 65% 55% at 15% 30%,rgba(6,182,212,0.16),transparent),radial-gradient(ellipse 55% 45% at 85% 10%,rgba(3,105,161,0.20),transparent),#030d14`
}, {
  id: 'forest',
  label: 'غابة',
  dark: true,
  thumb: 'linear-gradient(135deg,#052e16,#166534,#22c55e)',
  bg: `radial-gradient(ellipse 65% 55% at 12% 28%,rgba(34,197,94,0.16),transparent),radial-gradient(ellipse 55% 45% at 88% 12%,rgba(20,184,166,0.12),transparent),#030d06`
}, {
  id: 'sunset',
  label: 'غروب',
  dark: true,
  thumb: 'linear-gradient(135deg,#7c1d3f,#c2410c,#f59e0b)',
  bg: `radial-gradient(ellipse 65% 55% at 15% 30%,rgba(245,158,11,0.18),transparent),radial-gradient(ellipse 55% 45% at 85% 15%,rgba(220,38,38,0.16),transparent),#0e0604`
}, {
  id: 'rose',
  label: 'وردي',
  dark: true,
  thumb: 'linear-gradient(135deg,#500724,#9f1239,#ec4899)',
  bg: `radial-gradient(ellipse 65% 55% at 15% 30%,rgba(236,72,153,0.18),transparent),radial-gradient(ellipse 55% 45% at 85% 15%,rgba(190,18,60,0.20),transparent),#0d040a`
}, {
  id: 'slate',
  label: 'رصاصي',
  dark: true,
  thumb: 'linear-gradient(135deg,#1e293b,#475569,#94a3b8)',
  bg: `radial-gradient(ellipse 65% 55% at 15% 30%,rgba(71,85,105,0.22),transparent),radial-gradient(ellipse 55% 45% at 85% 15%,rgba(100,116,139,0.16),transparent),#080c12`
}, {
  id: 'midnight',
  label: 'ليلي',
  dark: true,
  thumb: 'linear-gradient(135deg,#0a0a0f,#1a1a2e,#16213e)',
  bg: `radial-gradient(ellipse 65% 55% at 15% 30%,rgba(30,30,90,0.22),transparent),radial-gradient(ellipse 55% 45% at 85% 15%,rgba(22,33,62,0.28),transparent),#03030a`
}, {
  id: 'light-pearl',
  label: 'لؤلؤي',
  dark: false,
  lightVars: {
    bg: '#f5f1eb',
    surf: '#ffffff',
    surf2: '#ede8e0',
    bdr: 'rgba(0,0,0,0.08)',
    bdr2: 'rgba(0,0,0,0.15)',
    text: '#1a1a2e',
    muted: '#5a5c6a',
    bodyBg: '#f0ece4'
  },
  thumb: 'linear-gradient(135deg,#f0ece4,#e8e0d8,#c9b88a)',
  bg: `radial-gradient(ellipse 70% 60% at 15% 25%,rgba(201,168,76,0.14),transparent),radial-gradient(ellipse 60% 50% at 85% 80%,rgba(92,159,255,0.09),transparent),#f5f1eb`
}, {
  id: 'light-sky',
  label: 'سماوي',
  dark: false,
  lightVars: {
    bg: '#eaf7ff',
    surf: '#ffffff',
    surf2: '#daf0fb',
    bdr: 'rgba(0,0,0,0.08)',
    bdr2: 'rgba(0,0,0,0.14)',
    text: '#0c2a3a',
    muted: '#4a6878',
    bodyBg: '#daeef9'
  },
  thumb: 'linear-gradient(135deg,#bae6fd,#7dd3fc,#38bdf8)',
  bg: `radial-gradient(ellipse 70% 55% at 20% 30%,rgba(56,189,248,0.22),transparent),radial-gradient(ellipse 55% 45% at 80% 70%,rgba(14,165,233,0.16),transparent),#eaf7ff`
}, {
  id: 'light-mint',
  label: 'نعناعي',
  dark: false,
  lightVars: {
    bg: '#edfdf5',
    surf: '#ffffff',
    surf2: '#d8f8ea',
    bdr: 'rgba(0,0,0,0.08)',
    bdr2: 'rgba(0,0,0,0.14)',
    text: '#0a2e1c',
    muted: '#3d6a52',
    bodyBg: '#d4f5e4'
  },
  thumb: 'linear-gradient(135deg,#bbf7d0,#86efac,#4ade80)',
  bg: `radial-gradient(ellipse 65% 55% at 20% 30%,rgba(74,222,128,0.22),transparent),radial-gradient(ellipse 55% 45% at 80% 70%,rgba(16,185,129,0.15),transparent),#edfdf5`
}, {
  id: 'light-lavender',
  label: 'لافندر',
  dark: false,
  lightVars: {
    bg: '#f5f0ff',
    surf: '#ffffff',
    surf2: '#ede5ff',
    bdr: 'rgba(0,0,0,0.08)',
    bdr2: 'rgba(0,0,0,0.14)',
    text: '#1e0a3c',
    muted: '#5a4a78',
    bodyBg: '#ede4ff'
  },
  thumb: 'linear-gradient(135deg,#e9d5ff,#c084fc,#a855f7)',
  bg: `radial-gradient(ellipse 65% 55% at 20% 25%,rgba(168,85,247,0.20),transparent),radial-gradient(ellipse 60% 50% at 80% 75%,rgba(139,92,246,0.13),transparent),#f5f0ff`
}, {
  id: 'light-warm',
  label: 'دافئ',
  dark: false,
  lightVars: {
    bg: '#fff7ed',
    surf: '#ffffff',
    surf2: '#fce8d0',
    bdr: 'rgba(0,0,0,0.08)',
    bdr2: 'rgba(0,0,0,0.14)',
    text: '#2c1a0a',
    muted: '#6b4c2a',
    bodyBg: '#fce4c4'
  },
  thumb: 'linear-gradient(135deg,#fed7aa,#fb923c,#f97316)',
  bg: `radial-gradient(ellipse 65% 55% at 20% 30%,rgba(249,115,22,0.20),transparent),radial-gradient(ellipse 55% 45% at 80% 70%,rgba(234,88,12,0.14),transparent),#fff7ed`
}, {
  id: 'light-rose',
  label: 'وردي ف',
  dark: false,
  lightVars: {
    bg: '#fdf2f8',
    surf: '#ffffff',
    surf2: '#fce4f4',
    bdr: 'rgba(0,0,0,0.08)',
    bdr2: 'rgba(0,0,0,0.14)',
    text: '#2c0a1e',
    muted: '#7a3a5c',
    bodyBg: '#fcdcf0'
  },
  thumb: 'linear-gradient(135deg,#fce7f3,#f9a8d4,#ec4899)',
  bg: `radial-gradient(ellipse 65% 55% at 20% 30%,rgba(236,72,153,0.18),transparent),radial-gradient(ellipse 55% 45% at 80% 70%,rgba(219,39,119,0.11),transparent),#fdf2f8`
}];
const _cardTintStyle = (() => {
  const s = document.createElement('style');
  s.id = 'cardTintStyle';
  document.head.appendChild(s);
  return s;
})();
const _cardBlurStyle = (() => {
  const s = document.createElement('style');
  s.id = 'cardBlurStyle';
  document.head.appendChild(s);
  return s;
})();
function applyBodyBg() {
  const root = document.getElementById('bgLayer');
  if (!root) return;
  const mob = typeof isMobile === 'function' ? isMobile() : window.innerWidth < 768;
  const fitKey = mob ? 'bgFitMobile' : 'bgFitDesktop';
  const fit = localStorage.getItem(fitKey) || 'cover';
  const bgSize = fit === 'stretch' ? '100% 100%' : fit === 'contain' ? 'contain' : 'cover';
  const url = mob ? _bgUrlMobile || _bgUrlDesktop : _bgUrlDesktop || _bgUrlMobile;
  if (url) {
    root.style.backgroundImage = `url('${url}')`;
    root.style.backgroundSize = bgSize;
    root.style.backgroundPosition = 'center';
    root.style.backgroundRepeat = 'no-repeat';
    root.style.backgroundColor = '#080a10';
    const blur = document.getElementById('bgLayerBlur');
    if (blur) {
      blur.style.backgroundImage = `url('${url}')`;
      blur.style.backgroundSize = bgSize;
      blur.style.backgroundPosition = 'center';
    }
  } else {
    const preset = BG_PRESETS.find(p => p.id === _activeBgId) || BG_PRESETS[0];
    root.style.backgroundImage = '';
    root.style.background = preset.bg;
    const blur = document.getElementById('bgLayerBlur');
    if (blur) blur.style.backgroundImage = '';
  }
}
function applyCardOpacity(val) {
  _cardOpacity = parseInt(val);
  saveAppearanceSettings();
  const v = document.getElementById('cardOpacityVal');
  if (v) v.textContent = _cardOpacity + '%';
  _applyCardTintCSS();
}
function _applyCardTintCSS() {
  const a = (_cardOpacity / 100).toFixed(2);
  const ah = Math.min(parseFloat(a) + 0.10, 0.97).toFixed(2);
  let r, g, b;
  if (_cardTint === 'light') {
    r = 240;
    g = 240;
    b = 248;
  } else if (_cardTint === 'custom') {
    const h = _cardTintColor || '#1a1d28';
    r = parseInt(h.slice(1, 3), 16) || 26;
    g = parseInt(h.slice(3, 5), 16) || 29;
    b = parseInt(h.slice(5, 7), 16) || 40;
  } else {
    r = 22;
    g = 26;
    b = 42;
  }
  const cb = `rgba(${r},${g},${b},${a})`;
  const cbh = `rgba(${Math.min(r + 10, 255)},${Math.min(g + 10, 255)},${Math.min(b + 10, 255)},${ah})`;
  const hero = `linear-gradient(135deg,rgba(${r},${g},${b},${a}),rgba(${Math.min(r + 6, 255)},${Math.min(g + 6, 255)},${Math.min(b + 14, 255)},${a}))`;
  const root = document.documentElement;
  root.style.setProperty('--cb', cb);
  root.style.setProperty('--cbh', cbh);
  root.style.setProperty('--chero', hero);
  root.style.setProperty('--th-bg', cb);
  const sel = document.getElementById('selectionBar');
  if (sel) sel.style.background = cb;
}
function applyCardBlur(val) {
  _cardBlur = parseInt(val);
  saveAppearanceSettings();
  const v = document.getElementById('cardBlurVal');
  if (v) v.textContent = _cardBlur + 'px';
  const b = _cardBlur > 0 ? `blur(${_cardBlur}px)` : 'none';
  _cardBlurStyle.textContent = _cardBlur > 0 ? `.hero,.card,.stat-card,.asset-card,.other-card,.reg-card,.total-card,.refresh-bar,.perf-item,.glass-card{backdrop-filter:${b}!important;-webkit-backdrop-filter:${b}!important;}` : '';
}
function applyBgOverlay(val) {
  _bgOverlay = parseInt(val);
  saveAppearanceSettings();
  const v = document.getElementById('bgOverlayVal');
  if (v) v.textContent = _bgOverlay + '%';
  const el = document.getElementById('bgOverlay');
  if (el) el.style.background = `rgba(8,10,16,${(_bgOverlay / 100).toFixed(2)})`;
}
function applyGlassBlur(val) {
  _bgBlur = parseInt(val);
  saveAppearanceSettings();
  const v = document.getElementById('bgBlurVal');
  if (v) v.textContent = _bgBlur + 'px';
  const layer = document.getElementById('bgLayer');
  if (!layer) return;
  if (_bgBlur > 0) {
    const spread = _bgBlur * 2;
    layer.style.inset = `-${spread}px`;
    layer.style.filter = `blur(${_bgBlur}px)`;
    layer.style.width = `calc(100% + ${spread * 2}px)`;
    layer.style.height = `calc(100% + ${spread * 2}px)`;
  } else {
    layer.style.inset = '0';
    layer.style.filter = 'none';
    layer.style.width = '';
    layer.style.height = '';
  }
}
function applyBgBlur(val) {
  applyGlassBlur(val);
}
function _lightenColor(hex, f = 0.35) {
  let r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  r = Math.round(r + (255 - r) * f);
  g = Math.round(g + (255 - g) * f);
  b = Math.round(b + (255 - b) * f);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}
function applyAccentColorFree(color) {
  _accentColor = color;
  document.documentElement.style.setProperty('--gold', color);
  document.documentElement.style.setProperty('--goldL', _lightenColor(color, 0.38));
  const p = document.getElementById('accentColorPicker');
  if (p) p.value = color;
  const l = document.getElementById('accentColorLabel');
  if (l) l.textContent = color;
  saveAppearanceSettings();
}
function resetAccentColor() {
  applyAccentColorFree('#c9a84c');
}
function applyAccentColor() {
  applyAccentColorFree(_accentColor);
}
function renderAccentGrid() {}
function applyTextColor(type, color) {
  if (type === 'primary') {
    _textPrimary = color;
    document.documentElement.style.setProperty('--text', color);
    const p = document.getElementById('textColorPrimaryPreview');
    if (p) p.style.color = color;
  } else {
    _textSecondary = color;
    document.documentElement.style.setProperty('--muted', color);
    const p = document.getElementById('textColorSecondaryPreview');
    if (p) p.style.color = color;
  }
  saveAppearanceSettings();
}
function resetTextColor(type) {
  if (type === 'primary') applyTextColor('primary', '#e8e6df');else applyTextColor('secondary', '#7a7d8a');
}
function applyHeroValColor(color) {
  _heroValColor = color;
  document.documentElement.style.setProperty('--hero-val-color', color);
  const p = document.getElementById('heroValPreview');
  if (p) p.style.color = color;
  const e = document.getElementById('heroValColorPicker');
  if (e) e.value = color;
  saveAppearanceSettings();
}
function applyPageTitleColor(color) {
  _pageTitleColor = color;
  document.documentElement.style.setProperty('--page-title-color', color);
  const p = document.getElementById('pageTitlePreview');
  if (p) p.style.color = color;
  const e = document.getElementById('pageTitlePicker');
  if (e) e.value = color;
  saveAppearanceSettings();
}
function applyThColor(color) {
  _thColor = color;
  document.documentElement.style.setProperty('--th-bg', color);
  const p = document.getElementById('thColorPreview');
  if (p) p.style.background = color;
  const e = document.getElementById('thColorPicker');
  if (e) e.value = color;
  saveAppearanceSettings();
}
function applyCardTint(mode, color) {
  _cardTint = mode;
  if (color) _cardTintColor = color;
  localStorage.setItem('cardTint', _cardTint);
  localStorage.setItem('cardTintColor', _cardTintColor);
  ['dark', 'light', 'custom'].forEach(m => {
    const b = document.getElementById('tint' + m.charAt(0).toUpperCase() + m.slice(1));
    if (!b) return;
    const on = m === mode;
    b.style.borderColor = on ? 'rgba(201,168,76,0.5)' : 'var(--wline)';
    b.style.color = on ? 'var(--gold)' : 'var(--muted)';
    b.style.background = on ? 'rgba(201,168,76,0.12)' : 'var(--wline)';
  });
  const cr = document.getElementById('cardTintCustomRow');
  if (cr) cr.style.display = mode === 'custom' ? 'flex' : 'none';
  _applyCardTintCSS();
  saveAppearanceSettings();
}
function applyCardTintCustom(color) {
  _cardTintColor = color;
  localStorage.setItem('cardTintColor', color);
  _applyCardTintCSS();
  saveAppearanceSettings();
}
function applyPresetBg(id) {
  _activeBgId = id;
  _bgUrlDesktop = '';
  _bgUrlMobile = '';
  localStorage.setItem('bgId', id);
  localStorage.removeItem('bgUrl_desktop');
  localStorage.removeItem('bgUrl_mobile');
  _applyThemeVars(id);
  applyBodyBg();
  renderBgPresets();
  updateCustomBgUI();
  saveAppearanceSettings();
}
function _applyThemeVars(id) {
  const p = BG_PRESETS.find(x => x.id === id);
  const r = document.documentElement;
  if (p && p.dark === false && p.lightVars) {
    const v = p.lightVars;
    r.style.setProperty('--surf', v.surf);
    r.style.setProperty('--surf2', v.surf2);
    r.style.setProperty('--bdr', v.bdr);
    r.style.setProperty('--bdr2', v.bdr2);
    r.style.setProperty('--text', v.text);
    r.style.setProperty('--muted', v.muted);
    document.body.style.background = v.bodyBg || v.bg;
  } else {
    r.style.setProperty('--surf', '#14171f');
    r.style.setProperty('--surf2', '#1c2030');
    r.style.setProperty('--bdr', 'var(--wline)');
    r.style.setProperty('--bdr2', 'var(--hairline)');
    r.style.setProperty('--text', _textPrimary || '#e8e6df');
    r.style.setProperty('--muted', _textSecondary || '#7a7d8a');
    document.body.style.background = '';
  }
}
function renderBgPresets() {
  const grid = document.getElementById('bgPresetsGrid');
  if (!grid) return;
  const dark = BG_PRESETS.filter(p => p.dark !== false);
  const light = BG_PRESETS.filter(p => p.dark === false);
  function grp(label, list) {
    if (!list.length) return '';
    return `<div style="font-size:10px;color:var(--muted);margin:8px 0 5px">${label}</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:6px">
    ${list.map(p => {
      const sel = _activeBgId === p.id && !_bgUrlDesktop && !_bgUrlMobile;
      return `<div onclick="applyPresetBg('${p.id}')" style="cursor:pointer;border-radius:11px;overflow:hidden;aspect-ratio:1;background:${p.thumb};position:relative;border:2px solid ${sel ? 'var(--gold)' : 'var(--hairline)'};transition:all .2s">
        ${sel ? '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.32)"><i class="ti ti-check" style="color:#fff;font-size:15px"></i></div>' : ''}
        <div style="position:absolute;bottom:0;left:0;right:0;padding:3px 4px;background:rgba(0,0,0,0.55);font-size:9px;color:rgba(255,255,255,0.9);text-align:center">${p.label}</div>
      </div>`;
    }).join('')}
    </div>`;
  }
  grid.innerHTML = grp('🌑 داكنة', dark) + grp('☀️ فاتحة', light);
}
function applyBgUrl() {
  const inp = document.getElementById('bgUrlInput');
  if (!inp) return;
  const url = inp.value.trim();
  if (!url) {
    showToast('أدخل رابط الصورة');
    return;
  }
  if (_bgImgTab === 'mobile') _bgUrlMobile = url;else _bgUrlDesktop = url;
  localStorage.setItem('bgUrl_' + _bgImgTab, url);
  _activeBgId = 'custom';
  applyBodyBg();
  updateCustomBgUI();
  renderBgPresets();
  saveAppearanceSettings();
  showToast('✓ تم تطبيق الصورة');
}
function removeCustomBg() {
  if (_bgImgTab === 'mobile') _bgUrlMobile = '';else _bgUrlDesktop = '';
  localStorage.removeItem('bgUrl_' + _bgImgTab);
  if (!_bgUrlDesktop && !_bgUrlMobile) _activeBgId = localStorage.getItem('bgId') || 'default';
  applyBodyBg();
  updateCustomBgUI();
  renderBgPresets();
  saveAppearanceSettings();
}
function setBgImgTab(tab) {
  _bgImgTab = tab;
  const dBtn = document.getElementById('bgImgTabDesktop'),
    mBtn = document.getElementById('bgImgTabMobile');
  const act = 'rgba(201,168,76,0.15)',
    inact = 'var(--wline)';
  if (dBtn) {
    dBtn.style.background = tab === 'desktop' ? act : inact;
    dBtn.style.color = tab === 'desktop' ? 'var(--gold)' : 'var(--muted)';
    dBtn.style.borderColor = tab === 'desktop' ? 'rgba(201,168,76,0.4)' : 'var(--wline)';
  }
  if (mBtn) {
    mBtn.style.background = tab === 'mobile' ? act : inact;
    mBtn.style.color = tab === 'mobile' ? 'var(--gold)' : 'var(--muted)';
    mBtn.style.borderColor = tab === 'mobile' ? 'rgba(201,168,76,0.4)' : 'var(--wline)';
  }
  updateCustomBgUI();
}
function updateCustomBgUI() {
  const url = _bgImgTab === 'mobile' ? _bgUrlMobile : _bgUrlDesktop;
  const fitK = _bgImgTab === 'mobile' ? 'bgFitMobile' : 'bgFitDesktop';
  const fit = localStorage.getItem(fitK) || 'cover';
  const hasUrl = !!url;
  const prev = document.getElementById('bgImgPreview'),
    thumb = document.getElementById('bgImgThumb'),
    lbl = document.getElementById('bgImgPreviewLabel'),
    fitRow = document.getElementById('bgFitRow'),
    inp = document.getElementById('bgUrlInput');
  if (prev) prev.style.display = hasUrl ? 'block' : 'none';
  if (thumb && url) thumb.src = url;
  if (lbl) lbl.textContent = (_bgImgTab === 'mobile' ? 'موبايل' : 'ديسكتوب') + ' — مفعّلة';
  if (fitRow) fitRow.style.display = hasUrl ? 'flex' : 'none';
  if (inp) inp.value = url || '';
  ['cover', 'contain', 'stretch'].forEach(f => {
    const fb = document.getElementById('bgFit' + f.charAt(0).toUpperCase() + f.slice(1));
    if (!fb) return;
    fb.style.background = fit === f ? 'rgba(201,168,76,0.15)' : 'var(--wline)';
    fb.style.color = fit === f ? 'var(--gold)' : 'var(--muted)';
    fb.style.borderColor = fit === f ? 'rgba(201,168,76,0.4)' : 'var(--wline)';
  });
}
function applyBgFit(fit) {
  const fitK = _bgImgTab === 'mobile' ? 'bgFitMobile' : 'bgFitDesktop';
  localStorage.setItem(fitK, fit);
  applyBodyBg();
  updateCustomBgUI();
  saveAppearanceSettings();
}
let _appearanceSaveTimer = null;
function saveAppearanceSettings() {
  const data = {
    bgId: _activeBgId,
    accentColor: _accentColor,
    cardOpacity: _cardOpacity,
    cardBlur: _cardBlur,
    bgOverlay: _bgOverlay,
    bgBlur: _bgBlur,
    textPrimary: _textPrimary,
    textSecondary: _textSecondary,
    cardTint: _cardTint,
    cardTintColor: _cardTintColor,
    thColor: _thColor,
    heroValColor: _heroValColor,
    pageTitleColor: _pageTitleColor,
    bgFitDesktop: localStorage.getItem('bgFitDesktop') || 'cover',
    bgFitMobile: localStorage.getItem('bgFitMobile') || 'cover',
    bgUrlDesktop: _bgUrlDesktop,
    bgUrlMobile: _bgUrlMobile
  };
  Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, String(v)));
  if (typeof _cloudMode !== 'undefined' && _cloudMode) {
    clearTimeout(_appearanceSaveTimer);
    _appearanceSaveTimer = setTimeout(() => portfolioAPI.saveSetting('appearance', JSON.stringify(data)), 800);
  }
}
function resetSection(section) {
  if (section === 'bg') {
    _activeBgId = 'default';
    _bgOverlay = 0;
    _bgBlur = 0;
    _bgUrlDesktop = '';
    _bgUrlMobile = '';
    localStorage.removeItem('bgUrl_desktop');
    localStorage.removeItem('bgUrl_mobile');
    localStorage.setItem('bgFitDesktop', 'cover');
    localStorage.setItem('bgFitMobile', 'cover');
    applyBodyBg();
    applyBgOverlay(0);
    applyGlassBlur(0);
    renderBgPresets();
    updateCustomBgUI();
    const s1 = document.getElementById('bgOverlaySlider'),
      s2 = document.getElementById('bgBlurSlider');
    if (s1) s1.value = 0;
    if (s2) s2.value = 0;
  } else if (section === 'cards') {
    _cardOpacity = 60;
    _cardBlur = 0;
    _cardTint = 'dark';
    _cardTintColor = '#1a1d28';
    applyCardOpacity(60);
    applyCardBlur(0);
    applyCardTint('dark');
    const s1 = document.getElementById('cardOpacitySlider'),
      s2 = document.getElementById('cardBlurSlider');
    if (s1) s1.value = 60;
    if (s2) s2.value = 0;
  } else if (section === 'colors') {
    applyAccentColorFree('#c9a84c');
    applyTextColor('primary', '#e8e6df');
    applyTextColor('secondary', '#7a7d8a');
    applyThColor('#7a7d8a');
    applyHeroValColor('#ffffff');
    applyPageTitleColor('#e8e6df');
  }
  saveAppearanceSettings();
  showToast('✓ تم إعادة ضبط القسم');
}
function resetAllAppearance() {
  if (!confirm('إعادة ضبط كل إعدادات المظهر؟')) return;
  _activeBgId = 'default';
  _accentColor = '#c9a84c';
  _cardOpacity = 60;
  _cardBlur = 0;
  _bgOverlay = 0;
  _bgBlur = 0;
  _textPrimary = '#e8e6df';
  _textSecondary = '#7a7d8a';
  _cardTint = 'dark';
  _cardTintColor = '#1a1d28';
  _thColor = '#7a7d8a';
  _heroValColor = '#ffffff';
  _pageTitleColor = '#e8e6df';
  _bgUrlDesktop = '';
  _bgUrlMobile = '';
  localStorage.removeItem('bgUrl_desktop');
  localStorage.removeItem('bgUrl_mobile');
  localStorage.setItem('bgFitDesktop', 'cover');
  localStorage.setItem('bgFitMobile', 'cover');
  applyBodyBg();
  applyCardOpacity(60);
  applyCardBlur(0);
  applyBgOverlay(0);
  applyGlassBlur(0);
  applyAccentColorFree('#c9a84c');
  applyTextColor('primary', '#e8e6df');
  applyTextColor('secondary', '#7a7d8a');
  applyThColor('#7a7d8a');
  applyHeroValColor('#ffffff');
  applyPageTitleColor('#e8e6df');
  applyCardTint('dark');
  saveAppearanceSettings();
  showToast('✓ تم إعادة الضبط');
}
function initAppearancePage() {
  const s = (id, v) => {
    const e = document.getElementById(id);
    if (e) e.value = v;
  };
  const t = (id, v) => {
    const e = document.getElementById(id);
    if (e) e.textContent = v;
  };
  s('cardOpacitySlider', _cardOpacity);
  t('cardOpacityVal', _cardOpacity + '%');
  s('cardBlurSlider', _cardBlur);
  t('cardBlurVal', _cardBlur + 'px');
  s('bgOverlaySlider', _bgOverlay);
  t('bgOverlayVal', _bgOverlay + '%');
  s('bgBlurSlider', _bgBlur);
  t('bgBlurVal', _bgBlur + 'px');
  s('accentColorPicker', _accentColor);
  s('textColorPrimary', _textPrimary);
  s('textColorSecondary', _textSecondary);
  s('thColorPicker', _thColor);
  s('heroValColorPicker', _heroValColor);
  s('pageTitlePicker', _pageTitleColor);
  const pp = document.getElementById('textColorPrimaryPreview');
  if (pp) pp.style.color = _textPrimary;
  const ps = document.getElementById('textColorSecondaryPreview');
  if (ps) ps.style.color = _textSecondary;
  const pa = document.getElementById('accentColorLabel');
  if (pa) pa.textContent = _accentColor;
  const pt = document.getElementById('thColorPreview');
  if (pt) pt.style.background = _thColor;
  const ph = document.getElementById('heroValPreview');
  if (ph) ph.style.color = _heroValColor;
  const pp2 = document.getElementById('pageTitlePreview');
  if (pp2) pp2.style.color = _pageTitleColor;
  applyCardTint(_cardTint);
  const ctc = document.getElementById('cardTintCustomColor');
  if (ctc) ctc.value = _cardTintColor;
  _bgImgTab = typeof isMobile === 'function' && isMobile() ? 'mobile' : 'desktop';
  setBgImgTab(_bgImgTab);
  renderBgPresets();
  updateCustomBgUI();
}
function saveAppearanceToSheet() {
  const btn = document.getElementById('btnSaveAppearance');
  if (btn) {
    btn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin .8s linear infinite"></i> جاري الحفظ...';
    btn.disabled = true;
  }
  const data = {
    bgId: _activeBgId,
    accentColor: _accentColor,
    cardOpacity: _cardOpacity,
    cardBlur: _cardBlur,
    bgOverlay: _bgOverlay,
    bgBlur: _bgBlur,
    textPrimary: _textPrimary,
    textSecondary: _textSecondary,
    cardTint: _cardTint,
    cardTintColor: _cardTintColor,
    thColor: _thColor,
    heroValColor: _heroValColor,
    pageTitleColor: _pageTitleColor,
    bgFitDesktop: localStorage.getItem('bgFitDesktop') || 'cover',
    bgFitMobile: localStorage.getItem('bgFitMobile') || 'cover',
    bgUrlDesktop: _bgUrlDesktop,
    bgUrlMobile: _bgUrlMobile
  };
  Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, String(v)));
  if (typeof _cloudMode !== 'undefined' && _cloudMode) {
    clearTimeout(_appearanceSaveTimer);
    portfolioAPI.withSuccessHandler(() => {
      showToast('✓ تم حفظ إعدادات المظهر على قاعدة البيانات');
      if (btn) {
        btn.innerHTML = '<i class="ti ti-check"></i> تم الحفظ';
        btn.style.borderColor = 'var(--green)';
        btn.style.color = 'var(--green)';
        setTimeout(() => {
          btn.innerHTML = '<i class="ti ti-device-floppy"></i> حفظ الإعدادات';
          btn.style.borderColor = 'rgba(201,168,76,0.35)';
          btn.style.color = 'var(--gold)';
          btn.disabled = false;
        }, 2000);
      }
    }).withFailureHandler(e => {
      showToast('✗ فشل الحفظ: ' + e);
      if (btn) {
        btn.innerHTML = '<i class="ti ti-device-floppy"></i> حفظ الإعدادات';
        btn.disabled = false;
      }
    }).saveSetting('appearance', JSON.stringify(data));
  } else {
    showToast('✓ محفوظ محلياً (غير متصل بقاعدة البيانات)');
    if (btn) {
      btn.innerHTML = '<i class="ti ti-device-floppy"></i> حفظ الإعدادات';
      btn.disabled = false;
    }
  }
}
function toggleBgPanel() {
  showPage('appearance');
}
function closeBgPanel() {}
(function initAppearance() {
  return;
  _bgUrlDesktop = localStorage.getItem('bgUrl_desktop') || localStorage.getItem('bgUrlDesktop') || '';
  _bgUrlMobile = localStorage.getItem('bgUrl_mobile') || localStorage.getItem('bgUrlMobile') || '';
  _activeBgId = localStorage.getItem('bgId') || 'default';
  _accentColor = localStorage.getItem('accentColor') || '#c9a84c';
  _cardOpacity = parseInt(localStorage.getItem('cardOpacity') || '60');
  _cardBlur = parseInt(localStorage.getItem('cardBlur') || '0');
  _bgOverlay = parseInt(localStorage.getItem('bgOverlay') || '0');
  _bgBlur = parseInt(localStorage.getItem('bgBlur') || '0');
  _textPrimary = localStorage.getItem('textPrimary') || '#e8e6df';
  _textSecondary = localStorage.getItem('textSecondary') || '#7a7d8a';
  _cardTint = localStorage.getItem('cardTint') || 'dark';
  _cardTintColor = localStorage.getItem('cardTintColor') || '#1a1d28';
  _thColor = localStorage.getItem('thColor') || '#7a7d8a';
  _heroValColor = localStorage.getItem('heroValColor') || '#ffffff';
  _pageTitleColor = localStorage.getItem('pageTitleColor') || '#e8e6df';
  if (_bgUrlDesktop || _bgUrlMobile) _activeBgId = 'custom';
  _applyThemeVars(_activeBgId);
  applyBodyBg();
  applyAccentColorFree(_accentColor);
  document.documentElement.style.setProperty('--text', _textPrimary);
  document.documentElement.style.setProperty('--muted', _textSecondary);
  document.documentElement.style.setProperty('--hero-val-color', _heroValColor);
  document.documentElement.style.setProperty('--page-title-color', _pageTitleColor);
  document.documentElement.style.setProperty('--th-bg', _thColor);
  _applyCardTintCSS();
})();
window.portfolioBridge = {
  load: initApp,
  go: showPage,
  refresh: globalRefresh,
  currency: setBaseCurrency,
  export: exportToExcel,
  format: (n, d = 0) => fmt(n, d),
  money: n => fmt(sarToBase(n), 0),
  data: () => ({
    totals: calcTotals(),
    txns,
    assets,
    other: otherSrc,
    includeUnrealized,
    currency: baseCur,
    symbol: ({SAR:"ريال",JOD:"د.أ",USD:"$"})[baseCur],
    goal: retireGoal,
    groups: buildGroups().map(g => ({
      ...g,
      value: groupCurrentValue(g),
      exited: isExited(g)
    })),
    quoteCount: assets.filter(a => a.yahooSym && ['Gold', 'Stock'].includes(a.type)).length,
    priced: assets.filter(a => a.yahooSym && ['Gold', 'Stock'].includes(a.type) && getLivePrice(a.name)).length
  })
};