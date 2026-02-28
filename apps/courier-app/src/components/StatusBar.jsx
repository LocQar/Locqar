import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from './Icons';

const StatusBar = () => {
  const [t, setT] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  useEffect(() => { const i = setInterval(() => setT(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 30000); return () => clearInterval(i) }, []);
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px' }}><span style={{ fontSize: 14, fontWeight: 600 }}>{t}</span><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Wifi size={14} /><Battery size={14} /></div></div>;
};

export default StatusBar;
