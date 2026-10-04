let activeDialog=null,refreshingDialog=false,historyData={},companyQuotes={},calendarData=[],sourceErrors={},pullTimer=null,lastSnapshot='',pricesAt=0,externalAt=0;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const percent=(n,d)=>d>0?n/d*100:0;
const safeAction=async fn=>{try{return await fn();}catch(e){toast(esc(e.message),'ti-alert-triangle');throw e;}};
function replaceObject(target,value){Object.keys(target).forEach(k=>delete target[k]);Object.assign(target,value);}
function fifo(name){return ENGINE.fifo(name);}
function fifoLots(name,excl=-1){const f=ENGINE.fifo(name,TXNS[excl]?.[8]?.id);return f.queue.map(l=>({qty:l.qty,p:l.priceSAR,d:'FIFO'}));}
function fifoReplay(name){const raw=ENGINE.fifoReplay(name),out={};TXNS.forEach((t,i)=>{if(raw[t[8].id])out[i]=raw[t[8].id];});return out;}
function build(){POS=S.POS.filter(p=>assetVisible(p.n));}
function assetVisible(n){const id=S.registry.find(a=>a.n===n)?.id;return !(S.marketHidden||[]).includes(String(id));}
function visibleOther(o){return o.inc!==false&&(o.type!=='unrealized'||S.includeUnrealized);}
function totals(){return S.totals;}
function computeXray(){return S.XR;}
function xrMetrics(){return S.metrics;}
function coZR(){return null;}
function series(){return [];}
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
 if(changed('AS')||changed('POS')){renderMkt();renderFx();renderNews();}
 if(changed('XR'))renderXrHud();if(changed('TXNS')||changed('CTX'))renderTx();
 if(changed('totals')||changed('catGoals')||changed('monthly'))renderGoals();
 if(changed('XR')||changed('POS')||changed('cc')||changed('zakat'))renderLab();
 stBell();updateConnection();if(ambOn)ambRender();
 if($('tfD')){
  if(TF.edit!=null){const t=TXNS[TF.edit];const now=t&&ENGINE.rawTxn(t[8].id);if(!now||JSON.stringify(now)!==TF.expected){TF.stale=true;$('tfMsg').innerHTML='<div class="fmsg wr">تغيّرت هذه الحركة من جهاز آخر. أغلق النموذج وافتح الحركة مجددًا قبل الحفظ.</div>';$('tfSave').disabled=true;}}
  if(!TF.stale)tfCalc();
 }else if(activeDialog&&$('ov').classList.contains('open')&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){
  const scroll=$('hb').scrollTop;refreshingDialog=true;try{window[activeDialog.fn](...activeDialog.args);}finally{refreshingDialog=false;$('hb').scrollTop=scroll;}
 }
}
function updateConnection(){const el=document.querySelector('.live');if(!el)return;const st=parent.commandStorage.status();el.innerHTML='<i></i>'+(!st.online?'غير متصل':st.busy?'جاري الحفظ':st.demo?'تجربة':'متصل');el.classList.toggle('offline',!st.online);let info=$('freshness');if(!info){info=document.createElement('button');info.id='freshness';info.className='freshness';info.onclick=()=>openSettings('data');el.after(info);}const quotes=S.registry.filter(a=>a.yh&&a.timestamp);const times=quotes.map(a=>a.timestamp*1000);const stamp=times.length?Math.min(...times):null;info.textContent=st.demo?'تجربة · بدون بيانات مباشرة':stamp?'آخر سعر '+formatStamp(stamp):'الأسعار لم تتحدث بعد';info.title='أقدم سعر متاح من المصادر؛ اضغط لتفاصيل المزامنة والتحديث';}
function formatStamp(value){return value?new Date(value).toLocaleString('ar-SA-u-ca-gregory',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'لم يتحدث بعد';}

function renderAll(){build();renderHero();renderPf();renderMkt();renderNews();renderXrHud();renderTx();renderGoals();renderLab();}
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
function renderMkt(){
 const priced=POS.filter(p=>p.chg!=null),big=[...priced].sort((a,b)=>Math.abs(b.chg)-Math.abs(a.chg))[0];
 $('mkChips').innerHTML=cell('رابح اليوم',priced.filter(p=>p.chg>0).length,'up')+cell('خاسر اليوم',priced.filter(p=>p.chg<0).length,'dn')+(big?`<div class="cell clk" onclick="openAsset('${big.n}')"><div class="l">أكبر حركة · ${big.n}</div><div class="v n ${big.chg<0?'dn':'up'}">${fmt(big.chg,2)}%</div></div>`:cell('أكبر حركة','غير متاح'))+cell('أصل مشتري',POS.length);
 $('mkList').innerHTML=Object.entries(AS).filter(([n,p])=>assetVisible(n)&&['Stock','Gold'].includes(p.t)).map(([n,p])=>{const pos=p.hi>p.lo&&p.p!=null?Math.max(0,Math.min(100,(p.p-p.lo)/(p.hi-p.lo)*100)):null;
  return `<div class="row clk" onclick="openAsset('${n}')"><div class="nm"><div class="t">${n}</div><div class="s">${p.full}</div></div><div class="w52" title="${pos==null?'نطاق 52 أسبوع غير متاح':'نطاق 52 أسبوع'}">${pos==null?'—':`<i style="right:${pos}%"></i>`}</div><div class="vl"><span class="n">${natFmt(p.p,p.cur)}</span>${p.t==='Gold'?`<small class="n mu">${natFmt(S.goldOunce,'USD')} / oz</small>`:''}<span class="pill ${p.chg<0?'dn':'up'}">${p.chg==null?'غير متاح':fmt(p.chg,2)+'%'}</span></div></div>`;}).join('')||'<div class="empty">لا أصول مسجّلة</div>';
}
function renderNews(){
 $('nwFl').innerHTML=[['all','الكل'],...Object.keys(AS).filter(k=>AS[k].yh&&assetVisible(k)).map(k=>[k,k])].map(([k,l])=>`<button class="${nwF===k?'on':''}" onclick="nwF='${k}';renderNews()">${l}</button>`).join('');
 const list=NEWS.filter(n=>assetVisible(n.a)&&(nwF==='all'||n.a===nwF));$('nwList').innerHTML=list.length?list.map(newsRow).join(''):'<div class="empty">'+(sourceErrors.news?'الأخبار غير متاحة حاليًا':'لا أخبار حالياً')+'</div>';
}
function renderFx(){const list=Object.entries(FX).filter(([c,v])=>['SAR','USD','JOD','GBP','HKD'].includes(c)&&c!==baseCur&&v>0).map(([c,v])=>`<span>${c}/${baseCur}<b>${fmt(v/(FX[baseCur]||1),4)}</b></span>`);if(S.goldOunce)list.push(`<span>XAU/USD<b>${fmt(S.goldOunce,2)}</b></span>`);$('fx').innerHTML=list.join('')+list.join('');}
function renderTx(){
 const years=[...new Set([new Date().getFullYear(),...TXNS.map(t=>+t[0].slice(0,4)),...CTX.map(t=>+t.d.slice(0,4))])].filter(Number.isFinite).sort((a,b)=>b-a);
 $('txnYearLabel').innerHTML=`<select aria-label="السنة" onchange="selectedYear=+this.value;renderTx()">${years.map(y=>`<option ${y===selectedYear?'selected':''}>${y}</option>`).join('')}</select>`;
 const months=MON.map((m,i)=>monthStats(i)),inv=months.reduce((s,m)=>s+m.inv,0),liq=months.reduce((s,m)=>s+m.liq,0),max=Math.max(1,...months.map(m=>m.inv)),sellMax=Math.max(1,...months.map(m=>m.liq));
 $('txNet').textContent=fmtC(inv-liq);$('txNet').classList.toggle('dn',inv<liq);$('txInv').textContent=fmtC(inv);$('txLiq').textContent=fmtC(liq);
 $('bars').innerHTML=months.map((m,i)=>`<button class="bar ${selM===i?'sel':''}" onclick="selM=${i};renderTx();openMonth(${i})" title="${m.k}"><div class="u">${['Stock','Gold','Property'].map(k=>{const v=m.buy.filter(t=>AS[t[1]]?.t===k).reduce((s,t)=>s+txSAR(t),0);return v?`<i style="height:${v/max*74}px;background:${kc(k)}"></i>`:'';}).join('')}</div><div class="d">${m.liq?`<i style="height:${m.liq/sellMax*16}px"></i>`:''}</div><b>${m.m}</b></button>`).join('');
 const selected=months[selM];const recent=[...TXNS.map(t=>({d:t[0],html:txRow(t)})),...CTX.map((c,i)=>({d:c.d,html:ctxRow(c,i)}))].sort((a,b)=>b.d.localeCompare(a.d));
 $('txList').innerHTML=`<div class="sect clk" onclick="openMonth(${selM})">حركات ${selected.k} ←</div>`+(selected.L.slice(0,4).map(txRow).join('')||'<div class="mu">لا حركات استثمارية</div>')+`<div class="kg2">${cell('استثمرت',fmtC(selected.inv))}${cell('سيّلت',fmtC(selected.liq))}</div><div class="sect">أحدث الحركات</div>`+recent.slice(0,5).map(x=>x.html).join('');
}
function monthStats(i){const k=selectedYear+'-'+String(i+1).padStart(2,'0'),L=TXNS.filter(t=>t[0].startsWith(k)),buy=L.filter(t=>t[2]==='Buy'),sell=L.filter(t=>t[2]==='Sell');return {k,m:MON[i],L,buy,sell,inv:buy.reduce((s,t)=>s+txSAR(t),0),liq:sell.reduce((s,t)=>s+txSAR(t),0)};}
function renderGoals(){
 const T=totals();$('goals').innerHTML=Object.keys(catGoals).map(k=>{const current=T.by[k]?.cur||0,goal=catGoals[k],pct=percent(current,goal);return `<div class="go clk" onclick="openCat('${k}')"><div class="h"><span>${KLF[k]}</span><b class="n">${goal?fmt(pct,1)+'%':'غير محدد'}</b></div><div class="tr"><i style="width:${Math.min(100,pct)}%"></i></div><div class="f"><span>الحالي ${fmtC(current)}</span><span>متبقي ${fmtC(Math.max(0,goal-current))}</span></div></div>`;}).join('');
 $('pj').innerHTML=`<div class="sub">متوسط الاستثمار الشهري ${fmtC(S.monthly)}</div>`+S.projections.map(p=>`<div class="pj"><span>${p.r?fmt(p.r*100)+'%':'ادخار فقط'}</span><b class="n">${p.months==null?'أكثر من 50 سنة':p.months===0?'تحقق الهدف':Math.floor(p.months/12)+'y '+p.months%12+'m'}</b></div>`).join('');
 const paths=S.projections.map(p=>{let value=T.total;const points=[value];for(let i=0;i<72;i++){value=value*(1+p.r/12)+S.monthly;points.push(value);}return points;}),max=Math.max(1,T.goal,...paths.flat()),X=i=>10+i/72*330,Y=v=>130-v/max*120;
 $('pjChart').innerHTML=`<svg viewBox="0 0 360 150" style="width:100%;direction:ltr"><line x1="10" x2="340" y1="${Y(T.goal)}" y2="${Y(T.goal)}" stroke="#fff" stroke-dasharray="4 4"/>${paths.map((points,k)=>`<path d="${points.map((v,i)=>(i?'L':'M')+X(i)+','+Y(v)).join('')}" fill="none" stroke="#4fd8ff" opacity="${.3+k*.23}"/><text x="${X(72)}" y="${Y(points[72])}" fill="#b4f3ff" font-size="9">${S.projections[k].r*100}%</text>`).join('')}</svg><div class="sub">سيناريوهات افتراضية لمدة 72 شهرًا، وليست عوائد مضمونة.</div>`;
}
function renderHeat(){
 const items=Object.values(XR.companies).filter(c=>c.val>0).map(c=>({k:c.k,n:c.ar,cc:c.cc,v:c.val,ch:coChg(c.k)}));
 POS.filter(p=>XRAY_DATA[p.n]).forEach(p=>{const d=XRAY_DATA[p.n],v=p.val*Math.max(0,100-d.top.reduce((s,t)=>s+t[3],0))/100;if(v>0)items.push({k:p.n,n:'باقي مكوّنات '+p.n,v,rest:true});});
 if(!items.length){$('heatBox').innerHTML='<div class="empty">لا بيانات مكوّنات متاحة</div>';return;}
 const tiles=squarify(items.sort((a,b)=>b.v-a.v),0,0,1000,440);
 $('heatBox').innerHTML=tiles.map(t=>`<div class="tile clk" onclick="${t.rest?'openAsset':'openCompany'}('${t.k}')" style="left:${t.x/10}%;top:${t.y/4.4}%;width:${t.w/10}%;height:${t.h/4.4}%;background:${t.ch==null?'rgba(86,118,138,.2)':t.ch<0?'rgba(255,107,90,.4)':'rgba(79,216,255,.35)'}" title="${t.n} · ${fmtC(t.v)}">${t.w>70&&t.h>34?`<div class="tn">${t.n}</div><div class="tv n">${fmtC(t.v)}</div><div class="tc n">${t.rest?'باقي المكوّنات':t.ch==null?'غير متاح':fmt(t.ch,2)+'%'}</div>`:''}</div>`).join('');
}
function buildEvents(){
 const result=[...calendarData,...(ST.events||[]).map(e=>({...e,s:'موعد خاص',src:'يدوي',on:"openSettings('events')"}))];
 if(S.zakat.hawl)result.push({c:'zakat',d:S.zakat.hawl.dueStr,t:'حول الزكاة',s:'من إعداداتك',src:'محسوب',on:'openZakat()'});
 const forecast=S.projections.find(x=>x.r===.07);if(forecast?.months>0&&forecast.months<600){const d=new Date();d.setMonth(d.getMonth()+forecast.months);result.push({c:'goal',d:d.toISOString().slice(0,10),t:'هدف التقاعد — تقديري',s:'سيناريو عائد 7% مع متوسط استثمارك الحالي',src:'تقدير',on:'openGoals()'});}
 return result.map(e=>({...e,days:Math.ceil((new Date(e.d+'T09:00:00')-new Date())/864e5)})).filter(e=>Number.isFinite(e.days)&&e.days>=0&&ST.evOn[e.c]!==false).sort((a,b)=>a.days-b.days);
}
function ambCards(){
 const T=totals(),list=POS.filter(p=>p.chg!=null),best=list.filter(p=>p.chg>0).sort((a,b)=>b.chg-a.chg)[0],worst=list.filter(p=>p.chg<0).sort((a,b)=>a.chg-b.chg)[0],top=ranked[0],pr=T.gC-T.gK,year=String(new Date().getFullYear()),net=TXNS.filter(t=>t[0].startsWith(year)).reduce((s,t)=>s+(t[2]==='Buy'?1:-1)*txSAR(t),0);
 return [['ti-trending-up','أكبر رابح اليوم',best?best.n+' '+fmt(best.chg,2)+'%':'غير متاح',''],['ti-trending-down','أكبر خاسر اليوم',worst?worst.n+' '+fmt(worst.chg,2)+'%':'غير متاح',''],['ti-target','هدف التقاعد',fmt(percent(T.total,T.goal),1)+'%',fmtC(Math.max(0,T.goal-T.total))+' متبقي'],['ti-chart-line','ربح النمو',fmtC(pr),fmt(percent(pr,T.gK),1)+'%'],['ti-radar','الحدث القادم',EV[0]?cd(EV[0]):'لا أحداث',EV[0]?.t||''],['ti-heart','صحة المحفظة',S.metrics.total+' / 100',''],['ti-world','أكبر تمركز',top?GEO_AR[top[0]]||top[0]:'غير متاح',top?fmt(percent(top[1],XR.total),1)+'%':''],['ti-arrows-exchange','صافي الاستثمار · '+year,fmtC(net),'']];
}
function boot(){
 const steps=[['الاتصال بقاعدة البيانات',S.status.demo?'DEMO':S.loaded?'OK':'غير متاح'],['تحميل الحركات',S.TXNS.length+S.CTX.length+' TXN'],['تحميل الأصول',S.registry.length+' ASSET'],['الأسعار',POS.filter(p=>p.p!=null).length+' QUOTE'],['أسعار الصرف',Object.keys(FX).length+' FX'],['تحليل X-RAY',Object.keys(S.XR.countries).length+' COUNTRY'],['FIFO والأهداف','READY']];
 for(const [label,value] of steps){const row=document.createElement('div');row.innerHTML='<span>'+label+'</span><b>'+value+'</b>';$('bLog').append(row);}
 $('bFill').style.width='100%';$('bPct').textContent='100%';$('bMsg').textContent=S.loaded?'النظام جاهز':'تعذّر تحميل المحفظة';
 window._skip=__forceOpen;requestAnimationFrame(()=>setTimeout(__forceOpen,300));
}
async function refreshLive(button){if(button)button.disabled=true;try{await ENGINE.refresh();pricesAt=Date.now();syncSnapshot();await loadExternal();}catch(e){toast('تعذّر تحديث الأسعار','ti-alert-triangle');}finally{if(button)button.disabled=false;}}
async function loadExternal(){
 if(document.hidden||S.status.demo)return;externalAt=Date.now();
 const holdings=Object.keys(AS).filter(k=>AS[k].yh&&AS[k].t!=='Property').map(k=>({name:k,symbol:AS[k].yh}));
 const [news,cal,quotes]=await Promise.all([ENGINE.market('getNews',[...holdings.slice(0,5),...companySymbols().slice(0,3).map(x=>({symbol:x.symbol,name:XR.companies[x.key].via[0]?.f,via:XR.companies[x.key].ar}))]),ENGINE.market('getCalendar',[...holdings,...companySymbols().filter(x=>percent(XR.companies[x.key].val,S.totals.total)>=(ST.evMin||.5)).map(x=>({symbol:x.symbol,name:XR.companies[x.key].ar,asset:XR.companies[x.key].via[0]?.f,component:true}))],{countries:Object.keys(XR.countries),msci:Object.values(XRAY_DATA).some(d=>/msci/i.test(d.label||d.desc||''))}),ENGINE.market('getCompanyQuotes',companySymbols())]);
 if(news.ok!==false){NEWS.splice(0,NEWS.length,...(news.items||[]).map(n=>({...n,a:ENGINE.clean(n.a),t:ENGINE.clean(n.t),ago:n.date?new Date(n.date).toLocaleDateString('ar-SA-u-ca-gregory'):n.source||'Yahoo',via:ENGINE.clean(n.via||'')})));sourceErrors.news=null;}else sourceErrors.news=news.error;
 if(cal.ok!==false){calendarData=(cal.items||[]).map(e=>({...e,t:ENGINE.clean(e.t),s:ENGINE.clean(e.s),on:e.asset?`openAsset('${ENGINE.clean(e.asset)}')`:`openCalendarEvent('${e.d}','${ENGINE.clean(e.t)}')`}));sourceErrors.calendar=cal.unavailable?.join('، ')||null;}else sourceErrors.calendar=cal.error;
 if(quotes.ok!==false)companyQuotes=quotes.quotes||{};else sourceErrors.quotes=quotes.error;
 renderNews();renderLab();updateConnection();if(ambOn)ambRender();
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
 const company=n.via?Object.values(XR.companies).find(c=>c.ar===n.via||c.k===n.via):null,position=S.POS.find(p=>p.n===n.a),exposure=company?.val??position?.val??0;
 const via=company?company.via.map(v=>{const p=S.POS.find(p=>p.n===v.f);return {name:v.f,weight:v.w,value:p?p.val*v.w/100:0};}):position?[{name:position.n,weight:100,value:position.val}]:[];
 openHolo(`<div class="news-dialog">${modalHead('INVESTMENT NEWS',n.a,esc(n.source||'Yahoo')+' · '+esc(n.ago||''))}<h2 class="news-headline">${esc(n.t)}</h2><div class="news-context"><div class="sect">علاقة الخبر بمحفظتك</div><p>${company?'وصل الخبر ضمن أخبار '+esc(company.ar)+'، وهي شركة تملك حصة فيها عبر المراكز التالية.':position?'وصل الخبر ضمن نتائج الأخبار الخاصة بالرمز '+esc(AS[n.a]?.yh||n.a)+' المرتبط بمركزك في '+esc(n.a)+'.':'هذا الأصل مسجّل للمتابعة، ولا يوجد لك مركز مفتوح فيه حاليًا.'}</p></div><div class="kg2">${cell('قيمة حصتك المرتبطة',fmtC(exposure))}${cell('نسبتها من إجمالي ثروتك',fmt(percent(exposure,S.totals.total),2)+'%')}</div>${via.length?'<div class="sect">المراكز المرتبطة</div>'+via.map(v=>`<div class="row clk" onclick="openAsset('${v.name}')"><div class="nm"><b>${v.name}</b><small>${company?'وزن الشركة داخل المركز '+fmt(v.weight,2)+'%':'مركز مباشر'}</small></div><span class="n">${fmtC(v.value)}</span><i class="ti ti-chevron-left"></i></div>`).join(''):''}<p class="sub">النسبة توضح حجم ارتباط استثمارك بالخبر؛ اتجاه التأثير يحتاج قراءة تفاصيله.</p><div class="factions"><button class="fbtn" id="news-read-source" onclick="openNewsSource()"><i class="ti ti-external-link"></i> قراءة الخبر في موقع المصدر</button><button class="fbtn" onclick="openAsset('${n.a}')">تفاصيل الأصل</button></div></div>`);
 window._newsSource=n.url;
}
function openNewsSource(){try{const url=new URL(window._newsSource);if(url.protocol==='https:')window.open(url.href,'_blank','noopener,noreferrer');}catch{toast('رابط الخبر غير صالح','ti-alert-triangle');}}
function movementQuotePrice(t,quoteCurrency){const c=t[8]?.currency||quoteCurrency;if(c===quoteCurrency)return t[4];if(c==='GBP'&&quoteCurrency==='GBp')return t[4]*100;if(c==='GBp'&&quoteCurrency==='GBP')return t[4]/100;return s2n(t[4]*(t[5]||1),quoteCurrency,liveRate(quoteCurrency));}

function installCommandCenter(){
 if(parent.commandIconFont){const font=new FontFace('tabler-icons',`url(${new URL(parent.commandIconFont,parent.location.href).href})`);document.fonts.add(font);font.load().catch(()=>{});}
 Object.assign(ST,{alerts:S.alerts});CTX=S.CTX;POS=S.POS;Object.assign(NUM2A,{400:'JO',344:'HK',702:'SG',578:'NO',246:'FI',380:'IT',724:'ES',620:'PT',56:'BE',40:'AT',616:'PL',792:'TR',818:'EG',504:'MA',586:'PK',604:'PE',152:'CL',170:'CO',554:'NZ',643:'RU',608:'PH',704:'VN',300:'GR',203:'CZ',348:'HU',376:'IL'});Object.assign(LL,{JO:[31,36],HK:[22.3,114.2],SG:[1.3,103.8],EU:[50.8,4.3]});
 const regions=new Intl.DisplayNames(['ar'],{type:'region'});allFeat.forEach(f=>{const cc=NUM2A[+f.id];if(cc){const center=d3.geoCentroid(f);LL[cc]??=[center[1],center[0]];GEO_AR[cc]??=regions.of(cc);}});
 Object.keys(S.XR.countries).forEach(cc=>{LL[cc]??=[0,0];GEO_AR[cc]??=regions.of(cc);});invFeat=allFeat.filter(f=>NUM2A[+f.id]);
 LAB_SIDE.heat=()=>`<div class="sect">حصتك داخل الشركات</div><div class="sub">المساحة تمثل حصتك الفعلية. اللون من حركة السعر المتاحة؛ الرمادي يعني أن السعر غير متاح.</div><div class="cell">${Object.keys(XR.companies).length} شركة</div>`;
 const originalSetLab=setLab;window.setLab=function(t){if(!Object.keys(XR.companies).length&&t==='net'){$('netSvg').innerHTML='<div class="empty">لا بيانات مكوّنات متاحة</div>';labTab=t;document.querySelectorAll('.labv').forEach(v=>v.style.display=v.dataset.t===t?'block':'none');return;}return originalSetLab(t);};
 enhanceControls();const originalOpen=openHolo;window.openHolo=function(html){if(refreshingDialog)return reHolo(html);originalOpen(html);$('ov').setAttribute('role','dialog');$('ov').setAttribute('aria-modal','true');$('holo').querySelector('.x')?.focus({preventScroll:true});};
 for(const fn of ['openNews','openAsset','openCountry','openCat','openGoals','openMonth','openCompany','openTx','openCtx','openZakat','openSettings']){const original=window[fn];window[fn]=function(...args){activeDialog={fn,args};return original(...args);};}
 parent.addEventListener('portfolio:changed',()=>{clearTimeout(pullTimer);pullTimer=setTimeout(()=>syncSnapshot(),80);});
 setInterval(()=>{if(!document.hidden&&parent.document.body.dataset.portfolioView==='cc')syncSnapshot();},2000);
 setInterval(()=>{if(document.hidden||parent.document.body.dataset.portfolioView!=='cc')return;if(Date.now()-pricesAt>(S.marketOpen===false?900000:60000))refreshLive();else if(Date.now()-externalAt>900000)loadExternal();},15000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){syncSnapshot();if(Date.now()-pricesAt>(S.marketOpen===false?900000:60000))refreshLive();}});
 document.querySelectorAll('button.ibtn').forEach(b=>{b.title=b.querySelector('.tip')?.textContent||'';b.setAttribute('aria-label',b.title);});
 const exit=document.createElement('button');exit.className='ibtn';exit.title='العودة للواجهة السابقة';exit.textContent='↩';exit.onclick=()=>ENGINE.legacy();document.querySelector('.top').append(exit);
 syncSnapshot(true);setTimeout(loadExternal,1500);
}

function openCalendarEvent(d,t){const e=calendarData.find(e=>e.d===d&&e.t===t);if(!e)return;activeDialog=null;openHolo(modalHead('ECONOMIC RADAR',e.t,esc(e.d)+' · '+esc(e.src))+`<div class="news-context"><div class="sect">ليش هذا الحدث مهم؟</div><p>${esc(e.impact||'قد يؤثر التقرير على توقعات الفائدة والعملات وتقييم الاستثمارات. التأثير الفعلي يعتمد على النتائج مقارنة بتوقعات السوق.')}</p><p>${esc(e.s)}</p></div><div class="sub">موعد معلن قابل للتغيير. الحدث لا يتوقع اتجاه السوق.</div>${e.url&&/^https:\/\//.test(e.url)?`<a class="fbtn" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">الجدول الرسمي ↗</a>`:''}`);}
