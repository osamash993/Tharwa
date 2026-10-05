import './command-view.css';

// The visual reference runs in an isolated same-origin document; the engine stays here.
export function createCommandView({api,onError=()=>{}}){
 const root=document.createElement('section');
 root.id='cc-root';root.hidden=true;root.dir='rtl';
 root.setAttribute('aria-label','O.db Command Center');
 root.innerHTML=`<button type="button" id="cc-return" hidden>الواجهة السابقة</button><iframe id="cc-frame" title="O.db Command Center" referrerpolicy="same-origin"></iframe><p id="cc-view-status" role="status" hidden></p>`;
 document.body.append(root);
 const menu=document.getElementById('topMenu');
 const entry=document.createElement('button');entry.id='th-command-view';entry.type='button';entry.className='tab-btn';
 entry.innerHTML='<i class="ti ti-layout-dashboard"></i><span>O.db — الواجهة الجديدة</span>';
 menu.insertBefore(entry,menu.querySelector('.top-menu-sync'));
 const status=root.querySelector('#cc-view-status'),back=root.querySelector('#cc-return');
 const savedNodes=new Map();
 let selected='legacy',ready=false,busy=false,legacyScroll=0,frameLoaded=Promise.resolve();
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
   const frame=root.querySelector('iframe');if(!frame.getAttribute('src')){frameLoaded=new Promise(resolve=>{const timeout=setTimeout(resolve,8000);frame.addEventListener('load',()=>{clearTimeout(timeout);resolve();},{once:true});});frame.src=import.meta.env.BASE_URL+'command-center/index.html?v='+__COMMAND_CENTER_VERSION__;}
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
 window.commandViewReturn=()=>choose('legacy');
 window.addEventListener('popstate',()=>{if(ready)apply(valid(requested())?requested():'legacy',{updateURL:false});});
 return {async editDividend(id){await choose('cc');await frameLoaded;root.querySelector('iframe').contentWindow.openDividendForm(null,id);},async initialize(){
  // startPortfolio queued loadAll first; read the saved preference after that same load.
  let saved='legacy';
  try{saved=await api.call('getSetting','view');}catch(error){onError(error);}
  ready=true;
  apply(valid(requested())?requested():valid(saved)?saved:'cc',{updateURL:false,focus:false});
  if(selected==='cc')await frameLoaded;
 }};
}
