-- Run against the initialized news database: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/news_schema.sql
begin;
do $$
begin
  if not (select relrowsecurity from pg_class where oid = 'public.news_articles'::regclass) then
    raise exception 'News row-level security must be enabled';
  end if;
  if not has_table_privilege('anon', 'public.news_articles', 'SELECT') then
    raise exception 'Public news reading must be allowed';
  end if;
  if has_table_privilege('anon', 'public.news_articles', 'INSERT,UPDATE,DELETE')
     or has_table_privilege('authenticated', 'public.news_articles', 'INSERT,UPDATE,DELETE') then
    raise exception 'Browser clients must not write news';
  end if;
  if not (has_table_privilege('service_role', 'public.news_articles', 'INSERT')
    and has_table_privilege('service_role', 'public.news_articles', 'UPDATE')
    and has_table_privilege('service_role', 'public.news_articles', 'DELETE')) then
    raise exception 'Server news imports require write access';
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public'
    and table_name = 'news_articles' and column_name = 'collected_at' and data_type = 'timestamp with time zone') then
    raise exception 'News collection timestamps are required';
  end if;
end;
$$;
rollback;
