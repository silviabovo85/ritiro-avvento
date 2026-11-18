-- Sabato sera adolescenti (28 novembre 2026) - Parrocchia San Pietro Apostolo, Valeggio sul Mincio
-- Usa lo stesso progetto Supabase del ritiro di Avvento: riusa la tabella admins
-- e le funzioni is_admin() / is_superadmin() create da ../../supabase/schema.sql.

create table if not exists public.iscrizioni_adolescenti (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  nome text not null check (char_length(nome) between 2 and 120),
  cognome text not null check (char_length(cognome) between 1 and 80),
  annata smallint not null check (annata between 2010 and 2013),
  cena boolean not null,
  consenso_privacy boolean not null check (consenso_privacy)
);

alter table public.iscrizioni_adolescenti enable row level security;

-- Chiunque puo' iscriversi, solo gli admin leggono e cancellano, solo il super admin modifica
drop policy if exists "iscrizione pubblica" on public.iscrizioni_adolescenti;
create policy "iscrizione pubblica" on public.iscrizioni_adolescenti
  for insert to anon, authenticated with check (true);

drop policy if exists "lettura admin" on public.iscrizioni_adolescenti;
create policy "lettura admin" on public.iscrizioni_adolescenti
  for select to authenticated using (public.is_admin());

drop policy if exists "superadmin modifica iscrizioni" on public.iscrizioni_adolescenti;
create policy "superadmin modifica iscrizioni" on public.iscrizioni_adolescenti
  for update to authenticated using (public.is_superadmin()) with check (public.is_superadmin());

drop policy if exists "admin cancellano iscrizioni" on public.iscrizioni_adolescenti;
create policy "admin cancellano iscrizioni" on public.iscrizioni_adolescenti
  for delete to authenticated using (public.is_admin());

grant insert on public.iscrizioni_adolescenti to anon, authenticated;
grant select, delete on public.iscrizioni_adolescenti to authenticated;
grant update (nome, cognome, annata, cena) on public.iscrizioni_adolescenti to authenticated;
