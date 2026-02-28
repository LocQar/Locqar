import React from 'react';
import StatusBar from '../components/StatusBar';
import TopBar from '../components/TopBar';
import Badge from '../components/Badge';
import SwipeConfirm from '../components/SwipeConfirm';
import { Navigation, Wifi, Battery, Camera, Check } from '../components/Icons';
import { openNavigation } from '../components/NavigationModal';
import { lockersData } from '../data/mockData';
import { SizeIcon, sizeColor } from './HomeScreen';

const StopScreen = ({ locker, stopNum, dels, onBack, onNav, adjLockers, T }) => {
  const adjLocker = adjLockers?.find(l => l.name === locker.name) || locker;
  const pkgs = dels.filter(d => d.locker === locker.name);
  const pending = pkgs.filter(d => d.status === 'pending');
  const done = pkgs.filter(d => d.status === 'delivered');
  const allDone = pending.length === 0;

  return <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: 120 }}><StatusBar />
    <TopBar title={`Stop ${stopNum} of ${lockersData.length}`} sub={locker.name} onBack={onBack} T={T}
      right={<button onClick={() => openNavigation(locker.name, locker.addr, locker.lat, locker.lng)} className="tap" style={{ width: 40, height: 40, borderRadius: 10, background: T.fill, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Navigation size={18} /></button>} />
    <div style={{ padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: T.fill, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 4, width: `${pkgs.length > 0 ? (done.length / pkgs.length) * 100 : 0}%`, background: allDone ? T.green : T.red, transition: 'width .5s' }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: allDone ? T.green : T.text }}>{done.length}/{pkgs.length}</span>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 10, background: T.greenBg }}><Wifi size={16} style={{ color: T.green }} /><span style={{ fontSize: 14, fontWeight: 600, color: T.green }}>Online</span></div>
        <div style={{ borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 10, background: T.card }}><Battery size={16} style={{ color: T.sec }} /><span style={{ fontSize: 14, fontWeight: 600 }}>{locker.bat}%</span></div>
      </div>
      <div style={{ borderRadius: 12, padding: 16, background: T.card, marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: T.sec, margin: '0 0 12px', textTransform: 'uppercase' }}>Available Compartments</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {Object.entries(adjLocker.avail).map(([s, n]) => {
            const [bg, c] = sizeColor(s, T); return <div key={s} style={{ borderRadius: 12, padding: 10, textAlign: 'center', background: T.bg }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, margin: '0 auto 6px', background: bg, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{s}</div>
              <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{n}</p><p style={{ fontSize: 11, color: T.muted, margin: 0 }}>free</p>
            </div>
          })}
        </div>
      </div>
      {pending.length > 0 && <><p style={{ fontSize: 12, fontWeight: 600, color: T.sec, margin: '0 0 10px', textTransform: 'uppercase' }}>To Deposit ({pending.length})</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {pending.map((p, i) => (
            <div key={p.id} style={{ borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', gap: 12, background: T.card }}>
              <SizeIcon sz={p.sz} T={T} /><div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: 14, fontFamily: '"Inter",sans-serif', margin: 0 }}>{p.trk}</p><p style={{ fontSize: 12, color: T.sec, margin: 0 }}>{p.sz} {'\u00B7'} {p.weight}</p></div>
              {p.pri === 'urgent' && <Badge v="danger" sm T={T}>{'\u26A1'} Urgent</Badge>}
            </div>
          ))}
        </div></>}
      {done.length > 0 && <><p style={{ fontSize: 12, fontWeight: 600, color: T.sec, margin: '0 0 10px', textTransform: 'uppercase' }}>Completed ({done.length})</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {done.map(p => (<div key={p.id} style={{ borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 12, background: T.card, opacity: .6 }}>
            <SizeIcon sz={p.sz} T={T} /><div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: 14, fontFamily: '"Inter",sans-serif', margin: 0 }}>{p.trk}</p></div><Badge v="success" sm T={T}><Check size={10} />Done</Badge>
          </div>))}
        </div></>}
    </div>
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 20, background: T.bg, borderTop: `1px solid ${T.border}` }}>
      {allDone ? (
        <button onClick={onBack} className="press" style={{ width: '100%', height: 52, borderRadius: 16, border: 'none', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: T.green, color: '#fff', boxShadow: '0 4px 12px ' + T.green + '30' }}><Check size={20} />Stop Complete</button>
      ) : (
        <SwipeConfirm label={`Swipe to start batch deposit (${pending.length})`} onConfirm={() => onNav('batch', { locker, stopNum })} icon={<Camera size={20} />} T={T} />
      )}
    </div>
  </div>;
};

export default StopScreen;
