import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {hasCoordinates} from './schools-map-utils.js';

export function acceptMatch(school,matches){
  if(!Array.isArray(matches)||matches.length!==1)return null;
  const m=matches[0],c=m.addressComponents||{};
  const zip=(school.address.match(/\b\d{5}(?:-\d{4})?\s*$/)||[])[0]?.slice(0,5);
  const number=(school.geocodeAddress||school.address).match(/^\s*([\d-]+)/)?.[1];
  if(!zip||String(c.zip)!==zip||c.state!=='CA'||!number||!m.matchedAddress?.startsWith(number+' '))return null;
  const point={lat:m.coordinates?.y,lng:m.coordinates?.x};
  return hasCoordinates(point)?{...point,matchedAddress:m.matchedAddress,geocodeProvider:'US Census',geocodeStatus:'matched'}:null;
}

export async function geocode(input,output){
  const schools=JSON.parse(await readFile(input,'utf8'));
  if(!Array.isArray(schools))throw new Error('Input must be an array');
  let cache=[];try{cache=JSON.parse(await readFile(output,'utf8'));}catch{}
  const result=[];
  for(const school of schools){
    const previous=cache.find(s=>s.id===school.id&&s.address===school.address&&s.geocodeAddress===school.geocodeAddress&&hasCoordinates(s));
    if(hasCoordinates(school)){result.push(school);continue;}
    if(previous){result.push({...previous,...school,lat:previous.lat,lng:previous.lng});continue;}
    try{
      const url=new URL('https://geocoding.geo.census.gov/geocoder/locations/onelineaddress');
      url.search=new URLSearchParams({address:school.geocodeAddress||school.address,benchmark:'Public_AR_Current',format:'json'});
      const response=await fetch(url,{signal:AbortSignal.timeout(15000)});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const data=await response.json(),match=acceptMatch(school,data.result?.addressMatches);
      result.push({...school,...(match||{geocodeStatus:'needs-review'})});
    }catch(error){result.push({...school,geocodeStatus:'needs-review',geocodeError:error.message});}
    await writeFile(output,JSON.stringify(result,null,2)+'\n');
  }
  await writeFile(output,JSON.stringify(result,null,2)+'\n');
  const missing=result.filter(s=>!hasCoordinates(s));
  console.log(`${result.length-missing.length}/${result.length} mapped. Output: ${output}`);
  missing.forEach(s=>console.error(`REVIEW: ${s.name} | ${s.address}`));
  return missing.length;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const missing=await geocode(process.argv[2]||'schools.json',process.argv[3]||'schools.geocoded.json');
  if(missing)process.exitCode=2;
}
