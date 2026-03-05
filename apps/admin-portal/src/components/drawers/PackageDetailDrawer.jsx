import React, { useState } from 'react';
import { X, Edit, Printer, Grid3X3, Timer, Banknote, CheckCircle2, RefreshCw, PackageX, MessageSquare, Save } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { StatusBadge, DeliveryMethodBadge, PackageStatusFlow } from '../ui';
import { hasPermission, DELIVERY_METHODS } from '../../constants';
import { terminalsData, getLockerAddress, getTerminalAddress } from '../../constants/mockData';

const printLabel = (pkg) => {
  const lockerAddr = (() => {
    const t = terminalsData.find(t => t.name === pkg.destination);
    return t ? (pkg.locker !== '-' ? getLockerAddress(pkg.locker, pkg.destination) : getTerminalAddress(t)) : '—';
  })();
  const method = DELIVERY_METHODS[pkg.deliveryMethod]?.label || pkg.deliveryMethod || '';
  const html = `<!DOCTYPE html><html><head><title>Label – ${pkg.waybill}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #fff; font-family: 'Courier New', Courier, monospace; }
  .page { width: 4in; padding: 14px; border: 2px solid #111; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 10px; }
  .brand { font-size: 22px; font-weight: 900; letter-spacing: -1px; }
  .brand-sub { font-size: 9px; color: #555; margin-top: 2px; }
  .date { font-size: 10px; color: #555; text-align: right; }
  .waybill { font-size: 26px; font-weight: 900; letter-spacing: 3px; text-align: center; border: 2px solid #111; padding: 8px; margin: 10px 0; }
  .barcode-area { text-align: center; font-size: 44px; letter-spacing: 6px; line-height: 1; margin: 4px 0 10px; overflow: hidden; }
  .dest-box { border: 2px solid #111; padding: 10px; margin: 10px 0; text-align: center; }
  .dest-addr { font-size: 28px; font-weight: 900; letter-spacing: 4px; }
  .dest-name { font-size: 12px; margin-top: 4px; }
  .dest-comp { font-size: 11px; color: #555; margin-top: 2px; }
  .lbl { font-size: 8px; font-weight: bold; text-transform: uppercase; color: #666; margin-bottom: 2px; }
  .val { font-size: 13px; font-weight: bold; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 8px 0; }
  .cell { padding: 6px 8px; border: 1px solid #ccc; }
  .row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed #ddd; }
  .badges { display: flex; gap: 6px; margin: 8px 0; flex-wrap: wrap; }
  .badge { font-size: 10px; font-weight: bold; border: 1.5px solid #111; padding: 2px 8px; }
  .badge-inv { background: #111; color: #fff; }
  .footer { font-size: 8px; color: #888; text-align: center; border-top: 1px dashed #ccc; padding-top: 6px; margin-top: 8px; }
  @media print { @page { margin: 0.2in; } }
</style></head><body>
<div class="page">
  <div class="header">
    <div><div class="brand">LocQar™</div><div class="brand-sub">Smart Locker Network</div></div>
    <div class="date">${new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}<br/>${new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</div>
  </div>

  <div class="waybill">${pkg.waybill}</div>
  <div class="barcode-area">||| ${pkg.waybill.replace(/-/g,' ')} |||</div>

  <div class="dest-box">
    <div class="lbl">Delivery Destination</div>
    <div class="dest-addr">${lockerAddr}</div>
    <div class="dest-name">${pkg.destination}</div>
    ${pkg.locker && pkg.locker !== '-' ? `<div class="dest-comp">Compartment ${pkg.locker}</div>` : ''}
  </div>

  <div class="row"><div><div class="lbl">Recipient</div><div class="val">${pkg.customer}</div></div><div style="text-align:right; font-size:11px;">${pkg.phone}</div></div>

  <div class="grid2" style="margin-top:10px;">
    <div class="cell"><div class="lbl">Service</div><div class="val" style="font-size:11px;">${pkg.product || '—'}</div></div>
    <div class="cell"><div class="lbl">Method</div><div class="val" style="font-size:11px;">${method}</div></div>
    <div class="cell"><div class="lbl">Size</div><div class="val" style="font-size:11px;">${pkg.size}</div></div>
    <div class="cell"><div class="lbl">Weight</div><div class="val" style="font-size:11px;">${pkg.weight || '—'}</div></div>
    <div class="cell"><div class="lbl">Value</div><div class="val" style="font-size:11px;">GH₵ ${pkg.value}</div></div>
    <div class="cell"><div class="lbl">Created</div><div class="val" style="font-size:10px;">${pkg.createdAt || '—'}</div></div>
  </div>

  <div class="badges">
    <div class="badge">${pkg.size.toUpperCase()}</div>
    ${pkg.cod ? '<div class="badge badge-inv">CASH ON DELIVERY</div>' : ''}
  </div>

  <div class="footer">LocQar Locker Network • locqar.com • ${pkg.waybill}</div>
</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}</script>
</body></html>`;
  const w = window.open('', '_blank', 'width=500,height=700');
  if (w) { w.document.write(html); w.document.close(); }
};

const SIZES = ['Small', 'Medium', 'Large', 'Extra Large'];

export const PackageDetailDrawer = ({ pkg, onClose, userRole, addToast, onReassign, onReturn, onMarkDelivered, onSave }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    customer: pkg?.customer ?? '',
    phone: pkg?.phone ?? '',
    destination: pkg?.destination ?? '',
    product: pkg?.product ?? '',
    value: pkg?.value ?? 0,
    weight: pkg?.weight ?? '',
    size: pkg?.size ?? 'Medium',
    notes: pkg?.notes ?? '',
  });

  if (!pkg) return null;

  const upd = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSave = () => {
    if (onSave) onSave({ ...pkg, ...form });
    if (addToast) addToast({ type: 'success', message: `${pkg.waybill} updated` });
    setIsEditing(false);
  };

  const handleDelivered = () => {
    if (onMarkDelivered) onMarkDelivered(pkg);
    if (addToast) addToast({ type: 'success', message: `${pkg.waybill} marked as delivered` });
    onClose();
  };

  const is = { backgroundColor: 'transparent', borderColor: theme.border.primary, color: theme.text.primary };
  const labelCls = "text-xs mb-1 block";

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] border-l shadow-2xl z-50 flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div>
          <p className="text-xs" style={{ color: theme.text.muted }}>PACKAGE</p>
          <h2 className="font-semibold" style={{ color: theme.text.primary }}>{pkg.waybill}</h2>
        </div>
        <div className="flex gap-2">
          {hasPermission(userRole, 'packages.update') && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.icon.primary }} title="Edit Package">
              <Edit size={18} />
            </button>
          )}
          {isEditing && (
            <>
              <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
                <Save size={14} /> Save
              </button>
              <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg hover:bg-white/5 text-sm" style={{ color: theme.text.muted }}>
                Cancel
              </button>
            </>
          )}
          <button onClick={() => printLabel(pkg)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.icon.primary }} title="Print Label">
            <Printer size={18} />
          </button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.icon.primary }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Status strip */}
      {!isEditing && (
        <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <div className="flex items-center justify-between mb-3">
            <DeliveryMethodBadge method={pkg.deliveryMethod} />
            <StatusBadge status={pkg.status} />
          </div>
          <PackageStatusFlow status={pkg.status} deliveryMethod={pkg.deliveryMethod} />
        </div>
      )}

      {/* Locker badge */}
      {!isEditing && pkg.locker && pkg.locker !== '-' && (
        <div className="mx-4 mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Grid3X3 size={20} className="text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-emerald-500">Locker {pkg.locker}</p>
                <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.destination}</p>
                <p className="text-xs font-mono" style={{ color: '#81C995' }}>{getLockerAddress(pkg.locker, pkg.destination)}</p>
              </div>
            </div>
            {pkg.daysInLocker > 0 && (
              <div className="flex items-center gap-1">
                <Timer size={14} className={pkg.daysInLocker > 5 ? 'text-red-500' : 'text-amber-500'} />
                <span className={`text-sm ${pkg.daysInLocker > 5 ? 'text-red-500' : 'text-amber-500'}`}>{pkg.daysInLocker}d</span>
              </div>
            )}
          </div>
          {pkg.cod && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-emerald-500/20">
              <Banknote size={16} className="text-amber-500" />
              <span className="text-sm text-amber-500 font-medium">COD: GH₵ {pkg.value}</span>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      {!isEditing && (
        <div className="flex gap-1 p-4 border-b" style={{ borderColor: theme.border.primary }}>
          {['details', 'tracking', 'messages'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm capitalize"
              style={{ backgroundColor: activeTab === tab ? theme.bg.tertiary : 'transparent', color: activeTab === tab ? theme.text.primary : theme.text.muted }}>
              {tab}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">

        {/* ── EDIT MODE ── */}
        {isEditing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ color: theme.text.muted }} className={labelCls}>Customer Name</label>
                <input value={form.customer} onChange={e => upd('customer', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is} />
              </div>
              <div>
                <label style={{ color: theme.text.muted }} className={labelCls}>Phone</label>
                <input value={form.phone} onChange={e => upd('phone', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is} />
              </div>
            </div>
            <div>
              <label style={{ color: theme.text.muted }} className={labelCls}>Destination Terminal</label>
              <select value={form.destination} onChange={e => upd('destination', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is}>
                {terminalsData.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: theme.text.muted }} className={labelCls}>Product / Service</label>
              <input value={form.product} onChange={e => upd('product', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label style={{ color: theme.text.muted }} className={labelCls}>Value (GH₵)</label>
                <input type="number" value={form.value} onChange={e => upd('value', Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is} />
              </div>
              <div>
                <label style={{ color: theme.text.muted }} className={labelCls}>Weight</label>
                <input value={form.weight} onChange={e => upd('weight', e.target.value)} placeholder="e.g. 2.5 kg" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is} />
              </div>
              <div>
                <label style={{ color: theme.text.muted }} className={labelCls}>Size</label>
                <select value={form.size} onChange={e => upd('size', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is}>
                  {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ color: theme.text.muted }} className={labelCls}>Notes</label>
              <textarea value={form.notes} onChange={e => upd('notes', e.target.value)} rows={3}
                placeholder="Internal notes…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none"
                style={is} />
            </div>
          </div>
        )}

        {/* ── DETAILS TAB ── */}
        {!isEditing && activeTab === 'details' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
              <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Customer</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
                  {pkg.customer.charAt(0)}
                </div>
                <div>
                  <p style={{ color: theme.text.primary }}>{pkg.customer}</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>{pkg.phone}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
              <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Destination', pkg.destination],
                  ['Locker Address', (() => {
                    const t = terminalsData.find(t => t.name === pkg.destination);
                    return t ? (pkg.locker !== '-' ? getLockerAddress(pkg.locker, pkg.destination) : getTerminalAddress(t)) : '—';
                  })()],
                  ['Service', pkg.product],
                  ['Value', `GH₵ ${pkg.value}`],
                  ['Weight', pkg.weight],
                  ['Size', pkg.size],
                  ['Method', DELIVERY_METHODS[pkg.deliveryMethod]?.label]
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                    <p className={l === 'Locker Address' ? 'font-mono' : ''} style={{ color: l === 'Locker Address' ? theme.accent.primary : theme.text.primary }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {hasPermission(userRole, 'packages.update') && (
              <div className="grid grid-cols-3 gap-2">
                <button onClick={handleDelivered}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl text-emerald-500"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <CheckCircle2 size={20} /><span className="text-xs">Delivered</span>
                </button>
                <button onClick={() => { onReassign && onReassign(pkg); }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl text-amber-500"
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <RefreshCw size={20} /><span className="text-xs">Reassign</span>
                </button>
                <button onClick={() => { onReturn && onReturn(pkg); }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl text-red-500"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <PackageX size={20} /><span className="text-xs">Return</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TRACKING TAB ── */}
        {!isEditing && activeTab === 'tracking' && (
          <div className="space-y-4">
            {[
              { time: '14:32', event: 'Deposited in Locker A-15', current: true },
              { time: '12:18', event: 'Arrived at terminal' },
              { time: '08:45', event: 'Out for delivery' },
              { time: 'Yesterday', event: 'Received at warehouse' }
            ].map((t, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: t.current ? '#10B981' : theme.border.secondary }} />
                <div>
                  <p style={{ color: theme.text.primary }}>{t.event}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{t.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {!isEditing && activeTab === 'messages' && (
          <div className="text-center py-8">
            <MessageSquare size={32} style={{ color: theme.icon.muted }} className="mx-auto mb-2" />
            <p className="text-sm" style={{ color: theme.text.muted }}>No messages</p>
            {hasPermission(userRole, 'customers.communicate') && (
              <button className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
                <MessageSquare size={14} />Send SMS
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
