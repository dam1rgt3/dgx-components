import {readFile,writeFile} from 'node:fs/promises';
const read=name=>readFile(new URL(name,import.meta.url),'utf8');
const component=(await read('SchoolsMap.jsx')).replace(/^import .*;\r?\n/gm,'').replace('export default function','function');
const utils=(await read('schools-map-utils.js')).replaceAll('export ','');
const match=(await read('geocode-schools.mjs')).split('export function acceptMatch')[1].split('export async function geocode')[0];
const css=await read('schools-map.css');
const schools=await read('schools.json');
const html=`<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>STEM Schools Map Preview</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css">
<style>body{margin:0;padding:32px;background:#f4f2ed;color:#18364b;font-family:Arial,sans-serif}main{max-width:1320px;margin:auto}h1{font-size:32px;font-weight:500;margin:0 0 12px}header p{line-height:1.6;max-width:850px}#status{min-height:24px;font-size:14px}button{font:inherit}#download{padding:10px 16px;margin:0 0 16px;border:1px solid #b9c7ca;background:#fffdf9;color:#18364b;cursor:pointer}@media(max-width:600px){body{padding:16px}h1{font-size:26px}}${css}</style></head>
<body><main><header><h1>Schools with STEM aviation</h1><p>Explore the directory. Hover over a school marker for its name, or select a school for its address and directions.</p><p id="status" role="status">Loading preview dependencies...</p><button id="download" type="button" hidden>Download located school data</button></header><div id="root"></div><p style="font-size:13px;line-height:1.6">Preview: 19 published starter entries. The current website may list more schools. Address matches are street-range estimates and need review before publishing.</p></main>
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.26.9/babel.min.js"></script>
<script type="text/babel" data-presets="react">
const {useEffect,useId,useMemo,useRef,useState}=React;
${utils}
function acceptMatch${match}
${component}
const initialSchools=${schools};
function lookup(school,index){return new Promise((resolve,reject)=>{
  const callback='stemGeocode'+index,script=document.createElement('script');
  const cleanup=()=>{clearTimeout(timer);script.remove();window[callback]=()=>{};};
  const timer=setTimeout(()=>{cleanup();reject(new Error('Timed out'));},12000);
  window[callback]=data=>{cleanup();resolve(acceptMatch(school,data.result?.addressMatches));};
  script.onerror=()=>{cleanup();reject(new Error('Service unavailable'));};
  const params=new URLSearchParams({address:school.geocodeAddress||school.address,benchmark:'Public_AR_Current',format:'jsonp',callback});
  script.src='https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?'+params;
  document.head.appendChild(script);
});}
function Preview(){
 const [schools,setSchools]=useState(initialSchools);
 useEffect(()=>{let cancelled=false;
  (async()=>{
   let cache=[];try{cache=JSON.parse(localStorage.getItem('stem-schools-preview-v1')||'[]');}catch{}
   const located=[];let consecutiveFailures=0;
   for(let i=0;i<initialSchools.length;i++){
    if(cancelled)return;
    const school=initialSchools[i];
    document.getElementById('status').textContent='Locating school '+(i+1)+' of '+initialSchools.length+': '+school.name;
    const saved=cache.find(s=>s.id===school.id&&s.address===school.address&&hasCoordinates(s));
    let match=saved||null;
    if(!match&&consecutiveFailures<3){try{match=await lookup(school,i);consecutiveFailures=0;}catch{consecutiveFailures++;}}
    if(cancelled)return;
    located.push({...school,...(match||{})});
   }
   setSchools(located);
   const count=located.filter(hasCoordinates).length;
   document.getElementById('status').textContent=count+' of '+located.length+' schools located.'+(count<located.length?' Unmatched schools remain in the directory.':' Hover over the pins or choose a school.');
   try{localStorage.setItem('stem-schools-preview-v1',JSON.stringify(located));}catch{}
   const download=document.getElementById('download');download.hidden=count===0;
   download.onclick=()=>{const blob=new Blob([JSON.stringify(located,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='schools.geocoded.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  })();return()=>{cancelled=true;};
 },[]);
 return <SchoolsMap schools={schools}/>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<Preview/>);
</script></body></html>`;
await writeFile(new URL('preview.html',import.meta.url),html);
console.log('Generated standalone preview from the actual React component.');
