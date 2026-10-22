# MAISON VÉRA — Forensic Visual Audit & Quality Recovery Report

## 1. Executive Summary
A forensic visual and code inspection of the initial **MAISON VÉRA** luxury storefront (`src/studio/AutoCinematicSite.tsx`, `src/studio/ModelViewport.tsx`, `src/studio/modules/ExperienceModules.tsx`, `src/studio/experience/ConceptEnhancements.tsx`, `src/studio/experience/SectorConcepts.tsx`, and `src/studio/studio.css`) identified eight systemic causes of visual degradation. This report documents every occurrence and the production architectural remediation applied.

---

## 2. Forensic Visual Failure Inventory

### 2.1 Procedural 3D Primitives Masquerading as Commercial Merchandise
- **Locations**:
  - `src/studio/ModelViewport.tsx` (`ProceduralConcept` fallback when `modelPath` is `null` or empty)
  - `src/studio/experience/ConceptEnhancements.tsx` (`SneakerConcept`, `WatchConcept`, `EyewearConcept`, `RingsConcept`, `GearConcept`)
  - `src/studio/experience/SectorConcepts.tsx` (`fabric` TorusKnot, `fashion` Cylinders/Torus)
- **Defect**:
  - Every product in `src/studio/AutoCinematicSite.tsx` had `modelPath: null`. As a result, primary commercial viewports in the Hero, Category Showcase, and Product Modal rendered primitive Three.js geometries (`<sphereGeometry>`, `<boxGeometry>`, `<torusKnotGeometry>`, `<cylinderGeometry>`) instead of actual products.
  - Most critically, **Designer Clothing (`mv-clothing-02`)** rendered a metallic rotating `<torusKnotGeometry args={[0.72, 0.22, 160, 28]} />` (`concept: 'fabric'`) as a substitute for a cashmere coat.
- **Remediation**:
  - Installed three real, licensed Khronos Group PBR `.glb` models in `/public/models/`:
    - `/public/models/atelier-footwear-shoe.glb` (`13,540` vertices, 5 PBR textures, CC-BY-4.0)
    - `/public/models/atelier-chronograph-watch.glb` (`104,765` vertices, 13 meshes, 8 PBR textures, CC-BY-4.0)
    - `/public/models/atelier-titanium-eyewear.glb` (`7,420` vertices, 8 meshes, CC-BY-4.0)
  - Updated `ModelViewport.tsx` with `commercialMode` (enabled by default in primary storefront sections): if a product does not have a verified `.glb` asset (`modelPath: null`), the viewport renders a high-resolution photographic studio canvas with interactive optical loupe inspection rather than procedural geometry.
  - Isolated all procedural 3D concepts (`sneaker`, `watch`, `eyewear`, `rings`, `gear`, `fabric`) inside an explicitly labeled, collapsed-by-default **Experimental 3D Silhouette Lab** at the bottom of the experience.

### 2.2 Flat SVG Vector Illustrations Used as Product Photography
- **Locations**:
  - `/public/images/maison-footwear.svg` (2.2 KB geometric SVG with `<ellipse>` and `<path>`)
  - `/public/images/maison-clothing.svg` (1.7 KB geometric SVG)
  - `/public/images/maison-watch.svg` (2.0 KB geometric SVG)
  - `/public/images/maison-eyewear.svg` (1.6 KB geometric SVG)
  - `/public/images/maison-rings.svg` (1.6 KB geometric SVG)
  - `/public/images/maison-weekender.svg` (1.7 KB geometric SVG)
- **Defect**:
  - All six product cards, editorial modules, and poster frames displayed flat, gradient-filled SVG vector illustrations instead of real photography.
- **Remediation**:
  - Deleted all six `maison-*.svg` placeholder files.
  - Replaced them with verified, unbranded high-resolution studio and editorial photographs stored locally in `/public/images/` and tracked in `/asset-provenance.json`.
  - Added an automated quality gate (`scripts/audit-visual-readiness.mjs`) that fails the build if any commercial product references an `.svg` placeholder or lacks verified provenance.

### 2.3 Missing PBR Environment Reflections & Ground Contact Shadows
- **Locations**:
  - `src/studio/ModelViewport.tsx`
  - `src/studio/experience/AdaptiveLightingRig.tsx`
- **Defect**:
  - `ModelViewport.tsx` used point and directional lights without a studio `Environment` map or `ContactShadows`. Metallic watch cases, sapphire crystal glass, and leather footwear lacked physically based specular reflections and grounded ambient occlusion.
- **Remediation**:
  - Added `@react-three/drei` `<Environment preset="studio" />` / `<ContactShadows />` with subtle ground plane shadow grounding and physically calibrated tone mapping (`THREE.ACESFilmicToneMapping`, `toneMappingExposure = 1.08`).

### 2.4 Generic System Typography & Weak Editorial Hierarchy
- **Locations**:
  - `index.html`
  - `src/studio/studio.css`
- **Defect**:
  - `--font-sans` defaulted to `Inter, system-ui` and `--font-serif` defaulted to `Georgia, Cambria, serif`. The resulting typography lacked the high-contrast editorial authority of a luxury fashion house.
- **Remediation**:
  - Loaded `Cormorant Garamond` (weights 400, 500, 600, italic), `Plus Jakarta Sans` (weights 300, 400, 500, 600), and `JetBrains Mono` (weights 400, 500) in `index.html`.
  - Updated `src/studio/studio.css` with fluid editorial typographic scales, hairlines (`1px solid rgba(245, 241, 234, 0.09)`), and tabular numeric alignment (`font-variant-numeric: tabular-nums`) for prices, reference numbers, and horological specifications.

### 2.5 Repetitive Card Layouts & Indistinguishable Category Presentations
- **Locations**:
  - `src/studio/AutoCinematicSite.tsx`
  - `src/studio/modules/ExperienceModules.tsx`
- **Defect**:
  - Footwear, Designer Clothing, Watches, and Accessories all rendered inside the exact same split-card layout with identical buttons and badges.
- **Remediation**:
  - Built distinct, discipline-specific interactive showcases in `src/studio/media/PhotorealProductShowcase.tsx` and `src/studio/AutoCinematicSite.tsx`:
    1. **Footwear (`mv-footwear-01`)**: Interactive 3D-scanned PBR shoe `.glb` stage with real-time studio lighting rig switcher (`Warm Atelier`, `Architectural Rim`, `Noir Vault`) paired with macro studio photography.
    2. **Designer Clothing (`mv-clothing-02`)**: Photography-first **Editorial Lookbook & Interactive 2.5× Fabric Loupe** inspecting double-faced cashmere drape, lapel pick-stitching, and technical silk lining—never using cartoon 3D geometry.
    3. **Haute Horlogerie (`mv-watch-03`)**: Interactive 13-mesh Chronograph `.glb` inspection stage paired with a precision horological specification matrix (`Calibre MV-01`, `28,800 vph`, `40.0 mm Grade 5 Titanium`).
    4. **Luxury Accessories (`mv-accessory-04`, `mv-accessory-05`, `mv-accessory-06`)**: Real `.glb` 3D eyewear inspection for the Solstice Frame (`atelier-titanium-eyewear.glb`) alongside high-contrast architectural still-life photography with optical zoom for the Obsidian Signet Ring and Structured Weekender.

### 2.6 Gemini Image-Generation Capability Audit
- **Investigation**:
  - Tested all image-capable models exposed to the workspace `GEMINI_API_KEY` (`gemini-3.1-flash-lite-image`, `gemini-nano-banana-2.1`, `gemini-3-pro-image`, `gemini-3.1-flash-image`, `gemini-2.5-flash-image`, and `imagen-3.0-generate-002`).
  - All Gemini image endpoints returned `HTTP 429 RESOURCE_EXHAUSTED` with `Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0`.
- **Action Taken**:
  - Recorded this exact API requirement in `/asset-provenance.json` and `src/studio/media/MediaPipeline.ts` so the workspace never fabricates AI-generation claims and transparently documents that live Gemini image generation requires a billing-enabled API key (`limit > 0`).
