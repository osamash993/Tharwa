import test from 'node:test';
import assert from 'node:assert/strict';
import '../public/command-center/impact-policy.js';
const {assess,exposure}=globalThis.TharwaImpact;
const now=Date.parse('2026-10-07T12:00:00Z');
const ctx={total:1000,positions:[{n:'FUND',t:'Stock',val:500},{n:'DIRECT',t:'Stock',val:100,yh:'0941.HK'},{n:'GOLD',t:'Gold',val:100}],funds:{FUND:{countries:{US:60,CN:10,HK:5}}},companies:{A:{k:'A',via:[{f:'FUND',w:10}]},B:{k:'B',via:[{f:'FUND',w:20}]}}};
test('fund component exposure is weighted and deduplicated, including direct overlap',()=>{
 const n={related:[{key:'A'},{key:'A'},{key:'B'}]};const x=exposure(n,ctx);assert.equal(x.value,150);assert.equal(x.pct,15);
 assert.equal(exposure({related:[...n.related,{a:'FUND'}]},ctx).value,500);
});
test('macro scope uses investment holdings and total wealth as denominator, not cash/property',()=>{
 const x=assess({c:'macro',kind:'minutes',t:'محضر الفيدرالي',atUTC:'2026-10-07T18:00:00Z'},ctx,now);
 assert.equal(x.pct,70);assert.equal(x.tier,'high');assert.equal(x.confidence,'ارتباط تقديري');assert(x.reason.includes('محتمل'));
});
test('China news uses geographical fund weights plus direct HK position; gold excludes stocks',()=>{
 assert.equal(exposure({scope:'macro',t:'China economic data'},ctx).value,175);
 assert.equal(exposure({scope:'macro',t:'Gold demand'},ctx).value,100);
});
test('missing relation, zero portfolio and personal dates are not fabricated as zero impact',()=>{
 const x=assess({t:'Earnings',related:[{via:'Unknown company'}]},ctx,now);assert.equal(x.tier,'unknown');assert.equal(x.score,null);assert(x.incomplete);
 assert.equal(assess({c:'macro',kind:'fed'},{...ctx,total:0},now).pct,null);
 assert.equal(assess({c:'zakat',t:'حول الزكاة'},ctx,now).tier,'personal');
});
test('recent material event scores above old generic headline without claiming a return probability',()=>{
 const n={a:'DIRECT',headline:true,date:'2026-10-07T11:00:00Z'};
 assert(assess({...n,t:'Quarterly earnings'},ctx,now).score>assess({...n,t:'Company interview',date:'2025-01-01'},ctx,now).score);
});
