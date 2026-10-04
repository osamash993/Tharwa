/* Command Center adapter. All portfolio calculations call the existing engine. */
(() => {
 const clone=x=>structuredClone(x);
 const num=x=>Number(x)||0;
 const clean=x=>String(x??'').replace(/[<>&'"`\\]/g,c=>({'<':'‹','>':'›','&':'＆',"'":'’','"':'”','`':'′','\\':'／'}[c]));
 const nameMap=new Map();
 function alias(name){const s=clean(name);nameMap.set(s,name);return s;}
 const original=name=>nameMap.get(name)||name;
 const setting=(key,fallback)=>{try{return JSON.parse(window.commandStorage.raw().settings[key]||'null')??fallback;}catch{return fallback;}};
 function fifoRows(name,excluded){return txns.filter(t=>t.assetName===original(name)&&String(t.id)!==String(excluded)).map(clone);}
 function fifoView(name,excluded){const f=calcFIFO(fifoRows(name,excluded));return {qty:f.netQty,cost:f.netQty*f.avgCostSAR,avg:f.avgCostSAR,realized:f.realizedPnL,sells:f.sellHistory.map(s=>({...s,basis:s.costBasis})),queue:f.fifoQueue};}
 function snapshot(){
  nameMap.clear();const T=calcTotals(),X=computeXray(),M=xrMetrics(X),groups=buildGroups();
  const rawAssets=[...assets];
  groups.forEach(g=>{if(!rawAssets.some(a=>a.name===g.assetName))rawAssets.push({id:g.assetName,name:g.assetName,type:g.assetType,currency:g.txns[0]?.currency||'SAR'});});
  const registry=rawAssets.map(a=>{const lp=getLivePrice(a.name),raw=marketData[a.yahooSym]||{},gold=a.type==='Gold';
   const gp=v=>v==null?null:gold?(v*.997*.02055-5)/.188:v;
   return {id:String(a.id),n:alias(a.name),t:a.type,full:clean(raw.name||a.fullName||a.name),cur:gold?'SARg':a.currency||lp?.currency||'SAR',yh:a.yahooSym||'',tv:a.tvSym||'',p:gold?lp?.gramSAR??null:lp?.price??null,chg:raw.changePct??null,lo:gp(raw.low52),hi:gp(raw.high52),ma:gp(raw.ma200),marketOpen:raw.marketOpen??null,timestamp:raw.timestamp||null,isGold:gold};
  });
  const AS=Object.fromEntries(registry.filter(a=>a.t!=='Cash').map(a=>[a.n,a]));
  const converted=groups.map(g=>{const v=groupCurrentValue(g),a=registry.find(a=>a.n===alias(g.assetName)),f=calcFIFO(g.txns);return {n:alias(g.assetName),...a,qty:g.buyQ-g.sellQ,cost:v.cost,val:v.cur,pnl:v.cur-v.cost,avg:g.fifoAvgCost||0,realized:g.realizedPnL||0,sells:(g.sellHistory||[]).map(s=>({...s,basis:s.costBasis})),exited:isExited(g),hasPx:v.hasPx};});
  const POS=converted.filter(g=>['Stock','Gold'].includes(g.t)&&!g.exited);
  const CASH=registry.filter(a=>a.t==='Cash').map(a=>({n:a.n,c:a.cur,bal:converted.find(g=>g.n===a.n)?.val||0,id:a.id}));
  const PROP=registry.filter(a=>a.t==='Property').map(a=>{const g=converted.find(g=>g.n===a.n);return {n:a.n,c:a.cur,cost:g?.cost||0,val:g?.val||0,id:a.id,qty:g?.qty||0};});
  const investments=txns.filter(t=>t.assetType!=='Cash');
  const TXNS=investments.map(t=>{const linked=txns.find(x=>String(x.id)===String(t.linkedTxnId));const a=registry.find(a=>a.n===alias(t.assetName));const row=[t.date,alias(t.assetName),t.action,num(t.qty),num(t.price),num(t.rate)||1,clean(t.remarks),linked?CASH.findIndex(c=>c.n===alias(linked.assetName)):null];row.push({id:t.id,totalCostSAR:num(t.totalCostSAR),fees:num(t.fees),currency:t.currency,linkedTxnId:t.linkedTxnId});return row;});
  const CTX=txns.filter(t=>t.assetType==='Cash').map(t=>{const link=txns.find(x=>String(x.id)===String(t.linkedTxnId));return {id:t.id,d:t.date,acc:CASH.findIndex(c=>c.n===alias(t.assetName)),act:t.action==='Withdrawal'?'Withdraw':t.action,s:Math.abs(num(t.totalCostSAR)),note:clean(t.remarks),linkedId:link?.id,link:link&&link.assetType!=='Cash'?'a:'+alias(link.assetName):null,linkedCash:link?.assetType==='Cash',rate:t.rate};}).filter(t=>t.acc>=0);
  const xd={},counts={},src={};X.funds.forEach(f=>{xd[alias(f.id)]=clone(f.data);counts[alias(f.id)]=f.data._count||f.data.top?.length||0;Object.entries(f.data.countries||{}).forEach(([cc,w])=>(src[cc]??=[]).push({f:alias(f.id),w,v:f.val*w/100}));});
  const companies=Object.fromEntries(Object.entries(X.companies).map(([key,c])=>[clean(key),{...c,k:clean(key),key:clean(key),ar:clean(c.ar),via:c.via.map(f=>({f:alias(f==='سهم مباشر'&&key.startsWith('DIRECT_')?key.slice(7):f),w:xd[alias(f)]?.top?.find(t=>t[0]===key)?.[3]??100}))}]));
  for(const d of Object.values(xd))d.top=(d.top||[]).map(t=>[clean(t[0]),clean(t[1]),t[2],t[3]]);
  Object.keys(X.countries).forEach(cc=>src[cc]??=[]);const Z=zkCalc(),H=zkHawl();
  const cc=setting('commandCenter',{});
  return {loaded:!!window.portfolioLoaded,AS,POS,CASH,PROP,TXNS,CTX,FX:clone(fx),baseCur,catGoals:clone(catGoals),registry,
   marketOpen:registry.some(a=>a.marketOpen===true)?true:registry.some(a=>a.marketOpen===false)?false:null,goldOunce:Object.values(marketData).find(p=>p.currency==='USD'&&/gold/i.test(p.name||''))?.price??marketData['GC=F']?.price??null,
   totals:{by:clone(T.byType),other:T.totalCur-Object.values(T.byType).reduce((s,v)=>s+v.cur,0),investCost:T.investCost,gC:T.growthCur,gK:T.growthCost,total:T.totalCur,all:T.investCost+T.byType.Cash.cur+T.totalCur-Object.values(T.byType).reduce((s,v)=>s+v.cur,0),goal:retireGoal},
   OTHER:otherSrc.map(s=>({id:s.id,n:alias(s.name),v:num(s.value),c:s.currency||'SAR',inc:s.included!==false,type:s.type})),includeUnrealized,
   XR:{...clone(X),sectors:Object.fromEntries(Object.entries(X.sectors).map(([k,v])=>[clean(k),v])),companies,co:X.coCount,src},metrics:{...clone(M),s:clone(M.scores)},XRAY_DATA:xd,XR_COUNT:counts,
   monthly:calcMonthlyInvest(),projections:[0,.04,.07,.1].map(r=>({r,months:projectGoalMonths(T.totalCur,retireGoal,calcMonthlyInvest(),r)})),
   alerts:priceAlerts.map(a=>({id:a.id,a:alias(a.assetName),op:a.dir==='>='?'ge':'le',v:a.price,triggered:a.triggered})),
   cc,zakat:{...clone(Z),rows:Z.rows.map(r=>({...clone(r),name:alias(r.name),fund:r.fund?{...clone(r.fund),top:r.fund.top.map(c=>{const ratio=zkCoRatio(c.ticker);return {...clone(c),fin:ratio?.fin??1,missing:!ratio,src:ratio?.co?.source||''};})}:null})),opt:clone(Object.fromEntries(Object.entries(zkOpt).filter(([k])=>!/key|secret|token/i.test(k)))),hawl:H?{...H,due:H.due.toISOString()}:null},
   composition:setting('fundCompositionMeta',{}),customXray:clone(customXray),deleted:window.commandStorage.raw().deletedTxns.map(t=>({...t,assetName:alias(t.assetName),remarks:clean(t.remarks)})),status:window.commandStorage.status(),updatedAt:Date.now()};
 }
 function makeRows(input){
  const a=assets.find(a=>a.name===original(input.name)||String(a.id)===String(input.assetId));if(!a)throw Error('الأصل غير موجود');
  const old=input.id!=null?txns.find(t=>String(t.id)===String(input.id)):null;
  if(input.id!=null&&!old)throw Error('هذه الحركة حُذفت من جهاز آخر');
  if(old&&input.expected&&JSON.stringify(old)!==input.expected)throw Error('تغيّرت هذه الحركة من جهاز آخر. أعد فتحها قبل الحفظ.');
  const rate=a.type==='Gold'||a.currency==='SAR'?1:a.currency==='GBp'?num(input.rate)/100:num(input.rate),qty=num(input.qty),price=num(input.price),fees=num(input.fees);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(input.date)||!Number.isFinite(Date.parse(input.date))||rate<=0||fees<0)throw Error('تحقق من التاريخ وسعر الصرف');
  const action=input.action==='Withdraw'?'Withdrawal':input.action;
  if(!['Buy','Sell','Deposit','Withdrawal','Transfer'].includes(action))throw Error('نوع حركة غير صالح');
  if((a.type==='Cash')!==['Deposit','Withdrawal','Transfer'].includes(action))throw Error('نوع الحركة لا يناسب الأصل');
  let q=qty,p=price,total;
  if(a.type==='Cash'){total=num(input.amount)*rate;q=num(input.amount);p=1;}
  else if(a.type==='Property'){total=num(input.amount)*rate;q=action==='Buy'?1:num(input.propertyQty)||calcFIFO(fifoRows(a.name,old?.id)).netQty;p=num(input.amount)/(q||1);}
  else{if(q<=0||p<=0)throw Error('أدخل كمية وسعراً أكبر من صفر');total=(q*p+fees)*rate;}
  if(!(total>0)||!Number.isFinite(total))throw Error('مبلغ الحركة غير صالح');
  if(old&&old.action===action&&old.date===input.date&&num(old.qty)===q&&num(old.price)===p&&num(old.rate)===rate&&num(old.fees)===fees)total=Math.abs(num(old.totalCostSAR));
  const id=old?.id||Date.now(),row={...(old||{}),id,date:input.date,assetType:a.type,assetName:a.name,action:action==='Transfer'?'Withdrawal':action,qty:q,price:p,fees,currency:a.type==='Gold'?'SAR':a.currency,rate,totalCostSAR:total,remarks:String(input.note||'').slice(0,4000),linkedTxnId:null};
  const rows=[row],oldLink=old?.linkedTxnId&&txns.find(t=>String(t.id)===String(old.linkedTxnId));
  if(action==='Transfer'||input.fund||oldLink){
   const accountName=action==='Transfer'?input.toName:input.accountName||oldLink?.assetName;
   const acc=assets.find(x=>x.type==='Cash'&&x.name===original(accountName));
   if(!acc||acc.name===a.name)throw Error('اختر حساباً نقدياً مختلفاً');
   if(oldLink&&oldLink.assetType!=='Cash')throw Error('عدّل الحركة من الأصل المرتبط');
   const lid=oldLink?.id||id+1,ar=num(fx[acc.currency])||1;row.linkedTxnId=lid;
   rows.push({...(oldLink||{}),id:lid,date:row.date,assetType:'Cash',assetName:acc.name,action:action==='Buy'?'Withdrawal':'Deposit',qty:total/ar,price:1,fees:0,currency:acc.currency,rate:ar,totalCostSAR:total,remarks:'مرتبطة: '+a.name,linkedTxnId:id});
  }
  const excluded=new Set([String(old?.id),String(oldLink?.id)]),before=txns.filter(t=>!excluded.has(String(t.id)));
  if(action==='Sell'){
   const f=calcFIFO(before.filter(t=>t.assetName===a.name));if(q>f.netQty+1e-8)throw Error('الكمية أكبر من الرصيد');
   const dated=calcFIFO(before.filter(t=>t.assetName===a.name&&t.date<=row.date));if(q>dated.netQty+1e-8)throw Error('الكمية أكبر من الرصيد المتاح بتاريخ البيع');
  }
  if(a.type==='Cash'&&action!=='Deposit'){
   const bal=before.filter(t=>t.assetName===a.name).reduce((s,t)=>s+(t.action==='Deposit'?1:-1)*Math.abs(num(t.totalCostSAR)),0);
   if(total>bal+1e-8)throw Error('المبلغ أكبر من رصيد الحساب');
  }
  return {rows,before,asset:a,total};
 }
 function preview(input){
  const {rows,before,asset,total}=makeRows(input),r=rows[0],pre=calcFIFO(before.filter(t=>t.assetName===asset.name)),after=calcFIFO([...before.filter(t=>t.assetName===asset.name),r]);
  const ordered=[...before.filter(t=>t.assetName===asset.name),r].sort((a,b)=>a.date.localeCompare(b.date));
  const sellIndex=ordered.filter(t=>t.action==='Sell').findIndex(t=>t===r),sell=after.sellHistory[sellIndex];
  const used=[];if(r.action==='Sell'){
   const earlier=ordered.slice(0,ordered.indexOf(r)),queue=calcFIFO(earlier).fifoQueue;let left=r.qty;
   queue.forEach(l=>{const k=Math.min(left,l.qty);if(k>0){used.push({qty:k,priceSAR:l.priceSAR});left-=k;}});
  }
  const balances=rows.filter(t=>t.assetType==='Cash').map(t=>{const previous=before.filter(x=>x.assetName===t.assetName).reduce((s,x)=>s+(x.action==='Deposit'?1:-1)*Math.abs(num(x.totalCostSAR)),0);return {name:alias(t.assetName),currency:t.currency,before:previous,after:previous+(t.action==='Deposit'?1:-1)*t.totalCostSAR};});
  return {total,before:pre,after,sell,used,balances,rows:clone(rows)};
 }
 async function save(input){const {rows}=makeRows(input);await window.commandStorage.write(input.id!=null?'updateTxns':'addTxns',rows);return rows[0].id;}
 function fifoReplay(name){
  const ordered=fifoRows(name).sort((a,b)=>a.date.localeCompare(b.date)),out={},all=calcFIFO(ordered);let remaining=all.netQty;
  const lotRemainder=new Map();[...ordered].reverse().filter(t=>t.action==='Buy').forEach(t=>{const q=Math.min(remaining,Math.abs(num(t.qty)));lotRemainder.set(t.id,q);remaining-=q;});
  ordered.forEach((t,i)=>{const before=calcFIFO(ordered.slice(0,i)),after=calcFIFO(ordered.slice(0,i+1));
   out[t.id]={before:{qty:before.netQty,avg:before.avgCostSAR}};
   if(t.action==='Buy')out[t.id].lot={qty:lotRemainder.get(t.id)||0,orig:Math.abs(t.qty),p:Math.abs(t.totalCostSAR)/(Math.abs(t.qty)||1),d:t.date};
   else if(t.action==='Sell'){const s=after.sellHistory.at(-1);const rem=new Map();let left=before.netQty;const buys=ordered.slice(0,i).filter(x=>x.action==='Buy');[...buys].reverse().forEach(x=>{const q=Math.min(left,Math.abs(num(x.qty)));rem.set(x.id,q);left-=q;});let consume=Math.abs(num(t.qty));const used=[];buys.forEach(x=>{const q=Math.min(consume,rem.get(x.id)||0);if(q>0){used.push({id:x.id,d:x.date,qty:q,priceSAR:Math.abs(num(x.totalCostSAR))/Math.abs(num(x.qty))});consume-=q;}});Object.assign(out[t.id],{pnl:s.pnl,basis:s.costBasis,used});}
  });return out;
 }
 window.commandEngine={snapshot,preview,save,fifo:fifoView,fifoReplay,original,clean,
  rawTxn:id=>clone(txns.find(t=>String(t.id)===String(id))),
  delete:async id=>{const t=txns.find(t=>String(t.id)===String(id));if(!t)throw Error('الحركة غير موجودة');await window.commandStorage.write('archiveDeletedTxns',[t]);return t.id;},
  restore:id=>window.commandStorage.write('restoreTxns',[id]),
  currency:async c=>{if(!['SAR','JOD','USD'].includes(c))return;await window.commandStorage.write('saveSetting','baseCur',c);},
  setting:(k,v)=>window.commandStorage.write('saveSetting',k,typeof v==='string'?v:JSON.stringify(k==='zakatOpt'?{...setting('zakatOpt',{}),...v}:v)),
  saveAssets:list=>window.commandStorage.write('saveAssets',list),
  assets:()=>clone(assets),
  others:()=>clone(otherSrc),
  saveOthers:list=>window.commandStorage.write('saveOtherSources',list),
  refresh:async()=>{await refreshPrices();await refreshMarket();window.dispatchEvent(new Event('portfolio:changed'));},
  market:(method,...args)=>window.commandStorage.market(method,...args),
  printZakat:()=>zkReport(),
  updateZakat:async()=>{await zkUpdate(true);window.dispatchEvent(new Event('portfolio:changed'));},
  holdings:async name=>{const n=original(name),h=zkFundTop(n);if(!h?.csvUrl)throw Error('لا يوجد رابط مكوّنات محفوظ');const r=await window.commandStorage.market('fetchFundCsv',h.csvUrl,Math.max(1,Math.min(50,num(zkOpt.topN)||20)));if(!r?.ok)throw Error(r?.err||'تعذّر تحميل المكوّنات');await window.commandStorage.write('saveSetting','customXray',JSON.stringify({...customXray,[n]:{...(customXray[n]||{}),kind:'etf',label:n,countries:r.countries,sectors:r.sectors,top:r.top,_count:r.count,_csvUrl:h.csvUrl,_at:new Date().toISOString()}}));},
  legacy:page=>{window.commandViewReturn?.();if(page)showPage(page);},
  export:kind=>window.commandStorage.export(kind),
  logout:()=>document.getElementById('th-exit').click(),
  applyState:data=>initApp(data)
 };
 const previousRender=window.renderAll;
 window.renderAll=function(...args){const result=previousRender.apply(this,args);window.dispatchEvent(new Event('portfolio:changed'));return result;};
})();
