import {createClient} from '@supabase/supabase-js';
import Chart from 'chart.js/auto';
import {marked} from 'marked';
import DOMPurify from 'dompurify';
import '@tabler/icons-webfont/dist/tabler-icons.min.css';
import './theme.css';
import './overview.js';
import {createAPI} from './api.js';
import {supabaseUrl, supabasePublishableKey} from './public-config.js';

window.Chart=Chart;window.marked={setOptions:opts=>marked.setOptions(opts),parse:md=>DOMPurify.sanitize(marked.parse(md))};window.sanitizeHTML=x=>DOMPurify.sanitize(x);
const url=import.meta.env.VITE_SUPABASE_URL||supabaseUrl,key=import.meta.env.VITE_SUPABASE_ANON_KEY||supabasePublishableKey;
const configured=!!url&&!!key&&!url.includes('YOUR_PROJECT');
const client=configured?createClient(url,key):null;
const demo=new URLSearchParams(location.search).get('demo')==='1';
const screen=document.getElementById('auth-screen');
const indicator=document.getElementById('cloud-indicator');
window.cloudFailure=e=>{
 const box=document.getElementById('cloud-error');box.hidden=false;
 box.textContent=(String(e.message).includes('CONFLICT')?'في تعديل أحدث من جهاز ثاني. ':'تعذّر الحفظ أو تحميل البيانات. ')+(e.message||'')+' — صدّر تعديلاتك ثم أعد تحميل الصفحة.';
 indicator.textContent='غير محفوظ';indicator.dataset.error='true';
};
const api=createAPI(client,{demo,onError:window.cloudFailure,onStatus:message=>{indicator.textContent=message;}});
window.portfolioAPI=api.rpc;
window.downloadTransactions=async txns=>{try{const {exportTransactions,download}=await import('./workbook.js');download(await exportTransactions(txns),'Tharwa_Transactions_'+new Date().toISOString().slice(0,10)+'.xlsx');}catch(e){window.cloudFailure(e);}};
window.refreshOverview=()=>document.querySelector('wealth-overview')?.render();
window.reloadPortfolio=async()=>{const data=await api.call('loadAll');window.portfolioBridge.load(data);};
async function loadScript(path){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=import.meta.env.BASE_URL+path;s.onload=resolve;s.onerror=reject;document.body.append(s);});}
let started=false;
async function start(){
 if(started)return;started=true;
 try{
  await loadScript('legacy/app.js');
  screen.hidden=true;document.body.classList.add('ready');
  window.startPortfolio();indicator.textContent=demo?'تجربة — البيانات هنا لا تُحفظ':'جاري الاتصال…';
 }catch(e){started=false;window.cloudFailure(e);}
}
const nav=[['dashboard','نظرة عامة'],['portfolio','الأصول'],['transactions','الحركات'],['goals','الأهداف'],['market','الأسواق'],['geo','التحليل'],['zakat','الزكاة'],['notes','الملاحظات']];
const header=document.createElement('header');header.className='th-header';header.innerHTML=`<a class="th-brand" href="#"><span class="th-mark">◈</span> ثروة</a><nav aria-label="الرئيسية">${nav.map(([id,label])=>`<button data-nav="${id}">${label}</button>`).join('')}</nav><div class="th-actions"><button id="th-export" title="تنزيل الحركات Excel" aria-label="تنزيل الحركات Excel"><i class="ti ti-download"></i></button><button id="th-import" title="استيراد الملف" aria-label="استيراد الملف"><i class="ti ti-upload"></i></button><button id="th-refresh" title="تحديث الأسعار" aria-label="تحديث الأسعار"><i class="ti ti-refresh"></i></button><button id="th-settings" title="إدارة الأصول" aria-label="إدارة الأصول"><i class="ti ti-settings"></i></button><button id="th-exit" title="تسجيل الخروج" aria-label="تسجيل الخروج"><i class="ti ti-logout"></i></button></div>`;
document.querySelector('.app').prepend(header);
header.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{window.portfolioBridge.go(b.dataset.nav);header.querySelectorAll('[data-nav]').forEach(x=>x.classList.toggle('active',x===b));});
header.querySelector('.th-brand').onclick=e=>{e.preventDefault();window.portfolioBridge.go('dashboard');};
header.querySelector('#th-export').onclick=()=>window.portfolioBridge.export();
header.querySelector('#th-refresh').onclick=()=>window.portfolioBridge.refresh();
header.querySelector('#th-settings').onclick=()=>window.portfolioBridge.go('assets');
header.querySelector('#th-exit').onclick=async()=>{if(client)await client.auth.signOut();location.href=location.pathname;};
const file=document.createElement('input');file.type='file';file.accept='.xlsx';file.hidden=true;document.body.append(file);
header.querySelector('#th-import').onclick=()=>file.click();
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
 const {error}=await client.auth.signInWithPassword({email:form.get('email'),password:form.get('password')});btn.disabled=false;
 if(error)document.getElementById('auth-error').textContent='تعذّر تسجيل الدخول. تحقق من البريد وكلمة المرور.';else await start();
};
if(demo)await start();
else if(client){const {data,error}=await client.auth.getSession();if(!error&&data.session)await start();client.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT')location.reload();});}
