from pathlib import Path
r=Path(__file__).resolve().parents[1]
def patch(f,a,b):
 p=r/f;s=p.read_text()
 if s.count(a)!=1:raise SystemExit('FAIL '+f+' '+a[:80])
 p.write_text(s.replace(a,b,1));print('OK',f,a[:50])
patch('scripts/build-command-center.py','replace("tot=t[3]*n2s(t[4],a.cur,rate),nowU=", "tot=txSAR(t),nowU=")','''# Transaction detail is replaced by the engine-backed dialog.
replace("const coChg=k=>{let h=0;for(const c of k)h=(h*31+c.charCodeAt(0))%997;return ((h%420)-180)/100;};", "const coChg=k=>companyQuotes[k]?.changePct??null;")
replace("const coSrc=tk=>{let h=0;for(const ch of tk)h+=ch.charCodeAt(0);return h%4===0?'FMP':'Yahoo';};", "const coSrc=tk=>'غير متاح';")
a=js.index('const newsRow=');b=js.index('\\n',a)
replace(js[a:b],"const newsRow=x=>`<div class=\\"nw clk\\" onclick=\\"openNews(${NEWS.indexOf(x)})\\"><span class=\\"tg\\">${esc(x.a)}</span><div class=\\"tx\\">${esc(x.t)}<div class=\\"mt\\">${esc(x.ago)} · ${esc(x.source||'Yahoo')}</div></div></div>`;")''')
patch('src/api.js',"  if(method==='getNotes')", """  if(method==='checkRemote'){
   if(demo||blocked)return false;
   const {data,error}=await client.rpc('load_portfolio');if(error)throw error;
   const row=Array.isArray(data)?data[0]:data;
   if(row.version!==version){state={...emptyPortfolio(),...row.data};version=row.version;return true;}
   return false;
  }
  if(method==='getNotes')""")
patch('src/main.js',"import {createAPI} from './api.js';","import {createAPI} from './api.js';\nimport {setupCommandData} from './command-data.js';")
patch('src/main.js','window.portfolioAPI=api.rpc;','window.portfolioAPI=api.rpc;\nsetupCommandData({api,client,demo,onError:window.cloudFailure});')
patch('src/main.js',"  await loadScript('legacy/app.js');","  await loadScript('legacy/app.js');\n  await loadScript('legacy/command-bridge.js');")
patch('src/command-view.js',"// Phase 0: an isolated, deliberately empty root. No copied demo data/calculations.","// The visual reference runs in an isolated same-origin document; the engine stays here.")
p=r/'src/command-view.js';s=p.read_text();a=s.index(" root.setAttribute('aria-label'");b=s.index(' document.body.append(root)',a)
s=s[:a]+''' root.setAttribute('aria-label','O.db Command Center');
 root.innerHTML=`<button type="button" id="cc-return" hidden>الواجهة السابقة</button><iframe id="cc-frame" title="O.db Command Center" referrerpolicy="same-origin"></iframe><p id="cc-view-status" role="status" hidden></p>`;
'''+s[b:];p.write_text(s);print('OK command root')
patch('src/command-view.js',"   [...document.body.children].forEach(hideLegacy);root.hidden=false;","   [...document.body.children].forEach(hideLegacy);root.hidden=false;\n   const frame=root.querySelector('iframe');if(!frame.getAttribute('src'))frame.src=import.meta.env.BASE_URL+'command-center/index.html?v='+encodeURIComponent(import.meta.url);")
patch('src/command-view.js'," back.addEventListener('click',()=>choose('legacy'));"," back.addEventListener('click',()=>choose('legacy'));\n window.commandViewReturn=()=>choose('legacy');")
patch('src/command-view.js',"valid(saved)?saved:'legacy'","valid(saved)?saved:'cc'")
patch('public/legacy/command-bridge.js','   totals:{by:',"   goldOunce:Object.values(marketData).find(p=>p.currency==='USD'&&/gold/i.test(p.name||''))?.price??marketData['GC=F']?.price??null,\n   totals:{by:")
patch('public/legacy/command-bridge.js',"  setting:(k,v)=>window.commandStorage.write('saveSetting',k,typeof v==='string'?v:JSON.stringify(v)),","  setting:(k,v)=>window.commandStorage.write('saveSetting',k,typeof v==='string'?v:JSON.stringify(k==='zakatOpt'?{...setting('zakatOpt',{}),...v}:v)),")
