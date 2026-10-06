const DAY=86400000;
const same=(a,b)=>String(a)===String(b);
export function dividendEventKey(id,exDate){return encodeURIComponent(String(id))+'|'+exDate;}
export function dividendEvents(assets,txns,results,today=new Date().toISOString().slice(0,10)){
 const events=[],receipts=txns.filter(t=>t.incomeType==='Dividend'&&t.assetType==='Cash'&&t.action==='Deposit');
 for(const a of assets.filter(a=>a.type==='Stock'&&a.yahooSym)){
  const source=results.find(r=>r.symbol===a.yahooSym&&r.ok);if(!source)continue;
  const trades=txns.filter(t=>t.assetType==='Stock'&&t.assetName===a.name&&['Buy','Sell'].includes(t.action));
  const quantityAt=(date,inclusive=false)=>Math.max(0,trades.filter(t=>inclusive?t.date<=date:t.date<date).reduce((n,t)=>n+(t.action==='Buy'?1:-1)*Number(t.qty),0));
  const byDate=new Map();
  for(const e of source.upcoming||[])byDate.set(e.exDate,e);
  for(const e of source.history||[])byDate.set(e.exDate,{...e,date:e.paymentDate||e.exDate,dateKind:e.paymentDate?'payment':'ex',status:'announced'});
  for(const e of byDate.values()){
   if(!/^\d{4}-\d{2}-\d{2}$/.test(e.exDate||''))continue;
   const key=dividendEventKey(a.id,e.exDate),date=e.paymentDate||e.exDate,receipt=receipts.find(t=>t.dividendEventKey===key),qty=e.exDate<=today?quantityAt(e.exDate):quantityAt(today,true);
   if(qty<=1e-8&&!receipt)continue;
   const candidates=receipt?[]:receipts.filter(t=>!t.dividendEventKey&&same(t.sourceAssetId,a.id)&&Math.abs(Date.parse(t.date)-Date.parse(date))<=30*DAY).map(t=>t.id);
   events.push({...e,key,date,dateKind:e.paymentDate?'payment':'ex',sourceAssetId:String(a.id),name:a.name,symbol:a.yahooSym,qty,quantityBasis:e.exDate<=today?'historical':'current',state:receipt?'received':date<=today?(candidates.length?'review':'pending'):'upcoming',receiptId:receipt?.id,candidateIds:candidates,source:source.source,url:source.url});
  }
 }
 return events.sort((a,b)=>a.date.localeCompare(b.date));
}
export function dividendReminders(events,today,days=7){
 const now=Date.parse(today),out=[];
 for(const e of events){if(e.state==='received')continue;
  if(e.state==='pending'||e.state==='review'){out.push({...e,reminderKind:e.paymentDate?'unrecorded':'checkPayment',reminderDate:e.date});continue;}
  const ex=(Date.parse(e.exDate)-now)/DAY,pay=e.paymentDate?(Date.parse(e.paymentDate)-now)/DAY:null;
  if(ex>=0&&ex<=days)out.push({...e,reminderKind:'exDate',reminderDate:e.exDate});
  if(pay!=null&&pay>=0&&pay<=days)out.push({...e,reminderKind:'payment',reminderDate:e.paymentDate});
 }
 return out.sort((a,b)=>a.reminderDate.localeCompare(b.reminderDate));
}
