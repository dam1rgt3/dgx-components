# STEM aviation school map

Interactive React component with all 19 participating schools confirmed in the user's screenshot. Locations are included in `schools.json`: no live geocoding, API key, or address-lookup delay is required.

[Open preview](https://raw.githack.com/dam1rgt3/dgx-components/main/components/stem-schools-map/preview.html)

If the third-party preview service fails, download `preview.html` and open it in your browser. The preview renders the actual React component, with its actual dataset and CSS. Internet access is required for the pinned CDN libraries and OpenStreetMap tiles.

## Lovable import prompt

> Import https://github.com/dam1rgt3/dgx-components/tree/main/components/stem-schools-map into `/resources/schools-with-stem-aviation`. Read the README, fetch SchoolsMap.jsx, schools-map-utils.js, schools-map.css and schools.json from raw.githubusercontent.com, and install leaflet@1.9.4 plus leaflet.markercluster@1.5.3. Replace the static map with `<SchoolsMap />`. All 19 schools and their coordinates are already included; do not run browser geocoding. Preserve the surrounding page, existing school listings, typography and airport component. Test hover/focus names, click/tap details, directory selection, clustering, search, keyboard navigation, and mobile layout. Build the app and show the preview. Read the SEEO address note before changing any school address.

Raw file prefix: `https://raw.githubusercontent.com/dam1rgt3/dgx-components/main/components/stem-schools-map/`

```sh
npm install leaflet@1.9.4 leaflet.markercluster@1.5.3
```

```jsx
import SchoolsMap from './SchoolsMap.jsx';

export default function SchoolDirectory() {
  return <SchoolsMap />;
}
```

Optionally supply `<SchoolsMap schools={yourSchools} />`. Do not replace the application's package.json with this demo's package.json. For SSR frameworks, load the component on the client only. React/Vite applications can import it directly.

## Features

- Real pannable, zoomable OpenStreetMap with nearby markers grouped into clusters.
- Hover or keyboard focus shows the school name; click/tap shows the address, telephone, website, and directions.
- Search by school, city, or ZIP; selecting a result reveals its marker.
- Responsive layout and reduced-motion support. Scroll-wheel zoom is disabled to avoid hijacking page scrolling; use the zoom controls or touch gestures.
- Missing locations stay in the directory; no invented default coordinates.
- Safe text rendering in map popups and validation of external website protocols.

## School data and coordinate sources

The 19 names, display addresses and phone numbers follow the screenshot supplied by the user. Their underlying published directory is https://stemaviation.org/resources/schools-with-stem-aviation/ . The earlier description of this list as incomplete was incorrect and has been removed.

Each entry has a `coordinateSource` URL and `coordinateAccuracy` description. Coordinates are sourced campus/address positions, not surveyed building entrances. Sources include municipal/state records, OpenStreetMap-derived listings, school-linked maps, and public school/location directories. Directions use the supplied street address, not an assumed entrance coordinate.

### Address discrepancy to review

SEEO is plotted at the supplied **1444 E Holt Ave** address, using the City of Pomona ADA plan's published coordinate. The current California Department of Education listing instead gives **2211 North Orange Grove Ave**: https://sd.cde.ca.gov/schooldirectory/details?cdscode=19649070115170 . The displayed address has intentionally not been changed. Confirm with STEM before updating it.

Foothills Christian High School uses a published approximate coordinate for the same 2321 Dryden Rd street address. It is suitable as an address-area pin; do not represent it as a surveyed entrance.

## Updating the data

Each entry requires a stable unique `id`, `name`, `address`, numeric `lat` and `lng`. Optional fields: `city`, `website`, `phone`, `coordinateSource`, `coordinateAccuracy`, and an internal `locationNote`. Internal provenance notes are not shown to visitors. Keep source notes with the data when editing.

The optional `geocode-schools.mjs` script is retained for future additions. Run it only during preparation, not on page visits. Existing coordinates are preserved. Unresolved new addresses remain in the output and cause exit code 2; check those addresses before publishing. It uses US Census street-range estimates: https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html . It is not required for the included dataset.

## Tile service

Keep OpenStreetMap attribution visible and retain normal caching/referrer behavior. Do not prefetch, bulk-download, or build offline tile caches from the public service. For substantial production traffic select a suitable hosted OSM provider and change the tile URL and attribution. Policy: https://operations.osmfoundation.org/policies/tiles/ .

## Validation

Run `node --test schools-map.test.mjs` for data/utility/geocoding validation and `npm install` then `node build-preview.mjs` to regenerate the preview from source. The 19 locations, unique IDs, California coordinate bounds, source URLs, search, URL safety and geocoding rejection paths are covered by tests. The React source and generated preview script were compiled with Babel to catch JSX syntax errors.

A headless browser check was attempted but the local browser could not launch under the execution sandbox (access denied). Therefore live tile loading, appearance and interactive browser behavior still need confirmation in Lovable or the linked preview. No successful browser test is claimed.
