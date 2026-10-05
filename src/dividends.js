// One cash deposit is the accounting entry; its source metadata is the income ledger.
export const isDividend=t=>t?.incomeType==='Dividend'&&t.assetType==='Cash'&&t.action==='Deposit';
const same=(a,b)=>String(a)===String(b);
export function validateDividend(t){
 if(t.incomeType!=='Dividend')return;
 if(!isDividend(t)||!String(t.sourceAssetId??'')||!String(t.sourceAssetName||'').trim()||t.linkedTxnId)throw Error('بيانات إيداع التوزيعات غير صالحة');
 if(!Number.isFinite(+t.qty)||+t.qty<=0||!Number.isFinite(+t.rate)||+t.rate<=0||+t.price!==1||+t.fees!==0||+t.totalCostSAR<=0||Math.abs(+t.qty*+t.rate-(+t.totalCostSAR))>Math.max(1e-7,Math.abs(+t.totalCostSAR)*1e-10))throw Error('مبلغ التوزيعات أو سعر الصرف غير صالح');
}
export function createDividendRow(input,{assets,txns},now=Date.now()){
 const old=input.id!=null?txns.find(t=>same(t.id,input.id)):null;
 if(input.id!=null&&!old)throw Error('هذه الحركة حُذفت؛ أعد فتح القائمة');
 if(old&&(old.assetType!=='Cash'||old.action!=='Deposit'||old.linkedTxnId))throw Error('يمكن تصنيف إيداع نقدي مستقل فقط كتوزيعات');
 if(old&&JSON.stringify(old)!==input.expected)throw Error('تغيّرت الحركة من جهاز آخر؛ أعد فتحها قبل الحفظ');
 const source=assets.find(a=>same(a.id,input.sourceAssetId)&&a.type==='Stock');
 const account=assets.find(a=>same(a.id,input.accountId)&&a.type==='Cash');
 if(!source)throw Error('اختر السهم أو الصندوق الموزّع');
 if(!account)throw Error('اختر الحساب الذي استلم التوزيعات');
 const amount=Number(input.amount),rate=account.currency==='SAR'?1:Number(input.rate),date=String(input.date||'');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw Error('أدخل تاريخ استلام صالحًا');
 if(!Number.isFinite(amount)||amount<=0||!Number.isFinite(rate)||rate<=0||!Number.isFinite(amount*rate))throw Error('أدخل مبلغًا وسعر صرف أكبر من صفر');
 let id=old?.id??now;while(!old&&txns.some(t=>same(t.id,id)))id++;
 const row={...(old||{}),id,date,assetType:'Cash',assetName:account.name,action:'Deposit',qty:amount,price:1,fees:0,currency:account.currency||'SAR',rate,totalCostSAR:amount*rate,remarks:String(input.note||'').slice(0,4000),linkedTxnId:null,incomeType:'Dividend',sourceAssetId:String(source.id),sourceAssetName:source.name};
 validateDividend(row);return row;
}
export function dividendLedger(txns,assets=[]){
 return txns.filter(isDividend).map(t=>{const a=assets.find(a=>same(a.id,t.sourceAssetId));return {...t,sourceAssetName:a?.name||t.sourceAssetName};}).sort((a,b)=>b.date.localeCompare(a.date)||String(b.id).localeCompare(String(a.id)));
}
export function dividendSummary(rows,{year='all',sourceAssetId='all',today=new Date().toISOString().slice(0,10)}={}){
 const filtered=rows.filter(t=>(year==='all'||t.date.slice(0,4)===String(year))&&(sourceAssetId==='all'||same(t.sourceAssetId,sourceAssetId)));
 const sum=list=>list.reduce((n,t)=>n+Number(t.totalCostSAR),0),groups=new Map();
 for(const t of filtered){const id=String(t.sourceAssetId);if(!groups.has(id))groups.set(id,{id,name:t.sourceAssetName,total:0,count:0});const g=groups.get(id);g.total+=Number(t.totalCostSAR);g.count++;}
 return {rows:filtered,total:sum(filtered),allTime:sum(rows),thisYear:sum(rows.filter(t=>t.date.slice(0,4)===today.slice(0,4))),thisMonth:sum(rows.filter(t=>t.date.slice(0,7)===today.slice(0,7))),byAsset:[...groups.values()].sort((a,b)=>b.total-a.total)};
}
