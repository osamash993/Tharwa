// Page composition uses the existing controls so data and actions keep one source of truth.
const $=id=>document.getElementById(id);
const make=(tag,cls,html='')=>{const e=document.createElement(tag);e.className=cls;e.innerHTML=html;return e;};
const move=(to,...nodes)=>nodes.flat().filter(Boolean).forEach(n=>to.append(n));
const card=id=>$(id)?.closest('.xr-card,.glass-card,.card');
const head=(title,caption)=>make('div','th-section-heading',`<h2>${title}</h2><p>${caption}</p>`);
function workspace(page,cls=''){const shell=make('div','th-workspace '+cls),main=make('div','th-content'),aside=make('aside','th-aside');shell.append(main,aside);page.append(shell);return {shell,main,aside};}
function fold(title,node){const d=make('details','th-fold'),s=make('summary','',title);d.append(s,node);return d;}
const intros={
 portfolio:['محفظتك','الأصول والثروة','كل مركز في مكانه. تابع قيمته، أداءه، وتوازنه مع أهدافك.'],
 transactions:['سجلّك المالي','الحركات المالية','صورة مرتّبة لكل إضافة، شراء وبيع في محفظتك.'],
 goals:['خطتك للمستقبل','الأهداف','حوّل أهدافك إلى خطوات واضحة وقِس تقدّمك نحوها.'],
 market:['نافذتك للأسواق','متابعة الأسواق','أسعار الأصول التي تتابعها ومؤشرات أدائها في مكان واحد.'],
 geo:['ما وراء الأرقام','التحليل الاستثماري','افهم توزيع استثماراتك، تداخلها، ومستوى تنويعها.'],
 zakat:['حقّ المال','زكاة المحفظة','ملخّص الاستحقاق وتفاصيل الأصول والمنهجية المستخدمة.'],
 assets:['إعداد محفظتك','دليل الأصول','نظّم الأصول المسجّلة ورموز أسعارها وعملات التداول.'],
 notes:['دفترك الخاص','الملاحظات','مساحة لاستراتيجيتك، قراراتك، والأفكار التي تستحق العودة إليها.'],
 appearance:['مساحتك','تفضيلات العرض','إعدادات العرض الخاصة بمحفظتك.']
};
export function composePages(){
 for(const [id,[eyebrow,title,description]] of Object.entries(intros)){
  const page=$('page-'+id),bar=page.querySelector('.topbar'),old=bar.querySelector('.page-title');
  page.classList.add('th-page');const intro=make('div','th-page-intro',`<span class="th-eyebrow">${eyebrow}</span><h1>${title}</h1><p>${description}</p>`);
  // Retain nested source/status elements and all toolbar buttons.
  const oldParent=old.parentElement;
  old.remove();bar.prepend(intro);bar.classList.add('th-page-heading');
  if(id==='geo')oldParent.remove();
  if(id==='zakat'){
   const source=$('zkSrcNow').parentElement;source.classList.add('th-source');intro.append(source);oldParent.remove();
  }
 }
 {
  const page=$('page-portfolio');
  const val=$('tVal').parentElement;val.classList.add('th-primary-metric');$('totalsRow').prepend(val);
  const {main,aside}=workspace(page,'th-portfolio-workspace');
  main.append(head('مراكزك الاستثمارية','التفاصيل مرتّبة حسب فئة الأصل'));
  move(main,$('emptyPortfolio'),...['pfAllocCard','pfFilters','pfList','secGold','secStock','secProp','secCash','secExited','secOther'].map($));
  aside.append(head('توازن المحفظة','قراءة في توزيعك الحالي وأهدافك'));move(aside,$('rebalCard'),$('pfRebal'));
  const link=make('button','th-text-link','تعديل أهداف الفئات <span>←</span>');link.onclick=()=>window.portfolioBridge.go('goals');aside.append(link);
 }
 {
  const page=$('page-transactions'),overview=make('div','th-ledger-overview');
  $('txnChartCard').before(overview);move(overview,$('txnInsights'),$('txnChartCard'));
  const ledger=make('section','th-ledger');page.append(ledger);ledger.append(head('سجل الحركات','ابحث، صفِّ، أو افتح حركة لعرض تفاصيلها'));
  move(ledger,$('txnLens'),$('txnFilterCard'),$('selectionBar'),$('txnByAsset'),$('txnGrouped'));
  const b=make('button','btn-outline','<i class="ti ti-download"></i> تنزيل Excel');b.onclick=()=>window.portfolioBridge.export();page.querySelector('.topbar').lastElementChild.prepend(b);
 }
 {
  const page=$('page-goals'),hero=card('gTotalCur'),projection=card('gProjMonthly'),cats=$('catGoalsGrid'),title=cats.previousElementSibling;
  const ring=hero.querySelector('svg'),numbers=$('gTotalCur').parentElement,metrics=$('gTotalGoal').parentElement.parentElement;
  metrics.classList.add('th-goal-summary');metrics.removeAttribute('style');numbers.classList.add('th-goal-value');
  const featureMain=make('div','th-goal-main');featureMain.append(numbers,ring);hero.replaceChildren(featureMain,metrics);
  $('gChipDone').dir='ltr';
  const top=make('div','th-goal-overview');hero.classList.add('th-feature');page.querySelector('.topbar').after(top);move(top,hero,page.querySelector('.xr-chips'));
  const {main,aside}=workspace(page,'th-goal-workspace');title.remove();main.append(head('أهداف الفئات','اضغط على أي فئة لتعديل هدفها'));move(main,cats);move(aside,projection);projection.classList.add('th-projection');
 }
 {
  const page=$('page-assets'),help=page.querySelector('.info-box'),currency=card('pivotCurSelect'),{main,aside}=workspace(page,'th-catalog-workspace');
  main.append(head('أصولك المسجّلة','إدارة الرموز والعملات المستخدمة في الحركات'));move(main,$('regGrid'));move(aside,currency,help);currency.classList.add('th-currency-panel');
 }
 {
  const page=$('page-zakat'),due=card('zkDue'),hawl=card('zkHawlIn'),rules=card('zkRules'),direct=card('zkDirect');
  const {main,aside}=workspace(page,'th-zakat-workspace');due.classList.add('th-feature');
  move(main,$('zkFundsC'),$('zkStocksC'),direct,$('zkRevC'));main.append(fold('تصنيف البنود المالية والمنهجية',rules));
  move(aside,due,hawl,page.querySelector('[onclick="zkReport()"]'),page.querySelector('.xr-alert'));
 }
 {
  const page=$('page-market'),table=$('marketTable'),desk=make('section','th-market-desk'),bar=make('div','th-desk-bar');
  bar.append(head('قائمة المتابعة','اضغط على الأصل في الموبايل لعرض مؤشّراته'));
  const b=make('button','btn-gold','<i class="ti ti-refresh"></i> تحديث الأسعار');b.id='th-market-refresh';b.onclick=async()=>{b.disabled=true;try{await window.refreshMarket();}finally{b.disabled=false;}};bar.append(b);page.append(desk);move(desk,bar,$('marketStatus'),table);
 }
 {
  const page=$('page-geo'),nav=make('nav','th-section-nav');nav.setAttribute('aria-label','أقسام التحليل');page.querySelector('#xrChips').after(nav);
  const groups=[['exposure','التوزيع الفعلي','أين تستثمر أموالك؟',['geoMap','xrCountries','xrCompanies','xrSectors','xrSplit','xrOverlap']],['health','التنويع والمخاطر','اختبر متانة توزيعك',['xrScoreNum','xrRadar','xrScenBtns','xrSimAsset']],['funds','تفاصيل الصناديق','استكشف المكوّنات',['xrFunds']]];
  for(const [id,title,sub,ids] of groups){const s=make('section','th-analysis-section');s.id='analysis-'+id;s.append(head(title,sub));const grid=make('div','th-analysis-grid');s.append(grid);page.append(s);
   for(const key of ids){const node=card(key)||$(key).parentElement;node.classList.add('th-analysis-'+key);grid.append(node);}
   const a=make('a','',title);a.href='#'+s.id;nav.append(a);
  }
  page.querySelectorAll(':scope > .xr-grid').forEach(e=>{if(!e.children.length)e.remove();});page.append($('xrFootnote'));
 }
 {
  const sidebar=$('notesSidebar');sidebar.classList.remove('glass-card');sidebar.setAttribute('aria-label','دفتر الملاحظات');$('notesLayout').classList.add('th-notebook');
 }
 window.syncPageChrome=id=>{
  document.querySelectorAll('.th-header [data-nav]').forEach(b=>{b.classList.toggle('active',b.dataset.nav===id);if(b.dataset.nav===id)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 };
}
