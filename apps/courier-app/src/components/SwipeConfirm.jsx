import React, { useState, useRef } from 'react';
import { ChevronRight, ArrowRight, Check } from './Icons';

const SwipeConfirm = ({ label, onConfirm, color, icon, T }) => {
  const swipeColor = color || T.red;
  const trackRef = useRef(null);
  const [posX, setPosX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const startXRef = useRef(0);
  const THUMB = 52;
  const getMax = () => (trackRef.current ? trackRef.current.offsetWidth - THUMB - 8 : 240);
  const handleStart = (cx) => { if (confirmed) return; setDragging(true); startXRef.current = cx - posX };
  const handleMove = (cx) => { if (!dragging || confirmed) return; setPosX(Math.max(0, Math.min(cx - startXRef.current, getMax()))) };
  const handleEnd = () => { if (!dragging || confirmed) return; setDragging(false); if (posX / getMax() >= 0.72) { setPosX(getMax()); setConfirmed(true); try { navigator.vibrate && navigator.vibrate([30, 50, 30]) } catch (e) { }; setTimeout(() => { onConfirm(); setConfirmed(false); setPosX(0) }, 500) } else { setPosX(0) } };
  const pct = getMax() > 0 ? posX / getMax() : 0;
  return (
    <div ref={trackRef} style={{ position: 'relative', height: 64, borderRadius: 16, overflow: 'hidden', background: confirmed ? T.green : T.fill, transition: confirmed ? 'background .3s' : 'none', userSelect: 'none', touchAction: 'none' }}
      onMouseMove={e => handleMove(e.clientX)} onMouseUp={handleEnd} onMouseLeave={handleEnd}
      onTouchMove={e => handleMove(e.touches[0].clientX)} onTouchEnd={handleEnd}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: swipeColor, opacity: pct * 0.2, transition: dragging ? 'none' : 'opacity .3s' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: confirmed ? '#fff' : T.sec, opacity: confirmed ? 1 : Math.max(0.4, 1 - pct * 0.6), transition: 'all .3s' }}>{confirmed ? '\u2713 Confirmed!' : label}</span>
      </div>
      {!confirmed && <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 1, pointerEvents: 'none', opacity: Math.max(0, 0.3 - pct) }}><ChevronRight size={14} style={{ color: T.muted }} /><ChevronRight size={14} style={{ color: T.muted }} /><ChevronRight size={14} style={{ color: T.muted }} /></div>}
      <div style={{ position: 'absolute', top: 6, left: 6, width: THUMB, height: THUMB, borderRadius: 14, background: confirmed ? '#fff' : swipeColor, color: confirmed ? T.green : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab', transform: `translateX(${posX}px)`, transition: dragging ? 'none' : 'transform .3s cubic-bezier(.2,.8,.3,1)', boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}
        onMouseDown={e => handleStart(e.clientX)} onTouchStart={e => handleStart(e.touches[0].clientX)}>
        {confirmed ? <Check size={22} /> : icon || <ArrowRight size={22} />}
      </div>
    </div>
  );
};

export default SwipeConfirm;
