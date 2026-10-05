import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parse} from '@babel/parser';
import {createDividendRow,dividendLedger,dividendSummary} from '../src/dividends.js';
import {emptyPortfolio,mutatePortfolio,validatePortfolio} from '../src/state.js';
import {exportTransactions,readWorkbook} from '../src/workbook.js';
const assets=[{id:'fund',name:'ISWD',type:'Stock',currency:'GBp'},{id:'stock',name:'BYD',type:'Stock',currency:'HKD'},{id:'usd',name:'Broker USD',type:'Cash',currency:'USD'},{id:'sar',name:'Bank SAR',type:'Cash',currency:'SAR'}];
const base=()=>({...emptyPortfolio(),assets:structuredClone(assets),txns:[{id:1,date:'2026-01-01',assetType:'Stock',assetName:'ISWD',action:'Buy',qty:10,price:100,fees:0,currency:'GBp',rate:1,totalCostSAR:1000},{id:2,date:'2026-01-01',assetType:'Cash',assetName:'Broker USD',action:'Deposit',qty:100,price:1,fees:0,currency:'USD',rate:3.75,totalCostSAR:375}]});
const input={sourceAssetId:'fund',accountId:'usd',date:'2026-10-05',amount:40,rate:3.75};
const source=fs.readFileSync(new URL('../public/legacy/app.js',import.meta.url),'utf8'),ast=parse(source);
function engine(p){const c=vm.createContext({txns:p.txns,pN:v=>Number(v)||0,propVals:{},getLivePrice:()=>null,otherSrc:[],includeUnrealized:true});const names=['calcFIFO','buildGroups','groupCurrentValue','calcTotals','isExited'];vm.runInContext(ast.program.body.filter(n=>n.type==='FunctionDeclaration'&&names.includes(n.id.name)).map(n=>source.slice(n.start,n.end)).join('\n'),c);return c;}
test('dividend credits cash once without changing quantity, FIFO cost, or sale profits',()=>{
 const p=base(),before=engine(p),f=before.calcFIFO(p.txns.filter(t=>t.assetType==='Stock')),total=before.calcTotals().totalCur;
 const row=createDividendRow(input,p,10),next=mutatePortfolio(p,'addTxn',[row]).data,after=engine(next);
 assert.equal(row.currency,'USD');assert.equal(row.totalCostSAR,150);assert.equal(row.action,'Deposit');assert.equal(next.txns.length,3);
 assert.equal(after.calcTotals().totalCur-total,150);assert.deepEqual(structuredClone(after.calcFIFO(next.txns.filter(t=>t.assetType==='Stock'))),structuredClone(f));
 assert.equal(dividendLedger(next.txns).length,1);assert.equal(dividendSummary(dividendLedger(next.txns)).allTime,150);
 const removed=mutatePortfolio(next,'archiveDeletedTxns',[[row]]).data;assert.equal(engine(removed).calcTotals().totalCur,total);
 const restored=mutatePortfolio(removed,'restoreTxns',[[row.id]]).data;assert.equal(engine(restored).calcTotals().totalCur,total+150);assert.equal(restored.txns.length,3);
});
test('edit, reclassify and move a dividend replace the same cash entry; stale updates fail',()=>{
 let p=base();const row=createDividendRow(input,p,10);p=mutatePortfolio(p,'addTxn',[row]).data;
 const edit=createDividendRow({...input,id:10,expected:JSON.stringify(row),accountId:'sar',amount:200,rate:999},p);
 p=mutatePortfolio(p,'updateTxn',[edit]).data;assert.equal(p.txns.length,3);assert.equal(edit.rate,1);assert.equal(edit.totalCostSAR,200);assert.equal(edit.assetName,'Bank SAR');
 assert.throws(()=>createDividendRow({...input,id:10,expected:JSON.stringify(row)},p),/تغيّرت/);
 const deposit=p.txns[1],classified=createDividendRow({...input,id:2,expected:JSON.stringify(deposit),amount:deposit.qty},p);
 const total=engine(p).calcTotals().totalCur;p=mutatePortfolio(p,'updateTxn',[classified]).data;assert.equal(engine(p).calcTotals().totalCur,total);assert.equal(p.txns.length,3);
});
test('invalid distributions and linked deposits cannot become dividend income',()=>{
 const p=base();
 for(const change of [{sourceAssetId:'usd'},{accountId:'fund'},{amount:0},{amount:-1},{amount:Infinity},{rate:0},{date:'2026-02-30'}])assert.throws(()=>createDividendRow({...input,...change},p));
 const linked={...p.txns[1],linkedTxnId:1};p.txns[1]=linked;assert.throws(()=>createDividendRow({...input,id:2,expected:JSON.stringify(linked)},p),/مستقل/);
 const row=createDividendRow(input,base(),10);assert.throws(()=>validatePortfolio({...base(),txns:[{...row,action:'Withdrawal'}]}));assert.throws(()=>validatePortfolio({...base(),txns:[{...row,totalCostSAR:300}]}));
});
test('year and source summaries include exited assets, use recorded FX, and survive Excel',async()=>{
 const p=base(),a=createDividendRow({...input,date:'2025-12-31'},p,10),b=createDividendRow({...input,sourceAssetId:'stock',amount:100,rate:4},p,11),c=createDividendRow({...input,amount:10},p,12);
 const ledger=dividendLedger([a,b,c],assets.map(a=>a.id==='fund'?{...a,name:'Renamed fund'}:a));
 const all=dividendSummary(ledger,{today:'2026-10-05'});assert.equal(all.allTime,587.5);assert.equal(all.thisYear,437.5);assert.equal(all.thisMonth,437.5);
 const filtered=dividendSummary(ledger,{year:'2026',sourceAssetId:'fund'});assert.equal(filtered.total,37.5);assert.equal(filtered.byAsset[0].name,'Renamed fund');
 const back=await readWorkbook(await exportTransactions([a,b,c]));assert.equal(dividendSummary(dividendLedger(back.txns)).allTime,587.5);assert.equal(back.txns[0].sourceAssetId,'fund');assert.equal(back.txns[0].incomeType,'Dividend');
});
