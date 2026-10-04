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
 if(!state){state={el,signature:'',width:0,animation:null};marketTickerStates.set(id,state);state.observer=new ResizeObserver(()=>layoutMarketTicker(state));state.observer.observe(el.parentElement);}
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
function renderFx(){renderMarketTicker('fx');if(ambOn)renderMarketTicker('ambTick');}
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
function openMonth(i){
 selM=i;activeDialog={fn:'openMonth',args:[i]};const m=monthReport(i),net=m.inv-m.liq,max=Math.max(1,m.average,...m.months.map(x=>Math.max(x.inv,x.liq))),delta=m.average?(m.inv/m.average-1)*100:null;
 const title=new Date(selectedYear,i,1).toLocaleDateString('ar-SA-u-ca-gregory',{month:'long',year:'numeric'}),cash=CTX.map((c,j)=>({c,j})).filter(({c})=>c.d.startsWith(m.k));
 const chart=m.months.map((x,j)=>`<button class="month-column ${j===i?'selected':''}" onclick="openMonth(${j})" aria-label="${x.k}: مشتريات ${fmtC(x.inv)}، مبيعات ${fmtC(x.liq)}" title="${x.k} · ${fmtC(x.inv)}"><div class="month-columns"><i style="height:${x.inv/max*100}%"></i><s style="height:${x.liq/max*100}%"></s></div><span>${x.m}</span></button>`).join('');
 const signed=v=>v==null?'غير متاح':(v>0?'+':'')+fmtC(v),top=Object.entries(m.byCategory).sort((a,b)=>b[1]-a[1])[0];
 openHolo(`<div class="month-report"><div class="mh"><div><div class="code">MONTH REPORT · ${m.k}</div><h2>${title}</h2><div class="full">${m.L.length} حركة · ${m.buy.length} شراء · ${m.sell.length} بيع</div></div><div class="px"><div class="mu">صافي ما وجّهته للسوق</div><b class="n ${net<0?'dn':'up'}">${net<0?'▼':'▲'} ${fmtC(Math.abs(net))}</b><div class="month-nav"><button class="fbtn sm" aria-label="الشهر السابق" onclick="changeReportMonth(-1)">→</button><button class="fbtn sm" aria-label="الشهر التالي" onclick="changeReportMonth(1)">←</button></div></div></div>
 <div class="kg">${cell('استثمرت',fmtC(m.inv))}${cell('سيّلت',fmtC(m.liq))}${cell('مقابل متوسط الأشهر النشطة',delta==null?'—':(delta>0?'+':'')+fmt(delta,1)+'%')}${cell('قيمة المتبقي من مشتريات الشهر اليوم',m.current==null?'غير متاح':fmtC(m.current))}${cell('ربح / خسارة المتبقي',signed(m.unrealized),m.unrealized<0?'dn':'up')}${cell('ربح محقق من مبيعات الشهر',signed(m.realized),m.realized<0?'dn':'up')}${cell('أكبر حركة',m.largest?esc(m.largest[1])+' · '+fmtC(txSAR(m.largest)):'—')}${cell('ترتيب الاستثمار',m.rank?m.rank+' / '+m.active.length:'—')}</div>
 <div class="month-layout"><div><div class="chartbox month-chart"><div class="cleg">مشتريات ▰ · مبيعات ▥ · متوسط ┄ <span>اضغط أي شهر للتنقّل</span></div><div class="month-plot"><div class="month-average" style="bottom:${m.average/max*100}%" title="المتوسط ${fmtC(m.average)}"></div>${chart}</div></div><div class="sect">التحليل</div><div class="month-analysis">${top?`<p>تركيز مشتريات الشهر: <b>${esc(KLF[top[0]]||top[0])}</b> بنسبة <b class="n">${fmt(percent(top[1],m.inv),1)}%</b>.</p>`:'<p>لا مشتريات مسجلة خلال هذا الشهر.</p>'}<p>متوسط الاستثمار في الأشهر ذات الحركات: <b class="n">${fmtC(m.average)}</b> · ${m.active.length} أشهر في ${selectedYear}.</p><p>صافي الشراء بعد البيع: <b class="n">${signed(net)}</b>. التحويلات النقدية المرتبطة غير مكررة ضمن هذا الرقم.</p><p>تقييم اليوم يخص الكميات المتبقية من دفعات هذا الشهر حسب FIFO، والربح المحقق يخص مبيعات الشهر.</p></div></div><aside><div class="sect">حسب الفئة</div>${monthBreakdown(m.byCategory,KLF)}<div class="sect">حسب الأصل</div>${monthBreakdown(m.byAsset)}<div class="sect">حركات الشهر</div><div class="month-transactions">${m.L.map(txRow).join('')||'<p class="empty">لا حركات استثمارية</p>'}</div>${cash.length?`<details class="month-cash"><summary>الحسابات النقدية · ${cash.length} حركة</summary>${cash.map(({c,j})=>ctxRow(c,j)).join('')}</details>`:''}</aside></div></div>`);
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
