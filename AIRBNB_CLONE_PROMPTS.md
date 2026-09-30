# Airbnb Clone Take-Home: AI Prompt Pack

How to use:
1. Copy **Section 1** into `CLAUDE.md` at the project root (Claude Code reads it automatically). For Cursor or Codex, paste it as the first message or a rules file.
2. Run the **Section 2** phase prompts one at a time, in order.
3. Log every prompt you actually use in `docs/prompts-log.md`. The task says the sequence of prompts may be requested at submission or interview.
4. Do **not** push to a public GitHub repo. Use a private repo or a zip.

---

## 1. Master Prompt (CLAUDE.md)

```
You are a senior staff frontend engineer (10+ years) with a strong design eye and
performance discipline. Build a pixel-perfect clone of the Airbnb listing page at
https://airbnb-orpin-pi.vercel.app/ as a full-stack app.

## HARD RULES
- The reference site is the single source of truth. Study it in the browser
  (layout, spacing, font sizes/weights, colours, icons, hover states, scroll
  behaviour, transitions, focus states, keyboard behaviour) and REPRODUCE it.
- NEVER copy the reference's bundled JS/CSS/source or download its assets.
  Rebuild everything by hand. Use my own placeholder images (Unsplash-style URLs
  or local files) and my own SVG icons.
- Desktop only (>=1024px). No mobile layout.
- Prioritise fidelity over creativity. Where the reference is silent, apply
  iOS-style polish: spring/ease-out cubic-bezier motion (0.32, 0.72, 0, 1),
  backdrop-blur on sticky bars/overlays, continuous rounded corners, soft
  layered shadows, and 44px minimum hit targets.

## TECH STACK
Frontend: React 18 + TypeScript + Vite, React Router, Tailwind CSS with design
tokens in CSS variables, Framer Motion (or CSS transitions where lighter),
TanStack Query for data fetching.
Backend: Node + Express + TypeScript, MongoDB (Mongoose), REST API
(GET /api/listings/:id, read-only), zod validation, helmet, cors,
compression, rate limiting, seed script with the listing data.
Monorepo: /client, /server, /docs, /.claude (agents + skills).

## SCREENS (3 views)
1. Listing Page: full property page. Header, title, share/save, 5-image hero
   grid, host info, highlights, description, amenities, sleeping arrangements,
   reviews (ratings breakdown + review cards), location, host section, things
   to know, sticky reservation card (UI only, no booking logic), footer.
2. Photo Tour: full-screen gallery opened via "Show all photos" or any hero
   image. Smooth open/close transition, scroll, close button, Esc to close.
3. Lightbox: single-photo viewer opened from any gallery photo. Prev/next
   arrows, keyboard left/right navigation, Esc to close, counter, animated
   slide/fade between photos, preloads adjacent images.
Route the overlays (e.g. /rooms/:id/photos and ?photo=3) so the back button works.

## DESIGN SYSTEM
- Define tokens once: colours (rausch #FF385C, ink #222222, grey scale,
  borders #DDDDDD), spacing scale, radii, shadows, type scale, z-index layers,
  motion durations/easings. Extract exact values from the reference.
- Font: Airbnb Cereal is proprietary. Use the closest match visible on the
  reference (e.g. Inter or a Circular-like fallback) via self-hosted woff2 with
  font-display: swap and preload.
- Icons: hand-authored inline SVG components, tree-shakeable.
- Hover/scroll animations: image zoom on hover, button press scale (0.97),
  sticky header shadow on scroll, sticky reservation card, section reveal
  only if the reference does it.

## ACCESSIBILITY
- Semantic landmarks, one h1, logical heading order, alt text on all images.
- Full keyboard navigation, visible :focus-visible rings matching the reference.
- Dialogs: role="dialog", aria-modal, focus trap, return focus to trigger on
  close, Esc closes, body scroll lock.
- Respect prefers-reduced-motion. Colour contrast >= WCAG AA.
- aria-labels on icon-only buttons; aria-live for the lightbox counter.

## PERFORMANCE & CODE SPLITTING
- Route-level and overlay-level code splitting with React.lazy + Suspense
  (PhotoTour and Lightbox are lazy chunks, prefetched on hover/idle).
- Vite manualChunks: vendor (react), motion, query separate.
- Images: responsive srcset/sizes, WebP/AVIF, explicit width/height (zero CLS),
  loading="lazy" below the fold, fetchpriority="high" + preload for the LCP
  hero image, blur-up placeholders.
- Memoise heavy lists, avoid unnecessary re-renders, content-visibility:auto
  for below-the-fold sections, virtualise the photo tour only if needed.
- Target Lighthouse desktop: Performance >= 95, Accessibility 100,
  Best Practices >= 95, SEO >= 90. LCP < 1.5s, CLS < 0.05, TBT < 100ms.
- Backend: gzip/brotli, ETag + Cache-Control, projection queries, index on
  listing id, lean() Mongoose reads.

## CODE QUALITY
- Strict TypeScript, ESLint + Prettier, feature-based folders
  (features/listing, features/gallery, shared/ui, shared/hooks), small
  single-responsibility components, no dead code, meaningful commits.
- README with setup, env vars, scripts, deployment steps, architecture notes.

## WORKFLOW
Work in phases. After each phase, run the app, compare it side-by-side with the
reference, list every visual/behavioural difference, and fix them before moving
on. Ask me before making any assumption that affects fidelity.
```

---

## 2. Phase Prompts (run in order)

### Phase 1: Recon and design tokens
```
Open the reference site and audit it. Produce docs/design-audit.md listing:
exact colours, font sizes/weights/line-heights, spacing, border radii, shadows,
section order, every hover/focus/scroll animation with duration and easing,
and keyboard behaviours. Then create the Tailwind config and CSS variable
tokens from it. Do not copy any source code or assets.
```

### Phase 2: Project scaffold
```
Scaffold the monorepo (client, server, docs). Set up Vite + React + TS +
Tailwind + ESLint + Prettier + path aliases, and Express + TS + Mongoose.
Add the folder structure, scripts, .env.example and a seed script.
```

### Phase 3: Backend API (bonus)
```
Build GET /api/listings/:id and GET /api/listings/:id/photos with zod-validated
params, Mongoose schema, indexes, seed data (title, host, rating, amenities,
reviews, photos, location), compression, helmet, CORS, rate limit, cache
headers, centralised error handling, and a health endpoint. Add basic tests.
```

### Phase 4: Listing page UI
```
Build the Listing Page section by section, matching the reference exactly.
Fetch data with TanStack Query. Build shared UI primitives first (Button,
IconButton, Avatar, Rating, Divider, Modal). Include the sticky header and the
sticky reservation card. Verify every section against the reference.
```

### Phase 5: Photo Tour and Lightbox
```
Build lazy-loaded Photo Tour and Lightbox overlays. Match open/close animations,
photo layout, arrows, counter and transitions. Implement focus trap, Esc,
left/right keys, scroll lock, focus return, URL-synced state, and adjacent-image
preloading. Respect prefers-reduced-motion.
```

### Phase 6: Motion and iOS-style polish
```
Audit all interactions. Match every hover/scroll/transition from the reference.
Where the reference is silent, add subtle iOS-style polish (spring easing,
backdrop blur, press feedback) without changing the visual design.
```

### Phase 7: Performance pass
```
Run Lighthouse and the Vite bundle analyzer. Fix code splitting, image
optimisation, font loading, LCP/CLS/TBT issues. Report before/after metrics in
docs/performance.md.
```

### Phase 8: Accessibility pass
```
Audit with axe and keyboard-only testing. Fix focus order, ARIA, contrast, and
dialog behaviour. Document results in docs/accessibility.md.
```

### Phase 9: Fidelity review
```
Compare the clone to the reference at 1440px and 1920px, section by section.
List every pixel/behaviour difference and fix them. Repeat until none remain.
```

### Phase 10: Architecture diagram
```
Write an Excalidraw-ready description (and a Mermaid version) of a
production-scale vacation-rental marketplace covering:
- Frontend: CDN/edge, SSR/ISR, code splitting, image CDN
- Backend: API gateway, stateless services (listings, search, booking, auth,
  reviews, payments), load balancers, autoscaling, queues (Kafka/SQS), caching
- Storage/DB: sharded PostgreSQL/MongoDB, read replicas, Redis, S3 for media
- Search: Elasticsearch/OpenSearch with geo-indexing, CDC pipeline for indexing
- Deployment: Docker, Kubernetes, CI/CD, multi-region, blue/green, observability
Include a short scaling-strategy paragraph for each of the five areas.
```

### Phase 11: Deploy
```
Deploy client to Vercel and server to Render/Railway with MongoDB Atlas free
tier. Configure env vars, CORS, and production build. Update the README.
```

---

## 3. Sub-agent and skill configs

The task explicitly asks for these in your submission.

```
.claude/
├── agents/
│   ├── fidelity-reviewer.md
│   ├── a11y-auditor.md
│   ├── perf-optimizer.md
│   ├── code-quality-reviewer.md
│   └── api-reviewer.md
└── skills/
    └── ui-fidelity/SKILL.md
```

Prompt to generate them:
```
Create Claude Code sub-agent config files in .claude/agents/ for:
fidelity-reviewer, a11y-auditor, perf-optimizer, code-quality-reviewer, and
api-reviewer. Each needs frontmatter (name, description, tools), a focused
system prompt, a checklist, and an output format. Also create a skill in
.claude/skills/ui-fidelity/SKILL.md describing how to compare the clone to the
reference and log differences in docs/fidelity-log.md.
```

---

## 4. Tips

- Give the agent **screenshots** of the reference. Visual matching improves a lot compared to text descriptions.
- Build the **frontend first**. The task says a clean, complete frontend beats an over-engineered, incomplete one. Add the backend as the bonus.
- Keep the desktop-only scope. Do not spend time on mobile.
- Commit after every phase so your history shows the AI workflow.
- Final zip should contain: code, architecture diagram (image/PDF), `.claude/` configs, and `docs/prompts-log.md`.
