// Keep the original controls and visual system; only group existing boxes for layout.
export function setupOriginalLayout(){
 const $=id=>document.getElementById(id);
 const group=(parent,nodes,cls)=>{const el=document.createElement('div');el.className=cls;nodes[0].before(el);nodes.forEach(n=>el.append(n));return el;};
 const home=$('page-dashboard');
 group(home,[home.querySelector('.hero'),home.querySelector('.hero-ring')],'original-hero-grid');
 group(home,[$('wealthCard'),home.querySelector('.perf-card')],'original-detail-grid');
 // Retain the original goal rows, with the calculator alongside them on larger screens.
 const goals=$('page-goals'),cats=$('catGoalsGrid'),projection=$('gProjMonthly').closest('.glass-card');
 group(goals,[cats,projection],'original-goal-grid');
 // A collapsed filter panel makes every existing search, multi-select and restore control reachable on a phone.
 const filters=$('txnFilterCard'),toggle=document.createElement('button');
 toggle.id='original-filter-toggle';toggle.className='btn-sm';toggle.type='button';toggle.innerHTML='<i class="ti ti-adjustments-horizontal"></i> بحث وفلترة واسترجاع';
 toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','txnFilterCard');filters.before(toggle);
 toggle.onclick=()=>{const open=filters.classList.toggle('filters-open');toggle.setAttribute('aria-expanded',String(open));};
 // Give the existing icon navigation its own accessible names without altering its design.
 document.querySelectorAll('.nav-item').forEach(el=>{el.setAttribute('role','button');el.tabIndex=0;el.setAttribute('aria-label',el.title||'المزيد');el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});});
 window.syncPageChrome=id=>{document.querySelectorAll('.nav-item[data-page]').forEach(el=>el.setAttribute('aria-current',el.dataset.page===id?'page':'false'));};
}
