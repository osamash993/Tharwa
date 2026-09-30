import {fetchRemote,pause} from './remote.js';
async function fetchFundCsv(url, topN) {
  try {
    if (!url) return {
      ok: false,
      err: 'لا يوجد رابط محفوظ لهذا الصندوق'
    };
    var resp = await fetchRemote(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    var code = resp.getResponseCode();
    if (code !== 200) return {
      ok: false,
      err: 'فشل التحميل — رمز ' + code,
      code: code
    };
    var body = resp.getContentText();
    var head = String(body || '').slice(0, 400);
    if (zkIsSpreadsheetML_(body)) {
      var rx = zkParseIsharesXml_(body, topN);
      if (!rx.ok) {
        rx.preview = String(body).slice(0, 600);
        rx.bytes = body.length;
      }
      return rx;
    }
    if (/^\s*<(!doctype|html)/i.test(head)) return {
      ok: false,
      err: 'الرابط أعاد صفحة ويب لا ملف بيانات — افتح صفحة الصندوق واستخدم زر Download Holdings ثم انسخ رابط الملف',
      kind: 'html',
      preview: head.slice(0, 160)
    };
    if (!body || !body.trim()) return {
      ok: false,
      err: 'الملف فارغ'
    };
    var r = parseIsharesCsv_(body, topN);
    if (!r.ok) {
      var lines = String(body).split(/\r?\n/).filter(function (l) {
        return l && l.trim();
      });
      r.preview = lines.slice(0, 12).map(function (l) {
        return l.slice(0, 150);
      });
      r.totalLines = lines.length;
      r.bytes = body.length;
    }
    return r;
  } catch (e) {
    return {
      ok: false,
      err: String(e)
    };
  }
}
var ODB_LOC2CC = {
  'United States': 'US',
  'Japan': 'JP',
  'United Kingdom': 'GB',
  'Canada': 'CA',
  'Switzerland': 'CH',
  'France': 'FR',
  'Netherlands': 'NL',
  'Germany': 'DE',
  'Australia': 'AU',
  'Denmark': 'DK',
  'Sweden': 'SE',
  'Ireland': 'IE',
  'South Korea': 'KR',
  'Korea (South)': 'KR',
  'Korea': 'KR',
  'Taiwan': 'TW',
  'India': 'IN',
  'China': 'CN',
  'Saudi Arabia': 'SA',
  'Brazil': 'BR',
  'South Africa': 'ZA',
  'United Arab Emirates': 'AE',
  'Thailand': 'TH',
  'Malaysia': 'MY',
  'Indonesia': 'ID',
  'Mexico': 'MX',
  'Qatar': 'QA',
  'Kuwait': 'KW',
  'Jordan': 'JO',
  'Hong Kong': 'HK',
  'Singapore': 'SG',
  'Spain': 'ES',
  'Italy': 'IT',
  'Finland': 'FI',
  'Norway': 'NO',
  'Belgium': 'BE',
  'Austria': 'AT',
  'New Zealand': 'NZ',
  'Israel': 'IL',
  'Portugal': 'PT'
};
var ODB_SEC2AR = {
  'Information Technology': 'تكنولوجيا',
  'Technology': 'تكنولوجيا',
  'Health Care': 'رعاية صحية',
  'Healthcare': 'رعاية صحية',
  'Financials': 'مالية',
  'Financial Services': 'مالية',
  'Consumer Discretionary': 'سلع كمالية',
  'Consumer Staples': 'سلع أساسية',
  'Communication': 'اتصالات',
  'Communication Services': 'اتصالات',
  'Industrials': 'صناعة',
  'Energy': 'طاقة',
  'Materials': 'مواد',
  'Basic Materials': 'مواد',
  'Utilities': 'مرافق',
  'Real Estate': 'عقارات'
};
function zkFindCol_(head, cands) {
  var i, j;
  for (i = 0; i < cands.length; i++) for (j = 0; j < head.length; j++) if (head[j] === cands[i]) return j;
  for (i = 0; i < cands.length; i++) for (j = 0; j < head.length; j++) if (head[j].indexOf(cands[i]) >= 0) return j;
  return -1;
}
var ZK_CUR2CC = {
  USD: 'US',
  CAD: 'CA',
  JPY: 'JP',
  EUR: 'EZ',
  GBP: 'GB',
  GBp: 'GB',
  CHF: 'CH',
  SEK: 'SE',
  DKK: 'DK',
  NOK: 'NO',
  AUD: 'AU',
  NZD: 'NZ',
  HKD: 'HK',
  SGD: 'SG',
  ILS: 'IL',
  KRW: 'KR',
  TWD: 'TW',
  INR: 'IN',
  CNY: 'CN',
  SAR: 'SA',
  AED: 'AE',
  QAR: 'QA',
  KWD: 'KW',
  JOD: 'JO',
  BRL: 'BR',
  ZAR: 'ZA',
  MXN: 'MX',
  THB: 'TH',
  MYR: 'MY',
  IDR: 'ID',
  PLN: 'PL',
  TRY: 'TR'
};
function zkXmlUnescape_(s) {
  return String(s || '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}
function zkSheetRows_(xml, name) {
  var start = xml.indexOf('ss:Name="' + name + '"');
  if (start < 0) return null;
  var next = xml.indexOf('<ss:Worksheet', start + 10);
  var seg = next > start ? xml.slice(start, next) : xml.slice(start);
  var out = [],
    rowRe = /<ss:Row[^>]*>([\s\S]*?)<\/ss:Row>/g,
    rm;
  while ((rm = rowRe.exec(seg)) !== null) {
    var cells = [],
      cellRe = /<ss:Cell[^>]*>([\s\S]*?)<\/ss:Cell>/g,
      cm;
    while ((cm = cellRe.exec(rm[1])) !== null) {
      cells.push(zkXmlUnescape_(cm[1].replace(/<[^>]+>/g, '')).trim());
    }
    out.push(cells);
  }
  return out;
}
function zkIsSpreadsheetML_(text) {
  var head = String(text || '').slice(0, 600);
  return head.indexOf('ss:Workbook') >= 0 || head.indexOf('urn:schemas-microsoft-com:office:spreadsheet') >= 0;
}
function zkParseIsharesXml_(text, topN) {
  var TOPN = Math.max(1, Math.min(50, Number(topN) || 10));
  var rows = zkSheetRows_(text, 'Holdings');
  if (!rows || !rows.length) return {
    ok: false,
    err: 'الملف لا يحوي ورقة Holdings',
    kind: 'no_sheet'
  };
  var hi = -1,
    head = null;
  for (var i = 0; i < Math.min(rows.length, 20); i++) {
    var low = rows[i].map(function (c) {
      return String(c).toLowerCase();
    });
    var hit = 0;
    ['ticker', 'name', 'sector', 'asset class', 'weight', 'market value', 'currency', 'nominal'].forEach(function (k) {
      low.forEach(function (c) {
        if (c.indexOf(k) >= 0) hit++;
      });
    });
    if (hit >= 3) {
      hi = i;
      head = low;
      break;
    }
  }
  if (hi < 0) return {
    ok: false,
    err: 'تعذّر إيجاد أعمدة ورقة Holdings',
    kind: 'no_header'
  };
  function col(cands) {
    var j, k;
    for (k = 0; k < cands.length; k++) for (j = 0; j < head.length; j++) if (head[j] === cands[k]) return j;
    for (k = 0; k < cands.length; k++) for (j = 0; j < head.length; j++) if (head[j].indexOf(cands[k]) >= 0) return j;
    return -1;
  }
  var iTk = col(['issuer ticker', 'ticker', 'symbol']),
    iNm = col(['name', 'issuer name']),
    iSec = col(['sector']),
    iAC = col(['asset class']),
    iW = col(['weight (%)', 'weight']),
    iCur = col(['market currency', 'currency']),
    iIsin = col(['isin']),
    iLoc = col(['location', 'country']);
  if (iW < 0) return {
    ok: false,
    err: 'عمود الوزن غير موجود',
    kind: 'no_weight',
    columns: head
  };
  var cc = {},
    sec = {},
    top = [],
    sumW = 0,
    equities = 0,
    cashRows = 0;
  for (var r = hi + 1; r < rows.length; r++) {
    var f = rows[r];
    if (!f || f.length < 3) continue;
    var w = parseFloat(String(f[iW] || '').replace(/[,%\s]/g, ''));
    if (!isFinite(w)) continue;
    sumW += w;
    var ac = iAC >= 0 ? String(f[iAC] || '').toLowerCase() : '';
    if (ac && ac.indexOf('equity') < 0) {
      cashRows++;
      continue;
    }
    if (w <= 0) continue;
    equities++;
    var code = 'UN';
    if (iLoc >= 0 && f[iLoc]) code = ODB_LOC2CC[String(f[iLoc]).trim()] || 'UN';
    if (code === 'UN' && iIsin >= 0 && f[iIsin]) {
      var pre = String(f[iIsin]).trim().slice(0, 2).toUpperCase();
      if (/^[A-Z]{2}$/.test(pre) && pre !== 'XS') code = pre;
    }
    if (code === 'UN' && iCur >= 0 && f[iCur]) {
      var cu = String(f[iCur]).trim().toUpperCase();
      code = ZK_CUR2CC[cu] || (cu === 'EUR' ? 'EZ' : 'UN');
    }
    cc[code] = (cc[code] || 0) + w;
    var s = iSec >= 0 ? String(f[iSec] || '').trim() : '';
    if (s && s !== '-') {
      var sar = ODB_SEC2AR[s] || s;
      sec[sar] = (sec[sar] || 0) + w;
    }
    var tk = iTk >= 0 ? String(f[iTk] || '').trim().split('.')[0].toUpperCase() : '';
    var nm = iNm >= 0 ? String(f[iNm] || '').trim() : tk;
    top.push([tk, nm, code, w]);
  }
  if (!top.length) return {
    ok: false,
    err: 'لم يُعثر على مكوّنات صالحة',
    kind: 'no_rows'
  };
  var exp = zkSheetRows_(text, 'Exposure Breakdowns');
  if (exp && exp.length) {
    var secOfficial = {},
      inSector = false;
    for (var e = 0; e < exp.length; e++) {
      var row = exp[e];
      if (!row || !row.length) continue;
      var c0 = String(row[0] || '').trim();
      if (/^sector$/i.test(c0)) {
        inSector = true;
        continue;
      }
      if (/geography|location|market|maturity/i.test(c0) && c0.length < 40) {
        inSector = false;
        continue;
      }
      if (!inSector) continue;
      if (/^as of$|^type$/i.test(c0)) continue;
      var v = parseFloat(String(row[1] || '').replace(/[,%\s]/g, ''));
      if (c0 && isFinite(v) && v > 0) {
        if (/cash|derivative/i.test(c0)) continue;
        secOfficial[ODB_SEC2AR[c0] || c0] = v;
      }
    }
    if (Object.keys(secOfficial).length >= 3) sec = secOfficial;
  }
  var tot = 0,
    k2;
  for (k2 in cc) tot += cc[k2];
  if (tot > 0) {
    for (k2 in cc) cc[k2] = Math.round(cc[k2] / tot * 1000) / 10;
    for (k2 in sec) sec[k2] = Math.round(sec[k2] / tot * 1000) / 10;
  }
  var sec2 = {},
    other = 0;
  Object.keys(sec).map(function (x) {
    return [x, sec[x]];
  }).sort(function (a, b) {
    return b[1] - a[1];
  }).forEach(function (en) {
    if (en[1] >= 3) sec2[en[0]] = en[1];else other += en[1];
  });
  if (other > 0) sec2['أخرى'] = Math.round(other * 10) / 10;
  top.sort(function (a, b) {
    return b[3] - a[3];
  });
  var ccSorted = {};
  Object.keys(cc).map(function (x) {
    return [x, cc[x]];
  }).sort(function (a, b) {
    return b[1] - a[1];
  }).forEach(function (en) {
    ccSorted[en[0]] = en[1];
  });
  return {
    ok: true,
    countries: ccSorted,
    sectors: sec2,
    top: top.slice(0, TOPN),
    topN: TOPN,
    count: equities,
    cashRows: cashRows,
    sumWeight: Math.round(sumW * 10) / 10,
    format: 'spreadsheetml'
  };
}
function parseIsharesCsv_(text, topN) {
  var TOPN = Math.max(1, Math.min(50, Number(topN) || 10));
  text = String(text || '').replace(/^\uFEFF/, '');
  var lines = text.split(/\r?\n/);
  var KEYS = ['ticker', 'name', 'sector', 'asset class', 'market value', 'weight', 'isin', 'sedol', 'location', 'exchange', 'shares', 'nominal', 'price', 'currency', 'issuer'];
  var hi = -1,
    head = null,
    best = 0;
  for (var i = 0; i < Math.min(lines.length, 80); i++) {
    if (!lines[i] || lines[i].indexOf(',') < 0) continue;
    var f = parseCsvLine_(lines[i]).map(function (s) {
      return String(s).trim().toLowerCase();
    });
    var score = 0;
    f.forEach(function (c) {
      if (!c) return;
      KEYS.forEach(function (k) {
        if (c.indexOf(k) >= 0) score++;
      });
    });
    if (score > best && score >= 3) {
      best = score;
      hi = i;
      head = f;
    }
  }
  if (hi < 0) {
    var sample = '';
    for (var s = 0; s < Math.min(lines.length, 30); s++) {
      if (lines[s] && lines[s].indexOf(',') >= 0) {
        sample = lines[s].slice(0, 150);
        break;
      }
    }
    return {
      ok: false,
      err: 'تعذّر التعرف على أعمدة الملف',
      kind: 'no_header',
      sampleLine: sample,
      lineCount: lines.length
    };
  }
  var iWeight = zkFindCol_(head, ['weight (%)', 'weight(%)', 'weight %', 'weight']);
  var iTk = zkFindCol_(head, ['issuer ticker', 'ticker', 'symbol']);
  var iNm = zkFindCol_(head, ['name', 'security name', 'issuer name', 'holding']);
  var iLoc = zkFindCol_(head, ['location', 'country', 'domicile']);
  var iSec = zkFindCol_(head, ['sector', 'gics sector', 'industry']);
  var iAC = zkFindCol_(head, ['asset class', 'asset type']);
  if (iWeight < 0) return {
    ok: false,
    err: 'عمود الوزن (Weight) غير موجود',
    kind: 'no_weight',
    columns: head.slice(0, 20),
    headerRow: hi
  };
  if (iTk < 0 && iNm < 0) return {
    ok: false,
    err: 'لا يوجد عمود للرمز ولا لاسم الشركة',
    kind: 'no_name',
    columns: head.slice(0, 20),
    headerRow: hi
  };
  var cc = {},
    sec = {},
    top = [],
    sumW = 0;
  for (var r = hi + 1; r < lines.length; r++) {
    if (!lines[r] || !lines[r].trim()) continue;
    var f2 = parseCsvLine_(lines[r]);
    if (f2.length < 2) continue;
    if (iAC >= 0) {
      var ac = String(f2[iAC] || '').trim().toLowerCase();
      if (ac && ac.indexOf('equity') < 0 && ac.indexOf('stock') < 0) continue;
    }
    var w = parseFloat(String(f2[iWeight] || '').replace(/[,%\s]/g, ''));
    if (!isFinite(w) || w <= 0) continue;
    sumW += w;
    var loc = iLoc >= 0 ? String(f2[iLoc] || '').trim() : '';
    var code = ODB_LOC2CC[loc] || 'UN';
    cc[code] = (cc[code] || 0) + w;
    var s = iSec >= 0 ? String(f2[iSec] || '').trim() : '';
    if (s && s !== '-') {
      var sar = ODB_SEC2AR[s] || s;
      sec[sar] = (sec[sar] || 0) + w;
    }
    var tk = iTk >= 0 ? String(f2[iTk] || '').trim().split('.')[0].toUpperCase() : '';
    var nm = iNm >= 0 ? String(f2[iNm] || '').trim() : tk;
    top.push([tk, nm, code, w]);
  }
  if (!top.length) return {
    ok: false,
    err: 'لم يُعثر على أي مكوّنات صالحة داخل الملف'
  };
  var warnings = [];
  if (sumW < 90 || sumW > 110) warnings.push('مجموع الأوزان ' + sumW.toFixed(1) + '%');
  var tot = 0,
    k;
  for (k in cc) tot += cc[k];
  if (tot > 0) {
    for (k in cc) cc[k] = Math.round(cc[k] / tot * 1000) / 10;
    for (k in sec) sec[k] = Math.round(sec[k] / tot * 1000) / 10;
  }
  var sec2 = {},
    other = 0;
  Object.keys(sec).map(function (x) {
    return [x, sec[x]];
  }).sort(function (a, b) {
    return b[1] - a[1];
  }).forEach(function (e) {
    if (e[1] >= 3) sec2[e[0]] = e[1];else other += e[1];
  });
  if (other > 0) sec2['أخرى'] = Math.round(other * 10) / 10;
  top.sort(function (a, b) {
    return b[3] - a[3];
  });
  var ccSorted = {};
  Object.keys(cc).map(function (x) {
    return [x, cc[x]];
  }).sort(function (a, b) {
    return b[1] - a[1];
  }).forEach(function (e) {
    ccSorted[e[0]] = e[1];
  });
  return {
    ok: true,
    countries: ccSorted,
    sectors: sec2,
    top: top.slice(0, TOPN),
    topN: TOPN,
    count: top.length,
    sumWeight: Math.round(sumW * 10) / 10,
    headerRow: hi,
    warnings: warnings
  };
}
function parseCsvLine_(line) {
  var out = [],
    cur = '',
    q = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (ch === '"') {
      if (q && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else q = !q;
    } else if (ch === ',' && !q) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}
async function getFundComposition(sym) {
  try {
    var c = await fetchRemote('https://fc.yahoo.com', {
      muteHttpExceptions: true
    });
    var cookie = c.getAllHeaders()['Set-Cookie'] || '';
    if (Array.isArray(cookie)) cookie = cookie[0] || '';
    cookie = String(cookie).split(';')[0];
    var crumb = (await fetchRemote('https://query1.finance.yahoo.com/v1/test/getcrumb', {
      headers: {
        Cookie: cookie
      },
      muteHttpExceptions: true
    })).getContentText();
    var r = await fetchRemote('https://query1.finance.yahoo.com/v10/finance/quoteSummary/' + encodeURIComponent(sym) + '?modules=topHoldings&crumb=' + encodeURIComponent(crumb), {
      headers: {
        Cookie: cookie
      },
      muteHttpExceptions: true
    });
    var th = JSON.parse(r.getContentText()).quoteSummary.result[0].topHoldings;
    var top = (th.holdings || []).map(function (h) {
      return [h.symbol || '', h.holdingName || '', (h.holdingPercent && h.holdingPercent.raw || 0) * 100];
    });
    var sec = {};
    (th.sectorWeightings || []).forEach(function (o) {
      for (var k in o) sec[k] = (o[k].raw || 0) * 100;
    });
    return {
      ok: true,
      top: top,
      sectors: sec
    };
  } catch (e) {
    return {
      ok: false,
      err: String(e)
    };
  }
}
var _zkAuth = null;
async function zkAuth_(force) {
  if (_zkAuth && !force) return _zkAuth;
  var c = await fetchRemote('https://fc.yahoo.com', {
    muteHttpExceptions: true
  });
  var ck = c.getAllHeaders()['Set-Cookie'] || '';
  if (Array.isArray(ck)) ck = ck[0] || '';
  ck = String(ck).split(';')[0];
  var cr = '';
  try {
    cr = (await fetchRemote('https://query1.finance.yahoo.com/v1/test/getcrumb', {
      headers: {
        Cookie: ck
      },
      muteHttpExceptions: true
    })).getContentText();
  } catch (e) {}
  _zkAuth = {
    cookie: ck,
    crumb: String(cr || '').trim()
  };
  return _zkAuth;
}
var ZK_METRICS = ['annualTotalAssets', 'annualCashAndCashEquivalents', 'annualCashCashEquivalentsAndShortTermInvestments', 'annualOtherShortTermInvestments', 'annualAvailableForSaleSecurities', 'annualReceivables', 'annualAccountsReceivable', 'annualOtherReceivables', 'annualInventory', 'annualCurrentAssets'];
var ZK_MAP = {
  annualCashAndCashEquivalents: 'cashAndEquivalents',
  annualCashCashEquivalentsAndShortTermInvestments: 'cashAndShortTerm',
  annualOtherShortTermInvestments: 'shortTermInvestments',
  annualAvailableForSaleSecurities: 'marketableSecurities',
  annualReceivables: 'tradeReceivables',
  annualAccountsReceivable: 'accountsReceivable',
  annualOtherReceivables: 'otherReceivables',
  annualInventory: 'inventory',
  annualTotalAssets: 'totalAssets',
  annualCurrentAssets: 'currentAssets'
};
var ZK_SFX = {
  US: '',
  HK: '.HK',
  TW: '.TW',
  KR: '.KS',
  SA: '.SR',
  IN: '.NS',
  JP: '.T',
  GB: '.L',
  DE: '.DE',
  FR: '.PA',
  NL: '.AS',
  CH: '.SW',
  IT: '.MI',
  ES: '.MC',
  AU: '.AX',
  CA: '.TO',
  BR: '.SA',
  ZA: '.JO',
  TH: '.BK',
  MY: '.KL',
  ID: '.JK',
  MX: '.MX',
  SE: '.ST',
  DK: '.CO',
  NO: '.OL',
  FI: '.HE',
  SG: '.SI',
  IE: '.IR',
  BE: '.BR',
  AT: '.VI',
  PT: '.LS',
  NZ: '.NZ'
};
function zkSym_(ticker, cc, known) {
  if (known) return String(known).trim();
  var t = String(ticker || '').trim().toUpperCase();
  if (!t) return '';
  if (t.indexOf('.') >= 0) return t;
  cc = String(cc || '').toUpperCase();
  if (cc === 'CN') {
    if (/^6/.test(t)) return t + '.SS';
    if (/^[03]/.test(t)) return t + '.SZ';
    return t + '.HK';
  }
  var s = ZK_SFX[cc];
  return s === undefined ? t : t + s;
}
function zkParseTs_(json) {
  var out = {},
    dates = {};
  var arr = json && json.timeseries && json.timeseries.result;
  if (!arr || !arr.length) return null;
  for (var i = 0; i < arr.length; i++) {
    var r = arr[i];
    var type = r.meta && r.meta.type && r.meta.type[0];
    if (!type || !r[type]) continue;
    var rows = r[type],
      best = null;
    for (var k = 0; k < rows.length; k++) {
      var row = rows[k];
      if (!row || !row.reportedValue) continue;
      if (!best || String(row.asOfDate) > String(best.asOfDate)) best = row;
    }
    if (!best) continue;
    var key = ZK_MAP[type] || type;
    var v = best.reportedValue.raw;
    if (v == null) continue;
    out[key] = Number(v) || 0;
    dates[key] = String(best.asOfDate || '');
  }
  return Object.keys(out).length ? {
    items: out,
    dates: dates
  } : null;
}
async function zkFmpOne_(symbol, key) {
  var u = 'https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=' + encodeURIComponent(symbol) + '&period=annual&limit=1&apikey=' + encodeURIComponent(key);
  var r = await fetchRemote(u, {
    muteHttpExceptions: true
  });
  var code = r.getResponseCode();
  var body = String(r.getContentText() || '');
  if (code === 401 || code === 403) return {
    ok: false,
    status: 'auth',
    err: 'المفتاح مرفوض أو منتهٍ',
    code: code
  };
  if (code === 429) return {
    ok: false,
    status: 'limit',
    err: 'تجاوزت حد الطلبات اليومي (250)',
    code: code
  };
  if (code !== 200) return {
    ok: false,
    status: 'error',
    err: 'FMP ردّت برمز ' + code,
    code: code
  };
  var j;
  try {
    j = JSON.parse(body);
  } catch (e) {
    return {
      ok: false,
      status: 'error',
      err: 'رد غير صالح'
    };
  }
  if (j && j['Error Message']) return {
    ok: false,
    status: 'error',
    err: String(j['Error Message']).slice(0, 120)
  };
  var b = Array.isArray(j) && j[0];
  if (!b) return {
    ok: false,
    status: 'not_found',
    err: 'لا توجد قوائم مالية — قد يكون الرمز خارج الخطة المجانية'
  };
  var n = function (v) {
    var x = Number(v);
    return isFinite(x) ? x : 0;
  };
  var items = {
    cashAndEquivalents: n(b.cashAndCashEquivalents),
    shortTermInvestments: n(b.shortTermInvestments),
    tradeReceivables: n(b.netReceivables),
    inventory: n(b.inventory),
    otherReceivables: n(b.otherCurrentAssets),
    currentAssets: n(b.totalCurrentAssets),
    totalAssets: n(b.totalAssets)
  };
  if (!items.totalAssets) return {
    ok: false,
    status: 'no_total',
    err: 'التقرير بلا إجمالي أصول'
  };
  var tags = {};
  Object.keys(items).forEach(function (k) {
    tags[k] = {
      tag: 'FMP:' + k,
      end: b.date || ''
    };
  });
  return {
    ok: true,
    symbol: symbol,
    reportingCurrency: b.reportedCurrency || 'USD',
    reportType: 'annual',
    reportDate: b.date || '',
    fiscalYear: String(b.calendarYear || '').slice(0, 4),
    sourceName: 'Financial Modeling Prep',
    sourceType: 'provider',
    sourceUrl: b.finalLink || b.link || 'https://financialmodelingprep.com/financial-statements/' + symbol,
    filingUrl: b.finalLink || b.link || '',
    fetchedAt: new Date().toISOString(),
    items: items,
    itemTags: tags,
    via: 'FMP',
    status: 'ok'
  };
}
async function zkFetchOne(ticker, cc, knownSym, key) {
  var sym = zkSym_(ticker, cc, knownSym);
  if (!sym) return {
    ok: false,
    ticker: ticker,
    err: 'رمز غير صالح',
    status: 'bad_symbol'
  };
  if (key) {
    var fmpSym = cc === 'US' || sym.indexOf('.') < 0 ? String(ticker).toUpperCase() : sym;
    var f = await zkFmpOne_(fmpSym, key);
    if (f.ok) {
      f.ticker = String(ticker).toUpperCase();
      return f;
    }
    if (f.status === 'auth' || f.status === 'limit') return {
      ok: false,
      ticker: ticker,
      symbol: fmpSym,
      status: f.status,
      err: f.err
    };
  }
  var now = Math.floor(Date.now() / 1000);
  var p1 = now - 6 * 365 * 86400;
  var base = 'https://query2.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/' + encodeURIComponent(sym) + '?symbol=' + encodeURIComponent(sym) + '&type=' + ZK_METRICS.join('%2C') + '&period1=' + p1 + '&period2=' + now + '&merge=false';
  var a = await zkAuth_();
  var attempts = [{
    name: 'query2 + crumb',
    url: base + (a.crumb ? '&crumb=' + encodeURIComponent(a.crumb) : ''),
    opt: {
      headers: {
        Cookie: a.cookie
      },
      muteHttpExceptions: true
    }
  }, {
    name: 'query2 بلا اعتماد',
    url: base,
    opt: {
      muteHttpExceptions: true
    }
  }, {
    name: 'query1',
    url: base.replace('query2', 'query1'),
    opt: {
      headers: {
        Cookie: a.cookie
      },
      muteHttpExceptions: true
    }
  }];
  var lastCode = 0,
    lastBody = '';
  for (var i = 0; i < attempts.length; i++) {
    try {
      var r = await fetchRemote(attempts[i].url, attempts[i].opt);
      lastCode = r.getResponseCode();
      lastBody = String(r.getContentText() || '').slice(0, 300);
      if (lastCode === 401 || lastCode === 403) {
        await zkAuth_(true);
        continue;
      }
      if (lastCode !== 200) continue;
      var j = JSON.parse(r.getContentText());
      var p = zkParseTs_(j);
      if (!p) continue;
      if (!p.items.totalAssets) {
        return {
          ok: false,
          ticker: ticker,
          symbol: sym,
          status: 'no_total',
          err: 'ياهو لا تنشر إجمالي أصول لهذا الرمز',
          via: attempts[i].name
        };
      }
      var end = p.dates.totalAssets || '';
      var tags = {};
      Object.keys(p.items).forEach(function (k) {
        tags[k] = {
          tag: 'Yahoo:' + k,
          end: p.dates[k] || ''
        };
      });
      return {
        ok: true,
        ticker: String(ticker).toUpperCase(),
        symbol: sym,
        reportType: 'annual',
        reportDate: end,
        fiscalYear: String(end).slice(0, 4),
        sourceName: 'Yahoo Finance',
        sourceType: 'provider',
        sourceUrl: 'https://finance.yahoo.com/quote/' + encodeURIComponent(sym) + '/balance-sheet',
        fetchedAt: new Date().toISOString(),
        items: p.items,
        itemTags: tags,
        via: attempts[i].name,
        status: 'ok'
      };
    } catch (e) {
      lastBody = String(e).slice(0, 200);
    }
  }
  return {
    ok: false,
    ticker: ticker,
    symbol: sym,
    status: 'error',
    err: 'تعذّر الجلب (رمز ' + lastCode + ')',
    detail: lastBody
  };
}
async function zkFetchBatch(payload, key) {
  var list;
  try {
    list = typeof payload === 'string' ? JSON.parse(payload) : payload;
  } catch (e) {
    return {
      ok: false,
      err: 'صيغة غير صالحة'
    };
  }
  if (!list || !list.length) return {
    ok: false,
    err: 'قائمة فارغة'
  };
  key = String(key || '').trim();
  var out = [],
    viaCount = {};
  for (var i = 0; i < list.length; i++) {
    var x = list[i];
    var r = await zkFetchOne(x.ticker, x.cc || '', x.symbol || '', key);
    if (!r.companyName) r.companyName = x.name || r.ticker;
    if (r.ok) viaCount[r.via] = (viaCount[r.via] || 0) + 1;
    out.push(r);
    if (r.status === 'auth' || r.status === 'limit') return {
      ok: false,
      err: r.err,
      phase: 'provider',
      results: out
    };
    await pause(key ? 260 : 180);
  }
  return {
    ok: true,
    results: out,
    via: viaCount
  };
}
async function zkTestKey(key, symbol) {
  key = String(key || '').trim();
  if (!key) return {
    ok: false,
    err: 'لم تُدخل مفتاحاً'
  };
  var r = await zkFmpOne_(symbol || 'MSFT', key);
  if (r.ok) {
    var z = 0;
    Object.keys(r.items).forEach(function (k) {
      if (k === 'totalAssets' || k === 'currentAssets') return;
      z += Number(r.items[k]) || 0;
    });
    r.previewRatio = r.items.totalAssets ? z / r.items.totalAssets : 0;
  }
  return r;
}
async function zkCheckCsv(url) {
  if (!url) return {
    ok: false,
    err: 'مرّر الرابط كوسيط'
  };
  var out = {
    url: url
  };
  try {
    var r = await fetchRemote(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    out.code = r.getResponseCode();
    out.contentType = r.getAllHeaders()['Content-Type'] || r.getAllHeaders()['content-type'] || '';
    var body = r.getContentText();
    out.bytes = body.length;
    var lines = String(body).split(/\r?\n/).filter(function (l) {
      return l && l.trim();
    });
    out.lineCount = lines.length;
    out.firstLines = lines.slice(0, 12).map(function (l) {
      return l.slice(0, 150);
    });
    out.looksHtml = /^\s*<(!doctype|html)/i.test(body.slice(0, 200));
    var p = parseIsharesCsv_(body, 20);
    out.parse = {
      ok: p.ok,
      err: p.err || '',
      headerRow: p.headerRow,
      count: p.count,
      sumWeight: p.sumWeight
    };
    if (p.ok) out.top5 = p.top.slice(0, 5);
  } catch (e) {
    out.err = String(e);
  }
  return out;
}
export {fetchFundCsv,getFundComposition,zkFetchOne,zkFetchBatch,zkTestKey,zkCheckCsv,parseIsharesCsv_,zkParseIsharesXml_};