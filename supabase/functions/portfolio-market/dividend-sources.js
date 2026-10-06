// Distribution currencies come from the dividend record, never the listing price currency.
const DAY=86400000;
const iso=n=>{const s=String(n);if(!/^\d{8}$/.test(s))return null;const d=s.slice(0,4)+'-'+s.slice(4,6)+'-'+s.slice(6);return Number.isFinite(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d?d:null;};
export function issuerPageURL(value,symbol){
 if(!value&&['ISDU.L','ISUS.L'].includes(symbol))return 'https://www.ishares.com/uk/individual/en/products/251393/ishares-msci-usa-islamic-ucits-etf';
 if(!value&&['ISDE.L'].includes(symbol))return 'https://www.ishares.com/uk/individual/en/products/251392/ishares-msci-em-islamic-ucits-etf';
 if(!value&&['ISWD.L','ISDW.L','ISWD.SW'].includes(symbol))return 'https://www.ishares.com/uk/individual/en/products/251394/ishares-msci-world-islamic-ucits-etf';
 try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.port||!['www.ishares.com','ishares.com','www.blackrock.com','blackrock.com'].includes(u.hostname))return null;
 const m=u.pathname.match(/^(.*\/(?:products|product)\/\d+\/[^/]+)/);if(!m)return null;return u.origin+m[1].replace(/\.ajax$/,'');}catch{return null;}
}
export function parseIssuerDividends(html){
 for(const match of html.matchAll(/componentprops="([^"]+)"/g)){
  if(!match[1].includes('totalDistribution'))continue;
  let p;try{p=JSON.parse(match[1].replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));}catch{continue;}
  const t=p.containersByNameMap?.distributions?.subContainersByNameMap?.table?.dataPointsByNameMap;if(!t)continue;
  return (t.exDate?.value||[]).map((d,i)=>{const prefix=Array.isArray(t.totalDistribution?.prefix)?t.totalDistribution.prefix[i]:t.totalDistribution?.prefix;
   return {exDate:iso(d),paymentDate:iso(t.payableDate?.value?.[i]),recordDate:iso(t.recordDate?.value?.[i]),perShare:Number(t.totalDistribution?.value?.[i]),currency:/^[A-Z]{3}$/.test(String(prefix||'').trim())?prefix.trim():null};
  }).filter(r=>r.exDate&&Number.isFinite(r.perShare)&&r.perShare>0).sort((a,b)=>a.exDate.localeCompare(b.exDate));
 }
 return [];
}
export function normalizeYahooDividends(d){return Object.values(d.events?.dividends||{}).map(e=>({exDate:Number.isFinite(e.date)?new Date(e.date*1000).toISOString().slice(0,10):null,paymentDate:null,perShare:Number(e.amount),currency:/^[A-Z]{3}$/.test(e.currency||'')?e.currency:null})).filter(e=>e.exDate&&e.perShare>0&&Number.isFinite(e.perShare)).sort((a,b)=>a.exDate.localeCompare(b.exDate));}
function plusMonths(date,months){const d=new Date(date),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+months);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));return d.toISOString().slice(0,10);}
export function projectDistributions(history,today=new Date().toISOString().slice(0,10)){
 const time=Date.parse(today),past=history.filter(e=>e.exDate<=today).slice(-9),until=plusMonths(today,12);
 const upcoming=history.filter(e=>(e.paymentDate||e.exDate)>today&&(e.paymentDate||e.exDate)<=until).map(e=>({...e,date:e.paymentDate||e.exDate,dateKind:e.paymentDate?'payment':'ex',status:'announced'}));
 if(past.length<3)return {upcoming,frequency:null};
 const gaps=past.slice(1).map((e,i)=>(Date.parse(e.exDate)-Date.parse(past[i].exDate))/DAY),median=[...gaps].sort((a,b)=>a-b)[Math.floor(gaps.length/2)],months=[1,3,6,12].find(n=>Math.abs(median-n*365.25/12)<n*365.25/12*.18);
 if(!months||gaps.some(g=>Math.abs(g-median)>median*.25)){
  // Many semiannual issuers pay in two recurring seasons rather than every six months.
  const frequency=[1,2,4,12].find(n=>past.length>=n+2&&past.slice(n).every((e,i)=>Math.abs((Date.parse(e.exDate)-Date.parse(past[i].exDate))/DAY-365.25)<45));
  if(!frequency||time-Date.parse(past.at(-1).exDate)>400*DAY)return {upcoming,frequency:null};
  for(const e of past.slice(-frequency)){
   const exDate=plusMonths(e.exDate,12),paymentDate=e.paymentDate?plusMonths(e.paymentDate,12):null,date=paymentDate||exDate;
   if(date<=today||date>until||upcoming.some(x=>Math.abs(Date.parse(x.exDate)-Date.parse(exDate))<45*DAY))continue;
   upcoming.push({exDate,paymentDate,date,dateKind:paymentDate?'payment':'ex',perShare:e.ordinaryPerShare||e.perShare,currency:e.currency,status:'estimated'});
  }
  return {upcoming:upcoming.sort((a,b)=>a.date.localeCompare(b.date)),frequency};
 }
 const last=past.at(-1);if(time-Date.parse(last.exDate)>median*1.5*DAY)return {upcoming,frequency:null};
 const perYear=12/months;
 for(let i=1;i<=perYear+1;i++){
  const exDate=plusMonths(last.exDate,months*i),paymentDate=last.paymentDate?plusMonths(last.paymentDate,months*i):null,date=paymentDate||exDate;
  if(date<=today||date>until||upcoming.some(e=>Math.abs(Date.parse(e.exDate)-Date.parse(exDate))<median*.4*DAY))continue;
  // Match the same seasonal installment, if available, instead of annualizing one payment.
  const seasonal=past.filter(e=>Math.abs(new Date(e.exDate).getUTCMonth()-new Date(exDate).getUTCMonth())<=1).at(-1)||last;
  upcoming.push({exDate,paymentDate,date,dateKind:paymentDate?'payment':'ex',perShare:seasonal.perShare,currency:seasonal.currency,status:'estimated'});
 }
 return {upcoming:upcoming.sort((a,b)=>a.date.localeCompare(b.date)),frequency:perYear};
}

// Only the Hong Kong share table; annual totals and the separate RMB share table are not cash events.
export function parseChinaMobileDividends(html){
 const clean=String(html).replace(/<!--[\s\S]*?-->/g,''),section=clean.split(/id=["']tab1["']/i)[1]?.split(/<\/table>/i)[0];if(!section)return [];
 const date=s=>{const m=s.match(/^(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec),?\s+(\d{4})$/i);if(!m)return null;const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[2].toLowerCase())+1;return iso(m[3]+String(month).padStart(2,'0')+m[1].padStart(2,'0'));};
 const out=[];
 for(const row of section.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)){
  const cells=[...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(m=>m[1].replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').trim()),i=cells.findIndex(x=>date(x));if(i<0)continue;
  const ordinary=Number(cells[i+2]?.match(/HKD\s*([\d.]+)/i)?.[1]),special=Number(cells[i+3]?.match(/HKD\s*([\d.]+)/i)?.[1]||0);
  if(!(ordinary>0)||!Number.isFinite(ordinary+special))continue;
  out.push({exDate:date(cells[i]),paymentDate:date(cells[i+1]),perShare:ordinary+special,ordinaryPerShare:ordinary,specialPerShare:special,currency:'HKD'});
 }
 return out.sort((a,b)=>a.exDate.localeCompare(b.exDate));
}
