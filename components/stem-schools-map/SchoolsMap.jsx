import React, {useEffect, useId, useMemo, useRef, useState} from 'react';
import L from 'leaflet';
import defaultSchools from './schools.json';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import './schools-map.css';
import {hasCoordinates, normalizeSchools, filterSchools, safeWebsite} from './schools-map-utils.js';

/** Pass the complete existing page dataset, enriched with verified lat/lng values. */
export default function SchoolsMap({schools = defaultSchools, className = ''}) {
  const records=useMemo(()=>normalizeSchools(schools),[schools]);
  const [query,setQuery]=useState('');
  const [active,setActive]=useState(null);
  const [mapError,setMapError]=useState(false);
  const searchId=useId(),canvas=useRef(null),instance=useRef(null),buttons=useRef(new Map());
  const visible=useMemo(()=>filterSchools(records,query),[records,query]);
  const visibleRef=useRef(visible);visibleRef.current=visible;
  const activeRef=useRef(active);activeRef.current=active;
  const selected=records.find(s=>s.id===active);
  const mapped=visible.filter(hasCoordinates);
  const motion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(()=>{
    const map=L.map(canvas.current,{scrollWheelZoom:false,zoomControl:false,minZoom:2,maxZoom:19,worldCopyJump:true});
    map.attributionControl.setPrefix(false);
    L.control.zoom({position:'bottomright'}).addTo(map);
    let good=0,bad=0;
    const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom:19,referrerPolicy:'strict-origin-when-cross-origin',updateWhenIdle:true
    });
    tiles.on('loading',()=>{good=0;bad=0;});
    tiles.on('tileload',()=>{good++;setMapError(false);});
    tiles.on('tileerror',()=>{bad++;if(bad>=3&&!good)setMapError(true);});
    tiles.on('load',()=>setMapError(bad>0&&good===0));
    tiles.addTo(map);
    const cluster=L.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:42,spiderfyOnMaxZoom:true,animate:!motion(),
      iconCreateFunction:group=>L.divIcon({html:`<span>${group.getChildCount()}</span>`,className:'ssm-cluster',iconSize:[44,44]})
    });
    map.addLayer(cluster);
    instance.current={map,cluster,markers:new Map()};
    map.setView([36.5,-119.5],6);
    let resizeFrame;
    const observer=new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>map.invalidateSize({pan:false}));});
    observer.observe(canvas.current);
    return()=>{observer.disconnect();cancelAnimationFrame(resizeFrame);instance.current=null;map.remove();};
  },[]);

  useEffect(()=>{
    const api=instance.current;if(!api)return;
    const {map,cluster,markers}=api;cluster.clearLayers();markers.clear();
    visible.filter(hasCoordinates).forEach(s=>{
      const marker=L.marker([s.lat,s.lng],{title:s.name,alt:s.name,keyboard:true,riseOnHover:true,icon:L.divIcon({className:'ssm-marker',iconSize:[34,34],iconAnchor:[17,17],html:'<span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m3 8 9-5 9 5-9 5-9-5Zm4 3v6c3 3 7 3 10 0v-6M21 8v8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></span>'})});
      const tip=document.createElement('span');tip.textContent=s.name;
      marker.bindTooltip(tip,{direction:'top',offset:[0,-17],className:'ssm-tooltip',opacity:1});
      const popup=document.createElement('div');popup.className='ssm-popup';
      const title=document.createElement('strong');title.textContent=s.name;popup.append(title);
      const address=document.createElement('p');address.textContent=s.address;popup.append(address);
      const links=document.createElement('div');links.className='ssm-popup-links';
      const directions=document.createElement('a');directions.textContent='Directions ↗';directions.href=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.address)}`;directions.target='_blank';directions.rel='noopener noreferrer';links.append(directions);
      const url=safeWebsite(s.website);if(url){const site=document.createElement('a');site.textContent='School website ↗';site.href=url;site.target='_blank';site.rel='noopener noreferrer';links.append(site);}
      if(s.phone){const phone=document.createElement('a');phone.textContent=s.phone;phone.href='tel:'+s.phone.replace(/[^+0-9]/g,'');links.append(phone);}popup.append(links);marker.bindPopup(popup,{maxWidth:300,autoPanPadding:[28,70],className:'ssm-school-popup'});
      marker.on('click',()=>{activeRef.current=s.id;setActive(s.id);buttons.current.get(s.id)?.scrollIntoView({block:'nearest',behavior:motion()?'instant':'smooth'});});
      marker.on('add',()=>{const el=marker.getElement();if(!el)return;el.classList.toggle('is-selected',s.id===activeRef.current);el.setAttribute('role','button');el.setAttribute('aria-label',`View ${s.name}`);el.setAttribute('aria-pressed',String(s.id===activeRef.current));el.onfocus=()=>marker.openTooltip();el.onblur=()=>marker.closeTooltip();el.onkeydown=e=>{if(e.key===' '){e.preventDefault();marker.fire('click');marker.openPopup();}};});
      markers.set(s.id,marker);cluster.addLayer(marker);
    });
    const coords=visible.filter(hasCoordinates).map(s=>[s.lat,s.lng]);
    if(coords.length)map.fitBounds(coords,{padding:[50,60],maxZoom:coords.length===1?14:11,animate:false});
    else map.setView([36.5,-119.5],6,{animate:false});
    if(active&&!visible.some(s=>s.id===active))setActive(null);
  },[visible]);

  useEffect(()=>{
    instance.current?.markers.forEach((m,id)=>{m.getElement()?.classList.toggle('is-selected',id===active);m.getElement()?.setAttribute('aria-pressed',String(id===active));});
  },[active]);

  function choose(s){
    activeRef.current=s.id;setActive(s.id);const api=instance.current,marker=api?.markers.get(s.id);if(!marker)return;
    const chosen=s.id;
    api.cluster.zoomToShowLayer(marker,()=>{if(instance.current===api&&activeRef.current===chosen&&visibleRef.current.some(item=>item.id===chosen)){marker.closeTooltip();marker.openPopup();}});
  }
  function highlight(s,on){const marker=instance.current?.markers.get(s.id);if(marker&&instance.current.cluster.hasLayer(marker)){if(on)marker.openTooltip();else marker.closeTooltip();}}
  function reset(){const api=instance.current;if(!api)return;const coords=visible.filter(hasCoordinates).map(s=>[s.lat,s.lng]);if(coords.length)api.map.fitBounds(coords,{padding:[50,60],maxZoom:coords.length===1?14:11,animate:!motion()});}

  return <section className={`stem-schools-map ${className}`} aria-label="Schools with STEM aviation">
    <aside className="ssm-directory">
      <div className="ssm-search"><label htmlFor={searchId}>Find a school</label><div className="ssm-search-input"><input id={searchId} type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="School, city, or ZIP code" autoComplete="off"/>{query&&<button type="button" onClick={()=>setQuery('')} aria-label="Clear search">×</button>}</div><p aria-live="polite">{visible.length} {visible.length===1?'entry':'entries'}{mapped.length!==visible.length?` · ${mapped.length} mapped`:''}</p></div>
      <ul className="ssm-results" aria-label="School directory">{visible.map(s=><li key={s.id}><button ref={node=>{if(node)buttons.current.set(s.id,node);else buttons.current.delete(s.id);}} type="button" className="ssm-school" aria-pressed={active===s.id} onClick={()=>choose(s)} onMouseEnter={()=>highlight(s,true)} onMouseLeave={()=>highlight(s,false)} onFocus={()=>highlight(s,true)} onBlur={()=>highlight(s,false)}><span className="ssm-school-dot"/><span><strong>{s.name}</strong><span>{s.city||s.address}</span>{!hasCoordinates(s)&&<small>Map location pending</small>}</span><span aria-hidden="true" className="ssm-school-arrow">+</span></button></li>)}</ul>
      {!visible.length&&<p className="ssm-empty">No schools match your search.</p>}
      {selected&&!hasCoordinates(selected)&&<div className="ssm-pending" aria-live="polite"><strong>{selected.name}</strong><p>{selected.address}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.name+' '+selected.address)}`} target="_blank" rel="noopener noreferrer">Find on Google Maps</a></div>}
      <div className="ssm-hint">Hover for a name. Select for details.</div>
    </aside>
    <div className="ssm-map-wrap"><div ref={canvas} className="ssm-map" aria-label="Interactive school locations map"/><button type="button" className="ssm-overview" onClick={reset} disabled={!mapped.length}>Show matching schools</button>
      {mapError&&<div className="ssm-map-error" role="status">The map could not load. You can still browse the school directory. Check your connection or open the hosted site.</div>}
      {!mapped.length&&visible.length>0&&<div className="ssm-map-error" role="status">School addresses are listed. Map locations are awaiting verification.</div>}
    </div>
  </section>;
}
