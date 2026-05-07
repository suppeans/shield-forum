insert into auth.users (
  id,
  aud,
  role,
  email,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'authenticated',
    'authenticated',
    'cipherwarden@example.invalid',
    '2026-05-01T09:00:00.000Z',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Cipher Warden"}'::jsonb,
    '2026-05-01T09:00:00.000Z',
    '2026-05-01T09:00:00.000Z'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'authenticated',
    'authenticated',
    'cloudsploit@example.invalid',
    '2026-05-02T10:30:00.000Z',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"CloudSploit"}'::jsonb,
    '2026-05-02T10:30:00.000Z',
    '2026-05-02T10:30:00.000Z'
  )
on conflict (id) do nothing;

insert into public.profiles (
  id,
  username,
  display_name,
  avatar_url,
  bio,
  role,
  created_at
) values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'cipherwarden',
    'Cipher Warden',
    null,
    'Application security engineer focused on practical defense.',
    'admin',
    '2026-05-01T09:00:00.000Z'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'cloudsploit',
    'CloudSploit',
    null,
    'Cloud security notes and incident response playbooks.',
    'user',
    '2026-05-02T10:30:00.000Z'
  )
on conflict (id) do update set
  username = excluded.username,
  display_name = excluded.display_name,
  avatar_url = excluded.avatar_url,
  bio = excluded.bio,
  role = excluded.role;

insert into public.categories (
  id,
  name,
  slug,
  description,
  sort_order,
  is_visible
) values
  (
    '11111111-1111-4111-8111-111111111111',
    'Web Security',
    'web-security',
    'Browser, application, API, and identity security.',
    1,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Cloud Security',
    'cloud-security',
    'Cloud posture, IAM, logging, and network controls.',
    2,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Incident Response',
    'incident-response',
    'Detection, triage, containment, and lessons learned.',
    3,
    true
  )
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_visible = excluded.is_visible;

insert into public.tags (
  id,
  name,
  slug,
  description
) values
  (
    '44444444-4444-4444-8444-444444444444',
    'RLS',
    'rls',
    'Row Level Security patterns and reviews.'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'OAuth',
    'oauth',
    'OAuth, OIDC, and token handling.'
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    'Cloudflare',
    'cloudflare',
    'Edge security, WAF, CDN, and Turnstile.'
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    'Detection',
    'detection',
    'Signals, alerts, and response workflows.'
  )
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description;

insert into public.posts (
  id,
  title,
  slug,
  body,
  category_id,
  author_id,
  status,
  view_count,
  created_at,
  updated_at
) values
  (
    '88888888-8888-4888-8888-888888888888',
    'How do you test Supabase RLS before launch?',
    'test-supabase-rls-before-launch',
    'We are preparing a public forum and want policy tests that catch anonymous writes, author-only edits, and admin moderation mistakes.',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'published',
    482,
    '2026-05-05T08:15:00.000Z',
    '2026-05-05T09:30:00.000Z'
  ),
  (
    '99999999-9999-4999-8999-999999999999',
    'Cloudflare Turnstile placement for post forms',
    'cloudflare-turnstile-post-forms',
    'Registration is obvious, but should high-volume forms also challenge users? Looking for practical friction limits.',
    '22222222-2222-4222-8222-222222222222',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'published',
    319,
    '2026-05-04T15:05:00.000Z',
    '2026-05-04T16:20:00.000Z'
  )
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  body = excluded.body,
  category_id = excluded.category_id,
  author_id = excluded.author_id,
  status = excluded.status,
  view_count = excluded.view_count;

insert into public.comments (
  id,
  post_id,
  author_id,
  parent_comment_id,
  body,
  status,
  created_at,
  updated_at
) values (
  '12121212-1212-4121-8121-121212121212',
  '88888888-8888-4888-8888-888888888888',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  null,
  'Start by writing negative tests for every policy. Anonymous insert checks catch more than people expect.',
  'published',
  '2026-05-05T10:00:00.000Z',
  '2026-05-05T10:00:00.000Z'
)
on conflict (id) do update set
  post_id = excluded.post_id,
  author_id = excluded.author_id,
  parent_comment_id = excluded.parent_comment_id,
  body = excluded.body,
  status = excluded.status;

insert into public.articles (
  id,
  title,
  slug,
  summary,
  body,
  author_id,
  status,
  published_at,
  created_at,
  updated_at
) values
  (
    'aaaaaaaa-1111-4aaa-8aaa-111111111111',
    'A launch checklist for public security forums',
    'launch-checklist-public-security-forums',
    'Baseline controls for authentication, moderation, RLS, and edge protection before opening registration.',
    'Public security communities need strong defaults: verified auth flows, constrained rich text, RLS-backed authorization, and fast moderation controls.',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'published',
    '2026-05-03T12:00:00.000Z',
    '2026-05-03T10:00:00.000Z',
    '2026-05-03T12:00:00.000Z'
  ),
  (
    'bbbbbbbb-2222-4bbb-8bbb-222222222222',
    'OAuth token replay defenses for web apps',
    'oauth-token-replay-defenses-web-apps',
    'Use short-lived tokens, sender constraints, audit trails, and session rotation to reduce replay impact.',
    'Token replay is best handled in layers. Keep token lifetimes short, rotate sessions after risk events, and log unusual token use.',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'published',
    '2026-05-02T14:00:00.000Z',
    '2026-05-02T11:00:00.000Z',
    '2026-05-02T14:00:00.000Z'
  )
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  summary = excluded.summary,
  body = excluded.body,
  author_id = excluded.author_id,
  status = excluded.status,
  published_at = excluded.published_at;

insert into public.post_tags (post_id, tag_id) values
  (
    '88888888-8888-4888-8888-888888888888',
    '44444444-4444-4444-8444-444444444444'
  ),
  (
    '99999999-9999-4999-8999-999999999999',
    '66666666-6666-4666-8666-666666666666'
  )
on conflict (post_id, tag_id) do nothing;

insert into public.article_tags (article_id, tag_id) values
  (
    'aaaaaaaa-1111-4aaa-8aaa-111111111111',
    '44444444-4444-4444-8444-444444444444'
  ),
  (
    'aaaaaaaa-1111-4aaa-8aaa-111111111111',
    '66666666-6666-4666-8666-666666666666'
  ),
  (
    'bbbbbbbb-2222-4bbb-8bbb-222222222222',
    '55555555-5555-4555-8555-555555555555'
  ),
  (
    'bbbbbbbb-2222-4bbb-8bbb-222222222222',
    '77777777-7777-4777-8777-777777777777'
  )
on conflict (article_id, tag_id) do nothing;
