import React from 'react';
import { ArrowLeft } from './Icons';

const TopBar = ({ title, sub, onBack, right, T }) => (
  <div style={{ padding: '10px 20px 12px', background: T.card, borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {onBack && <button onClick={onBack} className="press" style={{ width: 36, height: 36, borderRadius: 10, background: T.fill, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={18} /></button>}
      <div style={{ flex: 1 }}><h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>{title}</h1>{sub && <p style={{ fontSize: 12, color: T.sec, margin: 0 }}>{sub}</p>}</div>
      {right}
    </div>
  </div>
);

export default TopBar;
