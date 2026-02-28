import React, { useState, useEffect, useRef } from 'react';
import StatusBar from '../components/StatusBar';
import Ring from '../components/Ring';
import Badge from '../components/Badge';
import PriorityBadge, { getPriMeta, priOrder } from '../components/PriorityBadge';
import NavigationButton, { openNavigation } from '../components/NavigationModal';
import SwipeConfirm from '../components/SwipeConfirm';
import { ArrowLeft, Filter, Search, X, ChevronDown, MapPin, Check, Package, Truck, Camera, Shield, CheckCircle, RotateCcw, RefreshCw, AlertTriangle, User, Clock, Home, Copy, Phone, Navigation, Box } from '../components/Icons';
import { lockersData } from '../data/mockData';
import { SizeIcon, sizeColor } from './HomeScreen';

const TasksScreen = ({ tasks, setTasks, onBack, T }) => {
  const [activeTab, setActiveTab] = useState('assigned');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [dropModal, setDropModal] = useState(null);
  const [dropView, setDropView] = useState('choice');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ priority: 'all', locker: 'all', size: 'all' });
  const searchRef = useRef(null);
  const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length;

  const priMeta = getPriMeta(T);
  const genCode = (pre, trk) => { let h = 0; for (let i = 0; i < trk.length; i++)h = ((h << 5) - h) + trk.charCodeAt(i); return pre + '-' + (Math.abs(h) % 9000 + 1000) };

  const tabs = [
    { id: 'assigned', label: 'Assigned', icon: '\uD83D\uDCE6', color: T.blue, bg: T.blueBg },
    { id: 'accepted', label: 'Accepted', icon: '\uD83D\uDCCB', color: T.amber, bg: T.amberBg },
    { id: 'inTransit', label: 'In Transit', icon: '\uD83D\uDE9A', color: T.purple, bg: T.purpleBg },
    { id: 'deposited', label: 'Deposited', icon: '\u2705', color: T.green, bg: T.greenBg },
    { id: 'recall', label: 'Recall', icon: '\u21A9\uFE0F', color: T.red, bg: T.redBg },
  ];

  const counts = tabs.reduce((a, t) => ({ ...a, [t.id]: tasks.filter(tk => tk.tab === t.id).length }), {});
  const totalActive = counts.assigned + counts.accepted + counts.inTransit;

  const filtered = tasks.filter(t => {
    if (t.tab !== activeTab) return false;
    if (search) { const q = search.toLowerCase(); if (!(t.trk.toLowerCase().includes(q) || t.locker.toLowerCase().includes(q) || t.receiver.toLowerCase().includes(q) || t.sender.toLowerCase().includes(q))) return false }
    if (filters.priority !== 'all' && t.pri !== filters.priority) return false;
    if (filters.locker !== 'all' && t.locker !== filters.locker) return false;
    if (filters.size !== 'all' && t.sz !== filters.size) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'priority') return (priOrder[a.pri] ?? 3) - (priOrder[b.pri] ?? 3);
    if (sortBy === 'size') { const o = { S: 0, M: 1, L: 2, XL: 3 }; return o[a.sz] - o[b.sz] }
    if (sortBy === 'locker') return a.locker.localeCompare(b.locker);
    return 0;
  });

  const showToast = (msg, color) => { setToast({ msg, color }); setTimeout(() => setToast(null), 2200) };

  const moveTask = (id, to, label) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const extra = to === 'accepted' ? { acceptedAt: now } : to === 'inTransit' ? { inTransitAt: now } : to === 'deposited' ? { depositedAt: now } : {};
    setTasks(prev => prev.map(t => t.id === id ? { ...t, tab: to, ...extra } : t));
    setExpandedId(null); setModal(null);
    showToast(label || 'Updated', to === 'deposited' ? T.green : to === 'inTransit' ? T.purple : to === 'accepted' ? T.amber : T.blue);
  };

  const copyTrk = (trk) => { navigator.clipboard?.writeText(trk); setCopiedId(trk); setTimeout(() => setCopiedId(null), 1500) };

  useEffect(() => { if (showSearch && searchRef.current) searchRef.current.focus() }, [showSearch]);

  const currentTab = tabs.find(t => t.id === activeTab);
  const progressPct = tasks.length > 0 ? Math.round((counts.deposited / tasks.length) * 100) : 0;

  return <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: 88 }}>
    <StatusBar />

    {/* Header */}
    <div style={{ padding: '8px 20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        {onBack && <button onClick={onBack} className="press" style={{ width: 40, height: 40, borderRadius: 20, background: T.fill, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={20} /></button>}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Tasks</h1>
          <p style={{ fontSize: 13, color: T.sec, margin: 0 }}>{totalActive} active {'\u00B7'} {counts.deposited} deposited</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="tap" style={{ width: 40, height: 40, borderRadius: 20, background: showFilters || activeFilterCount > 0 ? T.blue : T.fill, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: showFilters || activeFilterCount > 0 ? '#fff' : T.text, position: 'relative' }}>
          <Filter size={18} />
          {activeFilterCount > 0 && <div style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: 8, background: T.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{activeFilterCount}</span></div>}
        </button>
        <button onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearch('') }} className="tap" style={{ width: 40, height: 40, borderRadius: 20, background: showSearch ? T.text : T.fill, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: showSearch ? '#fff' : T.text }}>
          {showSearch ? <X size={18} /> : <Search size={18} />}
        </button>
      </div>

      {showSearch && <div className="sd" style={{ marginBottom: 12, position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.muted }} />
        <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by tracking, locker, name..." style={{ width: '100%', height: 44, borderRadius: 12, border: `1.5px solid ${T.border}`, padding: '0 14px 0 40px', fontSize: 14, fontWeight: 500, background: T.fill }} />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: T.muted, padding: 4 }}><X size={14} /></button>}
      </div>}

      {showFilters && <div className="sd" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, alignSelf: 'center', marginRight: 4 }}>Priority:</span>
          {['all', 'urgent', 'timeSensitive', 'sameDay', 'normal'].map(p => (
            <button key={p} onClick={() => setFilters(f => ({ ...f, priority: p }))} className="tap" style={{ height: 28, padding: '0 10px', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 600, background: filters.priority === p ? T.text : T.fill, color: filters.priority === p ? '#fff' : T.sec }}>{p === 'all' ? 'All' : p === 'timeSensitive' ? 'Time Sens.' : (priMeta[p] || {}).label || p}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, alignSelf: 'center', marginRight: 4 }}>Locker:</span>
          <button onClick={() => setFilters(f => ({ ...f, locker: 'all' }))} className="tap" style={{ height: 28, padding: '0 10px', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 600, background: filters.locker === 'all' ? T.text : T.fill, color: filters.locker === 'all' ? '#fff' : T.sec }}>All</button>
          {lockersData.map(l => (
            <button key={l.id} onClick={() => setFilters(f => ({ ...f, locker: l.name }))} className="tap" style={{ height: 28, padding: '0 10px', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 600, background: filters.locker === l.name ? T.text : T.fill, color: filters.locker === l.name ? '#fff' : T.sec }}>{l.name.split(' ')[0]}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, marginRight: 4 }}>Size:</span>
          {['all', 'S', 'M', 'L', 'XL'].map(s => (
            <button key={s} onClick={() => setFilters(f => ({ ...f, size: s }))} className="tap" style={{ height: 28, padding: '0 10px', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 600, background: filters.size === s ? T.text : T.fill, color: filters.size === s ? '#fff' : T.sec }}>{s === 'all' ? 'All' : s}</button>
          ))}
          {activeFilterCount > 0 && <button onClick={() => setFilters({ priority: 'all', locker: 'all', size: 'all' })} className="tap" style={{ marginLeft: 'auto', height: 28, padding: '0 10px', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 600, background: T.redBg, color: T.red }}>Clear All</button>}
        </div>
      </div>}
    </div>

    {/* Overall progress */}
    <div style={{ padding: '0 20px', marginBottom: 20 }}>
      <div style={{ borderRadius: 12, padding: 16, background: T.gradient, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div><p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>Shift Progress</p><h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{progressPct}%</h2></div>
          <Ring pct={progressPct} sz={44} sw={4} color="#fff" T={T}><span style={{ fontSize: 12, fontWeight: 700 }}>{counts.deposited}</span></Ring>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#fff', width: `${progressPct}%`, transition: 'width 1s ease' }} />
        </div>
      </div>
    </div>

    {/* Summary cards */}
    <div style={{ padding: '0 20px', marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }} className="no-sb">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setExpandedId(null); setSearch('') }} className="tap" style={{ borderRadius: 8, padding: '10px 14px', flex: '0 0 auto', background: activeTab === t.id ? T.text : T.fill, color: activeTab === t.id ? '#fff' : T.sec, border: 'none', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{counts[t.id]}</div>
            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.8 }}>{t.label}</div>
          </button>
        ))}
      </div>
    </div>

    {/* Sort bar */}
    <div style={{ padding: '0 20px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: currentTab.color }}>{currentTab.icon}</span>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{currentTab.label}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>({filtered.length}{activeTab === 'assigned' ? ' across ' + [...new Set(filtered.map(t => t.locker))].length + ' locations' : ''})</span>
        </div>
        {activeTab !== 'assigned' && <div style={{ display: 'flex', gap: 4 }}>
          {[{ id: 'default', l: 'All' }, { id: 'priority', l: '\u26A1 Urgent' }, { id: 'locker', l: '\uD83D\uDCCD Locker' }].map(s => (
            <button key={s.id} onClick={() => setSortBy(s.id)} className="tap" style={{ height: 28, padding: '0 10px', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 600, background: sortBy === s.id ? T.text : T.fill, color: sortBy === s.id ? '#fff' : T.sec }}>{s.l}</button>
          ))}
        </div>}
      </div>
    </div>

    {/* Assigned - Locker drop-off locations */}
    {activeTab === 'assigned' && <div style={{ padding: '0 20px' }}>
      {(() => {
        const locGroups = {};
        filtered.forEach(t => { if (!locGroups[t.locker]) locGroups[t.locker] = { locker: t.locker, addr: t.addr, packages: [] }; locGroups[t.locker].packages.push(t) });
        const groups = Object.values(locGroups);
        if (groups.length === 0) return (
          <div style={{ textAlign: 'center', padding: '48px 20px', borderRadius: 12, background: T.fill }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.blueBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>{'\uD83D\uDCE6'}</div>
            <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>No {search ? 'matches' : 'drop-off assignments'}</p>
            <p style={{ fontSize: 14, color: T.sec, margin: 0 }}>{search ? `No results for "${search}"` : 'New locker assignments will appear here'}</p>
            {search && <button onClick={() => setSearch('')} className="tap" style={{ marginTop: 12, height: 36, padding: '0 20px', borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.bg, fontWeight: 600, fontSize: 13 }}>Clear Search</button>}
          </div>
        );
        return <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {groups.map((g, gi) => {
            const isLocExpanded = expandedId === ('loc-' + g.locker);
            const totalWeight = g.packages.reduce((s, p) => s + parseFloat(p.weight), 0).toFixed(1);
            return (
              <div key={g.locker} style={{ borderRadius: 12, overflow: 'hidden', background: T.card, border: `1px solid ${T.border}`, marginBottom: 12 }}>
                <button onClick={() => setExpandedId(isLocExpanded ? null : 'loc-' + g.locker)} className="tap" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 18, background: T.fill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={18} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{g.locker}</p>
                    <p style={{ fontSize: 12, color: T.sec, margin: 0 }}>{g.packages.length} packages {'\u00B7'} {g.addr}</p>
                  </div>
                  <ChevronDown size={18} style={{ transform: isLocExpanded ? 'rotate(180deg)' : 'none', transition: 'all .2s' }} />
                </button>
                <div style={{ padding: '0 12px 12px', display: 'flex', gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.sec, background: T.fill, padding: '4px 8px', borderRadius: 6 }}>{g.packages.length} packages</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.sec, background: T.fill, padding: '4px 8px', borderRadius: 6 }}>{totalWeight} kg</div>
                </div>
                {isLocExpanded && (
                  <div style={{ borderTop: `1px solid ${T.border}` }}>
                    <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ flex: 2, fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Package</span>
                      <span style={{ flex: 2, fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Location</span>
                      <span style={{ flex: 1, fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Status</span>
                    </div>
                    {g.packages.map((task) => (
                      <button key={task.id} onClick={(e) => { e.stopPropagation(); setDropModal(task); setDropView('choice') }} className="tap" style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '12px 16px', border: 'none', background: 'transparent', borderTop: `1px solid ${T.fill}`, textAlign: 'left', gap: 12 }}>
                        <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                          <SizeIcon sz={task.sz} T={T} />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{task.trk}</p>
                            <p style={{ fontSize: 12, color: T.sec, margin: 0 }}>{task.sz} {'\u00B7'} {task.weight}</p>
                          </div>
                        </div>
                        <div style={{ flex: 2, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: 13, margin: 0 }}>{task.receiver}</p>
                        </div>
                        <Badge v="info" sm T={T}>New</Badge>
                      </button>
                    ))}
                    <div style={{ padding: '12px' }}>
                      <button onClick={() => { g.packages.forEach(p => moveTask(p.id, 'accepted', 'Package accepted')); }} className="tap" style={{ width: '100%', height: 40, borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 13, background: T.blue, color: '#fff' }}>Accept All ({g.packages.length})</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>;
      })()}
    </div>}

    {/* Accepted */}
    {activeTab === 'accepted' && <div style={{ padding: '0 20px' }}>
      {(() => {
        const locGroups = {};
        filtered.forEach(t => { if (!locGroups[t.locker]) locGroups[t.locker] = { locker: t.locker, addr: t.addr, packages: [] }; locGroups[t.locker].packages.push(t) });
        const groups = Object.values(locGroups);
        if (groups.length === 0) return (
          <div style={{ textAlign: 'center', padding: '48px 20px', borderRadius: 12, background: T.fill }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.amberBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Truck size={24} style={{ color: T.amber }} /></div>
            <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>No {search ? 'matches' : 'accepted packages'}</p>
            <p style={{ fontSize: 14, color: T.sec, margin: 0 }}>{search ? `No results for "${search}"` : 'Accept assigned packages to start deliveries'}</p>
            {search && <button onClick={() => setSearch('')} className="tap" style={{ marginTop: 12, height: 36, padding: '0 20px', borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.bg, fontWeight: 600, fontSize: 13 }}>Clear Search</button>}
            {!search && <button onClick={() => { setActiveTab('assigned'); setExpandedId(null) }} className="tap" style={{ marginTop: 16, height: 40, padding: '0 20px', borderRadius: 10, border: 'none', background: T.blue, color: '#fff', fontWeight: 700, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Package size={14} />View Assigned</button>}
          </div>
        );
        return <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {groups.map((g) => {
            const isLocExpanded = expandedId === ('acc-' + g.locker);
            const lockerInfo = lockersData.find(l => l.name === g.locker);
            const totalWeight = g.packages.reduce((s, p) => s + parseFloat(p.weight), 0).toFixed(1);
            return (
              <div key={g.locker} style={{ borderRadius: 12, overflow: 'hidden', background: T.card, border: `1px solid ${T.border}`, marginBottom: 12 }}>
                <button onClick={() => setExpandedId(isLocExpanded ? null : 'acc-' + g.locker)} className="tap" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 18, background: T.fill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={18} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{g.locker}</p>
                    <p style={{ fontSize: 12, color: T.sec, margin: 0 }}>{g.packages.length} packages {'\u00B7'} {g.addr}</p>
                  </div>
                  <ChevronDown size={18} style={{ transform: isLocExpanded ? 'rotate(180deg)' : 'none', transition: 'all .2s' }} />
                </button>
                <div style={{ padding: '0 12px 12px', display: 'flex', gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.sec, background: T.fill, padding: '4px 8px', borderRadius: 6 }}>{g.packages.length} packages</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.sec, background: T.fill, padding: '4px 8px', borderRadius: 6 }}>{totalWeight} kg</div>
                </div>
                {isLocExpanded && (
                  <div style={{ borderTop: `1px solid ${T.border}` }}>
                    <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ flex: 2, fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Package</span>
                      <span style={{ flex: 2, fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Recipient</span>
                      <span style={{ flex: 1, fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Action</span>
                    </div>
                    {g.packages.map((task) => (
                      <button key={task.id} onClick={(e) => { e.stopPropagation(); moveTask(task.id, 'inTransit', 'Delivery started') }} className="tap" style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '12px 16px', border: 'none', background: 'transparent', borderTop: `1px solid ${T.fill}`, textAlign: 'left', gap: 12 }}>
                        <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                          <SizeIcon sz={task.sz} T={T} />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{task.trk}</p>
                            <p style={{ fontSize: 12, color: T.sec, margin: 0 }}>{task.sz} {'\u00B7'} {task.weight}</p>
                          </div>
                        </div>
                        <div style={{ flex: 2, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: 13, margin: 0 }}>{task.receiver}</p>
                        </div>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.amberBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Truck size={16} style={{ color: T.amber }} />
                          </div>
                        </div>
                      </button>
                    ))}
                    <div style={{ padding: '12px', display: 'flex', gap: 8 }}>
                      <button onClick={() => openNavigation(g.locker, g.addr, lockerInfo?.lat, lockerInfo?.lng)} className="tap" style={{ flex: 1, height: 40, borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: T.text }}>
                        <Navigation size={16} />Navigate
                      </button>
                      <button onClick={() => { g.packages.forEach(p => moveTask(p.id, 'inTransit', 'Delivery started')) }} className="tap" style={{ flex: 2, height: 40, borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 13, background: T.amber, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <Truck size={16} />Start All ({g.packages.length})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>;
      })()}
    </div>}

    {/* Package list (inTransit, deposited, recall) */}
    {activeTab !== 'assigned' && activeTab !== 'accepted' && <div style={{ padding: '0 20px' }}>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 20px', borderRadius: 12, background: T.fill }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: currentTab.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>{currentTab.icon}</div>
          <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>No {search ? 'matches' : activeTab === 'deposited' ? 'deliveries yet' : activeTab === 'inTransit' ? 'packages in transit' : 'recalled packages'}</p>
          <p style={{ fontSize: 14, color: T.sec, margin: 0 }}>{search ? `No results for "${search}"` : activeTab === 'deposited' ? 'Deposited packages will appear here' : activeTab === 'inTransit' ? 'Start deliveries from the Accepted tab' : 'No recalled packages at this time'}</p>
          {search && <button onClick={() => setSearch('')} className="tap" style={{ marginTop: 12, height: 36, padding: '0 20px', borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.bg, fontWeight: 600, fontSize: 13 }}>Clear Search</button>}
          {!search && activeTab === 'deposited' && <button onClick={() => { setActiveTab('assigned'); setExpandedId(null) }} className="tap" style={{ marginTop: 16, height: 40, padding: '0 20px', borderRadius: 10, border: 'none', background: T.green, color: '#fff', fontWeight: 700, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Truck size={14} />Start Delivering</button>}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((task) => {
          const isExpanded = expandedId === task.id;
          return (
            <div key={task.id} style={{ borderRadius: 12, overflow: 'hidden', background: T.card, border: `1px solid ${T.border}`, marginBottom: 12 }}>
              <button onClick={() => setExpandedId(isExpanded ? null : task.id)} className="tap" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <SizeIcon sz={task.sz} T={T} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{task.trk}</p>
                  <p style={{ fontSize: 12, color: T.sec, margin: 0 }}>{task.locker} {'\u00B7'} {task.weight}</p>
                </div>
                <ChevronDown size={16} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'all .2s' }} />
              </button>

              {isExpanded && (
                <div style={{ borderTop: `1px solid ${T.border}` }}>
                  {/* Status timeline */}
                  <div style={{ padding: '16px 16px 4px', display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', scrollbarWidth: 'none' }} className="no-sb">
                    {[{ id: 'assigned', l: 'Assigned' }, { id: 'accepted', l: 'Accepted' }, { id: 'inTransit', l: 'In Transit' }, { id: 'deposited', l: 'Deposited' }].map((step, si) => {
                      const stepIdx = { assigned: 0, accepted: 1, inTransit: 2, deposited: 3 };
                      const taskIdx = stepIdx[task.tab] ?? 0;
                      const done = si <= taskIdx;
                      const active = si === taskIdx;
                      return <React.Fragment key={step.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                          <div style={{ width: 24, height: 24, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, background: done ? (active ? currentTab.color : T.green) : T.fill, color: done ? '#fff' : T.muted, boxShadow: done ? `0 4px 8px ${active ? currentTab.color : T.green}30` : 'none', transition: 'all 0.3s' }}>
                            {si < taskIdx ? <Check size={12} strokeWidth={3} /> : si + 1}
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: done ? T.text : T.muted, whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>{step.l}</span>
                        </div>
                        {si < 3 && <div style={{ minWidth: 16, flex: 1, height: 2, borderRadius: 1, background: si < taskIdx ? T.green : T.fill, alignSelf: 'center' }} />}
                      </React.Fragment>;
                    })}
                  </div>

                  {/* Detail grid */}
                  <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                    {[
                      { l: 'Sender', v: task.sender, ic: <User size={12} /> },
                      { l: 'Receiver', v: task.receiver, ic: <User size={12} /> },
                      { l: 'Locker', v: task.locker, ic: <MapPin size={12} /> },
                      { l: 'ETA', v: task.eta, ic: <Clock size={12} /> },
                      { l: 'Address', v: task.addr, ic: <Home size={12} /> },
                      { l: 'Specs', v: `${task.sz} \u00B7 ${task.weight}`, ic: <Box size={12} /> },
                    ].map((d, di) => (
                      <div key={di} style={{ padding: '12px', background: T.fill, borderRadius: 12, border: `1px solid ${T.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, opacity: 0.6 }}>
                          <span style={{ color: T.sec }}>{d.ic}</span>
                          <p style={{ fontSize: 10, fontWeight: 700, color: T.muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.l}</p>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: T.text, lineHeight: 1.3 }}>{d.v}</p>
                      </div>
                    ))}
                  </div>

                  {(task.ageRestricted || task.highValue) && <div style={{ margin: '0 14px 12px', borderRadius: 12, padding: 12, background: T.redBg, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Shield size={16} style={{ color: T.red }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.red }}>{task.ageRestricted ? 'Age Restricted' : 'High Value'} -- ID Required</span>
                  </div>}

                  {activeTab === 'recall' && <div style={{ margin: '0 14px 12px', borderRadius: 12, padding: 12, background: T.redBg, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <AlertTriangle size={16} style={{ color: T.red }} />
                    </div>
                    <div><p style={{ fontSize: 12, fontWeight: 700, color: T.red, margin: '0 0 2px' }}>Recall Reason</p><p style={{ fontSize: 13, color: T.redDark, margin: 0 }}>{task.reason}</p></div>
                  </div>}

                  {/* Quick actions */}
                  <div style={{ padding: '0 14px', display: 'flex', gap: 6, marginBottom: 8 }}>
                    <button onClick={() => copyTrk(task.trk)} className="tap" style={{ height: 32, padding: '0 10px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: copiedId === task.trk ? T.green : T.sec }}>
                      {copiedId === task.trk ? <><Check size={12} />Copied</> : <><Copy size={12} />Copy ID</>}
                    </button>
                    <button onClick={() => window.open('tel:' + task.phone.replace(/\s/g, ''))} className="tap" style={{ height: 32, padding: '0 10px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: T.sec }}>
                      <Phone size={12} />Call
                    </button>
                    <NavigationButton name={task.locker} addr={task.addr} lat={(lockersData.find(l => l.name === task.locker) || {}).lat} lng={(lockersData.find(l => l.name === task.locker) || {}).lng} compact T={T} />
                  </div>

                  {/* Status info */}
                  <div style={{ padding: '8px 14px 14px' }}>
                    {activeTab === 'inTransit' && (
                      <div style={{ borderRadius: 12, padding: 12, background: T.purpleBg, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 16, background: T.purple, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Truck size={16} style={{ color: '#fff' }} /></div>
                        <div><p style={{ fontSize: 13, fontWeight: 700, color: T.purple, margin: 0 }}>In transit to locker</p><p style={{ fontSize: 12, color: T.sec, margin: 0 }}>Deposit at terminal when you arrive</p></div>
                      </div>
                    )}
                    {activeTab === 'recall' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ borderRadius: 14, padding: 16, background: T.fill, textAlign: 'center' }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: T.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pick Up Code</p>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
                            {genCode('PKU', task.trk).split('').map((ch, ci) => (
                              <div key={ci} style={{ width: 34, height: 42, borderRadius: 8, background: ch === '-' ? 'transparent' : '#fff', border: ch === '-' ? 'none' : `1.5px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: ch === '-' ? 18 : 20, fontWeight: 700, color: T.red }}>
                                {ch}
                              </div>
                            ))}
                          </div>
                          <p style={{ fontSize: 12, color: T.sec, margin: 0 }}>Enter this code at the locker to pick up</p>
                        </div>
                        <div style={{ borderRadius: 12, padding: 12, background: T.redBg, display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 16, background: T.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RefreshCw size={14} style={{ color: '#fff' }} /></div>
                          <div><p style={{ fontSize: 13, fontWeight: 700, color: T.red, margin: 0 }}>Confirmed automatically</p><p style={{ fontSize: 12, color: T.sec, margin: 0 }}>Locker verifies pick-up via code</p></div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'deposited' && (
                      <div style={{ borderRadius: 12, padding: 12, background: T.greenBg, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 16, background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={16} style={{ color: '#fff' }} /></div>
                        <div><p style={{ fontSize: 13, fontWeight: 700, color: T.greenDark, margin: 0 }}>Deposited at {task.depositedAt}</p><p style={{ fontSize: 12, color: T.green, margin: 0 }}>Customer notified via SMS</p></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>}

    {/* Context-aware modal */}
    {dropModal && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => { setDropModal(null); setDropView('choice') }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.3)' }} />
        <div className="su" onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: 448, background: T.bg, borderRadius: '24px 24px 0 0', padding: '24px 24px 32px', boxShadow: T.shadowLg }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: T.fill2, margin: '0 auto 16px' }} />

          {dropModal.tab === 'assigned' && <>
            {dropView === 'choice' && <>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: T.blueBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Camera size={22} style={{ color: T.blue }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>Scan to Accept</h3>
                <p style={{ fontSize: 14, color: T.sec, margin: 0 }}>{dropModal.trk} {'\u00B7'} {dropModal.sz} {'\u00B7'} {dropModal.weight}</p>
              </div>
              <div style={{ borderRadius: 12, padding: 14, background: T.card, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <SizeIcon sz={dropModal.sz} T={T} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 2px' }}>{dropModal.receiver}</p>
                  <p style={{ fontSize: 12, color: T.sec, margin: 0 }}>{dropModal.locker} {'\u00B7'} {dropModal.addr}</p>
                </div>
                <PriorityBadge pri={dropModal.pri} sm T={T} />
              </div>
              <button onClick={() => setDropView('scanning')} className="press" style={{ width: '100%', height: 52, borderRadius: 14, border: 'none', fontWeight: 700, fontSize: 16, background: T.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
                <Camera size={20} />Scan Package Barcode
              </button>
              <button onClick={() => { setDropModal(null); setDropView('choice') }} className="tap" style={{ width: '100%', height: 44, borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.bg, fontWeight: 600, fontSize: 14, color: T.sec }}>Cancel</button>
            </>}
            {dropView === 'scanning' && <>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 200, height: 200, borderRadius: 12, background: T.fill, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 12, border: `2px dashed ${T.blue}`, borderRadius: 10 }} />
                  <Camera size={40} style={{ color: T.muted }} />
                  <div style={{ position: 'absolute', top: '50%', left: 12, right: 12, height: 2, background: T.blue, opacity: 0.6, animation: 'slideDown 1.5s ease-in-out infinite' }} />
                </div>
                <p style={{ fontWeight: 700, margin: '0 0 4px' }}>Scanning {dropModal.trk}</p>
                <p style={{ fontSize: 14, color: T.sec, margin: '0 0 20px' }}>Align the package barcode within the frame</p>
                <button onClick={() => setDropView('confirmed')} className="tap" style={{ height: 48, padding: '0 32px', borderRadius: 10, border: 'none', fontWeight: 600, background: T.fill, marginBottom: 10 }}>Simulate Scan</button>
                <br /><button onClick={() => setDropView('choice')} className="tap" style={{ border: 'none', background: 'none', fontSize: 14, fontWeight: 600, color: T.sec }}>Back</button>
              </div>
            </>}
            {dropView === 'confirmed' && <>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: T.greenBg, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={32} height={32} viewBox="0 0 40 40"><circle cx={20} cy={20} r={18} fill="none" stroke={T.green} strokeWidth={3} /><path d="M12 20l6 6 10-12" fill="none" stroke={T.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} style={{ animation: 'checkAnim .5s ease forwards' }} /></svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: T.green, margin: '0 0 4px' }}>Package Verified</h3>
                <p style={{ fontSize: 14, color: T.sec, margin: '0 0 20px' }}>{dropModal.trk} matched successfully</p>
                <button onClick={() => { moveTask(dropModal.id, 'accepted', 'Package accepted'); setDropModal(null); setDropView('choice') }} className="press" style={{ width: '100%', height: 52, borderRadius: 14, border: 'none', fontWeight: 700, fontSize: 16, background: T.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Check size={20} />Accept Package
                </button>
              </div>
            </>}
          </>}

          {dropModal.tab === 'inTransit' && <>
            {dropView === 'choice' && <>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: T.amberBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Package size={22} style={{ color: T.amber }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>Deposit Package</h3>
                <p style={{ fontSize: 14, color: T.sec, margin: 0 }}>{dropModal.trk} {'\u00B7'} {dropModal.sz} {'\u00B7'} {dropModal.weight}</p>
              </div>
              <div style={{ borderRadius: 12, padding: 14, background: T.card, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <SizeIcon sz={dropModal.sz} T={T} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 2px' }}>{dropModal.receiver}</p>
                  <p style={{ fontSize: 12, color: T.sec, margin: 0 }}>{dropModal.locker} {'\u00B7'} {dropModal.addr}</p>
                </div>
                <PriorityBadge pri={dropModal.pri} sm T={T} />
              </div>
              <button onClick={() => setDropView('pin')} className="press" style={{ width: '100%', height: 52, borderRadius: 14, border: 'none', fontWeight: 700, fontSize: 16, background: T.amber, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
                <Shield size={20} />Request Drop-off PIN
              </button>
              <button onClick={() => { setDropModal(null); setDropView('choice') }} className="tap" style={{ width: '100%', height: 44, borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.bg, fontWeight: 600, fontSize: 14, color: T.sec }}>Cancel</button>
            </>}
            {dropView === 'pin' && <>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: T.purpleBg, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={28} style={{ color: T.purple }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>Drop-off PIN</h3>
                <p style={{ fontSize: 14, color: T.sec, margin: '0 0 20px' }}>Enter this PIN at the locker keypad</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
                  {genCode('PIN', dropModal.trk).split('').map((ch, ci) => (
                    <div key={ci} style={{ width: ch === '-' ? 16 : 44, height: 56, borderRadius: 10, background: ch === '-' ? 'transparent' : '#fff', border: ch === '-' ? 'none' : `2px solid ${T.purple}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: ch === '-' ? 20 : 24, fontWeight: 800, color: T.purple, boxShadow: ch === '-' ? 'none' : T.shadow }}>
                      {ch}
                    </div>
                  ))}
                </div>
                <div style={{ borderRadius: 12, padding: 14, background: T.purpleBg, marginBottom: 20, textAlign: 'left' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: T.purple, margin: '0 0 8px' }}>Instructions</p>
                  <div style={{ fontSize: 12, color: T.text, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['Go to the locker terminal', 'Select "Drop-off Package"', 'Enter the PIN code above', 'Place package in the opened compartment'].map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div style={{ width: 20, height: 20, borderRadius: 10, background: T.purple, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => { moveTask(dropModal.id, 'deposited', 'Package deposited'); setDropModal(null); setDropView('choice') }} className="press" style={{ width: '100%', height: 52, borderRadius: 14, border: 'none', fontWeight: 700, fontSize: 16, background: T.purple, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Check size={20} />Confirm Deposit
                </button>
                <button onClick={() => setDropView('choice')} className="tap" style={{ width: '100%', height: 40, borderRadius: 10, border: 'none', background: 'transparent', fontWeight: 600, fontSize: 14, color: T.sec, marginTop: 8 }}>Back</button>
              </div>
            </>}
          </>}
        </div>
      </div>
    )}

    {/* Confirmation modal */}
    {modal && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setModal(null)}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.3)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} />
        <div className="su" onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: 448, background: T.bg, borderRadius: '24px 24px 0 0', padding: '28px 24px 32px', boxShadow: T.shadowLg }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: T.fill2, margin: '0 auto 20px' }} />
          <div style={{ width: 48, height: 48, borderRadius: 12, background: modal.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            {modal.to === 'accepted' && <Package size={24} style={{ color: modal.color }} />}
            {modal.to === 'inTransit' && <Truck size={24} style={{ color: modal.color }} />}
            {modal.to === 'deposited' && <CheckCircle size={24} style={{ color: modal.color }} />}
            {modal.to === 'assigned' && <RotateCcw size={24} style={{ color: modal.color }} />}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{modal.label}</h3>
          <p style={{ fontSize: 14, color: T.sec, margin: '0 0 4px', textAlign: 'center' }}>{modal.desc}</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: '0 0 24px', textAlign: 'center' }}>{modal.task.trk} {'\u00B7'} {modal.task.locker}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setModal(null)} className="tap" style={{ flex: 1, height: 48, borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.bg, fontWeight: 700, fontSize: 14, color: T.sec }}>Cancel</button>
            <button onClick={() => moveTask(modal.task.id, modal.to, modal.label + ' complete')} className="tap" style={{ flex: 2, height: 48, borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 14, background: modal.color, color: '#fff' }}>{modal.label}</button>
          </div>
        </div>
      </div>
    )}

    {/* Toast notification */}
    {toast && (
      <div className="sd" style={{ position: 'fixed', top: 52, left: '50%', transform: 'translateX(-50%)', zIndex: 200, padding: '10px 20px', borderRadius: 12, background: T.text, color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: T.shadowLg }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: toast.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} style={{ color: '#fff' }} /></div>
        {toast.msg}
      </div>
    )}
  </div>;
};

export default TasksScreen;
