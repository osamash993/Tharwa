import {createClient} from 'npm:@supabase/supabase-js@2.117.2';
import * as providers from './providers.js';
import {getPrices,getSectors} from './remote.js';
import * as command from './command-sources.js';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
 if(req.method!=='POST')return json({error:'Method not allowed'},405);
 const bearer=req.headers.get('Authorization')?.replace(/^Bearer\s+/i,'');if(!bearer)return json({error:'Unauthorized'},401);
 const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_ANON_KEY')!);
 const {data,error}=await db.auth.getUser(bearer);if(error||!data.user)return json({error:'Unauthorized'},401);
 try{
  const raw=await req.text();if(raw.length>100000)return json({error:'Request too large'},413);
  const {method,args=[]}=JSON.parse(raw);
  const methods:Record<string,Function>={...command,getPrices,getSectors,fetchFundCsv:providers.fetchFundCsv,getFundComposition:providers.getFundComposition,zkFetchOne:providers.zkFetchOne,zkFetchBatch:providers.zkFetchBatch,zkTestKey:providers.zkTestKey,zkCheckCsv:providers.zkCheckCsv,zkDiag:async(sym:string)=>({ok:true,prices:await getPrices(sym||'MSFT')})};
  if(!Object.hasOwn(methods,method)||!Array.isArray(args))return json({error:'Invalid method'},400);
  if(method==='zkFetchBatch'){
   const list=typeof args[0]==='string'?JSON.parse(args[0]):args[0];if(!Array.isArray(list)||list.length>8)return json({ok:false,err:'الحد الأقصى 8 شركات في الطلب'});
  }
  // Key may come from owner's private settings; deployment secret is also supported.
  const keyIndex=({zkFetchOne:3,zkFetchBatch:1,zkTestKey:0} as Record<string,number>)[method];
  if(keyIndex!==undefined&&!args[keyIndex])args[keyIndex]=Deno.env.get('FMP_API_KEY')||'';
  return json(await methods[method](...args));
 }catch(e){return json({ok:false,err:'تعذّر جلب البيانات من المصدر'});}
});
