import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import { ChevronDown, RefreshCw } from '../components/Icons';

const LoginScreen = ({ onLogin, T }) => {
  const [ph, setPh] = useState(''); const [ld, setLd] = useState(false);
  const go = () => { if (ph.length < 7) return; setLd(true); setTimeout(() => onLogin(ph), 1000) };
  return <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column' }}><StatusBar />
    <div style={{ flex: 1, padding: '48px 24px 0' }}>
      <div className="fu" style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg, ${T.text}, #1E3A5F)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(15,23,42,0.25)' }}>
          <span style={{ fontSize: 32 }}>{'\uD83D\uDE80'}</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>Welcome back!</h1>
        <p style={{ fontSize: 14, color: T.sec, marginTop: 0 }}>Sign in to start delivering</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.fill, borderRadius: 20, padding: '5px 12px', marginTop: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: 4, background: T.green }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: T.sec }}>LocQar Courier Platform</span>
        </div>
      </div>
      <div className="fu stg1">
        <label style={{ fontSize: 13, fontWeight: 600, color: T.sec, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone Number</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <div style={{ height: 52, padding: '0 14px', borderRadius: 14, background: T.fill, display: 'flex', alignItems: 'center', gap: 8, border: `1.5px solid ${T.border}` }}><span style={{ fontSize: 18 }}>{'\uD83C\uDDEC\uD83C\uDDED'}</span><span style={{ fontWeight: 700 }}>+233</span><ChevronDown size={14} style={{ color: T.muted }} /></div>
          <input type="tel" value={ph} onChange={e => setPh(e.target.value)} placeholder="24 000 0000" style={{ flex: 1, height: 52, padding: '0 16px', borderRadius: 14, background: T.fill, border: `1.5px solid ${ph.length > 0 ? T.blue : T.border}`, fontSize: 18, fontWeight: 600, transition: 'border .2s' }} />
        </div>
        <button onClick={go} disabled={ph.length < 7 || ld} className="press" style={{ width: '100%', height: 54, borderRadius: 16, border: 'none', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ph.length >= 7 ? `linear-gradient(135deg, ${T.text}, #1E3A5F)` : T.fill, color: ph.length >= 7 ? '#fff' : T.muted, boxShadow: ph.length >= 7 ? '0 6px 20px rgba(15,23,42,0.3)' : 'none', transition: 'all .3s' }}>
          {ld ? <RefreshCw size={20} className="sp" /> : 'Continue \u2192'}
        </button>
      </div>
    </div>
    <p style={{ padding: '0 24px 32px', textAlign: 'center', fontSize: 12, color: T.muted }}>By continuing you agree to our <b style={{ color: T.text }}>Terms</b> & <b style={{ color: T.text }}>Privacy</b></p>
  </div>;
};

export default LoginScreen;
