-- Ritiro di Avvento 2026 - Parrocchia San Pietro Apostolo, Valeggio sul Mincio
-- Incollare tutto nel SQL Editor di Supabase ed eseguire una sola volta.

create table if not exists public.admins (
  email text primary key check (email = lower(email)),
  role text not null default 'admin' check (role in ('superadmin', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.iscrizioni (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  nome_bambino text not null check (char_length(nome_bambino) between 2 and 120),
  gruppo_catechismo text not null check (char_length(gruppo_catechismo) between 1 and 120),
  numero_genitori smallint not null check (numero_genitori between 0 and 4),
  telefono text not null check (char_length(telefono) between 6 and 30),
  email text not null check (char_length(email) between 5 and 200),
  consenso_privacy boolean not null check (consenso_privacy)
);

alter table public.admins enable row level security;
alter table public.iscrizioni enable row level security;

-- Funzioni di supporto (security definer per poter leggere la tabella admins)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where email = lower(auth.jwt() ->> 'email'));
$$;

create or replace function public.is_superadmin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where email = lower(auth.jwt() ->> 'email') and role = 'superadmin');
$$;

-- Usata dalla pagina di accesso: invia il link solo agli indirizzi abilitati
create or replace function public.email_is_admin(check_email text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where email = lower(trim(check_email)));
$$;

revoke all on function public.email_is_admin(text) from public;
grant execute on function public.email_is_admin(text) to anon, authenticated;
revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.is_superadmin() from public, anon;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_superadmin() to authenticated;

-- Iscrizioni: chiunque puo' inserire, solo gli admin possono leggere
drop policy if exists "iscrizione pubblica" on public.iscrizioni;
create policy "iscrizione pubblica" on public.iscrizioni
  for insert to anon, authenticated with check (true);

drop policy if exists "lettura admin" on public.iscrizioni;
create policy "lettura admin" on public.iscrizioni
  for select to authenticated using (public.is_admin());

-- Admin: tutti gli admin vedono l'elenco, solo il super admin aggiunge e rimuove
drop policy if exists "admin vedono admin" on public.admins;
create policy "admin vedono admin" on public.admins
  for select to authenticated using (public.is_admin());

drop policy if exists "superadmin aggiunge admin" on public.admins;
create policy "superadmin aggiunge admin" on public.admins
  for insert to authenticated with check (public.is_superadmin() and role = 'admin');

drop policy if exists "superadmin rimuove admin" on public.admins;
create policy "superadmin rimuove admin" on public.admins
  for delete to authenticated using (public.is_superadmin() and role = 'admin');

grant insert on public.iscrizioni to anon, authenticated;
grant select on public.iscrizioni to authenticated;
grant select, insert, delete on public.admins to authenticated;

-- Super admin
insert into public.admins (email, role)
values ('silviabovo85@gmail.com', 'superadmin')
on conflict (email) do update set role = 'superadmin';
