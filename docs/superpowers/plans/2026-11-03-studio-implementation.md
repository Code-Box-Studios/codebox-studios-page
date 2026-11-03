# Studio landing page implementation plan

**Goal:** Build the approved Lavish design as the live, CMS-driven Next.js homepage.

**Architecture:** Render content on the server. Small React client components own the cube, project journey, navigation, and motion controls. Reuse the existing Payload contact and newsletter actions. Keep the original theme previews at their existing explicit query URLs.

**Tech stack:** Next.js 15, React 19, TypeScript, CSS 3D transforms, native animation frames, Payload 3, Postgres.

**Spec:** Approved `.lavish/codebox-3d-concept.html`, including its final business narrative and responsive styles.

## Constraints

- Work on `main`; preserve `.gitignore`, `.ignore`, `.env`, and existing database data.
- Use charcoal, coral, and the existing brand mark and fonts.
- The cube represents interface, logic, content, and infrastructure; retain breakup, helix, and reassembly with six-faced cubes.
- Project counts and imagery come from the CMS; illustrate missing images and label them as concepts.
- Preserve every existing content section and both form actions.
- Keep content readable before hydration and with JavaScript or motion disabled.
- Do not deploy, modify production data, create a branch, or create a worktree.

## Review focus

Empty or one-item portfolios; arbitrary CMS text and project counts; short landscape viewports; reduced motion and live preference changes; animation cleanup during navigation and tab visibility changes.

## Tasks

- [x] Add meaningful motion geometry tests, watch them fail, and implement reusable cube and project math.
- [x] Build the server-rendered studio sections, CMS-backed project imagery, working forms, navigation, and scoped styles.
- [x] Add React-owned scroll choreography with cleanup, progressive enhancement, motion preferences, and responsive scene fitting.
- [x] Run tests, TypeScript, ESLint, production build, and browser checks across phone, tablet, landscape, and desktop sizes. Verify actual form persistence locally and remove test submissions.

## Verification

`npm test` — 8 passing tests covering cube volume, camera, project counts, scene fitting, CMS notes, and uploaded project metadata.

`node_modules/.bin/tsc --noEmit`

`node_modules/.bin/eslint src/components/studio src/app/\(frontend\)/page.tsx`

`npm run build`

Browser: cube geometry and narrative phases; every project scene; zero/one/many project counts; navigation, Escape, anchors, forms, reduced motion, touch-sized controls, and no clipping or horizontal overflow at 320×568, 375×667, 390×844, 768×1024, 844×390, 1024×768, 1440×900, and 1920×1080.

The final production build passed all eight viewport checks, 40 cube narrative positions, 32 project positions, mobile menu/Escape, touch tour pause, anchor cancellation, live reduced-motion changes, no-JavaScript projects/navigation, and original theme preview routes. Contact and newsletter submissions were verified in local Postgres and removed afterward. No runtime page errors were observed. The production server remains at `http://localhost:3000` and CMS at `/admin`.

Independent review findings were resolved: invisible hero controls are inert, CMS notes remain in animated descriptions, tour navigation cancels animation, and native mobile disclosure menus work without JavaScript.
