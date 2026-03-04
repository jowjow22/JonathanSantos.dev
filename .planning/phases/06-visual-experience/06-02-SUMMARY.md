---
phase: 06-visual-experience
plan: "02"
subsystem: ui
tags: [three, react-three-fiber, react-three-drei, glsl, webgl, animation, hero]

# Dependency graph
requires:
  - phase: 04-content-sections
    provides: Homepage index.tsx hero section structure with ProfileImage and article layout

provides:
  - Lazy-loaded 3D blob hero animation subsystem under src/animations/hero/
  - GLSL vertex shader with 3D Perlin noise (snoise) for organic blob morphing
  - GLSL fragment shader with indigo-to-purple color gradient matching site brand
  - R3F Canvas entry point (Hero3D) with mouse tracking and spring-like lerp
  - BlobMesh component with useFrame animation loop driving u_time and u_intensity uniforms
  - BlobScene wrapper providing scene graph structure (ambientLight + BlobMesh)
  - index.tsx wired with React.lazy + Suspense for Three.js code splitting

affects:
  - 07-seo-analytics  # hero section now has additional async component
  - Any phase touching src/routes/__public/index.tsx

# Tech tracking
tech-stack:
  added:
    - three@0.183.2 (3D rendering engine)
    - "@react-three/fiber@9.5.0 (React renderer for Three.js)"
    - "@react-three/drei@10.7.7 (R3F helper components)"
    - "@types/three@0.183.1 (TypeScript types for three)"
  patterns:
    - React.lazy at module level (outside component) for stable Suspense cache reference
    - GLSL imported with ?raw suffix (Vite raw string transform)
    - uniforms wrapped in useMemo to prevent animation reference breakage
    - mouseRef updated in window event listener (not useState, avoids re-render)
    - Canvas positioned absolute with inset:0 and pointerEvents:none behind all content
    - Section has position:relative; article has relative z-10 for layering

key-files:
  created:
    - src/animations/hero/Hero3D.tsx
    - src/animations/hero/BlobScene.tsx
    - src/animations/hero/BlobMesh.tsx
    - src/animations/hero/shaders/blob.vert.glsl
    - src/animations/hero/shaders/blob.frag.glsl
  modified:
    - src/routes/__public/index.tsx
    - package.json
    - package-lock.json

key-decisions:
  - "Hero3D lazy import is at module level (const Hero3D = lazy(...)) not inside component — prevents re-creating lazy reference on every render which would bust Suspense caching"
  - "Canvas has pointerEvents:none to prevent capturing mouse clicks from buttons and links behind the 3D layer"
  - "uniforms object is wrapped in useMemo(()=>({}), []) — creating a new object per render would break animation by resetting all uniform values to initial on every frame"
  - "GLSL files imported with ?raw suffix — without it Vite throws a parse error treating GLSL as JS"
  - "icosahedronGeometry used (not icosahedronBufferGeometry) — BufferGeometry suffix was removed in Three.js r125+"
  - "mouseRef is a useRef (not useState) for mouse position — avoids re-renders on every mousemove event"

patterns-established:
  - "R3F code splitting: lazy import at module level + Suspense wrapping = Three.js bundle excluded from main chunk"
  - "GLSL shader pattern: ?raw import + ShaderMaterial uniforms memoized via useMemo"
  - "Spring-like mouse follow: MathUtils.lerp with 0.05 factor provides natural lag without springs library"
  - "Z-index layering: section relative > Canvas absolute z-0 > content relative z-10"

requirements-completed: [VIS-01]

# Metrics
duration: 12min
completed: 2026-03-01
---

# Phase 06 Plan 02: 3D Blob Hero Animation Summary

**Lazy-loaded R3F Canvas with GLSL Perlin noise blob morphing in indigo/purple, spring-like mouse tracking, and Three.js code-split from main bundle via React.lazy + Suspense**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-01T11:05:00Z
- **Completed:** 2026-03-01T11:17:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Installed four R3F dependencies (three, @react-three/fiber, @react-three/drei, @types/three) cleanly with no peer-dep conflicts
- Built complete hero animation subsystem: Hero3D.tsx, BlobScene.tsx, BlobMesh.tsx, blob.vert.glsl, blob.frag.glsl
- Wired Three.js into homepage as a lazy-loaded Suspense component, ensuring the ~500KB Three.js bundle is excluded from the main chunk and only loads when the hero section mounts

## Task Commits

Each task was committed atomically:

1. **Task 1: Install R3F deps + create GLSL shaders + BlobMesh** - `a82994d` (feat)
2. **Task 2: Create Hero3D + BlobScene + wire lazy import into index.tsx** - `1fb62b1` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified

- `src/animations/hero/Hero3D.tsx` - Lazy-loaded Canvas entry point with window mousemove tracking ref; default export required by React.lazy
- `src/animations/hero/BlobScene.tsx` - R3F scene graph wrapper (ambientLight + BlobMesh); keeps Hero3D thin
- `src/animations/hero/BlobMesh.tsx` - Icosahedron mesh with ShaderMaterial, useFrame animation loop, spring-like mouse lerp
- `src/animations/hero/shaders/blob.vert.glsl` - Full Stefan Gustavson 3D Perlin noise (snoise) + vertex displacement by u_time/u_intensity/u_mouse uniforms
- `src/animations/hero/shaders/blob.frag.glsl` - Indigo (#4f46e5) to purple (#9333ea) color mix based on vDisplacement
- `src/routes/__public/index.tsx` - Added lazy/Suspense imports, Hero3D lazy reference at module level, hero section gets relative, article gets relative z-10
- `package.json` - Added three, @react-three/fiber, @react-three/drei, @types/three
- `package-lock.json` - Updated lock file

## Decisions Made

- Hero3D lazy reference is created at module level (outside the Index component) so Suspense cache is stable across renders — creating it inside would recreate the lazy reference and bust caching.
- Canvas uses `pointerEvents: 'none'` so the WebGL surface does not capture mouse/touch events from buttons and links rendered above it.
- uniforms is wrapped in `useMemo(()=>({}), [])` — Three.js ShaderMaterial reads uniform references, not values; a new object per render resets u_time to 0.0 every frame, breaking animation.
- GLSL files imported with `?raw` suffix — Vite treats them as raw strings, preventing JavaScript parse errors.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The `npm run build` command (which runs `tsc -b` before `vite build`) cannot complete due to pre-existing unrelated TypeScript errors in ProjectForm.tsx (resolver type incompatibility) and AnimatedOutlet.tsx (motion/react-client missing exports). These were documented in STATE.md as known blockers before this plan started. The `npx tsc --noEmit` passes cleanly with no errors from any hero animation files.

## User Setup Required

None - no external service configuration required. The hero animation renders using WebGL in the browser with no API keys or environment variables.

## Next Phase Readiness

- VIS-01 satisfied: morphing 3D hero background self-animates with noise and responds to mouse cursor with spring-like lag
- All hero animation files exist under src/animations/hero/ with correct exports
- Three.js is code-split (React.lazy + Suspense ensures separate chunk)
- Pre-existing build blockers (ProjectForm.tsx TS errors, motion/react-client) remain and need resolution before public launch — out of scope for this plan

---
*Phase: 06-visual-experience*
*Completed: 2026-03-01*
