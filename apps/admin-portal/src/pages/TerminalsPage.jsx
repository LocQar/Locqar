import React, { useState, useMemo } from 'react';
import { Plus, Search, Grid3X3, Unlock, Package, Wrench, TrendingUp, Building2, MapPin, X, Wifi, WifiOff, AlertTriangle, DoorOpen, KeyRound, Copy, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { StatusBadge } from '../components/ui/Badge';
import { hasPermission, DOOR_SIZES } from '../constants';
import { terminalsData, phonePinData, getTerminalAddress, lockersData, packagesData, terminalErrorsData } from '../constants/mockData';

export const TerminalsPage = ({
  currentUser,
  terminalSearch,
  setTerminalSearch,
  terminalStatusFilter,
  setTerminalStatusFilter,
  filteredTerminals,
  addToast,
}) => {
  const { theme } = useTheme();
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [generatedPin, setGeneratedPin] = useState(null);
  const [copiedPin, setCopiedPin] = useState(false);

  const terminalDetails = useMemo(() => {
    if (!selectedTerminal) return null;
    const doors = lockersData.filter(l => l.terminalSn === selectedTerminal.sn);
    const packages = packagesData.filter(p => p.destination === selectedTerminal.name);
    const pinnedUsers = phonePinData.filter(p => p.pinnedTerminal === selectedTerminal.name);
    const errors = terminalErrorsData.filter(e => e.terminal === selectedTerminal.sn);
    return { doors, packages, pinnedUsers, errors };
  }, [selectedTerminal]);

  const handleRemoteOpen = (door) => {
    addToast?.({ type: 'success', message: `SetDoorOpen → SN: ${selectedTerminal.sn}, Door #${door.doorNo} — Door opened` });
  };

  const handleGeneratePin = () => {
    const pin = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedPin(pin);
    setShowPinModal(true);
    setCopiedPin(false);
  };

  const handleCopyPin = () => {
    if (generatedPin) {
      navigator.clipboard?.writeText(generatedPin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  const getDoorColor = (door) => {
    if (!door.enabled) return theme.text.muted;
    if (door.status === 'maintenance') return '#D48E8A';
    if (door.opened) return '#D4AA5A';
    if (door.occupied) return '#7EA8C9';
    return '#81C995';
  };

  const getDoorLabel = (door) => {
    if (!door.enabled) return 'Disabled';
    if (door.status === 'maintenance') return 'Maintenance';
    if (door.opened) return 'Open';
    if (door.occupied) return 'Occupied';
    return 'Available';
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Terminals</h1>
          <p style={{ color: theme.text.muted }}>{terminalsData.length} terminals &bull; {terminalsData.filter(t => t.connect === 1).length} connected</p>
        </div>
        {hasPermission(currentUser.role, 'terminals.manage') && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}><Plus size={18} />Add Terminal</button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          ['Total Lockers', terminalsData.reduce((s, t) => s + t.totalLockers, 0), Grid3X3, null],
          ['Available', terminalsData.reduce((s, t) => s + t.available, 0), Unlock, '#81C995'],
          ['Occupied', terminalsData.reduce((s, t) => s + t.occupied, 0), Package, '#7EA8C9'],
          ['Maintenance', terminalsData.reduce((s, t) => s + t.maintenance, 0), Wrench, '#D48E8A'],
          ['Utilization', `${Math.round(terminalsData.reduce((s, t) => s + t.occupied, 0) / terminalsData.reduce((s, t) => s + t.totalLockers, 0) * 100)}%`, TrendingUp, '#B5A0D1'],
        ].map(([l, v, I, c]) => (
          <div key={l} className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex items-center gap-2 mb-1">
              <I size={16} style={{ color: c || theme.accent.primary }} />
              <span className="text-xs" style={{ color: theme.text.muted }}>{l}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: c || theme.text.primary }}>{v}</p>
          </div>
        ))}
      </div>
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
          <input value={terminalSearch} onChange={e => setTerminalSearch(e.target.value)} placeholder="Search by name or SN..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
          {[['all', 'All'], ['online', 'Online'], ['maintenance', 'Maintenance']].map(([val, label]) => (
            <button key={val} onClick={() => setTerminalStatusFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: terminalStatusFilter === val ? theme.accent.primary : 'transparent', color: terminalStatusFilter === val ? theme.accent.contrast : theme.text.muted }}>{label}</button>
          ))}
        </div>
      </div>
      <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredTerminals.length} of {terminalsData.length} terminals</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerminals.map(t => {
          const utilPct = Math.round(t.occupied / t.totalLockers * 100);
          return (
            <div
              key={t.id}
              onClick={() => { setSelectedTerminal(t); setSelectedDoor(null); }}
              className="p-5 rounded-2xl border cursor-pointer hover:border-opacity-60 transition-all"
              style={{ backgroundColor: theme.bg.card, borderColor: selectedTerminal?.id === t.id ? theme.accent.primary : theme.border.primary }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.accent.primary}15` }}>
                    <Building2 size={20} style={{ color: theme.accent.primary }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: theme.text.primary }}>{t.name}</p>
                    <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{getTerminalAddress(t)}</p>
                    <p className="text-xs font-mono" style={{ color: theme.text.muted }}>SN: {t.sn}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={t.status} />
                  <div className="flex items-center gap-1">
                    {t.connect === 1 ? (
                      <><Wifi size={12} style={{ color: '#81C995' }} /><span className="text-xs" style={{ color: '#81C995' }}>Connected</span></>
                    ) : (
                      <><WifiOff size={12} style={{ color: '#D48E8A' }} /><span className="text-xs" style={{ color: '#D48E8A' }}>Disconnected</span></>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: theme.text.muted }}>Utilization</span>
                  <span className="text-xs font-medium" style={{ color: utilPct > 80 ? '#D48E8A' : utilPct > 60 ? '#D4AA5A' : '#81C995' }}>{utilPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${utilPct}%`, backgroundColor: utilPct > 80 ? '#D48E8A' : utilPct > 60 ? '#D4AA5A' : '#81C995' }} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[['Total', t.totalLockers, null], ['Open', t.available, '#81C995'], ['In Use', t.occupied, '#7EA8C9'], ['Maint.', t.maintenance, '#D48E8A']].map(([l, v, c]) => (
                  <div key={l} className="p-2 rounded-lg" style={{ backgroundColor: c ? `${c}10` : theme.bg.tertiary }}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                    <p className="text-lg font-bold" style={{ color: c || theme.text.primary }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Detail Drawer */}
      {selectedTerminal && terminalDetails && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => { setSelectedTerminal(null); setSelectedDoor(null); }}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-lg h-full overflow-y-auto p-6"
            style={{ backgroundColor: theme.bg.primary }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.accent.primary}15` }}>
                  <Building2 size={24} style={{ color: theme.accent.primary }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>{selectedTerminal.name}</h2>
                  <p className="text-sm font-mono" style={{ color: theme.accent.primary }}>{getTerminalAddress(selectedTerminal)}</p>
                </div>
              </div>
              <button onClick={() => { setSelectedTerminal(null); setSelectedDoor(null); }} className="p-2 rounded-xl" style={{ color: theme.text.muted }}><X size={20} /></button>
            </div>

            {/* Status & Info */}
            <div className="p-4 rounded-xl border mb-4" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium" style={{ color: theme.text.primary }}>Status</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedTerminal.status} />
                  {selectedTerminal.connect === 1 ? (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#81C99515', color: '#81C995' }}><Wifi size={12} />Connected</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#D48E8A15', color: '#D48E8A' }}><WifiOff size={12} />Disconnected</span>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ['Serial Number', selectedTerminal.sn],
                  ['Terminal ID', selectedTerminal.id],
                  ['Location', selectedTerminal.location],
                  ['Region', selectedTerminal.region],
                  ['Coordinates', `${selectedTerminal.lat}, ${selectedTerminal.lng}`],
                  ['Pinned Users', `${terminalDetails.pinnedUsers.length} customers`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <span style={{ color: theme.text.muted }}>{l}</span>
                    <span className="font-medium font-mono" style={{ color: theme.text.primary }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Door Grid */}
            <div className="p-4 rounded-xl border mb-4" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: theme.text.primary }}>Door Grid ({terminalDetails.doors.length} doors)</h3>
                <button onClick={handleGeneratePin} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: `${theme.accent.primary}15`, color: theme.accent.primary }}>
                  <KeyRound size={14} />Generate PIN
                </button>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-3">
                {[['Available', '#81C995'], ['Occupied', '#7EA8C9'], ['Open', '#D4AA5A'], ['Maintenance', '#D48E8A'], ['Disabled', theme.text.muted]].map(([l, c]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: c }} />
                    <span className="text-xs" style={{ color: theme.text.muted }}>{l}</span>
                  </div>
                ))}
              </div>
              {/* Door Cells */}
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
                {terminalDetails.doors.map(door => (
                  <button
                    key={door.id}
                    onClick={() => setSelectedDoor(selectedDoor?.id === door.id ? null : door)}
                    className="relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all hover:scale-105"
                    style={{
                      backgroundColor: getDoorColor(door),
                      color: '#1C1917',
                      outline: selectedDoor?.id === door.id ? `2px solid ${theme.accent.primary}` : 'none',
                      outlineOffset: '2px',
                    }}
                  >
                    <span>{door.doorNo}</span>
                    <span className="text-[9px] font-normal opacity-80">{DOOR_SIZES[door.size]?.short}</span>
                  </button>
                ))}
              </div>

              {/* Selected Door Detail */}
              {selectedDoor && (
                <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold" style={{ color: theme.text.primary }}>Door #{selectedDoor.doorNo}</h4>
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: `${getDoorColor(selectedDoor)}20`, color: getDoorColor(selectedDoor) }}>
                      {getDoorLabel(selectedDoor)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    {[
                      ['Size', DOOR_SIZES[selectedDoor.size]?.label || 'Unknown'],
                      ['Enabled', selectedDoor.enabled ? 'Yes' : 'No'],
                      ['Occupied', selectedDoor.occupied ? 'Yes' : 'No'],
                      ['Door State', selectedDoor.opened ? 'Open' : 'Closed'],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between p-2 rounded-lg" style={{ backgroundColor: theme.bg.card }}>
                        <span className="text-xs" style={{ color: theme.text.muted }}>{l}</span>
                        <span className="text-xs font-medium" style={{ color: theme.text.primary }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  {selectedDoor.package && (
                    <p className="text-xs mb-3" style={{ color: theme.text.muted }}>Package: <span className="font-mono" style={{ color: theme.accent.primary }}>{selectedDoor.package}</span></p>
                  )}
                  <button
                    onClick={() => handleRemoteOpen(selectedDoor)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ backgroundColor: `#D4AA5A20`, color: '#D4AA5A' }}
                  >
                    <DoorOpen size={16} />Remote Open Door
                  </button>
                </div>
              )}
            </div>

            {/* Locker Breakdown */}
            <div className="p-4 rounded-xl border mb-4" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text.primary }}>Capacity Overview</h3>
              <div className="grid grid-cols-4 gap-3 text-center mb-4">
                {[['Total', selectedTerminal.totalLockers, null], ['Available', selectedTerminal.available, '#81C995'], ['Occupied', selectedTerminal.occupied, '#7EA8C9'], ['Maint.', selectedTerminal.maintenance, '#D48E8A']].map(([l, v, c]) => (
                  <div key={l} className="p-3 rounded-xl" style={{ backgroundColor: c ? `${c}10` : theme.bg.tertiary }}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                    <p className="text-xl font-bold" style={{ color: c || theme.text.primary }}>{v}</p>
                  </div>
                ))}
              </div>
              {/* Size Distribution */}
              <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Size Distribution (estimated)</h4>
              <div className="space-y-2">
                {[
                  { label: 'Small', pct: 30, color: '#81C995' },
                  { label: 'Medium', pct: 35, color: '#7EA8C9' },
                  { label: 'Large', pct: 25, color: '#B5A0D1' },
                  { label: 'XLarge', pct: 10, color: '#D4AA5A' },
                ].map(s => {
                  const count = Math.floor(selectedTerminal.totalLockers * s.pct / 100);
                  return (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="text-xs w-14" style={{ color: theme.text.secondary }}>{s.label}</span>
                      <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                        <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                      </div>
                      <span className="text-xs font-mono w-8 text-right" style={{ color: theme.text.muted }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Log */}
            {terminalDetails.errors.length > 0 && (
              <div className="p-4 rounded-xl border mb-4" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} style={{ color: '#D48E8A' }} />
                  <h3 className="text-sm font-semibold" style={{ color: theme.text.primary }}>Error Log ({terminalDetails.errors.length})</h3>
                </div>
                <div className="space-y-2">
                  {terminalDetails.errors.map(err => (
                    <div key={err.id} className="p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold" style={{ color: '#D48E8A' }}>{err.errorCode}</span>
                        <span className="text-xs" style={{ color: theme.text.muted }}>{err.createTime}</span>
                      </div>
                      <p className="text-sm" style={{ color: theme.text.primary }}>{err.describe}</p>
                      {err.doorNo && <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Door #{err.doorNo}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Packages */}
            {terminalDetails.packages.length > 0 && (
              <div className="p-4 rounded-xl border mb-4" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text.primary }}>Packages ({terminalDetails.packages.length})</h3>
                <div className="space-y-2">
                  {terminalDetails.packages.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                      <div>
                        <span className="font-mono text-sm font-medium" style={{ color: theme.text.primary }}>{p.waybill}</span>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{p.customer}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pinned Users */}
            {terminalDetails.pinnedUsers.length > 0 && (
              <div className="p-4 rounded-xl border" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text.primary }}>Pinned Users ({terminalDetails.pinnedUsers.length})</h3>
                <div className="space-y-2">
                  {terminalDetails.pinnedUsers.map((u, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{u.customer}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{u.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{u.pinnedAddress}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>Since {u.pinnedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setShowPinModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative p-6 rounded-2xl border w-full max-w-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Generated PIN Code</h3>
              <button onClick={() => setShowPinModal(false)} className="p-1 rounded-lg" style={{ color: theme.text.muted }}><X size={18} /></button>
            </div>
            <p className="text-xs mb-3" style={{ color: theme.text.muted }}>
              Terminal: <span className="font-mono" style={{ color: theme.text.primary }}>{selectedTerminal?.sn}</span>
            </p>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl mb-4" style={{ backgroundColor: theme.bg.tertiary }}>
              <span className="text-4xl font-mono font-bold tracking-[0.3em]" style={{ color: theme.accent.primary }}>{generatedPin}</span>
              <button onClick={handleCopyPin} className="p-2 rounded-lg transition-colors" style={{ color: copiedPin ? '#81C995' : theme.text.muted }}>
                {copiedPin ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <p className="text-xs text-center" style={{ color: theme.text.muted }}>This PIN simulates the SetPinCode API response</p>
          </div>
        </div>
      )}
    </div>
  );
};
