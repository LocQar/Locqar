import React from 'react';

const Badge = ({ children, v = 'default', sm, T }) => {
  const m = { default: [T.fill, T.sec], success: [T.greenBg, T.green], warning: [T.amberBg, T.amber], danger: [T.redBg, T.red], info: [T.blueBg, T.blue], surge: ['#FFF4E6', '#E8590C'] };
  const [bg, c] = m[v] || m.default;
  return <span style={{ background: bg, color: c, fontSize: sm ? 10 : 12, padding: sm ? '2px 7px' : '4px 10px', borderRadius: 6, fontWeight: 700, letterSpacing: '0.02em', display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>{children}</span>;
};

export default Badge;
