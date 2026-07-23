-- ============================================================================
-- Lectura — schéma Supabase
-- À exécuter dans : Dashboard Supabase → SQL Editor → New query → Run
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Profils (1 ligne par utilisateur, créée automatiquement à l'inscription)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_read_all" on public.profiles;
create policy "profiles_read_all"
  on public.profiles for select
  using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Crée automatiquement le profil à l'inscription (display_name issu des métadonnées)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. Livres ajoutés par les utilisateurs (catalogue partagé)
-- ---------------------------------------------------------------------------
create table if not exists public.books (
  id              uuid primary key default gen_random_uuid(),
  owner           uuid not null references auth.users (id) on delete cascade,
  title           text not null,
  author          text,
  genre           text,
  age             text,
  language        text,
  color           text,
  page_count      int  default 12,
  summary         text,
  translate       boolean default false,
  target_language text,
  pdf_path        text,          -- chemin dans le bucket Storage « pdfs »
  created_at      timestamptz not null default now()
);

alter table public.books enable row level security;

drop policy if exists "books_read_all" on public.books;
create policy "books_read_all"
  on public.books for select
  using (auth.role() = 'authenticated');

drop policy if exists "books_insert_own" on public.books;
create policy "books_insert_own"
  on public.books for insert
  with check (auth.uid() = owner);

drop policy if exists "books_delete_own" on public.books;
create policy "books_delete_own"
  on public.books for delete
  using (auth.uid() = owner);

-- ---------------------------------------------------------------------------
-- 3. Avis (peuvent cibler un livre du catalogue de base « b1… » ou un uuid)
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  book_id    text not null,          -- text : accepte les ids statiques (b1…) et les uuid
  user_id    uuid not null references auth.users (id) on delete cascade,
  user_name  text,
  rating     int  not null check (rating between 1 and 5),
  comment    text not null,
  created_at timestamptz not null default now()
);

create index if not exists reviews_book_id_idx on public.reviews (book_id);

alter table public.reviews enable row level security;

drop policy if exists "reviews_read_all" on public.reviews;
create policy "reviews_read_all"
  on public.reviews for select
  using (auth.role() = 'authenticated');

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own"
  on public.reviews for insert
  with check (auth.uid() = user_id);

drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_delete_own"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. Stockage des fichiers PDF (bucket « pdfs »)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', true)
on conflict (id) do nothing;

drop policy if exists "pdfs_read_all" on storage.objects;
create policy "pdfs_read_all"
  on storage.objects for select
  using (bucket_id = 'pdfs');

drop policy if exists "pdfs_insert_auth" on storage.objects;
create policy "pdfs_insert_auth"
  on storage.objects for insert
  with check (bucket_id = 'pdfs' and auth.role() = 'authenticated');
