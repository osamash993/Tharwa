export const needsLogin=e=>e?.code==='SESSION_EXPIRED';
const unauthorized=r=>r?.status===401||r?.error?.status===401||r?.error?.context?.status===401||r?.error?.code==='PGRST301'||/jwt expired/i.test(r?.error?.message||'');
const expired=()=>Object.assign(new Error('انتهت جلسة الدخول. سجّل دخولك مجددًا للمتابعة.'),{code:'SESSION_EXPIRED'});

// Share refresh work between prices, polling and saves. Never retry ambiguous writes.
export function createAuthenticatedRequests(client,{onAuthRequired=()=>{}}={}){
 let refreshing=null,revision=0,authRequired=false;
 function fail(){authRequired=true;const e=expired();onAuthRequired(e);throw e;}
 async function session(){
  if(!client.auth)return null; // API-only test adapters.
  const {data,error}=await client.auth.getSession();
  if(error){if(error.status>=500||error.name==='AuthRetryableFetchError')throw error;return fail();}
  if(!data.session)return fail();
  return data.session;
 }
 async function refresh(owner){
  if(!refreshing)refreshing=(async()=>{
   const {data,error}=await client.auth.refreshSession();
   if(error){if(error.status>=500||error.name==='AuthRetryableFetchError')throw error;return fail();}
   if(!data.session||data.session.user?.id!==owner)return fail();
   revision++;authRequired=false;return data.session;
  })().finally(()=>{refreshing=null;});
  return refreshing;
 }
 async function request(operation){
  let current=await session();
  if(current?.expires_at&&current.expires_at*1000<Date.now()+60000)current=await refresh(current.user?.id);
  const seen=revision,owner=current?.user?.id;
  let result=await operation(current?.access_token);
  if(unauthorized(result)&&client.auth){
   current=seen===revision?await refresh(owner):await session();
   if(current?.user?.id!==owner)return fail();
   result=await operation(current.access_token);
   if(unauthorized(result))return fail();
  }
  if(!result.error)authRequired=false;
  return result;
 }
 return {rpc:(name,args)=>request(()=>client.rpc(name,args)),invoke:(method,args)=>request(token=>client.functions.invoke('portfolio-market',{body:{method,args},...(token?{headers:{Authorization:'Bearer '+token}}:{})})),requiresLogin:()=>authRequired};
}
