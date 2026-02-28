import React, { useState, useEffect } from "react";
import { T, ff, mf } from "../theme/themes";
import StatusBar from "../components/StatusBar";
import PageHeader from "../components/PageHeader";
import Chip from "../components/Chip";
import EmptyState from "../components/EmptyState";
import { SkeletonList } from "../components/Skeleton";
import { usePullRefresh, PullIndicator } from "../components/PullRefresh";
import { Search, X, ArrowRight, Clock } from "../components/Icons";

export default function Activities(props) {
  var [f, sF] = useState('all');
  var [searchQ, setSearchQ] = useState('');
  var [searchOpen, setSearchOpen] = useState(false);
  var [loading, setLoading] = useState(true);
  useEffect(function () { var t = setTimeout(function () { setLoading(false); }, 600); return function () { clearTimeout(t); }; }, []);
  var fs = [{ id: 'all', l: 'All', e: '\u{1F4E6}' }, { id: 'ready', l: 'Ready', e: '\u{2705}' }, { id: 'transit', l: 'Transit', e: '\u{1F69A}' }, { id: 'done', l: 'Done', e: '\u{1F389}' }];
  var fl = f === 'all' ? props.pkgs : props.pkgs.filter(function (p) { return f === 'ready' ? p.status === 'Ready' : f === 'transit' ? p.status === 'In transit' : p.status === 'Delivered'; });
  if (searchQ.trim()) { var q = searchQ.toLowerCase(); fl = fl.filter(function (p) { return p.name.toLowerCase().indexOf(q) >= 0 || p.location.toLowerCase().indexOf(q) >= 0 || p.toPhone.indexOf(q) >= 0 || p.fromPhone.indexOf(q) >= 0 || p.status.toLowerCase().indexOf(q) >= 0; }); }
  var ptr = usePullRefresh(function () { });
  return (
    <div className="pb-24 min-h-screen overflow-y-auto noscroll" style={{ background: T.bg }} ref={ptr.containerRef} onTouchStart={ptr.onTouchStart} onTouchMove={ptr.onTouchMove} onTouchEnd={ptr.onTouchEnd}>
      <StatusBar /><PullIndicator pullY={ptr.pullY} refreshing={ptr.refreshing} />
      <PageHeader title="My Activities" subtitle={props.pkgs.length + ' deliveries'} right={
        <button onClick={function () { setSearchOpen(!searchOpen); if (searchOpen) setSearchQ(''); }} className="tap" style={{ width: 44, height: 44, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: searchOpen ? T.text : T.card, border: '1.5px solid ' + (searchOpen ? T.text : T.border), transition: 'all .25s', boxShadow: T.shadow }}>
          {searchOpen ? <X style={{ width: 18, height: 18, color: '#fff' }} /> : <Search style={{ width: 18, height: 18, color: T.text }} />}
        </button>
      } />
      {searchOpen && (
        <div className="fu" style={{ padding: '0 20px 16px' }}>
          <div className="flex items-center gap-3 glass" style={{ borderRadius: 16, padding: '12px 16px', border: '1.5px solid ' + (searchQ ? T.accent : T.border), transition: 'all .2s', boxShadow: T.shadow }}>
            <Search style={{ width: 18, height: 18, color: T.sec, flexShrink: 0 }} />
            <input type="text" value={searchQ} onChange={function (e) { setSearchQ(e.target.value); }} placeholder="Search deliveries..." className="flex-1" autoFocus style={{ background: 'transparent', fontSize: 14, fontWeight: 700, fontFamily: ff, color: T.text }} />
            {searchQ && <button onClick={function () { setSearchQ(''); }} className="tap" style={{ width: 24, height: 24, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.fill }}><X style={{ width: 12, height: 12, color: T.sec }} /></button>}
          </div>
        </div>
      )}
      <div style={{ padding: '0 20px 20px' }}><div className="flex gap-2 overflow-x-auto noscroll fu d1">{fs.map(function (x) { return <Chip key={x.id} label={x.l} emoji={x.e} active={f === x.id} onClick={function () { sF(x.id); }} />; })}</div></div>
      <div style={{ padding: '0 20px' }}>
        {loading ? <SkeletonList count={3} /> :
          fl.length === 0 ? <EmptyState emoji={searchQ ? "\u{1F50D}" : "\u{1F4E6}"} title={searchQ ? "No results found" : "Nothing here yet"} desc={searchQ ? "Try a different search term or adjust filters." : "Your activities will appear here once you send or receive."} action={searchQ ? null : "Send First Package"} onAction={function () { props.onNav('send'); }} /> :
            fl.map(function (p, i) {
              var isReady = p.status === 'Ready'; var isDone = p.status === 'Delivered';
              return (
                <div key={p.id} className="flex gap-5 slide-in" style={{ animationDelay: (i * 0.08) + 's', marginBottom: 4 }}>
                  {/* Timeline line */}
                  <div className="flex flex-col items-center" style={{ width: 24, flexShrink: 0 }}>
                    <div style={{ width: 2.5, height: 20, background: i === 0 ? 'transparent' : T.border, borderRadius: 2 }} />
                    <div className={isReady ? 'glow' : ''} style={{ width: 14, height: 14, borderRadius: 7, background: isReady ? T.ok : isDone ? T.fill2 : T.warn, border: '3px solid ' + T.bg, boxShadow: isReady ? '0 0 12px ' + T.ok : 'none' }} />
                    <div style={{ width: 2.5, flex: 1, background: i === fl.length - 1 ? 'transparent' : T.border, borderRadius: 2 }} />
                  </div>

                  {/* Card */}
                  <button onClick={function () { props.onNav('pkg-detail', p); }} className="flex-1 text-left tap" style={{ borderRadius: 24, padding: 18, background: T.card, marginBottom: 20, border: '1.5px solid ' + (isReady ? T.ok + '40' : T.border), boxShadow: isReady ? '0 12px 32px rgba(16,185,129,0.12)' : T.shadowLg }}>
                    <div className="flex items-center gap-4">
                      <div style={{ width: 52, height: 52, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: isReady ? T.okBg : isDone ? T.fill : T.warnBg, border: '1px solid ' + (isReady ? T.ok + '20' : T.border) }}>{isReady ? '\u{2705}' : isDone ? '\u{1F389}' : '\u{1F69A}'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between" style={{ marginBottom: 6 }}><h3 className="truncate" style={{ fontWeight: 800, fontSize: 16, fontFamily: ff, color: T.text, letterSpacing: '-0.01em' }}>{p.name}</h3><span className="flex-shrink-0" style={{ fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 20, marginLeft: 8, background: isReady ? T.okBg : isDone ? T.fill : T.warnBg, color: isReady ? T.okDark : isDone ? T.sec : T.warn, fontFamily: ff, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.status}</span></div>
                        <div className="flex items-center gap-2">
                          <p style={{ fontSize: 13, color: T.muted, fontFamily: ff, fontWeight: 600 }}>{p.from}</p>
                          <ArrowRight style={{ width: 12, height: 12, color: T.muted, opacity: 0.5, strokeWidth: 3 }} />
                          <p className="truncate" style={{ fontSize: 13, color: T.text, fontFamily: ff, fontWeight: 800 }}>{p.toDisplayName || 'Locker'}</p>
                        </div>
                        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock style={{ width: 12, height: 12, color: T.muted }} />
                          <p style={{ fontSize: 11, color: T.muted, fontFamily: mf, fontWeight: 500 }}>{p.location} · <span style={{ color: T.sec }}>{p.time}</span></p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
      </div>
    </div>
  );
}
