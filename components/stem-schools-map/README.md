# STEM aviation school directory map

React 18+ component for `/resources/schools-with-stem-aviation`. Real OpenStreetMap tiles, Leaflet, clustered school markers, hover/focus names, click/tap address popups, directions and website links, and a searchable synchronized directory. Responsive layout, visible map attribution, reduced-motion support, keyboard controls, and a directory fallback if tiles fail.

## Important data status

The supplied `schools.json` contains 19 published entries from https://stemaviation.org/resources/schools-with-stem-aviation/ accessed November 15, 2026. It is a STARTER dataset, not a claim that the newer page has only 19 schools. The supplied screenshot has additional northern California pins. The newer host was inaccessible to the development web reader. School coordinates are deliberately absent until geocoded and reviewed. Do not deploy this starter file as a completed map or remove existing schools from the Lovable page.

## Lovable import prompt

Copy the following into Lovable Build mode:

> Import the component from https://github.com/dam1rgt3/dgx-components/tree/main/components/stem-schools-map into our existing schools-with-stem-aviation page. Fetch its README and source through raw.githubusercontent.com. Install leaflet@1.9.4 and leaflet.markercluster@1.5.3. Preserve the existing page typography, headings and content; replace only the static map with SchoolsMap. First extract ALL existing schools and addresses from this page's source/data, including northern California locations; do not substitute the incomplete 19-entry starter list for our full list. Assign stable unique IDs. Reuse existing accurate coordinates where available; otherwise run the included geocode-schools.mjs on the complete dataset in the build environment. Review every unmatched address and verify each matched location against its school address. Never use city-center coordinates or omit unresolved schools. Feed the resulting static JSON into the component. Ensure hover/focus shows school names, clicking/tapping shows address and directions, nearby pins cluster, clicking a directory item reveals its marker, search works by school/city/ZIP, and mobile and keyboard interaction work. Run the app build and browser checks, confirm every school has a marker, and show me the preview. Do not change our airport-map component.

## Files to import

Raw URL prefix: `https://raw.githubusercontent.com/dam1rgt3/dgx-components/main/components/stem-schools-map/`

- `SchoolsMap.jsx`
- `schools-map-utils.js`
- `schools-map.css`
- Your complete school dataset (use `schools.json` only as a supplemental source)
- `geocode-schools.mjs` for build-time address lookup

Install dependencies into the existing app. Do not replace the app's package.json with this folder's package.json.

```sh
npm install leaflet@1.9.4 leaflet.markercluster@1.5.3
node geocode-schools.mjs schools.complete.json schools.geocoded.json
```

```jsx
import SchoolsMap from './SchoolsMap.jsx';
import schools from './schools.geocoded.json';

export default function SchoolDirectory() {
  return <SchoolsMap schools={schools} />;
}
```

Use a client-only import if integrating into an SSR framework; Leaflet requires the browser DOM. Lovable's React/Vite apps can import directly.

## Data contract

```json
{
  "id": "stable-unique-school-id",
  "name": "School name",
  "address": "Full street address, City, CA ZIP",
  "city": "City",
  "website": "https://school.example",
  "lat": 0,
  "lng": 0
}
```

The zeros above illustrate numeric types only: replace them with actual school coordinates. Never use placeholders on the live map. Optional `geocodeAddress` can remove a floor/suite or normalize a street format while retaining the original display address. Each entry needs a unique ID; duplicate IDs are collapsed. Coordinates must be numbers, not strings. Missing coordinates remain visible in the directory with a pending label; they do not generate fabricated pins.

## Geocoding and accuracy

The script uses the keyless US Census onelineaddress service, sequentially, during preparation rather than on page visits. It caches same-address coordinates in its output file. Only a single match with matching street number, California state and ZIP is accepted; unmatched or ambiguous records remain in the output and cause exit code 2. Review these records, check the school's official address and supply a verified coordinate or corrected `geocodeAddress`, then rerun. Clear a cached coordinate if the source address is corrected. The service estimates street-address positions along road segments, so its output is not a verified building entrance. Visually check all positions before deployment.

Reference: https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html

## Map hosting

OpenStreetMap raster tiles require no API key. Keep visible attribution, browser caching and the referrer header. Do not bulk-download/prefetch tiles or use them for offline maps. The public service is best-effort; for substantial traffic choose a suitable hosted OSM tile provider and change the tile URL and attribution. See https://operations.osmfoundation.org/policies/tiles/ . If a CSP is present, allow images from https://tile.openstreetmap.org and the appropriate external map links. No student information is collected by this component.

## Validation

`node --test schools-map.test.mjs` passes four tests covering coordinate validation, search/deduplication, unsafe website URLs, and rejection of ambiguous/mismatched geocoding. React/browser rendering, live tiles and live geocoding could not be exercised in the network-restricted development environment. The complete current-page school list also needs verification in Lovable before publishing.

Before release: run the production build; verify every dataset row maps to a unique marker; inspect all locations; test clustered pins, rapid school selection, hover/focus, Enter/Space, mobile taps, search/no-results, reduced motion, resize, and tile failure. The component supports these interactions; the consuming app must validate its final integration.
