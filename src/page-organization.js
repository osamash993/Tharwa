import {buildWorkspaces} from './workspaces.js';
// Move the original nodes, so IDs, event handlers and financial calculations stay intact.
export function organizePages(){
 const $=id=>document.getElementById(id);
 const card=id=>$(id).closest('.card,.xr-card,.glass-card');
 const wrap=(nodes,cls,id)=>{
  const box=document.createElement('div');box.className=cls;if(id)box.id=id;
  nodes[0].before(box);nodes.forEach(node=>box.append(node));return box;
 };
 const section=(page,id,title,nodes)=>{
  const box=document.createElement('section');box.id=id;box.className='layout-section';
  const heading=document.createElement('h2');heading.className='layout-heading';heading.textContent=title;box.append(heading);
  nodes.forEach(node=>box.append(node));page.append(box);return box;
 };
 const jump=(label,page,target)=>{
  const b=document.createElement('button');b.type='button';b.className='btn-sm layout-jump';b.textContent=label;
  b.onclick=()=>{window.portfolioBridge.go(page);requestAnimationFrame(()=>{const el=target?$(target):$('page-'+page);window.revealPortfolioSection?.(el);if(el instanceof HTMLDetailsElement)el.open=true;el.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});});};return b;
 };
 const jumps=(page,items)=>{
  const nav=document.createElement('nav');nav.className='layout-jumps';nav.setAttribute('aria-label','انتقال داخل الصفحة');
  items.forEach(([label,target])=>nav.append(jump(label,page.id.replace('page-',''),target)));
  page.querySelector('.topbar').after(nav);
 };
 const fold=(node,title,id)=>{
  const details=document.createElement('details');details.className='layout-fold';details.id=id;
  const summary=document.createElement('summary');summary.textContent=title;
  node.before(details);details.append(summary,node);return details;
 };
 const subtitles={portfolio:'مراكزك الحالية، الأرباح والمصادر الأخرى',transactions:'سجل الحركات، البحث والاسترجاع',goals:'أهدافك، موعد الوصول وخطة إعادة التوازن',assets:'تعريف الأصول وإعدادات العملات',market:'متابعة الأسعار والتنبيهات',notes:'ملاحظاتك ومستنداتك في مكان واحد'};
 Object.entries(subtitles).forEach(([id,text])=>{
  const title=$('page-'+id).querySelector('.page-title');const sub=document.createElement('p');sub.className='layout-subtitle';sub.textContent=text;
  const block=document.createElement('div');title.before(block);block.append(title,sub);
 });

 // Home is a compact overview. The currency controls retain the reference position.
 const home=$('page-dashboard');
 wrap([home.querySelector('.stats-row'),$('wealthCard')],'layout-home-breakdown');

 // Holdings stays focused on owned positions; planning belongs with the goals.
 const portfolio=$('page-portfolio'),goals=$('page-goals');
 const shortcuts=document.createElement('div');shortcuts.className='layout-header-actions';
 shortcuts.append(jump('خطة التوازن','goals','layout-rebalance'),jump('إدارة الأصول','assets'));portfolio.querySelector('.topbar').append(shortcuts);
 $('statusTxt').classList.add('layout-status');
 $('pfRebal').hidden=true; // Duplicate mobile summary; the full calculator below serves every width.
 const goalTotal=card('gTotalCur'),goalChips=goals.querySelector('.xr-chips');
 wrap([goalTotal,goalChips],'layout-goal-summary');
 const categoryHeading=goals.querySelector(':scope>.section-title');
 wrap([categoryHeading,$('catGoalsGrid')],'layout-goal-categories','layout-category-goals');
 // Keep the category title with its own rows inside the existing two-column group.
 goals.querySelector('.original-goal-grid').prepend(goals.querySelector('.layout-goal-categories'));
 const rebal=section(goals,'layout-rebalance','خطة توزيع الاستثمار',[$('rebalCard')]);
 rebal.append(jump('عرض المراكز الحالية','portfolio'));
 card('gProjMonthly').id='layout-projection';
 jumps(goals,[['أهداف الفئات','layout-category-goals'],['موعد الوصول','layout-projection'],['إعادة التوازن','layout-rebalance']]);

 // Chart and filters share one workspace; the original history stays below it.
 const tx=$('page-transactions');
 const filterBox=wrap([$('original-filter-toggle'),$('txnFilterCard')],'layout-filter-panel');
 wrap([$('txnChartCard'),filterBox],'layout-transactions-tools');
 $('txnGrouped').classList.add('layout-history');

 // Registry first, infrequent currency configuration afterwards.
 const assets=$('page-assets'),help=assets.querySelector('.info-box'),pivot=card('pivotCurSelect');
 assets.querySelector('.topbar').after($('assetChips'));
 $('assetChips').after($('regGrid'));
 const settings=wrap([help,pivot],'layout-settings-grid');assets.append(settings);
 fold(settings,'إعدادات العملات وطريقة إضافة الأصول','layout-asset-settings');
 assets.querySelector('.topbar').append(jump('إعدادات العملات','assets','layout-asset-settings'));

 // Analysis reads as location, composition, then risk; all original panels remain.
 const geo=$('page-geo');
 const map=card('geoMap'),countries=card('xrCountries'),companies=card('xrCompanies'),sectors=card('xrSectors'),split=card('xrSplit'),overlap=card('xrOverlap'),health=card('xrScoreRows'),radar=card('xrRadar'),stress=card('xrScenBtns'),sim=card('xrSimAsset'),funds=$('xrFunds').parentElement;
 const where=section(geo,'layout-geography','أين تستثمر؟',[map,countries]);
 wrap([map,countries],'layout-map-grid');
 const composition=section(geo,'layout-composition','ماذا تملك فعليًا؟',[companies,sectors,split,overlap,funds]);
 const ownershipColumn=wrap([companies,funds],'layout-stack');
 const allocationColumn=wrap([sectors,split,overlap],'layout-stack');
 wrap([ownershipColumn,allocationColumn],'layout-equal-grid');
 const risk=section(geo,'layout-risk','المخاطر والمحاكاة',[health,radar,stress,sim]);
 wrap([health,radar],'layout-equal-grid');wrap([stress,sim],'layout-equal-grid');
 geo.append($('xrFootnote'));geo.querySelectorAll(':scope>.xr-grid').forEach(el=>{if(!el.children.length)el.remove();});
 jumps(geo,[['التوزيع','layout-geography'],['التملّك','layout-composition'],['المخاطر والمحاكاة','layout-risk']]);

 // Zakat: result and annual inputs first, holdings second, classification last.
 const zakat=$('page-zakat'),due=card('zkDue'),hawl=card('zkHawlIn'),direct=card('zkDirect'),rules=card('zkRules'),chips=$('zkChips');
 const overview=wrap([due,hawl],'layout-zakat-summary','layout-zakat-overview');chips.before(overview);
 const breakdown=section(zakat,'layout-zakat-holdings','تفاصيل الأصول الزكوية',[$('zkFundsC'),$('zkStocksC'),direct]);
 wrap([$('zkFundsC'),$('zkStocksC')],'layout-equal-grid layout-optional-grid');
 const review=$('zkRevC');breakdown.before(review);
 zakat.append(rules);fold(rules,'خيارات متقدمة · تصنيف البنود المالية','layout-zakat-rules');
 const print=zakat.querySelector(':scope>button[onclick="zkReport()"]');print.classList.add('layout-print');zakat.querySelector('.topbar>div:last-child').append(print);
 zakat.append(zakat.querySelector(':scope>.xr-alert'));
 jumps(zakat,[['الملخص والحول','layout-zakat-overview'],['تفاصيل الأصول','layout-zakat-holdings'],['التصنيف','layout-zakat-rules']]);

 $('marketStatus').classList.add('layout-status');
 $('marketManagePanel').classList.add('layout-manage-panel');
 $('notesLayout').classList.add('layout-notes-workspace');
 buildWorkspaces();
}
