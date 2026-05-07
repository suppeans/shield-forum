# Cloudflare Security Configuration

## DNS and TLS

- Proxy `forum.example.com` through Cloudflare after Vercel verifies the domain.
- Use Full (strict) SSL/TLS.
- Enable Always Use HTTPS.
- Enable HSTS only after validating all subdomains that must support HTTPS.

## WAF

Enable Cloudflare Managed Rules and OWASP Core Ruleset. Start in log mode if the community already has traffic, then switch high-confidence rules to block.

Recommended custom rules:

- Challenge requests with suspicious user agents on `/auth/sign-in`.
- Challenge excessive POST requests to `/forum`, `/profile`, and `/admin`.
- Block requests with obvious script injection payloads in query strings.
- Rate limit repeated failed registration attempts by IP and email hash at the application layer.

## Turnstile

Use Turnstile on:

- Registration
- Post creation
- Comment creation
- Admin article publishing

The application exposes these environment variables for Turnstile integration:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
```

The current implementation documents Turnstile placement and reserves env vars. The next hardening step is to verify Turnstile tokens in server actions before Supabase writes.

## Caching

Cache:

- `/_next/static/*`
- Public images and immutable assets

Do not cache:

- Authenticated pages
- Server action responses
- HTML for `/profile`, `/admin`, or auth routes

## Monitoring

Review Cloudflare Security Events weekly during launch. Tune rules when legitimate security researchers hit false positives while posting technical payload examples.
