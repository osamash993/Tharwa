#!/usr/bin/env python3
"""Literal, fail-fast migration from the user-supplied visual reference."""
from pathlib import Path
import sys,re,json,subprocess,hashlib
root=Path(__file__).resolve().parents[1]
reference=Path(sys.argv[1])
html=reference.read_text()
expected=''
scripts=re.findall(r'<script[^>]*>([\s\S]*?)</script>',html)
js=scripts[-1]
def replace(old,new):
    global js
    if js.count(old)!=1: raise SystemExit('FAIL literal target: '+old[:90])
    js=js.replace(old,new,1);print('OK',old[:70].splitlines()[0])
def functions(source):
    temp=root/'scripts/cc/.parse-tmp.js';temp.write_text(source)
    try:
        result=subprocess.check_output(['node',str(root/'scripts/cc/function-index.cjs'),str(temp)],text=True)
        return {f['name']:source[f['start']:f['end']] for f in json.loads(result)}
    finally: temp.unlink(missing_ok=True)
old_functions=functions(js)
data_start=js.index('const FX=')
data_end=js.index('const GEO_AR=')
replace(js[data_start:data_end],(root/'scripts/cc/data.js').read_text()+'\n')
for path in sorted((root/'scripts/cc').glob('*.overrides.js')):
    source=path.read_text();new_functions=functions(source)
    leftovers=source
    for name,fn in new_functions.items():
        if name in old_functions:
            replace(old_functions[name],fn);leftovers=leftovers.replace(fn,'',1)
    replace('renderFx();boot();',leftovers+'\nrenderFx();boot();')
# Remove demo-only registries, settings and synthetic external data.
for name,new in [('REG_X','const REG_X={};'),('ST',"const ST=Object.assign({idle:1,spin:'n',translate:false,reduce:false,burn:true,evMin:.5,evOn:{},events:[],links:{},holdAt:{},holdN:{},alerts:[],home:{n:'الخبر',cc:'SA',lon:50.1,lat:26.43}},S.cc);"),('ZK',"const ZK={hawl:S.zakat.hawl?.dueStr||'',cal:'hijri',margin:0};")]:
    match=re.search(r'const '+name+r'=\{[\s\S]*?\n?\};',js)
    if not match: raise SystemExit('FAIL declaration '+name)
    replace(match.group(0),new)
replace("let DELETED=[{t:['2026-04-02','ISDE','Buy',50,41.2],at:'2026-04-03'}];","let DELETED=[];")
replace("let RECENT=['a:ISWD','a:Gold','c:0','p:0'];","let RECENT=[];")
replace("const txSAR=t=>t[3]*toSAR(t[4],AS[t[1]].cur);","const txSAR=t=>Math.abs(t[8]?.totalCostSAR||0);")
replace("const fmt=(n,d=0)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:d,minimumFractionDigits:d}).format(n||0);","const fmt=(n,d=0)=>n==null||!Number.isFinite(Number(n))?'—':new Intl.NumberFormat('en-US',{maximumFractionDigits:d,minimumFractionDigits:d}).format(n);")
replace("const fmtC=s=>CUR_SYMS[baseCur]+'‎ '+fmt(Math.abs(toB(s)));","const fmtC=s=>CUR_SYMS[baseCur]+'‎ '+fmt(toB(s));")
replace("const natFmt=(v,c)=>c==='GBp'?fmt(v,0)+' GBp':c==='SARg'?fmt(v,1)+' SAR/g':fmt(v,2)+' '+c;","const natFmt=(v,c)=>v==null?'غير متاح':c==='GBp'?fmt(v,2)+' GBp':c==='SARg'?fmt(v,1)+' SAR/g':fmt(v,2)+' '+c;")
replace("let selM=8;","let selM=new Date().getMonth();let selectedYear=new Date().getFullYear();")
replace("const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];","const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];")
replace("document.querySelectorAll('#curSeg button').forEach(b=>b.onclick=()=>{baseCur=b.dataset.c;renderFx();document.querySelectorAll('#curSeg button').forEach(x=>x.classList.toggle('on',x===b));renderAll();});","document.querySelectorAll('#curSeg button').forEach(b=>b.onclick=()=>stCur(b.dataset.c));")
replace("setFocus(ranked[0][0]);","if(ranked[0])setFocus(ranked[0][0]);")
replace("const ll=LL[cc];const d=", "const ll=LL[cc];if(!ll)return;const d=")
js=js.replace("${fmt(LL[cc][0],1)}°, ${fmt(LL[cc][1],1)}°", "${geoPositionLabel(cc)}")
js=js.replace("${fmt(LL[cc][0],1)}°N ${fmt(LL[cc][1],1)}°E", "${geoPositionLabel(cc)}")
js=js.replace("const ll=LL[cc];if(!ll)return;const d=((((-ll[1])", "const ll=LL[cc];if(!ll){setFocus(cc);return;}const d=((((-ll[1])")
js=js.replace("if(!f0)return '<div class=\"mapfb\">الخريطة غير متاحة</div>';", "if(!f0)return '<div class=\"mapfb\">'+((cc==='EZ'||cc==='EU')?'تعرّض إقليمي مجمّع · موضع الخريطة تمثيلي، وليس توزيعاً بين الدول':'الخريطة غير متاحة')+'</div>';")
replace("const B=baseCur,bv=", "const B=baseCur,bv=") if False else None
js=js.replace('inset:0 auto 0 0;right:auto;', 'inset-block:0;inset-inline-start:0;')
js=js.replace('order.forEach((el,k)=>', 'order.filter(Boolean).forEach((el,k)=>')
# RTL bars preserve label/value ordering; canvas positive angles run clockwise.
replace(old_functions['renderDiv'],old_functions['renderDiv'].replace('direction:ltr','direction:rtl').replace('left:','inset-inline-start:').replace('right:','inset-inline-end:').replace('translateX(-50%)','translateX(50%)'))
replace('b.dir=b.chg<0?-1:1;', 'b.dir=b.chg>0?-1:b.chg<0?1:0;')
replace('الرابح يدور بعكس عقارب الساعة، والخاسر باتجاهها.', 'الرابح يدور بعكس عقارب الساعة، والخاسر باتجاهها. الأصل بلا تغيّر أو بلا سعر متاح يبقى ثابتاً.')
# Dividend deposits stay cash entries while the UI exposes their income source.
js=js.replace("${ACT_AR[c.act]}","${c.act==='Dividend'?'إيداع توزيعات · '+esc(c.sourceName):ACT_AR[c.act]}")
js=js.replace("c.act==='Deposit'?'var(--cb)'", "['Deposit','Dividend'].includes(c.act)?'var(--cb)'")
js=js.replace("natTot(c.s/liveRate(CASH[c.acc].c),CASH[c.acc].c)","natTot(c.s/(c.act==='Dividend'?c.rate:liveRate(CASH[c.acc].c)),CASH[c.acc].c)")
# Date/currency bugs in reference detail markup: use recorded movement totals.
# Transaction detail is replaced by the engine-backed dialog.
replace("const coChg=k=>{let h=0;for(const c of k)h=(h*31+c.charCodeAt(0))%997;return ((h%420)-180)/100;};", "const coChg=k=>companyQuotes[k]?.changePct??null;")
replace("const coSrc=tk=>{let h=0;for(const ch of tk)h+=ch.charCodeAt(0);return h%4===0?'FMP':'Yahoo';};", "const coSrc=tk=>'غير متاح';")
a=js.index('const newsRow=');b=js.index('\n',a)
replace(js[a:b],"const newsRow=x=>`<div class=\"nw clk\" onclick=\"openNews(${NEWS.indexOf(x)})\"><span class=\"tg\">${esc(x.via||x.a)}</span><div class=\"tx\">${esc(x.t)}<div class=\"mt\">${esc(x.ago)} · ${esc(x.source||'Yahoo')}</div></div></div>`;")
replace("const ll=LL[cc],d=d3.geoDistance([ll[1],ll[0]],center);", "const ll=LL[cc];if(!ll)return;const d=d3.geoDistance([ll[1],ll[0]],center);")
replace("const ll=LL[cc],d=d3.geoDistance([ll[1],ll[0]],c);", "const ll=LL[cc];if(!ll)return;const d=d3.geoDistance([ll[1],ll[0]],c);")
replace("const ll=LL[cc];ctx.strokeStyle", "const ll=LL[cc];if(!ll)return;ctx.strokeStyle")
replace("const ll=LL[cc],lonlat=[ll[1],ll[0]],dist=", "const ll=LL[cc];if(!ll)return;const lonlat=[ll[1],ll[0]],dist=")
replace("if(XR){const mx=ranked[0][1];", "if(XR&&ranked.length){const mx=ranked[0][1];")
replace("const cc=focusCC,v=XR.countries[cc]||0;", "const cc=focusCC,v=XR.countries[cc]||0;") if False else None
js=js.replace('>RIYADH</text>', '>${esc(ST.home.n)}</text>')
replace("ambDriftT=setInterval(()=>{$('ambHud').style.transform=", "ambDriftT=setInterval(()=>{if(!ST.burn)return;$('ambHud').style.transform=")
replace("const sgn=(v,f=fmtC)=>(v>=0?'+':'−')+f(v);", "const sgn=(v,f=fmtC)=>(v>=0?'+':'−')+f(Math.abs(v));")
replace("s:'محققة',v:o.v", "s:(o.inc===false?'غير مدرج':o.type==='unrealized'?'غير محقق':'محقق'),v:o.v")
js=js.replace('التكلفة بطريقة FIFO، والتخزين الداخلي بالريال','راجع تفاصيل الحركة وتأثيرها على رصيدك قبل الحفظ')
# Visibility applies to all display categories without renumbering cash accounts.
js=js.replace('...PROP.map(p=>', '...PROP.filter(p=>assetVisible(p.n)).map(p=>')
js=js.replace('...CASH.map(c=>', '...CASH.filter(c=>assetVisible(c.n)).map(c=>')
js=js.replace("if(k==='Property') items=PROP.map", "if(k==='Property') items=PROP.filter(p=>assetVisible(p.n)).map")
js=js.replace("if(k==='Cash') items=CASH.map((c,i)=>", "if(k==='Cash') items=CASH.map((c,i)=>")
js=js.replace("on:`openTxForm('c:${i}',null,'Deposit')`}));", "on:`openTxForm('c:${i}',null,'Deposit')`})).filter(c=>assetVisible(c.n));")
js=js.replace('PROP.forEach(p=>L.push({id:p.n', 'PROP.filter(p=>assetVisible(p.n)).forEach(p=>L.push({id:p.n')
js=js.replace('CASH.forEach(c=>L.push({id:c.n', 'CASH.filter(c=>assetVisible(c.n)).forEach(c=>L.push({id:c.n')
js=js.replace("['macro','اقتصاد','قرارات الفائدة والتضخم للدول اللي إلك فيها تعرض','FMP']", "['macro','اقتصاد','الفيدرالي والتضخم والتوظيف والنمو','Fed · BLS · BEA']")
replace("renderFx();boot();","installCommandCenter();boot();")
# Remove abandoned prototype-only actions after replacing their visible controls.
current_functions=functions(js)
for name in ['stVerify','stNewAssetHTML','stAddProp','stAddCash','fundBlock','zkSet','zkRefresh','ctxDel']:
    if name in current_functions:replace(current_functions[name],'')
replace("const X=XR,T=X.total,us=(X.countries.US||0)/T*100;", "const X=XR,T=X.total;if(!T){$('hTips').innerHTML='<div class=\"empty\">أضف استثمارات لعرض تحليل التنويع</div>';return;}const us=(X.countries.US||0)/T*100;")
js=re.sub(r'^.*حركات الشركات تجريبية.*$', '    <div class="sub">الرمادي يعني أن سعر الشركة غير متاح</div>`;},',js,flags=re.M)
js=re.sub(r'/\*[\s\S]*?\*/','',js)
js=re.sub(r'^//.*(?:تجريبي|بالتنفيذ).*$', '',js,flags=re.M)
out=root/'public/command-center';out.mkdir(exist_ok=True)
(out/'app.js').write_text(js)
# Extract the existing self-contained d3/topojson/map vendor blocks unchanged.
vendor='\n'.join(scripts[1:-1]);(out/'geo-vendor.js').write_text(vendor)
markup=re.sub(r'<script[^>]*>[\s\S]*?</script>','',html)
markup=re.sub(r'<link[^>]+fonts.googleapis.com[^>]+>', '<link rel="stylesheet" href="./fonts.css">',markup)
markup=markup.replace('<div id="nwList"></div>', '<div id="nwList" tabindex="0" aria-label="أخبار الاستثمارات — قائمة قابلة للتمرير"></div>')
markup=markup.replace('<div class="p">\n      <div class="ph"><h3><i class="ti ti-news">', '<div class="p news-panel">\n      <div class="ph"><h3><i class="ti ti-news">')
markup=re.sub(r'<div class="demo">[\s\S]*?</div>', '', markup)
markup=markup.replace('<div id="evList" style="max-height:236px;overflow-y:auto;scrollbar-width:none"></div>', '<div id="evList" tabindex="0" aria-label="قائمة الأحداث — تمرير عمودي"></div>')
markup=markup.replace('<div class="p">\n      <div class="ph"><h3><i class="ti ti-atom-2">', '<div class="p analysis-panel">\n      <div class="ph"><h3><i class="ti ti-atom-2">')
markup=markup.replace('<div class="p">\n      <div class="ph"><h3><i class="ti ti-radar">', '<div class="p events-panel">\n      <div class="ph"><h3><i class="ti ti-radar">')
markup=markup.replace('</head>','<link rel="stylesheet" href="./integration.css">\n<script src="./safety.js"></script>\n</head>')
markup=markup.replace('</body>','<script src="./geo-vendor.js"></script>\n<script src="./app.js"></script>\n</body>')
markup=markup.replace('تصوّر — البنية والحسابات من O.db · القيم والأخبار تجريبية','O.db · بيانات محفظتك · <a href="#" onclick="ENGINE.legacy();return false">الواجهة السابقة</a>')
markup=markup.replace('المواعيد تجريبية — بالتنفيذ من تقويم Yahoo وإعدادات الزكاة وتوقع الأهداف','الأحداث من المصادر المتاحة وإعداداتك؛ التوقعات موسومة بوضوح')
markup=markup.replace('<button class="ibtn"><i class="ti ti-refresh">','<button class="ibtn" onclick="refreshLive(this)"><i class="ti ti-refresh">')
# Keep synchronization and refresh controls in Settings only.
markup=re.sub(r'^[ \t]*<button class="ibtn"[^>]*><i class="ti ti-(?:refresh|cloud-check)"></i>[^\n]*?</button>\n', '', markup, flags=re.M)
markup=markup.replace('للسوق · 2026','للسوق · <span id="txnYearLabel"></span>')
# Repair an unclosed section in the supplied reference.
markup=markup.replace('  <section class="lab">','  </section>\n  <section class="lab">')
import shutil
iconcss=(root/'node_modules/@tabler/icons-webfont/dist/tabler-icons.min.css').read_text()
names=set(re.findall(r'ti-[a-z0-9-]+',markup+js))
icons='.ti{font-family:tabler-icons!important;font-style:normal;font-weight:normal;line-height:1}'
for name in sorted(names):
    m=re.search(r'\.'+re.escape(name)+r':before\{[^}]*\}',iconcss)
    if m:icons+=m.group(0)
(out/'icons.css').write_text(icons)
(out/'tabler-icons.woff2').unlink(missing_ok=True)
markup=re.sub(r'<link[^>]+cdn.jsdelivr.net[^>]+>','<link rel="stylesheet" href="./icons.css">',markup)
for filename in ['app.js','geo-vendor.js','icons.css','fonts.css','integration.css','safety.js']:
    digest=hashlib.sha256((out/filename).read_bytes()).hexdigest()[:12]
    markup=markup.replace('./'+filename+'"','./'+filename+'?v='+digest+'"')
(out/'index.html').write_text(markup)
subprocess.run(['node','--input-type=commonjs','--check'],input=js,text=True,check=True)
print('OK classic script syntax; reference SHA256',hashlib.sha256(reference.read_bytes()).hexdigest())
