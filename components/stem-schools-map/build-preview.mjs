import {readFile,writeFile} from 'node:fs/promises';
const read=name=>readFile(new URL(name,import.meta.url),'utf8');
const component=(await read('SchoolsMap.jsx')).replace(/^import .*;\r?\n/gm,'').replace('export default function','function');
const utils=(await read('schools-map-utils.js')).replaceAll('export ','');
const css=await read('schools-map.css'),schools=await read('schools.json');
const html=`<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="referrer" content="strict-origin-when-cross-origin"><title>STEM Schools Map Preview</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css">
<style>body{margin:0;padding:32px;background:#f4f2ed;color:#18364b;font-family:Arial,sans-serif}main{max-width:1320px;margin:auto}h1{font-size:32px;font-weight:500;margin:0 0 12px}header p{line-height:1.6;max-width:850px;margin-bottom:26px}#status{min-height:24px;font-size:14px}button{font:inherit}@media(max-width:600px){body{padding:16px}h1{font-size:26px}}${css}</style></head>
<body><main><header><h1>Schools with STEM aviation</h1><p>Explore 19 participating schools. Hover over a marker for its name, or select a school for its address and directions.</p></header><div id="status" role="status">Loading the map...</div><div id="root"></div></main>
<script>window.addEventListener('error',function(e){document.getElementById('status').textContent='The preview could not load. Please refresh or open preview.html in a browser with internet access.';});</script>
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.26.9/babel.min.js"></script>
<script type="text/babel" data-presets="react">
const {useEffect,useId,useMemo,useRef,useState}=React;
const defaultSchools=${schools};
${utils}
${component}
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><SchoolsMap/></React.StrictMode>);
document.getElementById('status').hidden=true;
</script></body></html>`;
await writeFile(new URL('preview.html',import.meta.url),html);
console.log('Generated preview using actual React component and 19 static school locations.');
