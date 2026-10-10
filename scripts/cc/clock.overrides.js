// Server Date supplies wall time; the monotonic clock advances it independently of device clock changes.
function serverClockState(){return window._serverClock||(window._serverClock={epoch:null,at:0,busy:false,started:false});}
function serverClockNow(){const s=serverClockState(),elapsed=performance.now()-s.at;return s.epoch==null||elapsed<0||elapsed>15*60*1000?null:new Date(s.epoch+elapsed);}
async function syncServerClock(){
 const s=serverClockState();if(s.busy)return;s.busy=true;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000),start=performance.now();
 try{
  const url=new URL('./index.html',location.href);url.searchParams.set('clock',crypto.randomUUID());
  const response=await fetch(url,{method:'HEAD',cache:'no-store',signal:controller.signal});
  const end=performance.now(),epoch=Date.parse(response.headers.get('Date')),age=Number(response.headers.get('Age')||0);
  if(!response.ok||!Number.isFinite(epoch)||!Number.isFinite(age)||age<0||end-start>8000)throw Error('Clock source unavailable');
  s.epoch=epoch+age*1000+(end-start)/2;s.at=end;
 }catch{}finally{clearTimeout(timer);s.busy=false;renderServerClock();}
}
function renderServerClock(){
 const d=serverClockNow(),el=$('clock');if(!el)return;
 el.textContent=d?d.toLocaleTimeString('en-GB',{timeZone:'Asia/Riyadh',hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'}):'--:--:--';
 el.title=d?'توقيت الرياض · متزامن مع سيرفر الموقع':'بانتظار مزامنة وقت السيرفر';el.setAttribute('aria-label',el.title);
}
function startServerClock(){
 const s=serverClockState();if(s.started)return;s.started=true;renderServerClock();syncServerClock();
 setInterval(renderServerClock,1000);setInterval(syncServerClock,5*60*1000);
 window.addEventListener('online',syncServerClock);document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncServerClock();});
}
function ambTickClock(){
 const d=serverClockNow();$('ambClock').textContent=d?d.toLocaleTimeString('en-GB',{timeZone:'Asia/Riyadh',hour12:false,hour:'2-digit',minute:'2-digit'}):'--:--';
 $('ambDate').textContent=d?d.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{timeZone:'Asia/Riyadh',weekday:'long',day:'numeric',month:'long',year:'numeric'})+' · توقيت الرياض':'بانتظار مزامنة وقت السيرفر';
 const c=$('ambCd');if(c&&EV[0])c.textContent=cd(EV[0]);
}
