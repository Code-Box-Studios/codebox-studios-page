# Mobile scroll implementation plan

**Goal:** Keep the studio's 3D identity while making mobile scrolling responsive and the content easy to read.

**Architecture:** Use a compact, scroll-driven cube story below the normal mobile introduction. Keep three chapters in document flow and show portfolio cards without the desktop pinned journey. Preserve the desktop renderer, CMS content, motion controls, and reduced-motion preference.

**Constraints:** Work on `main`; preserve existing uncommitted files and CMS data; add no dependencies. Mobile breakpoint is 760px.

- [ ] Test mobile story holds, clamped progress, and volumetric cube reassembly before implementing the geometry.
- [ ] Add a mobile hero with three readable chapters and a cube that updates only on scroll. Cache geometry on resize, stop offscreen, and render three visible faces per block.
- [ ] Disable mobile page parallax and pinned portfolio animation. Show readable titles, descriptions, and project screenshots in normal flow.
- [ ] Verify mobile widths, desktop, pause/resume, reduced motion, anchor navigation, and idle callback counts. Run all tests and production build.
- [ ] Publish a Lavish comparison using actual screenshots, then deploy and verify the production source and alias.

Review focus: orientation changes, short viewports, hydration layout shifts, offscreen work, and retaining all project descriptions with motion paused.
