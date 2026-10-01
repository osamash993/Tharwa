
// Every control remains the original live DOM node; only its workspace changes.
export function buildWorkspaces(){
 const $=id=>document.getElementById(id);
 const create=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text)n.textContent=text;return n;};
 const group=(parent,cls,nodes)=>{const n=create('div',cls);nodes.filter(Boolean).forEach(x=>n.append(x));parent.append(n);return n;};
 const card=id=>$(id).closest('.card,.xr-card,.glass-card');
 const heading=(parent,title,sub)=>{const h=create('div','ws-heading');h.append(create('h2','',title));if(sub)h.append(create('p','',sub));parent.prepend(h);};
 const switchers=[];
 function workspace(id,items){
  const page=$('page-'+id);page.querySelector(':scope>.layout-jumps')?.remove();
  const nav=create('nav','ws-nav');nav.setAttribute('aria-label','أقسام '+page.querySelector('.page-title').textContent);
  const body=create('div','ws-body');page.querySelector('.topbar').after(nav);nav.after(body);
  const panels=items.map(([name,icon,nodes])=>{
   const panel=create('section','ws-panel');panel.id=`ws-${id}-${body.children.length}`;
   const button=create('button','ws-tab');button.type='button';button.innerHTML=`<i class="ti ti-${icon}" aria-hidden="true"></i><span></span>`;button.lastChild.textContent=name;button.setAttribute('aria-controls',panel.id);
   nodes.filter(Boolean).forEach(n=>panel.append(n));body.append(panel);nav.append(button);return {button,panel};
  });
  function select(index){panels.forEach(({button,panel},i)=>{panel.hidden=i!==index;button.setAttribute('aria-pressed',String(i===index));});requestAnimationFrame(()=>panels[index].panel.querySelectorAll('canvas').forEach(canvas=>window.Chart?.getChart(canvas)?.resize()));}
  panels.forEach(({button},i)=>button.onclick=()=>select(i));
  switchers.push({panels,select});select(0);return {panels:panels.map(x=>x.panel),select};
 }
 window.revealPortfolioSection=el=>{switchers.forEach(({panels,select})=>{const i=panels.findIndex(p=>p.panel.contains(el));if(i>=0)select(i);});};

 // Overview: wealth first, independent asset tiles, then planning and distribution.
 const home=$('page-dashboard'),hero=home.querySelector('.hero'),stats=home.querySelector('.stats-row'),retire=home.querySelector('.hero-ring');
 const heroShell=home.querySelector('.original-hero-grid'),oldBreakdown=home.querySelector('.layout-home-breakdown');
 heroShell.before(hero);hero.after(stats);const footer=group(home,'ws-home-footer',[retire,$('wealthCard')]);heroShell.remove();oldBreakdown.remove();
 home.classList.add('ws-home');hero.classList.add('ws-wealth');
 stats.querySelectorAll('.stat-card').forEach(el=>{el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-expanded','false');el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});el.addEventListener('click',()=>requestAnimationFrame(()=>stats.querySelectorAll('.stat-card').forEach(c=>c.setAttribute('aria-expanded',String(c.nextElementSibling?.classList.contains('open'))))));});
 const shortcuts=create('div','ws-home-shortcuts');[['الحركات','transactions','list'],['الأهداف','goals','target'],['الزكاة','zakat','building-mosque']].forEach(([label,id,icon])=>{const b=create('button','');b.innerHTML=`<i class="ti ti-${icon}"></i><span>${label}</span><span>←</span>`;b.onclick=()=>{window.portfolioBridge.go(id);scrollTo({top:0,behavior:'instant'});};shortcuts.append(b);});stats.before(shortcuts);
 heading(footer,'التوزيع وخطتك القادمة');
 const day=create('section','day-overview');day.id='dayOverview';heading(day,'ملخّص اليوم','مراكزك حسب آخر تحديث للأسعار');day.append($('dashPulse'));shortcuts.after(day);

 const pf=$('page-portfolio');pf.querySelector('.topbar').after($('totalsRow'));$('totalsRow').classList.add('ws-portfolio-summary');
 const holdings=create('div','ws-holdings');[$('pfAllocCard'),$('pfFilters'),$('pfList'),$('emptyPortfolio'),...pf.querySelectorAll(':scope>.asset-section:not(#secOther):not(#secProp):not(#secCash)')].forEach(n=>holdings.append(n));
 const pws=workspace('portfolio',[
  ['مراكزي','briefcase',[holdings]],['مصادر أخرى','layout-list',[$('secCash'),$('secProp'),$('secOther')]]
 ]);
 pws.panels[0].prepend($('totalsRow'));pws.panels[0].append($('statusTxt'));
 pws.panels[0].classList.add('investment-workspace');pws.panels[1].classList.add('sources-workspace');
 heading(pws.panels[0],'مراكزي الاستثمارية','الأسهم والصناديق والذهب · الإجمالي يشمل هذه المراكز فقط');
 const sourcesSummary=create('div','sources-summary');
 sourcesSummary.innerHTML='<div class="sources-main"><span>إجمالي المصادر الأخرى</span><strong id="sourcesTotal">—</strong></div><div class="sources-breakdown"><div><span>النقدي</span><strong id="sourcesCash">—</strong></div><div><span>الأملاك</span><strong id="sourcesProperty">—</strong></div><div><span>المصادر اليدوية المحتسبة</span><strong id="sourcesManual">—</strong></div></div>';
 pws.panels[1].prepend(sourcesSummary);
 heading(pws.panels[1],'النقدي والأملاك والمصادر الأخرى','الإجمالي يحترم خيارات تضمين المصادر واحتساب غير المحقق');
 $('secOther').querySelector('.section-title').textContent='مصادر مضافة يدويًا';
 $('emptyPortfolio').textContent='لا توجد مراكز أسهم أو ذهب — أضف حركة للبدء';
 $('pfAllocCard').querySelector('.card-title').lastChild.textContent=' توزيع مراكزي الاستثمارية';

 const tx=$('page-transactions'),filter=tx.querySelector('.layout-filter-panel');
 const tws=workspace('transactions',[
  ['سجل الحركات','list',[filter,$('selectionBar'),$('txnLens'),$('txnByAsset'),$('txnGrouped')]],
  ['حركة الاستثمار','chart-bar',[$('txnSummaryMobile'),$('txnInsights'),$('txnChartCard')]]
 ]);
 tx.querySelector('.layout-transactions-tools')?.remove();heading(tws.panels[0],'السجل المالي','ابحث، صفِّ الحركات أو استرجع المحذوف');heading(tws.panels[1],'استثمارك عبر الوقت');

 const goals=$('page-goals');
 const gws=workspace('goals',[
  ['خطة الوصول','route',[goals.querySelector('.layout-goal-summary'),$('layout-projection')]],
  ['أهداف الفئات','target',[$('layout-category-goals')]],
  ['التوازن','scale',[$('layout-rebalance')]]
 ]);
 goals.querySelector('.original-goal-grid')?.remove();heading(gws.panels[1],'وزّع هدفك على الفئات','اضغط على الفئة لتعديل هدفها');gws.panels[0].classList.add('ws-plan');

 const geo=$('page-geo'),health=card('xrScoreRows'),radar=card('xrRadar');
 const healthRow=group(geo,'ws-health',[health,radar]);
 const aws=workspace('geo',[
  ['التوزيع','world',[$('xrChips'),$('layout-geography')]],
  ['التملّك','building-skyscraper',[$('layout-composition')]],
  ['المخاطر','heart-rate-monitor',[healthRow,$('layout-risk')]]
 ]);
 $('layout-risk').querySelectorAll('.layout-equal-grid').forEach(el=>{if(!el.children.length)el.remove();});
 $('layout-risk').querySelector('.layout-heading').textContent='اختبر قرارك قبل التنفيذ';
 const mapGrid=$('layout-geography').querySelector('.layout-map-grid');mapGrid.classList.add('ws-atlas');
 aws.panels[2].classList.add('ws-risk');

 const zakat=$('page-zakat'),due=card('zkDue'),hawl=card('zkHawlIn');
 const zws=workspace('zakat',[
  ['النتيجة والحول','calendar',[$('layout-zakat-overview'),$('zkChips'),$('zkRevC')]],
  ['الأصول الزكوية','coins',[$('layout-zakat-holdings')]],
  ['التصنيف','adjustments',[$('layout-zakat-rules')]]
 ]);
 due.classList.add('ws-zakat-due');$('layout-zakat-overview').classList.add('ws-zakat-overview');
 $('layout-zakat-rules').open=true;
 // Advanced rules are already in their own workspace; no second disclosure required.
 $('layout-zakat-rules').querySelector('summary').hidden=true;
 zws.panels[0].append(hawl);hawl.classList.add('ws-hawl');
 heading(zws.panels[2],'سياسة تصنيف البنود','تعديلاتك تُطبّق على الشركات وتُحفظ');

 const assets=$('page-assets');
 assets.querySelector('.topbar>.layout-jump')?.remove();
 const rws=workspace('assets',[
  ['دليل الأصول','category',[$('assetChips'),$('regGrid')]],
  ['العملات والإعدادات','settings',[$('layout-asset-settings')]]
 ]);
 $('layout-asset-settings').open=true;$('layout-asset-settings').querySelector('summary').hidden=true;
 heading(rws.panels[0],'الأصول حسب الفئة','تعريف الأصل ورمزه وعملته في مكان واحد');

 const market=$('page-market');market.classList.add('ws-market');
 const marketSection=group(market,'ws-market-board',[$('marketTable')]);heading(marketSection,'قائمة المتابعة','اضغط على الأصل لعرض تفاصيله');marketSection.after($('marketStatus'));

 const notes=$('page-notes');
 const nws=workspace('notes',[
  ['المكتبة','notes',[$('notesSidebar')]],['الملاحظة المفتوحة','file-text',[$('noteEditor')]]
 ]);
 $('notesLayout').hidden=true;notes.classList.add('ws-notes');
 const oldToggle=notes.querySelector('button[onclick="toggleNotesSidebar()"]');oldToggle.hidden=true;
 // Capture the original row before its inline handler rebuilds the library.
 $('notesSidebar').addEventListener('click',e=>{if(e.target.closest('[onclick^="openNote("]')&&!e.target.closest('button'))nws.select(1);},true);
 notes.querySelector('button[onclick="addNote()"]').addEventListener('click',()=>nws.select(1));
 heading(nws.panels[0],'مكتبتك الخاصة','ملاحظاتك مرتبة حسب التصنيف');
 document.body.classList.add('workspaces-ready');
}
