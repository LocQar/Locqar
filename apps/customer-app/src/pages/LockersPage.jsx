import React, { useState } from "react";
import { T, ff, mf } from "../theme/themes";
import StatusBar from "../components/StatusBar";
import PageHeader from "../components/PageHeader";
import Chip from "../components/Chip";
import { initLockers, avSt } from "../data/mockData";
import { MapPin, Package, Navigation, Clock, Star } from "../components/Icons";

export default function LockersPage(props) {
  var [filter, setFilter] = useState('all');
  var [view, setView] = useState('map');
  var [selPin, setSelPin] = useState(null);
  var sorted = initLockers.slice().sort(function (a, b) { return parseFloat(a.dist) - parseFloat(b.dist); });
  var filtered = filter === 'all' ? sorted : sorted.filter(function (l) { return l.type === filter; });

  // Map bounds — normalize lat/lng to pixel positions
  var minLat = 5.54, maxLat = 5.65, minLng = -0.32, maxLng = -0.12;
  var toX = function (lng) { return ((lng - minLng) / (maxLng - minLng)) * 80 + 10; };
  var toY = function (lat) { return (1 - (lat - minLat) / (maxLat - minLat)) * 75 + 12; };

  // User location (Osu area)
  var userX = toX(-0.185);
  var userY = toY(5.558);

  var handlePinClick = function (l) { setSelPin(selPin && selPin.id === l.id ? null : l); };

  return (
    <div className="pb-24 min-h-screen" style={{ background: T.bg }}><StatusBar />
      <PageHeader title="Nearby Lockers" onBack={props.onBack} subtitle={filtered.length + ' locations'} right={
        <div className="flex items-center gap-1" style={{ background: T.fill, borderRadius: 12, padding: 3, border: '1px solid ' + T.border }}>
          <button onClick={function () { setView('map'); setSelPin(null); }} className="tap" style={{ width: 34, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: view === 'map' ? T.text : 'transparent', transition: 'all .2s' }}><MapPin style={{ width: 14, height: 14, color: view === 'map' ? '#fff' : T.muted }} /></button>
          <button onClick={function () { setView('list'); setSelPin(null); }} className="tap" style={{ width: 34, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: view === 'list' ? T.text : 'transparent', transition: 'all .2s' }}><Package style={{ width: 14, height: 14, color: view === 'list' ? '#fff' : T.muted }} /></button>
        </div>
      } />

      {/* Filters */}
      <div style={{ padding: '0 20px 10px' }}>
        <div className="flex gap-2 overflow-x-auto noscroll fu">{[{ id: 'all', l: 'All', e: '📍' }, { id: 'mall', l: 'Malls', e: '🏬' }, { id: 'gas', l: 'Gas', e: '⛽' }, { id: 'hub', l: 'Hubs', e: '📦' }].map(function (f) { return <Chip key={f.id} label={f.l} emoji={f.e} active={filter === f.id} onClick={function () { setFilter(f.id); setSelPin(null); }} />; })}</div>
      </div>

      {/* MAP VIEW */}
      {view === 'map' && (
        <div className="fu" style={{ padding: '0 12px' }}>
          {/* Map container */}
          <div style={{ position: 'relative', width: '100%', height: 380, borderRadius: 22, overflow: 'hidden', background: '#F0EDE6', border: '1.5px solid ' + T.border, boxShadow: T.shadow }}>

            {/* Grid roads */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              {/* Horizontal roads */}
              {[25, 40, 55, 70, 85].map(function (y, i) {
                return <line key={'h' + i} x1="0%" y1={y + '%'} x2="100%" y2={y + '%'} stroke="#D4CFBF" strokeWidth={i === 2 ? 2.5 : 1} strokeDasharray={i === 2 ? '' : '6 4'} opacity={i === 2 ? 0.6 : 0.35} />;
              })}
              {/* Vertical roads */}
              {[20, 35, 50, 65, 80].map(function (x, i) {
                return <line key={'v' + i} x1={x + '%'} y1="0%" x2={x + '%'} y2="100%" stroke="#D4CFBF" strokeWidth={i === 2 ? 2.5 : 1} strokeDasharray={i === 2 ? '' : '6 4'} opacity={i === 2 ? 0.6 : 0.35} />;
              })}
              {/* Main highway — curved */}
              <path d="M 0 75% Q 30% 60%, 55% 50% T 100% 35%" stroke="#C8C1B0" strokeWidth="4" fill="none" opacity="0.5" />
            </svg>

            {/* Area labels */}
            {[
              { l: 'OSU', x: 28, y: 60, s: 9 },
              { l: 'AIRPORT', x: 52, y: 38, s: 8 },
              { l: 'CANTONMENTS', x: 40, y: 50, s: 7 },
              { l: 'EAST LEGON', x: 72, y: 28, s: 8 },
              { l: 'NUNGUA', x: 78, y: 48, s: 7 },
              { l: 'CIRCLE', x: 18, y: 40, s: 8 },
              { l: 'WEIJA', x: 8, y: 56, s: 7 }
            ].map(function (a, i) {
              return <span key={i} style={{ position: 'absolute', left: a.x + '%', top: a.y + '%', fontSize: a.s, fontWeight: 700, color: '#B8B0A0', fontFamily: ff, letterSpacing: '0.12em', transform: 'translate(-50%, -50%)', pointerEvents: 'none', whiteSpace: 'nowrap' }}>{a.l}</span>;
            })}

            {/* Water/coastline hint at bottom */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '15%', background: 'linear-gradient(to top, rgba(147,197,222,0.15), transparent)', pointerEvents: 'none' }} />
            <span style={{ position: 'absolute', bottom: 8, right: 14, fontSize: 7, fontWeight: 700, color: '#93C5DE', fontFamily: ff, letterSpacing: '0.15em', opacity: 0.6 }}>GULF OF GUINEA</span>

            {/* User location */}
            <div style={{ position: 'absolute', left: userX + '%', top: userY + '%', transform: 'translate(-50%, -50%)', zIndex: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'breathe 2s ease-in-out infinite' }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: T.blue, border: '3px solid #fff', boxShadow: '0 2px 8px rgba(59,130,246,0.4)' }} />
              </div>
            </div>

            {/* Locker pins */}
            {filtered.map(function (l) {
              var x = toX(l.lng); var y = toY(l.lat);
              var isSel = selPin && selPin.id === l.id;
              var st = avSt(l.avail, l.total);
              return (
                <div key={l.id}>
                  {/* Distance line to selected */}
                  {isSel && (
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                      <line x1={userX + '%'} y1={userY + '%'} x2={x + '%'} y2={y + '%'} stroke={T.blue} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
                    </svg>
                  )}
                  <button onClick={function () { handlePinClick(l); }} className="tap" style={{ position: 'absolute', left: x + '%', top: y + '%', transform: 'translate(-50%, -100%)', zIndex: isSel ? 15 : 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {/* Availability badge */}
                      {isSel && <div className="fi" style={{ marginBottom: 2, padding: '2px 7px', borderRadius: 6, background: st.bg, border: '1px solid ' + st.c + '33', whiteSpace: 'nowrap' }}><span style={{ fontSize: 9, fontWeight: 700, color: st.c, fontFamily: ff }}>{l.avail} free</span></div>}
                      {/* Pin */}
                      <div style={{
                        width: isSel ? 44 : 36, height: isSel ? 44 : 36, borderRadius: isSel ? 14 : 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isSel ? 18 : 15,
                        background: isSel ? T.text : '#fff',
                        border: isSel ? '3px solid #fff' : '2px solid ' + T.border,
                        boxShadow: isSel ? '0 4px 16px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all .2s cubic-bezier(.2,.9,.3,1)'
                      }}>{l.emoji}</div>
                      {/* Pin point */}
                      <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '7px solid ' + (isSel ? T.text : '#fff'), marginTop: -1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }} />
                    </div>
                  </button>
                </div>
              );
            })}

            {/* Map controls */}
            <div style={{ position: 'absolute', right: 10, top: 10, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 25 }}>
              <button className="tap" style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid ' + T.border, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 16, fontWeight: 700 }}>+</button>
              <button className="tap" style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid ' + T.border, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 16, fontWeight: 700 }}>−</button>
            </div>

            {/* Recenter button */}
            <button className="tap" style={{ position: 'absolute', right: 10, bottom: 10, width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid ' + T.border, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: 25 }}>
              <Navigation style={{ width: 14, height: 14, color: T.blue }} />
            </button>

            {/* Legend */}
            <div style={{ position: 'absolute', left: 10, bottom: 10, display: 'flex', gap: 8, zIndex: 25 }}>
              <div className="flex items-center gap-1.5" style={{ padding: '4px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid ' + T.border }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: T.blue, border: '1.5px solid #fff', boxShadow: '0 0 0 1px ' + T.blue }} />
                <span style={{ fontSize: 8, fontWeight: 600, color: T.sec, fontFamily: ff }}>You</span>
              </div>
              <div className="flex items-center gap-1.5" style={{ padding: '4px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid ' + T.border }}>
                <div style={{ width: 10, height: 10, borderRadius: 4, background: '#fff', border: '1.5px solid ' + T.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 6 }}>📦</div>
                <span style={{ fontSize: 8, fontWeight: 600, color: T.sec, fontFamily: ff }}>Locker</span>
              </div>
            </div>
          </div>

          {/* Selected locker detail card */}
          {selPin && (
            <div className="fu" style={{ marginTop: 10, borderRadius: 20, padding: 16, background: '#fff', border: '1.5px solid ' + T.border, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div className="flex items-start gap-3">
                <div style={{ width: 50, height: 50, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, background: T.fill, border: '1px solid ' + T.border }}>{selPin.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between" style={{ marginBottom: 3 }}>
                    <h3 className="truncate" style={{ fontWeight: 800, fontSize: 16, fontFamily: ff }}>{selPin.name}</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 8, background: avSt(selPin.avail, selPin.total).bg, color: avSt(selPin.avail, selPin.total).c, fontFamily: ff, flexShrink: 0, marginLeft: 8 }}>{selPin.avail}/{selPin.total} free</span>
                  </div>
                  <p style={{ fontSize: 12, color: T.sec, fontFamily: ff, marginBottom: 6 }}>{selPin.addr}</p>
                  <div className="flex items-center gap-4" style={{ marginBottom: 10 }}>
                    <div className="flex items-center gap-1"><MapPin style={{ width: 12, height: 12, color: T.muted }} /><span style={{ fontSize: 11, color: T.sec, fontFamily: ff }}>{selPin.dist} km</span></div>
                    <div className="flex items-center gap-1"><Clock style={{ width: 12, height: 12, color: T.muted }} /><span style={{ fontSize: 11, color: T.sec, fontFamily: ff }}>{selPin.hours}</span></div>
                    <div className="flex items-center gap-1"><Star style={{ width: 12, height: 12, color: '#F59E0B', fill: '#F59E0B' }} /><span style={{ fontSize: 11, fontWeight: 600, fontFamily: ff }}>{selPin.rating}</span></div>
                  </div>
                  {/* Occupancy bar */}
                  <div style={{ marginBottom: 12 }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 4 }}><span style={{ fontSize: 10, color: T.muted, fontFamily: ff }}>Occupancy</span><span style={{ fontSize: 10, fontWeight: 700, color: T.sec, fontFamily: mf }}>{Math.round((selPin.total - selPin.avail) / selPin.total * 100)}%</span></div>
                    <div style={{ height: 4, borderRadius: 2, background: T.fill, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 2, width: ((selPin.total - selPin.avail) / selPin.total * 100) + '%', background: avSt(selPin.avail, selPin.total).c, transition: 'width .5s' }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="tap flex-1" style={{ padding: '10px 0', borderRadius: 12, fontWeight: 700, fontSize: 12, background: T.text, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: ff, boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}><Navigation style={{ width: 13, height: 13 }} />Directions</button>
                    <button onClick={function () { props.onBack(); }} className="tap flex-1" style={{ padding: '10px 0', borderRadius: 12, fontWeight: 700, fontSize: 12, background: T.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: ff, boxShadow: '0 2px 10px rgba(225,29,72,0.2)' }}>📤 Send Here</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nearby list below map */}
          {!selPin && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: '0.08em', marginBottom: 8, fontFamily: ff, padding: '0 4px' }}>NEAREST TO YOU</p>
              <div className="flex gap-2 overflow-x-auto noscroll" style={{ paddingBottom: 4 }}>
                {filtered.slice(0, 4).map(function (l, i) {
                  var st = avSt(l.avail, l.total);
                  return (
                    <button key={l.id} onClick={function () { setSelPin(l); }} className="tap fu flex-shrink-0" style={{ width: 150, borderRadius: 16, padding: 12, background: '#fff', border: '1.5px solid ' + T.border, boxShadow: T.shadow, textAlign: 'left', animationDelay: (i * 0.05) + 's' }}>
                      <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: T.fill, border: '1px solid ' + T.border }}>{l.emoji}</div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: st.bg, color: st.c, fontFamily: ff }}>{l.avail} free</span>
                      </div>
                      <p className="truncate" style={{ fontWeight: 700, fontSize: 13, fontFamily: ff, marginBottom: 2 }}>{l.name}</p>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 10, color: T.sec, fontFamily: ff }}>{l.dist} km</span>
                        <span className="flex items-center gap-0.5" style={{ fontSize: 10 }}><Star style={{ width: 8, height: 8, color: '#F59E0B', fill: '#F59E0B' }} /><span style={{ color: T.sec, fontFamily: ff }}>{l.rating}</span></span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <div style={{ padding: '0 20px' }}>
          {filtered.map(function (l, i) {
            var st = avSt(l.avail, l.total);
            return (
              <div key={l.id} className="fu tap" style={{ borderRadius: 18, padding: 14, background: '#fff', marginBottom: 8, border: '1.5px solid ' + T.border, boxShadow: T.shadow, animationDelay: (i * 0.04) + 's' }}>
                <div className="flex items-start gap-3">
                  <div style={{ width: 46, height: 46, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, background: T.fill, border: '1px solid ' + T.border }}>{l.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between" style={{ marginBottom: 3 }}>
                      <h3 className="truncate" style={{ fontWeight: 700, fontSize: 14, fontFamily: ff }}>{l.name}</h3>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8, background: st.bg, color: st.c, fontFamily: ff, flexShrink: 0, marginLeft: 8 }}>{l.avail} free</span>
                    </div>
                    <p style={{ fontSize: 12, color: T.sec, fontFamily: ff }}>{l.addr}</p>
                    <div className="flex items-center gap-3" style={{ marginTop: 6 }}>
                      <div className="flex items-center gap-1"><MapPin style={{ width: 12, height: 12, color: T.muted }} /><span style={{ fontSize: 11, color: T.sec, fontFamily: ff }}>{l.dist} km</span></div>
                      <div className="flex items-center gap-1"><Clock style={{ width: 12, height: 12, color: T.muted }} /><span style={{ fontSize: 11, color: T.sec, fontFamily: ff }}>{l.hours}</span></div>
                      <div className="flex items-center gap-1"><Star style={{ width: 12, height: 12, color: '#F59E0B', fill: '#F59E0B' }} /><span style={{ fontSize: 11, fontWeight: 600, fontFamily: ff }}>{l.rating}</span></div>
                    </div>
                    <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: T.fill, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 2, width: ((l.total - l.avail) / l.total * 100) + '%', background: st.c, transition: 'width .5s' }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
