-- One private versioned portfolio per authenticated owner. No public financial data.
create table public.portfolio_state (
 owner_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null default '{"txns":[],"assets":[],"otherSources":[],"notes":[],"deletedTxns":[],"settings":{}}',
 version bigint not null default 0,
 updated_at timestamptz not null default now()
);
create table public.portfolio_history (
 owner_id uuid not null references auth.users(id) on delete cascade,
 version bigint not null,
 data jsonb not null,
 saved_at timestamptz not null default now(),
 primary key(owner_id,version)
);
alter table public.portfolio_state enable row level security;
alter table public.portfolio_history enable row level security;
create policy own_state on public.portfolio_state for select to authenticated using(owner_id=(select auth.uid()));
create policy own_history on public.portfolio_history for select to authenticated using(owner_id=(select auth.uid()));
revoke all on public.portfolio_state, public.portfolio_history from anon, authenticated;
grant select on public.portfolio_state, public.portfolio_history to authenticated;

create function public.load_portfolio() returns public.portfolio_state
language plpgsql security definer set search_path='' as $$
declare result public.portfolio_state;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 insert into public.portfolio_state(owner_id) values(auth.uid()) on conflict do nothing;
 select * into result from public.portfolio_state where owner_id=auth.uid();
 return result;
end $$;

create function public.save_portfolio(expected_version bigint, next_data jsonb) returns public.portfolio_state
language plpgsql security definer set search_path='' as $$
declare current_row public.portfolio_state; result public.portfolio_state;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if jsonb_typeof(next_data) is distinct from 'object'
 or jsonb_typeof(next_data->'txns') is distinct from 'array'
 or jsonb_typeof(next_data->'assets') is distinct from 'array'
 or jsonb_typeof(next_data->'notes') is distinct from 'array'
 or jsonb_typeof(next_data->'otherSources') is distinct from 'array'
 or jsonb_typeof(next_data->'deletedTxns') is distinct from 'array'
 or jsonb_typeof(next_data->'settings') is distinct from 'object' then
 raise exception 'Invalid portfolio'; end if;
 if octet_length(next_data::text)>10000000 then raise exception 'Portfolio too large'; end if;
 select * into current_row from public.portfolio_state where owner_id=auth.uid() for update;
 if not found or current_row.version<>expected_version then
 raise exception 'PORTFOLIO_CONFLICT: Reload before saving'; end if;
 insert into public.portfolio_history(owner_id,version,data) values(auth.uid(),current_row.version,current_row.data);
 update public.portfolio_state set data=next_data,version=version+1,updated_at=now()
 where owner_id=auth.uid() returning * into result;
 delete from public.portfolio_history where owner_id=auth.uid() and version < result.version-50;
 return result;
end $$;
revoke all on function public.load_portfolio() from public, anon;
revoke all on function public.save_portfolio(bigint,jsonb) from public, anon;
grant execute on function public.load_portfolio() to authenticated;
grant execute on function public.save_portfolio(bigint,jsonb) to authenticated;
