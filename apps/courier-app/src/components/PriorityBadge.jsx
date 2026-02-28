import React from 'react';

export const getPriMeta = (T) => ({
  urgent: { icon: '\u26A1', label: 'Urgent', color: T.red, bg: T.redBg },
  sameDay: { icon: '\uD83D\uDCC5', label: 'Same Day', color: T.amber, bg: T.amberBg },
  timeSensitive: { icon: '\u23F0', label: 'Time Sensitive', color: T.purple, bg: T.purpleBg },
  normal: { icon: '', label: 'Standard', color: T.sec, bg: T.fill },
});

export const priOrder = { urgent: 0, timeSensitive: 1, sameDay: 2, normal: 3 };

const PriorityBadge = ({ pri, deadline, sm, T }) => {
  const priMeta = getPriMeta(T);
  const m = priMeta[pri] || priMeta.normal;
  if (pri === 'normal') return null;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: sm ? '2px 6px' : '3px 8px', borderRadius: 6, fontSize: sm ? 10 : 11, fontWeight: 700, background: m.bg, color: m.color, whiteSpace: 'nowrap' }}>{m.icon} {m.label}{deadline ? ' \u00B7 ' + deadline : ''}</span>;
};

export default PriorityBadge;
