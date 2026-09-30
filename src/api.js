import { emptyPortfolio, mutatePortfolio } from './state.js';
export function createAPI(client,{demo=false,onError=()=>{},onStatus=()=>{}}={}){
 let state=emptyPortfolio(),version=null,queue=Promise.resolve(),blocked=false;
 const marketMethods=new Set(['getPrices','fetchFundCsv','getSectors','getFundComposition','zkFetchOne','zkFetchBatch','zkTestKey','zkDiag','zkCheckCsv']);
 async function run(method,args){
  if(marketMethods.has(method)){
   if(demo){if(method==='getPrices')return {};return {ok:false,err:'الجلب المباشر يتطلب ربط قاعدة البيانات'};}
   if(method==='zkFetchBatch'){const all=typeof args[0]==='string'?JSON.parse(args[0]):args[0];if(all.length>8){const results=[];for(let i=0;i<all.length;i+=8){const r=await run(method,[all.slice(i,i+8),args[1]]);results.push(...(r.results||[]));if(!r.ok)return {...r,results};}return {ok:true,results};}}
   const {data,error}=await client.functions.invoke('portfolio-market',{body:{method,args}});if(error)throw error;return data;
  }
  if(method==='loadAll'){
   if(!demo){const {data,error}=await client.rpc('load_portfolio');if(error)throw error;const row=Array.isArray(data)?data[0]:data;state={...emptyPortfolio(),...row.data};version=row.version;}
   blocked=false;return structuredClone(state);
  }
  if(method==='getNotes')return structuredClone(state.notes).map(n=>({...n,body:n.body??n.content??''}));
  if(method==='getDeletedTxns')return structuredClone(state.deletedTxns);
  if(method==='getSetting')return state.settings[args[0]]??null;
  if(method==='getTxnBackupInfo')return {ok:true,count:state.backupTxns?.length||0,date:state.backupAt||''};
  if(blocked)throw Error('الحفظ متوقف بعد خطأ. صدّر تعديلاتك ثم أعد تحميل الصفحة.');
  if(version===null&&!demo)throw Error('لم تُحمّل البيانات بعد');
  const {data:next,result}=mutatePortfolio(state,method,args);
  if(result.ok===false)return result;
  onStatus('جاري الحفظ…');
  try{
   if(!demo){const {data,error}=await client.rpc('save_portfolio',{expected_version:version,next_data:next});if(error)throw error;const row=Array.isArray(data)?data[0]:data;version=row.version;state=row.data;}
   else state=next;
   onStatus(demo?'وضع تجربة — غير محفوظ':`محفوظ · الإصدار ${version}`);return result;
  }catch(e){blocked=true;throw e;}
 }
 function call(method,...args){
  // Serialize reads and writes so paired edits cannot overtake a load/save.
  const p=queue.then(()=>run(method,structuredClone(args)));queue=p.catch(()=>{});return p;
 }
 function chain(success,failure){return new Proxy({}, {get(_,method){
  if(method==='withSuccessHandler')return cb=>chain(cb,failure);
  if(method==='withFailureHandler')return cb=>chain(success,cb);
  return (...args)=>{call(method,...args).then(r=>success?.(r)).catch(e=>{onError(e);failure?.(e);});};
 }});}
 return {rpc:chain(),call,snapshot:()=>structuredClone(state),isBlocked:()=>blocked};
}
