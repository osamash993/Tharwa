// Keep every marker inside its labelled category wedge, regardless of event count.
// Radial distance continues to encode the event date.
function evPos(e,i,R,cx,cy){
 const ci=EV_ORDER.indexOf(e.c),same=EV.filter(x=>x.c===e.c),k=Math.max(0,same.indexOf(e));
 const fraction=same.length>1?.16+.68*k/(same.length-1):.5;
 const a=-Math.PI/2+(ci+fraction)*2*Math.PI/EV_ORDER.length;
 const r=Math.max(12,evR(e.days,R));
 return [cx+r*Math.cos(a),cy+r*Math.sin(a),a];
}

function impactOf(item){return TharwaImpact.assess(item,{positions:S.POS,funds:XRAY_DATA,companies:S.XR.companies,total:S.totals.total});}
function impactBadge(item){const a=item.importance||impactOf(item);return `<div class="impact-badges"><span class="impact-badge impact-${a.tier}">${a.label}${a.score==null?'':` · <bdi>${a.score}/100</bdi>`}</span><span>${a.personal?'خطة شخصية':a.pct==null||!a.positions.length?'نسبة الارتباط غير متاحة':`مرتبط بـ <bdi>${fmt(a.pct,1)}%</bdi> من إجمالي المحفظة`}</span>${a.incomplete?'<span>بيانات غير مكتملة</span>':''}</div>`;}
function impactDetail(item){const a=impactOf(item);return `<div class="impact-explanation">${impactBadge(item)}<p>${esc(a.reason)}</p><small>${esc(a.confidence)} · درجة إرشادية، وليست احتمالًا أو نسبة ربح أو خسارة. الدرجة: أهمية الموضوع حتى 50، وحجم الارتباط حتى 35، وقرب الموعد أو حداثة الخبر حتى 15. مرتفعة من 70، ومتوسطة من 40. الخبر غير المؤكد الصلة لا يصنّف مرتفعًا.</small>${a.positions.length?`<p>الأصول المرتبطة: ${a.positions.map(p=>esc(p.name)).join('، ')}</p>`:''}</div>`;}
function ratedNewsRow(x){const a=impactOf(x);return `<div class="nw clk importance-${a.tier}" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openNews(${NEWS.indexOf(x)})}" onclick="openNews(${NEWS.indexOf(x)})"><span class="tg">${esc(x.scope==='macro'?'اقتصاد وأسواق':x.via||x.a)}</span><div class="tx">${esc(x.t)}${impactBadge(x)}<div class="mt">${esc(x.ago)} · ${esc(x.source||'Yahoo')}</div></div></div>`;}
function eventTimeLabel(e){return e.d;}
function cd(e){return TharwaPulse.dayLabel(e.d);}
function radarRow(e,i){const a=e.importance||impactOf(e);return `<div class="row clk radar-event importance-${a.tier} ${evSel===i?'evon':''}" role="button" tabindex="0" onmouseenter="evSel=${i}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}" onclick="${e.on}"><i class="ti ${EV_CAT[e.c]?.[1]||'ti-calendar'}" style="color:${a.color}"></i><div class="nm"><div class="t">${esc(e.t)}</div>${impactBadge(e)}<div class="s">${esc(eventTimeLabel(e))} · ${esc(e.src||e.s||'')}</div><div class="radar-reason">${esc(a.reason)}</div></div></div>`;}
function renderEvList(){
 const n=EV[0];$('evNext').innerHTML=n?`<div class="l">الحدث القادم · ${esc(EV_CAT[n.c]?.[0]||'حدث')}</div><div class="next-event-title">${esc(n.t)}</div><div class="n" id="evCd">${cd(n)}</div>`:'<div class="mu">لا مواعيد قادمة متاحة</div>';
 let controls=$('radarControls');if(!controls){controls=document.createElement('div');controls.id='radarControls';controls.className='radar-controls';controls.innerHTML='<span>الأهمية: <b class="impact-high">مرتفعة</b> · <b class="impact-medium">متوسطة</b> · <b class="impact-low">منخفضة</b></span><button class="fbtn sm" onclick="openRadarFull()">عرض موسّع ↗</button>';$('evList').before(controls);}
 $('evList').innerHTML=(sourceErrors.calendar?`<p class="coverage-warning">تغطية جزئية: ${esc(sourceErrors.calendar)}</p>`:'')+(EV.map(radarRow).join('')||'<div class="empty">لا أحداث متاحة من المصادر الحالية</div>');
}
function openRadarFull(){openHolo(modalHead('EVENT RADAR','رادار الأحداث','المواعيد حسب اليوم')+`<div class="radar-expanded"><p class="sub">الألوان للأهمية، وليست لاتجاه السعر. النسبة تمثل حجم المراكز المرتبطة من إجمالي محفظتك.</p><div class="radar-controls"><button class="fbtn sm" onclick="radarViewMode('all')">كل الأحداث</button><button class="fbtn sm" onclick="radarViewMode('high')">الأهمية المرتفعة</button><button class="fbtn sm" onclick="radarViewMode('priority')">الأعلى أولوية</button></div><div id="expandedEvents">${EV.map(radarRow).join('')}</div>${sourceErrors.calendar?`<p class="coverage-warning">تغطية جزئية: ${esc(sourceErrors.calendar)}</p>`:''}</div>`);}
function radarViewMode(mode){const entries=EV.map((e,i)=>({e,i})).filter(({e})=>mode!=='high'||e.importance?.tier==='high');if(mode==='priority')entries.sort((a,b)=>(b.e.importance?.score??-1)-(a.e.importance?.score??-1)||a.e.days-b.e.days);$('expandedEvents').innerHTML=entries.map(({e,i})=>radarRow(e,i)).join('')||'<div class="empty">لا أحداث ضمن هذا التقييم</div>';}

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
