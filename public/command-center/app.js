

const ENGINE=parent!==window?parent.commandEngine:null;
if(!ENGINE)throw Error('افتح Command Center من تطبيق ثروة بعد تسجيل الدخول');
let S=ENGINE.snapshot();
const FX={...S.FX,SAR:1};
let baseCur=S.baseCur;
const CUR_SYMS={SAR:'SAR',JOD:'JOD',USD:'USD'};
const AS={...S.AS};
const TXNS=[...S.TXNS],CASH=[...S.CASH],PROP=[...S.PROP],OTHER=[...S.OTHER];
const catGoals={...S.catGoals},NEWS=[];
const XRAY_DATA={...S.XRAY_DATA},XR_COUNT={...S.XR_COUNT};

const GEO_AR={US:'الولايات المتحدة',JP:'اليابان',GB:'بريطانيا',CA:'كندا',CH:'سويسرا',FR:'فرنسا',NL:'هولندا',DE:'ألمانيا',AU:'أستراليا',DK:'الدنمارك',SE:'السويد',IE:'أيرلندا',KR:'كوريا الجنوبية',TW:'تايوان',IN:'الهند',CN:'الصين',SA:'السعودية',BR:'البرازيل',ZA:'جنوب أفريقيا',AE:'الإمارات',TH:'تايلاند',MY:'ماليزيا',ID:'إندونيسيا',MX:'المكسيك',QA:'قطر',KW:'الكويت'};
const XRAY_DEV={US:1,JP:1,GB:1,CA:1,CH:1,FR:1,NL:1,DE:1,AU:1,DK:1,SE:1,IE:1};
const XR_CUR_OF={US:'USD',CA:'USD',SA:'SAR',AE:'USD',QA:'USD',KW:'USD',JP:'JPY',GB:'GBP',CH:'CHF',FR:'EUR',NL:'EUR',DE:'EUR',IE:'EUR',DK:'EUR',SE:'EUR',AU:'AUD',KR:'KRW',TW:'TWD',IN:'INR',CN:'CNY',BR:'BRL',ZA:'ZAR',TH:'THB',MY:'MYR',ID:'IDR',MX:'MXN'};
const LL={US:[39,-98],JP:[36,138],GB:[54,-2],CA:[57,-101],CH:[47,8],FR:[46.5,2.5],NL:[52.2,5.5],DE:[51,10],AU:[-25,134],DK:[56,10],SE:[62,15],IE:[53,-8],KR:[36.5,128],TW:[23.7,121],IN:[22,79],CN:[35,104],SA:[24,45],BR:[-10,-52],ZA:[-29,24],AE:[24,54],TH:[15,101],MY:[4,102],ID:[-2,118],MX:[23,-102],QA:[25.3,51.2],KW:[29.3,47.6]};
const NUM2A={840:'US',392:'JP',826:'GB',124:'CA',756:'CH',250:'FR',528:'NL',276:'DE',36:'AU',208:'DK',752:'SE',372:'IE',410:'KR',158:'TW',356:'IN',156:'CN',682:'SA',76:'BR',710:'ZA',784:'AE',764:'TH',458:'MY',360:'ID',484:'MX',634:'QA',414:'KW'};
let HOME=[50.10,26.43]; // موقع المستخدم [lon,lat] — يُضبط من الإعدادات


const $=id=>document.getElementById(id);
const fmt=(n,d=0)=>n==null||!Number.isFinite(Number(n))?'—':new Intl.NumberFormat('en-US',{maximumFractionDigits:d,minimumFractionDigits:d}).format(n);
const toB=s=>baseCur==='SAR'?s:s/FX[baseCur];
const fmtC=s=>CUR_SYMS[baseCur]+'‎ '+fmt(toB(s));
const sgn=(v,f=fmtC)=>(v>=0?'+':'−')+f(Math.abs(v));
const toSAR=(v,c)=>c==='GBp'?v/100*FX.GBP:(c==='SARg'||c==='SAR')?v:v*FX[c];
const natFmt=(v,c)=>v==null?'غير متاح':c==='GBp'?fmt(v,2)+' GBp':c==='SARg'?fmt(v,1)+' SAR/g':fmt(v,2)+' '+c;
const flag=cc=>{try{return String.fromCodePoint(...[...cc].map(c=>0x1F1E6+c.charCodeAt(0)-65));}catch(e){return '';}};
const KL={Stock:'أسهم',Gold:'ذهب',Property:'أملاك',Cash:'نقدي',Other:'أخرى'};
const KLF={Stock:'الأسهم',Gold:'الذهب',Property:'الأملاك',Cash:'النقدي',Other:'المصادر الأخرى'};
const KI={Stock:'ti-chart-bar',Gold:'ti-coin',Property:'ti-building',Cash:'ti-cash',Other:'ti-layout-list'};
const KA={Stock:1,Gold:.72,Property:.48,Cash:.3,Other:.16}; // درجات نفس اللون بدل ألوان متعددة
const kc=k=>`rgba(79,216,255,${KA[k]})`;
const pnlTxt=(p,c)=>`<span class="pill ${p>=0?'up':'dn'}">${p>=0?'▲':'▼'} ${fmtC(p)} (${p>=0?'+':''}${fmt(p/c*100,1)}%)</span>`;
const _av={};
function anim(id,val,f,dur=900){const el=$(id);if(!el)return;const from=_av[id]||0;_av[id]=val;const t0=performance.now();
  (function s(t){const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=f(from+(val-from)*e);if(p<1)requestAnimationFrame(s);})(t0);}


const txSAR=t=>Math.abs(t[8]?.totalCostSAR||0);
function fifo(name){return ENGINE.fifo(name);}
let POS=[];
function build(){POS=S.POS.filter(p=>assetVisible(p.n));}
function totals(){return S.totals;}


function renderHero(){
 const T=totals(),pr=T.gC-T.gK,gp=Math.min(100,percent(T.total,T.goal));
 anim('heroVal',toB(T.total),v=>fmt(v));$('heroCur').textContent=baseCur;
 $('heroTag').className='ptag'+(pr<0?' neg':'');$('heroTag').textContent=`${pr<0?'▼':'▲'} ${fmtC(pr)} (${fmt(percent(pr,T.gK),1)}%)`;
 for(const [id,v] of [['kInv',T.investCost],['kAll',T.all],['kGoal',T.goal],['kRem',Math.max(0,T.goal-T.total)]])anim(id,v,fmtC);
 $('gPct').textContent=fmt(gp,1)+'%';$('gArc').setAttribute('stroke-dasharray',gp/100*314+' 315');
 const segs=[['Stock',T.by.Stock.cur],['Gold',T.by.Gold.cur],['Property',T.by.Property.cur],['Cash',T.by.Cash.cur],['Other',T.other]];
 $('alloc').innerHTML=segs.map(([k,v])=>`<div class="clk" style="width:${percent(v,T.total)}%;background:${kc(k)}" onclick="openCat('${k}')" title="${KL[k]}"></div>`).join('');
 $('allocLeg').innerHTML=segs.map(([k,v])=>`<span><i style="background:${kc(k)}"></i>${KL[k]} <b class="n">${fmt(percent(v,T.total),1)}%</b></span>`).join('');
 $('stats').innerHTML=segs.map(([k,v])=>{const d=T.by[k]||{cur:v,cost:v};return `<div class="st clk" onclick="openCat('${k}')" style="border-top-color:${kc(k)}"><div class="l"><i class="ti ${KI[k]}"></i>${KLF[k]}</div><div class="v n">${fmtC(v)}</div><div class="i">المستثمر ${fmtC(d.cost)}</div><div class="pn">${d.cur!==d.cost?pnlTxt(d.cur-d.cost,d.cost):'—'}</div></div>`;}).join('');
}


let pfF='all';
function renderPf(){
  const F=[['all','الكل'],['Stock','أسهم'],['Gold','ذهب'],['Cash','نقدي'],['Property','أملاك'],['up','رابح'],['down','خاسر']];
  $('pfFl').innerHTML=F.map(([k,l])=>`<button class="${pfF===k?'on':''}" onclick="pfF='${k}';renderPf()">${l}</button>`).join('');
  let rows=[...POS.map(p=>({k:p.t,n:p.n,s:`${fmt(p.qty,p.t==='Gold'?1:0)} ${p.t==='Gold'?'غ':'وحدة'} · متوسط ${natFmtAvg(p)}`,v:p.val,pnl:p.pnl,c:p.cost,on:`openAsset('${p.n}')`})),
    ...PROP.filter(p=>assetVisible(p.n)).map(p=>({k:'Property',n:p.n,s:'قيمة سوقية مدخلة',v:p.val,pnl:0,c:p.cost,on:`openCat('Property')`})),
    ...CASH.filter(c=>assetVisible(c.n)).map(c=>({k:'Cash',n:c.n,s:'سيولة جاهزة · '+c.c,v:c.bal,pnl:0,c:c.bal,on:`openCat('Cash')`})),
    ...OTHER.map(o=>({k:'Other',n:o.n,s:(o.inc===false?'غير مدرج':o.type==='unrealized'?'غير محقق':'محقق'),v:o.v,pnl:0,c:o.v,on:`openCat('Other')`}))];
  if(KL[pfF]) rows=rows.filter(r=>r.k===pfF); else if(pfF==='up') rows=rows.filter(r=>r.pnl>1); else if(pfF==='down') rows=rows.filter(r=>r.pnl<-1);
  $('pfList').innerHTML=rows.map(r=>`<div class="row clk" onclick="${r.on}"><div class="nm"><div class="t">${r.n} <span class="kt">${KL[r.k]}</span></div><div class="s">${r.s}</div></div>
    <div class="vl"><span class="n" style="font-size:14px;color:var(--cb)">${fmtC(r.v)}</span>${Math.abs(r.pnl)>1?pnlTxt(r.pnl,r.c):''}</div><i class="ti ti-chevron-left chev"></i></div>`).join('');
  const T=totals(),cats=[['Stock','أسهم'],['Gold','ذهب'],['Property','أملاك'],['Cash','نقدي']];
  const sg=cats.reduce((a,[k])=>a+catGoals[k],0),tot=cats.reduce((a,[k])=>a+T.by[k].cur,0);
  $('rbBody').innerHTML=cats.map(([k,l])=>{const tgt=catGoals[k]/sg,cur=T.by[k].cur,d=tgt*tot-cur,dev=cur/tot*100-tgt*100,w=Math.min(48,Math.abs(dev)*1.6);
    return `<div class="rb clk" onclick="openCat('${k}')"><span class="k">${l}</span><div class="tr"><i style="${dev>0?'right:50%':'left:50%'};width:${w}%;background:${dev>0?'var(--c)':'var(--warn)'}"></i><s></s></div><span class="a" style="color:${dev>0?'var(--cb)':'var(--warn)'}">${dev>0?'قلّل':'أضف'} <span class="n">${fmtC(d)}</span></span></div>`;}).join('')
   +`<div class="sect"><i class="ti ti-arrows-diff"></i> تركيبتك مقابل الهدف</div>`
   +cats.map(([k,l])=>{const tg=catGoals[k]/sg*100,cu=T.by[k].cur/tot*100;
     return `<div class="clk" onclick="openCat('${k}')" style="padding:5px 0"><div style="display:flex;justify-content:space-between;font-size:11px"><span>${l}</span><span><span class="n" style="color:var(--cb)">${fmt(cu,1)}%</span> <span class="mu">· الهدف</span> <span class="n mu">${fmt(tg,1)}%</span></span></div>
       <div style="height:4px;background:var(--c07);margin-top:4px;position:relative"><i style="position:absolute;inset-block:0;inset-inline-start:0;width:${cu}%;background:var(--c);box-shadow:0 0 6px var(--c35)"></i></div>
       <div style="height:4px;background:var(--c07);margin-top:2px;position:relative"><i style="position:absolute;inset-block:0;inset-inline-start:0;width:${tg}%;background:repeating-linear-gradient(90deg,rgba(255,255,255,.55) 0 4px,transparent 4px 7px)"></i></div></div>`;}).join('')
   +`<div class="leg" style="margin-top:8px"><span><i style="background:var(--c)"></i>الآن</span><span><i style="background:repeating-linear-gradient(90deg,#fff 0 3px,transparent 3px 5px)"></i>الهدف</span></div>`;
}
function natFmtAvg(p){const a=AS[p.n];const unit=p.avg;const nat=a.cur==='GBp'?unit/FX.GBP*100:a.cur==='SARg'?unit:unit/FX[a.cur];return natFmt(nat,a.cur);}


function renderMkt(){
 const priced=POS.filter(p=>p.chg!=null),big=[...priced].sort((a,b)=>Math.abs(b.chg)-Math.abs(a.chg))[0];
 $('mkChips').innerHTML=cell('رابح اليوم',priced.filter(p=>p.chg>0).length,'up')+cell('خاسر اليوم',priced.filter(p=>p.chg<0).length,'dn')+(big?`<div class="cell clk" onclick="openAsset('${big.n}')"><div class="l">أكبر حركة · ${big.n}</div><div class="v n ${big.chg<0?'dn':'up'}">${fmt(big.chg,2)}%</div></div>`:cell('أكبر حركة','غير متاح'))+cell('أصل مشتري',POS.length);
 $('mkList').innerHTML=Object.entries(AS).filter(([n,p])=>assetVisible(n)&&['Stock','Gold'].includes(p.t)).map(([n,p])=>{const pos=p.hi>p.lo&&p.p!=null?Math.max(0,Math.min(100,(p.p-p.lo)/(p.hi-p.lo)*100)):null;
  return `<div class="row clk" onclick="openAsset('${n}')"><div class="nm"><div class="t">${n}</div><div class="s">${p.full}</div></div><div class="w52" title="${pos==null?'نطاق 52 أسبوع غير متاح':'نطاق 52 أسبوع'}">${pos==null?'—':`<i style="right:${pos}%"></i>`}</div><div class="vl"><span class="n">${natFmt(p.p,p.cur)}</span>${p.t==='Gold'?`<small class="n mu">${natFmt(S.goldOunce,'USD')} / oz</small>`:''}<span class="pill ${p.chg<0?'dn':'up'}">${p.chg==null?'غير متاح':fmt(p.chg,2)+'%'}</span></div></div>`;}).join('')||'<div class="empty">لا أصول مسجّلة</div>';
}
let nwF='all';
function renderNews(){
 $('nwFl').innerHTML=[['all','الكل'],...Object.keys(AS).filter(k=>AS[k].yh&&assetVisible(k)).map(k=>[k,k])].map(([k,l])=>`<button class="${nwF===k?'on':''}" onclick="nwF='${k}';renderNews()">${l}</button>`).join('');
 const list=dashboardNews(nwF),all=dashboardNews();
 $('nwList').innerHTML=(list.length?list.slice(0,4).map(newsRow).join(''):'<div class="empty">'+(sourceErrors.news?'الأخبار غير متاحة حاليًا':'لا أخبار مرتبطة متاحة حاليًا')+'</div>')+`<button class="fbtn panel-more" onclick="openNewsFull()">كل الأخبار (${all.length}) <i class="ti ti-arrow-up-left"></i></button>`;
 let note=$('newsOrder');if(!note){note=document.createElement('div');note.id='newsOrder';note.className='news-order';$('nwList').before(note);}
 note.textContent=`أهم ${Math.min(4,list.length)} من ${list.length} خبر · الأهمية تقديرية${sourceErrors.news?' · '+sourceErrors.news:''}`;
}
const newsRow=x=>ratedNewsRow(x);


let XR=null;
function computeXray(){return S.XR;}
function xrMetrics(){return S.metrics;}
let ranked=[];
function renderXrHud(){
  XR=computeXray();const T=XR.total;ranked=Object.entries(XR.countries).sort((a,b)=>b[1]-a[1]);
  renderGlobeHud();
  const M=xrMetrics(XR),g=M.total>=80?'ممتاز':M.total>=65?'جيد جداً':M.total>=50?'جيد':'يحتاج تنويع';
  $('hScore').textContent=M.total;$('hGrade').textContent=g;setTimeout(()=>$('hArc').setAttribute('stroke-dasharray',(M.total/100*251).toFixed(1)+' 252'),100);
  $('hRows').innerHTML=[['تنويع جغرافي',M.s.geo],['تنويع قطاعي',M.s.sec],['تنويع عملات',M.s.cur],['قلة التداخل',M.s.ovl],['توازن متقدمة/ناشئة',M.s.bal]]
    .map(([k,v])=>`<div class="hr"><span class="k">${k}</span><div class="b"><i style="width:${v}%"></i></div><span class="v n">${fmt(v)}</span></div>`).join('');
  renderScen();renderFocus();renderDiv(M);renderTips(M);
}
const SCEN={us:['انهيار أمريكا −25%',X=>(X.countries.US||0)*.25],em:['أزمة ناشئة −30%',X=>X.em*.30],
  tech:['فقاعة التقنية −35%',X=>((X.sectors['تكنولوجيا']||0)+(X.sectors['تكنولوجيا إلكترونية']||0))*.35],
  usd:['هبوط USD −10%',X=>{let v=0;Object.entries(X.countries).forEach(([c,x])=>{if(XR_CUR_OF[c]==='USD')v+=x;});return v*.1;}],
  gl:['يوم أسود −15%',X=>X.total*.15]};
let scenOn='us';
function renderScen(){
  {const L=Object.entries(SCEN).map(([k,[t,f]])=>[k,t,f(XR)]),mx=Math.max(...L.map(x=>x[2]));
   $('scAll').innerHTML=L.sort((a,b)=>b[2]-a[2]).map(([k,t,v])=>`<div class="hb2 clk ${scenOn===k?'evon':''}" onclick="scenOn='${k}';renderScen()"><span class="k" style="width:120px;font-size:10.5px">${t}</span><span class="b"><i style="width:${v/mx*100}%;background:var(--warn);opacity:${scenOn===k?1:.55}"></i></span><span class="v n dn">−${fmtC(v)}</span></div>`).join('');}
  $('scen').innerHTML=Object.entries(SCEN).map(([k,[t]])=>`<button class="${scenOn===k?'on':''}" onclick="scenOn=scenOn==='${k}'?null:'${k}';renderScen()">${t}</button>`).join('');
  const el=$('stress');if(!scenOn){el.classList.remove('on');return;}
  const loss=SCEN[scenOn][1](XR),pct=loss/XR.total*100;el.classList.add('on');
  el.innerHTML=`<div style="font-size:10px;color:var(--muted)">${SCEN[scenOn][0]} — على أسهمك وصناديقك</div><div class="n" style="font-size:20px;color:var(--warn)">−${fmtC(loss)} <small style="font-size:12px">(−${fmt(pct,1)}%)</small></div><div style="font-size:10.5px">بعد الصدمة: <b class="n">${fmtC(XR.total-loss)}</b></div>`;
}


const cv=$('globe'),ctx=cv.getContext('2d');
let W=0,H=0,DPR=1,rot=[-40,-20],tour=true,focusCC=null,focusT=0,mode='auto',fly=null,holdUntil=0,lastT=0,dragging=false,vel=0,markers=[];
let SPEED=6;            // درجة/ثانية — دوران هادئ
const TILT=-20;
let land=null,borders=null,invFeat=[],allFeat=[];
try{
  land=topojson.feature(WORLD,WORLD.objects.land);
  borders=topojson.mesh(WORLD,WORLD.objects.countries,(a,b)=>a!==b);
  allFeat=topojson.feature(WORLD,WORLD.objects.countries).features;
  invFeat=allFeat.filter(f=>NUM2A[+f.id]);
}catch(e){console.log('world',e);}
const proj=d3.geoOrthographic().clipAngle(90).precision(.5);
const path=d3.geoPath(proj,ctx);
const grat=d3.geoGraticule10();
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
let gAnim=null;
function geomFor(W,H){const mob=W<600;return {r:mob?Math.min(W*.40,H*.30):Math.min(W*.30,H*.35),cy:mob?H*.36:H/2+10};}
function panelGeom(){const R=$('globeWrap').getBoundingClientRect(),g=geomFor(R.width,R.height);return {cx:R.left+R.width/2,cy:R.top+g.cy,r:g.r};}
function resize(){const r=cv.getBoundingClientRect();DPR=Math.min(2,window.devicePixelRatio||1);W=r.width;H=r.height;cv.width=W*DPR;cv.height=H*DPR;}
window.addEventListener('resize',resize);

function setFocus(cc){
 if(cc===focusCC)return;
 // Keep the country and its scroll position stable while reading a HUD panel.
 if(mode==='auto'&&document.querySelector('#globeWrap .hud.pe:hover'))return;
 focusCC=cc;focusT=performance.now();renderFocus();
 document.querySelectorAll('#gList .gr').forEach(e=>e.classList.toggle('on',e.dataset.cc===cc));
}
// طيران سلس نحو دولة (من القائمة أو بالضغط)
function flyTo(cc){
  const ll=LL[cc];if(!ll){setFocus(cc);return;}const d=((((-ll[1])-rot[0])%360)+540)%360-180;
  fly={from:[rot[0],rot[1]],to:[rot[0]+d,Math.max(-45,Math.min(45,-ll[0]*.6))],t0:performance.now(),dur:1500+Math.abs(d)*6};
  mode='fly';vel=0;setFocus(cc);
}
function toggleTour(){tour=!tour;$('tourBtn').innerHTML=tour?'<i class="ti ti-player-pause"></i> دوران تلقائي':'<i class="ti ti-player-play"></i> دوران تلقائي';}
function renderFocus(){
 if(!focusCC||!XR)return;if(pulseState().mode==='exposure')return renderExposureFocus();
 const cc=focusCC,q=pulseQuote(cc),cfg=TharwaPulse.config(cc),fx=pulseFX(cc),v=XR.countries[cc]||0;
 $('focus').innerHTML=`<div class="fh"><span class="fn">${flag(cc)} ${esc(GEO_AR[cc]||cc)}</span><span class="pulse-benchmark">${esc(cfg.label||'مؤشر غير مغطى')}</span></div><div class="pulse-compact"><div class="pulse-market"><strong>${pulseChange(q?.changePct)}</strong><span>${esc(TharwaPulse.session(q))}</span></div><div class="pulse-foot">آخر سعر: ${pulseStamp(q?.timestamp)}</div><div class="pulse-fx"><span>${esc(cfg.currency||'—')} / ${esc(baseCur)}</span><bdi>${fx?fmt(fx.rate,4):'—'}</bdi>${pulseChange(fx?.changePct)}</div><div class="pulse-exposure">حصتك: <bdi>${fmtC(v)}</bdi> · <bdi>${fmt(percent(v,XR.total),1)}%</bdi> من الأسهم والصناديق</div><div class="pulse-card-actions"><button class="pulse-more" onclick="openPulseCountry('${cc}')">تفاصيل الدولة ↗</button><button class="pulse-more" onclick="openPulseOverview()">المتابعة الكاملة ↗</button></div></div>`;
}
function draw(now){
  if(!W)resize();
  const dt=lastT?Math.min(.05,(now-lastT)/1000):0;lastT=now;
  // حركة الكرة — كلها مبنية على الزمن فما في قفزات
  if(mode==='fly'){const p=Math.min(1,(now-fly.t0)/fly.dur),e=ease(p);
    rot[0]=fly.from[0]+(fly.to[0]-fly.from[0])*e;rot[1]=fly.from[1]+(fly.to[1]-fly.from[1])*e;
    if(p>=1){mode='hold';holdUntil=now+4500;}}
  else if(mode==='hold'){rot[0]+=vel*dt;vel*=Math.pow(.92,dt*60);if(now>holdUntil)mode='auto';}
  else if(mode==='auto'&&tour){rot[0]+=SPEED*dt;rot[1]+=(TILT-rot[1])*Math.min(1,dt*.8);}
  const mob=W<600;let {r,cy:CY}=geomFor(W,H),CX=W/2;
  if(gAnim){ // انتقال الشاشة الحية: الكرة تتحرك وتكبر من مكانها بالبوكس إلى منتصف الشاشة (أو العكس)
    const p=Math.min(1,(now-gAnim.t0)/gAnim.dur),e=ease(p),P=panelGeom(),F={cx:W/2,cy:CY,r};
    const A=gAnim.dir==='in'?P:F,B=gAnim.dir==='in'?F:P;CX=A.cx+(B.cx-A.cx)*e;CY=A.cy+(B.cy-A.cy)*e;r=A.r+(B.r-A.r)*e;
    if(p>=1){const d=gAnim.dir;gAnim=null;if(d==='out')ambDock();}}
  proj.scale(r).translate([CX,CY]).rotate(rot);
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,W,H);
  const cx=CX,cy=CY,center=[-rot[0],-rot[1]];
  // الدولة الأقرب لمنتصف الوجه الأمامي تصبح هي المعروضة (أثناء الدوران التلقائي)
  if(mode==='auto'&&XR){let best=null,bd=.42;ranked.forEach(([cc])=>{const ll=LL[cc];if(!ll)return;const d=d3.geoDistance([ll[1],ll[0]],center);if(d<bd){bd=d;best=cc;}});if(best)setFocus(best);}
  let g=ctx.createRadialGradient(cx,cy,r*.9,cx,cy,r*1.35);g.addColorStop(0,'rgba(79,216,255,.18)');g.addColorStop(1,'rgba(79,216,255,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*1.35,0,7);ctx.fill();
  ctx.save();ctx.translate(cx,cy);ctx.rotate(now/9000);ctx.strokeStyle='rgba(79,216,255,.22)';ctx.setLineDash([2,7]);ctx.beginPath();ctx.arc(0,0,r*1.16,0,7);ctx.stroke();
  ctx.rotate(-now/4500);ctx.setLineDash([40,18,6,18]);ctx.strokeStyle='rgba(79,216,255,.3)';ctx.beginPath();ctx.arc(0,0,r*1.24,0,7);ctx.stroke();ctx.restore();ctx.setLineDash([]);
  g=ctx.createRadialGradient(cx-r*.35,cy-r*.4,r*.1,cx,cy,r);g.addColorStop(0,'#0a2a3d');g.addColorStop(1,'#020b13');
  ctx.fillStyle=g;ctx.beginPath();path({type:'Sphere'});ctx.fill();
  ctx.strokeStyle='rgba(79,216,255,.06)';ctx.lineWidth=.6;ctx.beginPath();path(grat);ctx.stroke();
  if(land){ctx.fillStyle='rgba(79,216,255,.07)';ctx.beginPath();path(land);ctx.fill();}
  const fa=Math.min(1,(now-focusT)/600); // تلاشي ناعم عند تغيير الدولة
  if(XR&&ranked.length){const mx=ranked[0][1];invFeat.forEach(f=>{const cc=NUM2A[+f.id],v=XR.countries[cc];if(!v)return;
    const a=.12+.5*Math.sqrt(v/mx);ctx.fillStyle=pulseMapColor(cc,cc===focusCC?Math.min(.9,a+.3*fa):a);ctx.beginPath();path(f);ctx.fill();});}
  if(borders){ctx.strokeStyle='rgba(79,216,255,.18)';ctx.lineWidth=.5;ctx.beginPath();path(borders);ctx.stroke();}
  if(land){ctx.strokeStyle='rgba(79,216,255,.5)';ctx.lineWidth=.7;ctx.beginPath();path(land);ctx.stroke();}
  if(XR&&ST.globeLinks!==false){ctx.lineWidth=1;ranked.forEach(([cc])=>{const ll=LL[cc];if(!ll)return;ctx.strokeStyle=cc===focusCC?`rgba(180,243,255,${.35+.55*fa})`:'rgba(79,216,255,.3)';
    ctx.setLineDash([4,6]);ctx.lineDashOffset=-now/40;ctx.beginPath();path({type:'LineString',coordinates:[HOME,[ll[1],ll[0]]]});ctx.stroke();});ctx.setLineDash([]);}
  ctx.strokeStyle='rgba(79,216,255,.55)';ctx.lineWidth=1.2;ctx.beginPath();path({type:'Sphere'});ctx.stroke();
  markers=[];const placed=[];
  if(XR){const T=XR.total;const fl=focusCC&&LL[focusCC]?proj([LL[focusCC][1],LL[focusCC][0]]):null;
    ranked.forEach(([cc,v],i)=>{const ll=LL[cc];if(!ll)return;const lonlat=[ll[1],ll[0]],dist=d3.geoDistance(lonlat,center);if(dist>1.5)return;
      const [x,y]=proj(lonlat);markers.push({cc,x,y});
      const edge=Math.max(0,Math.min(1,(1.5-dist)/.35)); // تلاشي قرب حافة الكرة
      const rr=3+9*Math.sqrt(v/ranked[0][1]),ph=((now/1400)+i*.17)%1;
      ctx.strokeStyle=`rgba(79,216,255,${(1-ph)*.8*edge})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,rr+ph*16,0,7);ctx.stroke();
      ctx.fillStyle=cc===focusCC?`rgba(255,255,255,${edge})`:`rgba(180,243,255,${edge})`;ctx.beginPath();ctx.arc(x,y,cc===focusCC?4:2.6,0,7);ctx.fill();
      const big=cc===focusCC;
      // تسمية صغيرة تظهر وتختفي بنعومة حسب قربها من المنتصف
      const la=big?fa*edge:Math.max(0,Math.min(1,(1.05-dist)/.45))*.85;
      if(la<=.02)return;
      if(!big){ // منع تكدّس التسميات: أكبر 8 دول فقط، وبعيدة عن بطاقة الدولة المحددة وعن بعضها
        if(i>=8)return;if(fl&&Math.hypot(fl[0]-x,fl[1]-y)<90)return;if(placed.some(q=>Math.hypot(q[0]-x,q[1]-y)<55))return;placed.push([x,y]);}
      ctx.globalAlpha=la;
      const dx=big?(x>W-280?-1:1):(x<cx?-1:1),grow=big?(.6+.4*fa):1,lx=x+dx*(big?60:36)*grow,ly=y-(big?44:24)*grow;
      ctx.strokeStyle=big?'rgba(220,250,255,.9)':'rgba(79,216,255,.6)';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(lx,ly);ctx.lineTo(lx+dx*(big?14:8),ly);ctx.stroke();
      ctx.font=`${big?600:500} ${big?13:11}px 'IBM Plex Sans Arabic',sans-serif`;ctx.direction='rtl';
      const t1=pulseMapLabel(cc,v,T),w1=ctx.measureText(t1).width,bw=w1+16,bh=big?40:20;
      const bx=dx>0?lx+dx*(big?16:10):lx+dx*(big?16:10)-bw,by=ly-bh/2;
      ctx.fillStyle=big?'rgba(3,18,30,.92)':'rgba(3,18,30,.75)';ctx.fillRect(bx,by,bw,bh);
      ctx.strokeStyle=big?'rgba(180,243,255,.8)':'rgba(79,216,255,.4)';ctx.strokeRect(bx,by,bw,bh);
      ctx.fillStyle=big?'#ffffff':'#cfeefc';ctx.textAlign='right';ctx.fillText(t1,bx+bw-8,by+(big?16:14));
      if(big){ctx.font="600 12px Rajdhani,sans-serif";ctx.direction='ltr';ctx.fillStyle='#4fd8ff';ctx.fillText(pulseState().mode==='exposure'?fmtC(v):(TharwaPulse.config(cc).label||''),bx+bw-8,by+32);}
      ctx.globalAlpha=1;
    });}
  requestAnimationFrame(draw);
}
let dragStart=null,moved=0,lastX=0,lastMT=0;
cv.addEventListener('pointerdown',e=>{dragging=true;mode='drag';moved=0;vel=0;dragStart=[e.clientX,e.clientY,rot[0],rot[1]];lastX=e.clientX;lastMT=performance.now();cv.classList.add('drag');cv.setPointerCapture(e.pointerId);});
cv.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-dragStart[0],dy=e.clientY-dragStart[1];moved=Math.max(moved,Math.abs(dx)+Math.abs(dy));
  rot[0]=dragStart[2]+dx*.3;rot[1]=Math.max(-70,Math.min(70,dragStart[3]-dy*.3));
  const t=performance.now();if(t>lastMT){vel=(e.clientX-lastX)*.3/((t-lastMT)/1000);}lastX=e.clientX;lastMT=t;
  // أثناء السحب: الدولة الأقرب للمنتصف
  if(XR){const c=[-rot[0],-rot[1]];let b=null,bd=.42;ranked.forEach(([cc])=>{const ll=LL[cc];if(!ll)return;const d=d3.geoDistance([ll[1],ll[0]],c);if(d<bd){bd=d;b=cc;}});if(b)setFocus(b);}});
cv.addEventListener('pointerup',e=>{dragging=false;cv.classList.remove('drag');mode='hold';holdUntil=performance.now()+3500;vel=Math.max(-120,Math.min(120,vel));
  if(moved<5){vel=0;const rc=cv.getBoundingClientRect(),mx=e.clientX-rc.left,my=e.clientY-rc.top;
    let best=null,bd=20;markers.forEach(m=>{const d=Math.hypot(m.x-mx,m.y-my);if(d<bd){bd=d;best=m;}});
    if(!best){const ll=proj.invert([mx,my]);if(ll){const f=invFeat.find(f=>d3.geoContains(f,ll));if(f)best={cc:NUM2A[+f.id]};}}
    if(best&&XR.countries[best.cc]){flyTo(best.cc);if(pulseState().mode==='exposure')openCountry(best.cc);else openPulseCountry(best.cc);}}});


let selM=new Date().getMonth();let selectedYear=new Date().getFullYear();
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function renderTx(){
 const years=[...new Set([new Date().getFullYear(),...TXNS.map(t=>+t[0].slice(0,4)),...CTX.map(t=>+t.d.slice(0,4))])].filter(Number.isFinite).sort((a,b)=>b-a);
 $('txnYearLabel').innerHTML=`<select aria-label="السنة" onchange="selectedYear=+this.value;renderTx()">${years.map(y=>`<option ${y===selectedYear?'selected':''}>${y}</option>`).join('')}</select>`;
 const months=MON.map((m,i)=>monthStats(i)),inv=months.reduce((s,m)=>s+m.inv,0),liq=months.reduce((s,m)=>s+m.liq,0),max=Math.max(1,...months.map(m=>m.inv)),sellMax=Math.max(1,...months.map(m=>m.liq));
 $('txNet').textContent=fmtC(inv-liq);$('txNet').classList.toggle('dn',inv<liq);$('txInv').textContent=fmtC(inv);$('txLiq').textContent=fmtC(liq);
 $('bars').innerHTML=months.map((m,i)=>`<button class="bar ${selM===i?'sel':''}" onclick="selM=${i};renderTx();openMonth(${i})" title="${m.k}"><div class="u">${['Stock','Gold','Property'].map(k=>{const v=m.buy.filter(t=>AS[t[1]]?.t===k).reduce((s,t)=>s+txSAR(t),0);return v?`<i style="height:${v/max*74}px;background:${kc(k)}"></i>`:'';}).join('')}</div><div class="d">${m.liq?`<i style="height:${m.liq/sellMax*16}px"></i>`:''}</div><b>${m.m}</b></button>`).join('');
 const selected=months[selM];const recent=[...TXNS.map(t=>({d:t[0],html:txRow(t)})),...CTX.map((c,i)=>({d:c.d,html:ctxRow(c,i)}))].sort((a,b)=>b.d.localeCompare(a.d));
 $('txList').innerHTML=dividendDashboardHTML()+`<div class="sect clk" onclick="openMonth(${selM})">حركات ${selected.k} ←</div>`+(selected.L.slice(0,4).map(txRow).join('')||'<div class="mu">لا حركات استثمارية</div>')+`<div class="kg2">${cell('استثمرت',fmtC(selected.inv))}${cell('سيّلت',fmtC(selected.liq))}</div><div class="sect">أحدث الحركات</div>`+recent.slice(0,5).map(x=>x.html).join('');
}
const txRow=t=>`<div class="row clk" onclick="openTx(${TXNS.indexOf(t)})"><div class="nm"><div class="t">${t[2]==='Buy'?'شراء':'بيع'} · ${t[1]}</div><div class="s"><span class="n">${t[0]}</span> · ${fmt(t[3],AS[t[1]].t==='Gold'?1:0)} ${AS[t[1]].t==='Gold'?'غ':'وحدة'} @ ${natFmt(t[4],AS[t[1]].cur)}</div></div><span class="n" style="color:${t[2]==='Buy'?'var(--cb)':'var(--muted)'}">${t[2]==='Buy'?'':'+'}${fmtC(txSAR(t))}</span></div>`;
function renderGoals(){
 const T=totals();$('goals').innerHTML=goalCategories().map(k=>{const current=T.by[k]?.cur||0,goal=Number(catGoals[k])||0,pct=percent(current,goal);return `<div class="go clk" onclick="openCat('${k}')"><div class="h"><span>${KLF[k]}</span><b class="n">${goal?fmt(pct,1)+'%':'غير محدد'}</b></div><div class="tr"><i style="width:${Math.min(100,pct)}%"></i></div><div class="f"><span>الحالي ${fmtC(current)}</span><span>متبقي ${fmtC(Math.max(0,goal-current))}</span></div></div>`;}).join('');
 $('pj').innerHTML=`<div class="projection-note"><span>متوسط الاستثمار الشهري</span><b class="n">${fmtC(S.monthly)}</b></div>`+S.projections.map(p=>`<div class="pj"><span>${p.r?fmt(p.r*100)+'%':'ادخار فقط'}</span><b class="n">${p.months==null?'أكثر من 50 سنة':p.months===0?'تحقق الهدف':Math.floor(p.months/12)+'y '+p.months%12+'m'}</b></div>`).join('');
 const paths=S.projections.map(p=>{let value=T.total;const points=[value];for(let i=0;i<72;i++){value=value*(1+p.r/12)+S.monthly;points.push(value);}return points;}),max=Math.max(1,T.goal,...paths.flat()),X=i=>10+i/72*330,Y=v=>130-v/max*120;
 $('pjChart').innerHTML=`<svg viewBox="0 0 360 150" style="width:100%;direction:ltr"><line x1="10" x2="340" y1="${Y(T.goal)}" y2="${Y(T.goal)}" stroke="#fff" stroke-dasharray="4 4"/>${paths.map((points,k)=>`<path d="${points.map((v,i)=>(i?'L':'M')+X(i)+','+Y(v)).join('')}" fill="none" stroke="#4fd8ff" opacity="${.3+k*.23}"/><text x="${X(72)}" y="${Y(points[72])}" fill="#b4f3ff" font-size="9">${fmt(S.projections[k].r*100)}%</text>`).join('')}</svg><div class="sub">سيناريوهات افتراضية لمدة 72 شهرًا، وليست عوائد مضمونة.</div>`;
}



function renderTips(M){
  const X=XR,T=X.total;if(!T){$('hTips').innerHTML='<div class="empty">أضف استثمارات لعرض تحليل التنويع</div>';return;}const us=(X.countries.US||0)/T*100;
  const secTop=Object.entries(X.sectors).sort((a,b)=>b[1]-a[1])[0];
  const cm={};Object.entries(X.countries).forEach(([cc,v])=>{const c=XR_CUR_OF[cc]||'—';cm[c]=(cm[c]||0)+v;});const curTop=Object.entries(cm).sort((a,b)=>b[1]-a[1])[0];
  const ov=Object.values(X.companies).filter(c=>new Set(c.via.map(v=>v.f)).size>1).reduce((a,c)=>a+c.val,0);
  const em=X.em/(X.dev+X.em)*100;
  const TIP={geo:['ti-world',`<b class="n">${fmt(us,0)}%</b> من أسهمك وصناديقك في أمريكا — أي إضافة لصندوق خارجها ترفع التنويع الجغرافي.`],
    sec:['ti-chart-pie-3',`قطاع <b>${secTop[0]}</b> يشكّل <b class="n">${fmt(secTop[1]/T*100,0)}%</b> — الشراء في قطاعات أخرى يوازن المحفظة.`],
    cur:['ti-currency-dollar',`<b class="n">${fmt(curTop[1]/X.mapped*100,0)}%</b> من تعرضك بعملة <b class="n">${curTop[0]}</b> — تنويع العملات يحميك من حركة عملة واحدة.`],
    ovl:['ti-copy',`<b class="n">${fmtC(ov)}</b> تملكها مرتين عبر صناديق متداخلة — الإضافة لصندوق غير متداخل أكفأ.`],
    bal:['ti-scale',`الأسواق الناشئة <b class="n">${fmt(em,0)}%</b> — النطاق الشائع 10–40%.`]};
  const NM={geo:'تنويع جغرافي',sec:'تنويع قطاعي',cur:'تنويع عملات',ovl:'قلة التداخل',bal:'توازن متقدمة/ناشئة'};
  const low=Object.entries(M.s).sort((a,b)=>a[1]-b[1]).filter(([,v])=>v<85).slice(0,3);
  $('hTips').innerHTML=low.length?low.map(([k,v])=>`<div class="an"><i class="ti ${TIP[k][0]}"></i><div><span class="mu" style="font-size:10px">${NM[k]} · <span class="n">${fmt(v)}</span>/100</span><br>${TIP[k][1]}</div></div>`).join('')
    :'<div class="an"><i class="ti ti-circle-check"></i><div>كل أبعاد التنويع فوق 85 — محفظتك موزعة بشكل ممتاز.</div></div>';
}


function renderDiv(M){
  {const S=Object.entries(XR.sectors).sort((a,b)=>b[1]-a[1]).slice(0,5),T=XR.total;
   $('secTop').innerHTML=S.map(([n,v])=>`<div class="hb2"><span class="k" style="width:110px;font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n}</span><span class="b"><i style="width:${v/S[0][1]*100}%"></i></span><span class="v n" style="width:44px">${fmt(v/T*100,1)}%</span></div>`).join('');}
  const ax=[['جغرافي',M.s.geo],['قطاعي',M.s.sec],['عملات',M.s.cur],['تداخل',M.s.ovl],['توازن',M.s.bal]];
  const W=300,H=230,cx=W/2,cy=H/2+6,R=82,pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/5;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];};
  let g='';[.25,.5,.75,1].forEach(f=>{g+=`<polygon points="${ax.map((_,i)=>pt(i,R*f).join(',')).join(' ')}" fill="none" stroke="rgba(79,216,255,${f===1?.3:.1})"/>`;});
  ax.forEach((_,i)=>{const [x,y]=pt(i,R);g+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(79,216,255,.1)"/>`;});
  const poly=ax.map(([,v],i)=>pt(i,R*v/100).join(',')).join(' ');
  const lab=ax.map(([l,v],i)=>{const [x,y]=pt(i,R+22);return `<text x="${x}" y="${y}" text-anchor="middle" fill="#cfeefc" font-size="10.5">${l}</text><text x="${x}" y="${y+12}" text-anchor="middle" fill="#4fd8ff" font-size="10" font-family="Rajdhani,sans-serif" font-weight="600">${fmt(v)}</text>`;}).join('');
  const dots=ax.map(([,v],i)=>{const [x,y]=pt(i,R*v/100);return `<circle cx="${x}" cy="${y}" r="3" fill="#b4f3ff"/>`;}).join('');
  $('radar').innerHTML=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;overflow:visible">${g}
    <g style="transform-origin:${cx}px ${cy}px;animation:radIn 1.1s .2s cubic-bezier(.2,.9,.2,1) both"><polygon points="${poly}" fill="rgba(79,216,255,.14)" stroke="#4fd8ff" stroke-width="1.6" style="filter:drop-shadow(0 0 5px #4fd8ff)"/>${dots}</g>${lab}</svg>`;
  const X=XR,geo=X.dev+X.em,dp=X.dev/geo*100,ep=X.em/geo*100;
  const msg=ep<10?'ميل قوي نحو الأسواق المتقدمة':ep<=40?'ضمن النطاق الشائع عالمياً (10–40% ناشئة)':ep<=55?'ميل ملحوظ نحو الأسواق الناشئة':'ميل قوي نحو الناشئة — عوائد محتملة أعلى مقابل تقلبات أعلى';
  $('split').innerHTML=`<div style="display:flex;height:8px;gap:2px;direction:rtl"><div style="width:${dp}%;background:var(--c);box-shadow:0 0 8px var(--c35)"></div><div style="width:${ep}%;background:var(--c35)"></div></div>
    <div class="leg" style="margin-top:6px"><span><i style="background:var(--c)"></i>متقدمة <b class="n">${fmt(dp,1)}%</b> <span class="n">${fmtC(X.dev)}</span></span><span><i style="background:var(--c35)"></i>ناشئة <b class="n">${fmt(ep,1)}%</b> <span class="n">${fmtC(X.em)}</span></span></div>
    <div style="font-size:10.5px;color:${ep>=10&&ep<=40?'var(--cb)':'var(--warn)'};margin-top:5px">${msg}</div>`;
  let hhi=0;Object.values(X.countries).forEach(v=>{const p=v/X.mapped*100;hhi+=p*p;});
  const t=hhi<1500?'توزيع ممتاز':hhi<2500?'توزيع جيد':hhi<5000?'تمركز مرتفع':'تمركز عالٍ جداً',warn=hhi>=2500;
  $('hhi').innerHTML=`<div style="display:flex;align-items:center;gap:12px"><b class="n" style="font-size:30px;color:${warn?'var(--warn)':'var(--cb)'}">${fmt(hhi)}</b>
    <div><div style="font-size:12px;font-weight:600;color:${warn?'var(--warn)':'var(--cb)'}">${t}</div><div style="font-size:9.5px;color:var(--muted)">كم فلوسك مكدسة في دول قليلة · أقل من 1500 = توزيع صحي</div></div></div>
    <div style="height:5px;background:var(--c07);margin-top:8px;position:relative;direction:rtl"><i style="position:absolute;inset-inline-start:0;top:0;bottom:0;width:${Math.min(100,hhi/100)}%;background:${warn?'var(--warn)':'var(--c)'}"></i><s style="position:absolute;inset-inline-start:15%;top:-3px;bottom:-3px;width:1px;background:#fff;opacity:.5"></s></div>
    <div style="position:relative;height:12px;font-size:9px;color:var(--muted);direction:rtl;margin-top:3px" class="n"><span style="position:absolute;inset-inline-start:0">0</span><span style="position:absolute;inset-inline-start:15%;transform:translateX(50%)">1500</span><span style="position:absolute;inset-inline-end:0">10000</span></div>`;
}


const MON_AR=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function monthStats(i){const k=selectedYear+'-'+String(i+1).padStart(2,'0'),L=TXNS.filter(t=>t[0].startsWith(k)),buy=L.filter(t=>t[2]==='Buy'),sell=L.filter(t=>t[2]==='Sell');return {k,m:MON[i],L,buy,sell,inv:buy.reduce((s,t)=>s+txSAR(t),0),liq:sell.reduce((s,t)=>s+txSAR(t),0)};}
function openMonth(i){
 selM=i;activeDialog={fn:'openMonth',args:[i]};const m=monthReport(i),net=m.inv-m.liq,max=Math.max(1,m.average,...m.months.map(x=>Math.max(x.inv,x.liq))),delta=m.average?(m.inv/m.average-1)*100:null;
 const title=new Date(selectedYear,i,1).toLocaleDateString('ar-SA-u-ca-gregory',{month:'long',year:'numeric'}),cash=CTX.map((c,j)=>({c,j})).filter(({c})=>c.d.startsWith(m.k));
 const chart=m.months.map((x,j)=>`<button class="month-column ${j===i?'selected':''}" onclick="openMonth(${j})" aria-label="${x.k}: مشتريات ${fmtC(x.inv)}، مبيعات ${fmtC(x.liq)}" title="${x.k} · ${fmtC(x.inv)}"><div class="month-columns"><i style="height:${x.inv/max*100}%"></i><s title="مبيعات ${fmtC(x.liq)}" style="height:${x.liq/max*100}%"></s></div><span>${x.m}</span></button>`).join('');
 const signed=v=>v==null?'غير متاح':(v>0?'+':'')+fmtC(v),top=Object.entries(m.byCategory).sort((a,b)=>b[1]-a[1])[0];
 openHolo(`<div class="month-report"><div class="mh"><div><div class="code">MONTH REPORT · ${m.k}</div><h2>${title}</h2><div class="full">${m.L.length} حركة · ${m.buy.length} شراء · ${m.sell.length} بيع</div></div><div class="px"><div class="mu">صافي ما وجّهته للسوق</div><b class="n ${net<0?'dn':'up'}">${net<0?'▼':'▲'} ${fmtC(Math.abs(net))}</b><div class="month-nav"><button class="fbtn sm" aria-label="الشهر السابق" onclick="changeReportMonth(-1)">→</button><button class="fbtn sm" aria-label="الشهر التالي" onclick="changeReportMonth(1)">←</button></div></div></div>
 <div class="kg">${cell('استثمرت',fmtC(m.inv))}${cell('سيّلت',fmtC(m.liq))}${cell('مقابل متوسط الأشهر النشطة',delta==null?'—':(delta>0?'+':'')+fmt(delta,1)+'%')}${cell('قيمة المتبقي من مشتريات الشهر اليوم',m.current==null?'غير متاح':fmtC(m.current))}${cell('ربح / خسارة المتبقي',signed(m.unrealized),m.unrealized<0?'dn':'up')}${cell('ربح محقق من مبيعات الشهر',signed(m.realized),m.realized<0?'dn':'up')}${cell('أكبر حركة',m.largest?esc(m.largest[1])+' · '+fmtC(txSAR(m.largest)):'—')}${cell('ترتيب الاستثمار',m.rank?m.rank+' / '+m.active.length:'—')}</div>
 <div class="month-layout"><div><div class="chartbox month-chart"><div class="cleg month-legend"><span><i class="purchase-key"></i>مشتريات</span><span><i class="sale-key"></i>مبيعات</span><span><i class="average-key"></i>متوسط المشتريات</span><small>اضغط أي شهر للتنقّل</small></div><div class="month-plot"><div class="month-average" style="bottom:${m.average/max*100}%" title="المتوسط ${fmtC(m.average)}"></div>${chart}</div></div><div class="sect">التحليل</div><div class="month-analysis">${top?`<p>تركيز مشتريات الشهر: <b>${esc(KLF[top[0]]||top[0])}</b> بنسبة <b class="n">${fmt(percent(top[1],m.inv),1)}%</b>.</p>`:'<p>لا مشتريات مسجلة خلال هذا الشهر.</p>'}<p>متوسط الاستثمار في الأشهر ذات الحركات: <b class="n">${fmtC(m.average)}</b> · ${m.active.length} أشهر في ${selectedYear}.</p><p>صافي الشراء بعد البيع: <b class="n">${signed(net)}</b>. التحويلات النقدية المرتبطة غير مكررة ضمن هذا الرقم.</p><p>تقييم اليوم يخص الكميات المتبقية من دفعات هذا الشهر حسب FIFO، والربح المحقق يخص مبيعات الشهر.</p></div></div><aside><div class="sect">حسب الفئة</div>${monthBreakdown(m.byCategory,KLF)}<div class="sect">حسب الأصل</div>${monthBreakdown(m.byAsset)}<div class="sect">حركات الشهر</div><div class="month-transactions">${m.L.map(txRow).join('')||'<p class="empty">لا حركات استثمارية</p>'}</div>${cash.length?`<details class="month-cash"><summary>الحسابات النقدية · ${cash.length} حركة</summary>${cash.map(({c,j})=>ctxRow(c,j)).join('')}</details>`:''}</aside></div></div>`);
}



let labTab='orbit';
function setLab(t){labTab=t;document.querySelectorAll('#labTabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
  document.querySelectorAll('.labv').forEach(v=>v.style.display=v.dataset.t===t?'block':'none');
  $('labSide').innerHTML=LAB_SIDE[t]();if(t==='orbit')orbResize();if(t==='net')renderNet();if(t==='heat')renderHeat();}


const coChg=k=>companyQuotes[k]?.changePct??null;


function openCompany(k){const c=XR.companies[k];if(!c)return;const q=companyQuotes[k];openHolo(modalHead('COMPANY EXPOSURE',c.ar,flag(c.cc)+' '+(GEO_AR[c.cc]||c.cc))+`<div class="kg2">${cell('حصتك المجمعة',fmtC(c.val))}${cell('من محفظة التحليل',fmt(percent(c.val,XR.total),2)+'%')}${cell('حركة اليوم',q?.changePct==null?'غير متاح':fmt(q.changePct,2)+'%')}${cell('مصدر السعر',q?'Yahoo · '+esc(q.symbol):'غير متاح')}</div><div class="sect">وصلت لها عبر</div>`+c.via.map(v=>`<div class="row clk" onclick="openAsset('${v.f}')"><div class="nm">${v.f}</div><b class="n">${fmt(v.w,2)}%</b></div>`).join(''));}


const ocv=$('orbit'),octx=ocv.getContext('2d');let OW=0,OH=0,ODPR=1,orbHover=null,orbHit=[],orbPause=0,orbLast=0,orbT=0;
function orbResize(){const r=ocv.getBoundingClientRect();if(!r.width)return;ODPR=Math.min(2,devicePixelRatio||1);OW=r.width;OH=r.height;ocv.width=OW*ODPR;ocv.height=OH*ODPR;}
window.addEventListener('resize',()=>{if(labTab==='orbit')orbResize();});
function orbBodies(){
  let L=[];const ringOf={Stock:2,Gold:1,Property:1,Cash:0,Other:0};
  POS.forEach(p=>{const d=XRAY_DATA[p.n];L.push({id:p.n,v:p.val,chg:p.chg,t:p.t,on:`openAsset('${p.n}')`,moons:d&&p.n!=='BYD'?d.top.slice(0,3).map(x=>x[1]):[]});});
  PROP.filter(p=>assetVisible(p.n)).forEach(p=>L.push({id:p.n,v:p.val,chg:0,t:'Property',on:`openCat('Property')`,moons:[]}));
  CASH.filter(c=>assetVisible(c.n)).forEach(c=>L.push({id:c.n,v:c.bal,chg:0,t:'Cash',on:`openCat('Cash')`,moons:[]}));
  OTHER.forEach(o=>L.push({id:o.n,v:o.v,chg:0,t:'Other',on:`openCat('Other')`,moons:[]}));
  L=L.filter(b=>b.v>0);const cnt=[0,0,0],tot=[0,0,0];L.forEach(b=>{b.ring=ringOf[b.t];tot[b.ring]++;});
  L.forEach(b=>{b.a0=(cnt[b.ring]++/tot[b.ring])*Math.PI*2+b.ring*.7;b.dir=b.chg>0?-1:b.chg<0?1:0;b.sp=.11*(1+Math.min(3,Math.abs(b.chg)));});
  return L;
}
let ORB=[];
function drawOrbit(now){
  requestAnimationFrame(drawOrbit);
  if(labTab!=='orbit'||!OW)return;
  const dt=orbLast?Math.min(.05,(now-orbLast)/1000):0;orbLast=now;if(!orbHover)orbT+=dt;
  const c=octx;c.setTransform(ODPR,0,0,ODPR,0,0);c.clearRect(0,0,OW,OH);
  const cx=OW/2,cy=OH/2+6;
  const rx=[Math.min(OW*.2,OH*.5),Math.min(OW*.32,OH*.8),Math.min(OW*.45,OH*1.1)],ry=rx.map(r=>r*.42);
  // مدارات
  rx.forEach((r,i)=>{c.strokeStyle=`rgba(79,216,255,${.12+i*.04})`;c.setLineDash([3,6]);c.beginPath();c.ellipse(cx,cy,r,ry[i],0,0,Math.PI*2);c.stroke();});c.setLineDash([]);
  const maxV=Math.max(...ORB.map(b=>b.v));
  const pos=ORB.map(b=>{const a=b.a0+b.dir*b.sp*orbT,x=cx+rx[b.ring]*Math.cos(a),y=cy+ry[b.ring]*Math.sin(a),dep=Math.sin(a),sc=.72+.28*(dep+1)/2;
    return {b,a,x,y,dep,sc,r:(5+20*Math.sqrt(b.v/maxV))*sc};});
  const drawBody=P=>{const {b,x,y,r,sc,a}=P,hov=orbHover===b.id,al=.55+.45*sc;
    // ذيل على المدار
    for(let k=1;k<=14;k++){const aa=a-b.dir*k*.035,xx=cx+rx[b.ring]*Math.cos(aa),yy=cy+ry[b.ring]*Math.sin(aa);c.fillStyle=`rgba(79,216,255,${(1-k/14)*.35*al})`;c.beginPath();c.arc(xx,yy,Math.max(.6,r*.22*(1-k/14)),0,7);c.fill();}
    const g=c.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r);g.addColorStop(0,`rgba(230,252,255,${al})`);g.addColorStop(.45,`rgba(79,216,255,${KA[b.t]*al})`);g.addColorStop(1,`rgba(4,30,48,${al})`);
    c.shadowColor='#4fd8ff';c.shadowBlur=hov?24:10*sc;c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();c.shadowBlur=0;
    if(hov){c.strokeStyle='#fff';c.lineWidth=1.2;c.beginPath();c.arc(x,y,r+5,0,7);c.stroke();}
    // أقمار = أكبر الشركات داخل الصندوق
    b.moons.forEach((m,k)=>{const ma=orbT*1.6+k*2.1,mr=r+7+k*4;const mx=x+mr*Math.cos(ma),my=y+mr*.5*Math.sin(ma);c.fillStyle=`rgba(180,243,255,${.8*al})`;c.beginPath();c.arc(mx,my,1.8*sc,0,7);c.fill();
      if(hov){c.font="500 9.5px 'IBM Plex Sans Arabic',sans-serif";c.direction='rtl';c.textAlign='left';c.fillStyle='#b4f3ff';c.fillText(m,mx+5,my+3);}});
    c.globalAlpha=al;c.direction='ltr';c.textAlign='center';c.font=`600 ${Math.round(11*sc+1)}px Rajdhani,sans-serif`;c.fillStyle='#fff';c.fillText(b.id.length>11?b.id.slice(0,10)+'…':b.id,x,y+r+13);
    c.font=`600 ${Math.round(9.5*sc+1)}px Rajdhani,sans-serif`;c.fillStyle=b.chg<0?'#ff6b5a':'#4fd8ff';c.fillText(b.chg?`${b.chg>0?'▲ +':'▼ '}${fmt(Math.abs(b.chg),2)}%`:fmtC(b.v),x,y+r+25);c.globalAlpha=1;};
  pos.filter(P=>P.dep<0).sort((a,b)=>a.dep-b.dep).forEach(drawBody);
  // النواة = إجمالي الثروة
  const T=totals(),pr=1+.04*Math.sin(now/600);
  let g=c.createRadialGradient(cx,cy,4,cx,cy,70);g.addColorStop(0,'rgba(79,216,255,.5)');g.addColorStop(1,'rgba(79,216,255,0)');c.fillStyle=g;c.beginPath();c.arc(cx,cy,70,0,7);c.fill();
  g=c.createRadialGradient(cx-10,cy-10,3,cx,cy,34*pr);g.addColorStop(0,'#ffffff');g.addColorStop(.35,'#4fd8ff');g.addColorStop(1,'#03263a');c.fillStyle=g;c.beginPath();c.arc(cx,cy,34*pr,0,7);c.fill();
  c.strokeStyle='rgba(79,216,255,.5)';c.setLineDash([2,5]);c.beginPath();c.arc(cx,cy,44,now/2000,now/2000+Math.PI*1.6);c.stroke();c.setLineDash([]);
  c.direction='ltr';c.textAlign='center';c.fillStyle='#02121c';c.font="700 13px Rajdhani,sans-serif";c.fillText(fmt(toB(T.total)/1000,0)+'K',cx,cy+5);
  pos.filter(P=>P.dep>=0).sort((a,b)=>a.dep-b.dep).forEach(drawBody);
  orbHit=pos;
}
ocv.addEventListener('mousemove',e=>{const r=ocv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;let h=null;
  [...orbHit].sort((a,b)=>b.dep-a.dep).some(P=>{if(Math.hypot(P.x-mx,P.y-my)<P.r+6){h=P.b.id;return true;}});orbHover=h;ocv.style.cursor=h?'pointer':'default';});
ocv.addEventListener('mouseleave',()=>orbHover=null);
ocv.addEventListener('click',e=>{const r=ocv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
  const P=[...orbHit].sort((a,b)=>b.dep-a.dep).find(P=>Math.hypot(P.x-mx,P.y-my)<P.r+8);if(P)eval(P.b.on);});


function renderNet(){
  const funds=POS.filter(p=>p.t==='Stock'),W=900,H=520;
  const cos=Object.entries(XR.companies).map(([k,c])=>({k,...c,funds:[...new Set(c.via.map(v=>v.f))]}));
  const shared=cos.filter(c=>c.funds.length>1),maxV=Math.max(...cos.map(c=>c.val));
  // الصندوقان الأكثر تداخلاً بالأعلى يمين/يسار، والمشتركة بينهما بالنص
  const pc={};shared.forEach(c=>{for(let i=0;i<c.funds.length;i++)for(let j=i+1;j<c.funds.length;j++){const k=[c.funds[i],c.funds[j]].sort().join('|');pc[k]=(pc[k]||0)+1;}});
  const top=Object.entries(pc).sort((a,b)=>b[1]-a[1])[0];const ordr=top?top[0].split('|'):[];funds.forEach(f=>{if(!ordr.includes(f.n))ordr.push(f.n);});
  const slots=[[W*.83,H*.2],[W*.17,H*.2],[W*.7,H*.74],[W*.3,H*.74],[W*.5,H*.86]];const fp={};ordr.forEach((n,i)=>fp[n]=slots[i]||[W/2+W*.34*Math.cos(i/ordr.length*Math.PI*2),H/2+H*.34*Math.sin(i/ordr.length*Math.PI*2)]);
  const cols=Math.max(1,Math.ceil(shared.length/2)),gx=110,gy=64;
  shared.forEach((c,j)=>{const col=j%cols,row=Math.floor(j/cols);c.x=W/2+(col-(cols-1)/2)*gx;c.y=H*.3+row*gy+(col%2)*14;});
  const perFund={};cos.filter(c=>c.funds.length===1).forEach(c=>(perFund[c.funds[0]]=perFund[c.funds[0]]||[]).push(c));
  Object.entries(perFund).forEach(([f,L])=>{const [fx,fy]=fp[f]||[W/2,H/2],base=Math.atan2(fy-H/2,fx-W/2),arc=Math.min(Math.PI*1.5,L.length*.5),st=L.length>1?arc/(L.length-1):0;
    L.forEach((c,i)=>{const a=base+(i-(L.length-1)/2)*st,rr=86+(i%2)*34;c.x=Math.max(30,Math.min(W-30,fx+Math.cos(a)*rr));c.y=Math.max(18,Math.min(H-24,fy+Math.sin(a)*rr));});});
  let links='',nodes='';
  cos.forEach(c=>c.via.forEach(v=>{const [fx,fy]=fp[v.f]||[W/2,H/2],sh=c.funds.length>1;
    links+=`<line x1="${fx}" y1="${fy}" x2="${c.x}" y2="${c.y}" stroke="${sh?'#b4f3ff':'rgba(79,216,255,.22)'}" stroke-width="${.6+v.w/5}" ${sh?'stroke-dasharray="5 5" class="flow"':''} opacity="${sh?.75:.7}"/>`;}));
  cos.forEach(c=>{const sh=c.funds.length>1,r=3+11*Math.sqrt(c.val/maxV);
    nodes+=`<g class="nn" onclick="openCompany('${c.k}')" style="cursor:pointer">${sh?`<circle cx="${c.x}" cy="${c.y}" r="${r+4}" fill="none" stroke="#fff"><animate attributeName="r" values="${r+3};${r+11};${r+3}" dur="2.4s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" values=".7;0;.7" dur="2.4s" repeatCount="indefinite"/></circle>`:''}
      <circle cx="${c.x}" cy="${c.y}" r="${r}" fill="${sh?'#e6fcff':'rgba(79,216,255,.55)'}" ${sh?'style="filter:drop-shadow(0 0 6px #4fd8ff)"':''}/>
      <text x="${c.x}" y="${c.y+r+13}" text-anchor="middle" font-size="${sh?11:9.5}" fill="${sh?'#fff':'#8fb3c6'}" font-weight="${sh?600:400}">${c.ar}</text><title>${c.ar} · ${fmtC(c.val)}</title></g>`;});
  funds.forEach(f=>{const [x,y]=fp[f.n];nodes+=`<g onclick="openAsset('${f.n}')" style="cursor:pointer"><polygon points="${[0,1,2,3,4,5].map(i=>{const a=Math.PI/6+i*Math.PI/3;return (x+28*Math.cos(a))+','+(y+28*Math.sin(a));}).join(' ')}" fill="rgba(3,18,30,.95)" stroke="#4fd8ff" stroke-width="1.6" style="filter:drop-shadow(0 0 8px #4fd8ff)"/>
    <text x="${x}" y="${y+4}" text-anchor="middle" font-size="12" fill="#fff" font-family="Rajdhani,sans-serif" font-weight="700" direction="ltr">${f.n}</text>
    <text x="${x}" y="${y+44}" text-anchor="middle" font-size="10" fill="#4fd8ff" font-family="Rajdhani,sans-serif" direction="ltr">${fmtC(f.val)}</text></g>`;});
  $('netSvg').innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block">${links}${nodes}</svg>`;
}

function squarify(items,x,y,w,h){const out=[];let rest=items.slice();
  while(rest.length){const short=Math.min(w,h),total=rest.reduce((a,b)=>a+b.v,0),sc=w*h/total;let row=[],best=Infinity;
    for(let i=0;i<rest.length;i++){const r=[...row,rest[i]],s=r.reduce((a,b)=>a+b.v*sc,0),mx=Math.max(...r.map(z=>z.v*sc)),mn=Math.min(...r.map(z=>z.v*sc)),wo=Math.max(short*short*mx/(s*s),s*s/(short*short*mn));if(wo<=best){best=wo;row=r;}else break;}
    const s=row.reduce((a,b)=>a+b.v*sc,0);
    if(w>=h){const cw=s/h;let yy=y;row.forEach(z=>{const hh=z.v*sc/cw;out.push({...z,x,y:yy,w:cw,h:hh});yy+=hh;});x+=cw;w-=cw;}
    else{const ch=s/w;let xx=x;row.forEach(z=>{const ww=z.v*sc/ch;out.push({...z,x:xx,y,w:ww,h:ch});xx+=ww;});y+=ch;h-=ch;}
    rest=rest.slice(row.length);}
  return out;}
function renderHeat(){
 const items=Object.values(XR.companies).filter(c=>c.val>0).map(c=>({k:c.k,n:c.ar,cc:c.cc,v:c.val,ch:coChg(c.k)}));
 POS.filter(p=>XRAY_DATA[p.n]).forEach(p=>{const d=XRAY_DATA[p.n],v=p.val*Math.max(0,100-d.top.reduce((s,t)=>s+t[3],0))/100;if(v>0)items.push({k:p.n,n:'باقي مكوّنات '+p.n,v,rest:true});});
 if(!items.length){$('heatBox').innerHTML='<div class="empty">لا بيانات مكوّنات متاحة</div>';return;}
 const tiles=squarify(items.sort((a,b)=>b.v-a.v),0,0,1000,440);
 $('heatBox').innerHTML=tiles.map(t=>`<div class="tile clk" onclick="${t.rest?'openAsset':'openCompany'}('${t.k}')" style="left:${t.x/10}%;top:${t.y/4.4}%;width:${t.w/10}%;height:${t.h/4.4}%;background:${t.ch==null?'rgba(86,118,138,.2)':t.ch<0?'rgba(255,107,90,.4)':'rgba(79,216,255,.35)'}" title="${t.n} · ${fmtC(t.v)}">${t.w>70&&t.h>34?`<div class="tn">${t.n}</div><div class="tv n">${fmtC(t.v)}</div><div class="tc n">${t.rest?'باقي المكوّنات':t.ch==null?'غير متاح':fmt(t.ch,2)+'%'}</div>`:''}</div>`).join('');
}


const LAB_SIDE={
  orbit:()=>{const L=[...ORB].sort((a,b)=>b.v-a.v);return `<div class="sect" style="margin-top:0"><i class="ti ti-planet"></i> كيف تقرأها</div>
    <div class="an"><i class="ti ti-circle-dot"></i><div>النواة = ثروتك. كل كوكب أصل، <b>حجمه حسب قيمته</b>.</div></div>
    <div class="an"><i class="ti ti-rotate"></i><div><b>سرعته حسب حركته اليوم</b> — الرابح يدور بعكس عقارب الساعة، والخاسر باتجاهها. الأصل بلا تغيّر أو بلا سعر متاح يبقى ثابتاً.</div></div>
    <div class="an"><i class="ti ti-moon"></i><div>الأقمار حول الصناديق = أكبر 3 شركات داخلها. مرّر لتراها.</div></div>
    <div class="sect"><i class="ti ti-list"></i> الأجرام</div>${L.map(b=>`<div class="row clk" onclick="${b.on}" onmouseenter="orbHover='${b.id}'" onmouseleave="orbHover=null"><div class="nm"><div class="t">${b.id} <span class="kt">${KL[b.t]}</span></div></div><span class="n" style="color:var(--cb)">${fmtC(b.v)}</span></div>`).join('')}`;},
  net:()=>{const sh=Object.entries(XR.companies).filter(([,c])=>new Set(c.via.map(v=>v.f)).size>1).sort((a,b)=>b[1].val-a[1].val),sv=sh.reduce((a,[,c])=>a+c.val,0);
    return `<div class="cell" style="margin-bottom:8px"><div class="l">شركات مشتركة بين صناديقك</div><div class="v n" style="color:${sh.length?'var(--warn)':'var(--cb)'}">${sh.length}</div></div>
    <div class="cell"><div class="l">قيمتها الفعلية مجتمعة</div><div class="v n">${fmtC(sv)} <span class="mu" style="font-size:11px">${fmt(sv/XR.total*100,1)}%</span></div></div>
    ${sh.length?`<div class="an" style="margin-top:6px"><i class="ti ti-alert-triangle" style="color:var(--warn)"></i><div>هذه الشركات تشتريها مرتين — أي إضافة لأحد الصناديق تزيد تمركزك فيها.</div></div>`:`<div class="an" style="margin-top:6px"><i class="ti ti-circle-check"></i><div>لا يوجد تداخل بين صناديقك — كل صندوق يضيف شركات جديدة.</div></div>`}
    <div class="sect"><i class="ti ti-copy"></i> المشتركة</div>${sh.map(([k,c])=>`<div class="row clk" onclick="openCompany('${k}')"><div class="nm"><div class="t">${flag(c.cc)} ${c.ar}</div><div class="s">${c.via.map(v=>v.f+' '+fmt(v.w,1)+'%').join(' + ')}</div></div><span class="n" style="color:var(--cb)">${fmtC(c.val)}</span></div>`).join('')}
    <div class="sub" style="margin:10px 0 0">الخطوط المتحركة البيضاء = تداخل · الحجم = حصتك الفعلية</div>`;},
  heat:()=>{const L=Object.entries(XR.companies).map(([k,c])=>({k,c,ch:coChg(k)}));const up=[...L].sort((a,b)=>b.ch-a.ch)[0],dn=[...L].sort((a,b)=>a.ch-b.ch)[0];
    const imp=L.reduce((a,x)=>a+x.c.val*x.ch/100,0);
    return `<div class="kg2" style="margin-bottom:8px">${cell('شركة معروضة',L.length)}${cell('أثرها اليوم',(imp>=0?'+':'−')+fmtC(imp),imp>=0?'up':'dn')}</div>
    <div class="row clk" onclick="openCompany('${up.k}')"><div class="nm"><div class="t">الأقوى اليوم</div><div class="s">${up.c.ar}</div></div><span class="pill up">▲ +${fmt(up.ch,2)}%</span></div>
    <div class="row clk" onclick="openCompany('${dn.k}')"><div class="nm"><div class="t">الأضعف اليوم</div><div class="s">${dn.c.ar}</div></div><span class="pill dn">▼ ${fmt(dn.ch,2)}%</span></div>
    <div class="sect"><i class="ti ti-info-circle"></i> كيف تقرأها</div>
    <div class="an"><i class="ti ti-square"></i><div><b>المساحة = حصتك الفعلية</b> من كل شركة عبر كل صناديقك.</div></div>
    <div class="an"><i class="ti ti-contrast"></i><div><b>الشدّة = حركة اليوم</b> — سماوي صعود، أحمر هبوط. المخطط = باقي الشركات داخل الصندوق.</div></div>
    <div class="sub">الرمادي يعني أن سعر الشركة غير متاح</div>`;},
};


const EV_CAT={earn:['نتائج','ti-report-money'],div:['توزيعات','ti-coin'],idx:['مؤشرات','ti-chart-candle'],macro:['اقتصاد','ti-building-bank'],zakat:['زكاة','ti-building-mosque'],goal:['أهداف','ti-target']};
const EV_ORDER=Object.keys(EV_CAT);
function buildEvents(){
 const result=[...calendarData.filter(e=>e.c!=='div'),...dividendCalendarEvents(),...(ST.events||[]).map(e=>({...e,s:'موعد خاص',src:'يدوي',on:"openSettings('events')"}))];
 if(S.zakat.hawl)result.push({c:'zakat',d:S.zakat.hawl.dueStr,t:'حول الزكاة',s:'من إعداداتك',src:'محسوب',on:'openZakat()'});
 const forecast=S.projections.find(x=>x.r===.07);if(forecast?.months>0&&forecast.months<600){const d=new Date();d.setMonth(d.getMonth()+forecast.months);result.push({c:'goal',d:d.toISOString().slice(0,10),t:'هدف التقاعد — تقديري',s:'سيناريو عائد 7% مع متوسط استثمارك الحالي',src:'تقدير',on:'openGoals()'});}
 return result.map(e=>({...e,days:Math.max(0,Math.ceil((new Date(e.d+'T00:00:00+03:00')-new Date(new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Riyadh'})+'T00:00:00+03:00'))/864e5))})).filter(e=>/^\d{4}-\d{2}-\d{2}$/.test(e.d)&&e.d>=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Riyadh'})&&ST.evOn[e.c]!==false).map(e=>({...e,importance:impactOf(e)})).sort((a,b)=>a.d.localeCompare(b.d));
}
let EV=[],evSel=null;
const rcv=$('radarEv'),rctx=rcv.getContext('2d');let RW=0,RDPR=1;
function radResize(){const r=rcv.getBoundingClientRect();if(!r.width)return;RDPR=Math.min(2,devicePixelRatio||1);RW=r.width;rcv.width=RW*RDPR;rcv.height=RW*RDPR;}
window.addEventListener('resize',radResize);
const evR=(d,R)=>R*Math.min(1,Math.sqrt(d/180));
function evPos(e,i,R,cx,cy){
 const ci=EV_ORDER.indexOf(e.c),same=EV.filter(x=>x.c===e.c),k=Math.max(0,same.indexOf(e));
 const fraction=same.length>1?.16+.68*k/(same.length-1):.5;
 const a=-Math.PI/2+(ci+fraction)*2*Math.PI/EV_ORDER.length;
 const r=Math.max(12,evR(e.days,R));
 return [cx+r*Math.cos(a),cy+r*Math.sin(a),a];
}
function drawRadar(now){
  requestAnimationFrame(drawRadar);if(!RW)return;
  const c=rctx,W=RW,cx=W/2,cy=W/2,R=W/2-24;c.setTransform(RDPR,0,0,RDPR,0,0);c.clearRect(0,0,W,W);
  [[7,'7D'],[30,'30D'],[90,'90D'],[180,'180D']].forEach(([d,l])=>{const r=evR(d,R);c.strokeStyle='rgba(79,216,255,.2)';c.beginPath();c.arc(cx,cy,r,0,7);c.stroke();
    c.fillStyle='#56768a';c.font='600 9px Rajdhani,sans-serif';c.direction='ltr';c.textAlign='left';c.fillText(l,cx+3,cy-r+10);});
  EV_ORDER.forEach((k,i)=>{const a=-Math.PI/2+i*2*Math.PI/EV_ORDER.length;c.strokeStyle='rgba(79,216,255,.12)';c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+R*Math.cos(a),cy+R*Math.sin(a));c.stroke();
    const am=a+Math.PI/EV_ORDER.length;c.fillStyle='#8fb3c6';c.font="500 10px 'IBM Plex Sans Arabic',sans-serif";c.direction='rtl';c.textAlign='center';c.fillText(EV_CAT[k][0],cx+(R+13)*Math.cos(am),cy+(R+13)*Math.sin(am)+3);});
  // المسح
  const sw=(now/1000*1.1)%(Math.PI*2)-Math.PI/2;
  for(let k=0;k<26;k++){const a=sw-k*.03;c.strokeStyle=`rgba(79,216,255,${.4*(1-k/26)})`;c.lineWidth=2;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+R*Math.cos(a),cy+R*Math.sin(a));c.stroke();}c.lineWidth=1;
  EV.forEach((e,i)=>{const [x,y,a]=evPos(e,i,R,cx,cy);let d=((sw-a)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);const glow=Math.max(.25,1-d/(Math.PI*1.4)),sel=evSel===i;
    c.fillStyle=e.importance?.color||'#8aa6b5';c.shadowColor=c.fillStyle;c.shadowBlur=sel?18:8*glow;c.beginPath();c.arc(x,y,sel?5.5:3.5+(e.days<=30?1:0),0,7);c.fill();c.shadowBlur=0;
    if(d<.25||sel){c.strokeStyle=`rgba(79,216,255,${sel?.9:(1-d/.25)})`;c.beginPath();c.arc(x,y,9+(sel?0:d*30),0,7);c.stroke();}
    if(sel){c.direction='rtl';c.textAlign='center';c.font="600 11px 'IBM Plex Sans Arabic',sans-serif";c.fillStyle='#fff';c.fillText(e.t,x,y-12);}});
  c.fillStyle='#fff';c.beginPath();c.arc(cx,cy,3,0,7);c.fill();
}
rcv.addEventListener('click',e=>{const r=rcv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,R=RW/2-24;
  let best=-1,bd=14;EV.forEach((ev,i)=>{const [x,y]=evPos(ev,i,R,RW/2,RW/2);const d=Math.hypot(x-mx,y-my);if(d<bd){bd=d;best=i;}});if(best>=0){evSel=best;renderEvList();}});
function cd(e){return TharwaPulse.dayLabel(e.d);}
function renderEvList(){
 const n=EV[0];$('evNext').innerHTML=n?`<div class="l">الحدث القادم · ${esc(EV_CAT[n.c]?.[0]||'حدث')}</div><div class="next-event-title">${esc(n.t)}</div><div class="n" id="evCd">${cd(n)}</div>`:'<div class="mu">لا مواعيد قادمة متاحة</div>';
 let controls=$('radarControls');if(!controls){controls=document.createElement('div');controls.id='radarControls';controls.className='radar-controls';$('evList').before(controls);}
 controls.innerHTML=`<span>أقرب ${Math.min(9,EV.length)} أحداث · <b class="impact-high">مرتفعة</b> · <b class="impact-medium">متوسطة</b> · <b class="impact-low">منخفضة</b></span>`;
 $('evList').innerHTML=(sourceErrors.calendar?`<p class="coverage-warning">تغطية جزئية: ${esc(sourceErrors.calendar)}</p>`:'')+`<div class="radar-card-grid">${EV.slice(0,9).map(radarCard).join('')||'<div class="empty">لا أحداث متاحة من المصادر الحالية</div>'}</div><button class="fbtn panel-more" onclick="openRadarFull()">كل الأحداث (${EV.length}) <i class="ti ti-arrow-up-left"></i></button>`;
}
setInterval(()=>{const el=$('evCd');if(el&&EV[0])el.textContent=cd(EV[0]);},1000);

function renderLab(){ORB=orbBodies();EV=buildEvents();renderEvList();setLab(labTab);}


let AMB_IDLE=60000;let ambOn=false,ambSince=0,ambIdleT=null,ambCardI=0,ambCardT=null,ambDriftT=null,ambClockT=null,ambPrevTour=true;
function ambCards(){
 const T=totals(),list=POS.filter(p=>p.chg!=null),best=list.filter(p=>p.chg>0).sort((a,b)=>b.chg-a.chg)[0],worst=list.filter(p=>p.chg<0).sort((a,b)=>a.chg-b.chg)[0],top=ranked[0],pr=T.gC-T.gK,year=String(new Date().getFullYear()),net=TXNS.filter(t=>t[0].startsWith(year)).reduce((s,t)=>s+(t[2]==='Buy'?1:-1)*txSAR(t),0);
 const pulse=pulseItems().slice(0,3).map(r=>[r.kind==='news'?'ti-news':'ti-world',r.kind==='news'?'مستجد مرتبط بمحفظتك':'موعد قريب',esc(r.item.t),r.kind==='event'?cd(r.item):esc((r.item.date||'').slice(0,10))]);
 const markets=ranked.filter(([cc])=>Number.isFinite(pulseQuote(cc)?.changePct)).sort((a,b)=>Math.abs(pulseQuote(b[0]).changePct)*b[1]-Math.abs(pulseQuote(a[0]).changePct)*a[1]).slice(0,2).map(([cc,v])=>['ti-world','حركة سوق مرتبط بمحفظتك',esc(GEO_AR[cc]||cc)+' '+fmt(pulseQuote(cc).changePct,2)+'%',esc(TharwaPulse.config(cc).label)+' · حصتك '+fmt(percent(v,XR.total),1)+'% · '+pulseStamp(pulseQuote(cc).timestamp)]);
 return [...pulse,...markets,['ti-trending-up','أكبر رابح اليوم',best?best.n+' '+fmt(best.chg,2)+'%':'غير متاح',''],['ti-trending-down','أكبر خاسر اليوم',worst?worst.n+' '+fmt(worst.chg,2)+'%':'غير متاح',''],['ti-target','هدف التقاعد',fmt(percent(T.total,T.goal),1)+'%',fmtC(Math.max(0,T.goal-T.total))+' متبقي'],['ti-chart-line','ربح النمو',fmtC(pr),fmt(percent(pr,T.gK),1)+'%'],['ti-radar','الحدث القادم',EV[0]?cd(EV[0]):'لا أحداث',EV[0]?.t||''],['ti-heart','صحة المحفظة',S.metrics.total+' / 100',''],['ti-world','أكبر تمركز',top?GEO_AR[top[0]]||top[0]:'غير متاح',top?fmt(percent(top[1],XR.total),1)+'%':''],['ti-arrows-exchange','صافي الاستثمار · '+year,fmtC(net),'']];
}
function ambShowCard(){
  const L=ambCards(),k=ambCardI%L.length,[ic,l,v,sub]=L[k],el=$('ambCard');
  el.classList.remove('flip');el.offsetHeight;el.classList.add('flip');
  el.innerHTML=`<div class="l"><i class="ti ${ic}"></i>${l}</div><div class="v n">${v}</div><div class="s">${sub}</div>`;
  $('ambDots').innerHTML=L.map((_,i)=>`<i class="${i===k?'on':''}"></i>`).join('');
  const p=$('ambProg');p.style.transition='none';p.style.width='0';p.offsetHeight;p.style.transition='width 7s linear';p.style.width='100%';
  ambCardI++;
}
function ambRender(){
  const T=totals(),pr=T.gC-T.gK,gp=Math.min(100,T.total/T.goal*100);
  $('ambW').textContent=fmtC(T.total);
  const day=POS.reduce((a,p)=>a+p.val*p.chg/(100+p.chg),0);
  $('ambWs').innerHTML=`<span style="color:${day>=0?'var(--c)':'var(--warn)'}">اليوم <span class="n">${day>=0?'▲':'▼'} ${fmtC(day)}</span></span> <span class="mu">· ربح النمو <span class="n">${pr>=0?'+':'−'}${fmtC(pr)}</span></span>`;
  $('ambGoal').setAttribute('width',(gp*1.2).toFixed(1));$('ambGoalT').innerHTML=`هدف التقاعد <b class="n" style="color:#fff">${fmt(gp,1)}%</b>`;
  $('ambHold').innerHTML=`<div style="font-family:var(--hud);font-size:9px;letter-spacing:3px;color:var(--c);direction:ltr;text-align:left;margin-bottom:4px">HOLDINGS</div>`+
    POS.map(p=>`<div class="r"><span>${p.n}</span><span class="n" style="color:#fff">${natFmt(p.p,p.cur)}</span><span class="n" style="color:${p.chg<0?'var(--warn)':'var(--c)'};width:62px;text-align:left">${p.chg>=0?'+':''}${fmt(p.chg,2)}%</span></div>`).join('');
  renderMarketTicker('ambTick');
}
function ambTickClock(){const d=new Date();$('ambClock').textContent=d.toTimeString().slice(0,5);$('ambDate').textContent=d.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const c=$('ambCd');if(c&&EV[0])c.textContent=cd(EV[0]);}
function enterAmb(manual){
  if(ambOn||document.body.classList.contains('booting')||$('ov').classList.contains('open'))return;
  if(gAnim)return;
  ambOn=true;ambSince=performance.now();ambPrevTour=tour;tour=true;mode='auto';
  ambRender();ambTickClock();ambCardI=0;
  const A=$('amb');A.classList.add('on');
  $('ambGlobe').appendChild(cv);resize();gAnim={dir:'in',t0:performance.now(),dur:1400};
  requestAnimationFrame(()=>A.classList.add('bg'));
  setTimeout(()=>{if(ambOn){A.classList.add('ready');ambShowCard();}},1000);
  ambCardT=setInterval(ambShowCard,7000);ambClockT=setInterval(ambTickClock,1000);
  // تحريك خفيف للعناصر كل فترة — يحمي الشاشة من حرق الصورة إذا ضلت شغالة ساعات
  ambDriftT=setInterval(()=>{if(!ST.burn)return;$('ambHud').style.transform=`translate(${(Math.random()*16-8).toFixed(1)}px,${(Math.random()*12-6).toFixed(1)}px)`;},25000);
  const h=$('ambHint');h.classList.add('show');setTimeout(()=>h.classList.remove('show'),2600);
  if(manual&&document.documentElement.requestFullscreen){try{document.documentElement.requestFullscreen().catch(()=>{});}catch(e){}}
}
function exitAmb(){
  if(!ambOn||performance.now()-ambSince<900)return;
  if(gAnim)return;
  ambOn=false;clearInterval(ambCardT);clearInterval(ambClockT);clearInterval(ambDriftT);
  const A=$('amb');A.classList.remove('ready');tour=ambPrevTour;
  if(document.fullscreenElement&&document.exitFullscreen){try{document.exitFullscreen().catch(()=>{});}catch(e){}}
  // العناصر تختفي أولاً، بعدين الخلفية تنوّر والكرة ترجع تصغر لمكانها بالبوكس
  setTimeout(()=>{A.classList.remove('bg');gAnim={dir:'out',t0:performance.now(),dur:1300};},250);
  ambArm();
}
function ambDock(){$('globeWrap').insertBefore(cv,$('globeWrap').firstChild);$('amb').classList.remove('on');resize();}
function ambArm(){clearTimeout(ambIdleT);if(!isFinite(AMB_IDLE))return;ambIdleT=setTimeout(()=>enterAmb(false),AMB_IDLE);}
['mousemove','mousedown','keydown','touchstart','wheel','scroll'].forEach(ev=>window.addEventListener(ev,e=>{
  if(ambOn){exitAmb();return;}
  if(ev==='keydown'&&(e.key==='l'||e.key==='L'||e.key==='ل')&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){enterAmb(true);return;}
  ambArm();},{passive:true}));

function startLab(){orbResize();radResize();requestAnimationFrame(drawOrbit);requestAnimationFrame(drawRadar);ambArm();}


function moreHint(){const h=$('hb');$('holo').classList.toggle('has-more',h.scrollHeight-h.clientHeight-h.scrollTop>8);}
function openHolo(html){$('hb').classList.remove('still');$('hb').innerHTML=html;$('ov').classList.add('open');$('hb').scrollTop=0;setTimeout(moreHint,700);
  const h=$('holo');h.style.animation='none';h.offsetHeight;h.style.animation='';}
function closeHolo(){$('ov').classList.remove('open');}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeHolo();});
const cell=(l,v,cls='')=>`<div class="cell"><div class="l">${l}</div><div class="v n ${cls}">${v}</div></div>`;


function series(){return [];}
function chart52(p){
 const h=historyData[p.yh];if(!h||h.loading)return '<div class="empty">جاري تحميل التاريخ السعري…</div>'+dividendOnlyChartHTML(p);if(h.ok===false||!h.points?.length)return `<div class="empty">التاريخ السعري غير متاح من المصدر حاليًا<br><button class="fbtn" onclick="delete historyData['${p.yh}'];loadHistory('${p.n}')">إعادة المحاولة</button></div>${dividendOnlyChartHTML(p)}`;
 const pts=h.points.map(x=>({...x,p:p.t==='Gold'?(x.p*.997*.02055-5)/.188:x.p})),average=p.avg>0?s2n(p.avg,p.cur,liveRate(p.cur)):null,ma=p.ma??(pts.length>=200?pts.slice(-200).reduce((s,x)=>s+x.p,0)/200:null),values=[...pts.map(x=>x.p),average,ma].filter(x=>x!=null),min=Math.min(...values),max=Math.max(...values),start=Date.parse(pts[0].d),priceEnd=Date.parse(pts.at(-1).d),end=priceEnd,X=d=>8+(Date.parse(d)-start)/(end-start||1)*572,Y=v=>184-(v-min)/(max-min||1)*162;
 window._realChart={pts,cur:p.cur,start,end,priceEnd,min,max};const line=pts.map((v,i)=>(i?'L':'M')+X(v.d)+','+Y(v.p)).join('');
 return `<div class="cleg"><span>السعر</span><span>┄ متوسطك</span><span>⋯ متوسط 200 يوم</span><span class="buy-legend">▲ شراء</span><span class="sell-legend">▼ بيع</span><span>⊙ مسجّل · <b style="color:#f5c76a">! للمراجعة</b></span></div><svg id="c52" viewBox="0 0 640 ${p.t==='Stock'?317:262}" style="width:100%;direction:ltr" onpointermove="realChartHover(event)" onpointerleave="hideChartHover()" aria-label="التاريخ السعري">${historyPlotDecor(pts,min,max,X,Y,line)}${average==null?'':`<line x1="8" x2="580" y1="${Y(average)}" y2="${Y(average)}" stroke="#fff" stroke-dasharray="6 4"/>`}${ma==null?'':`<line x1="8" x2="580" y1="${Y(ma)}" y2="${Y(ma)}" stroke="#7394a3" stroke-dasharray="2 4"/>`}<path fill="none" stroke="#4fd8ff" stroke-width="2" style="filter:drop-shadow(0 0 3px #4fd8ff)" d="${line}"/><circle cx="${X(pts.at(-1).d)}" cy="${Y(pts.at(-1).p)}" r="3.5" fill="#fff"/>${chartTradeTrack(p,start,end,X)}${chartDividendMarkers(p,start,end,X)}<line id="realCross" y1="10" y2="194" stroke="#b4f3ff" opacity="0"/></svg><div id="chartHover" class="chart-hover" hidden></div><div id="realChartTip" class="sub n">${pts[0].d} → ${pts.at(-1).d} · Yahoo Finance</div>`;
}
function chartHover(e){const s=$('c52'),c=window._cpts;if(!s||!c)return;const r=s.getBoundingClientRect(),sx=(e.clientX-r.left)/r.width*640;
  const i=Math.max(0,Math.min(c.N-1,Math.round((sx-4)/(640-60)*(c.N-1))));const x=c.X(i);$('cx').setAttribute('x1',x);$('cx').setAttribute('x2',x);$('cx').setAttribute('opacity',.5);
  const d=new Date(c.start.getTime()+i/(c.N-1)*(c.end-c.start));const tp=$('ctip');tp.style.display='block';tp.innerHTML=`<span class="n">${d.toISOString().slice(0,10)}</span> · <b class="n" style="color:var(--cb)">${natFmt(c.pts[i],c.cur)}</b>`;
  tp.style.left=Math.min(r.width-150,(x/640)*r.width+10)+'px';tp.style.top='30px';}

function openAsset(n){
  const asset=AS[n];if(!asset)return;const f=ENGINE.fifo(n),p=S.POS.find(x=>x.n===n)||{...asset,n,qty:0,val:0,cost:0,avg:0,pnl:0,realized:f.realized,sells:f.sells};const T=totals(),w=percent(p.val,T.total),nat=p.cur==='GBp'?p.avg/FX.GBP*100:p.cur==='SARg'?p.avg:p.avg/FX[p.cur];
  const rp=(p.p-p.lo)/(p.hi-p.lo)*100,ap=Math.max(0,Math.min(100,(nat-p.lo)/(p.hi-p.lo)*100));
  const txs=TXNS.filter(t=>t[1]===n).sort((a,b)=>b[0].localeCompare(a[0]));
  const d=XRAY_DATA[n];
  let inside='';
  if(d&&p.t==='Stock'&&d.kind==='etf'){
    inside=`<div class="sect"><i class="ti ti-microscope"></i> داخل الصندوق — حصتك الفعلية</div>`+(d.top||[]).slice(0,6).map(([k,ar,cc,wt])=>`<div class="row clk" onclick="openCompany('${k}')"><div class="nm"><div class="t" style="font-weight:500">${flag(cc)} ${ar}</div></div><span class="n mu">${fmt(wt,1)}%</span><span class="n" style="color:var(--cb);width:90px;text-align:left">${fmtC(p.val*wt/100)}</span></div>`).join('')
     +`<div class="sect"><i class="ti ti-map-pin"></i> كل الدول المتاحة</div>`+Object.entries(d.countries||{}).sort((a,b)=>b[1]-a[1]).map(([cc,wt])=>`<div class="row clk" onclick="openCountry('${cc}')"><div class="nm"><div class="t" style="font-weight:500">${flag(cc)} ${GEO_AR[cc]}</div></div><span class="n mu">${fmt(wt,1)}%</span><span class="n" style="color:var(--cb);width:90px;text-align:left">${fmtC(p.val*wt/100)}</span></div>`).join('');
  }
  const news=rankNews(NEWS.filter(x=>newsAssets(x).includes(n)));
  openHolo(`<div class="asset-dialog"><div class="asset-scroll" tabindex="0" aria-label="تفاصيل الأصل — تمرير عمودي">
  <div class="mh"><div><div class="code">${p.tv||''} · ${p.yh||''} · ${KL[p.t].toUpperCase?KL[p.t]:''}</div><h2>${n}</h2><div class="full">${p.full}</div></div>
    <div class="px"><div class="mu" style="font-size:10px">السعر الحالي</div><b class="n">${natFmt(p.p,p.cur)}</b><div><span class="pill ${p.chg>=0?'up':'dn'}">${p.chg==null?'حركة اليوم غير متاحة':(p.chg>=0?'▲ +':'▼ ')+fmt(Math.abs(p.chg),2)+'% اليوم'}</span> <span class="n mu" style="font-size:11px">${p.p==null?'':'≈ '+fmtC(toSAR(p.p,p.cur))}</span></div></div></div>
  <div class="kg">
    ${cell(p.hasPx?'القيمة الحالية':'القيمة بالتكلفة — السعر غير متاح',fmtC(p.val),'up')}${cell('المستثمر (تكلفة FIFO)',fmtC(p.cost))}${cell('الربح / الخسارة',`${p.pnl>=0?'▲':'▼'} ${fmtC(p.pnl)} (${p.pnl>=0?'+':''}${fmt(percent(p.pnl,p.cost),1)}%)`,p.pnl>=0?'up':'dn')}${cell('وزنه من الثروة',fmt(w,1)+'%')}
    ${cell('الكمية',fmt(p.qty,p.t==='Gold'?1:0)+(p.t==='Gold'?' غ':' وحدة'))}${cell('متوسط تكلفتك',natFmt(nat,p.cur))}${cell('متوسط 200 يوم',natFmt(p.ma,p.cur))}${cell('ربح محقق سابق',p.realized?sgn(p.realized):'—',p.realized<0?'dn':'')}
  </div>
  <div class="mg asset-overview ${inside?'':'chart-only'}">
    <div>
      <div class="chartbox" id="assetHistory">${chart52(p)}</div>
      <div class="rng"><div style="font-size:10.5px;color:var(--muted)">نطاق 52 أسبوع — <span style="color:var(--text)">■ السعر</span> · <span style="color:#fff">| متوسطك</span></div>
        <div class="bar2">${p.hi>p.lo&&p.p!=null?`<s style="right:${ap}%"></s><i style="right:${Math.max(0,Math.min(100,rp))}%"></i>`:""}</div><div class="lb"><span class="n">${natFmt(p.lo,p.cur)}</span><span class="n">${natFmt(p.hi,p.cur)}</span></div></div>
    </div>
    ${inside?`<div class="asset-exposure"><div class="asset-exposure-list" tabindex="0" aria-label="الشركات والدول داخل الصندوق">${inside}</div></div>`:''}
  </div>
  <div class="asset-updates ${p.t==='Stock'?'':'news-only'}">
    ${p.t==='Stock'?`<section>${assetDividendHTML(n,p)}</section>`:''}
    <section class="asset-latest-news">
      <div class="sect"><i class="ti ti-news"></i> أخبار ${n}</div>
      <div class="asset-news-scroll">${news.length?news.slice(0,3).map(newsRow).join(''):'<div class="mu" style="font-size:11px">لا أخبار مرتبطة حالياً</div>'}</div>
      ${news.length>3?`<button class="fbtn sm ghost" onclick="openNewsFull('${n}')">كل أخبار الأصل (${news.length})</button>`:''}
    </section>
  </div>
  <div class="asset-transactions">
      <div class="sect"><i class="ti ti-list"></i> حركاتك على ${n} (${txs.length})</div>
      ${txs.map(t=>`<div class="row clk" onclick="openTx(${TXNS.indexOf(t)})" title="تفاصيل الحركة"><div class="nm"><div class="t">${t[2]==='Buy'?'شراء':'بيع'}</div><div class="s"><span class="n">${t[0]}</span> · ${fmt(t[3],p.t==='Gold'?1:0)} @ ${natFmt(t[4],t[8]?.currency||p.cur)}</div></div><span class="n" style="color:${t[2]==='Buy'?'var(--cb)':'var(--muted)'}">${t[2]==='Sell'?'+':''}${fmtC(txSAR(t))}</span></div>`).join('')}
      ${p.sells.map(s=>`<div class="row"><div class="nm"><div class="t mu">نتيجة البيع ${s.date}</div><div class="s">تكلفة FIFO ${fmtC(s.basis)}</div></div>${pnlTxt(s.pnl,s.basis)}</div>`).join('')}
  </div></div><div class="asset-actions" role="group" aria-label="إجراءات الأصل"><button class="tourbtn"  onclick="openTxForm('${n}')"><i class="ti ti-plus"></i> حركة جديدة</button><button class="tourbtn"  onclick="openSettings('alerts','${n}')"><i class="ti ti-bell-plus"></i> نبّهني عند سعر</button></div></div>`);if(p.yh&&!historyData[p.yh])loadHistory(n);if(p.t==='Stock')loadDividendSources();
}

function mainland(f,cc){const ll=LL[cc];if(f.geometry.type!=='MultiPolygon')return f;
  const polys=f.geometry.coordinates.filter(p=>d3.geoDistance(d3.geoCentroid({type:'Polygon',coordinates:p}),[ll[1],ll[0]])<.45);
  return {type:'Feature',geometry:{type:'MultiPolygon',coordinates:polys.length?polys:f.geometry.coordinates}};}
function countryMap(cc){
  const f0=allFeat.find(f=>NUM2A[+f.id]===cc);if(!f0)return '<div class="mapfb">'+((cc==='EZ'||cc==='EU')?'تعرّض إقليمي مجمّع · موضع الخريطة تمثيلي، وليس توزيعاً بين الدول':'الخريطة غير متاحة')+'</div>';
  const f=mainland(f0,cc),w=560,h=300,ll=LL[cc],c=[ll[1],ll[0]];
  const pj=d3.geoAzimuthalEqualArea().rotate([-c[0],-c[1]]).fitExtent([[50,34],[w-50,h-34]],f),pg=d3.geoPath(pj);
  const d=pg(f),grat=pg(d3.geoGraticule().step([5,5])());
  const neigh=allFeat.filter(x=>x!==f0&&d3.geoDistance(d3.geoCentroid(x),c)<.9).map(x=>`<path d="${pg(x)}"/>`).join('');
  const [px,py]=pj(c);
  let home='';const hp=pj(HOME);
  if(cc!==ST.home.cc&&hp&&hp[0]>0&&hp[0]<w&&hp[1]>0&&hp[1]<h)home=`<line x1="${hp[0]}" y1="${hp[1]}" x2="${px}" y2="${py}" stroke="#b4f3ff" stroke-opacity=".5" stroke-dasharray="3 5"><animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite"/></line><circle cx="${hp[0]}" cy="${hp[1]}" r="3" fill="#b4f3ff"/><text direction="ltr" style="direction:ltr" x="${hp[0]+6}" y="${hp[1]-6}" fill="#b4f3ff" font-size="10" font-family="Rajdhani,sans-serif">${esc(ST.home.n)}</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" class="cmapsvg">
  <defs>
    <clipPath id="cmBox"><rect width="${w}" height="${h}"/></clipPath>
    <clipPath id="cmShape"><path d="${d}"/></clipPath>
    <pattern id="cmDots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".75" fill="#4fd8ff" opacity=".55"/></pattern>
    <linearGradient id="cmScan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fd8ff" stop-opacity="0"/><stop offset=".85" stop-color="#4fd8ff" stop-opacity=".45"/><stop offset="1" stop-color="#ffffff" stop-opacity=".9"/></linearGradient>
  </defs>
  <g clip-path="url(#cmBox)">
    <path d="${grat}" fill="none" stroke="rgba(79,216,255,.07)"/>
    <g fill="rgba(79,216,255,.035)" stroke="rgba(79,216,255,.2)" stroke-width=".6">${neigh}</g>
    <path d="${d}" fill="rgba(79,216,255,.08)"/>
    <path d="${d}" fill="url(#cmDots)" opacity="0"><animate attributeName="opacity" to="1" dur=".8s" begin="1.1s" fill="freeze"/></path>
    <rect x="0" width="${w}" height="40" fill="url(#cmScan)" clip-path="url(#cmShape)"><animate attributeName="y" from="-40" to="${h}" dur="2.6s" begin=".6s" repeatCount="indefinite"/></rect>
    <path d="${d}" fill="none" stroke="#4fd8ff" stroke-width="1.6" style="filter:drop-shadow(0 0 5px #4fd8ff)" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" to="0" dur="1.6s" begin=".35s" fill="freeze" calcMode="spline" keySplines=".6 0 .2 1" keyTimes="0;1"/></path>
    ${home}
    <circle cx="${px}" cy="${py}" r="4" fill="#fff"/>
    <circle cx="${px}" cy="${py}" r="4" fill="none" stroke="#4fd8ff"><animate attributeName="r" from="4" to="26" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" from="1" to="0" dur="1.8s" repeatCount="indefinite"/></circle>
    <line x1="${px}" x2="${px}" y1="0" y2="${h}" stroke="rgba(79,216,255,.18)" stroke-dasharray="2 4"/>
    <line x1="0" x2="${w}" y1="${py}" y2="${py}" stroke="rgba(79,216,255,.18)" stroke-dasharray="2 4"/>
  </g>
  <g direction="ltr" style="direction:ltr" font-family="Orbitron,Rajdhani,sans-serif" font-size="8.5" fill="#4fd8ff" letter-spacing="2">
    <text x="12" y="18">SECTOR SCAN · ${cc}</text>
    <text x="12" y="${h-10}" fill="#56768a">${fmt(ll[0],2)}° · ${fmt(ll[1],2)}°</text>
    <text x="${w-12}" y="${h-10}" text-anchor="end" fill="#56768a">${XRAY_DEV[cc]?'DEVELOPED':'EMERGING'} MARKET</text>
  </g>
  <path d="M2,16 V2 H16 M${w-16},2 H${w-2} V16 M${w-2},${h-16} V${h-2} H${w-16} M16,${h-2} H2 V${h-16}" fill="none" stroke="#4fd8ff" stroke-width="1.5"/>
  </svg>`;
}
function openCountry(cc){
  if(!XR||!XR.countries[cc])return;const v=XR.countries[cc],T=XR.total;
  const cos=Object.values(XR.companies).filter(c=>c.cc===cc).sort((a,b)=>b.val-a.val);
  const usd=XR_CUR_OF[cc]||'—';
  openHolo(`<div class="mh"><div><div class="code">${cc} · ${geoPositionLabel(cc)} · ${XRAY_DEV[cc]?'DEVELOPED':'EMERGING'}</div><h2>${flag(cc)} ${GEO_AR[cc]}</h2><div class="full">${XRAY_DEV[cc]?'سوق متقدم':'سوق ناشئ'} · العملة ${usd}</div></div>
    <div class="px"><div class="mu" style="font-size:10px">تعرّضك الفعلي</div><b class="n">${fmtC(v)}</b><div class="n mu">${fmt(v/T*100,1)}% من الأسهم والصناديق</div></div></div>
  <div class="cgrid"><div class="cmapbox">${countryMap(cc)}</div>
   <div class="kg2">${cell('ترتيبها بين الدول',`${ranked.findIndex(r=>r[0]===cc)+1} / ${ranked.length}`)}${cell('من إجمالي ثروتك',fmt(v/totals().total*100,2)+'%')}${cell('عدد الصناديق',XR.src[cc].length)}${cell('شركات ضمن أكبر المراكز',cos.length)}${cell('لو هبط سوقها 20%','−'+fmtC(v*.2),'dn')}${cell('أثره على ثروتك',fmt(v*.2/totals().total*100,2)+'%','dn')}</div></div>
  <div class="mg"><div>
    <div class="sect" style="margin-top:0"><i class="ti ti-stack-2"></i> من أين يأتي التعرض</div>
    ${XR.src[cc].map(s=>`<div class="row clk" onclick="openAsset('${s.f}')"><div class="nm"><div class="t">${s.f}</div><div class="s">${AS[s.f].full} · وزنها داخله ${fmt(s.w,1)}%</div></div><span class="n" style="color:var(--cb)">${fmtC(s.v)}</span><i class="ti ti-chevron-left chev"></i></div>`).join('')}
  </div><div>
    <div class="sect" style="margin-top:0"><i class="ti ti-building-skyscraper"></i> شركات تملكها هناك</div>
    ${cos.length?cos.map(c=>`<div class="row"><div class="nm"><div class="t" style="font-weight:500">${c.ar}</div><div class="s">عبر: ${c.via.map(x=>x.f+' '+fmt(x.w,1)+'%').join(' + ')}</div></div><span class="n" style="color:var(--cb)">${fmtC(c.val)}</span></div>`).join(''):'<div class="mu" style="font-size:11px">لا شركات ضمن أكبر المراكز</div>'}
  </div></div>`);
}
function openCat(k){
  const T=totals();let items=[];
  if(k==='Stock'||k==='Gold') items=POS.filter(p=>p.t===k).map(p=>({n:p.n,s:p.full,v:p.val,c:p.cost,on:`openAsset('${p.n}')`}));
  if(k==='Property') items=PROP.filter(p=>assetVisible(p.n)).map(p=>({n:p.n,s:'قيمة سوقية مدخلة',v:p.val,c:p.cost}));
  if(k==='Cash') items=CASH.map((c,i)=>({n:c.n,s:'عملة الحساب '+c.c,v:c.bal,c:c.bal,on:`openTxForm('c:${i}',null,'Deposit')`})).filter(c=>assetVisible(c.n));
  if(k==='Other') items=OTHER.map(o=>({n:o.n,s:o.inc===false?'غير مُدرج بالثروة':'مُدرج بالثروة',v:o.v,c:o.v}));
  const d=k==='Other'?{cur:T.other,cost:T.other}:T.by[k],g=catGoals[k],p=d.cur-d.cost;
  openHolo(`<div class="mh"><div><div class="code">CATEGORY · ${k.toUpperCase()}</div><h2>${KLF[k]}</h2><div class="full">${items.length} أصل</div></div>
    <div class="px"><div class="mu" style="font-size:10px">القيمة الحالية</div><b class="n">${fmtC(d.cur)}</b><div>${Math.abs(p)>1?pnlTxt(p,d.cost):''}</div></div></div>
  <div class="kg">${cell('المستثمر',fmtC(d.cost))}${cell('من الثروة',fmt(d.cur/T.total*100,1)+'%')}${cell('هدف الفئة',g?fmtC(g):'—')}${cell('تقدّم الهدف',g?fmt(d.cur/g*100,0)+'%':'—','up')}</div>
  <div class="sect"><i class="ti ti-list"></i> الأصول</div>
  <div class="factions" style="margin:0 0 6px">${k==='Cash'?`<button class="fbtn sm ghost" onclick="openTxForm('c:0',null,'Deposit')">إيداع</button><button class="fbtn sm ghost" onclick="openTxForm('c:0',null,'Withdraw')">سحب</button><button class="fbtn sm ghost" onclick="openTxForm('c:0',null,'Transfer')">تحويل</button>`:k==='Other'?`<button class="fbtn sm ghost" onclick="openSettings('assets','other')">إدارة المصادر الأخرى</button>`:k==='Property'?`<button class="fbtn sm ghost" onclick="openTxForm('p:0',null,'Buy')">حركة على الأملاك</button><button class="fbtn sm ghost" onclick="openSettings('assets')">تحديث القيمة السوقية</button>`:`<button class="fbtn sm ghost" onclick="openTxForm(null,null,'Buy')">حركة جديدة</button>`}</div>
  ${items.map(i=>`<div class="row ${i.on?'clk':''}" ${i.on?`onclick="${i.on}"`:''}><div class="nm"><div class="t">${i.n}</div><div class="s">${i.s}</div></div><div class="vl"><span class="n" style="color:var(--cb)">${fmtC(i.v)}</span>${Math.abs(i.v-i.c)>1?pnlTxt(i.v-i.c,i.c):''}</div>${i.on?'<i class="ti ti-chevron-left chev"></i>':''}</div>`).join('')}`);
}
function openGoals(){
 const T=totals(),categories=goalCategories().filter(k=>catGoals[k]>0),done=categories.filter(k=>T.by[k]?.cur>=catGoals[k]).length;
 openHolo(`<div class="goals-dialog">${modalHead('RETIREMENT TARGET','هدف التقاعد')}<div class="kg2">${cell('الثروة',fmtC(T.total))}${cell('الهدف',fmtC(T.goal))}${cell('المتبقي',fmtC(Math.max(0,T.goal-T.total)))}${cell('فئات مكتملة',categories.length?done+' / '+categories.length:'—')}</div><div class="goals-dialog-layout"><section><div class="sect">التقدم حسب الفئة</div>${$('goals').innerHTML}</section><section><div class="sect">متى تصل هدفك؟</div>${$('pj').innerHTML}</section></div></div>`);
}


function renderFx(){renderMarketTicker('fx');if(ambOn)renderMarketTicker('ambTick');}
const tk=()=>$('clock').textContent=new Date().toTimeString().slice(0,8);tk();setInterval(tk,1000);
document.querySelectorAll('#curSeg button').forEach(b=>b.onclick=()=>stCur(b.dataset.c));

function renderAll(){build();renderHero();renderPf();renderMkt();renderNews();renderXrHud();renderTx();renderGoals();renderLab();}


function boot(){
 const steps=[['الاتصال بقاعدة البيانات',S.status.demo?'DEMO':S.loaded?'OK':'غير متاح'],['تحميل الحركات',S.TXNS.length+S.CTX.length+' TXN'],['تحميل الأصول',S.registry.length+' ASSET'],['الأسعار',POS.filter(p=>p.p!=null).length+' QUOTE'],['أسعار الصرف',Object.keys(FX).length+' FX'],['تحليل X-RAY',Object.keys(S.XR.countries).length+' COUNTRY'],['FIFO والأهداف','READY']];
 const duration=ST.reduce?500:2600;$('bFill').style.width='0%';$('bPct').textContent='0%';$('bMsg').textContent='تهيئة مساحة العمل';
 steps.forEach(([label,value],i)=>setTimeout(()=>{if(!$('boot'))return;const row=document.createElement('div');row.innerHTML='<span>'+label+'</span><b>'+value+'</b>';$('bLog').append(row);const pct=Math.round((i+1)/steps.length*100);$('bFill').style.width=pct+'%';$('bPct').textContent=pct+'%';$('bMsg').textContent=i===steps.length-1?(S.loaded?'النظام جاهز':'تعذّر تحميل المحفظة'):label;},(i+1)*duration/(steps.length+1)));
 window._skip=__forceOpen;setTimeout(__forceOpen,duration);
}
let __revealed=false;
function reveal(){
  if(__revealed)return;__revealed=true;
  document.body.classList.remove('booting');
  const top=document.querySelector('.top');top.classList.add('rv');
  // الترتيب: الثروة ← الكرة ← الجوانب ← الأسفل
  const order=[...document.querySelectorAll('.center .p'),...document.querySelectorAll('.grid>.col:not(.center) .p'),...document.querySelectorAll('.bottom .p'),...document.querySelectorAll('.lab .p'),document.querySelector('.fab'),document.querySelector('.demo')];
  order.filter(Boolean).forEach((el,k)=>{el.style.animationDelay=(.15+k*.11)+'s';el.classList.add('rv');});
  setTimeout(()=>{renderAll();resize();if(ranked[0])setFocus(ranked[0][0]);requestAnimationFrame(draw);startLab();},250);
}


const ACT_AR={Buy:'شراء',Sell:'بيع',Deposit:'إيداع',Withdraw:'سحب',Transfer:'تحويل'};
const unitOf=c=>c==='GBp'?'GBp':c==='SARg'?'SAR/g':c;
const liveRate=c=>c==='GBp'?FX.GBP:(c==='SARg'||c==='SAR')?1:FX[c];
const rateLbl=c=>(c==='GBp'?'GBP':c)+'/SAR';
const n2s=(v,c,r)=>c==='GBp'?v/100*r:(c==='SARg'||c==='SAR')?v:v*r;
const s2n=(v,c,r)=>c==='GBp'?v/r*100:(c==='SARg'||c==='SAR')?v:v/r;
const natTot=(v,c)=>c==='GBp'?fmt(v/100,2)+' GBP':c==='SARg'?fmt(v,0)+' SAR':fmt(v,2)+' '+c;
const todayS=()=>new Date().toISOString().slice(0,10);
const ba=(o,n)=>`<span class="ba n"><span class="o">${o}</span><i>→</i><span>${n}</span></span>`;
function toast(msg,ic='ti-info-circle'){let t=$('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t);}
  t.innerHTML=`<i class="ti ${ic}"></i><span>${msg}</span>`;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2800);}
function reHolo(html){const h=$('hb'),st=h.scrollTop;h.classList.add('still');h.innerHTML=html;h.scrollTop=st;moreHint();}


function fifoLots(name,excl=-1){const f=ENGINE.fifo(name,TXNS[excl]?.[8]?.id);return f.queue.map(l=>({qty:l.qty,p:l.priceSAR,d:'FIFO'}));}



const REG_X={};
const KIND_ORDER=['Stock','Gold','Property','Cash'];
const KIND_AR={Stock:'أسهم وصناديق',Gold:'ذهب',Property:'أملاك',Cash:'حسابات نقدية'};
const ACT_KIND={Buy:['Stock','Gold','Property'],Sell:['Stock','Gold','Property'],Deposit:['Cash'],Withdraw:['Cash'],Transfer:['Cash']};
const ACT_IC={Buy:'ti-arrow-down-left',Sell:'ti-arrow-up-right',Deposit:'ti-download',Withdraw:'ti-upload',Transfer:'ti-arrows-exchange'};
let CTX=[];                       // حركات الحسابات النقدية (إيداع، سحب، تحويل، والخصم التلقائي)
let RECENT=[];
const metaOf=id=>id.startsWith('a:')?AS[id.slice(2)]:id.startsWith('x:')?REG_X[id.slice(2)]:null;
function regAll(){const L=[];Object.entries(AS).filter(([,a])=>['Stock','Gold'].includes(a.t)).forEach(([n,a])=>{const p=S.POS.find(x=>x.n===n);L.push({id:'a:'+n,n,full:a.full,k:a.t,cur:a.cur,q:p?.qty||0,v:p?.val||0});});PROP.forEach((p,i)=>L.push({id:'p:'+i,n:p.n,full:'أملاك',k:'Property',cur:p.c||'SAR',v:p.val}));CASH.forEach((c,i)=>L.push({id:'c:'+i,n:c.n,full:'حساب نقدي',k:'Cash',cur:c.c,v:c.bal}));return L;}
const regGet=id=>regAll().find(r=>r.id===id);
const accBal=i=>CASH[i].bal/liveRate(CASH[i].c);                     // رصيد الحساب بعملته
const holdTxt=r=>r.x?'—':r.k==='Stock'?fmt(r.q,0):r.k==='Gold'?fmt(r.q,1)+' g':r.k==='Cash'?natTot(r.v/liveRate(r.cur),r.cur):fmtC(r.v);
const accOpts=(sel,skip)=>CASH.map((c,i)=>i===skip?'':`<option value="${i}" ${i===sel?'selected':''}>${c.n} · ${natTot(accBal(i),c.c)}</option>`).join('');


let TF={};
function openTxForm(a,idx,act){const e=idx!=null?TXNS[idx]:null;let r=e?regAll().find(r=>r.n===e[1]):regAll().find(r=>r.id===a||r.n===a);act=e?.[2]||act||(r?.k==='Cash'?'Deposit':'Buy');r??=regAll().find(r=>ACT_KIND[act].includes(r.k));if(!r){toast('أضف أصلاً أو حساباً أولاً','ti-info-circle');return openSettings('assets');}TF={id:r.id,act,edit:e?idx:null,expected:e?JSON.stringify(ENGINE.rawTxn(e[8].id)):null,ok:false,open:false,grp:'all',fund:e?.[7]!=null&&e[7]>=0,acc:e?.[7]??0,to:1};activeDialog=null;openHolo(`<div class="transaction-dialog">${txFormHTML(e)}</div>`);if(!e){const income=document.createElement('button');income.type='button';income.innerHTML='<i class="ti ti-coins"></i> توزيعات';income.onclick=()=>openDividendForm(regGet(TF.id)?.k==='Stock'?regGet(TF.id).n:null);$('tfAct').insertBefore(income,$('tfAct').children[2]);}const fee=document.createElement('label');fee.className='ff';fee.innerHTML='<span>الرسوم بعملة الأصل</span><input class="fi num" id="tfFees" inputmode="decimal" value="0" oninput="tfCalc()">';$('tfN').parentElement.before(fee);tfSetRate();if(e){$('tfQ').value=e[3];$('tfP').value=e[4];$('tfR').value=r.cur==='GBp'?e[5]*100:e[5];$('tfFees').value=e[8].fees||0;if(r.k==='Property')$('tfAmt').value=e[3]*e[4];}tfSync();}
const fmtR=r=>+r.toFixed(4);
function txFormHTML(e){
  const acts=e?['Buy','Sell']:['Buy','Sell','Deposit','Withdraw','Transfer'];
  return `<div class="mh"><div><div class="code">${e?'EDIT TRANSACTION':'NEW TRANSACTION'}</div><h2>${e?'تعديل حركة':'حركة جديدة'}</h2><div class="full">راجع تفاصيل الحركة وتأثيرها على رصيدك قبل الحفظ</div></div>
    <div class="px"><div class="mu" style="font-size:10px" id="tfNowL">السعر الحالي</div><b class="n" id="tfNow" style="font-size:24px"></b><div id="tfChg"></div></div></div>
  <div class="mg">
    <div>
      <div class="ff"><span>نوع الحركة</span><div class="fseg" id="tfAct">${acts.map(k=>`<button data-k="${k}" onclick="tfAct('${k}')"><i class="ti ${ACT_IC[k]}"></i> ${ACT_AR[k]}</button>`).join('')}</div></div>
      <div class="ff" style="margin-top:12px"><span><span id="tfPickL">الأصل</span><a class="clk" style="color:var(--c)" onclick="openSettings('assets')">إدارة الأصول</a></span>
        <button class="apick" id="tfPick" onclick="tfPickToggle()" ${e?'disabled':''}></button>
        <div class="apanel" id="tfPanel" style="display:none">
          <input class="fi" id="tfSearch" placeholder="ابحث بالاسم أو الرمز" oninput="tfPickRender()" autocomplete="off">
          <div class="fseg sm" id="tfGrp" style="margin-top:8px"></div>
          <div class="alist" id="tfList"></div>
        </div>
        <div class="recent" id="tfRecent"></div></div>
      <div class="fgrid" style="margin-top:12px">
        <div class="ff"><span>التاريخ</span><input class="fi num" type="date" id="tfD" value="${e?e[0]:todayS()}" oninput="tfCalc()"></div>
        <div class="ff" id="tfQW"><span>الكمية<em id="tfQU"></em></span><div class="iw"><input class="fi num" id="tfQ" inputmode="decimal" placeholder="0" oninput="tfCalc()"><button id="tfMax" onclick="tfMax()">كل الرصيد</button></div></div>
        <div class="ff" id="tfPW"><span>سعر الوحدة<em id="tfPU"></em></span><div class="iw"><input class="fi num" id="tfP" inputmode="decimal" placeholder="0" oninput="tfCalc()"><button onclick="tfNowP()">السعر الحالي</button></div></div>
        <div class="ff" id="tfAW"><span id="tfAL">المبلغ<em id="tfAU"></em></span><div class="iw"><input class="fi num" id="tfAmt" inputmode="decimal" placeholder="0" oninput="tfCalc()"><button id="tfAMax" onclick="tfAMax()">كل الرصيد</button></div></div>
        <div class="ff" id="tfToW"><span>إلى حساب</span><select class="fi" id="tfTo" onchange="TF.to=+this.value;tfCalc()"></select></div>
        <div class="ff" id="tfRW"><span>سعر الصرف المسجّل<em id="tfRU"></em></span><div class="iw"><input class="fi num" id="tfR" inputmode="decimal" oninput="tfCalc()"><button onclick="tfSetRate();tfCalc()">الحالي</button></div></div>
        <div class="ff full"><span>ملاحظة (اختياري)</span><input class="fi" id="tfN" value="${e&&e[6]?e[6]:''}" placeholder="مثال: الراتب، إعادة توازن"></div>
      </div>
      <div class="fund" id="tfFundW"><div class="fh"><button class="tgl" id="tfFT" onclick="TF.fund=!TF.fund;tfSync()"></button><span id="tfFL"></span></div>
        <div id="tfAccW" style="margin-top:8px"><select class="fi" id="tfAcc" onchange="TF.acc=+this.value;tfCalc()"></select></div></div>
      <div id="tfMsg"></div>
    </div>
    <div>
      <div class="prev" id="tfPrev"></div>
      <div class="factions">
        <button class="fbtn" id="tfSave" onclick="tfSave()"><i class="ti ti-check"></i> <span id="tfSaveL"></span></button>
        ${e?`<button class="fbtn wr" onclick="tfDel()"><i class="ti ti-trash"></i> حذف</button>`:''}
      </div>
    </div>
  </div>`;
}
function tfRateCur(){const r=regGet(TF.id);return r.cur;}
function tfSetRate(){const c=tfRateCur();$('tfR').value=fmtR(liveRate(c));}
function tfAct(k){TF.act=k;const r=regGet(TF.id);
  if(!ACT_KIND[k].includes(r.k)){TF.id=RECENT.find(x=>regGet(x)&&ACT_KIND[k].includes(regGet(x).k))||regAll().find(x=>ACT_KIND[k].includes(x.k)).id;tfSetRate();}
  TF.grp='all';if(TF.open)tfPickRender();tfSync();}
function tfPick(id){TF.id=id;TF.open=false;$('tfPanel').style.display='none';$('tfPick').classList.remove('open');RECENT=[id,...RECENT.filter(x=>x!==id)].slice(0,6);
  ['tfQ','tfP','tfAmt'].forEach(i=>$(i).value='');tfSetRate();tfSync();}
function tfPickToggle(){TF.open=!TF.open;$('tfPanel').style.display=TF.open?'':'none';$('tfPick').classList.toggle('open',TF.open);
  if(TF.open){$('tfSearch').value='';tfPickRender();if(matchMedia('(pointer:fine)').matches)$('tfSearch').focus();}moreHint();}
function tfPickRender(){
  const q=$('tfSearch').value.trim().toLowerCase(),allowed=ACT_KIND[TF.act];
  const kinds=KIND_ORDER.filter(k=>allowed.includes(k));
  $('tfGrp').style.display=kinds.length>1?'':'none';
  $('tfGrp').innerHTML=[['all','الكل'],...kinds.map(k=>[k,KIND_AR[k]])].map(([k,l])=>`<button class="${TF.grp===k?'on':''}" onclick="TF.grp='${k}';tfPickRender()">${l}</button>`).join('');
  const L=regAll().filter(r=>allowed.includes(r.k)&&(TF.grp==='all'||r.k===TF.grp)&&(!q||(r.n+' '+r.full+' '+((metaOf(r.id)||{}).yh||'')).toLowerCase().includes(q)));
  let h='';kinds.forEach(k=>{const g=L.filter(r=>r.k===k);if(!g.length)return;
    h+=`<div class="agh">${KIND_AR[k]}<span class="n">${g.length}</span></div>`+g.map(r=>`<button class="arow ${r.id===TF.id?'on':''}" onclick="tfPick('${r.id}')"><div class="nm"><b>${r.n}</b><small>${r.full}</small></div><span class="hv n">${holdTxt(r)}</span><span class="un n">${unitOf(r.cur)}</span></button>`).join('');});
  const nk=allowed.includes('Cash')?null:(TF.grp==='Property'?'Property':TF.grp==='Gold'?'Gold':'Stock');
  $('tfList').innerHTML=(h||'<div class="mu" style="font-size:11px;padding:14px;text-align:center">لا نتائج</div>')+(nk?`<button class="arow" style="color:var(--c);justify-content:center" onclick="ST._newT='${nk}';openSettings('assets','new')"><i class="ti ti-plus"></i> أصل جديد${nk==='Property'?' (أملاك)':''}</button>`:`<button class="arow" style="color:var(--c);justify-content:center" onclick="openSettings('assets')"><i class="ti ti-plus"></i> حساب نقدي جديد</button>`);}
function tfSync(){
  const r=regGet(TF.id),m=metaOf(TF.id),k=r.k,cash=k==='Cash',amtMode=k==='Cash'||k==='Property',tr=TF.act==='Transfer';
  document.querySelectorAll('#tfAct button').forEach(b=>b.classList.toggle('on',b.dataset.k===TF.act));
  $('tfAct').classList.toggle('sell',['Sell','Withdraw'].includes(TF.act));
  $('tfPickL').textContent=cash?(tr?'من حساب':'الحساب'):'الأصل';
  $('tfPick').innerHTML=`<div class="nm"><b>${r.n}</b><small>${KIND_AR[k]} · ${r.full}</small></div><span class="hv n">${holdTxt(r)}</span><span class="un n">${unitOf(r.cur)}</span><i class="ti ti-chevron-down chev"></i>`;
  const rec=RECENT.filter(x=>x!==TF.id&&regGet(x)&&ACT_KIND[TF.act].includes(regGet(x).k)).slice(0,4);
  $('tfRecent').innerHTML=TF.edit!=null||!rec.length?'':`<span class="mu">آخر استخدام:</span>`+rec.map(x=>`<button onclick="tfPick('${x}')">${regGet(x).n}</button>`).join('');
  $('tfQW').style.display=amtMode?'none':'';$('tfPW').style.display=amtMode?'none':'';$('tfAW').style.display=amtMode?'':'none';
  $('tfAL').firstChild.textContent=k==='Property'?(TF.act==='Buy'?'مبلغ الشراء':'مبلغ البيع'):'المبلغ';
  $('tfAU').textContent=unitOf(r.cur);
  $('tfAMax').style.display=cash&&TF.act!=='Deposit'?'':'none';
  $('tfToW').style.display=tr?'':'none';
  if(tr){const fi=+TF.id.slice(2);if(TF.to===fi)TF.to=CASH.findIndex((_,i)=>i!==fi);$('tfTo').innerHTML=accOpts(TF.to,fi);}
  $('tfQU').textContent=k==='Gold'?'g':'units';$('tfPU').textContent=unitOf(r.cur);$('tfRU').textContent=rateLbl(r.cur);
  $('tfRW').style.display=(r.cur==='SARg'||r.cur==='SAR')?'none':'';
  $('tfMax').style.display=TF.act==='Sell'?'':'none';
  // الخصم / الإيداع التلقائي
  const fundable=['Buy','Sell'].includes(TF.act);$('tfFundW').style.display=fundable?'':'none';
  $('tfFT').classList.toggle('on',TF.fund);$('tfAccW').style.display=TF.fund?'':'none';
  $('tfFL').textContent=TF.act==='Buy'?'خصم المبلغ تلقائياً من حساب':'إيداع العائد تلقائياً في حساب';
  $('tfAcc').innerHTML=accOpts(TF.acc);
  if(cash){$('tfNowL').textContent='الرصيد الحالي';$('tfNow').textContent=natTot(accBal(+TF.id.slice(2)),r.cur);$('tfChg').innerHTML='';}
  else if(k==='Property'){$('tfNowL').textContent='القيمة الحالية';$('tfNow').textContent=fmtC(r.v);$('tfChg').innerHTML='';}
  else{$('tfNowL').textContent='السعر الحالي';$('tfNow').textContent=natFmt(m.p,m.cur);$('tfChg').innerHTML=`<span class="pill ${m.chg>=0?'up':'dn'}">${m.chg>=0?'▲ +':'▼ '}${fmt(Math.abs(m.chg),2)}%</span>`;}
  tfCalc();
}
function tfNowP(){$('tfP').value=metaOf(TF.id).p;tfCalc();}
function tfMax(){const h=TF.id.startsWith('a:')?fifoLots(TF.id.slice(2),TF.edit??-1).reduce((s,l)=>s+l.qty,0):0;$('tfQ').value=+h.toFixed(4);tfCalc();}
function tfAMax(){$('tfAmt').value=+accBal(+TF.id.slice(2)).toFixed(2);tfCalc();}

function tfCalc(){if(!$('tfSave'))return;TF.ok=false;try{if(TF.stale)throw Error('تغيّرت الحركة؛ أعد فتحها');const p=ENGINE.preview(txInput());TF.ok=true;$('tfMsg').textContent='';$('tfPrev').innerHTML='<div class="pt">IMPACT PREVIEW · FIFO</div><div class="kg2">'+cell('الإجمالي',fmtC(p.total))+cell('الكمية قبل',fmt(p.before.netQty,4))+cell('الكمية بعد',fmt(p.after.netQty,4))+cell('متوسط التكلفة بعد',fmtC(p.after.avgCostSAR))+(p.sell?cell('ربح محقق',fmtC(p.sell.pnl))+cell('تكلفة البيع',fmtC(p.sell.costBasis)):'')+'</div>'+p.balances.map(b=>`<div class="sect">${b.name}</div><div class="kg2">${cell('قبل',fmtC(b.before))}${cell('بعد',fmtC(b.after),b.after<0?'dn':'')}</div>`).join('')+(p.used.length?'<div class="sect">الدفعات المستهلكة FIFO</div>'+p.used.map(l=>`<div class="row"><span>${fmt(l.qty,4)}</span><span class="n">${fmtC(l.priceSAR)} / وحدة</span></div>`).join(''):'');}catch(e){$('tfPrev').innerHTML=tfCurrentPreview();const empty=!+$('tfQ').value&&!+$('tfAmt').value&&!TF.stale;$('tfMsg').innerHTML=empty?'':'<div class="fmsg wr">'+esc(e.message)+'</div>';}$('tfSave').disabled=!TF.ok;$('tfSaveL').textContent=TF.edit!=null||TF.cashEdit?'حفظ التعديل':'حفظ الحركة';}
async function tfSave(){if(!TF.ok)return;const b=$('tfSave');b.disabled=true;try{await safeAction(()=>ENGINE.save(txInput()));closeHolo();syncSnapshot();toast('تم حفظ الحركة','ti-check');}catch{}finally{if(b.isConnected)b.disabled=false;}}
function tfDel(){const t=TXNS[TF.edit];if(t)return deleteMovement(t[8].id);}


const ZK={hawl:S.zakat.hawl?.dueStr||'',cal:'hijri',margin:0};
function coZR(){return null;} // نسبة تجريبية ثابتة لكل رمز
const coSrc=tk=>'غير متاح';
function zkCalc(){return S.zakat;}
function openZakat(){openHolo(zakatHTML());}

function zakatHTML(){
 const Z=S.zakat,H=Z.hawl,progress=H?Math.max(0,Math.min(1,H.elapsed/H.days)):0,R=46,C=2*Math.PI*R;
 const groups=['Cash','Gold','Stock','Property','Other'].map(type=>({type,rows:Z.rows.filter(r=>r.type===type)})).map(g=>({...g,val:g.rows.reduce((s,r)=>s+r.val,0),inc:g.rows.reduce((s,r)=>s+r.zVal,0)}));
 const desc={Cash:'الرصيد الزكوي في جميع الحسابات',Gold:'حسب معالجة كل أصل وقيمته الحالية',Stock:'القيمة × نسبة الأصول الزكوية لكل مركز',Property:'حسب الغرض والمعالجة المحددة لكل ملك',Other:'حسب نوع المصدر ومعالجته في حساب الزكاة'};
 const step=(g,i)=>`<div class="zstep ${!g.inc?'ex':''}"><div class="k">${i+1}</div><div><div class="t">${KLF[g.type]}</div><div class="s">${desc[g.type]}</div></div><div class="vv"><span class="n">${fmtC(g.inc)}</span>${g.val!==g.inc?`<span class="n mu">${fmtC(g.val)}</span>`:''}</div></div>`;
 const funds=Z.rows.filter(r=>r.type==='Stock');
 const treatment=type=>{const rows=Z.rows.filter(r=>r.type===type);return rows.length&&rows.every(r=>r.treat==='exempt')?'exempt':rows.length&&rows.every(r=>r.treat==='full')?'full':'mixed';};
 return `<div class="zakat-reference"><div class="mh"><div><div class="code">ZAKAT · ${fmt(Z.rate*100,4)}%</div><h2>الزكاة</h2><div class="full">من حسابات محفظتك، حتى تاريخ الحول</div></div><div class="px"><div class="mu">الزكاة المحسوبة</div><b class="n">${Z.nisab>0?fmtC(Z.due):'النصاب غير متاح'}</b><div class="pill ${Z.reached?'up':'mu'}">${Z.nisab>0?Z.reached?'▲ فوق النصاب':'دون النصاب':'حدّث سعر الذهب أو الفضة'}</div></div></div>
 <div class="kg">${cell('الوعاء بعد الديون',fmtC(Z.net),'up')}${cell(Z.opt.nisabBase==='silver'?'النصاب · الفضة':'النصاب · الذهب',Z.nisab>0?fmtC(Z.nisab):'غير متاح')}${cell('نسبة الزكاة',fmt(Z.rate*100,4)+'%')}${cell('الحول القادم',H?.dueStr||'غير محدد')}</div>
 <div class="mg"><div><div class="sect"><i class="ti ti-list-numbers"></i> ورقة الحساب</div>${groups.map(step).join('')}${Z.debts?`<div class="zstep"><div class="k">−</div><div><div class="t">الديون</div></div><div class="vv n">${fmtC(Z.debts)}</div></div>`:''}<div class="zstep tot"><div class="k">Σ</div><div><div class="t">الصافي × النسبة</div><div class="s n">${fmtC(Z.net)} × ${fmt(Z.rate*100,4)}%</div></div><div class="vv n">${Z.nisab>0?fmtC(Z.due):'غير متاح'}</div></div>
 <div class="sect"><i class="ti ti-microscope"></i> نسبة كل صندوق وسهم</div>${funds.map(r=>{const i=Z.rows.indexOf(r);return `<details class="zf"><summary><i class="ti ti-chevron-left chev"></i><b>${esc(r.name)}</b><span class="n mu">${fmtC(r.val)}</span><span class="n">${fmt(r.ratio*100,1)}%</span></summary><div class="in"><p class="sub">${esc(r.src)}${r.fund?' · تغطية '+fmt(r.fund.sumW,1)+'% · المتبقي '+fmt(r.fund.rest,1)+'%':''}</p>${r.fund?`<div class="z-company-list">${r.fund.top.map(c=>`<div class="row"><span class="nm">${esc(c.name||c.ticker)}</span><span class="n mu">${fmt(c.w,1)}%</span><span class="n">${c.missing?'100% احتياطي':fmt(c.fin*100,1)+'%'}</span></div>`).join('')}</div>`:''}<button class="fbtn sm ghost" onclick="openZakatBreakdown(${i})">تفاصيل الاحتساب</button></div></details>`;}).join('')||'<div class="empty">لا مراكز أسهم مسجلة</div>'}</div>
 <aside><div class="sect"><i class="ti ti-hourglass"></i> الحول</div><div class="z-hawl"><svg viewBox="0 0 110 110" width="110" height="110"><circle cx="55" cy="55" r="${R}" fill="none" stroke="rgba(79,216,255,.1)" stroke-width="6"/><circle cx="55" cy="55" r="${R}" fill="none" stroke="#4fd8ff" stroke-width="6" stroke-dasharray="${C*progress} ${C}" transform="rotate(-90 55 55)" style="filter:drop-shadow(0 0 6px #4fd8ff)"/><text x="55" y="56" text-anchor="middle" direction="ltr" fill="#fff" font-weight="700" font-size="26">${H?Math.max(0,H.remaining):'—'}</text><text x="55" y="74" text-anchor="middle" fill="#7394a3" font-size="9">يوم متبقٍ</text></svg><div><div class="mu">تاريخ الحول</div><b class="n">${H?.dueStr||'غير محدد'}</b><div class="mu">مضى من الحول</div><span class="n">${fmt(progress*100,0)}%</span></div></div>
 <div class="sect"><i class="ti ti-chart-donut"></i> تكوين الوعاء</div>${groups.filter(g=>g.inc>0).map(g=>`<div class="hb2"><span class="k">${KLF[g.type]}</span><span class="b"><i style="width:${percent(g.inc,Z.pool)}%"></i></span><span class="v n">${fmt(percent(g.inc,Z.pool),1)}%</span></div>`).join('')}
 <div class="sect"><i class="ti ti-adjustments"></i> إعدادات الحساب</div><div class="z-calendar-note">الحول القمري · ${H?.days||354} يوم</div>
 ${[['Gold','الذهب',[['full','للاستثمار'],['exempt','حُلي للاستعمال']]],['Property','الأملاك',[['exempt','للاقتناء'],['full','للتجارة']]]].map(([type,label,opts])=>`<div class="ff z-treatment"><span>${label}${treatment(type)==='mixed'?' · معالجة فردية':''}</span><div class="fseg sm">${opts.map(([v,l])=>`<button class="${treatment(type)===v?'on':''}" onclick="setZakatGroup('${type}','${v}')">${l}</button>`).join('')}</div></div>`).join('')}
 <div class="fgrid"><label class="ff">هامش الاحتياط (%)<input class="fi num" type="number" min="0" max="100" value="${Z.opt.margin||0}" onchange="saveZakatOption('margin',+this.value)"></label><label class="ff">بداية الحول<input class="fi num" type="date" value="${Z.opt.hawlStart||''}" onchange="saveZakatOption('hawlStart',this.value)"></label></div>
 <details class="z-advanced"><summary>المعالجة الفردية والإعدادات التفصيلية</summary>${zakatOptionsHTML()}</details><div class="fmsg"><i class="ti ti-info-circle"></i><span>البيانات الناقصة تُحتسب بالنسبة الاحتياطية حسب إعداداتك. الحول والمعالجة محفوظان في محفظتك.</span></div><div class="factions"><button class="fbtn" onclick="ENGINE.printZakat()"><i class="ti ti-printer"></i>تقرير للطباعة</button>${zakatRefreshControl()}</div></aside></div></div>`;
}



const ST=Object.assign({idle:1,spin:'n',translate:false,reduce:false,burn:true,evMin:.5,evOn:{},events:[],links:{},holdAt:{},holdN:{},alerts:[],home:{n:'الخبر',cc:'SA',lon:50.1,lat:26.43}},S.cc);
let DELETED=[];
let stTab='general',stNewAsset=false;
const ST_TABS=[['general','عام','ti-adjustments-horizontal'],['assets','الأصول والحسابات','ti-briefcase'],['alerts','التنبيهات','ti-bell'],['events','التقويم','ti-calendar-event'],['data','البيانات والمصادر','ti-database'],['display','الواجهة','ti-device-desktop']];
function openSettings(tab,arg){stTab=tab||'general';activeDialog={fn:'openSettings',args:[stTab]};ST._pre=arg||null;openHolo(`<div class="settings-dialog">${modalHead('SYSTEM CONFIGURATION','الإعدادات','محفظتك، على طريقتك')}<div class="settings-layout"><nav class="stabs">${ST_TABS.map(([k,l,i])=>`<button data-t="${k}" class="${stTab===k?'on':''}" onclick="stGo('${k}')"><i class="ti ${i}"></i>${l}</button>`).join('')}</nav><div id="stBody">${stBody()}</div></div></div>`);if(arg==='new')$('registryAdd')?.setAttribute('open','');if(arg==='other')$('stOther')?.scrollIntoView({block:'start'});}
function stGo(t){
 stTab=t;activeDialog={fn:'openSettings',args:[t]};
 document.querySelectorAll('.stabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
 const b=$('stBody');b.style.animation='none';void b.offsetHeight;b.style.animation='';
 const html=stBody();b.innerHTML=html;b._settingsHTML=html;$('hb').scrollTop=0;moreHint();
}
function stRefresh(){
 const b=$('stBody'),h=$('hb');if(!b||!h)return;
 activeDialog={fn:'openSettings',args:[stTab]};const html=stBody();if(b._settingsHTML===html)return;
 const scroll=h.scrollTop,bodyScroll=b.scrollTop,focused=document.activeElement?.id;
 const details=[...b.querySelectorAll('details')].map((el,i)=>({id:el.id,index:i,open:el.open}));
 b.innerHTML=html;b._settingsHTML=html;
 const next=[...b.querySelectorAll('details')];for(const d of details){const el=d.id?next.find(el=>el.id===d.id):next[d.index];if(el)el.open=d.open;}
 if(focused){const el=document.getElementById(focused);if(el&&b.contains(el))el.focus({preventScroll:true});}
 h.scrollTop=scroll;b.scrollTop=bodyScroll;moreHint();
}
const srow=(t,s,ctl)=>`<div class="srow"><div class="nm"><div class="t">${t}</div>${s?`<div class="s">${s}</div>`:''}</div>${ctl}</div>`;
const tgl=(on,fn)=>`<button class="tgl ${on?'on':''}" onclick="${fn}"></button>`;
const sseg=(opts,cur,fn)=>`<div class="fseg sm">${opts.map(([k,l])=>`<button class="${cur===k?'on':''}" onclick="${fn}('${k}')">${l}</button>`).join('')}</div>`;
const EV_SRC=[['earn','نتائج','نتائج أسهمك المباشرة، وأكبر الشركات داخل صناديقك فوق حد التأثير','FMP'],['div','توزيعات','الموعد المتوقع من نمط التوزيعات السابقة','Yahoo'],['macro','اقتصاد','الفيدرالي والتضخم والتوظيف والنمو','Fed · BLS · BEA'],['idx','مؤشرات','مراجعات MSCI من ملف المواعيد الرسمي','MSCI'],['zakat','زكاة','من تاريخ الحول بإعدادات الزكاة','محسوب'],['goal','أهداف','توقع بلوغ الأهداف بعائد <span class="n">7%</span> ومتوسط ادخارك','محسوب']];
function stBody(){
 if(stTab==='general')return srow('عملة العرض','الأرقام الأصلية محفوظة بالريال',sseg([['SAR','SAR'],['JOD','JOD'],['USD','USD']],baseCur,'stCur'))+`<div class="fgrid"><label class="ff">هدف التقاعد (${baseCur})<input class="fi" type="number" min="0" value="${toB(S.totals.goal)}" onchange="saveRetire(this.value)"></label>${Object.keys(catGoals).map(k=>`<label class="ff">${KLF[k]} (${baseCur})<input class="fi" type="number" min="0" value="${toB(catGoals[k])}" onchange="stGoal('${k}',this.value)"></label>`).join('')}</div>`;
 if(stTab==='display')return srow('العودة للتصميم السابق','متاح للمقارنة',`<button class="fbtn" onclick="ENGINE.legacy()">فتح</button>`)+srow('خطوط الربط على الخريطة','إظهار الخطوط بين موقعك والدول المستثمر فيها',tgl(ST.globeLinks!==false,"saveCC('globeLinks',ST.globeLinks===false)"))+srow('سرعة الكرة','درجة دوران في الثانية',sseg([['s','هادئة'],['n','عادية'],['f','سريعة']],ST.spin,'stSpin'))+srow('وضع العرض الهادئ','عدد الدقائق بدون تفاعل',`<select class="fi" onchange="stIdle(this.value)">${[0,1,3,5,10].map(v=>`<option value="${v}" ${ST.idle===v?'selected':''}>${v||'إيقاف'}</option>`).join('')}</select>`)+srow('تقليل الحركة','يقلل انتقالات الواجهة',tgl(ST.reduce,"saveCC('reduce',!ST.reduce)"))+stHomeHTML();
 if(stTab==='assets')return registrySettings();
 if(stTab==='alerts')return dividendAlertSettings()+ST.alerts.map((a,i)=>srow(a.a,(a.op==='ge'?'≥ ':'≤ ')+a.v,`<button class="fbtn wr" onclick="removeAlert(${i})">حذف</button>`)).join('')+`<div class="fgrid"><select id="alA" class="fi">${Object.keys(AS).map(n=>`<option>${n}</option>`).join('')}</select><select id="alO" class="fi"><option value="ge">أعلى أو يساوي</option><option value="le">أقل أو يساوي</option></select><input id="alV" class="fi" type="number" placeholder="السعر بعملة الأصل"></div><button class="fbtn" onclick="stAddAlert()">إضافة تنبيه</button>`;
 if(stTab==='events')return `<div class="empty">${sourceErrors.calendar?'بعض المصادر غير متاحة: '+esc(sourceErrors.calendar):'تظهر المواعيد المتاحة فقط. توقع الهدف تقديري.'}</div>`+(ST.events||[]).map((e,i)=>srow(esc(e.t),esc(e.d),`<button class="fbtn wr" onclick="removeEvent(${i})">حذف</button>`)).join('')+`<div class="fgrid"><input id="evD" class="fi" type="date"><input id="evT" class="fi" placeholder="الموعد"></div><button class="fbtn" onclick="stAddEvent()">إضافة موعد خاص</button>`;
 return `<div class="sect">التصدير</div><div class="factions"><button class="fbtn" onclick="stExport('xlsx')">Excel</button><button class="fbtn" onclick="stExport('csv')">CSV</button><button class="fbtn" onclick="stExport('json')">نسخة JSON</button><button class="fbtn" onclick="ENGINE.legacy();parent.document.getElementById('th-import').click()">استيراد Excel</button></div><div class="sect">مصادر مكوّنات الصناديق</div>`+Object.keys(XRAY_DATA).map(n=>srow(n,esc(S.composition[n]?.source||'البيانات الحالية'),`<button class="fbtn" onclick="stHold('${n}',this)">تحديث</button>`)).join('')+`<div class="sect">سلة المحذوفات</div>`+(DELETED.map((t,i)=>srow(t.assetName,t.date+' · '+t.action,`<button class="fbtn" onclick="stRestore(${i})">استرجاع</button>`)).join('')||'<p class="empty">فارغة</p>')+`<div class="sect">الحساب</div><p>المزامنة تلقائية كل بضع ثوانٍ. مفاتيح المصادر الخارجية تبقى على الخادم.</p><button class="fbtn wr" onclick="ENGINE.logout()">تسجيل الخروج</button>`;
}
async function stCur(c){await safeAction(()=>ENGINE.currency(c));syncSnapshot();if($('stBody'))stRefresh();if(!S.status.demo)await loadTickerQuotes();}
async function stGoal(k,v){const n=+v;if(!(n>=0))return;await safeAction(()=>ENGINE.setting('catGoals',{...catGoals,[k]:n*(FX[baseCur]||1)}));syncSnapshot();}
function stIdle(v){return saveCC('idle',+v);}
function stSpin(v){return saveCC('spin',v);}
async function stHold(n,b){b.disabled=true;try{await safeAction(()=>ENGINE.holdings(n));syncSnapshot();toast('اكتمل طلب تحديث المكوّنات','ti-check');}finally{b.disabled=false;}}

function stBell(){const b=$('bellBd'),unread=dividendReminderItems().filter(e=>!(S.cc.dividendSeen||[]).includes(e.id)).length;if(b){const count=ST.alerts.length+unread;b.textContent=count;b.style.display=count?'':'none';b.closest('button')?.setAttribute('aria-label','التنبيهات · '+count);}}
async function stAddAlert(){const a=$('alA').value,v=+$('alV').value,op=$('alO').value;if(!(v>0))return;const list=ST.alerts.map(x=>({id:x.id,assetName:ENGINE.original(x.a),dir:x.op==='ge'?'>=':'<=',price:x.v,triggered:x.triggered}));list.push({id:Date.now(),assetName:ENGINE.original(a),dir:op==='ge'?'>=':'<=',price:v,triggered:false});await safeAction(()=>ENGINE.setting('priceAlerts',list));syncSnapshot();stRefresh();}
function stAddEvent(){const d=$('evD').value,t=$('evT').value.trim();if(!d||!t)return;return saveCC('events',[...(ST.events||[]),{d,t:ENGINE.clean(t),c:'goal'}]);}
async function stRestore(i){await safeAction(()=>ENGINE.restore(DELETED[i].id));syncSnapshot();stRefresh();}
function stTest(){toast('المصادر تستخدم اتصال الخادم؛ غير المتاح يظهر بوضوح','ti-info-circle');}
function stExport(kind){return safeAction(()=>ENGINE.export(kind));}
document.addEventListener('keydown',e=>{if((e.key==='n'||e.key==='N'||e.key==='ى')&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!$('ov').classList.contains('open')&&!ambOn)openTxForm();});

function stEvMin(v){return saveCC('evMin',+v);}

async function stPropVal(i,v){const n=+v;if(n<0||!Number.isFinite(n))return;const p=PROP[i],raw=parent.commandStorage.raw(),old=JSON.parse(raw.settings.propVals||'{}');old[ENGINE.original(p.n)]={sar:n*liveRate(p.c)};await safeAction(()=>ENGINE.setting('propVals',old));syncSnapshot();}
async function stOtherAmt(i,v){if(!Number.isFinite(+v))return;const list=ENGINE.others();list[i].value=+v;await safeAction(()=>ENGINE.saveOthers(list));syncSnapshot();}
async function stAddOther(){const name=$('noN').value.trim(),value=+$('noV').value,currency=$('noC').value;if(!name||!Number.isFinite(value))return;await safeAction(()=>ENGINE.saveOthers([...ENGINE.others(),{id:Date.now(),name,value:value*liveRate(currency),type:'unrealized',included:true}]));syncSnapshot();stRefresh();}



// إعادة تشغيل FIFO لأصل واحد: لكل حركة شراء ما بقي منها، ولكل بيع الدفعات التي استهلكها
function fifoReplay(name){const raw=ENGINE.fifoReplay(name),out={};TXNS.forEach((t,i)=>{if(raw[t[8].id])out[i]=raw[t[8].id];});return out;}
const txNo=i=>'TX-'+String(i+1).padStart(4,'0');
function openTx(i){
 const t=TXNS[i];if(!t)return;const n=t[1],a=AS[n]||{},buy=t[2]==='Buy',raw=ENGINE.rawTxn(t[8].id),R=ENGINE.fifoReplay(n)[t[8].id]||{},b=R.before||{},cur=t[8].currency||a.cur,qu=4,u=a.t==='Gold'?' غ':'';
 const tot=txSAR(t),nowU=a.p!=null?toSAR(a.p,a.cur):null,tradeU=t[4]*(t[5]||1),quotedTrade=movementQuotePrice(t,a.cur),vsAvg=b.avg>0?(tradeU-b.avg)/b.avg*100:null,vsNow=a.p!=null&&quotedTrade>0?(a.p-quotedTrade)/quotedTrade*100:null;
 const signed=v=>v==null?'غير متاح':(v>=0?'+':'−')+fmtC(Math.abs(v));
 let body='';
 if(buy){const L=R.lot||{qty:0,orig:t[3],p:0},rem=L.qty,sold=t[3]-rem,val=nowU==null?null:rem*nowU,cost=rem*L.p,pnl=val==null?null:val-cost;
 body=`<div class="sect"><i class="ti ti-stack-2"></i> هذه الدفعة اليوم (FIFO)</div><div class="kg2">${cell('المتبقي منها',fmt(rem,qu)+u+` <span class="mu">من ${fmt(t[3],qu)}</span>`)}${cell('بِيع منها',fmt(sold,qu)+u)}${cell('قيمتها الآن',val==null?'غير متاح':fmtC(val),'up')}${cell('ربحها غير المحقق',pnl==null?'غير متاح':rem?signed(pnl)+(cost?' · '+fmt(pnl/cost*100,1)+'%':''):'—',pnl<0?'dn':'up')}</div>${sold>0?'<p class="tx-note">استُهلك جزء من الدفعة بعمليات بيع لاحقة، الأقدم أولاً.</p>':''}`;
 }else{body=`<div class="sect"><i class="ti ti-stack-2"></i> نتيجة البيع (FIFO)</div><div class="kg2">${cell('الربح المحقق',signed(R.pnl),R.pnl<0?'dn':'up')}${cell('النسبة',R.basis?fmt(R.pnl/R.basis*100,1)+'%':'—',R.pnl<0?'dn':'up')}${cell('تكلفة الكمية المباعة',fmtC(R.basis))}${cell('قيمة الكمية لو احتفظت بها',nowU==null?'غير متاح':fmtC(nowU*t[3]))}</div><div class="sect"><i class="ti ti-arrows-split"></i> الدفعات المستهلكة</div>${(R.used||[]).map(l=>`<div class="lot clk" onclick="openTx(${TXNS.findIndex(x=>String(x[8].id)===String(l.id))})"><span class="n">${esc(l.d)}</span><span class="n">${fmt(l.qty,4)} × ${fmtC(l.priceSAR)}</span></div>`).join('')}`;}
 const linked=CTX.findIndex(c=>String(c.id)===String(t[8].linkedTxnId)),account=t[7]!=null?CASH[t[7]]:null,range=a.hi>a.lo&&a.p!=null,rp=range?Math.max(0,Math.min(100,(quotedTrade-a.lo)/(a.hi-a.lo)*100)):0,mp=range?Math.max(0,Math.min(100,(a.p-a.lo)/(a.hi-a.lo)*100)):0;
 openHolo(`<div class="tx-detail"><div class="mh"><div><div class="code">TRANSACTION · ${esc(t[8].id)}</div><h2>${buy?'شراء':'بيع'} · ${esc(n)}</h2><div class="full">${esc(a.full||n)} · <span class="n">${esc(t[0])}</span></div></div><div class="px"><div class="mu">إجمالي الحركة المسجّل</div><b class="n">${fmtC(tot)}</b><div class="n mu">${natTot(t[3]*t[4],cur)}</div></div></div>
 <div class="kg">${cell('الكمية',fmt(t[3],qu)+u)}${cell('سعر الوحدة',natFmt(t[4],cur))}${cell('سعر الصرف المسجّل',fmt(t[5],4))}${cell('السعر اليوم',natFmt(a.p,a.cur),vsNow==null?'':vsNow<0?'dn':'up')}</div>
 <div class="mg"><div>${body}<div class="sect"><i class="ti ti-scale"></i> مقارنة</div>
 <div class="row"><div class="nm"><div class="t">مقابل متوسطك وقتها</div><div class="s">${b.avg>0?'متوسطك قبل الحركة '+fmtC(b.avg)+' للوحدة':'لا متوسط سابق'}</div></div>${vsAvg==null?'':`<span class="pill ${(buy?vsAvg<=0:vsAvg>=0)?'up':'dn'}">${vsAvg>=0?'+':''}${fmt(vsAvg,1)}%</span>`}</div>
 <div class="row"><div class="nm"><div class="t">السعر من وقتها لليوم</div><div class="s"><span class="n">${natFmt(quotedTrade,a.cur)} → ${natFmt(a.p,a.cur)}</span></div></div><span class="pill ${vsNow<0?'dn':'up'}">${vsNow==null?'غير متاح':(vsNow>=0?'▲ +':'▼ ')+fmt(Math.abs(vsNow),1)+'%'}</span></div>
 <div class="rng"><div class="tx-note">سعر الحركة ضمن نطاق 52 أسبوع الحالي · <span>■ سعر الحركة</span> · | اليوم</div><div class="bar2">${range?`<s style="right:${mp}%"></s><i style="right:${rp}%"></i>`:''}</div><div class="lb"><span class="n">${natFmt(a.lo,a.cur)}</span><span class="n">${natFmt(a.hi,a.cur)}</span></div></div>
 </div><aside><div class="sect"><i class="ti ti-building-bank"></i> الحساب المرتبط</div>${account?`<div class="row ${linked>=0?'clk':''}" ${linked>=0?`onclick="openCtx(${linked})"`:''}><div class="nm"><div class="t">${esc(account.n)}</div><div class="s">${buy?'خصم من الحساب':'إيداع في الحساب'}${linked>=0?' · فتح الحركة النقدية':''}</div></div>${linked>=0?'<i class="ti ti-chevron-left"></i>':''}</div>`:'<div class="tx-note">بدون حساب مرتبط</div>'}
 <div class="sect"><i class="ti ti-note"></i> ملاحظة</div><div class="tx-remarks">${esc(raw?.remarks||'—')}</div>
 <div class="sect"><i class="ti ti-info-circle"></i> السجل</div>${[['رقم الحركة',t[8].id],['التاريخ',t[0]],['الأصل',n+' · '+(a.yh||'—')],['عملة التنفيذ',cur],['الرسوم',natTot(t[8].fees||0,cur)]].map(([k,v])=>`<div class="lot"><span class="mu">${k}</span><span class="n">${esc(v)}</span></div>`).join('')}
 <div class="factions"><button class="fbtn" onclick="openTxForm(null,${i})"><i class="ti ti-pencil"></i> تعديل</button><button class="fbtn ghost" onclick="openAsset('${n}')"><i class="ti ti-external-link"></i> نافذة ${esc(n)}</button><button class="fbtn wr" onclick="deleteMovement('${t[8].id}')"><i class="ti ti-trash"></i> حذف</button></div></aside></div></div>`);
}

function openCtx(i){const t=CTX[i];if(!t)return;if(t.act==='Dividend')return openDividendDetail(t.id);openHolo(modalHead('CASH TRANSACTION',CASH[t.acc].n,t.d)+`<div class="kg2">${cell('النوع',t.act==='Deposit'?'إيداع':'سحب')}${cell('القيمة',fmtC(t.s))}${cell('الملاحظة',esc(t.note||'—'))}${cell('حركة مرتبطة',t.linkedId||'—')}</div><div class="factions"><button class="fbtn" onclick="editCash(${i})">تعديل</button>${t.act==='Deposit'&&!t.linkedId?`<button class="fbtn ghost" onclick="openDividendForm(null,${dividendArg(t.id)})">تصنيف كتوزيعات</button>`:''}<button class="fbtn wr" onclick="deleteMovement('${t.id}')">حذف</button></div>`);}

const ctxRow=(c,i)=>`<div class="row clk" onclick="openCtx(${i})"><div class="nm"><div class="t">${c.act==='Dividend'?'إيداع توزيعات · '+esc(c.sourceName):ACT_AR[c.act]} · ${CASH[c.acc].n}${c.act==='Transfer'?' ← '+CASH[c.to].n:''}</div><div class="s"><span class="n">${c.d}</span>${c.note?' · '+c.note:''}</div></div><span class="n" style="color:${['Deposit','Dividend'].includes(c.act)?'var(--cb)':'var(--muted)'}">${natTot(c.s/(c.act==='Dividend'?c.rate:liveRate(CASH[c.acc].c)),CASH[c.acc].c)}</span></div>`;


const CITIES=[['الدمام','SA',50.10,26.43],['الخبر','SA',50.21,26.28],['الرياض','SA',46.72,24.69],['جدة','SA',39.17,21.54],['مكة','SA',39.83,21.42],['المدينة','SA',39.61,24.47],
  ['عمّان','JO',35.93,31.95],['مادبا','JO',35.79,31.72],['إربد','JO',35.85,32.56],['العقبة','JO',35.01,29.53],['الخليل','PS',35.10,31.53],
  ['دبي','AE',55.27,25.20],['أبوظبي','AE',54.37,24.45],['الدوحة','QA',51.53,25.29],['الكويت','KW',47.98,29.37],['المنامة','BH',50.58,26.23],['مسقط','OM',58.41,23.59],
  ['القاهرة','EG',31.24,30.04],['إسطنبول','TR',28.98,41.01],['لندن','GB',-0.13,51.51],['برلين','DE',13.40,52.52],['نيويورك','US',-74.0,40.71],['تورونتو','CA',-79.38,43.65],['كوالالمبور','MY',101.69,3.14]];
ST.home={n:'الدمام',cc:'SA',lon:50.10,lat:26.43};
function setHome(n,cc,lon,lat){if(!Number.isFinite(+lon)||!Number.isFinite(+lat)||Math.abs(lat)>90||Math.abs(lon)>180)return;return saveCC('home',{n:ENGINE.clean(n),cc,lon:+lon,lat:+lat});}
function homeMap(){const w=420,h=210;try{const pj=d3.geoEquirectangular().fitSize([w,h],{type:'Sphere'}),pg=d3.geoPath(pj),[x,y]=pj([ST.home.lon,ST.home.lat]);
  const inv=Object.keys(XR?XR.countries:{}).map(cc=>{const ll=LL[cc];if(!ll)return '';const [a,b]=pj([ll[1],ll[0]]);return `<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" stroke="#4fd8ff" stroke-opacity=".35" stroke-dasharray="2 3"/><circle cx="${a}" cy="${b}" r="1.8" fill="#4fd8ff"/>`;}).join('');
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;display:block;background:rgba(2,10,18,.6);border:1px solid var(--c12)"><path d="${pg(land)}" fill="rgba(79,216,255,.1)" stroke="rgba(79,216,255,.3)" stroke-width=".4"/>${inv}
    <circle cx="${x}" cy="${y}" r="9" fill="none" stroke="#fff" stroke-opacity=".6"><animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" values=".8;0;.8" dur="2s" repeatCount="indefinite"/></circle><circle cx="${x}" cy="${y}" r="3.5" fill="#fff"/></svg>`;}catch(e){return '';}}
function stGeo(b){if(!navigator.geolocation){toast('المتصفح لا يدعم تحديد الموقع','ti-alert-triangle');return;}b.disabled=true;
  navigator.geolocation.getCurrentPosition(p=>{const {longitude:lo,latitude:la}=p.coords;let best=CITIES[0],bd=1e9;CITIES.forEach(c=>{const d=d3.geoDistance([c[2],c[3]],[lo,la]);if(d<bd){bd=d;best=c;}});
    setHome(bd<.02?best[0]:'موقعي الحالي',best[1],lo.toFixed(2),la.toFixed(2));},()=>{b.disabled=false;toast('تعذّر تحديد الموقع: اسمح للأداة بالوصول للموقع أو اختر مدينة','ti-alert-triangle');},{timeout:8000});}
function stHomeHTML(){const q=(ST._hq||'').trim();const L=CITIES.filter(c=>!q||c[0].includes(q));return `
    <div class="sect"><i class="ti ti-map-pin"></i> موقعك الحالي</div>
    <div class="mu" style="font-size:10.5px;margin-bottom:8px">منه تخرج خطوط الكرة الأرضية وخرائط الدول. تغييره لا يمسّ أي حساب.</div>
    <div class="mg" style="grid-template-columns:1fr 1fr;gap:12px">
      <div>${homeMap()}<div class="row" style="margin-top:6px"><div class="nm"><div class="t">${flag(ST.home.cc)} ${ST.home.n}</div><div class="s n">${fmt(ST.home.lat,2)}, ${fmt(ST.home.lon,2)}</div></div><button class="fbtn sm ghost" onclick="stGeo(this)"><i class="ti ti-current-location"></i> استخدم موقعي</button></div></div>
      <div><input class="fi" placeholder="ابحث عن مدينة" value="${ST._hq||''}" oninput="ST._hq=this.value;$('stCities').innerHTML=stCityList()">
        <div class="recent" id="stCities" style="margin-top:8px">${stCityList()}</div>
        <div class="fgrid" style="grid-template-columns:1fr 1fr auto;align-items:end;margin-top:10px">
          <div class="ff"><span>خط العرض</span><input class="fi num" id="hLat" value="${ST.home.lat}"></div>
          <div class="ff"><span>خط الطول</span><input class="fi num" id="hLon" value="${ST.home.lon}"></div>
          <button class="fbtn sm ghost" style="height:36px" onclick="const a=+$('hLat').value,o=+$('hLon').value;if(Math.abs(a)<=90&&Math.abs(o)<=180)setHome('موقع مخصص',ST.home.cc,o,a);else toast('إحداثيات غير صحيحة','ti-alert-triangle')">تطبيق</button></div></div>
    </div>`;}
function stCityList(){const q=(ST._hq||'').trim();const L=CITIES.filter(c=>!q||c[0].includes(q));return L.length?L.map(c=>`<button class="${ST.home.n===c[0]?'on':''}" onclick="setHome('${c[0]}','${c[1]}',${c[2]},${c[3]})">${flag(c[1])} ${c[0]}</button>`).join(''):'<span class="mu">لا نتائج، استعمل الإحداثيات</span>';}


let stNA={t:'Stock'};



let activeDialog=null,refreshingDialog=false,historyData={},companyQuotes={},calendarData=[],sourceErrors={},pullTimer=null,lastSnapshot='',pricesAt=0,externalAt=0;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const percent=(n,d)=>d>0?n/d*100:0;
const safeAction=async fn=>{try{return await fn();}catch(e){toast(esc(e.message),'ti-alert-triangle');throw e;}};
function replaceObject(target,value){Object.keys(target).forEach(k=>delete target[k]);Object.assign(target,value);}




function assetVisible(n){const id=S.registry.find(a=>a.n===n)?.id;return !(S.marketHidden||[]).includes(String(id));}
function visibleOther(o){return o.inc!==false&&(o.type!=='unrealized'||S.includeUnrealized);}





function syncSnapshot(force=false){
 const next=ENGINE.snapshot();const fingerprint=JSON.stringify({...next,updatedAt:0,status:undefined});
 const statusChanged=JSON.stringify(S.status)!==JSON.stringify(next.status);
 if(!force&&fingerprint===lastSnapshot){S.status=next.status;updateConnection();return;}
 const old=S;S=next;lastSnapshot=fingerprint;
 replaceObject(AS,S.AS);replaceObject(FX,{...S.FX,SAR:1});replaceObject(catGoals,S.catGoals);replaceObject(XRAY_DATA,S.XRAY_DATA);replaceObject(XR_COUNT,S.XR_COUNT);
 for(const [arr,key] of [[TXNS,'TXNS'],[CASH,'CASH'],[PROP,'PROP'],[OTHER,'OTHER']])arr.splice(0,arr.length,...(key==='OTHER'?S.OTHER.filter(visibleOther):S[key]));
 CTX=S.CTX;DELETED=S.deleted;build();baseCur=S.baseCur;
 Object.assign(ST,S.cc,{alerts:S.alerts});if(!ST.home)ST.home={n:'الخبر',cc:'SA',lon:50.1,lat:26.43};HOME=[Number(ST.home.lon),Number(ST.home.lat)];
 ZK.hawl=S.zakat.hawl?.dueStr||'';SPEED={s:3,n:6,f:11}[ST.spin]||6;AMB_IDLE=+ST.idle?+ST.idle*60000:Infinity;
 document.body.classList.toggle('reduce',!!ST.reduce);
 document.querySelectorAll('#curSeg button').forEach(b=>b.classList.toggle('on',b.dataset.c===baseCur));
 const changed=key=>force||baseCur!==old.baseCur||S.includeUnrealized!==old.includeUnrealized||JSON.stringify(S.marketHidden)!==JSON.stringify(old.marketHidden)||JSON.stringify(old[key])!==JSON.stringify(S[key]);
 if(changed('totals'))renderHero();if(changed('POS')||changed('CASH')||changed('PROP')||changed('OTHER')||changed('catGoals'))renderPf();
 if(changed('AS')||changed('POS')||changed('FX')){renderMkt();renderFx();renderNews();}
 if(changed('XR'))renderXrHud();if(changed('TXNS')||changed('CTX'))renderTx();
 if(changed('totals')||changed('catGoals')||changed('monthly'))renderGoals();
 if(changed('XR')||changed('POS')||changed('cc')||changed('zakat'))renderLab();
 stBell();updateConnection();if(ambOn)ambRender();
 if($('dvDate'))dividendPreview();
 if($('tfD')){
  if(TF.edit!=null){const t=TXNS[TF.edit];const now=t&&ENGINE.rawTxn(t[8].id);if(!now||JSON.stringify(now)!==TF.expected){TF.stale=true;$('tfMsg').innerHTML='<div class="fmsg wr">تغيّرت هذه الحركة من جهاز آخر. أغلق النموذج وافتح الحركة مجددًا قبل الحفظ.</div>';$('tfSave').disabled=true;}}
  if(!TF.stale)tfCalc();
 }else if(activeDialog&&$('ov').classList.contains('open')&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){
  const scroll=$('hb').scrollTop,assetScroll=document.querySelector('.asset-scroll')?.scrollTop||0;refreshingDialog=true;try{if(activeDialog.fn==='openSettings'&&$('stBody'))stRefresh();else window[activeDialog.fn](...activeDialog.args);}finally{refreshingDialog=false;$('hb').scrollTop=scroll;const asset=document.querySelector('.asset-scroll');if(asset)asset.scrollTop=assetScroll;}
 }
}
function updateConnection(){const el=document.querySelector('.live');if(!el)return;const st=parent.commandStorage.status();el.innerHTML='<i></i>'+(st.authRequired?'سجّل الدخول':!st.online?'غير متصل':!st.loaded?'جاري التحميل':st.busy?'جاري الحفظ':st.demo?'تجربة':'متصل');el.classList.toggle('offline',!st.online||st.authRequired);}
function formatStamp(value){return value?new Date(value).toLocaleString('ar-SA-u-ca-gregory',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'لم يتحدث بعد';}





function newsAssets(n){return impactOf(n).positions.map(p=>p.name);}
function newsExposure(n){return Math.max(0,...(n.related||[{a:n.a,via:n.via}]).map(r=>{const co=r.key?XR.companies[r.key]:Object.values(XR.companies).find(c=>c.ar===r.via);return co?.val??S.POS.find(p=>p.n===r.a)?.val??0;}));}
function rankNews(list){return [...list].sort((a,b)=>(impactOf(b).score??-1)-(impactOf(a).score??-1)||(b.date||'').localeCompare(a.date||''));}
function newsRequests(){const direct=S.POS.filter(p=>p.yh&&assetVisible(p.n)).sort((a,b)=>b.val-a.val).map(p=>({name:p.n,symbol:p.yh,company:p.full,assets:[p.n]}));const components=companySymbols().map(x=>{const c=XR.companies[x.key],assets=c.via.map(v=>v.f).filter(assetVisible);return {...x,name:assets[0],company:c.ar,via:c.ar,assets};}).filter(x=>x.name);const selected=[],perFund={};for(const x of components){if((perFund[x.name]||0)>=2)continue;selected.push(x);perFund[x.name]=(perFund[x.name]||0)+1;}for(const x of components)if(selected.length<12&&!selected.some(y=>y.symbol===x.symbol))selected.push(x);return [...new Map([...direct,...selected].map(x=>[x.symbol,x])).values()].slice(0,24);}



function goalCategories(){return ['Property','Gold','Stock','Cash'];}






async function refreshLive(button){if(button)button.disabled=true;try{await ENGINE.refresh();pricesAt=Date.now();syncSnapshot();await loadExternal();}catch(e){toast('تعذّر تحديث الأسعار','ti-alert-triangle');}finally{if(button)button.disabled=false;}}
async function loadExternal(){
 if(document.hidden||S.status.demo)return;externalAt=Date.now();
 const holdings=Object.keys(AS).filter(k=>AS[k].yh&&AS[k].t!=='Property').map(k=>({name:k,symbol:AS[k].yh}));
 const [news,cal,quotes]=await Promise.all([ENGINE.market('getNews',newsRequests()),ENGINE.market('getCalendar',[...holdings,...companySymbols().filter(x=>percent(XR.companies[x.key].val,S.totals.total)>=(ST.evMin||.5)).map(x=>({symbol:x.symbol,name:XR.companies[x.key].ar,asset:XR.companies[x.key].via[0]?.f,component:true}))],{countries:Object.keys(XR.countries),msci:Object.values(XRAY_DATA).some(d=>/msci/i.test(d.label||d.desc||''))}),ENGINE.market('getCompanyQuotes',companySymbols()),loadDividendSources(),loadPulse(),loadPulseBrief()]);
 if(news.ok!==false){NEWS.splice(0,NEWS.length,...(news.items||[]).map(n=>({...n,a:ENGINE.clean(n.a),t:ENGINE.clean(n.t),ago:n.date?new Date(n.date).toLocaleDateString('ar-SA-u-ca-gregory'):n.source||'Yahoo',via:ENGINE.clean(n.via||''),related:(n.related||[]).map(r=>({...r,a:ENGINE.clean(r.a),via:ENGINE.clean(r.via),assets:(r.assets||[r.a]).map(ENGINE.clean)}))})));sourceErrors.news=news.unavailable?.join('، ')||null;}else sourceErrors.news=news.error;
 if(cal.ok!==false){calendarData=(cal.items||[]).map(e=>({...e,t:ENGINE.clean(e.t),s:ENGINE.clean(e.s),on:e.asset?`openAsset('${ENGINE.clean(e.asset)}')`:`openCalendarEvent('${e.d}','${ENGINE.clean(e.t)}')`}));sourceErrors.calendar=cal.unavailable?.join('، ')||null;}else sourceErrors.calendar=cal.error;
 if(quotes.ok!==false)companyQuotes=quotes.quotes||{};else sourceErrors.quotes=quotes.error;
 renderNews();renderLab();renderGlobeHud();renderFocus();notifyDividendUpdates();updateConnection();if(ambOn)ambRender();await loadTickerQuotes();
}
function companySymbols(){return Object.values(XR.companies).sort((a,b)=>b.val-a.val).slice(0,35).map(c=>({key:c.k,symbol:companySymbol(c)})).filter(x=>x.symbol);}
function companySymbol(c){
 const custom=S.cc.companySymbols?.[c.k];if(custom)return custom;
 const direct=c.via.find(v=>AS[v.f]&&AS[v.f].yh&&!XRAY_DATA[v.f]?.top?.some(t=>t[0]!==c.k));if(direct)return AS[direct.f].yh;
 const key=c.k.replace(/^DIRECT_/,'');if(!/^[A-Za-z0-9.^=\-]{1,25}$/.test(key))return null;
 const suffix={KR:'.KS',TW:'.TW',HK:'.HK',SA:'.SR',IN:'.NS',GB:'.L',JP:'.T',DE:'.DE',NL:'.AS',CH:'.SW'}[c.cc];
 if(c.cc==='US'&&!key.startsWith('DIRECT'))return key;if(c.cc==='CA')return key+'.TO';if(c.cc==='HK'&&/^\d+$/.test(key))return key.padStart(4,'0')+'.HK';
 if(suffix&&((['KR','TW','HK','SA','JP'].includes(c.cc)&&/^\d+$/.test(key))||['IN','GB','DE','NL','CH'].includes(c.cc)))return key.includes('.')?key:key+suffix;
 return null;
}
function openNews(value){
 const n=typeof value==='number'?NEWS[value]:NEWS.find(x=>x.url===value);if(!n)return;
 activeDialog={fn:'openNews',args:[n.url]};
 const company=n.via?Object.values(XR.companies).find(c=>c.ar===n.via||c.k===n.via):null,position=S.POS.find(p=>p.n===n.a),via=newsPositions(n),exposure=via.reduce((s,v)=>s+v.value,0);
 openHolo(`<div class="news-dialog">${modalHead('INVESTMENT NEWS',n.scope==='macro'?'اقتصاد وأسواق':n.a,esc(n.source||'Yahoo')+' · '+esc(n.ago||''))}<h2 class="news-headline">${esc(n.t)}</h2>${impactDetail(n)}<div class="news-context"><div class="sect">علاقة الخبر بمحفظتك</div><p>${n.scope==='macro'?'ارتباط اقتصادي محتمل بالأسهم أو الذهب حسب موضوع الخبر.':'وصل الخبر من موجز '+esc([...new Set((n.related?.length?n.related:[{a:n.a,via:n.via}]).map(r=>r.via||r.a))].join('، '))+'. المراكز التالية توضّح ارتباطه بمحفظتك.'}</p></div><div class="kg2">${cell('قيمة حصتك المرتبطة',fmtC(exposure))}${cell('نسبتها من إجمالي ثروتك',via.length&&S.totals.total>0?fmt(percent(exposure,S.totals.total),2)+'%':'غير متاح')}</div>${via.length?'<div class="sect">المراكز المرتبطة</div>'+via.map(v=>`<div class="row clk" onclick="openAsset('${v.name}')"><div class="nm"><b>${v.name}</b><small>${v.weight<100?'الحصة المرتبطة داخل المركز '+fmt(v.weight,2)+'%':'مركز مباشر'}</small></div><span class="n">${fmtC(v.value)}</span><i class="ti ti-chevron-left"></i></div>`).join(''):''}<p class="sub">النسبة توضح حجم ارتباط استثمارك بالخبر؛ اتجاه التأثير يحتاج قراءة تفاصيله.</p><div class="factions"><button class="fbtn" id="news-read-source" onclick="openNewsSource()"><i class="ti ti-external-link"></i> قراءة الخبر في موقع المصدر</button>${AS[n.a]?`<button class="fbtn" onclick="openAsset('${n.a}')">تفاصيل الأصل</button>`:''}</div></div>`);
 window._newsSource=n.url;
}
function openNewsSource(){try{const url=new URL(window._newsSource);if(url.protocol==='https:')window.open(url.href,'_blank','noopener,noreferrer');}catch{toast('رابط الخبر غير صالح','ti-alert-triangle');}}
function movementQuotePrice(t,quoteCurrency){const c=t[8]?.currency||quoteCurrency;if(c===quoteCurrency)return t[4];if(c==='GBP'&&quoteCurrency==='GBp')return t[4]*100;if(c==='GBp'&&quoteCurrency==='GBP')return t[4]/100;return s2n(t[4]*(t[5]||1),quoteCurrency,liveRate(quoteCurrency));}

function installCommandCenter(){
 if(parent.commandIconFont){const font=new FontFace('tabler-icons',`url(${new URL(parent.commandIconFont,parent.location.href).href})`);document.fonts.add(font);font.load().catch(()=>{});}
 Object.assign(ST,{alerts:S.alerts});CTX=S.CTX;POS=S.POS;Object.assign(NUM2A,{400:'JO',344:'HK',702:'SG',578:'NO',246:'FI',380:'IT',724:'ES',620:'PT',56:'BE',40:'AT',616:'PL',792:'TR',818:'EG',504:'MA',586:'PK',604:'PE',152:'CL',170:'CO',554:'NZ',643:'RU',608:'PH',704:'VN',300:'GR',203:'CZ',348:'HU',376:'IL'});Object.assign(LL,{JO:[31,36],HK:[22.3,114.2],SG:[1.3,103.8],EU:[50.8,4.3],EZ:[50,10]});
 const regions=new Intl.DisplayNames(['ar'],{type:'region'});allFeat.forEach(f=>{const cc=NUM2A[+f.id];if(cc){const center=d3.geoCentroid(f);LL[cc]??=[center[1],center[0]];GEO_AR[cc]??=regions.of(cc);}});
 Object.keys(S.XR.countries).forEach(cc=>{try{GEO_AR[cc]??=regions.of(cc);}catch{GEO_AR[cc]??=cc;}});invFeat=allFeat.filter(f=>NUM2A[+f.id]);
 LAB_SIDE.heat=()=>`<div class="sect">حصتك داخل الشركات</div><div class="sub">المساحة تمثل حصتك الفعلية. اللون من حركة السعر المتاحة؛ الرمادي يعني أن السعر غير متاح.</div><div class="cell">${Object.keys(XR.companies).length} شركة</div>`;
 const originalSetLab=setLab;window.setLab=function(t){if(!Object.keys(XR.companies).length&&t==='net'){$('netSvg').innerHTML='<div class="empty">لا بيانات مكوّنات متاحة</div>';labTab=t;document.querySelectorAll('.labv').forEach(v=>v.style.display=v.dataset.t===t?'block':'none');return;}return originalSetLab(t);};
 enhanceControls();const originalOpen=openHolo;window.openHolo=function(html){if(refreshingDialog)return reHolo(html);originalOpen(html);$('ov').setAttribute('role','dialog');$('ov').setAttribute('aria-modal','true');$('holo').querySelector('.x')?.focus({preventScroll:true});};
 for(const fn of ['openNews','openAsset','openCountry','openCat','openGoals','openMonth','openCompany','openTx','openCtx','openZakat','openSettings','openDividends','openDividendDetail','openSourceDividend','openDividendReminders']){const original=window[fn];window[fn]=function(...args){activeDialog={fn,args};return original(...args);};}
 setInterval(()=>{if(!document.hidden){notifyDividendUpdates();renderLab();}},60000);
 parent.addEventListener('portfolio:changed',()=>{clearTimeout(pullTimer);pullTimer=setTimeout(()=>syncSnapshot(),80);});
 setInterval(()=>{if(!document.hidden&&parent.document.body.dataset.portfolioView==='cc')syncSnapshot();},2000);
 setInterval(()=>{if(document.hidden||parent.document.body.dataset.portfolioView!=='cc')return;loadPulse();if(Date.now()-pricesAt>(S.marketOpen===false?900000:60000))refreshLive();else if(Date.now()-externalAt>900000)loadExternal();},15000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){syncSnapshot();loadPulse();if(Date.now()-pricesAt>(S.marketOpen===false?900000:60000))refreshLive();}});
 document.querySelectorAll('button.ibtn').forEach(b=>{b.title=b.querySelector('.tip')?.textContent||'';b.setAttribute('aria-label',b.title);});
 syncSnapshot(true);setTimeout(loadExternal,1500);
}

function openCalendarEvent(d,t){const e=calendarData.find(e=>e.d===d&&e.t===t);if(!e)return;activeDialog=null;openHolo(modalHead('ECONOMIC RADAR',e.t,esc(eventTimeLabel(e))+' · '+esc(e.src))+`${impactDetail(e)}<div class="news-context"><div class="sect">ليش هذا الحدث مهم؟</div><p>${esc(e.impact||'قد يؤثر التقرير على توقعات الفائدة والعملات وتقييم الاستثمارات. التأثير الفعلي يعتمد على النتائج مقارنة بتوقعات السوق.')}</p><p>${esc(e.s)}</p></div><div class="sub">موعد معلن قابل للتغيير. الحدث لا يتوقع اتجاه السوق.</div>${e.url&&/^https:\/\//.test(e.url)?`<a class="fbtn" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">الجدول الرسمي ↗</a>`:''}`);}

function newsPositions(n){return impactOf(n).positions;}

function geoPositionLabel(cc){if(cc==='EZ'||cc==='EU')return 'موضع تمثيلي للمنطقة · ليست دولة';const ll=LL[cc];return ll?fmt(ll[0],1)+'°, '+fmt(ll[1],1)+'°':'الموقع غير محدد';}

// Market strips use measured, identical groups: distance / speed stays readable.
const marketTickerStates=new Map();
let tickerFxQuotes={};
function tickerCurrencies(){return Object.keys(FX).filter(c=>/^[A-Z]{3}$/.test(c)&&c!==baseCur&&FX[c]>0);}
function marketTickerItems(){
 const items=Object.entries(AS).filter(([n,a])=>a.yh&&assetVisible(n)).map(([n,a])=>({name:n,price:natFmt(a.p,a.cur),change:a.chg}));
 for(const c of tickerCurrencies()){const q=tickerFxQuotes[c+'/'+baseCur];items.push({name:c+'/'+baseCur,price:fmt(q?.price??FX[c]/(FX[baseCur]||1),4),change:q?.changePct??null});}
 if(S.goldOunce!=null)items.push({name:'XAU/USD',price:fmt(S.goldOunce,2),change:Object.values(AS).find(a=>a.t==='Gold')?.chg??null});
 return items;
}
function tickerItemHTML(item){
 const v=item.change,known=v!=null&&Number.isFinite(Number(v)),cls=!known||v===0?'mu':v>0?'up':'dn';
 return `<span class="ticker-item"><b>${esc(item.name)}</b><span class="n">${esc(item.price)}</span><span class="n ${cls}">${!known?'— غير متاح':(v>0?'▲ +':v<0?'▼ −':'• ')+fmt(Math.abs(v),2)+'%'}</span></span>`;
}
function renderMarketTicker(id){
 const el=$(id);if(!el)return;
 let state=marketTickerStates.get(id);
 if(!state){state={el,signature:'',width:0,animation:null};marketTickerStates.set(id,state);state.observer=new ResizeObserver(()=>layoutMarketTicker(state));state.observer.observe(el.parentElement);document.fonts?.ready.then(()=>layoutMarketTicker(state));}
 const html=marketTickerItems().map(tickerItemHTML).join('')||'<span class="ticker-item">لا أسعار مرتبطة متاحة</span>';
 if(html!==state.signature){state.signature=html;const group=document.createElement('div');group.className='ticker-group';group.innerHTML=html;el.replaceChildren(group);state.width=0;}
 requestAnimationFrame(()=>layoutMarketTicker(state));
}
function layoutMarketTicker(state){
 const {el}=state,viewport=el.parentElement.clientWidth;if(!viewport)return;
 const first=el.firstElementChild;if(!first)return;
 // Expand short sets to a viewport before duplicating so the loop has no blank tail.
 first.innerHTML=state.signature;
 const natural=first.getBoundingClientRect().width;if(!natural)return;
 first.innerHTML=state.signature.repeat(Math.max(1,Math.ceil(viewport/natural)));
 const width=Math.round(first.getBoundingClientRect().width*64)/64;
 if(width===state.width&&el.children.length===2)return;
 const old=state.animation,progress=old&&state.duration?(Number(old.currentTime)||0)%state.duration/state.duration:0;
 if(old)old.cancel();while(el.children.length>1)el.lastElementChild.remove();
 const copy=first.cloneNode(true);copy.setAttribute('aria-hidden','true');el.append(copy);
 state.width=width;state.duration=width/28*1000;
 state.animation=el.animate([{transform:'translateX(0)'},{transform:`translateX(-${width}px)`}],{duration:state.duration,iterations:Infinity,easing:'linear'});
 state.animation.currentTime=progress*state.duration;
}

async function loadTickerQuotes(){
 const currency=baseCur,requests=tickerCurrencies().map(c=>({key:c+'/'+currency,symbol:c+currency+'=X'}));
 for(let i=0;i<requests.length;i+=40){const result=await ENGINE.market('getCompanyQuotes',requests.slice(i,i+40));if(result.ok!==false)Object.assign(tickerFxQuotes,result.quotes||{});}
 renderFx();
}
function monthReport(i){
 const m=monthStats(i),months=MON.map((_,j)=>monthStats(j)),active=months.filter(x=>x.L.length),average=active.length?active.reduce((s,x)=>s+x.inv,0)/active.length:0;
 const byAsset={},byCategory={},replays={};let current=0,cost=0,missing=false,missingRealized=false,realized=0;
 for(const t of m.L){const name=t[1],a=AS[name]||{};replays[name]??=ENGINE.fifoReplay(name);const replay=replays[name][t[8].id];
  if(t[2]==='Buy'){byAsset[name]=(byAsset[name]||0)+txSAR(t);byCategory[a.t||'Other']=(byCategory[a.t||'Other']||0)+txSAR(t);
   const lot=replay?.lot;if(!lot){missing=true;continue;}cost+=lot.qty*lot.p;if(lot.qty>0){const unit=a.p==null?null:toSAR(a.p,a.cur);if(unit==null||!Number.isFinite(unit))missing=true;else current+=lot.qty*unit;}
  }else if(t[2]==='Sell'){if(replay?.pnl==null)missingRealized=true;else realized+=replay.pnl;}
 }
 const largest=[...m.L].sort((a,b)=>txSAR(b)-txSAR(a))[0];
 return {...m,months,active,average,byAsset,byCategory,current:missing?null:current,unrealized:missing?null:current-cost,realized:missingRealized?null:realized,largest,rank:m.inv>0?active.filter(x=>x.inv>m.inv).length+1:null};
}
function monthBreakdown(values,labels={}){const entries=Object.entries(values).sort((a,b)=>b[1]-a[1]),max=Math.max(1,...entries.map(x=>x[1]));return entries.map(([k,v])=>`<div class="month-split"><span>${esc(labels[k]||k)}</span><div><i style="width:${v/max*100}%"></i></div><b class="n">${fmtC(v)}</b></div>`).join('')||'<p class="mu">لا مشتريات خلال الشهر</p>';}
function changeReportMonth(delta){let next=selM+delta;if(next<0){selectedYear--;next=11;}if(next>11){selectedYear++;next=0;}openMonth(next);renderTx();}




const labSizeObserver=new ResizeObserver(()=>{if(labTab==='orbit')orbResize();if(labTab==='heat')renderHeat();});
labSizeObserver.observe(document.querySelector('.labstage'));

function modalHead(code,title,sub=''){return `<div class="mh"><div><div class="code">${code}</div><h2>${esc(title)}</h2><div class="full">${sub}</div></div></div>`;}

async function loadHistory(n){const a=AS[n];historyData[a.yh]={loading:true};const r=await ENGINE.market('getHistory',a.yh);historyData[a.yh]=r;const el=$('assetHistory');if(el&&activeDialog?.fn==='openAsset'&&activeDialog.args[0]===n)el.innerHTML=chart52(S.POS.find(p=>p.n===n)||{...a,n});}

function hideChartHover(){if($('chartHover'))$('chartHover').hidden=true;if($('realCross'))$('realCross').setAttribute('opacity','0');}
function realChartHover(e){const c=window._realChart,svg=$('c52');if(!c||!svg)return;const dg=e.target.closest('[data-dividend-group]');if(dg){showDividendChartTip(e,+dg.dataset.dividendGroup);return;}const pt=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse()),f=Math.max(0,Math.min(1,(pt.x-8)/572)),time=c.start+f*(c.end-c.start);const p=c.pts.reduce((best,v)=>Math.abs(Date.parse(v.d)-time)<Math.abs(Date.parse(best.d)-time)?v:best,c.pts[0]),x=8+(Date.parse(p.d)-c.start)/(c.end-c.start||1)*572;const cross=$('realCross');cross.setAttribute('x1',x);cross.setAttribute('x2',x);cross.setAttribute('opacity','.6');const group=e.target.closest('[data-group]');if(group){showChartGroupTip(e.clientX,e.clientY,+group.dataset.group);}else showChartTip(e.clientX,e.clientY,p,null);$('realChartTip').textContent=p.d+' · '+natFmt(p.p,c.cur);}
function showChartTip(x,y,p,t){const tip=$('chartHover'),box=$('assetHistory').getBoundingClientRect();if(!tip)return;tip.hidden=false;tip.classList.toggle('trade-tip',!!t);tip.innerHTML=t?`<b>${t[2]==='Buy'?'▲ شراء':'▼ بيع'} · ${esc(t[0])}</b><strong class="n">${natFmt(t[4],t[8]?.currency||window._realChart.cur)}</strong><span>الكمية ${fmt(t[3],4)} · الإجمالي ${fmtC(txSAR(t))}</span><small>اضغط لفتح تفاصيل الحركة</small>`:`<b>${p.d}</b><strong class="n">${natFmt(p.p,window._realChart.cur)}</strong>`;tip.style.left=Math.max(4,Math.min(box.width-tip.offsetWidth-4,x-box.left+14))+'px';tip.style.top=Math.max(4,y-box.top-tip.offsetHeight-14)+'px';}
function chartTradeFocus(e,i){const t=TXNS[i],r=e.target.getBoundingClientRect();showChartTip(r.x,r.y,null,t);}





function editCash(i){const t=CTX[i];if(t.act==='Dividend')return openDividendForm(null,t.id);if(t.linkedId){const j=TXNS.findIndex(x=>String(x[8].id)===String(t.linkedId));if(j>=0)return openTxForm(null,j);return toast('افتح إدارة الحركات لتعديل التحويل المرتبط','ti-info-circle');}openTxForm('c:'+t.acc,null,t.act);const r=ENGINE.rawTxn(t.id);TF.cashEdit=r;TF.expected=JSON.stringify(r);$('tfD').value=r.date;$('tfAmt').value=r.qty;$('tfR').value=r.rate;$('tfN').value=r.remarks||'';tfCalc();}


function txInput(){const r=regGet(TF.id),old=TF.cashEdit||TXNS[TF.edit]?.[8];return {id:old?.id,expected:TF.expected,name:r.n,date:$('tfD').value,action:TF.act,qty:+$('tfQ').value,price:+$('tfP').value,amount:+$('tfAmt').value,fees:+$('tfFees')?.value||0,rate:r.cur==='SAR'||r.cur==='SARg'?1:+$('tfR').value,note:$('tfN').value,fund:TF.fund,accountName:CASH[TF.acc]?.n,toName:CASH[TF.to]?.n};}





async function setZakatGroup(type,value){const current=JSON.parse(parent.commandStorage.raw().settings.zakatAsst||'{}');for(const r of S.zakat.rows.filter(r=>r.type===type))current[r.key]=value;await safeAction(()=>ENGINE.setting('zakatAsst',current));syncSnapshot();}

let zakatTab='assets';
function zakatGo(tab){zakatTab=tab;openZakat();}
function zakatOptionsHTML(){const z=S.zakat;return `<div class="fgrid"><label class="ff">بداية الحول<input type="date" class="fi" value="${z.opt.hawlStart||''}" onchange="saveZakatOption('hawlStart',this.value)"></label><label class="ff">الديون (${baseCur})<input type="number" min="0" class="fi" value="${z.opt.debts||0}" onchange="saveZakatOption('debts',+this.value)"></label>${[['margin','هامش الاحتياط (%)'],['rate','نسبة الزكاة (%)'],['topN','عدد مكوّنات الصندوق (1–50)'],['pctVal','النسبة اليدوية (%)'],['goldGram','سعر غرام الذهب (SAR)'],['silverGram','سعر غرام الفضة (SAR)']].map(([k,l])=>`<label class="ff">${l}<input class="fi" type="number" min="0" value="${z.opt[k]||0}" onchange="saveZakatOption('${k}',+this.value)"></label>`).join('')}<label class="ff">أساس النصاب<select class="fi" onchange="saveZakatOption('nisabBase',this.value)"><option value="gold" ${z.opt.nisabBase==='gold'?'selected':''}>الذهب</option><option value="silver" ${z.opt.nisabBase==='silver'?'selected':''}>الفضة</option></select></label></div><div class="sect">معالجة الأصول</div>`+z.rows.map((r,i)=>srow(esc(r.name),'',`<select class="fi" onchange="saveZakatTreat(${i},this.value)">${[['auto','تلقائي'],['full','كامل'],['exempt','معفى'],['pct','النسبة اليدوية']].map(([v,l])=>`<option value="${v}" ${r.treat===v?'selected':''}>${l}</option>`).join('')}</select>`)).join('');}

async function saveZakatOption(k,v){await safeAction(()=>ENGINE.setting('zakatOpt',{...S.zakat.opt,[k]:v}));syncSnapshot();}



function historyPlotDecor(pts,min,max,X,Y,line){const grids=Array.from({length:5},(_,i)=>{const v=min+(max-min)*i/4;return `<line x1="8" x2="580" y1="${Y(v)}" y2="${Y(v)}" stroke="rgba(79,216,255,.08)"/><text x="590" y="${Y(v)+3}" fill="#7394a3" font-size="9" font-family="sans-serif">${fmt(v,v>100?0:1)}</text>`;}).join('');const months=[];let last='';for(const p of pts){const m=p.d.slice(0,7);if(m!==last){months.push(`<text x="${X(p.d)}" y="207" fill="#7394a3" font-size="8" font-family="sans-serif">${p.d.slice(5,7)}</text>`);last=m;}}return `<defs><linearGradient id="priceArea" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#4fd8ff" stop-opacity=".26"/><stop offset="1" stop-color="#4fd8ff" stop-opacity="0"/></linearGradient></defs>${grids}${months.join('')}<path d="${line}L${X(pts.at(-1).d)},190L${X(pts[0].d)},190Z" fill="url(#priceArea)"/>`;}

function chartTradeTrack(p,start,end,X){const groups=[];for(const act of ['Buy','Sell']){const rows=TXNS.map((t,i)=>({t,i})).filter(({t})=>t[1]===p.n&&t[2]===act&&Date.parse(t[0])>=start&&Date.parse(t[0])<=end).sort((a,b)=>a.t[0].localeCompare(b.t[0]));let last=null;for(const row of rows){const x=Math.max(14,Math.min(574,X(row.t[0])));if(last&&x-last.x<14){last.ids.push(row.i);}else {last={act,x,ids:[row.i],asset:p.n};groups.push(last);}}}window._chartTradeGroups=groups;
 return `<g class="trade-track"><rect x="4" y="215" width="632" height="45" fill="rgba(2,8,14,.75)"/><line x1="8" x2="580" y1="227" y2="227" stroke="rgba(245,199,106,.17)"/><line x1="8" x2="580" y1="249" y2="249" stroke="rgba(255,107,90,.17)"/><text x="628" y="230" text-anchor="end" fill="#f5c76a" font-size="9">شراء</text><text x="628" y="252" text-anchor="end" fill="#ff8b78" font-size="9">بيع</text>${groups.map((g,i)=>{const y=g.act==='Buy'?227:249,up=g.act==='Buy',color=up?'#f5c76a':'#ff8b78';return `<g class="trade-marker ${up?'trade-buy':'trade-sell'}" data-group="${i}" tabindex="0" role="button" aria-label="${g.ids.length} ${up?'شراء':'بيع'} ${TXNS[g.ids[0]][0]}" onclick="openChartTradeGroup(${i})" onfocus="focusChartGroup(event,${i})" onkeydown="if(event.key==='Enter')openChartTradeGroup(${i})"><rect x="${g.x-9}" y="${y-10}" width="18" height="20" fill="transparent"/><path d="M${g.x},${y+(up?-6:6)} l-6,${up?10:-10} h12 Z" fill="${color}" stroke="#06111b" stroke-width="1.3"/>${g.ids.length>1?`<circle cx="${g.x+7}" cy="${y-7}" r="6" fill="#091725" stroke="${color}"/><text x="${g.x+7}" y="${y-4}" text-anchor="middle" fill="${color}" font-size="7">${g.ids.length}</text>`:''}</g>`;}).join('')}</g>`;
}
function showChartGroupTip(x,y,i){const group=window._chartTradeGroups?.[i];if(!group)return;const t=TXNS[group.ids[0]];showChartTip(x,y,null,t);if(group.ids.length>1){const tip=$('chartHover');tip.innerHTML=`<b>${group.ids.length} عمليات ${group.act==='Buy'?'شراء':'بيع'}</b><strong class="n">${fmtC(group.ids.reduce((s,i)=>s+txSAR(TXNS[i]),0))}</strong><small>${t[0]}${t[0]!==TXNS[group.ids.at(-1)][0]?' → '+TXNS[group.ids.at(-1)][0]:''}</small><small>اضغط لعرض جميع الحركات</small>`;}}
function focusChartGroup(e,i){const box=e.currentTarget.getBoundingClientRect();showChartGroupTip(box.x,box.y,i);}
function openChartTradeGroup(i){const group=window._chartTradeGroups?.[i];if(!group)return;if(group.ids.length===1)return openTx(group.ids[0]);activeDialog=null;openHolo(modalHead('TRANSACTIONS',group.asset,'حركات متقاربة على الخط الزمني')+group.ids.map(i=>txRow(TXNS[i])).join('')+`<button class="fbtn ghost" onclick="openAsset('${group.asset}')">العودة للتشارت</button>`);}

function tfCurrentPreview(){
 const r=regGet(TF.id);if(!r)return '';
 const p=S.POS.find(p=>p.n===r.n),cash=r.k==='Cash',f=cash?null:ENGINE.fifo(r.n),value=p?.val??r.v??0,avg=f?.avg,qty=f?.qty??r.q??0;
 const first=cash?cell('الرصيد الحالي',fmtC(value)):cell('الرصيد الحالي',fmt(qty,Number.isInteger(qty)?0:4)+(r.k==='Gold'?' غ':''));
 const second=cash?cell('عملة الحساب',esc(r.cur)):cell('متوسط تكلفتك',qty>0&&avg!=null?natFmt(s2n(avg,r.cur,liveRate(r.cur)),r.cur):'—');
 return '<div class="pt">IMPACT PREVIEW</div><p class="preview-hint">'+(cash?'أدخل المبلغ لعرض أثر الحركة على حساباتك':'أدخل الكمية والسعر لعرض أثر الحركة على المحفظة')+'</p><div class="kg2">'+first+second+cell('القيمة الحالية',fmtC(value))+cell('وزنه من الثروة',fmt(percent(value,S.totals.total),1)+'%')+'</div>';
}

const zakatRefreshState={busy:false,message:'',kind:'idle'};
function zakatRefreshControl(){const z=zakatRefreshState;return `<div class="z-refresh"><button class="fbtn ghost" id="zRefreshButton" onclick="refreshZakatRatios()" ${z.busy?'disabled':''} aria-busy="${z.busy}"><i class="ti ti-refresh ${z.busy?'is-spinning':''}"></i>${z.busy?'جاري تحديث النسب…':'تحديث النسب'}</button><p id="zRefreshStatus" class="z-refresh-status ${z.kind}" role="status" aria-live="polite" ${z.message?'':'hidden'}>${esc(z.message)}</p></div>`;}
function renderZakatRefresh(){const box=$('zRefreshButton')?.closest('.z-refresh');if(box)box.outerHTML=zakatRefreshControl();}
async function refreshZakatRatios(){
 if(zakatRefreshState.busy)return;
 Object.assign(zakatRefreshState,{busy:true,message:'جاري قراءة المحفظة وطلب القوائم المالية…',kind:'pending'});renderZakatRefresh();
 try{
  const result=await ENGINE.updateZakat(message=>{zakatRefreshState.message=message;renderZakatRefresh();});
  if(!result||result.ok===false)throw Error(result?.message||'تعذّر تحديث النسب. حاول مرة ثانية.');
  Object.assign(zakatRefreshState,{message:result.message,kind:result.failed?'partial':'success'});
  syncSnapshot();toast(esc(result.message),result.failed?'ti-alert-triangle':'ti-check');
 }catch(e){Object.assign(zakatRefreshState,{message:e.message||'تعذّر تحديث النسب',kind:'error'});toast(esc(zakatRefreshState.message),'ti-alert-triangle');}
 finally{zakatRefreshState.busy=false;renderZakatRefresh();}
}

const dividendToastSeen=new Set();
function dividendStateLabel(e){return e.state==='received'?'مسجّلة':e.state==='review'?'راجع الربط بإيداعك':e.state==='pending'?(e.paymentDate?'مضت · غير مسجّلة':'راجع موعد الدفع'):e.status==='estimated'?'قادمة · تقديرية':'قادمة · معلنة';}
function sourceDividendRow(e){return `<button class="source-dividend-row ${e.state}" onclick="openSourceDividend(${dividendArg(e.key)})"><i class="ti ti-coin"></i><span><b>${esc(e.n)}</b><small>${dividendStateLabel(e)} · <span class="n">${esc(e.date)}</span></small><small>${e.currency?dividendUnit(e.perShare,e.currency)+' / وحدة':'عملة التوزيع غير مؤكدة'} · ${e.dateKind==='payment'?'الدفع':'الاستبعاد'}</small></span><strong class="n">${e.totalSAR==null?'—':'≈ '+fmtC(e.totalSAR)}</strong><i class="ti ti-chevron-left"></i></button>`;}
function pendingDividendHTML(sourceAssetId='all'){const rows=sourceDividendEvents().filter(e=>['pending','review'].includes(e.state)&&(sourceAssetId==='all'||String(e.sourceAssetId)===String(sourceAssetId)));return rows.length?`<div class="sect dividend-warning">توزيعات ماضية للمراجعة · ${rows.length}</div><div class="dividend-pending-list">${rows.map(sourceDividendRow).join('')}</div>`:'';}
function openSourceDividend(key){
 const e=sourceDividendEvents().find(e=>e.key===key);if(!e)return toast('الموعد لم يعد موجودًا في المصدر؛ حدّث البيانات','ti-info-circle');
 if(e.receiptId!=null)return openDividendDetail(e.receiptId);
 const related=dividendNews(e.n),candidates=distributionRows().filter(t=>String(t.sourceAssetId)===String(e.sourceAssetId)&&!t.dividendEventKey);
 openHolo(`<div class="dividends-dialog source-dividend-detail">${modalHead('DIVIDEND EVENT','توزيع · '+e.n,dividendStateLabel(e)+' · '+esc(e.source))}<div class="kg">${cell('تاريخ الاستبعاد',esc(e.exDate))}${cell('موعد الدفع',e.paymentDate?esc(e.paymentDate):'غير متاح')}${cell('لكل وحدة · قبل الاستقطاع',e.currency?dividendUnit(e.perShare,e.currency):'العملة غير مؤكدة')}${cell('القيمة التقديرية لحصتك',e.totalSAR==null?'غير متاح':'≈ '+fmtC(e.totalSAR))}</div><div class="dividend-layout"><section><div class="sect">راجع الاستلام</div><p class="dividend-note">${e.state==='upcoming'?'هذا موعد قادم؛ لا يعني أن المبلغ وصل حسابك.':e.paymentDate?'مرّ موعد الدفع المنشور؛ راجع كشف الوسيط قبل تسجيل المبلغ.':'تاريخ المصدر هو تاريخ الاستبعاد فقط، وليس تأكيدًا لوصول الدفعة. راجع موعد الدفع عند الوسيط.'} ${e.status==='estimated'?'التاريخ والمبلغ تقدير من سجل توزيعات المصدر، وليس من إيداعاتك المسجّلة، وليسا إعلانًا مؤكدًا.':''}</p><div class="kg2">${cell(e.quantityBasis==='historical'?'كمّيتك المسجّلة قبل الاستبعاد':'الكمية الحالية · قد تتغيّر',fmt(e.qty,4))}${cell('عملة التوزيع',esc(e.currency||'غير مؤكدة'))}</div><p class="dividend-note">الاستحقاق المقدّر مبني على حركاتك المسجّلة. قيمة الحصة قبل الضريبة وبسعر الصرف الحالي، ولا تُضاف إلى النقد تلقائيًا.</p><div class="factions"><button class="fbtn sm" onclick="recordSourceDividend(${dividendArg(e.key)})">سجّل ما استلمته</button><a class="fbtn sm ghost" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">المصدر ↗</a><button class="fbtn sm ghost" onclick="openAsset(${dividendArg(e.n)})">الأصل</button></div>${candidates.length?`<div class="sect">أو اربطه بإيداع مسجّل</div><p class="dividend-note">الربط لا يضيف نقدًا ولا يغيّر مبلغ الإيداع.</p><select class="fi" id="dvLinkReceipt">${candidates.map(t=>`<option value="${esc(t.id)}" ${e.candidateIds.includes(t.id)?'selected':''}>${esc(t.date)} · ${natTot(t.qty,t.currency)} · ${esc(t.assetName)}</option>`).join('')}</select><button class="fbtn sm ghost" id="dvLinkButton" onclick="linkSourceDividend(${dividendArg(e.key)},$('dvLinkReceipt').value,this)">ربط بالإيداع المختار</button>`:''}</section><aside><div class="sect">تنبيه الموعد</div><p class="dividend-note">تظهر التذكيرات في الجرس ورادار الأحداث قبل الاستبعاد والدفع، وتبقى الدفعة الماضية للمراجعة حتى تسجيلها أو ربطها.</p><button class="fbtn sm ghost" onclick="openSettings('alerts')">إعدادات التنبيه</button><div class="sect">أخبار التوزيعات المرتبطة</div><div class="asset-news-scroll">${related.length?related.map(newsRow).join(''):'<p class="dividend-note">لا أخبار توزيعات مرتبطة في الموجز الحالي.</p>'}</div></aside></div></div>`);
}
function recordSourceDividend(key){const e=sourceDividendEvents().find(e=>e.key===key);if(!e)return;if(e.receiptId!=null)return openDividendDetail(e.receiptId);if(e.candidateIds.length&&!confirm('يوجد إيداع قريب من هذا الموعد. راجع الربط أولًا لتجنب التكرار. هل تأكدت أنك تحتاج إيداعًا جديدًا؟'))return;openDividendForm(e.n);dividendForm.eventKey=e.key;dividendForm.sourceId=e.sourceAssetId;$('dvNote').value=`توزيعة ${e.n} · الاستبعاد ${e.exDate} · الدفع ${e.paymentDate||'غير متاح'} · ${e.source}${e.status==='estimated'?' · موعد تقديري':''}`;if(e.date<=todayS()&&e.paymentDate)$('dvDate').value=e.paymentDate;dividendPreview();}
async function linkSourceDividend(key,id,button){
 const e=sourceDividendEvents().find(e=>e.key===key),old=ENGINE.rawTxn(id);if(!e||!old||String(old.sourceAssetId)!==String(e.sourceAssetId))return;
 const account=ENGINE.assets().find(a=>a.type==='Cash'&&a.name===old.assetName);if(!account)return;
 if(button)button.disabled=true;
 try{await ENGINE.saveDividend({id:old.id,expected:JSON.stringify(old),sourceAssetId:old.sourceAssetId,accountId:account.id,date:old.date,amount:old.qty,rate:old.rate,note:old.remarks,dividendEventKey:key});syncSnapshot();openDividendDetail(id);toast('تم الربط بدون تغيير الرصيد','ti-check');}catch(err){toast(esc(err.message),'ti-alert-triangle');if(button)button.disabled=false;}
}
function dividendNews(name){return NEWS.filter(n=>/dividend|distribution|توزيع|توزيعات|أرباح نقدية|派息/i.test(n.t||'')&&(n.related||[{a:n.a,via:n.via,headline:n.headline}]).some(r=>!r.via&&r.headline&&(name?r.a===name:!!AS[r.a])));}
function dividendReminderItems(){
 if(S.cc.dividendNotify===false)return [];
 const items=parent.dividendLedger.dividendReminders(sourceDividendEvents(),todayS(),Number(S.cc.dividendLeadDays)||7).map(e=>({...e,id:e.key+'|'+e.reminderKind+'|'+e.reminderDate,title:(e.reminderKind==='exDate'?'قرب الاستبعاد':e.reminderKind==='payment'?'قرب موعد الدفع':e.reminderKind==='checkPayment'?'راجع موعد الدفع':'توزيع مضى ولم يُربط')+' · '+e.n}));
 if(S.cc.dividendNewsNotify!==false)for(const n of dividendNews()){if(!n.date||Date.parse(todayS())-Date.parse(n.date)>30*86400000)continue;items.push({id:'news|'+n.url,title:n.t,reminderDate:n.date.slice(0,10),newsURL:n.url,source:n.source});}
 return items;
}
function dividendReminderRows(){const items=dividendReminderItems(),seen=new Set(S.cc.dividendSeen||[]);return items.map(e=>`<div class="dividend-reminder ${seen.has(e.id)?'seen':''}"><button onclick="${e.newsURL?`openNews(${dividendArg(e.newsURL)})`:`openSourceDividend(${dividendArg(e.key)})`}"><i class="ti ${e.newsURL?'ti-news':'ti-bell-ringing'}"></i><span><b>${esc(e.title)}</b><small>${esc(e.reminderDate)} · ${e.status==='estimated'?'تقديري · ':''}${esc(e.source||'')}</small></span></button><button class="fbtn sm ghost" onclick="markDividendSeen(${dividendArg(e.id)})" ${seen.has(e.id)?'disabled':''}>${seen.has(e.id)?'تمت القراءة':'قرأت التنبيه'}</button></div>`).join('')||'<p class="dividend-note">لا تنبيهات توزيعات جديدة ضمن الفترة المحددة.</p>';}
function dividendAlertSettings(){return `<section class="dividend-alert-settings"><div class="sect">تنبيهات التوزيعات</div>${srow('تذكير بالمواعيد والدفعات غير المسجلة','داخل الأداة أثناء فتحها',tgl(S.cc.dividendNotify!==false,"saveCC('dividendNotify',S.cc.dividendNotify===false)"))}${srow('أخبار التوزيعات','من موجز الأصل المباشر، عند توفر أخبار مرتبطة',tgl(S.cc.dividendNewsNotify!==false,"saveCC('dividendNewsNotify',S.cc.dividendNewsNotify===false)"))}<label class="ff">التذكير قبل الموعد<select class="fi" onchange="saveCC('dividendLeadDays',+this.value)">${[3,7,14,30].map(d=>`<option value="${d}" ${(Number(S.cc.dividendLeadDays)||7)===d?'selected':''}>${d} أيام</option>`).join('')}</select></label><div class="dividend-reminders-list">${dividendReminderRows()}</div></section><div class="sect">تنبيهات الأسعار</div>`;}
function openDividendReminders(){openHolo(`<div class="dividends-dialog">${modalHead('DIVIDEND ALERTS','تنبيهات التوزيعات','المواعيد القادمة، الدفعات التي تحتاج مراجعة، والأخبار المرتبطة')}<div class="dividend-reminders-list">${dividendReminderRows()}</div><button class="fbtn sm ghost" onclick="openSettings('alerts')">إعدادات التنبيه</button></div>`);loadDividendSources();}
async function markDividendSeen(id){await saveCC('dividendSeen',[...(S.cc.dividendSeen||[]).filter(x=>x!==id),id].slice(-500));}

function notifyDividendUpdates(){stBell();if(document.hidden||$('ov')?.classList.contains('open'))return;const fresh=dividendReminderItems().filter(e=>!dividendToastSeen.has(e.id)&&!(S.cc.dividendSeen||[]).includes(e.id));if(!fresh.length)return;fresh.forEach(e=>dividendToastSeen.add(e.id));toast('لديك '+fresh.length+' تنبيهات توزيعات · راجع الجرس','ti-bell-ringing');}
function dividendCalendarEvents(){return sourceDividendEvents().filter(e=>e.state==='upcoming').flatMap(e=>[{d:e.exDate,label:'الاستبعاد'},...(e.paymentDate?[{d:e.paymentDate,label:'الدفع'}]:[])] .filter(x=>x.d>=todayS()).map(x=>({c:'div',d:x.d,t:x.label+' · توزيع '+e.n+(e.status==='estimated'?' — تقديري':''),s:e.source,src:e.source,asset:e.n,on:`openSourceDividend(${dividendArg(e.key)})`})) );}
function chartDividendMarkers(p,start,end,X){
 if(p.t!=='Stock')return '';
 const id=S.registry.find(a=>a.n===p.n)?.id,source=sourceDividendEvents().filter(e=>String(e.sourceAssetId)===String(id)&&['pending','review'].includes(e.state)),rows=distributionRows().filter(t=>String(t.sourceAssetId)===String(id)).map(t=>({date:t.date,state:'received',receiptId:t.id,totalSAR:t.totalCostSAR})),all=[...rows,...source].filter(e=>Date.parse(e.date)>=start&&Date.parse(e.date)<=end).sort((a,b)=>a.date.localeCompare(b.date)),groups=[];
 for(const state of ['received','pending']){let last=null;for(const e of all.filter(e=>(e.state==='review'?'pending':e.state)===state)){const x=Math.max(18,Math.min(571,X(e.date)));if(last&&Math.abs(x-last.x)<20)last.rows.push(e);else {last={x,state,rows:[e]};groups.push(last);}}}window._chartDividendGroups=groups;
 return `<g class="dividend-track">${[['received',274,'مسجّل','#4fd8ff'],['pending',299,'راجع','#f5c76a']].map(([state,y,label,color])=>`<line x1="8" x2="580" y1="${y}" y2="${y}" stroke="${color}" opacity=".12"/><text x="628" y="${y+3}" text-anchor="end" fill="${color}" font-size="9">${label}</text>${groups.map((g,i)=>g.state!==state?'':`<g class="dividend-marker ${state}" data-dividend-group="${i}" role="button" tabindex="0" aria-label="${label} · ${g.rows[0].date} · ${g.rows.length} توزيعات" onclick="openChartDividend(${i})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openChartDividend(${i})}"><title>${label} · ${g.rows[0].date} · اضغط للتفاصيل</title><circle cx="${g.x}" cy="${y}" r="12" fill="transparent"/><circle cx="${g.x}" cy="${y}" r="8" fill="${state==='received'?'#14556b':'#052333'}" stroke="${color}"/><text x="${g.x}" y="${y+3.5}" text-anchor="middle" fill="${color}" font-size="11">${g.rows.length>1?g.rows.length:state==='pending'?'!':'$'}</text></g>`).join('')}`).join('')}</g>`;
}
function openChartDividend(i){const g=window._chartDividendGroups?.[i];if(!g)return;if(g.rows.length===1)return g.rows[0].receiptId!=null?openDividendDetail(g.rows[0].receiptId):openSourceDividend(g.rows[0].key);activeDialog=null;openHolo(`<div class="dividends-dialog">${modalHead('DIVIDEND EVENTS','توزيعات متقاربة على التشارت')}${g.rows.map(e=>e.receiptId!=null?dividendRecordHTML(distributionRows().find(t=>String(t.id)===String(e.receiptId))):sourceDividendRow(e)).join('')}</div>`);}
function dividendOnlyChartHTML(p){const start=Date.parse(todayS())-365*86400000,end=Date.parse(todayS()),X=d=>8+(Date.parse(d)-start)/(end-start)*572;return `<div class="dividend-chart-note">خط التوزيعات مستقل عن توفر السعر · آخر سنة حتى اليوم</div><svg viewBox="0 250 640 67" style="width:100%">${chartDividendMarkers(p,start,end,X)}</svg>`;}
function showDividendChartTip(event,i){const g=window._chartDividendGroups?.[i],tip=$('chartHover'),box=$('assetHistory')?.getBoundingClientRect();if(!g||!tip||!box)return;tip.hidden=false;tip.innerHTML=`<b>${g.state==='received'?'توزيع مسجّل':g.state==='pending'?'توزيع للمراجعة':'توزيع قادم'}</b><strong class="n">${esc(g.rows[0].date)}</strong><small>${g.rows.length>1?g.rows.length+' دفعات متقاربة':g.rows[0].status==='estimated'?'موعد تقديري':'اضغط للتفاصيل والتسجيل'}</small>`;tip.style.left=Math.max(4,Math.min(box.width-tip.offsetWidth-4,event.clientX-box.left+14))+'px';tip.style.top=Math.max(4,event.clientY-box.top-tip.offsetHeight-14)+'px';}

function openDividendMonth(month,sourceAssetId='all'){const applies=e=>e.date.slice(0,7)===month&&(sourceAssetId==='all'||String(e.sourceAssetId)===String(sourceAssetId)),rows=distributionRows().filter(applies),events=sourceDividendEvents().filter(e=>e.state!=='received'&&applies(e));activeDialog=null;openHolo(`<div class="dividends-dialog">${modalHead('MONTHLY DIVIDENDS','توزيعات '+month)}<div class="sect">المستلم المسجّل</div>${rows.map(dividendRecordHTML).join('')||'<p class="dividend-note">لا دفعات مسجّلة لهذا الشهر.</p>'}<div class="sect">مواعيد المصدر · للمراجعة أو قادمة</div>${events.map(sourceDividendRow).join('')||'<p class="dividend-note">لا مواعيد من المصدر لهذا الشهر.</p>'}<button class="fbtn sm ghost" onclick="openDividends()">كل التوزيعات</button></div>`);}

let dividendForm=null;
let dividendMarket={key:'',loading:false,results:[],error:'',at:0};
function dividendArg(value){return esc(JSON.stringify(String(value)));}
function dividendUnit(value,currency){return fmt(value,4)+' '+esc(currency);}
function distributionRows(){return S.dividends||[];}
function distributionSummary(year='all',sourceAssetId='all'){return parent.dividendLedger.dividendSummary(distributionRows(),{year,sourceAssetId});}
function dividendRecent(rows){const since=new Date(todayS());since.setUTCFullYear(since.getUTCFullYear()-1);const cutoff=since.toISOString().slice(0,10);return rows.filter(t=>t.date>cutoff&&t.date<=todayS());}
function dividendSum(rows){return rows.reduce((s,t)=>s+Number(t.totalCostSAR),0);}
function dividendSource(n){return dividendMarket.results.find(r=>r.symbol===AS[n]?.yh);}
function sourceDividendEvents(){return parent.dividendLedger.dividendEvents(ENGINE.assets(),parent.commandStorage.raw().txns,dividendMarket.results,todayS()).map(e=>{const rate=e.currency==='SAR'?1:e.currency==='GBp'?FX.GBP/100:FX[e.currency];return {...e,n:ENGINE.clean(e.name),totalSAR:e.currency&&rate>0?e.qty*e.perShare*rate:null};});}
function dividendForecasts(sourceAssetId='all'){return sourceDividendEvents().filter(e=>e.state==='upcoming'&&(sourceAssetId==='all'||String(e.sourceAssetId)===String(sourceAssetId)));}
async function loadDividendSources(force=false){
 const assets=S.registry.filter(a=>a.t==='Stock'&&a.yh).map(a=>({symbol:a.yh,issuerUrl:S.customXray?.[a.n]?._csvUrl||XRAY_DATA[a.n]?._csvUrl||null}));const key=JSON.stringify(assets);
 if(dividendMarket.loading||(!force&&dividendMarket.key===key&&Date.now()-dividendMarket.at<43200000))return;
 dividendMarket={key,loading:true,results:dividendMarket.key===key?dividendMarket.results:[],error:'',at:Date.now()};
 const button=$('dvSourceRefresh');if(button){button.disabled=true;button.textContent='جاري قراءة المصادر…';}
 try{const r=await ENGINE.market('getDividends',assets,{refresh:force});if(!r?.ok)throw Error(r?.error||'تعذّر قراءة التوزيعات');dividendMarket.results=r.results||[];}
 catch(e){dividendMarket.error=e.message;}
 finally{dividendMarket.loading=false;renderLab();stBell();notifyDividendUpdates();
  if(activeDialog&&['openDividends','openAsset','openSourceDividend','openDividendReminders'].includes(activeDialog.fn)&&$('ov').classList.contains('open')){
   const scroll=$('hb').scrollTop,as=document.querySelector('.asset-scroll')?.scrollTop;refreshingDialog=true;try{window[activeDialog.fn](...activeDialog.args);}finally{refreshingDialog=false;$('hb').scrollTop=scroll;const el=document.querySelector('.asset-scroll');if(el&&as!=null)el.scrollTop=as;}
  }
 }
}
function dividendRecordHTML(t){return `<button class="dividend-record" onclick="openDividendDetail(${dividendArg(t.id)})"><i class="ti ti-coin"></i><span class="dividend-record-name"><b>توزيع · ${esc(t.sourceAssetName)}</b><small><span class="n">${esc(t.date)}</span>${t.dividendShares?` · <span class="n">${fmt(t.dividendShares,4)} × ${dividendUnit(t.dividendPerShare,t.currency)}</span>`:' · '+esc(t.assetName)}</small></span><span class="dividend-record-value"><b class="n">+${fmtC(t.totalCostSAR)}</b><small class="n">${natTot(t.qty,t.currency)}</small></span><i class="ti ti-chevron-left"></i></button>`;}
function dividendDashboardHTML(){const d=distributionSummary();return `<button class="dividend-summary" onclick="openDividends()"><span><i class="ti ti-coins"></i> التوزيعات<small>الدخل من أسهمك وصناديقك · ${distributionRows().length} دفعات</small></span><b class="n">${fmtC(d.allTime)}</b><i class="ti ti-chevron-left"></i></button>`;}
function dividendTimelineHTML(rows,upcoming,sourceAssetId='all'){
 const pending=sourceDividendEvents().filter(e=>['pending','review'].includes(e.state)&&(sourceAssetId==='all'||String(e.sourceAssetId)===String(sourceAssetId))),now=new Date(todayS()),months=Array.from({length:24},(_,i)=>{const d=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-11+i,1)),key=d.toISOString().slice(0,7),check=pending.filter(e=>e.date.slice(0,7)===key);return {key,label:d.toLocaleDateString('ar',{month:'short',timeZone:'UTC'}),received:dividendSum(rows.filter(t=>t.date.slice(0,7)===key)),events:upcoming.filter(e=>e.date.slice(0,7)===key),pending:check.filter(e=>e.state==='pending'&&e.totalSAR!=null).reduce((s,e)=>s+e.totalSAR,0),reviewCount:check.length};}),max=Math.max(1,...months.map(m=>Math.max(m.received,m.pending))),dotHeight=Math.max(24,...months.map(m=>m.events.length*22));
 return `<div class="dividend-chart-legend"><span><i></i> مستلم · قيمة</span><span><i class="upcoming-dot-key"></i> قادم · نقطة لكل توزيعة</span><span><i class="pending-key"></i> للمراجعة</span><span class="mu">12 شهرًا ماضية + 12 قادمة</span></div><div class="dividend-month-chart" style="--dividend-dot-height:${dotHeight}px" aria-label="قيم التوزيعات المستلمة ونقاط مواعيد التوزيعات القادمة">${months.map((m,i)=>`<div class="dividend-month-column ${i===11?'is-now':''}"><button class="dividend-month" onclick="openDividendMonth(${dividendArg(m.key)},${dividendArg(sourceAssetId)})" title="${m.key} · مستلم ${fmtC(m.received)} · ${m.events.length} توزيعات قادمة · ${m.reviewCount} للمراجعة"><div class="dividend-bars">${i===11?'<small>الآن</small>':''}<i class="received" style="height:${m.received/max*100}%"></i><i class="pending-bar" style="height:${m.reviewCount?Math.max(4,m.pending/max*100):0}%"></i></div></button><div class="dividend-date-dots">${m.events.map(e=>{const label=e.n+' · '+e.date+' · '+(e.status==='announced'?'معلن':'تقديري')+' · '+(e.dateKind==='payment'?'موعد الدفع':'تاريخ الاستبعاد');return `<button class="dividend-date-dot ${e.status==='announced'?'announced':'estimated'}" data-dividend-key="${esc(e.key)}" onclick="openSourceDividend(${dividendArg(e.key)})" title="${esc(label)}" aria-label="${esc(label)}"></button>`;}).join('')}</div><span data-short-month="${i%2===0||i===11?m.key.slice(5):'·'}">${i%2===0||i===11?m.label:'·'}</span><em class="n">${m.key.slice(2,4)}</em></div>`).join('')}</div><p class="dividend-note">${upcoming.length} مواعيد قادمة · كل نقطة تفتح تفاصيل توزيعة، حتى لو المبلغ غير متاح. النقطة المفرّغة تقديرية والممتلئة معلنة.</p>`;
}
function dividendUpcomingHTML(e,i){return `<div class="dividend-upcoming"><div><div class="dividend-upcoming-title"><b>${esc(e.n)}</b><span class="pill ${e.status==='announced'?'up':''}">${e.status==='announced'?'معلن':'تقديري'}</span></div><small><span class="n">${esc(e.date)}</span> · ${e.dateKind==='payment'?'موعد الدفع':'تاريخ الاستبعاد؛ الدفع غير متاح'}</small><small>${e.currency?`<span class="n">${fmt(e.qty,4)} × ${dividendUnit(e.perShare,e.currency)}</span>`:'عملة التوزيع غير مؤكدة · لا نقدّر المبلغ'}</small><small>${/^https:\/\//.test(e.url||'')?`<a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${esc(e.source)} ↗</a>`:esc(e.source)}</small></div><div><b class="n">${e.totalSAR==null?'—':'≈ '+fmtC(e.totalSAR)}</b><button class="fbtn sm ghost" onclick="openSourceDividend(${dividendArg(e.key)})">تفاصيل الموعد</button></div></div>`;}
function openDividends(year='all',sourceAssetId='all'){
 const rows=distributionRows(),recent=dividendRecent(rows),d=distributionSummary(year,sourceAssetId),selected=rows.filter(t=>sourceAssetId==='all'||String(t.sourceAssetId)===String(sourceAssetId)),trailing=dividendRecent(selected),total=dividendSum(trailing),upcoming=dividendForecasts(sourceAssetId),expected=upcoming.filter(e=>e.totalSAR!=null),cost=S.POS.filter(p=>p.t==='Stock'&&(sourceAssetId==='all'||String(p.id)===String(sourceAssetId))).reduce((s,p)=>s+p.cost,0),taxRows=trailing.filter(t=>t.dividendWithholding!=null),tax=taxRows.reduce((s,t)=>s+t.dividendWithholding*t.rate,0),years=[...new Set(rows.map(t=>t.date.slice(0,4)))].sort().reverse(),sources=[...new Map([...rows.map(t=>[String(t.sourceAssetId),t.sourceAssetName]),...S.registry.filter(a=>a.t==='Stock').map(a=>[String(a.id),a.n])]).entries()];
 window._dividendUpcoming=upcoming;
 const groups=parent.dividendLedger.dividendSummary(trailing).byAsset,max=Math.max(1,...groups.map(g=>g.total)),failed=dividendMarket.results.filter(r=>!r.ok).length,hasSources=dividendMarket.results.some(r=>r.ok),forecastValue=expected.length?'≈ '+fmtC(expected.reduce((s,e)=>s+e.totalSAR,0)):hasSources&&!upcoming.length?'لا توقع متاح':'—';
 openHolo(`<div class="dividends-dialog"><div class="mh"><div><div class="code">DIVIDEND INCOME</div><h2>التوزيعات</h2><div class="full">الدخل الحقيقي من أسهمك وصناديقك</div></div><div class="px"><div class="mu">صافي آخر 12 شهرًا</div><b class="n">${fmtC(total)}</b><div class="mu n">≈ ${fmtC(total/12)} / شهر</div></div></div><div class="kg">${cell('من بداية السنة',fmtC(dividendSum(selected.filter(t=>t.date.slice(0,4)===todayS().slice(0,4)&&t.date<=todayS()))),'up')}${cell('متوقع خلال 12 شهرًا',forecastValue+`<small class="dividend-coverage">القيمة متاحة لـ <bdi>${expected.length}</bdi> من <bdi>${upcoming.length}</bdi> مواعيد</small>`)}${cell('دخل 12 شهرًا / التكلفة الحالية',cost?fmt(total/cost*100,2)+'%':'—')}${cell('الاستقطاع المسجّل · 12 شهرًا',taxRows.length?fmtC(tax):'غير مسجّل')}</div><div class="dividend-toolbar"><label class="ff">السنة<select class="fi" id="dvYear" onchange="openDividends(this.value,$('dvSourceFilter').value)"><option value="all">كل السنوات</option>${years.map(y=>`<option value="${y}" ${String(year)===y?'selected':''}>${y}</option>`).join('')}</select></label><label class="ff">الأصل<select class="fi" id="dvSourceFilter" onchange="openDividends($('dvYear').value,this.value)"><option value="all">كل الأصول</option>${sources.map(([id,name])=>`<option value="${esc(id)}" ${String(sourceAssetId)===id?'selected':''}>${esc(name)}</option>`).join('')}</select></label><button class="fbtn sm" onclick="openDividendForm()"><i class="ti ti-plus"></i> إضافة توزيع</button></div><div class="dividend-layout"><section><div class="sect">الدخل الشهري</div>${dividendTimelineHTML(selected,upcoming,sourceAssetId)}<div class="section-heading"><h3>التوزيعات المستلمة</h3><span class="n mu">${d.rows.length} دفعات · ${fmtC(d.total)}</span></div><div class="dividend-receipts">${d.rows.map(dividendRecordHTML).join('')||'<div class="empty">لم تسجّل توزيعات بهذا الاختيار بعد.</div>'}</div></section><aside><div class="sect">حسب الأصل · آخر 12 شهرًا</div>${groups.map(g=>{const p=S.POS.find(p=>String(p.id)===g.id),r=dividendSource(g.name);return `<button class="dividend-asset" onclick="openDividends(${dividendArg(year)},${dividendArg(g.id)})"><span class="dividend-asset-top"><b>${esc(g.name)}</b><span class="dividend-asset-bar"><i style="width:${g.total/max*100}%"></i></span><strong class="n">${fmtC(g.total)}</strong></span><small>${p?.cost?fmt(g.total/p.cost*100,2)+'% على التكلفة الحالية':'أصل مغلق / تكلفة غير متاحة'} · ${dividendFrequency(r?.frequency)}</small></button>`;}).join('')||'<p class="dividend-note">يظهر هنا دخل كل أصل بعد تسجيل الإيداعات.</p>'}${pendingDividendHTML(sourceAssetId)}<div class="sect">التوزيعات القادمة · ${upcoming.length}</div><div class="dividend-upcoming-list">${upcoming.map(dividendUpcomingHTML).join('')||`<p class="dividend-note">${dividendMarket.loading||!dividendMarket.at?'جاري قراءة المصادر…':dividendMarket.error?'تعذّر تحميل المصادر حاليًا':'لا مواعيد قادمة قابلة للتقدير من البيانات المتاحة.'}</p>`}</div><p class="dividend-note">المواعيد من إعلانات المصدر أو تقدير من سجل توزيعاته، وليست من إيداعاتك المسجّلة. المبالغ قبل الاستقطاع وبسعر الصرف الحالي. المواعيد التقديرية ليست إعلانات مؤكدة، ولا تُضاف إلى رصيدك تلقائيًا.${upcoming.some(e=>e.totalSAR==null)?' بعض المبالغ مستبعدة لعدم تأكد عملة التوزيع.':''}${failed?' بيانات '+failed+' أصول غير متاحة.':''}${taxRows.length<trailing.length&&trailing.length?' الاستقطاع المعروض يشمل الدفعات التي سُجلت تفاصيلها فقط.':''}</p><button class="fbtn sm ghost" id="dvSourceRefresh" onclick="loadDividendSources(true)" ${dividendMarket.loading?'disabled':''}><i class="ti ti-refresh"></i> ${dividendMarket.loading?'جاري القراءة…':'تحديث المصادر'}</button></aside></div></div>`);
 loadDividendSources();
}
function dividendFrequency(n){return ({12:'شهري',4:'ربع سنوي',2:'نصف سنوي',1:'سنوي'})[n]||'الدورية غير مؤكدة';}
function assetDividendHTML(n,p){
 if(p.t!=='Stock')return '';
 const id=S.registry.find(a=>a.n===n)?.id,rows=distributionRows().filter(t=>String(t.sourceAssetId)===String(id)),total=dividendSum(rows),trailing=dividendSum(dividendRecent(rows)),benefit=(!p.qty||p.hasPx)?(p.pnl||0)+(p.realized||0)+total:null,next=dividendForecasts(id)[0];
 return `<section class="asset-dividends"><div class="sect"><i class="ti ti-coins"></i> التوزيعات</div><div class="kg2">${cell('آخر 12 شهرًا',fmtC(trailing),'up')}${cell('الدخل / التكلفة الحالية',p.cost?fmt(trailing/p.cost*100,2)+'%':'—')}${cell('الربح الكلي مع التوزيعات',benefit==null?'السعر غير متاح':fmtC(benefit),benefit<0?'dn':'up')}${cell(next?.status==='announced'?'القادم المعلن':'القادم المتوقع',next?`<span class="dividend-next-date">${esc(next.date)}</span><small>${next.totalSAR==null?'المبلغ غير متاح':'≈ '+fmtC(next.totalSAR)}</small>`:dividendMarket.loading?'جاري القراءة…':'غير متاح')}</div>${rows.slice(0,3).map(dividendRecordHTML).join('')}${!rows.length?'<p class="dividend-note">لا توزيعات مسجّلة لهذا الأصل بعد.</p>':''}<div class="factions"><button class="fbtn sm" onclick="openDividendForm(${dividendArg(n)})"><i class="ti ti-plus"></i> إضافة توزيع</button><button class="fbtn sm ghost" onclick="openDividends('all',${dividendArg(id)})">كل التوزيعات</button></div></section>`;
}
function openDividendDetail(id){
 const t=distributionRows().find(t=>String(t.id)===String(id));if(!t)return;
 const source=S.registry.find(a=>String(a.id)===String(t.sourceAssetId)),cost=t.dividendCostSAR,withheld=t.dividendWithholding,gross=withheld!=null?Number(t.qty)+Number(withheld):null,recent=dividendRecent(distributionRows().filter(r=>String(r.sourceAssetId)===String(t.sourceAssetId))),p=S.POS.find(p=>String(p.id)===String(t.sourceAssetId));
 openHolo(`<div class="dividends-dialog dividend-detail"><div class="mh"><div><div class="code">DIVIDEND RECEIPT</div><h2>توزيع · ${esc(t.sourceAssetName)}</h2><div class="full"><span class="n">${esc(t.date)}</span> · ${esc(source?.full||t.sourceAssetName)}</div></div><div class="px"><div class="mu">صافي المستلم</div><b class="n">+${fmtC(t.totalCostSAR)}</b><div class="n mu">${natTot(t.qty,t.currency)}</div></div></div><div class="kg">${cell('توزيع الوحدة · بعملة الحساب',t.dividendPerShare?dividendUnit(t.dividendPerShare,t.currency):'غير مسجّل')}${cell('الكمية المستحقة المسجّلة',t.dividendShares?fmt(t.dividendShares,4):'غير مسجّل')}${cell('الإجمالي قبل الاستقطاع',gross==null?'غير مسجّل':natTot(gross,t.currency))}${cell('الاستقطاع',withheld==null?'غير مسجّل':natTot(withheld,t.currency))}</div><div class="dividend-layout"><section><div class="sect">العائد</div><div class="kg2">${cell('هذه الدفعة / التكلفة بتاريخها',cost>0?fmt(t.totalCostSAR/cost*100,2)+'%':'غير متاح','up')}${cell('دخل 12 شهرًا / التكلفة الحالية',p?.cost?fmt(dividendSum(recent)/p.cost*100,2)+'%':'—')}${cell('دخل 12 شهرًا / القيمة الحالية',p?.hasPx&&p.val>0?fmt(dividendSum(recent)/p.val*100,2)+'%':'—')}${cell('سعر الصرف المسجّل',fmt(t.rate,6)+' SAR / '+esc(t.currency))}</div><p class="dividend-note">نسب آخر 12 شهرًا تستخدم الدفعات المسجّلة فعلًا. لا نحول دفعة واحدة إلى عائد سنوي مفترض.</p></section><aside><div class="sect">الحساب المستلم</div><div class="row"><div class="nm"><b>${esc(t.assetName)}</b><small class="mu">إيداع نقدي</small></div><b class="n">+${natTot(t.qty,t.currency)}</b></div><div class="sect">ملاحظة</div><p class="dividend-note">${esc(t.remarks||'—')}</p><div class="factions"><button class="fbtn sm" onclick="openDividendForm(null,${dividendArg(t.id)})"><i class="ti ti-pencil"></i> تعديل</button><button class="fbtn sm ghost" onclick="openDividends()">كل التوزيعات</button><button class="fbtn sm wr" onclick="deleteDividend(${dividendArg(t.id)})">حذف</button></div>${source?`<button class="fbtn sm ghost" onclick="openAsset(${dividendArg(source.n)})">العودة للأصل</button>`:''}</aside></div></div>`);
}
function registerExpectedDividend(i){const e=window._dividendUpcoming?.[i];if(!e)return;openDividendForm(e.n);$('dvNote').value=`${e.status==='announced'?'موعد معلن':'تقدير من السجل'} · ${e.date} · ${e.source}${e.currency?' · '+e.perShare+' '+e.currency+' للوحدة':''} — راجع إشعار الوسيط وأدخل صافي ما استلمته`;dividendPreview();}

function openDividendForm(name,id){
 const old=id!=null?ENGINE.rawTxn(id):null,list=ENGINE.assets(),sources=list.filter(a=>a.type==='Stock'),accounts=list.filter(a=>a.type==='Cash');
 if(!sources.length||!accounts.length){toast('أضف سهمًا أو صندوقًا وحسابًا نقديًا أولًا','ti-info-circle');return openSettings('assets');}
 if(id!=null&&!old){toast('الحركة غير موجودة','ti-alert-triangle');return;}
 const source=old?sources.find(a=>String(a.id)===String(old.sourceAssetId)):sources.find(a=>ENGINE.clean(a.name)===name),account=accounts.find(a=>a.name===old?.assetName)||accounts[0];
 dividendForm={id:old?.id,expected:old?JSON.stringify(old):null,eventKey:old?.dividendEventKey||'',sourceId:source?.id,busy:false};activeDialog=null;
 openHolo(`<div class="dividend-form">${modalHead('DIVIDEND DEPOSIT',old?'تعديل إيداع توزيعات':'إيداع توزيعات','سجّل صافي المبلغ الذي دخل حسابك بعد أي ضريبة أو رسوم')}<div class="mg"><div class="fgrid"><label class="ff">السهم أو الصندوق الموزّع<select class="fi" id="dvAsset" onchange="dividendPreview()"><option value="">اختر الأصل</option>${sources.map(a=>`<option value="${esc(a.id)}" ${String(a.id)===String(source?.id)?'selected':''}>${esc(a.name)}</option>`).join('')}</select></label><label class="ff">الحساب المستلم<select class="fi" id="dvAccount" onchange="dividendAccountChanged()">${accounts.map(a=>`<option value="${esc(a.id)}" ${String(a.id)===String(account.id)?'selected':''}>${esc(a.name)} · ${esc(a.currency)}</option>`).join('')}</select></label><label class="ff">تاريخ الاستلام<input class="fi num" type="date" id="dvDate" value="${old?.date||todayS()}" oninput="dividendPreview()"></label><label class="ff"><span class="dividend-field-label">صافي المبلغ <span class="n" id="dvCurrency"></span></span><input class="fi num" type="number" min="0" step="any" inputmode="decimal" id="dvAmount" value="${old?Number(old.qty):''}" oninput="dividendPreview()"></label><label class="ff full"><span class="dividend-field-label">سعر الصرف وقت الاستلام <span class="n" id="dvRateLabel"></span></span><input class="fi num" type="number" min="0" step="any" id="dvRate" oninput="dividendPreview()"></label><details class="dividend-extra full" ${old?.dividendShares||old?.dividendWithholding!=null?'open':''}><summary>تفاصيل الدفعة والاستقطاع (اختياري)</summary><p class="dividend-note">كل المبالغ التالية بعملة الحساب المستلم. اتركها فارغة إذا لم تكن مذكورة في إشعار الوسيط.</p><div class="fgrid"><label class="ff">الكمية المستحقة<input class="fi num" id="dvShares" type="number" min="0" step="any" value="${old?.dividendShares??''}" oninput="dividendPreview()"></label><label class="ff">توزيع الوحدة بعملة الحساب<input class="fi num" id="dvPerShare" type="number" min="0" step="any" value="${old?.dividendPerShare??''}" oninput="dividendPreview()"></label><label class="ff full">الاستقطاع بعملة الحساب<input class="fi num" id="dvWithholding" type="number" min="0" step="any" value="${old?.dividendWithholding??''}" oninput="dividendPreview()"></label></div></details><label class="ff full">ملاحظة (اختياري)<input class="fi" id="dvNote" maxlength="4000" value="${esc(old?.remarks||'')}" placeholder="مثال: توزيع الربع الثالث"></label></div><aside><div class="dividend-preview" id="dvPreview"></div><p class="dividend-note">أدخل المبلغ بعملة الحساب المستلم. إذا كان الإيداع مسجّلًا مسبقًا، صنّفه كتوزيعات من نافذة الحركة لتجنب تكراره.</p><div id="dvMessage" role="status"></div><div class="factions"><button class="fbtn" id="dvSave" onclick="saveDividendForm()">${old?'حفظ التعديل':'حفظ إيداع التوزيعات'}</button><button class="fbtn ghost" onclick="openDividends()">رجوع للتوزيعات</button></div></aside></div></div>`);
 dividendAccountChanged(old?.rate);
}
function dividendInput(){return {id:dividendForm.id,expected:dividendForm.expected,sourceAssetId:$('dvAsset').value,accountId:$('dvAccount').value,date:$('dvDate').value,amount:$('dvAmount').value,rate:$('dvRate').value,note:$('dvNote').value,dividendShares:$('dvShares').value,dividendPerShare:$('dvPerShare').value,dividendWithholding:$('dvWithholding').value,dividendEventKey:String(dividendForm.sourceId)===$('dvAsset').value?dividendForm.eventKey:''};}
function dividendAccountChanged(rate){const a=ENGINE.assets().find(a=>String(a.id)===$('dvAccount').value),c=a?.currency||'SAR';$('dvCurrency').textContent=c;$('dvRateLabel').textContent='SAR / '+c;$('dvRate').value=rate??(c==='GBp'?(FX.GBP||0)/100:FX[c]||'');$('dvRate').readOnly=c==='SAR';if(c==='SAR')$('dvRate').value=1;dividendPreview();}
function dividendPreview(){
 if(!$('dvSave')||dividendForm?.busy)return;
 try{const p=ENGINE.previewDividend(dividendInput());$('dvPreview').innerHTML='<div class="sect">أثر الإيداع</div><div class="kg2">'+cell('التوزيعات المضافة',fmtC(p.row.totalCostSAR),'up')+cell('الحساب',esc(ENGINE.clean(p.row.assetName)))+cell('رصيد الحساب بدون هذه الدفعة',fmtC(p.before))+cell('الرصيد بعد حفظ هذه الدفعة',fmtC(p.after),'up')+'</div>';$('dvMessage').textContent='';$('dvSave').disabled=false;}
 catch(e){$('dvPreview').innerHTML='<p class="dividend-note">اختر الأصل وأدخل المبلغ لمعاينة أثره على الحساب.</p>';$('dvMessage').textContent=$('dvAmount').value?e.message:'';$('dvSave').disabled=true;}
}
async function saveDividendForm(){
 if(dividendForm?.busy||!$('dvSave')||$('dvSave').disabled)return;
 const input=dividendInput(),form=dividendForm;form.busy=true;$('dvSave').disabled=true;$('dvSave').textContent='جاري الحفظ…';
 try{const id=await ENGINE.saveDividend(input);syncSnapshot();openDividendDetail(id);toast('تم حفظ إيداع التوزيعات','ti-check');}
 catch(e){if($('dvMessage'))$('dvMessage').textContent=e.message;toast(esc(e.message),'ti-alert-triangle');}
 finally{form.busy=false;if($('dvSave')){$('dvSave').textContent=form.id!=null?'حفظ التعديل':'حفظ إيداع التوزيعات';dividendPreview();}}
}
async function deleteDividend(id){if(!confirm('حذف إيداع التوزيعات وخصمه من الحساب النقدي؟'))return;try{await ENGINE.delete(id);syncSnapshot();openDividends();toast('تم حذف الإيداع','ti-check');}catch(e){toast(esc(e.message),'ti-alert-triangle');}}

function enhanceControls(){
 const baseSettings=stBody;window.stBody=function(){let html=baseSettings();
 if(stTab==='events')html+=`<div class="sect">مصادر التقويم</div>`+EV_SRC.map(([k,label,,source])=>srow(label,source,tgl(ST.evOn[k]!==false,`saveEventSource('${k}',${ST.evOn[k]===false})`))).join('')+srow('حد تأثير الشركات داخل الصناديق','من إجمالي ثروتك',`<select class="fi" onchange="stEvMin(this.value)">${[.25,.5,1].map(v=>`<option value="${v}" ${ST.evMin===v?'selected':''}>${v}%</option>`).join('')}</select>`);
 if(stTab==='display')html+=srow('حماية الشاشة','إزاحة خفيفة أثناء العرض الهادئ',tgl(ST.burn,"saveCC('burn',!ST.burn)"))+`<button class="fbtn" onclick="closeHolo();enterAmb(true)">تشغيل الشاشة الحية</button>`;
 if(stTab==='data')html=freshnessSettings()+html+'<div class="sect">حالة الاتصال</div>'+Object.entries(S.status.market||{}).map(([k,v])=>srow(k,(v.ok?'وصل رد من المصدر':'غير متاح')+' · '+new Date(v.at).toLocaleTimeString(),v.ok?'●':'○')).join('')+`<button class="fbtn" onclick="refreshLive(this)">اختبار وتحديث المصادر</button>`;
 if(stTab==='general')html+=srow('إدراج المصادر غير المحققة','يؤثر على إجمالي الثروة',tgl(S.includeUnrealized,"safeAction(()=>ENGINE.setting('includeUnrealized',String(!S.includeUnrealized)))"));return html;};

 document.addEventListener('keydown',e=>{if(e.key!=='Tab'||!$('ov').classList.contains('open'))return;const list=[...$('holo').querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex="0"]')].filter(x=>x.getClientRects().length);if(!list.length)return;const first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
}
function openZakatBreakdown(i){const r=S.zakat.rows[i];if(!r)return;openHolo(modalHead('ZAKAT BREAKDOWN',r.name,esc(r.src))+`<div class="kg2">${cell('قيمة الأصل',fmtC(r.val))}${cell('النسبة',fmt(r.ratio*100,2)+'%')}${cell('القيمة الزكوية',fmtC(r.zVal))}${cell('الحالة',r.warn?'بيانات ناقصة — احتياطي':'من المحرّك')}</div>`+(r.fund?`<div class="sect">مكوّنات الصندوق</div>`+r.fund.top.map(c=>`<div class="row"><div class="nm">${esc(c.name||c.ticker)}<small>${c.missing?'نسبة احتياطية':esc(c.src||'من البيانات المحفوظة')}</small></div><span class="n">وزن ${fmt(c.w,2)}% · نسبة ${fmt((c.ratio??c.fin)*100,2)}%</span></div>`).join('')+`<div class="sub">المكوّنات غير المغطاة: ${fmt(r.fund.rest,2)}%، حسب قاعدة المحرّك.</div>`:r.co?`<pre style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(JSON.stringify(r.co.calc||{ratio:r.ratio},null,2))}</pre>`:'')+`<button class="fbtn" onclick="openZakat()">رجوع</button>`);}

// Keep every marker inside its labelled category wedge, regardless of event count.
// Radial distance continues to encode the event date.


async function saveCC(k,v){await safeAction(()=>ENGINE.setting('commandCenter',{...S.cc,[k]:v}));syncSnapshot();if($('stBody'))stRefresh();}


async function saveRetire(v){const n=+v;if(!(n>0))return;await safeAction(()=>ENGINE.setting('retireGoal',n*(FX[baseCur]||1)));syncSnapshot();}






async function addRegistry(){const name=$('ccName').value.trim(),type=$('ccType').value,currency=$('ccCurrency').value.trim(),yahooSym=$('ccSymbol').value.trim();if(!name||!currency)return toast('أدخل الاسم والعملة','ti-alert-triangle');const list=ENGINE.assets();if(list.some(a=>a.name===name))return toast('الاسم موجود','ti-alert-triangle');list.push({id:Date.now(),name,type,currency,yahooSym});await safeAction(()=>ENGINE.saveAssets(list));syncSnapshot();stRefresh();}





async function removeAlert(i){const list=JSON.parse(parent.commandStorage.raw().settings.priceAlerts||'[]');list.splice(i,1);await safeAction(()=>ENGINE.setting('priceAlerts',list));syncSnapshot();stRefresh();}

function removeEvent(i){return saveCC('events',(ST.events||[]).filter((_,j)=>j!==i));}



async function toggleOther(i){const list=ENGINE.others();list[i].included=list[i].included===false;await safeAction(()=>ENGINE.saveOthers(list));syncSnapshot();stRefresh();}
async function removeOther(i){if(!confirm('حذف المصدر؟'))return;const list=ENGINE.others();list.splice(i,1);await safeAction(()=>ENGINE.saveOthers(list));syncSnapshot();stRefresh();}
function openRegistryEditor(i){const a=ENGINE.assets()[i],n=ENGINE.clean(a.name),d=S.customXray[a.name]||XRAY_DATA[n]||{};activeDialog=null;openHolo(modalHead('ASSET CONFIGURATION',a.name)+`<div class="fgrid"><label class="ff">رمز Yahoo<input class="fi" id="edYahoo" value="${esc(a.yahooSym||'')}"></label><label class="ff">رمز TradingView<input class="fi" id="edTv" value="${esc(a.tvSym||'')}"></label><label class="ff">الدولة (ISO)<input class="fi" id="edCountry" value="${esc(a.country||'')}"></label><label class="ff">القطاع<input class="fi" id="edSector" value="${esc(a.sector||'')}"></label><label class="ff full">رابط ملف المكوّنات<input class="fi" id="edLink" dir="ltr" value="${esc(d._csvUrl||'')}"></label></div><div class="factions"><button class="fbtn" onclick="saveRegistryEditor(${i})">حفظ</button><button class="fbtn" onclick="refreshRegistryHoldings(${i},this)">تحديث المكوّنات</button></div><div class="sect">محرر المكوّنات اليدوي</div><p class="sub">JSON: countries وsectors نسب مئوية، وtop قوائم [الرمز، الاسم، الدولة، الوزن].</p><textarea class="fi" id="edComposition" dir="ltr" rows="9">${esc(JSON.stringify({countries:d.countries||{},sectors:d.sectors||{},top:d.top||[],kind:d.kind||'etf'},null,2))}</textarea><button class="fbtn" onclick="saveComposition(${i})">حفظ التركيبة</button>`);}
function editRegistry(i){openRegistryEditor(i);}
async function saveRegistryEditor(i){const list=ENGINE.assets(),a=list[i];a.yahooSym=$('edYahoo').value.trim();a.tvSym=$('edTv').value.trim();a.country=$('edCountry').value.trim().toUpperCase();a.sector=$('edSector').value.trim();const url=$('edLink').value.trim();if(url&&!/^https:\/\//i.test(url))return toast('الرابط يجب أن يبدأ بـ https','ti-alert-triangle');await safeAction(()=>ENGINE.saveAssets(list));const cx={...S.customXray};cx[a.name]={...(cx[a.name]||XRAY_DATA[ENGINE.clean(a.name)]||{}),_csvUrl:url};await safeAction(()=>ENGINE.setting('customXray',cx));syncSnapshot();toast('تم الحفظ','ti-check');}
async function saveComposition(i){try{const a=ENGINE.assets()[i],d=JSON.parse($('edComposition').value);if(!d.countries||!d.sectors||!Array.isArray(d.top)||d.top.length>200)throw Error('تركيبة غير صالحة');for(const values of [Object.values(d.countries),Object.values(d.sectors),d.top.map(t=>t[3])])if(values.some(x=>!Number.isFinite(x)||x<0||x>100)||values.reduce((s,v)=>s+v,0)>100.1)throw Error('الأوزان بين 0 و100 ومجموعها لا يتجاوز 100');if(d.top.some(t=>t.length<4||typeof t[0]!=='string'||typeof t[1]!=='string'||!/^[A-Z]{2}$/.test(t[2])))throw Error('راجع رموز الشركات والدول');await safeAction(()=>ENGINE.setting('customXray',{...S.customXray,[a.name]:{...S.customXray[a.name],...d,_at:new Date().toISOString()}}));syncSnapshot();toast('حُفظت التركيبة','ti-check');}catch(e){toast(esc(e.message),'ti-alert-triangle');}}
async function refreshRegistryHoldings(i,b){await saveRegistryEditor(i);b.disabled=true;try{await safeAction(()=>ENGINE.holdings(ENGINE.clean(ENGINE.assets()[i].name)));syncSnapshot();toast('تم تحديث المكوّنات','ti-check');}finally{b.disabled=false;}}
async function saveEventSource(k,on){return saveCC('evOn',{...ST.evOn,[k]:on});}
async function saveZakatTreat(i,value){const r=S.zakat.rows[i],raw=JSON.parse(parent.commandStorage.raw().settings.zakatAsst||'{}');raw[r.key]=value;await safeAction(()=>ENGINE.setting('zakatAsst',raw));syncSnapshot();}

async function toggleAssetVisibility(id){const hidden=new Set((S.marketHidden||[]).map(String));if(hidden.has(String(id)))hidden.delete(String(id));else hidden.add(String(id));await safeAction(()=>ENGINE.setting('marketHidden',[...hidden]));syncSnapshot();if($('stBody'))stRefresh();}


function registrySettings(){const list=ENGINE.assets();return `<div class="section-heading"><div><h3>الأصول والحسابات</h3><p>الإخفاء يغيّر العرض فقط، ويبقى الأصل ضمن حسابات الثروة.</p></div><span class="n">${list.length} أصل</span></div><div class="registry-grid">`+list.map((a,i)=>{const visible=assetVisible(ENGINE.clean(a.name));return `<article class="registry-card ${visible?'':'is-hidden'}"><div class="registry-title"><i class="ti ${KI[a.type]||'ti-briefcase'}"></i><div><b>${esc(a.name)}</b><small>${esc(KLF[a.type]||a.type)} · <span dir="ltr">${esc(a.currency)} ${esc(a.yahooSym||'')}</span></small></div><span class="registry-state">${visible?'ظاهر':'مخفي'}</span></div><div class="registry-actions"><button class="fbtn sm ghost" onclick="toggleAssetVisibility('${a.id}')"><i class="ti ${visible?'ti-eye-off':'ti-eye'}"></i>${visible?'إخفاء':'إظهار'}</button><button class="fbtn sm ghost" onclick="editRegistry(${i})"><i class="ti ti-adjustments"></i>تعديل</button><button class="fbtn sm wr" onclick="deleteRegistry(${i})"><i class="ti ti-trash"></i>حذف</button></div></article>`;}).join('')+`</div><details class="config-panel" id="registryAdd"><summary><i class="ti ti-plus"></i> إضافة أصل أو حساب</summary><div class="fgrid"><label class="ff">الاسم<input id="ccName" class="fi" placeholder="اسم الأصل"></label><label class="ff">النوع<select id="ccType" class="fi"><option value="Stock">أسهم / صندوق</option><option value="Gold">ذهب</option><option value="Property">أملاك</option><option value="Cash">نقدي</option></select></label><label class="ff">العملة<input id="ccCurrency" class="fi" value="SAR" dir="ltr"></label><label class="ff">رمز السوق (اختياري)<input id="ccSymbol" class="fi" dir="ltr" placeholder="AAPL"></label></div><button class="fbtn" onclick="addRegistry()">إضافة الأصل</button></details><details class="config-panel"><summary>تقييم الأملاك</summary>`+PROP.map((p,i)=>srow(p.n,'القيمة السوقية بعملة الأصل',`<input aria-label="قيمة ${esc(p.n)}" class="fi" type="number" min="0" value="${p.val/liveRate(p.c)}" onchange="stPropVal(${i},this.value)">`)).join('')+`</details><details class="config-panel" id="stOther" open><summary>المصادر الأخرى</summary>`+S.OTHER.map((o,i)=>`<div class="other-setting"><div><b>${esc(o.n)}</b><small>${o.inc===false?'مستبعد من الإجمالي':'مدرج في الإجمالي'}</small></div><label class="ff">القيمة (SAR)<input class="fi" type="number" value="${o.v}" onchange="stOtherAmt(${i},this.value)"></label><div class="registry-actions"><button class="fbtn sm ghost" onclick="toggleOther(${i})">${o.inc===false?'إدراج':'استبعاد'}</button><button class="fbtn sm wr" onclick="removeOther(${i})">حذف</button></div></div>`).join('')+`<div class="fgrid"><label class="ff">اسم المصدر<input id="noN" class="fi"></label><label class="ff">القيمة<input id="noV" class="fi" type="number"></label><label class="ff">العملة<select id="noC" class="fi"><option>SAR</option><option>JOD</option><option>USD</option></select></label><button class="fbtn" onclick="stAddOther()">إضافة مصدر</button></div></details>`;}
async function deleteRegistry(i){const a=ENGINE.assets()[i];if(!a)return;const raw=parent.commandStorage.raw();if(raw.txns.some(t=>t.assetName===a.name||String(t.sourceAssetId)===String(a.id))){openHolo(modalHead('ASSET MANAGEMENT',a.name)+`<div class="news-context"><p>هذا الأصل مرتبط بحركات مالية. حذفه من السجل وحده يترك حركات بدون أصل.</p><p>تقدر تخفيه من العرض مع الحفاظ على رصيده وسجله، أو ترجع للحركات وتراجعها أولاً.</p></div><div class="factions"><button class="fbtn" onclick="hideRegistry('${a.id}')">إخفاء الأصل</button><button class="fbtn ghost" onclick="openSettings('assets')">رجوع</button></div>`);return;}if(!confirm('حذف '+a.name+' من سجل الأصول؟'))return;const list=ENGINE.assets();list.splice(i,1);await safeAction(()=>ENGINE.saveAssets(list));syncSnapshot();openSettings('assets');}
async function hideRegistry(id){if(!(S.marketHidden||[]).includes(String(id)))await toggleAssetVisibility(id);openSettings('assets');}
function freshnessSettings(){const st=parent.commandStorage.status();return `<div class="section-heading"><h3>حالة التحديث</h3><button class="fbtn sm" onclick="refreshLive(this)">تحديث الآن</button></div><div class="kg2">${cell('مزامنة المحفظة',st.demo?'وضع التجربة':formatStamp(st.lastSync))}${cell('الاتصال',st.online?'متصل':'غير متصل')}</div><p class="freshness-note">وقت السعر هو وقت آخر تداول أرسله المصدر. قد يبقى قديماً عندما يكون السوق مغلقاً.</p>`+S.registry.filter(a=>a.yh).map(a=>srow(a.n,(a.marketOpen===true?'السوق مفتوح':a.marketOpen===false?'السوق مغلق':'حالة السوق غير متاحة'),`<span class="n">${formatStamp(a.timestamp*1000)}</span>`)).join('');}

function impactOf(item){return TharwaImpact.assess(item,{positions:S.POS,funds:XRAY_DATA,companies:S.XR.companies,total:S.totals.total});}
function impactBadge(item){const a=item.importance||impactOf(item);return `<div class="impact-badges"><span class="impact-badge impact-${a.tier}">${a.label}${a.score==null?'':` · <bdi>${a.score}/100</bdi>`}</span><span>${a.personal?'خطة شخصية':a.pct==null||!a.positions.length?'نسبة الارتباط غير متاحة':`مرتبط بـ <bdi>${fmt(a.pct,1)}%</bdi> من إجمالي المحفظة`}</span>${a.incomplete?'<span>بيانات غير مكتملة</span>':''}</div>`;}
function impactDetail(item){const a=impactOf(item);return `<div class="impact-explanation">${impactBadge(item)}<p>${esc(a.reason)}</p><small>${esc(a.confidence)} · درجة إرشادية، وليست احتمالًا أو نسبة ربح أو خسارة. الدرجة: أهمية الموضوع حتى 50، وحجم الارتباط حتى 35، وقرب الموعد أو حداثة الخبر حتى 15. مرتفعة من 70، ومتوسطة من 40. الخبر غير المؤكد الصلة لا يصنّف مرتفعًا.</small>${a.positions.length?`<p>الأصول المرتبطة: ${a.positions.map(p=>esc(p.name)).join('، ')}</p>`:''}</div>`;}
function ratedNewsRow(x){const a=impactOf(x);return `<div class="nw clk importance-${a.tier}" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openNews(${NEWS.indexOf(x)})}" onclick="openNews(${NEWS.indexOf(x)})"><span class="tg">${esc(x.scope==='macro'?'اقتصاد وأسواق':x.via||x.a)}</span><div class="tx">${esc(x.t)}${impactBadge(x)}<div class="mt">${esc(x.ago)} · ${esc(x.source||'Yahoo')}</div></div></div>`;}
function eventTimeLabel(e){return e.d;}
function radarRow(e,i){const a=e.importance||impactOf(e);return `<div class="row clk radar-event importance-${a.tier} ${evSel===i?'evon':''}" role="button" tabindex="0" onmouseenter="evSel=${i}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}" onclick="${e.on}"><i class="ti ${EV_CAT[e.c]?.[1]||'ti-calendar'}" style="color:${a.color}"></i><div class="nm"><div class="t">${esc(e.t)}</div>${impactBadge(e)}<div class="s">${esc(eventTimeLabel(e))} · ${esc(e.src||e.s||'')}</div><div class="radar-reason">${esc(a.reason)}</div></div></div>`;}
function openRadarFull(mode='all'){
 activeDialog={fn:'openRadarFull',args:[mode]};
 openHolo(modalHead('EVENT RADAR','كل الأحداث',`${EV.length} موعد · حسب اليوم`)+`<div class="radar-expanded"><p class="sub">الألوان للأهمية، وليست لاتجاه السعر. النسبة تمثل حجم المراكز المرتبطة من إجمالي محفظتك.</p><div class="radar-controls"><button class="fbtn sm" onclick="radarViewMode('all')">كل الأحداث</button><button class="fbtn sm" onclick="radarViewMode('high')">الأهمية المرتفعة</button><button class="fbtn sm" onclick="radarViewMode('priority')">الأعلى أولوية</button></div><div id="expandedEvents"></div>${sourceErrors.calendar?`<p class="coverage-warning">تغطية جزئية: ${esc(sourceErrors.calendar)}</p>`:''}</div>`);
 radarViewMode(mode);
}
function radarViewMode(mode){
 activeDialog={fn:'openRadarFull',args:[mode]};
 const entries=EV.map((e,i)=>({e,i})).filter(({e})=>mode!=='high'||e.importance?.tier==='high');if(mode==='priority')entries.sort((a,b)=>(b.e.importance?.score??-1)-(a.e.importance?.score??-1)||a.e.days-b.e.days);
 $('expandedEvents').innerHTML=entries.map(({e,i})=>radarRow(e,i)).join('')||'<div class="empty">لا أحداث ضمن هذا التقييم</div>';
}
function pulseState(){return window._marketPulse||(window._marketPulse={mode:'today',quotes:{},at:0,error:null,busy:false,brief:[],briefError:null});}
function pulseMode(value){if(!['today','fx','events','exposure'].includes(value))return;pulseState().mode=value;renderGlobeHud();renderFocus();}
function pulseChange(value){return Number.isFinite(value)?`<bdi class="${value<0?'dn':'up'}">${value>0?'+':''}${fmt(value,2)}%</bdi>`:'<span class="mu">غير متاح</span>';}
function pulseQuote(cc){return pulseState().quotes['market:'+cc];}
function pulseFX(cc){return TharwaPulse.fx(TharwaPulse.config(cc).currency,pulseState().quotes,baseCur);}
function pulseStamp(timestamp){return Number.isFinite(timestamp)&&timestamp>0?new Date(timestamp*1000).toLocaleString('ar-SA-u-ca-gregory',{timeZone:'Asia/Riyadh',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'لا يوجد سعر مؤرّخ';}
function pulseRelated(item,cc){return pulseCountries(item).includes(cc);}
function pulseItems(cc){const news=rankNews([...NEWS,...pulseState().brief]).filter((n,i,a)=>a.findIndex(x=>x.url===n.url)===i).filter(n=>n.date&&Date.now()-Date.parse(n.date)<=7*864e5&&impactOf(n).positions.length&&(!cc||pulseRelated(n,cc))).map(n=>({kind:'news',item:n,score:impactOf(n).score||0}));const events=EV.filter(e=>e.days<=7&&!impactOf(e).personal&&impactOf(e).positions.length&&(!cc||pulseRelated(e,cc))).map(e=>({kind:'event',item:e,score:impactOf(e).score||0}));return [...news,...events].sort((a,b)=>b.score-a.score||(a.item.d||a.item.date||'').localeCompare(b.item.d||b.item.date||''));}
function pulseItemButton(row){const x=row.item;return `<button class="pulse-story importance-${impactOf(x).tier}" onclick='openPulseItem(${JSON.stringify(x.url||x.d+'|'+x.t).replaceAll("'",'&#39;')})'><span>${row.kind==='event'?'◷ '+cd(x):'◈ '+esc((x.date||'').slice(0,10))} · ${esc(impactOf(x).label)}</span><b>${esc(x.t)}</b></button>`;}
function openPulseItem(key){const n=[...NEWS,...pulseState().brief].find(n=>n.url===key);if(n){if(!NEWS.some(x=>x.url===key))NEWS.push(n);return openNews(key);}const e=EV.find(e=>e.d+'|'+e.t===key);if(e){if(e.c==='div'&&e.asset)return openAsset(e.asset);return openCalendarEvent(e.d,e.t);}}
function pulseHighlights(){const rows=pulseItems().slice(0,3);return rows.map(pulseItemButton).join('')||'<p class="mu">لا مستجدات مرتبطة متاحة من المصادر الحالية.</p>';}
function renderGlobeHud(){
 const state=pulseState(),m=state.mode,T=XR.total;let tabs=$('pulseTabs');if(!tabs){tabs=document.createElement('div');tabs.id='pulseTabs';tabs.className='pulse-tabs pe';$('globeWrap').append(tabs);}
 tabs.innerHTML=[['today','اليوم'],['fx','العملات'],['events','أخبار وأحداث'],['exposure','توزيع استثماري']].map(([key,label])=>`<button class="${m===key?'on':''}" aria-pressed="${m===key}" onclick="pulseMode('${key}')">${label}</button>`).join('');
 $('globeWrap').dataset.pulseMode=m;window._pulseScores=Object.fromEntries(ranked.map(([cc])=>[cc,pulseItems(cc)[0]?.score||0]));
 const covered=ranked.filter(([cc])=>Number.isFinite(pulseQuote(cc)?.changePct)).length;
 $('gChips').innerHTML=m==='exposure'?`<div class="cell"><div class="l">كل الدول المتاحة</div><div class="v n">${ranked.length}</div></div><div class="cell"><div class="l">الأسهم والصناديق</div><div class="v n">${fmtC(T)}</div></div><div class="cell"><div class="l">توزيع الأسواق</div><div class="market-split"><span>متقدمة <bdi>${fmt(percent(XR.dev,T))}%</bdi></span><span>ناشئة <bdi>${fmt(percent(XR.em,T))}%</bdi></span></div></div>`:`<div class="pulse-heading">الأهم لمحفظتك الآن</div>${pulseHighlights()}<button class="pulse-more" onclick="openPulseOverview()">فتح المتابعة كاملة ↗</button>`;
 const ordered=m==='events'?[...ranked].sort((a,b)=>(pulseItems(b[0])[0]?.score||0)-(pulseItems(a[0])[0]?.score||0)):ranked;
 $('gList').innerHTML=`<div class="pulse-heading">${{today:'حركة الأسواق',fx:'العملات مقابل '+baseCur,events:'مستجدات مرتبطة',exposure:'كل الدول · حسب الحصة'}[m]}</div><div class="pulse-country-list">`+ordered.map(([cc,v])=>{const q=pulseQuote(cc),fx=pulseFX(cc),items=m==='events'?pulseItems(cc):[];const value=m==='exposure'?`<bdi>${fmt(percent(v,T),1)}%</bdi>`:m==='events'?`<bdi>${items.length}</bdi>`:pulseChange(m==='fx'?fx?.changePct:q?.changePct);return `<button class="gr ${focusCC===cc?'on':''}" data-cc="${cc}" onclick="flyTo('${cc}')"><span class="k">${flag(cc)} ${esc(GEO_AR[cc]||cc)}</span><span class="v">${value}</span></button>`;}).join('')+`</div><div class="pulse-foot">${m==='exposure'?'حسب آخر تركيبة متاحة للصناديق':m==='fx'?'تغيّر العملة المحلية مقابل '+baseCur+'؛ ليس تعرّض الصندوق الصافي':m==='events'?'أحداث تخص الدولة؛ الأخبار العامة بالمتابعة الكاملة':`مؤشرات متاحة: ${covered}/${ranked.length} · السياق لا يساوي عائد محفظتك`}</div>`;
}
function pulseCountryBody(cc){const q=pulseQuote(cc),cfg=TharwaPulse.config(cc),fx=pulseFX(cc),st=pulseState(),v=XR.countries[cc]||0;return `<div class="pulse-market"><span>${esc(cfg.label||'مؤشر غير مغطى')}</span><strong>${pulseChange(q?.changePct)}</strong></div><div class="pulse-session">${esc(TharwaPulse.session(q))}</div><div class="pulse-foot">آخر سعر: ${pulseStamp(q?.timestamp)} · <a href="https://finance.yahoo.com/quote/${encodeURIComponent(cfg.symbol||'')}" target="_blank" rel="noopener noreferrer">Yahoo Finance ↗</a> · قد تتأخر البيانات</div><div class="pulse-fx"><span>${esc(cfg.currency||'العملة غير متاحة')} / ${esc(baseCur)}</span><bdi>${fx?fmt(fx.rate,4):'—'}</bdi>${pulseChange(fx?.changePct)}</div><div class="pulse-foot">العملة المحلية مقابل ${esc(baseCur)} · ${pulseStamp(fx?.timestamp)}<br>سياق للعملة؛ التحوّط وانكشاف إيرادات الشركات غير محسوبين.</div><div class="pulse-exposure">حصتك: <bdi>${fmtC(v)}</bdi> · <bdi>${fmt(percent(v,XR.total),1)}%</bdi> من الأسهم والصناديق</div><div class="pulse-foot">عبر: ${(XR.src[cc]||[]).map(s=>esc(s.f)).join('، ')||'غير متاح'}</div>${st.error?'<p class="coverage-warning">تعذّر تحديث بعض الأسعار؛ راجع وقت آخر سعر.</p>':''}`;}
function openPulseCountry(cc){
 activeDialog={fn:'openPulseCountry',args:[cc]};
 const all=pulseItems(cc),top=pulseCountryHighlights(cc);
 openHolo(modalHead('MARKET PULSE',flag(cc)+' '+(GEO_AR[cc]||cc),'السوق والعملات وأهم المستجدات المرتبطة باستثماراتك')+`<div class="pulse-dialog">${pulseCountryBody(cc)}<div class="sect">أهم الأخبار والأحداث · ${top.length}</div>${top.map(pulseItemButton).join('')||'<p class="mu">لا مستجدات مرتبطة متاحة حاليًا</p>'}<div class="pulse-dialog-actions"><button class="fbtn sm" onclick="openPulseOverview()">ماذا تغيّر حول محفظتي؟ · المتابعة الكاملة${all.length>top.length?' · '+(all.length-top.length)+' مستجدات إضافية':''} ↗</button><button class="fbtn sm ghost" onclick="openCountry('${cc}')">توزيع استثماراتي بالدولة</button></div></div>`);
}
function openPulseOverview(){activeDialog={fn:'openPulseOverview',args:[]};const st=pulseState();openHolo(modalHead('PORTFOLIO PULSE','ماذا تغيّر حول محفظتي؟','متابعة الأسعار كل 5 دقائق أثناء فتح الأداة؛ الأخبار كل 15 دقيقة')+`<div class="pulse-dialog"><p class="sub">مؤشر السوق سياق عام؛ قد تختلف حركة أصولك عنه. الألوان الزرقاء للصعود والحمراء للهبوط والذهبية لأهمية المستجدات.</p>${st.briefError?'<p class="coverage-warning">بعض مصادر الأخبار الاقتصادية غير متاحة حاليًا.</p>':''}<div class="sect">حركة الأسواق · كل الدول المتاحة</div><div class="pulse-overview-grid">${ranked.map(([cc])=>`<button class="pulse-summary" onclick="openPulseCountry('${cc}')"><b>${flag(cc)} ${esc(GEO_AR[cc]||cc)}</b>${pulseChange(pulseQuote(cc)?.changePct)}<small>${esc(TharwaPulse.session(pulseQuote(cc)))}</small><small>${pulseStamp(pulseQuote(cc)?.timestamp)}</small></button>`).join('')}</div><div class="sect">الأخبار والأحداث حسب الأهمية</div>${pulseItems().map(pulseItemButton).join('')||'<p class="mu">لا مستجدات مرتبطة متاحة حاليًا</p>'}</div>`);}
async function loadPulse(){const state=pulseState(),req=TharwaPulse.requests(Object.keys(XR.countries),baseCur),signature=JSON.stringify(req);if(state.busy||document.hidden||S.status.demo||(state.signature===signature&&Date.now()-state.at<300000))return;state.busy=true;try{let failed=false;for(let i=0;i<req.length;i+=40){const r=await ENGINE.market('getGlobeQuotes',req.slice(i,i+40));if(r.ok===false){failed=true;continue;}Object.assign(state.quotes,r.quotes||{});if(r.unavailable?.length)failed=true;}state.error=failed?'تغطية جزئية للأسعار':null;state.at=Date.now();state.signature=signature;}catch{state.error='تعذر التحديث';}finally{state.busy=false;renderGlobeHud();renderFocus();}}
async function loadPulseBrief(){const s=pulseState();try{const r=await ENGINE.market('getMarketBriefing');if(r.ok!==false){s.brief=r.items||[];s.briefError=r.unavailable?.length?r.unavailable.join('، '):null;}else s.briefError=r.error;}catch{s.briefError='الأخبار الاقتصادية غير متاحة';}renderGlobeHud();renderFocus();}
function pulseMapColor(cc,alpha){const m=pulseState().mode;if(m==='exposure')return `rgba(79,216,255,${alpha})`;if(m==='events'){const important=(window._pulseScores||{})[cc];return important>=70?`rgba(244,184,96,${alpha})`:important>0?`rgba(117,201,255,${alpha})`:`rgba(100,123,140,${alpha*.5})`;}const n=m==='fx'?pulseFX(cc)?.changePct:pulseQuote(cc)?.changePct;return !Number.isFinite(n)?`rgba(100,123,140,${alpha*.5})`:n<0?`rgba(255,107,90,${alpha})`:`rgba(79,216,255,${alpha})`;}
function pulseMapLabel(cc,v,total){const m=pulseState().mode;if(m==='exposure')return (GEO_AR[cc]||cc)+' '+fmt(percent(v,total),1)+'%';if(m==='events')return (GEO_AR[cc]||cc)+((window._pulseScores||{})[cc]>=70?' · حدث مهم':'');const n=m==='fx'?pulseFX(cc)?.changePct:pulseQuote(cc)?.changePct;return (GEO_AR[cc]||cc)+' '+(Number.isFinite(n)?(n>0?'+':'')+fmt(n,2)+'%':'—');}
function renderExposureFocus(){
  const cc=focusCC;if(!cc||!XR)return;const v=XR.countries[cc],T=XR.total;
  const cos=Object.values(XR.companies).filter(c=>c.cc===cc).sort((a,b)=>b.val-a.val).slice(0,3);
  const f=$('focus');f.style.animation='none';f.offsetHeight;f.style.animation='focusIn .5s ease both';
  f.innerHTML=`<div class="fh"><span class="fn">${flag(cc)} ${GEO_AR[cc]}</span><span class="tag">${cc} · ${geoPositionLabel(cc)}</span></div>
    <div style="display:flex;align-items:baseline;gap:10px;margin-top:4px"><span class="fv n">${fmtC(v)}</span><span class="n mu">${fmt(v/T*100,1)}% من الأسهم والصناديق</span></div>
    <div class="fc">عبر: ${XR.src[cc].map(s=>`${s.f} <span class="n">${fmt(s.w,1)}%</span>`).join(' · ')}${cos.length?'<br>أبرز الشركات: '+cos.map(c=>c.ar).join('، '):''}</div>
    <div class="go" onclick="openCountry('${cc}')">فتح التفاصيل الكاملة ←</div>`;
}
function pulseCountryHighlights(cc){return pulseItems(cc).slice(0,3);}
function pulseCountries(item){
 const countries=new Set(),t=String(item.t||item.title||'');
 // A symbol-feed location or a shared fund is not evidence about a headline.
 const aliases={US:/\b(united states|usa|american|wall street|federal reserve|fomc|fed|nasdaq|s&p 500|dow jones)\b|أمريكا|الأمريكي|الولايات المتحدة|الفيدرالي/i,CN:/\b(china|chinese|beijing|pboc|shanghai|shenzhen|byd)\b|الصين|الصيني|بكين/i,HK:/\b(hong kong|hang seng|hkma)\b|هونغ كونغ/i,JP:/\b(japan|japanese|boj|nikkei)\b|اليابان|الياباني/i,GB:/\b(britain|british|united kingdom|uk|bank of england|ftse 100)\b|بريطانيا|البريطاني|المملكة المتحدة/i,KR:/\b(south korea|korean|samsung|kospi)\b|كوريا الجنوبية|الكوري|سامسونج/i,TW:/\b(taiwan|taiwanese|tsmc)\b|تايوان|التايواني/i,IN:/\b(india|indian|nifty|sensex)\b|الهند|الهندي/i,SA:/\b(saudi|tadawul|tasi)\b|السعودية|السعودي|تداول/i,DE:/\b(germany|german|dax)\b|ألمانيا|الألماني/i,FR:/\b(france|french|cac 40)\b|فرنسا|الفرنسي/i,CA:/\b(canada|canadian|tsx)\b|كندا|الكندي/i,AU:/\b(australia|australian|asx)\b|أستراليا|الأسترالي/i,CH:/\b(switzerland|swiss)\b|سويسرا|السويسري/i,BR:/\b(brazil|brazilian|bovespa)\b|البرازيل|البرازيلي/i,MX:/\b(mexico|mexican)\b|المكسيك|المكسيكي/i,ZA:/\b(south africa|south african)\b|جنوب أفريقيا/i,SG:/\b(singapore|singaporean)\b|سنغافورة/i,MY:/\b(malaysia|malaysian)\b|ماليزيا/i,ID:/\b(indonesia|indonesian)\b|إندونيسيا|اندونيسيا/i,TH:/\b(thailand|thai)\b|تايلاند/i,SE:/\b(sweden|swedish)\b|السويد/i,DK:/\b(denmark|danish)\b|الدنمارك/i,NL:/\b(netherlands|dutch)\b|هولندا/i,NO:/\b(norway|norwegian)\b|النرويج/i,IT:/\b(italy|italian)\b|إيطاليا/i,ES:/\b(spain|spanish)\b|إسبانيا/i,AE:/\b(uae|emirates|abu dhabi|dubai)\b|الإمارات|دبي|أبوظبي/i,QA:/\b(qatar|qatari)\b|قطر/i,KW:/\b(kuwait|kuwaiti)\b|الكويت/i,TR:/\b(turkey|turkish|turkiye)\b|تركيا|التركي/i,PL:/\b(poland|polish)\b|بولندا/i,NZ:/\b(new zealand)\b|نيوزيلندا/i,EU:/\b(eurozone|euro area|european central bank|ecb)\b|منطقة اليورو|المركزي الأوروبي/i};
 for(const [cc,re] of Object.entries(aliases))if(re.test(t))countries.add(cc);
 if(/\bUS\b|\bU\.S\./.test(t))countries.add('US');
 if(countries.has('EU'))countries.add('EZ');
 if(['Fed','BLS','BEA'].includes(item.src))countries.add('US');
 if(/^[A-Z]{2}$/.test(item.countryCode||item.country||''))countries.add(item.countryCode||item.country);
 if(item.geoVerified===true)for(const cc of item.countryCodes||[])if(/^[A-Z]{2}$/.test(cc))countries.add(cc);
 if(item.scope!=='macro'&&item.c!=='macro')for(const r of item.related||[]){
  if(!(r.headline===true||(r.headline==null&&item.headline)))continue;
  const co=r.key?XR.companies[r.key]:Object.values(XR.companies).find(c=>r.via&&c.ar===r.via);
  if(co?.cc)countries.add(co.cc);
 }
 return [...countries];
}
function dashboardNews(filter='all'){
 return rankNews(NEWS.filter(n=>(n.scope==='macro'||newsAssets(n).some(assetVisible))&&(filter==='all'||newsAssets(n).includes(filter))));
}
function openNewsFull(filter='all'){
 activeDialog={fn:'openNewsFull',args:[filter]};
 const list=dashboardNews(filter),filters=[['all','الكل'],...Object.keys(AS).filter(k=>AS[k].yh&&assetVisible(k)).map(k=>[k,k])];
 openHolo(modalHead('NEWS','كل الأخبار',`${list.length} خبر · حسب الأهمية والحداثة`)+`<div class="news-expanded"><div class="fl">${filters.map(([k,l])=>`<button class="${filter===k?'on':''}" onclick="openNewsFull('${k}')">${esc(l)}</button>`).join('')}</div><p class="sub">الأهمية تقديرية؛ النسبة حصتك المرتبطة وليست تغيرًا متوقعًا بالسعر.</p>${sourceErrors.news?`<p class="coverage-warning">${esc(sourceErrors.news)}</p>`:''}${list.map(newsRow).join('')||'<div class="empty">لا أخبار متاحة حاليًا</div>'}</div>`);
}
function radarCard(e,i){
 const a=e.importance||impactOf(e);
 return `<button class="radar-card importance-${a.tier}" style="--event-color:${a.color}" onmouseenter="evSel=${i}" onfocus="evSel=${i}" onclick="${e.on}"><span class="radar-card-category"><i class="ti ${EV_CAT[e.c]?.[1]||'ti-calendar'}"></i> ${esc(EV_CAT[e.c]?.[0]||'حدث')}</span><strong>${esc(e.t)}</strong><span class="radar-card-date"><bdi>${esc(eventTimeLabel(e))}</bdi> · ${esc(cd(e))}</span><span class="impact-badge impact-${a.tier}">${esc(a.label)}</span></button>`;
}
installCommandCenter();boot();
