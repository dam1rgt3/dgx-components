import React from 'react';
import {createRoot} from 'react-dom/client';
import AirportMap from './AirportMap.jsx';
createRoot(document.getElementById('root')).render(<React.StrictMode><main style={{maxWidth:1280,margin:'0 auto',padding:'clamp(16px,4vw,64px)'}}><div style={{fontFamily:'Arial,sans-serif',color:'#152d43',marginBottom:28}}><h1 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:500,letterSpacing:'-1.5px',margin:'0 0 12px'}}>Find your way to the flightline.</h1><p style={{color:'#526572',margin:0,lineHeight:1.6}}>Explore our airport locations across San Diego County.</p></div><AirportMap /></main></React.StrictMode>);
