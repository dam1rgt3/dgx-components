export const hasCoordinates=s=>typeof s.lat==='number'&&typeof s.lng==='number'&&Number.isFinite(s.lat)&&Number.isFinite(s.lng)&&s.lat>=-90&&s.lat<=90&&s.lng>=-180&&s.lng<=180;
export function safeWebsite(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}}
export function normalizeSchools(input){
  if(!Array.isArray(input))return [];
  const seen=new Set();
  return input.filter(s=>s&&typeof s.name==='string'&&s.name.trim()&&typeof s.address==='string').map(s=>({...s,name:s.name.trim(),address:s.address.trim(),id:String(s.id||`${s.name}|${s.address}`)})).filter(s=>{if(seen.has(s.id))return false;seen.add(s.id);return true;});
}
export function filterSchools(schools,query){const q=String(query||'').trim().toLocaleLowerCase();return schools.filter(s=>[s.name,s.city,s.address,s.zip].filter(Boolean).join(' ').toLocaleLowerCase().includes(q));}
