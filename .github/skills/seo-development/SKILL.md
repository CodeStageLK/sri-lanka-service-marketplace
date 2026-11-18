---
name: seo-development
description: "SEO for modern web apps: deciding when SSR/SSG/prerendering is required vs a plain SPA, meta tags and Open Graph, JSON-LD structured data, sitemaps/robots, canonical URLs, URL design, and performance as a ranking factor. Use when choosing a rendering strategy for SEO, adding meta/OG tags, implementing structured data, generating sitemaps, fixing duplicate-content/canonical issues, or making a Vite SPA crawlable."
license: MIT
metadata:
  category: "frontend"
  scope: "universal"
  version: "1.0.0"
---

# SEO Development

## Purpose

Rules for making web apps discoverable and shareable: choose the right rendering strategy first (the decision that dominates everything else), then get meta tags, structured data, sitemaps, canonicals, URLs, and performance right. Applies to SPAs, SSR/SSG sites, and hybrids.

## When to Use

- Choosing SPA vs SSR/SSG/prerendering for a new project or marketing pages
- Adding or auditing meta tags, Open Graph, or Twitter cards
- Implementing JSON-LD structured data
- Generating sitemaps and robots.txt
- Fixing duplicate content, canonical, or crawlability issues
- Improving organic traffic or link-preview appearance

## Rendering Strategy: The First Decision

Decide per *surface*, using these criteria:

**Needs SSR/SSG (server-rendered HTML):**
- Public content where organic search traffic matters: marketing pages, blogs, docs, product/listing pages, profiles, landing pages.
- Pages whose link previews matter (OG tags must be in server HTML — social crawlers do NOT execute JavaScript).
- Large/frequently-changing public page sets (crawl budget: client-rendered pages are crawled slower and less reliably; Google renders JS in a deferred second wave, other engines and AI crawlers often not at all).

**A plain SPA is fine:**
- App behind login (dashboards, admin, internal tools) — crawlers can't log in; SEO is irrelevant there.
- Pages where only the shell needs indexing (a single landing page can even be static HTML in front of the app).

**Tool mapping:**
- Content-dominant site → Astro (static-first) or Next.js SSG/ISR.
- Mixed app + public content → Next.js/Remix (SSR app), or **split surfaces**: static/SSG marketing site at the root domain + SPA at `/app` or a subdomain. The split is often the cheapest correct architecture.
- Existing Vite SPA needing a handful of indexable pages → prerendering (below) before a framework migration.

Rule: don't retrofit SEO onto a client-rendered app for content that matters — move that content to a server-rendered surface.

## Prerendering Options for Vite SPAs

When public pages are finite and mostly static:

- **Build-time prerendering**: `vite-plugin-ssr`-style frameworks (Vike), `vite-react-ssg`, or a post-build crawl step (Puppeteer renders each route to static HTML) — output real HTML per route; the SPA hydrates on top.
- Prerender only the public route list (home, pricing, blog posts); the authenticated app stays client-rendered.
- Each prerendered route must emit its own title/meta/OG/JSON-LD into the static HTML, not inject post-hydration.
- Dynamic-at-request-time rendering for bots (user-agent cloaking services) is fragile and a last resort — prefer build-time HTML.
- SPAs must serve real 404s for unknown paths where possible; at minimum add `<meta name="robots" content="noindex">` on the client 404 view to avoid soft-404 pollution.

## Meta Tags and Open Graph

Per indexable page — unique, server-present:

```html
<title>Product Name — Short Benefit | Brand</title>  <!-- ~50–60 chars -->
<meta name="description" content="Specific, compelling 150–160 char summary with the target phrase.">
<link rel="canonical" href="https://example.com/pricing">
<meta property="og:title" content="Product Name — Short Benefit">
<meta property="og:description" content="...">
<meta property="og:image" content="https://example.com/og/pricing.png"> <!-- 1200×630, absolute URL -->
<meta property="og:url" content="https://example.com/pricing">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

- One unique `<title>` and description per page; duplicated titles across pages are a classic audit failure.
- OG image: 1200×630, absolute HTTPS URL; generate per-page images for content (post title on branded template) — dramatically better share CTR.
- In SPAs, head managers (`react-helmet-async` etc.) help Google but NOT social crawlers; OG tags are only reliable in server HTML.
- Verify with social debuggers (OG/Twitter validators) and `curl` the page — what curl sees is what most crawlers see.
- `meta keywords` is dead; don't add it.

## Structured Data (JSON-LD)

- JSON-LD in a `<script type="application/ld+json">` — never microdata/RDFa mixing.
- Implement types that earn rich results and fit the page: `Article`/`BlogPosting`, `Product` (+ `Offer`, `AggregateRating`), `FAQPage`, `BreadcrumbList`, `Organization`/`WebSite` (sitewide), `LocalBusiness`, `JobPosting`, `Event`.
- Structured data must mirror visible page content — marking up content that isn't on the page violates guidelines and risks manual actions.
- Generate from the same data that renders the page (one source of truth), e.g. serialize a typed object:

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  image: [product.imageUrl],
  offers: { "@type": "Offer", price: product.price, priceCurrency: "USD",
            availability: "https://schema.org/InStock" },
};
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

- Validate with the Rich Results Test / schema validator in CI or pre-release; broken JSON-LD is silently ignored.

## Sitemaps, Robots, Canonicals

- `sitemap.xml`: every indexable canonical URL, accurate `<lastmod>`; exclude noindexed/redirecting/404 pages. Generate at build (SSG) or serve dynamically from the DB (large/changing sets, use sitemap index files >50k URLs). Reference it in robots.txt and submit in Search Console.
- `robots.txt`: disallow only what shouldn't be *crawled* (internal search results, infinite filter permutations, API endpoints). **Robots.txt does not deindex** — blocked pages can still be indexed from links; use `noindex` meta/header for exclusion, and never both (a blocked page's noindex can't be seen).
- Never block JS/CSS assets — Google needs them to render.
- Canonicals on every indexable page, absolute self-referencing by default; point variants (query params, tracking params, http/https, www/non-www, trailing-slash twins) at the one true URL. Enforce one host+scheme+slash convention with 301s at the edge.
- Pagination: each page canonicals to itself (not to page 1); faceted/filter URLs that don't deserve indexing get `noindex` or canonical to the base listing.

## URL Design

- Readable, lowercase, hyphen-separated, stable: `/blog/react-performance-guide`, not `/p?id=4823` or `/Blog/React_Performance_Guide`.
- Hierarchy mirrors information architecture (`/docs/routing/nested-routes`); keep depth shallow (≤3–4 segments).
- Meaningful state in paths or clean query params; never in `#` fragments (hash routes are invisible to SEO — use history routing).
- Changing a URL requires a 301 from old to new; update internal links to point directly at the final URL (no redirect chains). URLs are forever — design them so content edits don't force changes (avoid dates in slugs unless editorially required).
- Internal linking: real `<a href>` links (crawlable) — not `onClick` div navigation; descriptive anchor text, not "click here".

## Performance and Indexing Signals

- Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1, field data) are ranking signals and gatekeep crawl efficiency — the performance skill's work is SEO work.
- Mobile-first indexing: the mobile render is what gets indexed; content hidden/removed on mobile doesn't count.
- HTTPS everywhere; no mixed content; sane HTML status codes (real 404/410 for gone content, 301 for moves — avoid 302 for permanent moves).
- Monitor Search Console: coverage/indexing reports, CWV report, rich-result errors; crawl stats reveal soft-404s and redirect chains.
- `hreflang` for multilingual sites (reciprocal pairs + `x-default`); language variants are separate URLs, not JS toggles.

## Common Mistakes

- **Marketing/content pages shipped client-rendered, then "SEO fixes" bolted on** → move them to SSG/SSR or prerender; rendering strategy first.
- **OG tags set via JS head manager, previews blank** → social crawlers don't run JS; OG must be in server HTML.
- **Same title/description on every SPA route** → unique per page, emitted into served HTML.
- **robots.txt Disallow used to deindex** → `noindex` meta; unblock crawling so it can be seen.
- **Hash-based routing on public pages** → history routing; fragments aren't indexed.
- **Structured data describing content not on the page** → mirror visible content only; validate in CI.
- **Sitemap listing redirects/noindexed/dead URLs** → canonical 200 URLs only, with real lastmod.
- **Duplicate content across param/host/slash variants** → self-referencing canonicals + 301-enforced single convention.
- **SPA returning 200 + "Not found" text for bad URLs** → real 404s where possible; noindex the client 404 view otherwise.
- **JS-only navigation (`onClick` divs)** → crawlable `<a href>` links.

## Checklist

- [ ] Rendering strategy chosen per surface: public content SSR/SSG/prerendered; app-behind-login SPA
- [ ] All indexable HTML contains title/meta/OG/JSON-LD server-side (verified via curl, not DevTools)
- [ ] Unique title (~60 chars) and description (~155 chars) per page; 1200×630 absolute-URL OG image
- [ ] JSON-LD for applicable types, generated from page data, passing rich-results validation
- [ ] sitemap.xml auto-generated with canonical 200 URLs + lastmod; referenced in robots.txt; submitted
- [ ] robots.txt blocks only crawl-waste; assets unblocked; noindex (not Disallow) used for exclusion
- [ ] Self-referencing canonicals; one scheme/host/slash convention enforced with 301s
- [ ] URLs lowercase-hyphenated, hierarchical, fragment-free; old URLs 301 to new, no chains
- [ ] Internal navigation uses real anchor links with descriptive text
- [ ] CWV targets met on mobile; Search Console monitored for coverage and rich-result errors
