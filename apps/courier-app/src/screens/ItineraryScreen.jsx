import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import TopBar from '../components/TopBar';
import Badge from '../components/Badge';
import PriorityBadge from '../components/PriorityBadge';
import NavigationButton from '../components/NavigationModal';
import { Check } from '../components/Icons';
import { lockersData } from '../data/mockData';
import { SizeIcon, StopProgress, sizeColor } from './HomeScreen';

const optimizeRoute = (lockers, tasks, mode = 'distance') => {
  if (mode === 'distance') return [...lockers].sort((a, b) => a.distKm - b.distKm);
  if (mode === 'priority') return [...lockers].sort((a, b) => {
    const aPri = tasks.filter(t => t.locker === a.name && t.pri !== 'normal').length;
    const bPri = tasks.filter(t => t.locker === b.name && t.pri !== 'normal').length;
    return bPri - aPri;
  });
  return [...lockers].sort((a, b) => {
    const aS = (tasks.filter(t => t.locker === a.name && t.pri !== 'normal').length + 1) / (a.distKm || 1);
    const bS = (tasks.filter(t => t.locker === b.name && t.pri !== 'normal').length + 1) / (b.distKm || 1);
    return bS - aS;
  });
};

const ItineraryScreen = ({ dels, tasks, onBack, onNav, T }) => {
  const [routeMode, setRouteMode] = useState('distance');
  const sortedLockers = optimizeRoute(lockersData, tasks, routeMode);
  const curIdx = sortedLockers.findIndex(l => dels.some(d => d.locker === l.name && d.status === 'pending'));
  const done = dels.filter(d => d.status === 'delivered').length;
  const totalDist = sortedLockers.reduce((s, l) => s + l.distKm, 0);
  const totalEta = sortedLockers.reduce((s, l) => s + parseInt(l.eta), 0);
  return <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: 80 }}><StatusBar />
    <TopBar title="Itinerary" onBack={onBack} T={T} />
    <StopProgress current={curIdx >= 0 ? curIdx + 1 : sortedLockers.length} total={sortedLockers.length} doneP={done} totalP={dels.length} T={T} />
    <div style={{ padding: '12px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{'\uD83D\uDCCD'} {totalDist.toFixed(1)} km</span>
          <span style={{ color: T.border }}>{'\u00B7'}</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{'\uD83D\uDD50'} ~{totalEta} min</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[{ id: 'distance', l: 'Nearest' }, { id: 'priority', l: 'Priority' }, { id: 'balanced', l: 'Balanced' }].map(m => (
          <button key={m.id} onClick={() => setRouteMode(m.id)} className="tap" style={{ flex: 1, height: 32, borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, background: routeMode === m.id ? T.text : T.fill, color: routeMode === m.id ? '#fff' : T.sec }}>{m.l}</button>
        ))}
      </div>
    </div>
    <div style={{ padding: '0 20px' }}>
      {sortedLockers.map((l, i) => {
        const sd = dels.filter(d => d.locker === l.name); const dn = sd.filter(d => d.status === 'delivered').length; const allD = dn === sd.length; const isA = i === curIdx;
        return <div key={l.id} className="fu" style={{ marginBottom: 16, animationDelay: `${i * 0.1}s` }}>
          <button onClick={() => onNav('stop', { locker: l, stopNum: i + 1 })} className="press" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', background: allD ? T.green : isA ? T.red : T.muted, boxShadow: isA ? '0 4px 12px ' + T.red + '30' : 'none' }}>{allD ? <Check size={18} /> : i + 1}</div>
              {i < sortedLockers.length - 1 && <div style={{ width: 2, height: 24, marginTop: 4, background: allD ? T.green : T.border }} />}
            </div>
            <div style={{ flex: 1, borderRadius: 12, padding: 16, background: T.card, border: isA ? `1.5px solid ${T.red}` : '1.5px solid ' + T.border }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div><p style={{ fontWeight: 700, margin: 0, opacity: allD ? .5 : 1 }}>{l.name}</p><p style={{ fontSize: 14, color: T.sec, margin: 0 }}>{l.addr}</p></div>
                <div style={{ textAlign: 'right' }}><p style={{ fontSize: 20, fontWeight: 700, color: allD ? T.green : isA ? T.red : T.text, margin: 0 }}>{dn}/{sd.length}</p></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8, alignItems: 'center' }}><span style={{ fontSize: 11 }}>{'\uD83D\uDCCD'}</span><span style={{ fontSize: 12, color: T.sec }}>{l.dist}</span><span style={{ fontSize: 11 }}>{'\uD83D\uDD50'}</span><span style={{ fontSize: 12, color: T.sec }}>{l.eta}</span></div>
              <div style={{ marginTop: 10, height: 6, borderRadius: 3, background: T.fill, overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 3, width: `${sd.length > 0 ? (dn / sd.length) * 100 : 0}%`, background: allD ? T.green : T.red, transition: 'width .5s' }} /></div>
            </div>
          </button>
          {isA && <div style={{ marginLeft: 52, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sd.map(p => (
              <div key={p.id} style={{ borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10, background: p.status === 'delivered' ? T.greenBg : T.bg, border: `1px solid ${p.status === 'delivered' ? T.green : T.border}` }}>
                <SizeIcon sz={p.sz} T={T} /><div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 14, fontFamily: '"Inter",sans-serif', fontWeight: 600, margin: 0 }}>{p.trk}</p><p style={{ fontSize: 12, color: T.sec, margin: 0 }}>{p.weight}</p></div>
                {p.status === 'delivered' ? <Check size={16} style={{ color: T.green }} /> : <PriorityBadge pri={p.pri} sm T={T} /> || <Badge v="default" sm T={T}>Pending</Badge>}
              </div>
            ))}
            <NavigationButton name={l.name} addr={l.addr} lat={l.lat} lng={l.lng} T={T} />
          </div>}
        </div>;
      })}
    </div>
  </div>;
};

export default ItineraryScreen;
