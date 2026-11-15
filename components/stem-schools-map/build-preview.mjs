import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const read=name=>readFile(new URL(name,import.meta.url),'utf8');
const component=(await read('SchoolsMap.jsx')).replace(/^import .*;\r?\n/gm,'').replace('export default function','function');
const utils=(await read('schools-map-utils.js')).replaceAll('export ','');
const css=await read('schools-map.css'),schools=await read('schools.json');
const source=`const {useEffect,useId,useMemo,useRef,useState}=React;\nconst defaultSchools=${schools};\n${utils}\n${component}\nReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><SchoolsMap/></React.StrictMode>);document.getElementById('status').hidden=true;`;
let compiled;
if(process.argv[2]){
  // Optional existing Playwright Babel bundle for restricted/offline builds.
  compiled=require(process.argv[2]).babelTransform(source,'preview.jsx',false,[],[]).code;
  compiled=compiled.replace(/require\([^\n]*jsx-runtime[^\n]*\)/g,'previewJSXRuntime');
}else{
  compiled=require('@babel/core').transformSync(source,{plugins:[['@babel/plugin-transform-react-jsx',{runtime:'classic'}]],configFile:false,babelrc:false}).code;
}
const html=`<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="strict-origin-when-cross-origin"><title>STEM Schools Map Preview</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet.markercluster@1.5.3/dist/MarkerCluster.css">
<style>body{margin:0;padding:32px;background:#f4f2ed;color:#18364b;font-family:Arial,sans-serif}main{max-width:1320px;margin:auto}h1{font-size:32px;font-weight:500;margin:0 0 12px}header p{line-height:1.6;margin-bottom:26px}#status{font-size:14px;padding:14px 0}@media(max-width:600px){body{padding:16px}h1{font-size:26px}}${css}</style></head>
<body><main><header><h1>Schools with STEM aviation</h1><p>Explore 19 participating schools. Hover over a marker for its name, or select a school for its address and directions.</p></header><div id="status" role="status">Loading the map...</div><div id="root"></div></main>
<script>
function showError(message){const status=document.getElementById('status');status.hidden=false;status.textContent='Preview error: '+message;}
window.addEventListener('error',e=>showError(e.message||'A preview resource failed to load.'));
async function loadLibrary(path){
 for(const base of ['https://cdn.jsdelivr.net/npm/','https://unpkg.com/']){
  try{await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=base+path;s.onload=resolve;s.onerror=()=>{s.remove();reject(new Error('Failed to load '+path));};document.head.appendChild(s);});return;}catch{}
 }
 throw new Error('Could not load '+path+' from either CDN.');
}
(async()=>{
 try{
 await loadLibrary('react@18.3.1/umd/react.production.min.js');
 await loadLibrary('react-dom@18.3.1/umd/react-dom.production.min.js');
 await loadLibrary('leaflet@1.9.4/dist/leaflet.js');
 await loadLibrary('leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js');
 const previewJSXRuntime={jsx:(type,props,key)=>React.createElement(type,{...props,key}),jsxs:(type,props,key)=>React.createElement(type,{...props,key}),Fragment:React.Fragment};
 ${compiled}
 }catch(error){showError(error.message);}
})();
</script></body></html>`;
await writeFile(new URL('preview.html',import.meta.url),html);
console.log('Compiled preview: no browser Babel dependency; sequential library loading with CDN fallback.');
