import test from 'node:test';
import assert from 'node:assert/strict';
import {parseOfficialICS,parseFedHTML,getOfficialEconomics} from '../supabase/functions/portfolio-market/economic-calendar.js';
test('official calendars unfold ICS lines and keep GDP revisions and PCE dates',()=>{
 const source='BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nSUMMARY:GDP (Second Estimate) and Corporate Pro\r\n fits\\, 3rd Quarter 2026\r\nDTSTART:20261125T133000Z\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\nSUMMARY:Personal Income and Outlays\\, October 2026\r\nDTSTART;VALUE=DATE-TIME:20261125T133000Z\r\nEND:VEVENT\r\nEND:VCALENDAR';
 const rows=parseOfficialICS(source,'BEA');assert.deepEqual(rows.map(e=>[e.d,e.kind]),[['2026-11-25','gdp'],['2026-11-25','pce']]);assert(rows.every(e=>e.url.startsWith('https://www.bea.gov/')));
});
test('BLS calendar excludes unrelated regional releases and cancelled events',()=>{
 const event=(summary,extra='')=>'BEGIN:VEVENT\nSUMMARY:'+summary+'\nDTSTART;TZID=US-Eastern:20261014T083000\n'+extra+'\nEND:VEVENT\n';
 const rows=parseOfficialICS(event('Consumer Price Index')+event('State Employment and Unemployment')+event('Producer Price Index','STATUS:CANCELLED'),'BLS');assert.equal(rows.length,1);assert.equal(rows[0].kind,'cpi');
});
test('FOMC parser selects final meeting day and preserves economic projections flag',()=>{const rows=parseFedHTML('<h4>2026 FOMC Meetings</h4><b>October</b><div>27-28</div><b>December</b><div>8-9*</div><h4>2027 FOMC Meetings</h4><b>January</b><div>26-27</div>');assert.deepEqual(rows.map(e=>e.d),['2026-10-28','2026-12-09','2027-01-27']);assert(rows[1].t.includes('التوقعات'));});
test('source failure falls back to verified announced dates with visible stale-source status',async()=>{const old=globalThis.fetch;globalThis.fetch=async()=>new Response('unavailable',{status:503});try{const result=await getOfficialEconomics('2026-10-04','2026-12-31');assert(result.items.some(e=>e.kind==='fed'&&e.d==='2026-10-28'));assert(result.items.some(e=>e.kind==='gdp'));assert(result.items.every(e=>e.cached&&e.s.includes('2026-10-04')));assert(result.status.every(s=>!s.live));}finally{globalThis.fetch=old;}});
