import './command-view.css';

// Phase 0: an isolated, deliberately empty root. No copied demo data/calculations.
export function createCommandView({api,onError=()=>{}}){
 const root=document.createElement('section');
 root.id='cc-root';root.hidden=true;root.dir='rtl';
 root.setAttribute('aria-label','O.db Command Center — مرحلة التحضير');
 root.innerHTML=`<header class="cc-switchbar"><div><strong dir="ltr">O.db · COMMAND CENTER</strong><small>مرحلة 0 — تجهيز الواجهة الجديدة</small></div><button type="button" id="cc-return">العودة للواجهة الحالية</button></header><p class="cc-stage-note">هذه مساحة التجهيز فقط. التصميم والبيانات يُضافان بالمراحل التالية.</p><main id="cc-content" aria-label="مساحة الواجهة الجديدة"></main><p id="cc-view-status" role="status"></p>`;
 document.body.append(root);
 const menu=document.getElementById('topMenu');
 const entry=document.createElement('button');entry.id='th-command-view';entry.type='button';entry.className='tab-btn';
 entry.innerHTML='<i class="ti ti-layout-dashboard"></i><span>Command Center — تجربة الواجهة الجديدة</span>';
 menu.insertBefore(entry,menu.querySelector('.top-menu-sync'));
 const status=root.querySelector('#cc-view-status'),back=root.querySelector('#cc-return');
 const savedNodes=new Map();
 let selected='legacy',ready=false,busy=false,legacyScroll=0;
 const valid=value=>value==='cc'||value==='legacy';
 const requested=()=>new URL(location.href).searchParams.get('view');
 const excluded=node=>node===root||['SCRIPT','STYLE','LINK'].includes(node.tagName)||['auth-screen','cloud-error'].includes(node.id);
 function hideLegacy(node){
  if(!(node instanceof HTMLElement)||excluded(node)||savedNodes.has(node))return;
  savedNodes.set(node,{hidden:node.hidden,inert:node.inert});node.hidden=true;node.inert=true;
 }
 const additions=new MutationObserver(records=>{
  if(selected==='cc')records.forEach(record=>record.addedNodes.forEach(hideLegacy));
 });
 additions.observe(document.body,{childList:true});
 function apply(view,{updateURL=true,focus=true}={}){
  if(!valid(view))view='legacy';
  const changed=selected!==view;
  if(view==='cc'&&changed)legacyScroll=window.scrollY;
  selected=view;document.body.dataset.portfolioView=view;
  if(view==='cc'){
   [...document.body.children].forEach(hideLegacy);root.hidden=false;
   if(changed){window.scrollTo(0,0);if(focus)back.focus({preventScroll:true});}
  }else{
   root.hidden=true;
   savedNodes.forEach((previous,node)=>{node.hidden=previous.hidden;node.inert=previous.inert;});savedNodes.clear();
   if(changed){
    window.dispatchEvent(new Event('resize'));
    window.scrollTo(0,legacyScroll);
    if(focus)document.getElementById('btnTopMenu')?.focus({preventScroll:true});
   }
  }
  if(updateURL){const url=new URL(location.href);url.searchParams.set('view',view);history.replaceState(null,'',url.pathname+url.search+url.hash);}
 }
 async function choose(view){
  if(!ready||busy)return;
  menu.classList.remove('open');apply(view);busy=true;entry.disabled=true;back.disabled=true;
  status.textContent='جاري حفظ اختيار الواجهة…';
  try{
   // Existing settings API, same storage schema; only the explicitly requested view key.
   const result=await api.call('saveSetting','view',view);
   if(result?.ok===false)throw Error(result.error||'تعذّر حفظ اختيار الواجهة');
   status.textContent='';
  }catch(error){status.textContent='تعذّر حفظ الاختيار. يمكنك العودة للواجهة الحالية.';onError(error);}
  finally{busy=false;entry.disabled=false;back.disabled=false;}
 }
 entry.addEventListener('click',()=>choose('cc'));
 back.addEventListener('click',()=>choose('legacy'));
 window.addEventListener('popstate',()=>{if(ready)apply(valid(requested())?requested():'legacy',{updateURL:false});});
 return {async initialize(){
  // startPortfolio queued loadAll first; read the saved preference after that same load.
  let saved='legacy';
  try{saved=await api.call('getSetting','view');}catch(error){onError(error);}
  ready=true;
  apply(valid(requested())?requested():valid(saved)?saved:'legacy',{updateURL:false,focus:false});
 }};
}
