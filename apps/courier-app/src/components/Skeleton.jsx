import React from 'react';

const Skeleton = ({ w, h, r = 8, T }) => (
  <div style={{ width: w || '100%', height: h || 16, borderRadius: r, background: `linear-gradient(90deg, ${T.fill} 25%, ${T.fill2} 50%, ${T.fill} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease infinite' }} />
);

export default Skeleton;
