# Delivery validation

Validated November 14, 2026, with Node.js 22.17.1 on Windows.

- `npm run build`: passed. TypeScript strict checking and Vite production bundling completed.
- `npm test`: all six Playwright tests passed in Chromium.
- Program switching preserved section and detail-panel width and height at viewport widths of 320, 390, 736, and 1280 pixels.
- No horizontal page overflow at the tested widths.
- Only the selected program's CTA remained in keyboard navigation.
- Keyboard selection and the demo destination link worked.
- Canvas pixels changed during animation and remained unchanged after pausing.
- Reduced-motion mode disabled the animation control and kept the canvas still.
- No browser JavaScript errors occurred in the interaction test.

These checks cover the supplied standalone demo. The existing Lovable project's styles, original photos, routes, and build have not been changed or tested. The setup instructions include final integration checks for that project.

Validation was performed in the standalone demo before adding the unchanged component source to this library. This folder contains reusable source and integration instructions; it is not a standalone npm project.
