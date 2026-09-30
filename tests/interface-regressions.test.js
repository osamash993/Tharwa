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
