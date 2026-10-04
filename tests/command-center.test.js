import test from 'node:test';
import assert from 'node:assert/strict';
import {createAPI} from '../src/api.js';
import {emptyPortfolio} from '../src/state.js';
import {getHistory,getCompanyQuotes,getCalendar} from '../supabase/functions/portfolio-market/command-sources.js';

test('remote polling adopts newer version before a subsequent write',async()=>{
 let version=1,state=emptyPortfolio();const calls=[];
 const client={rpc:async(method,args)=>{calls.push([method,args]);if(method==='load_portfolio')return {data:{version,data:structuredClone(state)}};assert.equal(args.expected_version,version);state=args.next_data;return {data:{version:++version,data:state}};}};
 const api=createAPI(client);await api.call('loadAll');state.settings.remote='another device';version=2;
 assert.equal(await api.call('checkRemote'),true);assert.equal(api.snapshot().settings.remote,'another device');
 await api.call('saveSetting','commandCenter','{}');assert.equal(state.settings.remote,'another device');assert.equal(await api.call('checkRemote'),false);
});

test('history and component quotes expose only real finite source values',async()=>{
 const previous=globalThis.fetch;let count=0;
 globalThis.fetch=async input=>{count++;const url=String(input);if(url.includes('range=1y'))return new Response(JSON.stringify({chart:{result:[{meta:{currency:'USD'},timestamp:[1700000000,1700086400,1700172800],indicators:{quote:[{close:[123,null,125]}]}}]}}));return new Response(JSON.stringify({chart:{result:[{meta:{regularMarketPrice:125,currency:'USD',chartPreviousClose:100,regularMarketTime:1700172800}}]}}));};
 try{const h=await getHistory('CCQA');assert.deepEqual(h.points.map(x=>x.p),[123,125]);assert.equal(h.currency,'USD');await getHistory('CCQA');assert.equal(count,1);const q=await getCompanyQuotes([{key:'COMPANY',symbol:'CCQUOTE'}]);assert.equal(q.quotes.COMPANY.changePct,25);await assert.rejects(getHistory('https://bad.example'));await assert.rejects(getCompanyQuotes(Array(41).fill({symbol:'A'})));}
 finally{globalThis.fetch=previous;}
});

test('calendar missing credentials stays honest and never inserts fixed demo events',async()=>{
 const previous=globalThis.fetch;globalThis.fetch=async()=>new Response(JSON.stringify({chart:{result:[{events:{}}]}}));
 try{const r=await getCalendar([{symbol:'NOEVENTS',name:'Example'}]);assert.equal(r.ok,true);assert.deepEqual(r.items,[]);assert(r.unavailable.some(s=>s.includes('FMP')));}
 finally{globalThis.fetch=previous;}
});
