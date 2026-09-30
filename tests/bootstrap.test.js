import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PGlite} from '@electric-sql/pglite';

test('private import belongs only to a verified email and is claimed once',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`create role anon;create role authenticated;create schema auth;
   create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   grant usage on schema auth to authenticated,anon;grant execute on function auth.uid() to authenticated,anon;
   insert into auth.users values
   ('00000000-0000-0000-0000-000000000001','owner@example.test',now()),
   ('00000000-0000-0000-0000-000000000002','other@example.test',now()),
   ('00000000-0000-0000-0000-000000000003','owner@example.test',null);`);
  for(const path of fs.readdirSync('supabase/migrations').sort())await db.exec(fs.readFileSync('supabase/migrations/'+path,'utf8'));
  const seed={txns:[{id:'original'}],assets:[],notes:[],otherSources:[],deletedTxns:[],settings:{}};
  await db.query('insert into private.portfolio_imports(owner_email,data) values($1,$2)', ['owner@example.test',JSON.stringify(seed)]);
  await db.exec("set role authenticated;set request.jwt.claim.sub='00000000-0000-0000-0000-000000000003'");
  await assert.rejects(db.query('select * from public.load_portfolio()'),/Verified email/);
  await db.exec("set request.jwt.claim.sub='00000000-0000-0000-0000-000000000002'");
  assert.equal((await db.query('select * from public.load_portfolio()')).rows[0].data.txns.length,0);
  await assert.rejects(db.query('select * from private.portfolio_imports'),/permission denied/);
  await db.exec("set request.jwt.claim.sub='00000000-0000-0000-0000-000000000001'");
  assert.deepEqual((await db.query('select * from public.load_portfolio()')).rows[0].data,seed);
  await db.query('select * from public.save_portfolio($1,$2)',[0,JSON.stringify({...seed,txns:[]})]);
  assert.equal((await db.query('select * from public.load_portfolio()')).rows[0].data.txns.length,0);
  await assert.rejects(db.query('select * from public.save_portfolio($1,$2)',[0,JSON.stringify(seed)]),/CONFLICT/);
  await db.exec('reset role');
  assert.equal((await db.query('select claimed_by from private.portfolio_imports')).rows[0].claimed_by,'00000000-0000-0000-0000-000000000001');
  assert.equal((await db.query("select count(*)::int as n from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prosecdef")).rows[0].n,0);
 }finally{await db.close();}
});
