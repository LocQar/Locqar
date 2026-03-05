import React, { useState, useMemo } from 'react';
import {
  Package, MapPin, Truck, Grid3X3, Search, X, LogOut, Sun, Moon,
  ChevronRight, ChevronLeft, ChevronDown, Copy, Check, Building2,
  Download, DollarSign, FileText, Eye, EyeOff, Shield, CreditCard,
  Menu, Bell, AlertOctagon, TrendingUp, LayoutDashboard, Settings,
  Clock, Key, ArrowUpRight, RefreshCw, CheckCircle2, Circle,
  Activity, Users, Globe, Mail, Phone, AlertTriangle, Zap,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { StatusBadge } from '../components/ui/Badge';
import { packagesData } from '../constants/mockData';

// ── Mock data ──────────────────────────────────────────────────────────────
const INVOICES = [
  { id: 'INV-2026-003', period: 'Mar 2026', shipments: 48, amount: 2400,  status: 'pending',  dueDate: '2026-04-01', paidDate: null },
  { id: 'INV-2026-002', period: 'Feb 2026', shipments: 61, amount: 3050,  status: 'paid',     dueDate: '2026-03-01', paidDate: '2026-02-28' },
  { id: 'INV-2026-001', period: 'Jan 2026', shipments: 55, amount: 2750,  status: 'paid',     dueDate: '2026-02-01', paidDate: '2026-01-30' },
  { id: 'INV-2025-012', period: 'Dec 2025', shipments: 72, amount: 3600,  status: 'paid',     dueDate: '2026-01-01', paidDate: '2025-12-29' },
  { id: 'INV-2025-011', period: 'Nov 2025', shipments: 39, amount: 1950,  status: 'paid',     dueDate: '2025-12-01', paidDate: '2025-11-28' },
];

const MONTHLY_DATA = [
  { month: 'Aug', shipments: 38, completed: 35 },
  { month: 'Sep', shipments: 44, completed: 41 },
  { month: 'Oct', shipments: 52, completed: 49 },
  { month: 'Nov', shipments: 39, completed: 36 },
  { month: 'Dec', shipments: 72, completed: 70 },
  { month: 'Jan', shipments: 55, completed: 51 },
  { month: 'Feb', shipments: 61, completed: 58 },
  { month: 'Mar', shipments: 48, completed: 44 },
];

const METHOD_DATA = [
  { name: 'Warehouse → Locker', value: 65, color: '#7EA8C9' },
  { name: 'Dropbox → Locker',   value: 25, color: '#B5A0D1' },
  { name: 'Locker → Home',      value: 10, color: '#81C995' },
];

const ACTIVE_DISPATCHES = [
  { id: 'DSP-001', courier: 'Kwesi Asante',   phone: '+233551234567', packages: 4, terminal: 'Achimota Mall', status: 'in_transit', eta: '~2h',    dispatchedAt: '06:30 AM', waybills: ['LQ-2024-00002', 'LQ-2024-00013', 'LQ-2024-00023', 'LQ-2024-00007'] },
  { id: 'DSP-002', courier: 'Kofi Mensah',    phone: '+233559876543', packages: 3, terminal: 'Accra Mall',    status: 'in_transit', eta: '~45 min', dispatchedAt: '07:15 AM', waybills: ['LQ-2024-00006', 'LQ-2024-00022', 'LQ-2024-00025'] },
  { id: 'DSP-003', courier: 'Adjoa Frimpong', phone: '+233542345678', packages: 2, terminal: 'Junction Mall', status: 'arrived',    eta: 'Arrived', dispatchedAt: '05:00 AM', waybills: ['LQ-2024-00010', 'LQ-2024-00021'] },
];

const SLA_CONTRACTED = { deliveryWindow: '24 hours', pickupWindow: '72 hours', uptime: '99.5%', support: '24 hours' };
const SLA_ACTUAL     = { onTime: 94.2, avgHours: 18.4, pickupRate: 88.7, uptime: 99.8 };
const SLA_BREACHES   = [
  { waybill: 'LQ-2024-00005', issue: 'Pickup overdue (7+ days)', terminal: 'Achimota Mall', days: 4, date: '2026-02-28' },
  { waybill: 'LQ-2024-00018', issue: 'Pickup overdue (8+ days)', terminal: 'West Hills Mall', days: 5, date: '2026-02-26' },
];

const INITIAL_NOTIFS = [
  { id: 1, type: 'package', color: '#818CF8', title: 'Package in locker',    body: 'LQ-2024-00001 is now in Achimota Mall locker A-15. Ready for pickup.',     time: '5m ago',  read: false },
  { id: 2, type: 'sla',     color: '#D4AA5A', title: 'SLA breach warning',   body: 'LQ-2024-00005 has been in locker 7 days. Pickup deadline in 24h.',           time: '2h ago',  read: false },
  { id: 3, type: 'billing', color: '#D4AA5A', title: 'Invoice due in 7 days',body: 'INV-2026-003 for GH₵ 2,400 due Apr 1, 2026. Please arrange payment.',       time: '1d ago',  read: false },
  { id: 4, type: 'package', color: '#81C995', title: 'Delivery completed',   body: 'LQ-2024-00003 was successfully delivered to home address.',                   time: '2d ago',  read: true  },
  { id: 5, type: 'system',  color: '#7EA8C9', title: 'API key expiring',     body: 'Your live API key expires in 30 days. Rotate it in Account > API Access.',   time: '3d ago',  read: true  },
  { id: 6, type: 'package', color: '#818CF8', title: 'Batch dispatched',     body: '4 packages dispatched to Achimota Mall by courier Kwesi Asante.',            time: '5d ago',  read: true  },
  { id: 7, type: 'billing', color: '#81C995', title: 'Invoice paid',         body: 'INV-2026-002 (GH₵ 3,050) has been marked as paid. Thank you!',               time: '6d ago',  read: true  },
];

const ENTERPRISE_ACCOUNTS = {
  'logistics@jumia.com.gh': {
    company: 'Jumia Ghana', accountId: 'ENT-JMG-001', plan: 'Enterprise Pro',
    sla: '99.5% uptime · 24h support', accountManager: 'Sarah Amponsah', amEmail: 'sarah@locqar.com',
    contractEnd: '2026-12-31', apiKey: 'lq_live_Jm3xK9pQr7Wn2vY8sT5uZ1bC4dF6gH',
    webhookUrl: 'https://api.jumia.com.gh/webhooks/locqar', ratePerShipment: 50,
    terminals: ['Achimota Mall', 'Accra Mall', 'Junction Mall'],
    contacts: [
      { name: 'Kwabena Amoa',   role: 'Primary',   email: 'logistics@jumia.com.gh', phone: '+233302123456' },
      { name: 'Ama Darko',      role: 'Billing',   email: 'billing@jumia.com.gh',   phone: '+233302123457' },
      { name: 'Kofi Tech',      role: 'Technical', email: 'tech@jumia.com.gh',      phone: '+233302123458' },
    ],
  },
  'shipping@melcom.com': {
    company: 'Melcom Ltd', accountId: 'ENT-MLM-002', plan: 'Enterprise',
    sla: '99.2% uptime · 48h support', accountManager: 'John Doe', amEmail: 'john@locqar.com',
    contractEnd: '2026-06-30', apiKey: 'lq_live_Ml7wP3qRs9Xn5vT2uY8bA1cD4eG6hJ',
    webhookUrl: 'https://api.melcom.com/hooks/locqar', ratePerShipment: 45,
    terminals: ['Accra Mall', 'West Hills Mall'],
    contacts: [
      { name: 'Ernest Boateng', role: 'Primary', email: 'shipping@melcom.com',  phone: '+233302654321' },
      { name: 'Adwoa Frempong', role: 'Billing', email: 'accounts@melcom.com',  phone: '+233302654322' },
    ],
  },
};

const ENT_MENU = [
  { group: 'Overview',    items: [{ icon: LayoutDashboard, label: 'Dashboard',      id: 'dashboard' }] },
  { group: 'Operations',  items: [
      { icon: Package,      label: 'Shipments',     id: 'shipments',  subItems: ['All', 'In Transit', 'In Lockers', 'Completed', 'Exceptions'] },
      { icon: Truck,        label: 'Active Dispatch',id: 'dispatch' },
      { icon: Bell,         label: 'Notifications', id: 'notifications' },
      { icon: AlertOctagon, label: 'SLA Monitor',   id: 'sla' },
  ]},
  { group: 'Finance',     items: [
      { icon: FileText,     label: 'Invoices',      id: 'invoices' },
      { icon: TrendingUp,   label: 'Analytics',     id: 'analytics' },
  ]},
];

// ── Individual redirect ────────────────────────────────────────────────────
export const IndividualCustomerRedirect = ({ currentUser, onLogout }) => {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: theme.bg.primary }}>
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg, #7EA8C9, #818CF8)' }}>
          <Package size={28} color="#fff" />
        </div>
        <div>
          <h1 className="text-2xl font-black" style={{ color: theme.text.primary }}>LocQar</h1>
          <p className="text-sm mt-1" style={{ color: theme.text.muted }}>Hi {currentUser?.name?.split(' ')[0]}! Your portal is on the LocQar mobile app.</p>
        </div>
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#D4AA5A20' }}>
            <Globe size={22} style={{ color: '#D4AA5A' }} />
          </div>
          <p className="font-semibold" style={{ color: theme.text.primary }}>Use the LocQar App</p>
          <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Track packages, manage your locker address, and view your delivery history from the mobile app.</p>
        </div>
        <button onClick={onLogout} className="text-sm flex items-center gap-1.5 mx-auto" style={{ color: theme.text.muted }}>
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </div>
  );
};

// ── Entry point ────────────────────────────────────────────────────────────
export const CustomerPortalPage = ({ currentUser, onLogout, themeName, setThemeName }) => {
  const { theme } = useTheme();
  if (currentUser?.type !== 'b2b') {
    return <IndividualCustomerRedirect currentUser={currentUser} onLogout={onLogout} />;
  }
  return <EnterprisePortal currentUser={currentUser} onLogout={onLogout} themeName={themeName} setThemeName={setThemeName} />;
};

// ── Enterprise Portal ──────────────────────────────────────────────────────
function EnterprisePortal({ currentUser, onLogout, themeName, setThemeName }) {
  const { theme } = useTheme();

  // Layout
  const [isCollapsed, setIsCollapsed]     = useState(false);
  const [mobileSidebarOpen, setMobileOpen]= useState(false);
  const [expandedMenus, setExpandedMenus] = useState(['shipments']);

  // Navigation
  const [activeMenu, setActiveMenu]       = useState('dashboard');
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  // Header UI
  const [showProfile, setShowProfile]     = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifs, setNotifs]               = useState(INITIAL_NOTIFS);
  const [search, setSearch]               = useState('');

  // Page state
  const [shipSearch, setShipSearch]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('all');
  const [copiedKey, setCopiedKey]         = useState(false);
  const [revealKey, setRevealKey]         = useState(false);
  const [copiedWaybill, setCopiedWaybill] = useState(null);
  const [notifFilter, setNotifFilter]     = useState('all');

  const account = ENTERPRISE_ACCOUNTS[currentUser?.email] || {
    company: currentUser?.name, accountId: 'ENT-001', plan: 'Enterprise',
    sla: '99.5% uptime', accountManager: 'LocQar Support', amEmail: 'support@locqar.com',
    contractEnd: '2026-12-31', apiKey: 'lq_live_demo_key_xxxxxxxxxxxxxxxxxxxx',
    webhookUrl: '', ratePerShipment: 50, terminals: ['Achimota Mall'],
    contacts: [{ name: currentUser?.name, role: 'Primary', email: currentUser?.email, phone: currentUser?.phone }],
  };

  const allShipments = useMemo(() => {
    const matched = packagesData.filter(p =>
      (currentUser?.phone && p.phone === currentUser.phone) ||
      (currentUser?.email && p.email === currentUser.email)
    );
    return matched.length > 0 ? matched : packagesData;
  }, [currentUser]);

  const filteredShipments = useMemo(() => {
    const q = shipSearch.toLowerCase();
    return allShipments.filter(p => {
      const matchQ = !shipSearch || p.waybill.toLowerCase().includes(q) || p.customer?.toLowerCase().includes(q) || p.destination?.toLowerCase().includes(q);
      const matchSub = !activeSubMenu || activeSubMenu === 'All'
        || (activeSubMenu === 'In Transit' && ['in_transit_to_locker','in_transit_to_home','accepted'].includes(p.status))
        || (activeSubMenu === 'In Lockers' && p.status === 'delivered_to_locker')
        || (activeSubMenu === 'Completed'  && ['picked_up','delivered_to_home'].includes(p.status))
        || (activeSubMenu === 'Exceptions' && ['expired','failed'].includes(p.status));
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchQ && matchSub && matchStatus;
    });
  }, [allShipments, shipSearch, activeSubMenu, statusFilter]);

  const kpis = useMemo(() => ({
    total:     allShipments.length,
    active:    allShipments.filter(p => ['assigned','accepted','in_transit_to_locker','in_transit_to_home'].includes(p.status)).length,
    inLocker:  allShipments.filter(p => p.status === 'delivered_to_locker').length,
    completed: allShipments.filter(p => ['picked_up','delivered_to_home'].includes(p.status)).length,
    value:     allShipments.reduce((s, p) => s + (p.value || 0), 0),
  }), [allShipments]);

  const unread    = notifs.filter(n => !n.read).length;
  const pendingInv = INVOICES.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);

  const toggleMenu = (id) => setExpandedMenus(p => p.includes(id) ? p.filter(m => m !== id) : [...p, id]);

  const nav = (id, sub = null) => {
    setActiveMenu(id);
    setActiveSubMenu(sub);
    setMobileOpen(false);
    setShowProfile(false);
  };

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const copyKey = () => {
    navigator.clipboard.writeText(account.apiKey).catch(() => {});
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const copyWaybill = (w) => {
    navigator.clipboard.writeText(w).catch(() => {});
    setCopiedWaybill(w);
    setTimeout(() => setCopiedWaybill(null), 1500);
  };

  const PAGE_LABEL = {
    dashboard: 'Dashboard', shipments: 'Shipments', dispatch: 'Active Dispatch',
    notifications: 'Notifications', sla: 'SLA Monitor',
    invoices: 'Invoices', analytics: 'Analytics', account: 'Account & Settings',
  };

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const sidebar = (
    <aside
      className={`${isCollapsed ? 'w-20' : 'w-64'} border-r flex flex-col transition-all duration-200 flex-shrink-0`}
      style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}
    >
      {/* Logo row */}
      <div className="h-16 flex items-center justify-between px-4 border-b flex-shrink-0" style={{ borderColor: theme.border.primary }}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #7EA8C9, #818CF8)' }}>
              <Package size={14} color="#fff" />
            </div>
            <span className="font-black text-base tracking-tight" style={{ color: theme.text.primary }}>LocQar</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>ENT</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg, #7EA8C9, #818CF8)' }}>
            <Package size={14} color="#fff" />
          </div>
        )}
        {!isCollapsed && (
          <button onClick={() => setIsCollapsed(true)} className="p-1.5 rounded-lg" style={{ color: theme.icon.muted }}>
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {ENT_MENU.map((group, gi) => (
          <div key={group.group} className={gi > 0 ? 'mt-5' : ''}>
            {!isCollapsed && (
              <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.muted }}>{group.group}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = activeMenu === item.id;
                const hasUnread = item.id === 'notifications' && unread > 0;
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => { nav(item.id); if (item.subItems) toggleMenu(item.id); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                      style={{
                        backgroundColor: isActive ? theme.accent.light : 'transparent',
                        border: isActive ? `1px solid ${theme.accent.border}` : '1px solid transparent',
                        color: isActive ? theme.accent.primary : theme.text.secondary,
                      }}
                    >
                      <div className="relative flex-shrink-0">
                        <item.icon size={18} />
                        {hasUnread && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: theme.accent.primary, color: '#fff', fontSize: '9px' }}>{unread}</span>}
                      </div>
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-sm text-left">{item.label}</span>
                          {item.subItems && (
                            <ChevronDown size={14} className={`transition-transform ${expandedMenus.includes(item.id) ? 'rotate-180' : ''}`} style={{ color: theme.icon.muted }} />
                          )}
                        </>
                      )}
                    </button>
                    {!isCollapsed && item.subItems && expandedMenus.includes(item.id) && (
                      <div className="mt-0.5 ml-4 pl-3 space-y-0.5" style={{ borderLeft: `1px solid ${theme.border.primary}` }}>
                        {item.subItems.map(sub => (
                          <button
                            key={sub}
                            onClick={() => nav(item.id, sub)}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all"
                            style={{
                              color: activeSubMenu === sub && activeMenu === item.id ? theme.accent.primary : theme.text.muted,
                              backgroundColor: activeSubMenu === sub && activeMenu === item.id ? theme.accent.light : 'transparent',
                            }}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t space-y-0.5" style={{ borderColor: theme.border.primary }}>
        <button
          onClick={() => nav('account')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{
            backgroundColor: activeMenu === 'account' ? theme.accent.light : 'transparent',
            border: activeMenu === 'account' ? `1px solid ${theme.accent.border}` : '1px solid transparent',
            color: activeMenu === 'account' ? theme.accent.primary : theme.text.secondary,
          }}
        >
          <Settings size={18} />
          {!isCollapsed && <span className="text-sm">Account & Settings</span>}
        </button>
        {isCollapsed && (
          <button onClick={() => setIsCollapsed(false)} className="w-full flex items-center justify-center px-3 py-2 rounded-xl" style={{ color: theme.icon.muted }}>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </aside>
  );

  // ── Header ───────────────────────────────────────────────────────────────
  const header = (
    <header className="h-16 border-b px-4 flex items-center justify-between flex-shrink-0 sticky top-0 z-30" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg md:hidden" style={{ color: theme.icon.primary }}>
          <Menu size={20} />
        </button>
        {/* Search bar */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border w-44 md:w-72" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
          <Search size={14} style={{ color: theme.icon.muted }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: theme.text.primary }}
          />
          {search && <button onClick={() => setSearch('')} style={{ color: theme.text.muted }}><X size={13} /></button>}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme */}
        <button onClick={() => setThemeName(t => t === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
          {themeName === 'dark' ? <Sun size={17} style={{ color: theme.icon.primary }} /> : <Moon size={17} style={{ color: theme.icon.primary }} />}
        </button>

        {/* Notifications bell */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifPanel(p => !p); setShowProfile(false); }}
            className="relative p-2.5 rounded-xl border"
            style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}
          >
            <Bell size={17} style={{ color: theme.icon.primary }} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: theme.accent.primary, color: '#fff' }}>
                {unread}
              </span>
            )}
          </button>
          {showNotifPanel && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifPanel(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="p-3.5 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                  <span className="font-semibold text-sm" style={{ color: theme.text.primary }}>Notifications {unread > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs" style={{ backgroundColor: theme.accent.primary, color: '#fff' }}>{unread}</span>}</span>
                  {unread > 0 && <button onClick={markAllRead} className="text-xs" style={{ color: theme.accent.primary }}>Mark all read</button>}
                </div>
                {/* Filter pills */}
                <div className="flex gap-1 p-2 border-b" style={{ borderColor: theme.border.primary }}>
                  {['all','package','sla','billing','system'].map(f => (
                    <button key={f} onClick={() => setNotifFilter(f)} className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize" style={{ backgroundColor: notifFilter === f ? theme.accent.light : 'transparent', color: notifFilter === f ? theme.accent.primary : theme.text.muted }}>
                      {f === 'all' ? 'All' : f}
                    </button>
                  ))}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y" style={{ borderColor: theme.border.primary }}>
                  {notifs.filter(n => notifFilter === 'all' || n.type === notifFilter).map(n => (
                    <button
                      key={n.id}
                      onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                      className="w-full text-left flex gap-3 p-3 transition-colors"
                      style={{ backgroundColor: n.read ? 'transparent' : `${n.color}08` }}
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.read ? 'transparent' : n.color }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{n.title}</p>
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: theme.text.muted }}>{n.body}</p>
                        <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative hidden md:block pl-2 border-l" style={{ borderColor: theme.border.primary }}>
          <button
            onClick={() => { setShowProfile(p => !p); setShowNotifPanel(false); }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-colors hover:bg-white/5"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#818CF820', color: '#818CF8', border: '2px solid #818CF830' }}>
              {account.company.charAt(0)}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-sm font-medium leading-none" style={{ color: theme.text.primary }}>{account.company}</p>
              <p className="text-xs leading-none mt-0.5" style={{ color: theme.text.muted }}>{account.plan}</p>
            </div>
            <ChevronDown size={13} style={{ color: theme.icon.muted }} />
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border shadow-2xl z-50 overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>
                      {account.company.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: theme.text.primary }}>{account.company}</p>
                      <p className="text-xs truncate" style={{ color: theme.text.muted }}>{currentUser.email}</p>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium" style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>{account.plan}</span>
                    </div>
                  </div>
                </div>
                <div className="p-1.5">
                  {[
                    { label: 'Account & Settings', icon: Settings,   id: 'account' },
                    { label: 'Notifications',       icon: Bell,       id: 'notifications' },
                    { label: 'SLA Monitor',         icon: Activity,   id: 'sla' },
                  ].map(item => (
                    <button key={item.id} onClick={() => { nav(item.id); setShowProfile(false); }} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left">
                      <item.icon size={15} style={{ color: theme.icon.muted }} />
                      <span className="text-sm" style={{ color: theme.text.secondary }}>{item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="p-1.5 border-t" style={{ borderColor: theme.border.primary }}>
                  <button onClick={onLogout} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-500/5 text-left">
                    <LogOut size={15} style={{ color: '#D48E8A' }} />
                    <span className="text-sm" style={{ color: '#D48E8A' }}>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );

  // ── Shared styles ─────────────────────────────────────────────────────────
  const card = { backgroundColor: theme.bg.card, borderColor: theme.border.primary };
  const inputStyle = { backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary };

  // ── Page: Dashboard ───────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-5">
      {/* Welcome + alert */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: theme.text.primary }}>Welcome back, {account.company}</h1>
          <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>{account.plan} · {account.accountId}</p>
        </div>
        {pendingInv > 0 && (
          <button onClick={() => nav('invoices')} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: '#D4AA5A10', border: '1px solid #D4AA5A40', color: '#D4AA5A' }}>
            <CreditCard size={14} /> Invoice due: <strong>GH₵ {pendingInv.toLocaleString()}</strong>
          </button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Shipments', value: kpis.total,                              color: '#818CF8', icon: Package,     sub: 'All time',        onClick: () => nav('shipments', 'All') },
          { label: 'Active',          value: kpis.active,                             color: '#7EA8C9', icon: Truck,       sub: 'In transit',      onClick: () => nav('shipments', 'In Transit') },
          { label: 'In Lockers',      value: kpis.inLocker,                           color: '#81C995', icon: Grid3X3,    sub: 'Awaiting pickup', onClick: () => nav('shipments', 'In Lockers') },
          { label: 'Total Value',     value: `GH₵ ${kpis.value.toLocaleString()}`,   color: '#D4AA5A', icon: DollarSign, sub: 'Shipment value',  onClick: () => nav('invoices') },
        ].map(({ label, value, color, icon: Icon, sub, onClick }) => (
          <button key={label} onClick={onClick} className="p-4 rounded-2xl border text-left transition-all hover:shadow-md" style={card}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>{label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                <Icon size={13} style={{ color }} />
              </div>
            </div>
            <p className="text-xl font-bold" style={{ color: theme.text.primary }}>{value}</p>
            <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: theme.text.muted }}>{sub} <ArrowUpRight size={11} /></p>
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Monthly trend */}
        <div className="p-5 rounded-2xl border" style={card}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Shipment Volume</h3>
            <span className="text-xs font-semibold" style={{ color: '#81C995' }}>Last 8 months</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={MONTHLY_DATA} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: theme.text.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: theme.text.muted }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12, color: theme.text.primary, fontSize: 12 }} />
              <Bar dataKey="shipments" fill="#818CF8" radius={[4,4,0,0]} name="Shipments" />
              <Bar dataKey="completed" fill="#81C995" radius={[4,4,0,0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance */}
        <div className="p-5 rounded-2xl border space-y-3.5" style={card}>
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Account Performance</h3>
          {[
            { label: 'On-time delivery',   value: '94.2%', bar: 94, color: '#81C995' },
            { label: 'Pickup rate',        value: '88.7%', bar: 89, color: '#7EA8C9' },
            { label: 'Locker utilization', value: '71.3%', bar: 71, color: '#818CF8' },
          ].map(({ label, value, bar, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span style={{ color: theme.text.muted }}>{label}</span>
                <span className="font-semibold" style={{ color: theme.text.primary }}>{value}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                <div className="h-full rounded-full" style={{ width: `${bar}%`, backgroundColor: color }} />
              </div>
            </div>
          ))}
          <div className="pt-2 grid grid-cols-2 gap-3 border-t" style={{ borderColor: theme.border.primary }}>
            <div><p className="text-xs" style={{ color: theme.text.muted }}>Avg delivery time</p><p className="text-sm font-bold mt-0.5" style={{ color: theme.text.primary }}>1.8 days</p></div>
            <div><p className="text-xs" style={{ color: theme.text.muted }}>Active terminals</p><p className="text-sm font-bold mt-0.5" style={{ color: theme.text.primary }}>{account.terminals.length}</p></div>
          </div>
        </div>
      </div>

      {/* Recent shipments */}
      <div className="rounded-2xl border overflow-hidden" style={card}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Recent Shipments</h3>
          <button onClick={() => nav('shipments', 'All')} className="text-xs flex items-center gap-1" style={{ color: theme.accent.primary }}>View all <ChevronRight size={12} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: theme.bg.tertiary }}>
                {['Waybill', 'Recipient', 'Destination', 'Status', 'Value'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allShipments.slice(0, 6).map((pkg, i) => (
                <tr key={pkg.id} style={{ borderTop: i > 0 ? `1px solid ${theme.border.primary}` : 'none' }}>
                  <td className="px-4 py-3"><span className="font-mono text-xs font-bold" style={{ color: theme.text.primary }}>{pkg.waybill}</span></td>
                  <td className="px-4 py-3 text-sm" style={{ color: theme.text.secondary }}>{pkg.customer}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: theme.text.secondary }}>{pkg.destination}</td>
                  <td className="px-4 py-3"><StatusBadge status={pkg.status} /></td>
                  <td className="px-4 py-3 text-sm font-mono font-semibold" style={{ color: theme.text.primary }}>GH₵ {pkg.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terminals */}
      <div className="rounded-2xl border overflow-hidden" style={card}>
        <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Contracted Terminals</h3>
        </div>
        <div className="grid md:grid-cols-3">
          {account.terminals.map((t, i) => (
            <div key={t} className="flex items-center gap-3 p-4" style={{ borderRight: i < account.terminals.length - 1 ? `1px solid ${theme.border.primary}` : 'none' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#81C99520' }}>
                <MapPin size={14} style={{ color: '#81C995' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{t}</p>
                <p className="text-xs" style={{ color: '#81C995' }}>Active</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Page: Shipments ───────────────────────────────────────────────────────
  const renderShipments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Shipments{activeSubMenu ? ` — ${activeSubMenu}` : ''}</h2>
          <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{filteredShipments.length} shipment{filteredShipments.length !== 1 ? 's' : ''} · GH₵ {filteredShipments.reduce((s, p) => s + (p.value || 0), 0).toLocaleString()}</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card, color: theme.text.secondary }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-48 flex items-center gap-2 px-3 py-2.5 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <Search size={14} style={{ color: theme.icon.muted }} />
          <input value={shipSearch} onChange={e => setShipSearch(e.target.value)} placeholder="Waybill, recipient, destination…" className="flex-1 bg-transparent text-sm outline-none" style={{ color: theme.text.primary }} />
          {shipSearch && <button onClick={() => setShipSearch('')} style={{ color: theme.text.muted }}><X size={13} /></button>}
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border text-sm" style={inputStyle}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="at_warehouse">At Warehouse</option>
          <option value="in_transit_to_locker">In Transit</option>
          <option value="delivered_to_locker">In Locker</option>
          <option value="picked_up">Picked Up</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={card}>
        {filteredShipments.length === 0 ? (
          <div className="text-center py-12">
            <Package size={36} className="mx-auto mb-2" style={{ color: theme.text.muted }} />
            <p className="text-sm" style={{ color: theme.text.muted }}>No shipments match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: theme.bg.tertiary }}>
                  {['Waybill', 'Recipient', 'Destination', 'Status', 'Value', 'Method'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((pkg, i) => (
                  <tr key={pkg.id} className="hover:bg-white/5 transition-colors" style={{ borderTop: i > 0 ? `1px solid ${theme.border.primary}` : 'none' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold" style={{ color: theme.text.primary }}>{pkg.waybill}</span>
                        <button onClick={() => copyWaybill(pkg.waybill)} style={{ color: theme.icon.muted }}>
                          {copiedWaybill === pkg.waybill ? <Check size={11} style={{ color: '#81C995' }} /> : <Copy size={11} />}
                        </button>
                        {pkg.cod && <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#D4AA5A15', color: '#D4AA5A' }}>COD</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm" style={{ color: theme.text.primary }}>{pkg.customer}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm" style={{ color: theme.text.secondary }}>{pkg.destination}</p>
                      {pkg.locker && pkg.locker !== '-' && <p className="text-xs font-mono" style={{ color: theme.text.muted }}>#{pkg.locker}</p>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={pkg.status} /></td>
                    <td className="px-4 py-3 text-sm font-mono font-semibold" style={{ color: theme.text.primary }}>GH₵ {pkg.value}</td>
                    <td className="px-4 py-3 text-xs capitalize" style={{ color: theme.text.muted }}>{pkg.deliveryMethod?.replace(/_/g, ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // ── Page: Dispatch ────────────────────────────────────────────────────────
  const renderDispatch = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Active Dispatch</h2>
        <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>Couriers currently handling your packages</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Couriers',    value: ACTIVE_DISPATCHES.filter(d => d.status === 'in_transit').length,  color: '#818CF8', icon: Truck },
          { label: 'Packages In Transit',value: ACTIVE_DISPATCHES.reduce((s, d) => s + d.packages, 0),           color: '#7EA8C9', icon: Package },
          { label: 'Arrived Today',      value: ACTIVE_DISPATCHES.filter(d => d.status === 'arrived').length,     color: '#81C995', icon: CheckCircle2 },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="p-4 rounded-2xl border" style={card}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: theme.text.muted }}>{label}</p>
                <p className="text-xl font-bold mt-0.5" style={{ color: theme.text.primary }}>{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch cards */}
      <div className="space-y-3">
        {ACTIVE_DISPATCHES.map(d => (
          <div key={d.id} className="p-4 rounded-2xl border" style={card}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>
                  {d.courier.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>{d.courier}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{d.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" style={{
                  backgroundColor: d.status === 'arrived' ? '#81C99520' : '#818CF820',
                  color: d.status === 'arrived' ? '#81C995' : '#818CF8',
                }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.status === 'arrived' ? '#81C995' : '#818CF8' }} />
                  {d.status === 'arrived' ? 'Arrived' : 'In Transit'}
                </span>
                <p className="text-xs mt-1" style={{ color: theme.text.muted }}>ETA: <strong style={{ color: theme.text.primary }}>{d.eta}</strong></p>
              </div>
            </div>
            <div className="flex items-center gap-6 pt-3 border-t text-xs" style={{ borderColor: theme.border.primary }}>
              <div>
                <span style={{ color: theme.text.muted }}>Terminal: </span>
                <span className="font-medium" style={{ color: theme.text.primary }}>{d.terminal}</span>
              </div>
              <div>
                <span style={{ color: theme.text.muted }}>Packages: </span>
                <span className="font-bold" style={{ color: '#818CF8' }}>{d.packages}</span>
              </div>
              <div>
                <span style={{ color: theme.text.muted }}>Dispatched: </span>
                <span className="font-medium" style={{ color: theme.text.primary }}>{d.dispatchedAt}</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {d.waybills.map(w => (
                <span key={w} className="font-mono text-xs px-2 py-0.5 rounded-lg" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>
                  {w}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Page: Notifications ───────────────────────────────────────────────────
  const renderNotifications = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Notifications</h2>
          <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>{unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm px-3 py-1.5 rounded-xl border" style={{ borderColor: theme.border.primary, color: theme.accent.primary, backgroundColor: theme.bg.card }}>
            Mark all read
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'all',     label: 'All',     count: notifs.length },
          { id: 'package', label: 'Packages',count: notifs.filter(n => n.type === 'package').length },
          { id: 'sla',     label: 'SLA',     count: notifs.filter(n => n.type === 'sla').length },
          { id: 'billing', label: 'Billing', count: notifs.filter(n => n.type === 'billing').length },
          { id: 'system',  label: 'System',  count: notifs.filter(n => n.type === 'system').length },
        ].map(f => (
          <button key={f.id} onClick={() => setNotifFilter(f.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all" style={{
            backgroundColor: notifFilter === f.id ? theme.accent.light : theme.bg.card,
            borderColor: notifFilter === f.id ? theme.accent.border : theme.border.primary,
            color: notifFilter === f.id ? theme.accent.primary : theme.text.secondary,
          }}>
            {f.label}
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: notifFilter === f.id ? theme.accent.primary : theme.bg.tertiary, color: notifFilter === f.id ? '#fff' : theme.text.muted }}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={card}>
        {notifs.filter(n => notifFilter === 'all' || n.type === notifFilter).map((n, i, arr) => (
          <button
            key={n.id}
            onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
            className="w-full text-left flex gap-4 p-4 hover:bg-white/3 transition-colors"
            style={{ borderBottom: i < arr.length - 1 ? `1px solid ${theme.border.primary}` : 'none', backgroundColor: n.read ? 'transparent' : `${n.color}08` }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${n.color}15` }}>
              {n.type === 'package' ? <Package size={16} style={{ color: n.color }} />
               : n.type === 'sla' ? <AlertOctagon size={16} style={{ color: n.color }} />
               : n.type === 'billing' ? <CreditCard size={16} style={{ color: n.color }} />
               : <Shield size={16} style={{ color: n.color }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold" style={{ color: theme.text.primary }}>{n.title}</p>
                <span className="text-xs flex-shrink-0" style={{ color: theme.text.muted }}>{n.time}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{n.body}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.color }} />}
          </button>
        ))}
      </div>
    </div>
  );

  // ── Page: SLA Monitor ─────────────────────────────────────────────────────
  const renderSLA = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>SLA Monitor</h2>
        <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>Contract compliance for {account.company}</p>
      </div>

      {/* Contract vs Actual */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Contracted terms */}
        <div className="p-5 rounded-2xl border" style={card}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#818CF820' }}>
              <Shield size={14} style={{ color: '#818CF8' }} />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Contracted Terms</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Delivery Window',  value: SLA_CONTRACTED.deliveryWindow },
              { label: 'Pickup Window',    value: SLA_CONTRACTED.pickupWindow },
              { label: 'Uptime Guarantee', value: SLA_CONTRACTED.uptime },
              { label: 'Support Response', value: SLA_CONTRACTED.support },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span style={{ color: theme.text.muted }}>{label}</span>
                <span className="font-semibold" style={{ color: theme.text.primary }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actual metrics */}
        <div className="p-5 rounded-2xl border space-y-3" style={card}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#81C99520' }}>
              <Activity size={14} style={{ color: '#81C995' }} />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Actual Performance</h3>
          </div>
          {[
            { label: 'On-time delivery',   value: `${SLA_ACTUAL.onTime}%`,      bar: SLA_ACTUAL.onTime,      target: 95,  color: SLA_ACTUAL.onTime >= 95 ? '#81C995' : '#D4AA5A' },
            { label: 'Pickup rate',        value: `${SLA_ACTUAL.pickupRate}%`,  bar: SLA_ACTUAL.pickupRate,  target: 90,  color: SLA_ACTUAL.pickupRate >= 90 ? '#81C995' : '#D4AA5A' },
            { label: 'Platform uptime',    value: `${SLA_ACTUAL.uptime}%`,      bar: SLA_ACTUAL.uptime,      target: 99.5,color: '#81C995' },
          ].map(({ label, value, bar, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span style={{ color: theme.text.muted }}>{label}</span>
                <span className="font-semibold" style={{ color }}>{value}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(bar, 100)}%`, backgroundColor: color }} />
              </div>
            </div>
          ))}
          <div className="pt-2 border-t" style={{ borderColor: theme.border.primary }}>
            <p className="text-xs" style={{ color: theme.text.muted }}>Avg delivery time</p>
            <p className="text-base font-bold mt-0.5" style={{ color: theme.text.primary }}>{SLA_ACTUAL.avgHours}h <span className="text-xs font-normal" style={{ color: '#81C995' }}>vs 24h target ✓</span></p>
          </div>
        </div>
      </div>

      {/* SLA Breaches */}
      <div className="rounded-2xl border overflow-hidden" style={card}>
        <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: theme.border.primary }}>
          <AlertTriangle size={16} style={{ color: '#D4AA5A' }} />
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Active Breaches</h3>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#D4AA5A20', color: '#D4AA5A' }}>{SLA_BREACHES.length}</span>
        </div>
        {SLA_BREACHES.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 size={32} className="mx-auto mb-2" style={{ color: '#81C995' }} />
            <p className="text-sm font-medium" style={{ color: '#81C995' }}>No active SLA breaches</p>
          </div>
        ) : SLA_BREACHES.map((b, i) => (
          <div key={b.waybill} className="flex items-center gap-4 p-4" style={{ borderTop: i > 0 ? `1px solid ${theme.border.primary}` : 'none' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4AA5A20' }}>
              <Clock size={15} style={{ color: '#D4AA5A' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-mono font-bold" style={{ color: theme.text.primary }}>{b.waybill}</p>
              <p className="text-xs" style={{ color: theme.text.muted }}>{b.issue} · {b.terminal}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ backgroundColor: '#D48E8A20', color: '#D48E8A' }}>+{b.days}d overdue</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Page: Invoices ────────────────────────────────────────────────────────
  const renderInvoices = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Invoices</h2>

      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-3">
        {[
          { label: 'Outstanding',    value: `GH₵ ${INVOICES.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0).toLocaleString()}`, color: '#D4AA5A', sub: `${INVOICES.filter(i => i.status === 'pending').length} invoice(s) pending` },
          { label: 'Paid (YTD)',     value: `GH₵ ${INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0).toLocaleString()}`,    color: '#81C995', sub: `${INVOICES.filter(i => i.status === 'paid').length} invoices paid` },
          { label: 'Rate / Shipment',value: `GH₵ ${account.ratePerShipment}`,                                                                          color: '#818CF8', sub: account.plan },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="p-4 rounded-2xl border" style={card}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>{label}</p>
            <p className="text-2xl font-black mt-2" style={{ color }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Invoice list */}
      <div className="rounded-2xl border overflow-hidden" style={card}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Invoice History</h3>
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border" style={{ borderColor: theme.border.primary, color: theme.text.secondary, backgroundColor: theme.bg.tertiary }}>
            <Download size={12} /> Export All
          </button>
        </div>
        {INVOICES.map((inv, i) => (
          <div key={inv.id} className="flex items-center gap-4 p-4 border-b" style={{ borderColor: theme.border.primary }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: inv.status === 'paid' ? '#81C99520' : '#D4AA5A20' }}>
              <FileText size={16} style={{ color: inv.status === 'paid' ? '#81C995' : '#D4AA5A' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold font-mono" style={{ color: theme.text.primary }}>{inv.id}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={{ backgroundColor: inv.status === 'paid' ? '#81C99520' : '#D4AA5A20', color: inv.status === 'paid' ? '#81C995' : '#D4AA5A' }}>{inv.status}</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                {inv.period} · {inv.shipments} shipments {inv.paidDate ? `· Paid ${inv.paidDate}` : `· Due ${inv.dueDate}`}
              </p>
            </div>
            <p className="text-base font-bold font-mono" style={{ color: theme.text.primary }}>GH₵ {inv.amount.toLocaleString()}</p>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs flex-shrink-0" style={{ borderColor: theme.border.primary, color: theme.text.muted, backgroundColor: theme.bg.tertiary }}>
              <Download size={12} /> PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Page: Analytics ───────────────────────────────────────────────────────
  const renderAnalytics = () => (
    <div className="space-y-5">
      <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Analytics</h2>

      {/* KPI summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Avg / Month',   value: Math.round(MONTHLY_DATA.reduce((s, d) => s + d.shipments, 0) / MONTHLY_DATA.length), color: '#818CF8', suffix: ' shipments' },
          { label: 'Completion Rate',value: `${Math.round(MONTHLY_DATA.reduce((s, d) => s + d.completed, 0) / MONTHLY_DATA.reduce((s, d) => s + d.shipments, 0) * 100)}%`, color: '#81C995', suffix: '' },
          { label: 'YTD Shipments', value: MONTHLY_DATA.slice(5).reduce((s, d) => s + d.shipments, 0), color: '#7EA8C9', suffix: ' total' },
          { label: 'YTD Revenue',   value: `GH₵ ${(MONTHLY_DATA.slice(5).reduce((s, d) => s + d.shipments, 0) * account.ratePerShipment).toLocaleString()}`, color: '#D4AA5A', suffix: '' },
        ].map(({ label, value, color, suffix }) => (
          <div key={label} className="p-4 rounded-2xl border" style={card}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>{label}</p>
            <p className="text-xl font-bold mt-2" style={{ color }}>{value}{suffix && <span className="text-xs font-normal ml-1" style={{ color: theme.text.muted }}>{suffix}</span>}</p>
          </div>
        ))}
      </div>

      {/* Monthly volume */}
      <div className="p-5 rounded-2xl border" style={card}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Monthly Shipment Volume</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#818CF8' }} /> Total</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#81C995' }} /> Completed</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={MONTHLY_DATA} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme.text.muted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: theme.text.muted }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12, color: theme.text.primary, fontSize: 12 }} />
            <Bar dataKey="shipments" fill="#818CF8" radius={[5,5,0,0]} name="Total Shipments" />
            <Bar dataKey="completed" fill="#81C995" radius={[5,5,0,0]} name="Completed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Method + terminal split */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Delivery method */}
        <div className="p-5 rounded-2xl border" style={card}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: theme.text.primary }}>Delivery Methods</h3>
          <div className="space-y-3">
            {METHOD_DATA.map(m => (
              <div key={m.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: m.color }} /><span style={{ color: theme.text.muted }}>{m.name}</span></span>
                  <span className="font-semibold" style={{ color: theme.text.primary }}>{m.value}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                  <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal utilization */}
        <div className="p-5 rounded-2xl border" style={card}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: theme.text.primary }}>Terminal Utilization</h3>
          <div className="space-y-3">
            {account.terminals.map((t, i) => {
              const utilization = [68, 52, 41][i] || 55;
              return (
                <div key={t}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span style={{ color: theme.text.muted }}>{t}</span>
                    <span className="font-semibold" style={{ color: theme.text.primary }}>{utilization}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                    <div className="h-full rounded-full" style={{ width: `${utilization}%`, backgroundColor: ['#818CF8','#7EA8C9','#81C995'][i] || '#B5A0D1' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-3 mt-2 border-t text-xs" style={{ borderColor: theme.border.primary }}>
            <div className="flex items-center gap-2" style={{ color: theme.text.muted }}>
              <Zap size={12} style={{ color: '#81C995' }} />
              <span>Busiest terminal: <strong style={{ color: theme.text.primary }}>{account.terminals[0]}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Page: Account & Settings ───────────────────────────────────────────────
  const renderAccount = () => (
    <div className="space-y-4 max-w-3xl">
      <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Account & Settings</h2>

      {/* Company info */}
      <div className="p-5 rounded-2xl border" style={card}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>
            {account.company.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ color: theme.text.primary }}>{account.company}</h3>
            <p className="text-sm" style={{ color: theme.text.muted }}>{account.accountId} · {account.plan}</p>
            <span className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: '#81C995' }}>
              <Shield size={11} /> Verified enterprise account
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
          {[
            ['Account ID',       account.accountId],
            ['Plan',             account.plan],
            ['SLA',              account.sla],
            ['Contract Expires', account.contractEnd],
            ['Account Manager',  account.accountManager],
            ['Manager Email',    account.amEmail],
          ].map(([l, v]) => (
            <div key={l}>
              <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
              <p className="text-sm font-medium mt-0.5" style={{ color: theme.text.primary }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* API Access */}
      <div className="rounded-2xl border overflow-hidden" style={card}>
        <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>API Access</h3>
          <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>Integrate LocQar into your logistics platform</p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: theme.text.muted }}>Live API Key</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border font-mono text-xs" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.secondary }}>
                {revealKey ? account.apiKey : account.apiKey.replace(/lq_live_(.{4}).*/, 'lq_live_$1' + '•'.repeat(28))}
              </div>
              <button onClick={() => setRevealKey(r => !r)} className="p-2.5 rounded-xl border" style={{ borderColor: theme.border.primary, color: theme.icon.muted }}>
                {revealKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <button onClick={copyKey} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs" style={{ borderColor: copiedKey ? '#81C99540' : theme.border.primary, backgroundColor: copiedKey ? '#81C99510' : theme.bg.tertiary, color: copiedKey ? '#81C995' : theme.text.muted }}>
                {copiedKey ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>
          </div>
          {account.webhookUrl && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: theme.text.muted }}>Webhook URL</p>
              <div className="px-3 py-2.5 rounded-xl border font-mono text-xs" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.secondary }}>
                {account.webhookUrl}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs p-3 rounded-xl" style={{ backgroundColor: '#818CF808', border: '1px solid #818CF820' }}>
            <Key size={13} style={{ color: '#818CF8' }} />
            <p style={{ color: theme.text.muted }}>Keep your API key secret. Rotate it from the LocQar developer console if compromised.</p>
          </div>
        </div>
      </div>

      {/* Team contacts */}
      <div className="rounded-2xl border overflow-hidden" style={card}>
        <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Team Contacts</h3>
        </div>
        {account.contacts.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-4" style={{ borderBottom: i < account.contacts.length - 1 ? `1px solid ${theme.border.primary}` : 'none' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0" style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>
              {c.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{c.name}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs flex items-center gap-1" style={{ color: theme.text.muted }}><Mail size={10} /> {c.email}</span>
                <span className="text-xs flex items-center gap-1" style={{ color: theme.text.muted }}><Phone size={10} /> {c.phone}</span>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg flex-shrink-0" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted }}>{c.role}</span>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <button onClick={onLogout} className="flex items-center gap-3 p-4 rounded-2xl border text-left hover:bg-white/5 transition-colors" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
        <LogOut size={15} style={{ color: '#D48E8A' }} />
        <span className="text-sm font-medium" style={{ color: '#D48E8A' }}>Sign out of Enterprise Portal</span>
      </button>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: theme.bg.primary }}>
      <style>{`* { font-family: 'Sora', 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; } .font-mono { font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace !important; } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${theme.border.secondary}; border-radius: 3px; }`}</style>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">{sidebar}</div>
        </>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex">{sidebar}</div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {header}

        {/* Breadcrumb */}
        <div className="px-6 py-2.5 border-b flex items-center gap-2 text-xs flex-shrink-0" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
          <span style={{ color: theme.text.muted }}>{account.company}</span>
          <ChevronRight size={12} style={{ color: theme.text.muted }} />
          <span className="font-medium" style={{ color: theme.text.primary }}>{PAGE_LABEL[activeMenu] || activeMenu}</span>
          {activeSubMenu && (
            <>
              <ChevronRight size={12} style={{ color: theme.text.muted }} />
              <span style={{ color: theme.text.muted }}>{activeSubMenu}</span>
            </>
          )}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeMenu === 'dashboard'     && renderDashboard()}
          {activeMenu === 'shipments'     && renderShipments()}
          {activeMenu === 'dispatch'      && renderDispatch()}
          {activeMenu === 'notifications' && renderNotifications()}
          {activeMenu === 'sla'           && renderSLA()}
          {activeMenu === 'invoices'      && renderInvoices()}
          {activeMenu === 'analytics'     && renderAnalytics()}
          {activeMenu === 'account'       && renderAccount()}
        </main>
      </div>
    </div>
  );
}
