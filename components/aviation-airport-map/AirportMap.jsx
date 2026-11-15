import React, {useEffect, useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './airport-map.css';
import {mountAirportMap} from './airport-map-engine.js';
export default function AirportMap({className = '', photos, tileUrl, attribution}) {
  const host = useRef(null);
  useEffect(() => {
    if (!host.current) return;
    return mountAirportMap(host.current, L, {photos, tileUrl, attribution});
  }, [photos, tileUrl, attribution]);
  return <section className={`stem-airport-map ${className}`} ref={host} aria-label="STEM Aviation airport locations" />;
}
