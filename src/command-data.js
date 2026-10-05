import {mutatePortfolio} from './state.js';

export function setupCommandData({api,client,demo,onError}){
 let busy=false,queue=Promise.resolve(),lastSync=null,online=navigator.onLine,marketStatus={},polling=false;
 const emit=()=>window.dispatchEvent(new Event('portfolio:changed'));
 const cached=new Map();
 const apply=data=>window.commandEngine?.applyState(data);
 const allowed=new Set(['getDividends','getHistory','getNews','getCalendar','getCompanyQuotes','getMarketStatus']);
 async function market(method,...args){
  if(!allowed.has(method))return api.call(method,...args);
  if(demo)return {ok:false,error:'المصادر الخارجية غير متاحة في وضع التجربة'};
  const key=JSON.stringify([method,args]),ttl=['getHistory','getDividends'].includes(method)?43200000:method==='getCalendar'?86400000:900000,hit=cached.get(key);
  if(!(method==='getDividends'&&args[1]?.refresh===true)&&hit&&Date.now()-hit.at<ttl)return structuredClone(hit.data);
  try{const {data,error}=await client.functions.invoke('portfolio-market',{body:{method,args}});if(error)throw error;if(data?.ok===false)throw Error(data.error||data.err||'المصدر غير متاح');cached.set(key,{at:Date.now(),data});marketStatus[method]={ok:true,at:Date.now()};return data;}
  catch(e){marketStatus[method]={ok:false,at:Date.now()};return {ok:false,error:e.message};}
 }
 function write(method,...args){
  const pending=queue.then(async()=>{
   if(api.isBlocked())throw Error('الحفظ متوقف بعد تعارض. أعد الاتصال قبل المحاولة');
   busy=true;const before=api.snapshot();
   try{
    const next=mutatePortfolio(before,method,args);if(next.result.ok===false)throw Error('تعذّر التعديل');
    apply(next.data);emit();
    const result=await api.call(method,...args);if(result?.ok===false)throw Error('تعذّر الحفظ');
    apply(api.snapshot());lastSync=Date.now();emit();return result;
   }catch(e){apply(before);emit();onError(e);throw e;}
   finally{busy=false;}
  });queue=pending.catch(()=>{});return pending;
 }
 async function check(){
  if(demo||busy||polling||document.hidden||!window.portfolioLoaded)return;
  polling=true;
  try{const changed=await api.call('checkRemote');online=true;lastSync=Date.now();if(changed){apply(api.snapshot());emit();}}
  catch{online=false;}finally{polling=false;}
 }
 function download(data,name,type){const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
 const raw=()=>api.snapshot();
 window.commandStorage={raw,write,market,status:()=>({demo,busy,online,lastSync,market:marketStatus}),
  export:async kind=>{
   if(kind==='xlsx')return window.downloadTransactions(raw().txns);
   if(kind==='json'){const state=raw();for(const k of Object.keys(state.settings))if(/key|secret|token/i.test(k))delete state.settings[k];
    if(state.settings.zakatOpt){try{const o=JSON.parse(state.settings.zakatOpt);for(const k of Object.keys(o))if(/key|secret|token/i.test(k))delete o[k];state.settings.zakatOpt=JSON.stringify(o);}catch{}}
    return download(JSON.stringify(state,null,2),'Odb-backup-'+new Date().toISOString().slice(0,10)+'.json','application/json');}
   const fields=['id','date','assetType','assetName','action','qty','price','fees','currency','rate','totalCostSAR','remarks','linkedTxnId','incomeType','sourceAssetId','sourceAssetName','dividendShares','dividendPerShare','dividendWithholding','dividendCostSAR'];
   const csv=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
   download('\ufeff'+[fields.join(','),...raw().txns.map(t=>fields.map(k=>csv(t[k])).join(','))].join('\r\n'),'Odb-transactions.csv','text/csv;charset=utf-8');
  }};
 // The deployed database contains one versioned JSONB row and has no Realtime
 // publication. Poll the existing authenticated RPC without altering its schema.
 setInterval(check,6000);
 window.addEventListener('online',()=>{online=true;check();emit();});
 window.addEventListener('offline',()=>{online=false;emit();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
 return {check};
}
