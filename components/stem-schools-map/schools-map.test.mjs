import test from 'node:test';
import assert from 'node:assert/strict';
import {hasCoordinates,normalizeSchools,filterSchools,safeWebsite} from './schools-map-utils.js';
import {acceptMatch} from './geocode-schools.mjs';
import {readFile} from 'node:fs/promises';
test('all 19 confirmed schools have distinct sourced California locations',async()=>{
  const schools=JSON.parse(await readFile(new URL('./schools.json',import.meta.url),'utf8'));
  assert.equal(schools.length,19);
  assert.equal(new Set(schools.map(s=>s.id)).size,19);
  assert.equal(new Set(schools.map(s=>`${s.lat},${s.lng}`)).size,19);
  for(const s of schools){assert.ok(hasCoordinates(s),s.name);assert.ok(s.lat>32&&s.lat<42&&s.lng>-125&&s.lng<-114,s.name);assert.ok(safeWebsite(s.coordinateSource),s.name);assert.ok(s.phone,s.name);}
  assert.match(schools.find(s=>s.id==='school-of-extended-educational-options').address,/1444 E Holt/);
});
test('missing and invalid coordinates never produce a marker',()=>{
  for(const s of [{},{lat:null,lng:null},{lat:'33',lng:-117},{lat:NaN,lng:0},{lat:91,lng:0}])assert.equal(hasCoordinates(s),false);
  assert.equal(hasCoordinates({lat:33,lng:-117}),true);
});
test('search includes addresses and preserves unmapped entries',()=>{
  const records=normalizeSchools([{id:'one',name:' Aviation School ',address:'123 Main, Carlsbad, CA 92008'},{id:'one',name:'Duplicate',address:'x'},null]);
  assert.equal(records.length,1);
  assert.equal(filterSchools(records,'CARLSBAD').length,1);
  assert.equal(filterSchools(records,'92008').length,1);
  assert.equal(filterSchools(records,'missing').length,0);
});
test('school URLs cannot execute scripts',()=>{
  assert.equal(safeWebsite('javascript:alert(1)'),null);
  assert.equal(safeWebsite('data:text/html,test'),null);
  assert.equal(safeWebsite('https://example.org'),'https://example.org/');
});
test('geocoding rejects ambiguous or mismatched address results',()=>{
  const s={address:'123 Main St, Carlsbad, CA 92008'};
  const m={matchedAddress:'123 MAIN ST, CARLSBAD, CA, 92008',addressComponents:{zip:'92008',state:'CA'},coordinates:{x:-117,y:33}};
  assert.equal(acceptMatch(s,[m]).lat,33);
  assert.equal(acceptMatch(s,[m,m]),null);
  assert.equal(acceptMatch(s,[{...m,matchedAddress:'124 MAIN ST'}]),null);
  assert.equal(acceptMatch(s,[{...m,addressComponents:{zip:'99999',state:'CA'}}]),null);
  assert.equal(acceptMatch(s,[]),null);
});
