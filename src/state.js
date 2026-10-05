import {validateDividend} from './dividends.js';
export const emptyPortfolio=()=>({txns:[],assets:[],otherSources:[],notes:[],deletedTxns:[],settings:{},backupTxns:[],sourceSheets:{}});
const same=(a,b)=>String(a)===String(b);
const unique=arr=>{const ids=new Set();for(const x of arr){if(x.id===undefined||x.id===null||x.id==='')throw Error('سجل بلا معرّف');if(ids.has(String(x.id)))throw Error('معرّفات مكررة');ids.add(String(x.id));}return arr;};
export function validatePortfolio(p){
 for(const k of ['txns','assets','otherSources','notes','deletedTxns']){if(!Array.isArray(p[k]))throw Error('حقل مفقود: '+k);unique(p[k]);}
 if(!p.settings||typeof p.settings!=='object'||Array.isArray(p.settings))throw Error('إعدادات غير صالحة');
 for(const t of p.txns){validateDividend(t);if(!['Buy','Sell','Deposit','Withdrawal'].includes(t.action))throw Error('نوع حركة غير صالح');if(!/^\d{4}-\d{2}-\d{2}$/.test(t.date))throw Error('تاريخ غير صالح');for(const k of ['qty','price','fees','rate','totalCostSAR'])if(!Number.isFinite(Number(t[k]??0)))throw Error('قيمة غير رقمية: '+k);}
 return p;
}
export function mutatePortfolio(state,method,args){
 const d=structuredClone(state);let result={ok:true};
 const upsert=(key,items)=>{unique(items);for(const t of items){const i=d[key].findIndex(x=>same(x.id,t.id));if(i<0)d[key].push(t);else d[key][i]=t;}};
 switch(method){
 case 'addTxn': case 'updateTxn':upsert('txns',[args[0]]);break;
 case 'addTxns': case 'updateTxns':upsert('txns',args[0]);break;
 case 'deleteTxn': d.txns=d.txns.filter(x=>!same(x.id,args[0]));break;
 case 'archiveDeletedTxns': {
  const requested=new Set(args[0].map(x=>String(x.id)));
  for(const t of d.txns)if(requested.has(String(t.id))&&t.linkedTxnId)requested.add(String(t.linkedTxnId));
  const deleted=d.txns.filter(x=>requested.has(String(x.id))).map(t=>({...t,deletedAt:new Date().toISOString()}));
  upsert('deletedTxns',deleted); d.txns=d.txns.filter(x=>!requested.has(String(x.id)));break;
 }
 case 'restoreTxns':{
  const ids=new Set(args[0].map(String));
  for(const t of d.deletedTxns)if(ids.has(String(t.id))&&t.linkedTxnId)ids.add(String(t.linkedTxnId));
  const items=d.deletedTxns.filter(x=>ids.has(String(x.id)));
  upsert('txns',items.map(({deletedAt,...t})=>t));d.deletedTxns=d.deletedTxns.filter(x=>!ids.has(String(x.id)));result.count=items.length;break;
 }
 case 'clearDeletedTxns':d.deletedTxns=[];break;
 case 'syncTxns':{
  unique(args[0]);const removed=d.txns.filter(x=>!args[0].some(t=>same(t.id,x.id)));
  if(removed.length>0&&!args[1]?.force)return {data:state,result:{ok:false,needsConfirm:true,curCount:d.txns.length,newCount:args[0].length,missing:removed.length}};
  d.backupTxns=structuredClone(d.txns);d.backupAt=new Date().toISOString();
  upsert('deletedTxns',removed.map(t=>({...t,deletedAt:d.backupAt})));d.txns=args[0];result.count=d.txns.length;break;
 }
 case 'saveAssets':d.assets=unique(args[0]);break;
 case 'saveOtherSources':d.otherSources=unique(args[0]);break;
 case 'saveSetting':d.settings[String(args[0])]=String(args[1]);break;
 case 'saveNotesToSheet':d.notes=unique(args[0]);d.settings.notes=JSON.stringify(d.notes);break;
 case 'saveNote':upsert('notes',[args[0]]);break;
 case 'deleteNoteFromSheet':d.notes=d.notes.filter(x=>!same(x.id,args[0]));break;
 case 'archiveNote':case 'pinNote':{const n=d.notes.find(x=>same(x.id,args[0]));if(n)n[method==='pinNote'?'pinned':'archived']=args[1];break;}
 case 'restoreTxnsBackup':d.txns=structuredClone(d.backupTxns||[]);result.count=d.txns.length;break;
 case 'importPortfolio':return {data:validatePortfolio(structuredClone(args[0])),result:{ok:true,count:args[0].txns.length}};
 default:throw Error('عملية غير معروفة: '+method);
 }
 validatePortfolio(d);return {data:d,result};
}
