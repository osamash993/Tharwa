import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../public/legacy/app.js',import.meta.url),'utf8');
const update=source.slice(source.indexOf('async function zkUpdate('),source.indexOf('\nfunction zkUpdateOne('));
function engine(response,{cloud=true,needed=[{ticker:'A'},{ticker:'B'}],reject=false}={}){
 let requests=0,saves=0;
 const context={zkBusy:false,_cloudMode:cloud,zkLog:[],zkDb:{B:{orig:.3,manual:.25}},zkOpt:{},
  $:()=>null,showToast:()=>{},zkSetProg:()=>{},zkNeeded:()=>needed,zkStale:()=>true,
  zkCalcRatio:()=>({zakatable:20,orig:.2,fin:.22}),zkRender:()=>{},zkSave:()=>{saves++;},setTimeout,clearTimeout};
 context.portfolioAPI={withSuccessHandler(fn){this.success=fn;return this;},withFailureHandler(fn){this.failure=fn;return this;},zkFetchBatch(){requests++;queueMicrotask(()=>reject?this.failure():this.success(response));}};
 vm.createContext(context);vm.runInContext(update,context);
 return {context,run:fn=>context.zkUpdate(true,fn),requests:()=>requests,saves:()=>saves};
}
test('zakat update reports pending, partial results and retains prior failed ratios',async()=>{
 const e=engine({ok:true,results:[{ticker:'A',ok:true,via:'Yahoo'},{ticker:'B',ok:false,err:'Unavailable'}]});
 const progress=[],pending=e.run(m=>progress.push(m));
 assert.equal(e.context.zkBusy,true);
 const duplicate=await e.run();assert.equal(duplicate.ok,false);assert.equal(e.requests(),1);
 const result=await pending;
 assert.equal(result.ok,true);assert.equal(result.updated,1);assert.equal(result.failed,1);
 assert.match(result.message,/تعذّر تحديث 1/);assert(progress.length>=4);
 assert.equal(e.context.zkDb.B.orig,.3);assert.equal(e.context.zkDb.B.manual,.25);
 assert.equal(e.saves(),1);assert.equal(e.context.zkBusy,false);
});
test('provider and transport errors are returned without reporting success',async()=>{
 for(const [response,options] of [[{ok:false,phase:'provider',err:'Provider unavailable'},{}],[null,{reject:true}],[{ok:true,results:[{ticker:'A',ok:false}]},{}]]){
  const e=engine(response,options),result=await e.run();
  assert.equal(result.ok,false);assert(result.message);assert.equal(e.context.zkBusy,false);
 }
});
test('successful, empty and demo refreshes provide explicit outcomes',async()=>{
 const good=await engine({ok:true,results:[{ticker:'A',ok:true}]}).run();assert.equal(good.ok,true);assert.equal(good.updated,1);assert.equal(good.failed,0);
 const empty=engine(null,{needed:[]});assert.equal((await empty.run()).updated,0);assert.equal(empty.requests(),0);
 const demo=engine(null,{cloud:false});assert.equal((await demo.run()).ok,false);assert.equal(demo.requests(),0);
});
