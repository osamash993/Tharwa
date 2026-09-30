-- Privileged implementations live outside the exposed API schema.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table private.portfolio_imports (
 owner_email text primary key check (owner_email = lower(owner_email)),
 data jsonb not null check (jsonb_typeof(data) = 'object'),
 created_at timestamptz not null default now(),
 claimed_by uuid references auth.users(id),
 claimed_at timestamptz
);
alter table private.portfolio_imports enable row level security;
revoke all on private.portfolio_imports from public, anon, authenticated;

alter function public.load_portfolio() set schema private;
alter function public.save_portfolio(bigint,jsonb) set schema private;

create or replace function private.load_portfolio() returns public.portfolio_state
language plpgsql security definer set search_path='' as $$
declare result public.portfolio_state; verified_email text; initial_data jsonb;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 select lower(email) into verified_email from auth.users
 where id=auth.uid() and email_confirmed_at is not null;
 if verified_email is null then raise exception 'Verified email required'; end if;
 -- Serialise first-load requests from multiple devices, including an empty portfolio.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(auth.uid()::text,0));
 select * into result from public.portfolio_state where owner_id=auth.uid();
 if found then return result; end if;
 select data into initial_data from private.portfolio_imports
 where owner_email=verified_email and claimed_by is null for update;
 if found then
  insert into public.portfolio_state(owner_id,data) values(auth.uid(),initial_data) returning * into result;
  update private.portfolio_imports set claimed_by=auth.uid(),claimed_at=now()
   where owner_email=verified_email and claimed_by is null;
 else
  insert into public.portfolio_state(owner_id) values(auth.uid()) returning * into result;
 end if;
 return result;
end $$;

create function public.load_portfolio() returns public.portfolio_state
language sql security invoker set search_path='' as $$ select private.load_portfolio(); $$;
create function public.save_portfolio(expected_version bigint,next_data jsonb) returns public.portfolio_state
language sql security invoker set search_path='' as $$ select private.save_portfolio(expected_version,next_data); $$;
revoke all on function public.load_portfolio(),public.save_portfolio(bigint,jsonb),
 private.load_portfolio(),private.save_portfolio(bigint,jsonb) from public,anon;
grant execute on function public.load_portfolio(),public.save_portfolio(bigint,jsonb),
 private.load_portfolio(),private.save_portfolio(bigint,jsonb) to authenticated;
