import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {AIRPORTS,routeAt,routeHeading,timeToRoute} from './airport-map-engine.js';
assert.deepEqual(AIRPORTS.map(a=>a.code),['KCRQ','KMYF']);
assert.deepEqual(routeAt(0),[AIRPORTS[0].lat,AIRPORTS[0].lng]);
assert.deepEqual(routeAt(1),[AIRPORTS[1].lat,AIRPORTS[1].lng]);
for(let i=0;i<=100;i++){const [lat,lng]=routeAt(i/100);assert.ok(Number.isFinite(lat)&&Number.isFinite(lng));assert.ok(lat>=32.8&&lat<=33.14&&lng>=-117.5&&lng<=-117.13);}
const html=fs.readFileSync('airport-map-preview.html','utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
assert.equal(scripts.length,1);new vm.Script(scripts[0]);
assert.ok(html.includes("options.tileUrl || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'"));
assert.ok(html.includes('minZoom:2,maxZoom:19'));
assert.ok(html.includes('https://www.openstreetmap.org/copyright'));
assert.ok(html.includes("referrerPolicy:'strict-origin-when-cross-origin'"));
assert.ok(!html.includes('L.geoJSON'));
assert.ok(!html.includes('const REGION ='));
let previous=routeHeading(0);const speeds=[];
const project=([lat,lng])=>[lng*Math.PI/180,Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))];
for(let i=1;i<=1000;i++){
  const t=timeToRoute(i/1000),heading=routeHeading(t);
  const delta=Math.abs(((heading-previous+540)%360)-180);assert.ok(delta<1,`Heading jumped ${delta}`);previous=heading;
  const a=project(routeAt(timeToRoute((i-1)/1000))),b=project(routeAt(t));speeds.push(Math.hypot(b[0]-a[0],b[1]-a[1]));
}
assert.ok(Math.max(...speeds)/Math.min(...speeds)<1.002,'Speed varies by over 0.2%');
assert.ok(html.includes('prefers-reduced-motion'));
assert.ok(html.includes('map.remove()'));
console.log('PASS: real OSM tile configuration, worldwide zoom range, attribution and referrer policy, removal of simplified map, airport identities, route endpoints, continuous headings, constant speed and standalone syntax.');
console.log('Browser rendering and npm build still require installed dependencies.');
