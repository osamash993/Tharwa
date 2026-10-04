import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parse} from '@babel/parser';
const source=fs.readFileSync(new URL('../scripts/cc/dashboard.overrides.js',import.meta.url),'utf8');
const ast=parse(source);const names=['monthReport','marketTickerItems','tickerCurrencies','tickerItemHTML'];
const functions=ast.program.body.filter(n=>n.type==='FunctionDeclaration'&&names.includes(n.id.name)).map(n=>source.slice(n.start,n.end)).join('\n');
test('month report values remaining FIFO lots and separates sale proceeds from realized profit',()=>{
 const buy=['2026-06-01','A','Buy',10,10,1,'',null,{id:1,totalCostSAR:100}];
 const sell=['2026-06-02','A','Sell',4,15,1,'',null,{id:2,totalCostSAR:60}];
 const m={L:[buy,sell],buy:[buy],sell:[sell],inv:100,liq:60};
 const ctx=vm.createContext({MON:[0,1],monthStats:i=>i?{L:[],inv:0,liq:0}:m,AS:{A:{t:'Stock',p:20,cur:'SAR'}},ENGINE:{fifoReplay:()=>({1:{lot:{qty:6,p:10}},2:{pnl:20}})},txSAR:t=>t[8].totalCostSAR,toSAR:v=>v});vm.runInContext(functions,ctx);
 let r=ctx.monthReport(0);assert.equal(r.current,120);assert.equal(r.unrealized,60);assert.equal(r.realized,20);assert.equal(r.average,100);assert.equal(r.byAsset.A,100);
 ctx.AS.A.p=null;r=ctx.monthReport(0);assert.equal(r.current,null);assert.equal(r.unrealized,null);
 const empty=ctx.monthReport(1);assert.equal(empty.rank,null);assert.equal(empty.inv,0);
});
test('ticker includes every visible registered exchange asset including assets without positions',()=>{
 const ctx=vm.createContext({AS:{A:{yh:'AAA',p:12,cur:'USD',chg:2},B:{yh:'BBB',p:5,cur:'USD',chg:-1},Hidden:{yh:'HHH'},House:{yh:''}},assetVisible:n=>n!=='Hidden',FX:{SAR:1,USD:3.75,GBp:.04},baseCur:'SAR',tickerFxQuotes:{},S:{goldOunce:null},natFmt:(p,c)=>p+' '+c,fmt:v=>String(v),esc:v=>v});vm.runInContext(functions,ctx);
 const items=ctx.marketTickerItems();assert.deepEqual(Array.from(items,x=>x.name),['A','B','USD/SAR']);assert.match(ctx.tickerItemHTML(items[0]),/▲/);assert.match(ctx.tickerItemHTML(items[1]),/▼/);assert.match(ctx.tickerItemHTML(items[2]),/غير متاح/);
});
