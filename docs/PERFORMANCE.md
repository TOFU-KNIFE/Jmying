# Runtime performance — 2.0.1

Measured 2026-11-09 against 2.0.0 and the optimized production build on the same macOS machine, Chromium 145 with native Metal, Node 25.9.0. This is a controlled local comparison, not a universal device score or a Lighthouse claim.

## Delivery

| Resource                 |        2.0.0 |       2.0.1 |
| ------------------------ | -----------: | ----------: |
| Main CSS (uncompressed)  |    667,128 B |   123,487 B |
| Main CSS (gzip estimate) |    203,934 B |    20,111 B |
| Cassette GLB             |  3,565,116 B | 2,025,492 B |
| Assembly GLB             |  3,343,744 B | 1,954,144 B |
| Complete offline cache   | 35,474,768 B | 9,602,954 B |
| Offline requests         |          819 |         194 |
| Offline font requests    |          753 |         132 |

The font build retains every authored app/content glyph at all four supplied weights, plus Latin names/search input. It narrows CSS coverage rather than modifying font binaries, and rebuilds from source on every build. Unauthored non-Latin search input uses system fallback. Original font files and notices stay in the repository and on the server. Offline installation downloads only referenced fonts, models, app files, exports, audio and notices; installation/update remains atomic.

Models use EXT_meshopt_compression with no quantization, simplification or vertex/index reordering. Every geometry buffer is decoded with the exact browser decoder and compared byte for byte with its source. Names, accessors, meshes, nodes, materials and scenes are also checked. Source GLBs remain untouched. The build encoder is pinned at meshoptimizer 1.0.1; the runtime decoder is bundled by the existing Three.js dependency. CSP permits WebAssembly compilation with `wasm-unsafe-eval`; JavaScript eval and external scripts remain blocked.

## Idle main-thread work

Reduced motion and super-performance enabled in both builds, fixed 1440×900 and 390×900 viewports, service workers blocked to isolate rendering from installation. After settling, sample Chromium TaskDuration three times for two seconds each and compare medians. These results do not describe the full-motion opening or continuous archive waves.

| View / state     | Before (per 2 s) | After (per 2 s) | Reduction |
| ---------------- | ---------------: | --------------: | --------: |
| 1440px / archive |         335.6 ms |        322.6 ms |      3.9% |
| 1440px / viewer  |         402.0 ms |        100.8 ms |     74.9% |
| 390px / archive  |         324.5 ms |        307.5 ms |      5.3% |
| 390px / viewer   |         420.1 ms |         99.7 ms |     76.3% |

The viewer continues camera/model simulation and input handling but skips identical GPU output; the sample rendered four initial frames then reused over 500 frames. Resize, context restoration, quality, geometry, camera, glass clarity, theme and texture changes invalidate the retained image. Disabled postprocessing uses 1×1 targets and returns to full size when re-enabled. The invisible inspection layer skips layout reads and SVG writes.

Reproduce with `npm run build`, `npm run preview`, then `node scripts/measure-runtime.mjs /tmp/measurement.json`. Timing varies with temperature, background load and GPU. Use the same browser/backend and do not run competing tests during a sample.

## Validation

The regular build, TypeScript, content/export, original motion, 20,000 navigation moves, optional-font startup and release checks run alongside new glyph coverage and byte-exact model checks. The existing desktop/mobile journeys additionally assert that an idle viewer reuses frames and that explode triggers drawing again. Native WebKit, Cloudflare CSP, offline reload/model/export and restored quality receive manual browser verification before release.
