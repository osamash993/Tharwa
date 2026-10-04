const hosts=new Set(['feeds.finance.yahoo.com','www.federalreserve.gov','www.bls.gov','www.bea.gov','www.msci.com','app2.msci.com','query1.finance.yahoo.com','query2.finance.yahoo.com','fc.yahoo.com','financialmodelingprep.com','www.ishares.com','ishares.com','www.blackrock.com','blackrock.com']);
export const pause=ms=>new Promise(r=>setTimeout(r,ms));
export async function fetchRemote(input,options={}){
 let url=new URL(input),response;
 for(let redirect=0;redirect<5;redirect++){
  if(url.protocol!=='https:'||!hosts.has(url.hostname)||url.username||url.password||url.port)throw Error('نطاق مصدر البيانات غير مسموح');
  response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0',...options.headers},redirect:'manual',signal:AbortSignal.timeout(18000)});
  if([301,302,303,307,308].includes(response.status)){const target=response.headers.get('location');if(!target)throw Error('تحويل غير صالح');url=new URL(target,url);continue;}
  break;
 }
 if(!response||[301,302,303,307,308].includes(response.status))throw Error('تحويلات كثيرة');
 if(Number(response.headers.get('content-length'))>8000000)throw Error('ملف المصدر كبير جداً');
 const chunks=[];let size=0;const reader=response.body?.getReader();
 if(reader)for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>8000000){await reader.cancel();throw Error('ملف المصدر كبير جداً');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}const body=new TextDecoder().decode(bytes);
 const headers=Object.fromEntries(response.headers);headers['Set-Cookie']=response.headers.get('set-cookie')||'';
 return {getResponseCode:()=>response.status,getContentText:()=>body,getAllHeaders:()=>headers};
}
export async function getPrices(csv){
 const symbols=[...new Set(String(csv).split(',').map(s=>s.trim()).filter(Boolean))];if(symbols.length>80)throw Error('عدد الرموز يتجاوز 80');
 const out={};for(let i=0;i<symbols.length;i+=5)await Promise.all(symbols.slice(i,i+5).map(async symbol=>{
  if(!/^[A-Za-z0-9.^=\-]{1,30}$/.test(symbol)){out[symbol]={error:'رمز غير صالح'};return;}
  try{
   const r=await fetchRemote('https://query1.finance.yahoo.com/v8/finance/chart/'+encodeURIComponent(symbol)+'?interval=1d&range=1d');
   if(r.getResponseCode()!==200)throw Error('المصدر غير متاح ('+r.getResponseCode()+')');
   const j=JSON.parse(r.getContentText()),m=j.chart?.result?.[0]?.meta;
   if(!m||!Number.isFinite(m.regularMarketPrice))throw Error('لا يوجد سعر');
   const prev=m.chartPreviousClose||m.previousClose;out[symbol]={price:m.regularMarketPrice,currency:m.currency,change:prev?m.regularMarketPrice-prev:0,name:m.shortName||m.longName||symbol,high52:m.fiftyTwoWeekHigh??null,low52:m.fiftyTwoWeekLow??null,ma200:m.twoHundredDayAverage??null,changePct:prev?(m.regularMarketPrice/prev-1)*100:null,marketOpen:m.currentTradingPeriod?.regular?Date.now()/1000>=m.currentTradingPeriod.regular.start&&Date.now()/1000<=m.currentTradingPeriod.regular.end:null,timestamp:m.regularMarketTime,source:'Yahoo Finance'};
  }catch(e){out[symbol]={error:e.message};}
 }));return out;
}
export async function getSectors(csv){
 const list=String(csv).split(',').map(s=>s.trim()).filter(Boolean).slice(0,80),out={};
 for(let i=0;i<list.length;i+=5)await Promise.all(list.slice(i,i+5).map(async s=>{try{const r=await fetchRemote('https://query1.finance.yahoo.com/v1/finance/search?q='+encodeURIComponent(s)+'&quotesCount=1&newsCount=0');const q=JSON.parse(r.getContentText()).quotes?.[0]||{};out[s]=q.sectorDisp||q.sector||q.industry||'';}catch{out[s]='';}}));return out;
}
