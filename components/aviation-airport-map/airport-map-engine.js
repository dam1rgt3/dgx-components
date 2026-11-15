export const AIRPORTS = [
  {code:'KCRQ',name:'McClellan–Palomar',suffix:'Airport',city:'Carlsbad',lat:33.1283,lng:-117.2800,description:'Explore aviation on the North County flightline.'},
  {code:'KMYF',name:'Montgomery–Gibbs',suffix:'Executive Airport',city:'San Diego',lat:32.8157,lng:-117.1396,description:'Get closer to general aviation in the heart of San Diego.'}
];
const plane = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2c-1.1 0-1.8 1.8-1.8 3.4v7.1L3 19v3l11.2-3.4v6.8L10 28v2l6-1.5 6 1.5v-2l-4.2-2.6v-6.8L29 22v-3l-11.2-6.5V5.4C17.8 3.8 17.1 2 16 2Z" fill="currentColor"/></svg>';
const runway = '<svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="31" fill="none" stroke="currentColor" opacity=".2"/><g transform="rotate(24 36 36)"><rect x="27" y="10" width="18" height="52" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M36 14v5m0 5v5m0 5v5m0 5v5m0 5v4M30 13v5m12-5v5M30 54v5m12-5v5" stroke="currentColor" stroke-width="1.5"/></g></svg>';
export function routeAt(t) {
  const a=AIRPORTS[0], b=AIRPORTS[1], c={lat:33.01,lng:-117.49};
  return [(1-t)**2*a.lat+2*(1-t)*t*c.lat+t*t*b.lat,(1-t)**2*a.lng+2*(1-t)*t*c.lng+t*t*b.lng];
}
// Mercator tangent is continuous; never derive heading from rounded display pixels.
export function routeHeading(t){
  const a=AIRPORTS[0],b=AIRPORTS[1],c={lat:33.01,lng:-117.49};
  const dlat=2*(1-t)*(c.lat-a.lat)+2*t*(b.lat-c.lat);
  const dlng=2*(1-t)*(c.lng-a.lng)+2*t*(b.lng-c.lng);
  return Math.atan2(dlng,dlat/Math.cos(routeAt(t)[0]*Math.PI/180))*180/Math.PI;
}
const routeTable=(()=>{
  const mercator=([lat,lng])=>[lng*Math.PI/180,Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))];
  const points=[{t:0,d:0}];let prev=mercator(routeAt(0)),distance=0;
  for(let i=1;i<=1000;i++){const current=mercator(routeAt(i/1000));distance+=Math.hypot(current[0]-prev[0],current[1]-prev[1]);points.push({t:i/1000,d:distance});prev=current;}
  return points.map(p=>({...p,d:p.d/distance}));
})();
export function timeToRoute(progress){
  const u=Math.max(0,Math.min(1,progress));let lo=0,hi=routeTable.length-1;
  while(hi-lo>1){const mid=(lo+hi)>>1;if(routeTable[mid].d<u)lo=mid;else hi=mid;}
  const a=routeTable[lo],b=routeTable[hi];return a.t+(b.t-a.t)*(u-a.d)/(b.d-a.d);
}
export function mountAirportMap(root, L, options = {}) {
  root.innerHTML = `<div class="sam-layout"><aside class="sam-panel"><div class="sam-panel-top"><span>San Diego County</span><span class="sam-count">02 airports</span></div><div class="sam-detail" aria-live="polite" aria-atomic="true"><div class="sam-code"></div><h2 class="sam-name"></h2><p class="sam-city"></p><p class="sam-description"></p><a class="sam-directions" target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true">↗</span></a></div><div class="sam-locations" role="group" aria-label="Select airport"></div><p class="sam-note">Select an airport to explore.</p></aside><div class="sam-map-wrap"><div class="sam-map" aria-label="Interactive map of Carlsbad and San Diego airports"></div><div class="sam-controls"><button type="button" class="sam-overview" title="Show both airports">Overview <span aria-hidden="true">↗</span></button><button type="button" class="sam-motion" aria-pressed="false">Pause motion</button></div><div class="sam-compass" aria-hidden="true"><span>N</span><i></i></div><div class="sam-caption"><span class="sam-caption-line"></span>Illustrative connection · not a flight route</div><div class="sam-error" role="status" hidden>Map tiles could not load. Airport details and directions are still available.</div></div></div>`;
  const q=s=>root.querySelector(s), media=window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused=media.matches, disposed=false, raf=0, elapsed=1500, last=0;
  const container=q('.sam-map');
  const map=L.map(container,{zoomControl:false,scrollWheelZoom:false,zoomSnap:.25,attributionControl:true,minZoom:2,maxZoom:19,worldCopyJump:true});
  map.attributionControl.setPrefix(false);
  L.control.zoom({position:'bottomright'}).addTo(map);
  // Real OpenStreetMap basemap. Keep provider attribution and Referer intact.
  const tiles=L.tileLayer(options.tileUrl || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:options.attribution || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom:2,maxZoom:19,referrerPolicy:'strict-origin-when-cross-origin',updateWhenIdle:true,keepBuffer:2
  });
  let tileSuccesses=0,tileFailures=0;
  const error=q('.sam-error');
  error.textContent='OpenStreetMap could not load in this preview. Open the component on your hosted Lovable site and allow images from tile.openstreetmap.org.';
  tiles.on('loading',()=>{tileSuccesses=0;tileFailures=0;});
  tiles.on('tileload',()=>{tileSuccesses++;error.hidden=true;});
  tiles.on('tileerror',()=>{tileFailures++;if(tileFailures>=3&&!tileSuccesses)error.hidden=false;});
  tiles.on('load',()=>{error.hidden=!(tileFailures>0&&tileSuccesses===0);});
  tiles.addTo(map);
  const bounds=L.latLngBounds(AIRPORTS.map(a=>[a.lat,a.lng]));
  function overview(animate=true){map.fitBounds(bounds,{paddingTopLeft:[70,80],paddingBottomRight:[90,105],animate:animate&&!media.matches,maxZoom:11});}
  overview(false);
  const route=Array.from({length:101},(_,i)=>routeAt(i/100));
  L.polyline(route,{color:'#fffdf6',weight:7,opacity:.95,interactive:false}).addTo(map);
  L.polyline(route,{color:'#b0792b',weight:2,opacity:.9,dashArray:'5 9',className:'sam-route',interactive:false}).addTo(map);
  const markers=AIRPORTS.map((airport,i)=>{
    const icon=L.divIcon({className:'sam-marker-container',iconSize:[76,76],iconAnchor:[38,38],html:`<span class="sam-marker"><span class="sam-pulse"></span><span class="sam-marker-face">${runway}</span><span class="sam-marker-code">${airport.code}</span></span>`});
    const marker=L.marker([airport.lat,airport.lng],{icon,title:`${airport.name} ${airport.suffix}`,alt:`Select ${airport.name} airport`,keyboard:true,riseOnHover:true}).addTo(map);
    const element=marker.getElement();element.setAttribute('role','button');
    element.addEventListener('keydown',event=>{if(event.key===' '){event.preventDefault();select(i,true);}});
    marker.on('click',()=>select(i,true));
    const photo=options.photos?.[airport.code];
    if(photo){const image=document.createElement('img');image.src=photo;image.alt='';image.loading='lazy';image.onerror=()=>image.remove();element.querySelector('.sam-marker-face').append(image);}
    const button=document.createElement('button');button.type='button';button.className='sam-location';
    button.innerHTML=`<span class="sam-location-dot"></span><span><strong>${airport.city}</strong><small>${airport.name}</small></span><span class="sam-location-code">${airport.code}</span>`;
    button.addEventListener('click',()=>select(i,true));q('.sam-locations').append(button);return marker;
  });
  const SmoothMarker=L.Marker.extend({update(){if(this._icon&&this._map){this._setPos(this._map.project(this._latlng,this._map.getZoom()).subtract(this._map.getPixelOrigin()));}return this;}});
  const aircraft=new SmoothMarker(routeAt(0),{icon:L.divIcon({className:'sam-aircraft',html:`<div class="sam-aircraft-heading">${plane}</div>`,iconSize:[30,30],iconAnchor:[15,15]}),interactive:false,keyboard:false,zIndexOffset:500}).addTo(map);
  aircraft.getElement().setAttribute('aria-hidden','true');
  function select(i,pan){
    const a=AIRPORTS[i];q('.sam-code').textContent=a.code;
    q('.sam-name').replaceChildren(document.createTextNode(a.name),document.createElement('br'));
    const suffix=document.createElement('span');suffix.textContent=a.suffix;q('.sam-name').append(suffix);
    q('.sam-city').textContent=`${a.city}, California`;q('.sam-description').textContent=a.description;
    q('.sam-directions').href=`https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}`;
    root.querySelectorAll('.sam-location').forEach((button,j)=>button.setAttribute('aria-pressed',String(i===j)));
    markers.forEach((marker,j)=>{marker.getElement().classList.toggle('is-active',i===j);marker.getElement().setAttribute('aria-pressed',String(i===j));});
    if(pan)map.panTo([a.lat,a.lng],{animate:!media.matches,duration:.8});
  }
  select(0,false);
  function motionState(){root.classList.toggle('sam-paused',paused||media.matches);q('.sam-motion').textContent=paused?'Play motion':'Pause motion';q('.sam-motion').setAttribute('aria-pressed',String(paused));}
  function frame(now){
    if(disposed)return;if(last&&!paused&&!document.hidden)elapsed+=Math.min(now-last,64);last=now;
    const progress=(elapsed%22000)/22000,t=timeToRoute(progress);aircraft.setLatLng(routeAt(t));
    aircraft.getElement().querySelector('.sam-aircraft-heading').style.transform=`rotate(${routeHeading(t)}deg)`;
    aircraft.getElement().style.opacity=String(Math.min(1,progress/.035,(1-progress)/.035));
    raf=requestAnimationFrame(frame);
  }
  const preference=()=>{paused=media.matches;motionState();};
  q('.sam-motion').addEventListener('click',()=>{paused=!paused;motionState();});
  q('.sam-overview').addEventListener('click',()=>overview());media.addEventListener('change',preference);
  motionState();raf=requestAnimationFrame(frame);
  let resizeFrame=0;const resize=new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{if(!disposed){map.invalidateSize({pan:false});overview(false);}});});resize.observe(container);
  return ()=>{disposed=true;cancelAnimationFrame(raf);cancelAnimationFrame(resizeFrame);resize.disconnect();media.removeEventListener('change',preference);map.remove();root.replaceChildren();};
}
