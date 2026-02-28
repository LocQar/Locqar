import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onDone, T }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 200);
    const t2 = setTimeout(onDone, 2000);
    return () => [t1, t2].forEach(clearTimeout);
  }, [onDone]);
  return <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.08) 0%, transparent 70%)', filter: show ? 'blur(40px)' : 'blur(60px)', transition: 'filter 1s ease' }} />
    <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', filter: show ? 'blur(40px)' : 'blur(60px)', transition: 'filter 1s ease' }} />
    <img src="https://www.figma.com/api/mcp/asset/27ad021e-61a0-4769-ab93-2a417f444a4c" alt="LocQar Logo" style={{
      width: 100, height: 96, objectFit: 'contain',
      opacity: show ? 1 : 0, transform: show ? 'scale(1)' : 'scale(0.9)',
      transition: 'all 0.6s cubic-bezier(.2,.9,.3,1)',
    }} />
    <p style={{ marginTop: 12, fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: show ? 1 : 0, transition: 'opacity 0.5s ease 0.2s' }}>Courier</p>
    <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
      {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: T.red, opacity: show ? 1 : 0, animation: show ? 'dotPulse 1.2s ease-in-out infinite' : 'none', animationDelay: `${i * 0.2}s`, transition: 'opacity 0.3s ease' }} />)}
    </div>
  </div>;
};

export default SplashScreen;
