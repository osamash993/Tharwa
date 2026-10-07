// Explainable relevance, not a price forecast. Values use the portfolio's SAR basis.
(() => {
 const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,Number(n)||0));
 const rules=[
  ['policy',/\b(fomc|federal reserve|fed minutes|interest rates?|rate (?:cut|hike)|treasury|bond yields?|inflation|cpi|pce|ppi|payroll|employment|gdp|jolts)\b|الفيدرالي|الفائدة|السندات|التضخم|الوظائف|البطالة/i,3,'الفائدة والتضخم والعوائد قد تنتقل آثارها إلى الأسهم والذهب'],
  ['china',/\b(china|chinese|beijing|pboc|hong kong)\b|الصين|الصيني|هونغ كونغ/i,2,'ارتباط جغرافي بالصين وهونغ كونغ'],
  ['energy',/\b(oil|brent|opec|crude|petroleum|energy)\b|النفط|الطاقة|أوبك/i,2,'قناة اقتصادية عامة عبر الطاقة والتكاليف والتضخم'],
  ['geopolitical',/\b(tariffs?|sanctions?|war|invasion|trade restrictions?|export ban)\b|تعرفات|رسوم جمركية|عقوبات|حرب/i,3,'مخاطر سياسية وتجارية؛ اتجاه الأثر غير محسوم'],
  ['activity',/\b(ism|pmi|retail sales|durable goods|industrial production|jobless|beige book)\b|مبيعات التجزئة|السلع المعمرة|الإنتاج الصناعي|طلبات الإعانة/i,2,'بيانات النشاط الاقتصادي وتوقعات النمو'],
  ['gold',/\b(gold|bullion|precious metals?)\b|الذهب|المعادن الثمينة/i,2,'خبر مرتبط بسوق الذهب'],
  ['company',/\b(earnings|guidance|profit warning|bankrupt|dividend|results|recall|lawsuit|merger|acquisition)\b|أرباح|نتائج|توزيع|إفلاس|استدعاء|استحواذ/i,3,'حدث مالي أو تشغيلي للشركة']
 ];
 function classify(item){
  const t=[item.t,item.title,item.kind].filter(Boolean).join(' '),matches=rules.filter(r=>r[1].test(t));
  if(['fed','minutes','cpi','ppi','pce','jobs','gdp','jolts','auction','h15'].includes(item.kind)&&!matches.some(r=>r[0]==='policy'))matches.push(rules[0]);
  return {topics:matches.map(r=>r[0]),severity:Math.max(1,...matches.map(r=>r[2])),reasons:matches.map(r=>r[3])};
 }
 function exposure(item,ctx){
  const positions=(ctx.positions||[]).filter(p=>p.val>0),byName=new Map(positions.map(p=>[p.n,p])),parts=new Map();let incomplete=false;
  function add(name,weight=100,key='direct') {const p=byName.get(name);if(!p)return;let a=parts.get(name);if(!a){a={name,parts:new Map(),p};parts.set(name,a);}a.parts.set(key,Math.max(a.parts.get(key)||0,clamp(weight)));}
  const personal=['zakat','goal'].includes(item.c)||item.src==='يدوي';
  if(personal)return {positions:[],value:0,pct:null,incomplete:false,personal:true};
  const macro=item.c==='macro'||item.scope==='macro';
  const info=classify(item);
  if(macro){
   if(info.topics.includes('china')&&!info.topics.some(t=>['policy','geopolitical','energy'].includes(t))){
    for(const p of positions){const c=ctx.funds?.[p.n]?.countries;if(c)add(p.n,(Number(c.CN)||0)+(Number(c.HK)||0),'country');else if(/\.HK$|\.SS$|\.SZ$/i.test(p.yh||''))add(p.n);else if(p.t==='Stock')incomplete=true;}
   }else if(info.topics.length===1&&info.topics[0]==='gold'){positions.filter(p=>p.t==='Gold').forEach(p=>add(p.n));}
   else if(info.topics.length){positions.filter(p=>['Stock','Gold'].includes(p.t)).forEach(p=>add(p.n));}
   else incomplete=true;
  }else{
   for(const r of item.related||[{a:item.asset||item.a,via:item.via}]){
    const co=r.key?ctx.companies?.[r.key]:Object.values(ctx.companies||{}).find(c=>r.via&&c.ar===r.via);
    if(co){for(const v of co.via||[])if(Number.isFinite(Number(v.w)))add(v.f,v.w,co.k||r.key||r.via);else incomplete=true;}
    else if(r.via)incomplete=true;
    else if(r.a)add(r.a);
    else incomplete=true;
   }
  }
  const linked=[...parts.values()].map(a=>{const weights=[...a.parts.values()],weight=a.parts.has('direct')?100:clamp(weights.reduce((x,y)=>x+y,0));return {name:a.name,weight,value:a.p.val*weight/100};});
  const value=linked.reduce((s,p)=>s+p.value,0),pct=ctx.total>0?clamp(value/ctx.total*100):null;
  return {positions:linked,value,pct,incomplete,personal:false};
 }
 function assess(item,ctx,now=Date.now()){
  const link=exposure(item,ctx),info=classify(item),macro=item.c==='macro'||item.scope==='macro';
  const date=Date.parse(item.atUTC||item.date||(item.d?item.d+'T12:00:00Z':''));
  const distance=Number.isFinite(date)?Math.abs(date-now)/864e5:Infinity,urgency=distance<=1?15:distance<=7?8:0;
  const severity=['earn','div'].includes(item.c)?3:info.severity;
  const known=link.pct!==null&&link.positions.length>0;
  const tentative=!macro&&item.c==null&&!item.headline;
  const score=known?Math.min(tentative?69:100,Math.round(severity/3*50+Math.min(35,link.pct*.7)+urgency)):null;
  const tier=link.personal?'personal':!known?'unknown':score>=70?'high':score>=40?'medium':'low';
  const label={high:'أهمية مرتفعة',medium:'أهمية متوسطة',low:'أهمية منخفضة',unknown:'الارتباط غير محدد',personal:'موعد شخصي'}[tier];
  const reason=link.personal?'موعد من خطتك الشخصية، وليس تقييمًا لتأثير السوق':(info.reasons.join('؛ ')||'صلة بالاستثمار من المصدر المتاح')+(macro?' · ارتباط اقتصادي محتمل، وليس أثرًا متساويًا على كل الأصول':tentative?' · ورد في موجز الأصل؛ الصلة تحتاج قراءة الخبر':' · ارتباط مباشر أو عبر مكوّنات الصندوق');
  return {...link,score,tier,label,reason,confidence:link.incomplete?'بيانات الربط غير مكتملة':macro||tentative?'ارتباط تقديري':'ارتباط محدد',color:{high:'#f4b860',medium:'#75c9ff',low:'#8aa6b5',unknown:'#8aa6b5',personal:'#b7a3ef'}[tier]};
 }
 globalThis.TharwaImpact={classify,exposure,assess};
})();
