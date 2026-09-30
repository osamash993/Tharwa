import {template} from './overview-template.js';
const names={property:'العقار',gold:'الذهب',stocks:'الأسهم',cash:'النقدي',other:'مصادر أخرى'};
const types={property:'Property',gold:'Gold',stocks:'Stock',cash:'Cash'};
class WealthOverview extends HTMLElement{
 constructor(){super();this.attachShadow({mode:'open'}).innerHTML=template;this.active=null;}
 connectedCallback(){
  const r=this.shadowRoot;
  r.querySelectorAll('[data-asset]').forEach(b=>b.addEventListener('click',()=>this.open(b)));
  r.querySelector('.pop-close').onclick=()=>this.close();
  r.querySelector('.goal-button').onclick=()=>window.portfolioBridge.go('goals');
  r.querySelector('.quiet').onclick=()=>window.portfolioBridge.go('portfolio');
  r.querySelectorAll('.currency-switch span').forEach(s=>{s.setAttribute('role','button');s.tabIndex=0;s.onclick=()=>window.portfolioBridge.currency(s.textContent);s.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();s.click();}};});
  r.addEventListener('click',e=>{if(this.active&&!e.target.closest('[data-asset],.popover'))this.close(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')this.close();});
  new ResizeObserver(()=>this.place()).observe(this);
 }
 render(){
  const b=window.portfolioBridge;if(!b)return;const d=b.data();this.data=d;const r=this.shadowRoot;
  const set=(s,v)=>{const el=r.querySelector(s);if(el)el.textContent=v;};
  const num=(n,d=0)=>b.format(n,d);const money=n=>b.money(n);
  set('.greeting h1','أهلاً بك، أسامة');set('.greeting p',new Date().toLocaleDateString('ar-JO',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
  set('.wealth-total',money(d.totals.totalCur));set('.currency-label',{SAR:'ريال سعودي',JOD:'دينار أردني',USD:'دولار أمريكي'}[d.currency]);
  set('.daily>span:first-child','أرباح أصول النمو');set('.gain',(d.totals.growthCur-d.totals.growthCost>=0?'+':'')+money(d.totals.growthCur-d.totals.growthCost));
  if(!d.priced)set('.gain','بانتظار الأسعار');
  r.querySelectorAll('.currency-switch span').forEach(s=>{s.classList.toggle('selected',s.textContent===d.currency);s.setAttribute('aria-pressed',String(s.textContent===d.currency));});
  const fv=r.querySelectorAll('.fact-value');fv[0].textContent=money(d.totals.investCost)+' '+d.symbol;fv[1].textContent='5 فئات';
  const pct=d.goal>0?d.totals.totalCur/d.goal*100:0;
  set('.goal-percentage',num(pct,1)+'%');
  const track=r.querySelector('.track');track.setAttribute('aria-valuenow',Math.min(100,Math.max(0,pct)));track.querySelector('span').style.width=Math.min(100,Math.max(0,pct))+'%';
  const gm=r.querySelectorAll('.goal-metrics strong');gm[0].textContent=money(d.goal)+' '+d.symbol;gm[1].textContent=money(Math.max(0,d.goal-d.totals.totalCur))+' '+d.symbol;
  this.categories={};
  for(const [key,type] of Object.entries(types))this.categories[key]=d.totals.byType[type];
  this.categories.other={cur:d.totals.totalCur-Object.values(d.totals.byType).reduce((s,x)=>s+x.cur,0),cost:0};
  for(const [key,cat] of Object.entries(this.categories)){
   const el=r.querySelector(`[data-asset="${key}"]`);el.querySelector('bdi').textContent=money(cat.cur);
   const change=cat.cur-cat.cost;const show=key==='stocks'||key==='gold';el.querySelector('.change').textContent=show?(change>=0?'+':'')+money(change):'—';el.querySelector('.change').className='change '+(change>=0?'positive':'negative');if(show&&!d.groups.filter(g=>g.assetType===types[key]&&!g.exited).every(g=>g.value.hasPx))el.querySelector('.change').textContent='—';
  }
  set('.asset-foot','عملة العرض: '+d.currency+' · القيم بدون سعر متاح تُعرض بالتكلفة');
  set('.allocation-count strong',String(Object.keys(this.categories).length).padStart(2,'0'));const alloc=r.querySelector('.allocation-list');alloc.replaceChildren();
  for(const [key,cat] of Object.entries(this.categories).sort((a,b)=>b[1].cur-a[1].cur)){
   const row=document.createElement('div');const name=document.createElement('span');name.className='allocation-name';const sw=document.createElement('i');sw.className='swatch s-'+key;name.append(sw,document.createTextNode(names[key]));const n=document.createElement('bdi');n.textContent=num(d.totals.totalCur?cat.cur/d.totals.totalCur*100:0,1)+'%';row.append(name,n);alloc.append(row);
  }
  const market=r.querySelectorAll('.market-item');
  const stats=[['الحركات المسجلة',num(d.txns.length)],['الأصول المسجلة',num(d.assets.length)],['أسعار المحفظة',d.priced+' / '+d.quoteCount],['حالة التقييم',d.priced===d.quoteCount&&d.quoteCount?'حسب الأسعار المتاحة':'بعض القيم بالتكلفة']];
  stats.forEach(([label,value],i)=>{market[i].querySelector('div').lastChild.textContent=label;market[i].querySelector('b').textContent=value;market[i].querySelector('b').className='';});
  if(this.active)this.fill(this.active);
 }
 fill(button){
  const r=this.shadowRoot,b=window.portfolioBridge,d=this.data,key=button.dataset.asset,c=this.categories[key];
  r.querySelector('#pop-title').textContent=names[key];const content=r.querySelector('#pop-content');content.replaceChildren();
  const add=(tag,cls,txt)=>{const e=document.createElement(tag);e.className=cls;e.textContent=txt;content.append(e);return e;};
  add('div','pop-label','القيمة الحالية');const value=add('div','pop-value','');const amount=document.createElement('bdi');amount.textContent=b.money(c.cur);const unit=document.createElement('small');unit.textContent=d.symbol;value.append(amount,unit);
  add('div','pop-meta',b.format(d.totals.totalCur?c.cur/d.totals.totalCur*100:0,1)+'% من الثروة');
  const entries=key==='other'?d.other.filter(x=>x.included!==false&&(d.includeUnrealized||x.type!=='unrealized')).map(x=>({name:x.name,value:x.value,cost:null})):d.groups.filter(g=>g.assetType===types[key]&&!g.exited).map(g=>({name:g.assetName,value:g.value.cur,cost:g.value.cost,hasPrice:g.value.hasPx}));
  for(const item of entries){
   const row=add('div','holding','');const name=document.createElement('strong');name.textContent=item.name;const val=document.createElement('div');const number=document.createElement('bdi');number.textContent=b.money(item.value);const small=document.createElement('small');small.textContent=item.cost===null?'مصدر إضافي':!item.hasPrice?'بالتكلفة · لا يوجد سعر متاح':(item.value-item.cost>=0?'+':'')+b.money(item.value-item.cost)+' '+d.symbol;small.className=item.value-item.cost>=0?'positive':'negative';val.append(number,small);row.append(name,val);
  }
  if(!entries.length)add('p','pop-empty','لا توجد حركات بهذه الفئة بعد.');
  add('p','pop-foot','الأرقام محسوبة من الحركات والإعدادات المحفوظة.');
  const btn=add('button','quiet','فتح المحفظة ←');btn.type='button';btn.onclick=()=>{this.close();b.go('portfolio');};this.place();
 }
 open(b){
  if(!this.data)return;if(this.active===b){this.close();return;}clearTimeout(this.timer);this.active=b;const r=this.shadowRoot,p=r.querySelector('#popover');r.querySelectorAll('[data-asset]').forEach(x=>x.setAttribute('aria-expanded',String(x===b)));p.hidden=false;p.classList.remove('depart','arrive');this.fill(b);void p.offsetWidth;p.classList.add('arrive');r.querySelector('.pop-close').focus({preventScroll:true});const rect=p.getBoundingClientRect();if(rect.top<12)window.scrollBy({top:rect.top-18,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
 }
 close(focus=true){if(!this.active)return;const old=this.active;this.active=null;const p=this.shadowRoot.querySelector('#popover');old.setAttribute('aria-expanded','false');p.classList.remove('arrive');p.classList.add('depart');this.timer=setTimeout(()=>p.hidden=true,150);if(focus)old.focus({preventScroll:true});}
 place(){
  if(!this.active)return;const root=this.shadowRoot.querySelector('#app'),pop=this.shadowRoot.querySelector('#popover');if(pop.hidden)return;
  const r=root.getBoundingClientRect(),a=this.active.getBoundingClientRect(),sideRoom=a.left-r.left-24,left=r.width>700&&sideRoom>=270,w=left?Math.min(400,sideRoom-18):r.width-20;pop.style.width=w+'px';pop.style.overflow='visible';const content=this.shadowRoot.querySelector('#pop-content');content.style.maxHeight='min(470px,65vh)';content.style.overflowY='auto';const h=pop.offsetHeight;let x,y,tip,side;
  if(left){x=a.left-r.left-w-22;y=Math.max(20,a.top-r.top+a.height/2-h/2);tip=Math.max(25,Math.min(h-25,a.top-r.top+a.height/2-y));side='left';pop.style.setProperty('--origin','100% '+tip+'px');}
  else{x=10;const ay=a.top-r.top;side=ay-h-20>30?'above':'below';y=side==='above'?ay-h-18:a.bottom-r.top+18;tip=Math.max(25,Math.min(w-25,a.right-r.left-43-x));pop.style.setProperty('--origin',tip+'px '+(side==='above'?'100%':'0%'));}
  pop.dataset.side=side;pop.style.left=x+'px';pop.style.top=y+'px';pop.style.setProperty('--tip',tip+'px');
 }
}
customElements.define('wealth-overview',WealthOverview);
