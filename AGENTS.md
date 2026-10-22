# Universal Cinematic Studio v6 — implementation contract

1. Before editing, read `README.md`, `PROMPT_ONE_CLICK_CINEMATIC_SITE.md`, `package.json`, `site-templates.json`, `composition-recipes.json`, `experience-presets.json`, `component-manifest.json`, `docs/V6_ARCHITECTURE_AND_RELEASE_NOTES.md` and provided product assets.
2. Treat the imported repository as executable code, not a set of URLs. `21st.dev` and `UI UX Pro Max` require separate workflows; their full source is not bundled. Prefer existing local modules before adding dependencies.
3. Build original, category-specific premium visuals rather than cloning a famous brand. Vary information architecture, imagery, composition, typography, camera movement and motion pacing according to sector. `site:director` makes deterministic, limited suggestions; AI Studio must do the creative work.
4. For each product, use its licensed GLB, or explicitly label conceptual geometry. Never imply a placeholder is a faithful digital twin of an actual product. Use truthful product details and only verified prices, links and specifications.
5. Assemble from 10 actual module types in `src/studio/modules/ExperienceModules.tsx`, respecting recipes as options, not restrictions. Keep layouts accessible, responsive and conversion-aware.
6. Use `npm run site:auto -- --brand "..." --brief "..."` for initial code-backed configuration; `--spec` accepts a JSON product list. Run `npm run site:doctor`, `npm run audit:recipes`, unit tests, `npm run typecheck` and `npm run build` before claiming release readiness.
7. Optimize GPU: model/texture budgets, DPR adaptation, offscreen/tab pausing, reduced motion, meaningful fallbacks for devices without WebGL. Check real mobile devices instead of assuming high performance.
8. No unauthorized code, branded models, private secrets, external images or false checkout claims. Report asset needs, failing commands, browser findings, changed files and release blockers.
