# News site edge configuration

Retain Full (strict) TLS, normal WAF protection and static asset caching. The site has no registration, sign-in, account, posting or comment routes. Remove any legacy rules scoped solely to those routes and obsolete Turnstile keys.

Do not cache `POST /api/news/import`, its responses or HTML/RSC news pages. The import route verifies its server-only bearer token, validates a bounded JSON batch, and writes only through the service role. Apply a modest rate limit to this route in Cloudflare for future automation. Keep requests carrying Authorization private. Cache `/_next/static/*` and immutable public assets normally.
