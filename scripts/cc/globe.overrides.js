function pulseState(){return window._marketPulse||(window._marketPulse={mode:'today',quotes:{},at:0,error:null,busy:false,brief:[],briefError:null});}
function pulseMode(value){if(!['today','fx','events','exposure'].includes(value))return;pulseState().mode=value;renderGlobeHud();renderFocus();}
function pulseChange(value){return Number.isFinite(value)?`<bdi class="${value<0?'dn':'up'}">${value>0?'+':''}${fmt(value,2)}%</bdi>`:'<span class="mu">غير متاح</span>';}
function pulseQuote(cc){return pulseState().quotes['market:'+cc];}
function pulseFX(cc){return TharwaPulse.fx(TharwaPulse.config(cc).currency,pulseState().quotes,baseCur);}
function pulseStamp(timestamp){return Number.isFinite(timestamp)&&timestamp>0?new Date(timestamp*1000).toLocaleString('ar-SA-u-ca-gregory',{timeZone:'Asia/Riyadh',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'لا يوجد سعر مؤرّخ';}
function pulseRelated(item,cc){if(item.countryCodes?.length)return item.countryCodes.includes(cc);const names=impactOf(item).positions.map(p=>p.name);return (XR.src[cc]||[]).some(s=>names.includes(s.f));}
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
 $('gList').innerHTML=`<div class="pulse-heading">${{today:'حركة الأسواق',fx:'العملات مقابل '+baseCur,events:'مستجدات مرتبطة',exposure:'كل الدول · حسب الحصة'}[m]}</div><div class="pulse-country-list">`+ordered.map(([cc,v])=>{const q=pulseQuote(cc),fx=pulseFX(cc),items=m==='events'?pulseItems(cc):[];const value=m==='exposure'?`<bdi>${fmt(percent(v,T),1)}%</bdi>`:m==='events'?`<bdi>${items.length}</bdi>`:pulseChange(m==='fx'?fx?.changePct:q?.changePct);return `<button class="gr ${focusCC===cc?'on':''}" data-cc="${cc}" onclick="flyTo('${cc}')"><span class="k">${flag(cc)} ${esc(GEO_AR[cc]||cc)}</span><span class="v">${value}</span></button>`;}).join('')+`</div><div class="pulse-foot">${m==='exposure'?'حسب آخر تركيبة متاحة للصناديق':m==='fx'?'تغيّر العملة المحلية مقابل '+baseCur+'؛ ليس تعرّض الصندوق الصافي':m==='events'?'الذهبي للأهمية، وليس لاتجاه السعر':`مؤشرات متاحة: ${covered}/${ranked.length} · السياق لا يساوي عائد محفظتك`}</div>`;
}
function pulseCountryBody(cc){const q=pulseQuote(cc),cfg=TharwaPulse.config(cc),fx=pulseFX(cc),st=pulseState(),v=XR.countries[cc]||0;return `<div class="pulse-market"><span>${esc(cfg.label||'مؤشر غير مغطى')}</span><strong>${pulseChange(q?.changePct)}</strong></div><div class="pulse-session">${esc(TharwaPulse.session(q))}</div><div class="pulse-foot">آخر سعر: ${pulseStamp(q?.timestamp)} · <a href="https://finance.yahoo.com/quote/${encodeURIComponent(cfg.symbol||'')}" target="_blank" rel="noopener noreferrer">Yahoo Finance ↗</a> · قد تتأخر البيانات</div><div class="pulse-fx"><span>${esc(cfg.currency||'العملة غير متاحة')} / ${esc(baseCur)}</span><bdi>${fx?fmt(fx.rate,4):'—'}</bdi>${pulseChange(fx?.changePct)}</div><div class="pulse-foot">العملة المحلية مقابل ${esc(baseCur)} · ${pulseStamp(fx?.timestamp)}<br>سياق للعملة؛ التحوّط وانكشاف إيرادات الشركات غير محسوبين.</div><div class="pulse-exposure">حصتك: <bdi>${fmtC(v)}</bdi> · <bdi>${fmt(percent(v,XR.total),1)}%</bdi> من الأسهم والصناديق</div><div class="pulse-foot">عبر: ${(XR.src[cc]||[]).map(s=>esc(s.f)).join('، ')||'غير متاح'}</div>${st.error?'<p class="coverage-warning">تعذّر تحديث بعض الأسعار؛ راجع وقت آخر سعر.</p>':''}`;}
function renderFocus(){if(!focusCC||!XR)return;if(pulseState().mode==='exposure')return renderExposureFocus();const cc=focusCC,f=$('focus');f.innerHTML=`<div class="fh"><span class="fn">${flag(cc)} ${esc(GEO_AR[cc]||cc)}</span><button class="pulse-more" onclick="openPulseCountry('${cc}')">التفاصيل ↗</button></div><div class="pulse-focus-body">${pulseCountryBody(cc)}${pulseState().mode==='events'?pulseItems(cc).slice(0,2).map(pulseItemButton).join(''):''}</div>`;}
function openPulseCountry(cc){openHolo(modalHead('MARKET PULSE',flag(cc)+' '+(GEO_AR[cc]||cc),'السوق والعملات والمستجدات المرتبطة باستثماراتك')+`<div class="pulse-dialog">${pulseCountryBody(cc)}<div class="sect">أخبار وأحداث مرتبطة</div>${pulseItems(cc).map(pulseItemButton).join('')||'<p class="mu">لا مستجدات مرتبطة متاحة حاليًا</p>'}<button class="fbtn sm" onclick="openCountry('${cc}')">تفاصيل توزيع استثماراتي</button></div>`);}
function openPulseOverview(){const st=pulseState();openHolo(modalHead('PORTFOLIO PULSE','ماذا تغيّر حول محفظتي؟','متابعة الأسعار كل 5 دقائق أثناء فتح الأداة؛ الأخبار كل 15 دقيقة')+`<div class="pulse-dialog"><p class="sub">مؤشر السوق سياق عام؛ قد تختلف حركة أصولك عنه. الألوان الزرقاء للصعود والحمراء للهبوط والذهبية لأهمية المستجدات.</p>${st.briefError?'<p class="coverage-warning">بعض مصادر الأخبار الاقتصادية غير متاحة حاليًا.</p>':''}<div class="sect">حركة الأسواق · كل الدول المتاحة</div><div class="pulse-overview-grid">${ranked.map(([cc])=>`<button class="pulse-summary" onclick="openPulseCountry('${cc}')"><b>${flag(cc)} ${esc(GEO_AR[cc]||cc)}</b>${pulseChange(pulseQuote(cc)?.changePct)}<small>${esc(TharwaPulse.session(pulseQuote(cc)))}</small><small>${pulseStamp(pulseQuote(cc)?.timestamp)}</small></button>`).join('')}</div><div class="sect">الأخبار والأحداث حسب الأهمية</div>${pulseItems().map(pulseItemButton).join('')||'<p class="mu">لا مستجدات مرتبطة متاحة حاليًا</p>'}</div>`);}
async function loadPulse(){const state=pulseState(),req=TharwaPulse.requests(Object.keys(XR.countries),baseCur),signature=JSON.stringify(req);if(state.busy||document.hidden||S.status.demo||(state.signature===signature&&Date.now()-state.at<300000))return;state.busy=true;try{let failed=false;for(let i=0;i<req.length;i+=40){const r=await ENGINE.market('getGlobeQuotes',req.slice(i,i+40));if(r.ok===false){failed=true;continue;}Object.assign(state.quotes,r.quotes||{});if(r.unavailable?.length)failed=true;}state.error=failed?'تغطية جزئية للأسعار':null;state.at=Date.now();state.signature=signature;}catch{state.error='تعذر التحديث';}finally{state.busy=false;renderGlobeHud();renderFocus();}}
async function loadPulseBrief(){const s=pulseState();try{const r=await ENGINE.market('getMarketBriefing');if(r.ok!==false){s.brief=r.items||[];s.briefError=r.unavailable?.length?r.unavailable.join('، '):null;}else s.briefError=r.error;}catch{s.briefError='الأخبار الاقتصادية غير متاحة';}renderGlobeHud();renderFocus();}
function pulseMapColor(cc,alpha){const m=pulseState().mode;if(m==='exposure')return `rgba(79,216,255,${alpha})`;if(m==='events'){const important=(window._pulseScores||{})[cc];return important>=70?`rgba(244,184,96,${alpha})`:important>0?`rgba(117,201,255,${alpha})`:`rgba(100,123,140,${alpha*.5})`;}const n=m==='fx'?pulseFX(cc)?.changePct:pulseQuote(cc)?.changePct;return !Number.isFinite(n)?`rgba(100,123,140,${alpha*.5})`:n<0?`rgba(255,107,90,${alpha})`:`rgba(79,216,255,${alpha})`;}
function pulseMapLabel(cc,v,total){const m=pulseState().mode;if(m==='exposure')return (GEO_AR[cc]||cc)+' '+fmt(percent(v,total),1)+'%';if(m==='events')return (GEO_AR[cc]||cc)+((window._pulseScores||{})[cc]>=70?' · حدث مهم':'');const n=m==='fx'?pulseFX(cc)?.changePct:pulseQuote(cc)?.changePct;return (GEO_AR[cc]||cc)+' '+(Number.isFinite(n)?(n>0?'+':'')+fmt(n,2)+'%':'—');}

function renderXrHud(){
  XR=computeXray();const T=XR.total;ranked=Object.entries(XR.countries).sort((a,b)=>b[1]-a[1]);
  renderGlobeHud();
  const M=xrMetrics(XR),g=M.total>=80?'ممتاز':M.total>=65?'جيد جداً':M.total>=50?'جيد':'يحتاج تنويع';
  $('hScore').textContent=M.total;$('hGrade').textContent=g;setTimeout(()=>$('hArc').setAttribute('stroke-dasharray',(M.total/100*251).toFixed(1)+' 252'),100);
  $('hRows').innerHTML=[['تنويع جغرافي',M.s.geo],['تنويع قطاعي',M.s.sec],['تنويع عملات',M.s.cur],['قلة التداخل',M.s.ovl],['توازن متقدمة/ناشئة',M.s.bal]]
    .map(([k,v])=>`<div class="hr"><span class="k">${k}</span><div class="b"><i style="width:${v}%"></i></div><span class="v n">${fmt(v)}</span></div>`).join('');
  renderScen();renderFocus();renderDiv(M);renderTips(M);
}

function renderExposureFocus(){
  const cc=focusCC;if(!cc||!XR)return;const v=XR.countries[cc],T=XR.total;
  const cos=Object.values(XR.companies).filter(c=>c.cc===cc).sort((a,b)=>b.val-a.val).slice(0,3);
  const f=$('focus');f.style.animation='none';f.offsetHeight;f.style.animation='focusIn .5s ease both';
  f.innerHTML=`<div class="fh"><span class="fn">${flag(cc)} ${GEO_AR[cc]}</span><span class="tag">${cc} · ${geoPositionLabel(cc)}</span></div>
    <div style="display:flex;align-items:baseline;gap:10px;margin-top:4px"><span class="fv n">${fmtC(v)}</span><span class="n mu">${fmt(v/T*100,1)}% من الأسهم والصناديق</span></div>
    <div class="fc">عبر: ${XR.src[cc].map(s=>`${s.f} <span class="n">${fmt(s.w,1)}%</span>`).join(' · ')}${cos.length?'<br>أبرز الشركات: '+cos.map(c=>c.ar).join('، '):''}</div>
    <div class="go" onclick="openCountry('${cc}')">فتح التفاصيل الكاملة ←</div>`;
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
  if(XR){ctx.lineWidth=1;ranked.forEach(([cc])=>{const ll=LL[cc];if(!ll)return;ctx.strokeStyle=cc===focusCC?`rgba(180,243,255,${.35+.55*fa})`:'rgba(79,216,255,.3)';
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

function setFocus(cc){
 if(cc===focusCC)return;
 // Keep the country and its scroll position stable while reading a HUD panel.
 if(mode==='auto'&&document.querySelector('#globeWrap .hud.pe:hover'))return;
 focusCC=cc;focusT=performance.now();renderFocus();
 document.querySelectorAll('#gList .gr').forEach(e=>e.classList.toggle('on',e.dataset.cc===cc));
}
