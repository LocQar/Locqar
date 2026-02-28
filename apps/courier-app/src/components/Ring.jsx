import React from 'react';

const Ring = ({ pct, sz = 56, sw = 5, color, children, T }) => {
  const ringColor = color || T.green;
  const r = (sz - sw) / 2, ci = r * 2 * Math.PI, o = ci - (pct / 100) * ci;
  return <div style={{ position: 'relative', width: sz, height: sz }}>
    <svg style={{ transform: 'rotate(-90deg)' }} width={sz} height={sz}>
      <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke={T.fill} strokeWidth={sw} />
      <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke={ringColor} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={o} strokeLinecap="round" style={{ transition: 'all .6s ease' }} />
    </svg>
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
  </div>;
};

export default Ring;
