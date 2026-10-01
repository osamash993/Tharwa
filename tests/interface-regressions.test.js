import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parse} from '@babel/parser';
const source=fs.readFileSync(new URL('../public/legacy/app.js',import.meta.url),'utf8');
const ast=parse(source,{sourceType:'script'});
function functions(names){return ast.program.body.filter(n=>n.type==='FunctionDeclaration'&&names.includes(n.id.name)).map(n=>source.slice(n.start,n.end)).join('\n');}
test('bulk selection respects the displayed filter, including month selection',()=>{
 const selectedIds=new Set(),context=vm.createContext({selectedIds,window:{_visibleTxnIds:[1,3]},txns:[{id:1,date:'2026-09-01'},{id:2,date:'2026-09-02'},{id:3,date:'2026-08-01'}],updateSelectionBar(){},renderTxnTable(){}});
 vm.runInContext(functions(['toggleSelAll','toggleAllSel','toggleMonthSel']),context);
 context.toggleSelAll();assert.deepEqual([...selectedIds],[1,3]);context.toggleSelAll();assert.equal(selectedIds.size,0);
 context.toggleMonthSel('2026-09',true);assert.deepEqual([...selectedIds],[1]);context.toggleAllSel(false);assert.equal(selectedIds.size,0);
});
test('loading the saved theme does not write a setting back to the database',()=>{
 const classes=new Set(),calls=[];const context=vm.createContext({document:{documentElement:{classList:{toggle(k,on){on?classes.add(k):classes.delete(k)}}}},$:()=>null,localStorage:{setItem(){}},portfolioAPI:{saveSetting(...args){calls.push(args)}},renderAll(){},setTimeout});
 vm.runInContext(functions(['applyIosTheme']),context);context.applyIosTheme('dark',false);assert.equal(calls.length,0);assert.ok(classes.has('ios-dark'));
 context.applyIosTheme('light');assert.equal(calls.length,1);assert.ok(classes.has('ios-light'));
});
test('restoring the original interface never restores Google Apps Script connections',()=>{
 for(const text of [source,fs.readFileSync(new URL('../index.html',import.meta.url),'utf8')])assert.doesNotMatch(text,/google\.script\.run|script\.google\.com\/macros|SpreadsheetApp/);
});
test('portfolio sections reconcile investments, cash, property and included manual sources',()=>{
 const groups=[
  {assetType:'Stock',assetName:'Partial stock',buyQ:100,sellQ:50,buySAR:1000,sellSAR:600,fifoAvgCost:10,realizedPnL:150},
  {assetType:'Gold',assetName:'Gold',buyQ:2,sellQ:0,buySAR:400,sellSAR:0,fifoAvgCost:200},
  {assetType:'Stock',assetName:'Sold',buyQ:10,sellQ:10,buySAR:100,sellSAR:300,fifoAvgCost:0,realizedPnL:200},
  {assetType:'Cash',assetName:'Account',buyQ:0,sellQ:0,depSAR:800,wthSAR:100},
  {assetType:'Property',assetName:'Home',buyQ:1,sellQ:0,buySAR:900,sellSAR:0}
 ];
 const context=vm.createContext({buildGroups:()=>groups,isExited:g=>['Stock','Gold'].includes(g.assetType)&&g.buyQ===g.sellQ,getLivePrice:()=>null,propVals:{Home:{sar:1200}},pN:v=>Number(v)||0,includeUnrealized:true,otherSrc:[{type:'realized',value:1000},{type:'unrealized',value:200},{type:'realized',value:300,included:false}]});
 vm.runInContext(functions(['groupCurrentValue','calcTotals','calcPortfolioSections']),context);
 let s=context.calcPortfolioSections();
 assert.equal(s.investmentValue,900);assert.equal(s.investmentCost,900);assert.equal(s.realized,350);
 assert.equal(s.cash,700);assert.equal(s.property,1200);assert.equal(s.manual,1200);assert.equal(s.sourcesValue,3100);
 assert.equal(s.investmentValue+s.sourcesValue,context.calcTotals().totalCur);
 context.includeUnrealized=false;s=context.calcPortfolioSections();assert.equal(s.sourcesValue,2900);assert.equal(s.manual,1000);assert.equal(s.investmentValue+s.sourcesValue,context.calcTotals().totalCur);
 context.getLivePrice=name=>name==='Partial stock'?{priceSAR:12}:null;s=context.calcPortfolioSections();assert.equal(s.investmentValue,1000);assert.equal(s.investmentCost,900);
});
