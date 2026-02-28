import React, { useState, useEffect } from 'react';
import StatusBar from '../components/StatusBar';
import SwipeConfirm from '../components/SwipeConfirm';
import Badge from '../components/Badge';
import { ArrowLeft, Package, Camera, CheckCircle, Check } from '../components/Icons';
import { SizeIcon, sizeColor } from './HomeScreen';

const BatchDepositScreen = ({ locker, stopNum, dels, onBack, onDeposit, T }) => {
  const pkgs = dels.filter(d => d.locker === locker.name);
  const pending = pkgs.filter(d => d.status === 'pending');
  const done = pkgs.filter(d => d.status === 'delivered');
  const allDone = pending.length === 0;
  const currentPkg = pending[0] || null;
  const [phase, setPhase] = useState('idle');
  const [comp, setComp] = useState(null);
  const [justDeposited, setJustDeposited] = useState(null);
  const [batchCount, setBatchCount] = useState(0);

  useEffect(() => {
    if (phase === 'deposited') {
      const timer = setTimeout(() => { setJustDeposited(null); if (pending.length > 0) { setPhase('idle'); setComp(null) } else { setPhase('allDone') } }, 1200);
      return () => clearTimeout(timer);
    }
  }, [phase, pending.length]);

  const startScan = () => setPhase('scanning');
  const simulateScan = () => { setComp(Math.floor(Math.random() * 20) + 1); setPhase('assigning'); setTimeout(() => setPhase('opening'), 800); setTimeout(() => setPhase('place'), 2000) };
  const confirmDeposit = () => { if (!currentPkg) return; setJustDeposited(currentPkg); setBatchCount(p => p + 1); setPhase('deposited'); onDeposit(currentPkg.id) };
  const totalHere = pkgs.length;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button onClick={onBack} className="tap" style={{ width: 40, height: 40, borderRadius: 10, background: T.fill, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={20} /></button>
          <div style={{ flex: 1 }}><h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Batch Deposit</h1><p style={{ fontSize: 13, color: T.sec, margin: 0 }}>{locker.name} {'\u00B7'} Stop {stopNum}</p></div>
          <div style={{ background: T.text, borderRadius: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Package size={14} style={{ color: '#fff' }} />
            <span key={batchCount} style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{done.length}</span>
            <span style={{ color: 'rgba(255,255,255,.4)', fontWeight: 600, fontSize: 14 }}>/{totalHere}</span>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 20px 16px' }}><div style={{ height: 8, borderRadius: 4, background: T.fill, overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 4, background: allDone ? T.green : T.red, transition: 'width .5s ease', width: `${totalHere > 0 ? (done.length / totalHere) * 100 : 0}%` }} /></div></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        {(allDone || phase === 'allDone') && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ width: 80, height: 80, borderRadius: 40, background: T.greenBg, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={40} height={40} viewBox="0 0 40 40"><circle cx={20} cy={20} r={18} fill="none" stroke={T.green} strokeWidth={3} /><path d="M12 20l6 6 10-12" fill="none" stroke={T.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} style={{ animation: 'checkAnim .5s ease forwards' }} /></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>{'\uD83C\uDF89'} All Deposited!</h2>
            <p style={{ fontSize: 14, color: T.sec, margin: '0 0 8px' }}>{totalHere} package{totalHere > 1 ? 's' : ''} deposited at {locker.name}</p>
            <p style={{ fontSize: 13, color: T.muted }}>Customers have been notified via SMS</p>
            <button onClick={onBack} className="tap" style={{ marginTop: 24, width: '100%', height: 52, borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 16, background: T.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Check size={20} />Continue Route</button>
          </div>
        )}
        {phase === 'idle' && currentPkg && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ borderRadius: 12, padding: 16, background: T.card, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
              <SizeIcon sz={currentPkg.sz} big T={T} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}><p style={{ fontWeight: 700, fontFamily: '"Inter",sans-serif', fontSize: 16, margin: 0 }}>{currentPkg.trk}</p>{currentPkg.pri === 'urgent' && <Badge v="danger" sm T={T}>{'\u26A1'} Urgent</Badge>}</div>
                <p style={{ fontSize: 13, color: T.sec, margin: 0 }}>{currentPkg.sz} compartment {'\u00B7'} {currentPkg.weight}</p>
              </div>
              <div style={{ textAlign: 'center' }}><p style={{ fontSize: 11, color: T.muted, margin: 0 }}>NEXT</p><p style={{ fontSize: 20, fontWeight: 700, color: T.red, margin: 0 }}>#{pending.indexOf(currentPkg) + 1}</p></div>
            </div>
            {pending.length > 1 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: T.muted, margin: '0 0 8px' }}>UP NEXT ({pending.length - 1} more)</p>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {pending.slice(1, 6).map((p, i) => {
                    const [bg, c] = sizeColor(p.sz, T); return (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 4, background: T.fill, borderRadius: 8, padding: '4px 10px' }}>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: bg, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{p.sz}</div>
                        <span style={{ fontSize: 11, fontFamily: '"Inter",sans-serif', color: T.sec }}>{p.trk.slice(-4)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <button onClick={startScan} className="press" style={{ width: '100%', height: 52, borderRadius: 14, border: 'none', fontWeight: 700, fontSize: 16, background: T.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 12px ' + T.red + '30' }}>{'\uD83D\uDCF7'} Scan Package</button>
          </div>
        )}
        {phase === 'scanning' && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ width: 200, height: 200, borderRadius: 12, background: T.fill, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 12, border: `2px dashed ${T.red}`, borderRadius: 10 }} />
              <Camera size={40} style={{ color: T.muted }} />
            </div>
            <p style={{ fontWeight: 700, margin: '0 0 4px' }}>Scan {currentPkg?.trk}</p>
            <p style={{ fontSize: 14, color: T.sec, margin: '0 0 20px' }}>Align QR code within the frame</p>
            <button onClick={simulateScan} className="tap" style={{ height: 48, padding: '0 32px', borderRadius: 10, border: 'none', fontWeight: 600, background: T.fill }}>Simulate Scan</button>
          </div>
        )}
        {phase === 'assigning' && (
          <div style={{ textAlign: 'center' }}>
            <div className="sp" style={{ width: 48, height: 48, borderRadius: 24, border: `3px solid ${T.fill}`, borderTopColor: T.red, margin: '0 auto 16px' }} />
            <p style={{ fontWeight: 700, margin: '0 0 4px' }}>Assigning Compartment...</p>
            <p style={{ fontSize: 14, color: T.sec }}>Finding best fit for {currentPkg?.sz}</p>
          </div>
        )}
        {phase === 'opening' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: T.fill, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><span style={{ fontSize: 28 }}>{'\uD83D\uDD10'}</span></div>
            <p style={{ fontWeight: 700, fontSize: 18, margin: '0 0 4px' }}>Opening #{comp}</p>
            <p style={{ fontSize: 14, color: T.sec }}>Unlocking compartment...</p>
          </div>
        )}
        {phase === 'place' && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
              <CheckCircle size={36} style={{ color: T.green }} />
              <div style={{ background: T.card, borderRadius: 12, padding: '8px 16px', textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: T.muted, margin: 0 }}>COMPARTMENT</p>
                <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>#{comp}</p>
              </div>
            </div>
            <p style={{ fontWeight: 700, fontSize: 18, color: T.green, margin: '0 0 4px' }}>Locker Open!</p>
            <p style={{ fontSize: 14, color: T.sec, margin: '0 0 4px' }}>Place <b>{currentPkg?.trk}</b> inside</p>
            <p style={{ fontSize: 13, color: T.muted, margin: '0 0 24px' }}>Close the door when done</p>
            <SwipeConfirm label="Swipe to confirm deposit" onConfirm={confirmDeposit} color={T.green} icon={<CheckCircle size={20} />} T={T} />
          </div>
        )}
        {phase === 'deposited' && justDeposited && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: T.greenBg, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={28} style={{ color: T.green }} /></div>
            <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>{justDeposited.trk} deposited</p>
            <p style={{ fontSize: 13, color: T.sec, margin: 0 }}>{pending.length > 0 ? 'Loading next package...' : 'All done at this stop!'}</p>
          </div>
        )}
      </div>
      {done.length > 0 && phase !== 'allDone' && !allDone && (
        <div style={{ padding: '12px 20px 20px', borderTop: `1px solid ${T.border}` }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: T.sec, margin: '0 0 8px', textTransform: 'uppercase' }}>Deposited this session</p>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }} className="no-sb">
            {done.map((p, i) => (
              <div key={p.id} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, background: T.greenBg, borderRadius: 10, padding: '6px 10px', border: `1px solid ${T.green}` }}>
                <Check size={12} style={{ color: T.green }} /><span style={{ fontSize: 12, fontFamily: '"Inter",sans-serif', fontWeight: 600, color: T.green }}>{p.trk.slice(-4)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchDepositScreen;
