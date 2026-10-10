// Refresh the committed generated script when the original visual reference
// is not available. The full reference compiler uses the same overrides.
import {readFileSync,writeFileSync} from 'node:fs';
import {parse} from '@babel/parser';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const write=(p,s)=>writeFileSync(new URL(p,root),s);
const declarations=s=>parse(s,{sourceType:'script'}).program.body.filter(n=>n.type==='FunctionDeclaration').map(n=>({name:n.id.name,start:n.start,end:n.end,text:s.slice(n.start,n.end)}));
let app=read('public/command-center/app.js');
for(const file of process.argv.slice(2))for(const fn of declarations(read(file))){
 const old=declarations(app).find(n=>n.name===fn.name);
 if(old)app=app.slice(0,old.start)+fn.text+app.slice(old.end);
 else app=app.replace('installCommandCenter();boot();',fn.text+'\ninstallCommandCenter();boot();');
}
app=app.replace(/^const newsRow=.*$/m,'const newsRow=x=>ratedNewsRow(x);');
app=app.replaceAll('cd(EV.find(e=>!e.atUTC||Date.parse(e.atUTC)>Date.now())||EV[0])','cd(EV[0])');
app=app.replace("flyTo(best.cc);openCountry(best.cc);","flyTo(best.cc);if(pulseState().mode==='exposure')openCountry(best.cc);else openPulseCountry(best.cc);");
app=app.replace("const tk=()=>$('clock').textContent=new Date().toTimeString().slice(0,8);tk();setInterval(tk,1000);","startServerClock();");
parse(app,{sourceType:'script'});write('public/command-center/app.js',app);
let html=read('public/command-center/index.html');
if(!html.includes('./impact-policy.js'))html=html.replace(/<script src="\.\/app.js/, '<script src="./impact-policy.js"></script>\n<script src="./app.js');
if(!html.includes('./market-pulse.js'))html=html.replace(/<script src="\.\/app.js/, '<script src="./market-pulse.js"></script>\n<script src="./app.js');
for(const file of ['app.js','integration.css','impact-policy.js','market-pulse.js']){
 const hash=createHash('sha256').update(read('public/command-center/'+file)).digest('hex').slice(0,12);
 html=html.replace(new RegExp('\\./'+file.replace('.','\\.')+'(?:\\?v=[^"\\s]+)?','g'),'./'+file+'?v='+hash);
}
write('public/command-center/index.html',html);
