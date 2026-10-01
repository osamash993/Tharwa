import {createClient} from '@supabase/supabase-js';
import Chart from 'chart.js/auto';
import {marked} from 'marked';
import DOMPurify from 'dompurify';
import '@tabler/icons-webfont/dist/tabler-icons.min.css';
import './original-layout.css';
import 'jsvectormap/dist/jsvectormap.css';
import {setupOriginalLayout} from './original-layout.js';
import {createAPI} from './api.js';
import {supabaseUrl, supabasePublishableKey} from './public-config.js';

window.loadTharwaMap=async()=>{
 const {default:VectorMap}=await import('jsvectormap');
 window.jsVectorMap=VectorMap;
 await import('jsvectormap/dist/maps/world.js');
 window._geoWorldLoaded=true;
};
setupOriginalLayout();
window.Chart=Chart;window.marked={setOptions:opts=>marked.setOptions(opts),parse:md=>DOMPurify.sanitize(marked.parse(md))};window.sanitizeHTML=x=>DOMPurify.sanitize(x);
const url=import.meta.env.VITE_SUPABASE_URL||supabaseUrl,key=import.meta.env.VITE_SUPABASE_ANON_KEY||supabasePublishableKey;
const configured=!!url&&!!key&&!url.includes('YOUR_PROJECT');
const client=configured?createClient(url,key):null;
const demo=new URLSearchParams(location.search).get('demo')==='1';
const screen=document.getElementById('auth-screen');
// Keep browser chrome in step with login and the app's own light/dark setting.
function syncBrowserTheme(){
 const dark=document.body.classList.contains('ready')&&document.documentElement.classList.contains('ios-dark');
 document.querySelector('meta[name="theme-color"]').content=dark?'#000000':'#f2f2f7';
}
const browserThemeObserver=new MutationObserver(syncBrowserTheme);
browserThemeObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
browserThemeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
syncBrowserTheme();
const indicator=document.getElementById('cloud-indicator');
window.cloudFailure=e=>{
 const box=document.getElementById('cloud-error');box.hidden=false;
 box.textContent=(String(e.message).includes('CONFLICT')?'في تعديل أحدث من جهاز ثاني. ':'تعذّر الحفظ أو تحميل البيانات. ')+(e.message||'')+' — صدّر تعديلاتك ثم أعد تحميل الصفحة.';
 indicator.textContent='غير محفوظ';indicator.dataset.error='true';
};
const api=createAPI(client,{demo,onError:window.cloudFailure,onStatus:message=>{indicator.textContent=message;}});
window.portfolioAPI=api.rpc;
window.downloadTransactions=async txns=>{try{const {exportTransactions,download}=await import('./workbook.js');download(await exportTransactions(txns),'Tharwa_Transactions_'+new Date().toISOString().slice(0,10)+'.xlsx');}catch(e){window.cloudFailure(e);}};
window.refreshOverview=()=>{};
window.reloadPortfolio=async()=>{const data=await api.call('loadAll');window.portfolioBridge.load(data);};
async function loadScript(path){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=import.meta.env.BASE_URL+path+'?v='+encodeURIComponent(import.meta.url);s.onload=resolve;s.onerror=reject;document.body.append(s);});}
let started=false;
async function start(){
 if(started)return;started=true;
 try{
  await loadScript('legacy/app.js');
  screen.hidden=true;document.body.classList.add('ready');
  window.startPortfolio();indicator.textContent=demo?'تجربة — البيانات هنا لا تُحفظ':'جاري الاتصال…';
 }catch(e){started=false;window.cloudFailure(e);}
}
const menu=document.getElementById('topMenu');
function menuAction(id,label,icon,handler){
 const button=document.createElement('button');button.id=id;button.className='tab-btn';button.innerHTML=`<i class="ti ${icon}"></i><span>${label}</span>`;
 button.onclick=()=>{menu.classList.remove('open');handler();};menu.insertBefore(button,menu.querySelector('.top-menu-sync'));return button;
}
const file=document.createElement('input');file.type='file';file.accept='.xlsx';file.hidden=true;document.body.append(file);
menuAction('th-export','تنزيل الحركات Excel','ti-download',()=>window.portfolioBridge.export());
menuAction('th-import','استيراد Excel','ti-upload',()=>file.click());
let leaving=false;
function returnToLogin(){
 if(leaving)return;leaving=true;
 document.body.classList.remove('ready');screen.hidden=false;
 // Replace the current entry and discard demo parameters on every logout path.
 location.replace(location.pathname+'?login=1');
}
menuAction('th-exit',demo?'العودة لتسجيل الدخول':'تسجيل الخروج','ti-logout',async()=>{
 try{
  if(client&&!demo){const {error}=await client.auth.signOut({scope:'local'});if(error)throw error;}
  returnToLogin();
 }catch(e){alert('تعذّر تسجيل الخروج. تحقق من الاتصال وحاول مرة ثانية.');}
});
menu.querySelector('.top-menu-sync').append(indicator);
file.onchange=async()=>{
 try{
  if(!file.files[0])return;
  const {readWorkbook}=await import('./workbook.js');const p=await readWorkbook(await file.files[0].arrayBuffer());
  if(!confirm(`استيراد ${p.txns.length} حركة، ${p.assets.length} أصل، ${p.notes.length} ملاحظات؟\nسيحل الملف محل البيانات الحالية. تُحفظ النسخة الحالية تلقائياً ضمن سجل قاعدة البيانات.`))return;
  await api.call('importPortfolio',p);await window.reloadPortfolio();
 }catch(e){window.cloudFailure(e);}finally{file.value='';}
};
screen.innerHTML=`<form class="auth-card"><div class="auth-brand">◈ ثروة</div><p class="auth-kicker">مساحتك المالية الخاصة</p><h1>${configured?'أهلاً بعودتك':'المشروع جاهز للربط'}</h1><p>${configured?'سجّل دخولك للوصول إلى محفظتك من الكمبيوتر والموبايل.':'يحتاج التطبيق إعداد اتصال Supabase لبدء الحفظ والمزامنة.'}</p>${configured?'<label>البريد الإلكتروني<input type="email" name="email" autocomplete="username" required dir="ltr"></label><label>كلمة المرور<input type="password" name="password" autocomplete="current-password" required dir="ltr"></label><button class="auth-submit">دخول آمن ←</button>':''}<p id="auth-error" role="alert"></p><a class="demo-link" href="?demo=1">استكشاف الواجهة بدون حفظ</a><small>استخدم حساب التطبيق وكلمة مروره المستقلة. بياناتك المالية محفوظة بشكل خاص.</small></form>`;
screen.querySelector('form').onsubmit=async e=>{
 e.preventDefault();const form=new FormData(e.currentTarget);const btn=e.currentTarget.querySelector('button');btn.disabled=true;
 const errorBox=document.getElementById('auth-error');errorBox.textContent='';
 try{
  const {error}=await client.auth.signInWithPassword({email:form.get('email'),password:form.get('password')});
  if(error)errorBox.textContent='تعذّر تسجيل الدخول. تحقق من البريد وكلمة المرور.';
  else {history.replaceState(null,'',location.pathname);await start();}
 }catch(e){errorBox.textContent='تعذّر الاتصال. تحقق من الإنترنت وحاول مرة ثانية.';}
 finally{btn.disabled=false;}
};
if(demo)await start();
else if(client){
 client.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'&&started)returnToLogin();});
 try{const {data,error}=await client.auth.getSession();if(!error&&data.session&&!new URLSearchParams(location.search).has('login'))await start();}
 catch(e){document.getElementById('auth-error').textContent='تعذّر التحقق من الجلسة. سجّل دخولك مرة ثانية.';}
}
