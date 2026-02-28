import React, { useState } from "react";
import { T, ff, mf } from "../theme/themes";
import StatusBar from "../components/StatusBar";
import Toast from "../components/Toast";
import QRCode from "../utils/qrcode";
import { initLockers } from "../data/mockData";
import { ArrowLeft, Check, Shield, Zap, Copy, ChevronDown, MapPin, Clock, Star, Navigation } from "../components/Icons";

export default function StoragePage(props) {
  var ssd = props.savedData || {};
  var hasSSD = ssd.sz || ssd.dur || ssd.lk;
  var [st, sS] = useState(props.confirmed ? 3 : hasSSD ? 2 : 1);
  var [sz, sSz] = useState(ssd.sz || null);
  var [dur, sDur] = useState(ssd.dur || null);
  var [lk, sLk] = useState(ssd.lk || null);
  var [confirmed, setConfirmed] = useState(false);
  var [showStorageQR, setShowStorageQR] = useState(true);
  var [codeCopied, setCodeCopied] = useState(false);
  var storageCode = 'LS-' + (300000 + Math.floor(Math.random() * 700000));

  var szs = [
    { id: 's', e: '\u{1F4C4}', l: 'Small', d: 'Documents, keys', w: '30\u00D720\u00D715 cm', p: 3 },
    { id: 'm', e: '\u{1F4E6}', l: 'Medium', d: 'Laptop, bag', w: '45\u00D735\u00D730 cm', p: 5 },
    { id: 'l', e: '\u{1F9F3}', l: 'Large', d: 'Suitcase', w: '60\u00D745\u00D740 cm', p: 8 },
    { id: 'xl', e: '\u{1F4E6}', l: 'XL Locker', d: 'Multiple bags', w: '80\u00D755\u00D750 cm', p: 12 }
  ];

  var durs = [
    { id: '2h', l: '2 Hours', mult: 1 },
    { id: '6h', l: '6 Hours', mult: 2.5 },
    { id: '24h', l: '24 Hours', mult: 4 },
    { id: '3d', l: '3 Days', mult: 10 }
  ];

  var lks = initLockers.slice(0, 4).map(function (l) { return { n: l.name, d: l.dist + ' km', a: l.avail, e: l.emoji, addr: l.addr, hours: l.hours, rating: l.rating }; });

  var selSz = szs.find(function (s) { return s.id === sz; });
  var selDur = durs.find(function (d) { return d.id === dur; });
  var totalPrice = selSz && selDur ? (selSz.p * selDur.mult).toFixed(2) : '0.00';
  var canContinue = (st === 1 && sz && dur) || (st === 2 && lk);

  return (
    <div className="min-h-screen" style={{ paddingBottom: st === 3 ? 40 : 120, background: T.bg }}><StatusBar />
      <Toast show={confirmed} emoji={'\u{1F5C4}\u{FE0F}'} text="Storage reserved!" />
      <Toast show={codeCopied && !confirmed} emoji={'\u{1F4CB}'} text="Storage code copied!" />

      <div style={{ padding: '8px 20px' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <button onClick={function () { st > 1 && st < 3 ? sS(st - 1) : props.onBack(); }} className="tap" style={{ width: 44, height: 44, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.fill, border: '1.5px solid ' + T.border }}><ArrowLeft style={{ width: 18, height: 18, color: T.text }} /></button>
          <div className="flex-1">
            <h1 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.04em', fontFamily: ff, color: T.text }}>{st === 3 ? 'Confirmed' : 'Rent Storage'}</h1>
            <p style={{ fontSize: 11, color: T.sec, fontFamily: ff, fontWeight: 600 }}>{st === 1 ? 'Configure your locker' : st === 2 ? 'Select location' : 'Reservation details'}</p>
          </div>
          {st < 3 && (
            <div className="flex items-center gap-1">
              {[1, 2].map(function (s) {
                return <div key={s} style={{ width: 8, height: 8, borderRadius: 4, background: s === st ? T.accent : T.fill, border: s === st ? 'none' : '1.5px solid ' + T.border, transition: 'all .3s' }} />;
              })}
            </div>
          )}
        </div>

        {st === 1 && (
          <div className="fu space-y-6">
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: T.muted, letterSpacing: '0.06em', marginBottom: 16, fontFamily: ff, textTransform: 'uppercase' }}>CHOOSE SIZE</p>
              <div className="grid grid-cols-2 gap-3">
                {szs.map(function (s) {
                  var sel = sz === s.id;
                  return (
                    <button key={s.id} onClick={function () { sSz(s.id); }} className="tap text-left relative overflow-hidden" style={{ padding: 16, borderRadius: 24, background: sel ? T.text : '#fff', color: sel ? '#fff' : T.text, border: '1.5px solid ' + (sel ? T.text : T.border), transition: 'all .25s', boxShadow: sel ? T.shadowMd : T.shadow }}>
                      <div style={{ fontSize: 24, marginBottom: 12 }}>{s.e}</div>
                      <p style={{ fontWeight: 800, fontSize: 15, fontFamily: ff }}>{s.l}</p>
                      <p style={{ fontSize: 11, opacity: 0.6, fontFamily: ff, marginTop: 2 }}>{s.w}</p>
                      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 900, fontSize: 15, fontFamily: mf }}>GH{'\u20B5'}{s.p}</span>
                        <span style={{ fontSize: 10, opacity: 0.5 }}>/hr</span>
                      </div>
                      {sel && <div className="pop" style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check style={{ width: 12, height: 12, color: '#fff', strokeWidth: 3 }} /></div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {sz && (
              <div className="fu">
                <p style={{ fontSize: 12, fontWeight: 800, color: T.muted, letterSpacing: '0.06em', marginBottom: 16, fontFamily: ff, textTransform: 'uppercase' }}>DURATION</p>
                <div className="grid grid-cols-2 gap-3">
                  {durs.map(function (d) {
                    var sel = dur === d.id;
                    var price = selSz ? (selSz.p * d.mult).toFixed(2) : '0';
                    return (
                      <button key={d.id} onClick={function () { sDur(d.id); }} className="tap relative" style={{ padding: 14, borderRadius: 20, background: sel ? T.accentBg : '#fff', border: '1.5px solid ' + (sel ? T.accent : T.border), transition: 'all .2s', boxShadow: sel ? '0 8px 16px ' + T.accent + '15' : 'none' }}>
                        <p style={{ fontWeight: 800, fontSize: 13, fontFamily: ff, color: sel ? T.accent : T.text }}>{d.l}</p>
                        <p style={{ fontWeight: 900, fontSize: 18, fontFamily: mf, marginTop: 4, color: sel ? T.accent : T.text }}>GH{'\u20B5'}{price}</p>
                        {sel && <div className="pop" style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, borderRadius: 10, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check style={{ width: 12, height: 12, color: '#fff', strokeWidth: 3 }} /></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {st === 2 && (
          <div className="fu">
            <div className="glass p-5 mb-6" style={{ borderRadius: 24, border: '1.5px solid ' + T.warn + '22', background: T.warnBg }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="pop" style={{ width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: '#fff' }}>{selSz ? selSz.e : '\u{1F4E6}'}</div>
                  <div>
                    <p style={{ fontWeight: 900, fontSize: 16, fontFamily: ff, color: T.warn }}>{selSz ? selSz.l : ''} · {selDur ? selDur.l : ''}</p>
                    <p style={{ fontSize: 12, color: T.warn, opacity: 0.8, fontWeight: 600 }}>{selSz ? selSz.w : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ fontWeight: 900, fontSize: 22, fontFamily: mf, color: T.warn }}>GH{'\u20B5'}{totalPrice}</p>
                </div>
              </div>
            </div>

            <p style={{ fontSize: 12, fontWeight: 800, color: T.muted, letterSpacing: '0.06em', marginBottom: 16, fontFamily: ff, textTransform: 'uppercase' }}>PICK A LOCKER</p>
            <div className="space-y-3">
              {lks.map(function (l, i) {
                var sel = lk === l.n;
                return (
                  <button key={i} onClick={function () { sLk(l.n); }} className="tap flex items-center gap-4" style={{ width: '100%', padding: '16px 20px', borderRadius: 24, background: sel ? T.text : '#fff', color: sel ? '#fff' : T.text, transition: 'all .25s', border: '1.5px solid ' + (sel ? T.text : T.border), boxShadow: sel ? T.shadowLg : T.shadow }}>
                    <div style={{ width: 52, height: 52, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: sel ? 'rgba(255,255,255,0.12)' : T.fill }}>{l.e}</div>
                    <div className="flex-1 text-left min-w-0">
                      <p style={{ fontWeight: 800, fontSize: 16, fontFamily: ff, letterSpacing: '-0.01em' }}>{l.n}</p>
                      <p className="truncate" style={{ fontSize: 12, opacity: 0.6, fontFamily: ff, marginTop: 2 }}>{l.addr}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1" style={{ fontSize: 11 }}><MapPin style={{ width: 10, height: 10 }} />{l.d}</span>
                        <span className="flex items-center gap-1" style={{ fontSize: 11 }}><Clock style={{ width: 10, height: 10 }} />{l.hours}</span>
                        <span className="flex items-center gap-1" style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B' }}><Star style={{ width: 10, height: 10, fill: '#F59E0B' }} />{l.rating}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 10, background: sel ? 'rgba(255,255,255,0.2)' : T.okBg, color: sel ? '#fff' : T.okDark, fontFamily: ff }}>{l.a} Free</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {st === 3 && (
          <div className="fu space-y-6">
            <div className="glass p-8 text-center" style={{ borderRadius: 32, background: 'linear-gradient(135deg, ' + T.warnBg + ', #FFFBEB)', border: '2.5px solid #fff', boxShadow: T.shadowLg }}>
              <div className="pop" style={{ fontSize: 52, marginBottom: 12 }}>{'\u{1F5C4}\u{FE0F}'}</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.04em', fontFamily: ff, color: T.text }}>Locker Reserved</h2>
              <p style={{ fontSize: 13, color: T.sec, fontFamily: ff, fontWeight: 600, marginTop: 4 }}>Ready for your drop-off</p>
            </div>

            <div className="glass p-6" style={{ borderRadius: 28, background: '#fff', border: '1.5px solid ' + T.border, boxShadow: T.shadow }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield style={{ width: 14, height: 14, color: T.warn }} />
                <p style={{ fontSize: 11, fontWeight: 900, color: T.warn, letterSpacing: '0.08em', fontFamily: ff, textTransform: 'uppercase' }}>Reservation Code</p>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 glass" style={{ padding: '16px 20px', borderRadius: 20, fontSize: 32, fontWeight: 900, letterSpacing: '0.2em', background: T.fill, textAlign: 'center', fontFamily: mf, color: T.text, border: '1.5px solid ' + T.border }}>{storageCode}</div>
                <button onClick={function () { if (navigator.clipboard) navigator.clipboard.writeText(storageCode); setCodeCopied(true); setTimeout(function () { setCodeCopied(false); }, 2000); }} className="tap" style={{ width: 64, height: 68, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: codeCopied ? T.okBg : T.fill, border: '1.5px solid ' + (codeCopied ? T.ok + '33' : T.border), transition: 'all .2s' }}>
                  {codeCopied ? <Check style={{ width: 22, height: 22, color: T.ok }} /> : <Copy style={{ width: 22, height: 22, color: T.sec }} />}
                </button>
              </div>
              <button onClick={function () { setShowStorageQR(!showStorageQR); }} className="tap flex items-center justify-between w-full glass" style={{ borderRadius: 16, padding: '12px 16px', background: T.fill, border: '1px solid ' + T.border }}>
                <div className="flex items-center gap-2"><Zap style={{ width: 14, height: 14, color: T.warn }} /><span style={{ fontSize: 13, fontWeight: 800, color: T.text, fontFamily: ff }}>Show QR Code</span></div>
                <ChevronDown style={{ width: 16, height: 16, color: T.muted, transform: showStorageQR ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
              </button>
              {showStorageQR && (
                <div className="fu flex flex-col items-center pt-6">
                  <div className="glass p-4" style={{ borderRadius: 24, background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                    <QRCode data={storageCode} size={180} radius={22} padding={12} />
                  </div>
                  <p style={{ fontSize: 12, color: T.sec, marginTop: 16, fontFamily: ff, fontWeight: 600, textAlign: 'center' }}>Scan at the locker to begin storage</p>
                </div>
              )}
            </div>

            <div className="glass p-6 space-y-4" style={{ borderRadius: 28, background: '#fff', border: '1.5px solid ' + T.border, boxShadow: T.shadow }}>
              <h3 style={{ fontWeight: 900, fontSize: 16, fontFamily: ff, color: T.text }}>Storage Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '\u{1F5C4}\u{FE0F}', label: 'Size', value: selSz ? selSz.l : '' },
                  { icon: '\u{23F1}\u{FE0F}', label: 'Duration', value: selDur ? selDur.l : '' },
                  { icon: '\u{1F4CD}', label: 'Locker', value: lk },
                  { icon: '\u{1F4B0}', label: 'Paid', value: 'GH\u20B5' + totalPrice, mono: true }
                ].map(function (r, i) {
                  return (
                    <div key={i} className="glass" style={{ padding: '12px 14px', borderRadius: 20, background: T.fill }}>
                      <p style={{ fontSize: 9, fontWeight: 900, color: T.muted, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{r.label}</p>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 14 }}>{r.icon}</span>
                        <p style={{ fontWeight: 800, fontSize: 13, fontFamily: r.mono ? mf : ff, color: T.text }}>{r.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={function () { props.onBack(); }} className="tap flex-1" style={{ padding: '16px 0', borderRadius: 20, fontWeight: 900, fontSize: 15, background: T.text, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: ff, boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}><Navigation style={{ width: 18, height: 18 }} />Navigate</button>
              <button onClick={function () { props.onBack(); }} className="tap" style={{ padding: '16px 24px', borderRadius: 20, fontWeight: 800, fontSize: 15, background: '#fff', color: T.text, fontFamily: ff, border: '1.5px solid ' + T.border, boxShadow: T.shadow }}>Done</button>
            </div>
          </div>
        )}
      </div>

      {st < 3 && (
        <div className="glass fixed bottom-0 left-0 right-0 p-5 pb-8" style={{ borderTop: '1.5px solid ' + T.border, zIndex: 10 }}>
          {st === 2 && lk ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="pop" style={{ width: 40, height: 40, borderRadius: 12, background: T.fill, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{selSz ? selSz.e : '\u{1F4E6}'}</div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{selSz ? selSz.l : ''} · {selDur ? selDur.l : ''}</p>
                    <p style={{ fontSize: 11, color: T.sec, fontWeight: 600 }}>{lk}</p>
                  </div>
                </div>
                <p style={{ fontWeight: 900, fontSize: 22, fontFamily: mf, color: T.text }}>GH{'\u20B5'}{totalPrice}</p>
              </div>
              <button onClick={function () {
                if (props.onNav) {
                  props.onNav('payment', {
                    amount: totalPrice,
                    label: 'Storage Rental',
                    icon: '\u{1F5C4}\u{FE0F}',
                    items: [
                      { e: '\u{1F5C4}\u{FE0F}', l: (selSz ? selSz.l : 'Locker') + ' Size', v: 'GH\u20B5' + (selSz ? selSz.p : 0) + '/hr' },
                      { e: '\u{23F1}\u{FE0F}', l: 'Duration: ' + (selDur ? selDur.l : ''), v: '' },
                      { e: '\u{1F4CD}', l: 'Location: ' + lk, v: '' }
                    ],
                    backTo: 'storage', onSuccessNav: 'storage', onSuccessData: { confirmed: true },
                    storageData: { sz: sz, dur: dur, lk: lk }
                  });
                }
              }} className="tap" style={{ width: '100%', padding: '18px 0', borderRadius: 22, fontWeight: 900, fontSize: 16, color: '#fff', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: ff, boxShadow: '0 12px 24px ' + T.accent + '44', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Reserve & Pay</button>
            </div>
          ) : (
            <button onClick={function () { if (canContinue) sS(2); }} className="tap" style={{ width: '100%', padding: '18px 0', borderRadius: 22, fontWeight: 900, fontSize: 16, background: canContinue ? T.text : T.fill, color: canContinue ? '#fff' : T.muted, transition: 'all .3s', fontFamily: ff, boxShadow: canContinue ? '0 10px 20px rgba(0,0,0,0.15)' : 'none', border: canContinue ? 'none' : '1.5px solid ' + T.border, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Continue</button>
          )}
        </div>
      )}
    </div>
  );
}
