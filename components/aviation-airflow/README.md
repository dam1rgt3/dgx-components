# Aviation Airflow

Animated aviation program explorer for the STEM Aviation website. Fine blue airflow strands sit behind a clean three-program selector and one photograph/detail area. The content area stays stable when a different program is selected. No circles or background grid.

## Source files

Copy these four files together into `src/components/airflow/` in your application:

| File | Direct source |
| --- | --- |
| `AirflowPrograms.tsx` | [Raw source](https://raw.githubusercontent.com/dam1rgt3/dgx-components/main/components/aviation-airflow/AirflowPrograms.tsx) |
| `AirflowBackground.tsx` | [Raw source](https://raw.githubusercontent.com/dam1rgt3/dgx-components/main/components/aviation-airflow/AirflowBackground.tsx) |
| `airflow.css` | [Raw source](https://raw.githubusercontent.com/dam1rgt3/dgx-components/main/components/aviation-airflow/airflow.css) |
| `index.ts` | [Raw source](https://raw.githubusercontent.com/dam1rgt3/dgx-components/main/components/aviation-airflow/index.ts) |

`programs.example.ts` provides the three program descriptions. Set its `image.src` and `href` values to the website's existing assets and routes before using it. The example links are explicit placeholders, not production destinations.

## Dependencies

React 18+ and a TypeScript-capable React build. No Tailwind, Motion, React Bits, WebGL, API keys, or external services. The component imports its own scoped CSS. This is original code inspired by the Airflow visual direction, not a wrapper around React Bits.

## Use

```tsx
import { AirflowPrograms } from './components/airflow';
import { aviationPrograms } from './components/airflow/programs.example';

// Fill in existing image URLs and program routes in aviationPrograms first.
<AirflowPrograms
  id="aviation-programs"
  programs={aviationPrograms}
  intensity={0.65}
  speed={1}
  theme="light"
  schoolsLink={{ label: 'View participating schools', href: '/EXISTING-SCHOOLS-ROUTE' }}
/>
```

Keep the existing section anchor if the site navigation references it. Match the website font with a custom class setting `--af-font`. Other scoped variables include `--af-background`, `--af-ink`, `--af-muted`, `--af-border`, `--af-accent`, and `--af-line-color`.

Optional props: `initialProgramId`, `eyebrow`, `title`, `subtitle`, `navigationNote`, `footerText`, `schoolsLink`, `className`, `style`, and `onProgramChange`. Use `image.position` for photo focal points. `intensity` accepts 0–1 and `speed` accepts 0–3, with zero producing a static background.

## Paste into Lovable

```text
Integrate the existing Airflow React component from this repository into the STEM Aviation website:
https://github.com/dam1rgt3/dgx-components/tree/main/components/aviation-airflow

Read that folder's README, then fetch the actual source code from these URLs:
https://raw.githubusercontent.com/dam1rgt3/dgx-components/main/components/aviation-airflow/AirflowPrograms.tsx
https://raw.githubusercontent.com/dam1rgt3/dgx-components/main/components/aviation-airflow/AirflowBackground.tsx
https://raw.githubusercontent.com/dam1rgt3/dgx-components/main/components/aviation-airflow/airflow.css
https://raw.githubusercontent.com/dam1rgt3/dgx-components/main/components/aviation-airflow/index.ts

Copy these four files into src/components/airflow/ and use the supplied component directly. Its CSS import is already included. No animation dependencies need installing. Do not recreate the design from the description.

Use this example data as the content reference:
https://raw.githubusercontent.com/dam1rgt3/dgx-components/main/components/aviation-airflow/programs.example.ts

Inspect the current Aviation Programs section first. Preserve the three original photo assets, actual program destination URLs, participating-schools link, existing verified school count, and section anchor. Map those values to the AviationProgram objects. Replace all example image and href placeholders with actual existing site values. Keep the order: Elementary & middle schools, High school, Safety training.

Replace the current three generic program cards with AirflowPrograms using theme="light", intensity={0.65}, and speed={1}. Keep the site's existing content width and use its font via --af-font. Remove or mask the old animated background behind this section so only the component's Airflow animation is visible there. Preserve the rest of the page, airport map, and schools map.

Keep the supplied shared-grid layout: inactive panels remain in layout to reserve space. Do not conditionally render only the active panel or apply display:none to it. Do not animate width or height. Retain the pause button, reduced-motion support, focus indicators, and keyboard accessibility.

Build the project and verify all three selections at 320px, 390px, 736px, and desktop widths. Check stable section dimensions, image loading, keyboard access, no horizontal overflow, and working program and schools links. Show the integrated preview before publishing.
```

The repository is a source library, not an npm package or a replacement for the whole Lovable project. Copy the component into the existing app. If Lovable cannot fetch a raw URL, attach the four source files from this folder to its chat and ask it to perform the same integration.

## Behavior and validation

- Responsive container-based layout, stacking below 580px.
- All detail panels occupy the same grid cell; invisible panels retain intrinsic sizing. Fixed photo boxes prevent image-load shifts.
- Native buttons support keyboard selection. Hidden panels are excluded from assistive technology and their links cannot receive focus.
- Reduced-motion preferences stop the canvas animation. A pause button controls normal motion. Animation stops outside the viewport and in hidden browser tabs.
- Canvas is capped at 30 fps and 2× pixel density. Frames, observers, and event handlers are cleaned up on unmount, including Strict Mode remounts.
- All source is locally rendered. There are no analytics or outbound API calls; images load from the URLs supplied by the host app.
- Strict TypeScript compilation, a Vite production build, and six Chromium tests passed in the standalone demo. See [VALIDATION.md](./VALIDATION.md).

Use the website's original photographs. Screenshot-derived preview images are not included in this reusable source folder. The live Lovable site has not yet been modified or published by this upload.
