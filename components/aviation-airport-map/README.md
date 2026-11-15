# STEM Aviation airport map — OpenStreetMap edition

Real OpenStreetMap streets, coastline, and labels, with zoom levels 2–19. The simplified embedded geography and approximate labels have been removed. Smooth constant-speed aircraft animation, interactive airport selection, mobile layout, and reduced-motion support remain.

Locations: KCRQ McClellan–Palomar and KMYF Montgomery–Gibbs Executive. The aircraft and connection are illustrative, not a real flight route or live aircraft feed.

## Import into Lovable

Copy these THREE files to src/components/airport-map/:

- AirportMap.jsx
- airport-map-engine.js
- airport-map.css

Install leaflet@1.9.4. Render:

```jsx
import AirportMap from '@/components/airport-map/AirportMap';
<AirportMap />
```

Do not replace your existing package.json with the demo package.json. If updating the previous revision, region-data.js and urban-data.js are no longer needed. The heading in main.jsx is demo-only.

### Prompt for Lovable

Integrate the three supplied airport-map files into src/components/airport-map/. Install leaflet@1.9.4. Replace the existing location map with <AirportMap />. Use the real OpenStreetMap tile layer exactly as configured; remove the earlier region-data.js and urban-data.js imports and any simplified map polygons. Preserve smooth constant-speed aircraft animation, KCRQ and KMYF markers, directions, selection, mobile layout, Pause motion, and reduced-motion support. Allow worldwide zoom-out and street-level zoom-in. Preserve OpenStreetMap attribution and HTTP Referer. If a Content Security Policy exists, allow https://tile.openstreetmap.org in img-src. Test tile loading on the actual hosted Lovable URL and at multiple zoom levels. Keep the surrounding page unchanged. Do not replace the project's package.json.

## Preview and deployment

airport-map-preview.html contains the component engine and styles. It loads Leaflet from jsDelivr and live tiles from OpenStreetMap. A restricted ChatGPT HTML preview may block tile requests. A local file may also omit the HTTP Referer that OSM requires. Test on a hosted HTTPS page such as your Lovable preview URL. Do not treat a blank embedded ChatGPT map as a successful test.

If tiles are missing on the hosted site, inspect the browser Network panel for blocked tile.openstreetmap.org requests, Content Security Policy errors, or provider HTTP errors. Ensure the page sends a Referer; use strict-origin-when-cross-origin rather than no-referrer. This component does not bypass host sandbox restrictions.

The map does not require a key or billing account. Public OSM tiles are a best-effort service subject to https://operations.osmfoundation.org/policies/tiles/. Attribution remains visible. No bulk downloading, offline caching, or prefetch feature is included. For high traffic switch to a suitable tile provider with tileUrl and attribution props.

## Optional airport photos

```jsx
const photos = {KCRQ:'/images/palomar.jpg',KMYF:'/images/montgomery.jpg'};
<AirportMap photos={photos} />
```

Define photos outside the parent component or memoize it. Use approved photos of the actual airports. Failed images fall back to runway illustrations.

Directions point to airport reference coordinates, not a confirmed meeting entrance. Adjust those destinations if necessary. The wheel does not hijack page scrolling; use zoom controls or touch gestures.

## Development

npm install; npm run dev; npm run build. Run node make-preview.mjs after edits to regenerate the standalone preview. Then run node validate.mjs.

References: https://leafletjs.com/reference-1.9.4.html ; https://www.sandiego.gov/airports/montgomery ; https://www.sandiegocounty.gov/content/sdc/dpw/airports/palomar.html . Airport coordinates were cross-checked against SkyVector KMYF and KCRQ.

## Fetch directly from GitHub

In Lovable Build mode, download the component files from this branch:

```sh
mkdir -p src/components/airport-map
BASE="https://raw.githubusercontent.com/dam1rgt3/dgx-components/main/components/aviation-airport-map"
for FILE in AirportMap.jsx airport-map-engine.js airport-map.css; do
  curl --fail --location "$BASE/$FILE" --output "src/components/airport-map/$FILE"
done
npm install leaflet@1.9.4
```

Import only the three component files from this folder. The other files provide the standalone preview, demo application, and validation.
