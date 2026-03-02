import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Download, Filter, Eye, Edit, Trash2, Phone, Mail, MapPin,
  DollarSign, TrendingUp, Users, Target, Calendar, Clock, CheckCircle,
  AlertTriangle, MessageSquare, FileText, ArrowRight, Building2, Tag,
  BarChart3, X, ChevronDown, ChevronUp, Briefcase, Star, ExternalLink,
  UserPlus, RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard, StatusBadge, TableSkeleton, Pagination, EmptyState } from '../components/ui';
import { NewLeadDrawer, NewContactDrawer, NewDealDrawer, NewActivityDrawer } from '../components/drawers';
import {
  leads, deals, contacts, activities,
  CRM_LEAD_STATUSES, CRM_STAGES, CRM_ACTIVITY_TYPES, CRM_LEAD_SOURCES,
  pipelineChartData, crmMonthlyData, activityBreakdownData
} from '../constants/mockDataCRM';

const CHART_COLORS = ['#8B5CF6', '#3B82F6', '#F59E0B', '#F97316', '#10B981', '#EF4444'];

// ============ EXPORT UTILITY ============
const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Convert data to CSV format
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle values with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const CRMPage = ({
  activeSubMenu, currentUser, loading, setShowExport, addToast,
}) => {
  const { theme } = useTheme();
  const currentView = activeSubMenu || 'Dashboard';

  // ============ LEADS STATE ============
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [leadSourceFilter, setLeadSourceFilter] = useState('all');
  const [leadPage, setLeadPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);

  // ============ DEALS STATE ============
  const [dealSearch, setDealSearch] = useState('');
  const [dealView, setDealView] = useState('kanban');

  // ============ CONTACTS STATE ============
  const [contactSearch, setContactSearch] = useState('');
  const [contactTagFilter, setContactTagFilter] = useState('all');
  const [contactPage, setContactPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);

  // ============ ACTIVITIES STATE ============
  const [activitySearch, setActivitySearch] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [activityStatusFilter, setActivityStatusFilter] = useState('all');
  const [activityPage, setActivityPage] = useState(1);

  // ============ DRAWER STATE ============
  const [showNewLeadDrawer, setShowNewLeadDrawer] = useState(false);
  const [showNewContactDrawer, setShowNewContactDrawer] = useState(false);
  const [showNewDealDrawer, setShowNewDealDrawer] = useState(false);
  const [showNewActivityDrawer, setShowNewActivityDrawer] = useState(false);

  // ============ DATA STATE ============
  const [leads, setLeads] = useState(leads);
  const [deals, setDeals] = useState(deals);
  const [contacts, setContacts] = useState(contacts);
  const [activities, setActivities] = useState(activities);

  const itemsPerPage = 10;

  // ============ HANDLERS ============
  const handleSaveLead = (newLead) => {
    setLeads([newLead, ...leads]);
    addToast({ type: 'success', message: `Lead "${newLead.name}" added successfully` });
  };

  const handleSaveContact = (newContact) => {
    setContacts([newContact, ...contacts]);
    addToast({ type: 'success', message: `Contact "${newContact.name}" added successfully` });
  };

  const handleSaveDeal = (newDeal) => {
    setDeals([newDeal, ...deals]);
    addToast({ type: 'success', message: `Deal "${newDeal.title}" added successfully` });
  };

  const handleSaveActivity = (newActivity) => {
    setActivities([newActivity, ...activities]);
    addToast({ type: 'success', message: `Activity "${newActivity.subject}" scheduled` });
  };

  // ============ COMPUTED DATA ============
  const filteredLeads = useMemo(() => {
    let result = [...leads];
    if (leadSearch) {
      const q = leadSearch.toLowerCase();
      result = result.filter(l => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q));
    }
    if (leadStatusFilter !== 'all') result = result.filter(l => l.status === leadStatusFilter);
    if (leadSourceFilter !== 'all') result = result.filter(l => l.source === leadSourceFilter);
    return result;
  }, [leadSearch, leadStatusFilter, leadSourceFilter]);

  const paginatedLeads = useMemo(() => {
    const start = (leadPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, leadPage]);

  const filteredContacts = useMemo(() => {
    let result = [...contacts];
    if (contactSearch) {
      const q = contactSearch.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    if (contactTagFilter !== 'all') result = result.filter(c => c.tags.includes(contactTagFilter));
    return result;
  }, [contactSearch, contactTagFilter]);

  const paginatedContacts = useMemo(() => {
    const start = (contactPage - 1) * itemsPerPage;
    return filteredContacts.slice(start, start + itemsPerPage);
  }, [filteredContacts, contactPage]);

  const filteredActivities = useMemo(() => {
    let result = [...activities];
    if (activitySearch) {
      const q = activitySearch.toLowerCase();
      result = result.filter(a => a.subject.toLowerCase().includes(q) || (a.contactName || '').toLowerCase().includes(q));
    }
    if (activityTypeFilter !== 'all') result = result.filter(a => a.type === activityTypeFilter);
    if (activityStatusFilter !== 'all') result = result.filter(a => a.status === activityStatusFilter);
    return result;
  }, [activitySearch, activityTypeFilter, activityStatusFilter]);

  const paginatedActivities = useMemo(() => {
    const start = (activityPage - 1) * itemsPerPage;
    return filteredActivities.slice(start, start + itemsPerPage);
  }, [filteredActivities, activityPage]);

  const dealsByStage = useMemo(() => {
    const stages = {};
    Object.keys(CRM_STAGES).forEach(key => { stages[key] = []; });
    deals.forEach(deal => {
      if (dealSearch) {
        const q = dealSearch.toLowerCase();
        if (!deal.title.toLowerCase().includes(q) && !deal.company.toLowerCase().includes(q)) return;
      }
      if (stages[deal.stage]) stages[deal.stage].push(deal);
    });
    return stages;
  }, [dealSearch]);

  const crmMetrics = useMemo(() => {
    const activeDeals = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage));
    const wonDeals = deals.filter(d => d.stage === 'closed_won');
    const totalClosed = deals.filter(d => d.stage === 'closed_won' || d.stage === 'closed_lost').length;
    return {
      totalLeads: leads.length,
      activeDeals: activeDeals.length,
      pipelineValue: activeDeals.reduce((sum, d) => sum + d.value, 0),
      wonValue: wonDeals.reduce((sum, d) => sum + d.value, 0),
      conversionRate: totalClosed > 0 ? Math.round((wonDeals.length / totalClosed) * 100) : 0,
    };
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set();
    contacts.forEach(c => c.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  // ============ SHARED STYLES ============
  const cardStyle = {
    backgroundColor: theme.bg.card,
    borderColor: theme.border.primary
  };
  const inputStyle = {
    backgroundColor: theme.bg.input,
    borderColor: theme.border.primary,
    color: theme.text.primary
  };
  const textPrimaryStyle = { color: theme.text.primary };
  const textSecondaryStyle = { color: theme.text.secondary };
  const textMutedStyle = { color: theme.text.secondary }; // Changed from theme.text.secondary for better contrast

  const selectClasses = "px-3 py-2 rounded-lg border text-sm font-medium";
  const btnOutline = "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors";
  const btnPrimary = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors";

  // ============ RENDER HELPERS ============
  const renderStatusDot = (color) => (
    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
  );

  // ============ DASHBOARD VIEW ============
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard title="Total Leads" value={crmMetrics.totalLeads} change="24%" changeType="up" icon={Target} loading={loading} />
        <MetricCard title="Active Deals" value={crmMetrics.activeDeals} change="8%" changeType="up" icon={Briefcase} loading={loading} />
        <MetricCard title="Pipeline Value" value={`GH₵ ${(crmMetrics.pipelineValue / 1000).toFixed(0)}K`} change="15%" changeType="up" icon={DollarSign} loading={loading} />
        <MetricCard title="Won Deals" value={`GH₵ ${(crmMetrics.wonValue / 1000).toFixed(0)}K`} change="32%" changeType="up" icon={TrendingUp} loading={loading} />
        <MetricCard title="Win Rate" value={`${crmMetrics.conversionRate}%`} icon={BarChart3} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline by Stage */}
        <div className="lg:col-span-2 p-5 rounded-2xl border" style={cardStyle}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Pipeline by Stage</h3>
          {loading ? <TableSkeleton rows={3} cols={1} theme={theme} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pipelineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 11 }} tickFormatter={v => `${v / 1000}K`} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} formatter={(v) => [`GH₵ ${v.toLocaleString()}`, 'Value']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pipelineChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Activity Breakdown */}
        <div className="p-5 rounded-2xl border" style={cardStyle}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Activity Breakdown</h3>
          {loading ? <TableSkeleton rows={3} cols={1} theme={theme} /> : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={activityBreakdownData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {activityBreakdownData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {activityBreakdownData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm" style={{ color: theme.text.secondary }}>
                      {renderStatusDot(CHART_COLORS[i % CHART_COLORS.length])}
                      {item.name}
                    </span>
                    <span className="font-medium text-sm" style={{ color: theme.text.primary }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Deals Won/Lost Over Time + Top Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border" style={cardStyle}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Deals Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={crmMonthlyData}>
              <defs>
                <linearGradient id="gradWon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
              <Area type="monotone" dataKey="won" stroke="#10B981" fill="url(#gradWon)" strokeWidth={2} name="Won" />
              <Area type="monotone" dataKey="lost" stroke="#EF4444" fill="transparent" strokeWidth={2} name="Lost" />
              <Area type="monotone" dataKey="new" stroke="#3B82F6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="New Leads" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-2xl border" style={cardStyle}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Top Deals</h3>
          <div className="space-y-3">
            {deals
              .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
              .map(deal => (
                <div key={deal.id} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate" style={{ color: theme.text.primary }}>{deal.title}</p>
                    <p className="text-xs" style={{ color: theme.text.secondary }}>{deal.company}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="font-bold text-sm" style={{ color: theme.accent.primary }}>GH₵ {deal.value.toLocaleString()}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: CRM_STAGES[deal.stage].bg, color: CRM_STAGES[deal.stage].color }}>{CRM_STAGES[deal.stage].label}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="p-5 rounded-2xl border" style={cardStyle}>
        <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Recent Activities</h3>
        <div className="space-y-3">
          {activities.slice(0, 6).map(act => (
            <div key={act.id} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: CRM_ACTIVITY_TYPES[act.type].bg }}>
                {act.type === 'call' && <Phone size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                {act.type === 'email' && <Mail size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                {act.type === 'meeting' && <Users size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                {act.type === 'task' && <CheckCircle size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                {act.type === 'note' && <FileText size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: theme.text.primary }}>{act.subject}</p>
                <p className="text-xs" style={{ color: theme.text.secondary }}>{act.contactName ? `${act.contactName} · ` : ''}{act.dueDate}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{
                backgroundColor: act.status === 'completed' ? '#ECFDF5' : act.status === 'overdue' ? '#FEF2F2' : '#EFF6FF',
                color: act.status === 'completed' ? '#10B981' : act.status === 'overdue' ? '#EF4444' : '#3B82F6',
              }}>
                {act.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ============ LEADS VIEW ============
  const renderLeads = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(CRM_LEAD_STATUSES).map(([key, s]) => {
          const count = leads.filter(l => l.status === key).length;
          return (
            <div key={key} className="p-4 rounded-xl border flex items-center gap-3" style={cardStyle}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                <span className="text-lg font-bold" style={{ color: s.color }}>{count}</span>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{s.label}</p>
                <p className="text-xs" style={{ color: theme.text.secondary }}>leads</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.secondary }} />
          <input
            type="text" placeholder="Search leads..." value={leadSearch} onChange={e => { setLeadSearch(e.target.value); setLeadPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm" style={inputStyle}
          />
        </div>
        <select value={leadStatusFilter} onChange={e => { setLeadStatusFilter(e.target.value); setLeadPage(1); }} className={selectClasses} style={inputStyle}>
          <option value="all">All Statuses</option>
          {Object.entries(CRM_LEAD_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={leadSourceFilter} onChange={e => { setLeadSourceFilter(e.target.value); setLeadPage(1); }} className={selectClasses} style={inputStyle}>
          <option value="all">All Sources</option>
          {Object.entries(CRM_LEAD_SOURCES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button onClick={() => setShowNewLeadDrawer(true)} className={btnOutline} style={{ borderColor: theme.accent.primary, color: theme.accent.primary }}>
          <Plus size={16} /> Add Lead
        </button>
        <button
          onClick={() => {
            const exportData = filteredLeads.map(lead => ({
              Name: lead.name,
              Company: lead.company,
              Email: lead.email,
              Phone: lead.phone,
              Status: CRM_LEAD_STATUSES[lead.status]?.label || lead.status,
              Source: CRM_LEAD_SOURCES[lead.source]?.label || lead.source,
              Value: `$${lead.value?.toLocaleString() || 0}`,
              'Last Contact': lead.lastContact,
              Owner: lead.owner
            }));
            exportToCSV(exportData, 'crm_leads');
            addToast({ type: 'success', message: `Exported ${exportData.length} leads to CSV` });
          }}
          className={btnOutline}
          style={{ borderColor: theme.border.primary, color: theme.text.primary }}
        >
          <Download size={16} /> Export
        </button>
      </div>

      {loading ? <TableSkeleton rows={5} cols={6} theme={theme} /> : filteredLeads.length === 0 ? (
        <EmptyState icon={Target} title="No leads found" description="Try adjusting your filters" theme={theme} />
      ) : (
        <>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: theme.bg.tertiary }}>
                    {['Name', 'Company', 'Source', 'Status', 'Value', 'Assigned To', 'Last Contact', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-sm font-semibold" style={{ color: theme.text.primary }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeads.map(lead => (
                    <tr key={lead.id} className="border-t" style={{ borderColor: theme.border.primary }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>{lead.name}</p>
                        <p className="text-sm" style={{ color: theme.text.secondary }}>{lead.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: theme.text.secondary }}>{lead.company}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${CRM_LEAD_SOURCES[lead.source]?.color}20`, color: CRM_LEAD_SOURCES[lead.source]?.color }}>
                          {CRM_LEAD_SOURCES[lead.source]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: CRM_LEAD_STATUSES[lead.status].bg, color: CRM_LEAD_STATUSES[lead.status].color }}>
                          {CRM_LEAD_STATUSES[lead.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: theme.text.primary }}>
                        {lead.value > 0 ? `GH₵ ${lead.value.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: theme.text.secondary }}>{lead.assignedTo}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: theme.text.secondary }}>{lead.lastContactedAt || 'Not yet'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)} className="p-2 rounded-lg transition-colors" style={{ color: theme.text.secondary }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={leadPage} totalPages={Math.ceil(filteredLeads.length / itemsPerPage)} onPageChange={setLeadPage} />
        </>
      )}

      {/* Lead Detail Panel */}
      {selectedLead && (
        <div className="p-5 rounded-2xl border space-y-4" style={cardStyle}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg" style={{ color: theme.text.primary }}>{selectedLead.name}</h3>
              <p className="text-sm" style={{ color: theme.text.secondary }}>{selectedLead.company} · {selectedLead.id}</p>
            </div>
            <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-lg" style={{ color: theme.text.secondary }}>
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p style={{ color: theme.text.secondary }}>Email</p><p style={{ color: theme.text.primary }}>{selectedLead.email}</p></div>
            <div><p style={{ color: theme.text.secondary }}>Phone</p><p style={{ color: theme.text.primary }}>{selectedLead.phone}</p></div>
            <div><p style={{ color: theme.text.secondary }}>Source</p><p style={{ color: theme.text.primary }}>{CRM_LEAD_SOURCES[selectedLead.source]?.label}</p></div>
            <div><p style={{ color: theme.text.secondary }}>Value</p><p className="font-semibold" style={{ color: theme.accent.primary }}>{selectedLead.value > 0 ? `GH₵ ${selectedLead.value.toLocaleString()}` : '—'}</p></div>
          </div>
          <div><p className="text-sm" style={{ color: theme.text.secondary }}>Notes</p><p className="text-sm" style={{ color: theme.text.secondary }}>{selectedLead.notes}</p></div>
          <div className="flex gap-2">
            <button onClick={() => addToast({ type: 'success', message: `Converting ${selectedLead.name} to deal` })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white" style={{ backgroundColor: theme.accent.primary }}>
              <ArrowRight size={16} /> Convert to Deal
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ============ PIPELINE VIEW ============
  const renderPipeline = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.secondary }} />
          <input type="text" placeholder="Search deals..." value={dealSearch} onChange={e => setDealSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm" style={inputStyle} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowNewDealDrawer(true)} className={btnOutline} style={{ borderColor: theme.accent.primary, color: theme.accent.primary }}>
            <Plus size={16} /> Add Deal
          </button>
          <button onClick={() => setDealView('kanban')} className={`px-3 py-1.5 rounded-lg text-sm ${dealView === 'kanban' ? 'font-medium' : ''}`}
            style={{ backgroundColor: dealView === 'kanban' ? theme.accent.light : 'transparent', color: dealView === 'kanban' ? theme.accent.primary : theme.text.secondary }}>
            Board
          </button>
          <button onClick={() => setDealView('list')} className={`px-3 py-1.5 rounded-lg text-sm ${dealView === 'list' ? 'font-medium' : ''}`}
            style={{ backgroundColor: dealView === 'list' ? theme.accent.light : 'transparent', color: dealView === 'list' ? theme.accent.primary : theme.text.secondary }}>
            List
          </button>
        </div>
      </div>

      {dealView === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 400 }}>
          {Object.entries(CRM_STAGES).map(([stageKey, stage]) => {
            const deals = dealsByStage[stageKey] || [];
            const stageValue = deals.reduce((s, d) => s + d.value, 0);
            return (
              <div key={stageKey} className="flex-shrink-0 w-72 flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    {renderStatusDot(stage.color)}
                    <span className="text-sm font-semibold" style={{ color: theme.text.primary }}>{stage.label}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>{deals.length}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: theme.text.secondary }}>GH₵ {(stageValue / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex-1 space-y-2 p-2 rounded-xl" style={{ backgroundColor: theme.bg.secondary }}>
                  {deals.length === 0 ? (
                    <p className="text-xs text-center py-8" style={{ color: theme.text.secondary }}>No deals</p>
                  ) : deals.map(deal => (
                    <div key={deal.id} className="p-3 rounded-xl border cursor-pointer transition-all duration-150" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = stage.color; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border.primary; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <p className="font-medium text-sm mb-1 truncate" style={{ color: theme.text.primary }}>{deal.title}</p>
                      <p className="text-xs mb-2" style={{ color: theme.text.secondary }}>{deal.company}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm" style={{ color: stage.color }}>GH₵ {deal.value.toLocaleString()}</span>
                        <span className="text-xs" style={{ color: theme.text.secondary }}>{deal.probability}%</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5" style={{ backgroundColor: theme.bg.tertiary }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${deal.probability}%`, backgroundColor: stage.color }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs" style={{ color: theme.text.secondary }}>{deal.assignedTo}</span>
                        <span className="text-xs" style={{ color: theme.text.secondary }}>{deal.expectedCloseDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: theme.bg.tertiary }}>
                  {['Deal', 'Company', 'Stage', 'Value', 'Probability', 'Assigned To', 'Close Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-sm font-semibold" style={{ color: theme.text.primary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.filter(d => {
                  if (!dealSearch) return true;
                  const q = dealSearch.toLowerCase();
                  return d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q);
                }).map(deal => (
                  <tr key={deal.id} className="border-t" style={{ borderColor: theme.border.primary }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td className="px-4 py-3">
                      <p className="font-medium" style={{ color: theme.text.primary }}>{deal.title}</p>
                      <p className="text-xs" style={{ color: theme.text.secondary }}>{deal.contactName}</p>
                    </td>
                    <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{deal.company}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: CRM_STAGES[deal.stage].bg, color: CRM_STAGES[deal.stage].color }}>
                        {CRM_STAGES[deal.stage].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: theme.text.primary }}>GH₵ {deal.value.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: theme.bg.tertiary }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${deal.probability}%`, backgroundColor: CRM_STAGES[deal.stage].color }} />
                        </div>
                        <span className="text-xs" style={{ color: theme.text.secondary }}>{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{deal.assignedTo}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: theme.text.secondary }}>{deal.expectedCloseDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // ============ CONTACTS VIEW ============
  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.secondary }} />
          <input type="text" placeholder="Search contacts..." value={contactSearch} onChange={e => { setContactSearch(e.target.value); setContactPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm" style={inputStyle} />
        </div>
        <select value={contactTagFilter} onChange={e => { setContactTagFilter(e.target.value); setContactPage(1); }} className={selectClasses} style={inputStyle}>
          <option value="all">All Tags</option>
          {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>
        <button onClick={() => setShowNewContactDrawer(true)} className={btnOutline} style={{ borderColor: theme.accent.primary, color: theme.accent.primary }}>
          <UserPlus size={16} /> Add Contact
        </button>
        <button
          onClick={() => {
            const exportData = filteredContacts.map(contact => ({
              Name: contact.name,
              Email: contact.email,
              Phone: contact.phone,
              Company: contact.company,
              Role: contact.role,
              Tags: contact.tags.join('; '),
              'Active Deals': contact.deals,
              'Total Value': `$${contact.totalValue?.toLocaleString() || 0}`,
              'Last Activity': contact.lastActivity
            }));
            exportToCSV(exportData, 'crm_contacts');
            addToast({ type: 'success', message: `Exported ${exportData.length} contacts to CSV` });
          }}
          className={btnOutline}
          style={{ borderColor: theme.border.primary, color: theme.text.primary }}
        >
          <Download size={16} /> Export
        </button>
      </div>

      {loading ? <TableSkeleton rows={5} cols={6} theme={theme} /> : filteredContacts.length === 0 ? (
        <EmptyState icon={Users} title="No contacts found" description="Try adjusting your search or filters" theme={theme} />
      ) : (
        <>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: theme.bg.tertiary }}>
                    {['Name', 'Company', 'Role', 'Tags', 'Deals', 'Total Value', 'Last Activity', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-sm font-semibold" style={{ color: theme.text.primary }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedContacts.map(contact => (
                    <tr key={contact.id} className="border-t" style={{ borderColor: theme.border.primary }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: theme.text.primary }}>{contact.name}</p>
                        <p className="text-xs" style={{ color: theme.text.secondary }}>{contact.email}</p>
                      </td>
                      <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{contact.company}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: theme.text.secondary }}>{contact.role}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {contact.tags.map(tag => (
                            <span key={tag} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: theme.text.primary }}>{contact.totalDeals}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: theme.text.primary }}>
                        {contact.totalValue > 0 ? `GH₵ ${contact.totalValue.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: theme.text.secondary }}>{contact.lastActivity}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedContact(selectedContact?.id === contact.id ? null : contact)} className="p-1.5 rounded-lg" style={{ color: theme.text.secondary }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={contactPage} totalPages={Math.ceil(filteredContacts.length / itemsPerPage)} onPageChange={setContactPage} />
        </>
      )}

      {/* Contact Detail Panel */}
      {selectedContact && (
        <div className="p-5 rounded-2xl border space-y-4" style={cardStyle}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg" style={{ color: theme.text.primary }}>{selectedContact.name}</h3>
              <p className="text-sm" style={{ color: theme.text.secondary }}>{selectedContact.role} at {selectedContact.company}</p>
            </div>
            <button onClick={() => setSelectedContact(null)} className="p-1.5 rounded-lg" style={{ color: theme.text.secondary }}>
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p style={{ color: theme.text.secondary }}>Email</p><p style={{ color: theme.text.primary }}>{selectedContact.email}</p></div>
            <div><p style={{ color: theme.text.secondary }}>Phone</p><p style={{ color: theme.text.primary }}>{selectedContact.phone}</p></div>
            <div><p style={{ color: theme.text.secondary }}>Total Deals</p><p className="font-semibold" style={{ color: theme.text.primary }}>{selectedContact.totalDeals}</p></div>
            <div><p style={{ color: theme.text.secondary }}>Total Value</p><p className="font-semibold" style={{ color: theme.accent.primary }}>GH₵ {selectedContact.totalValue.toLocaleString()}</p></div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: theme.text.primary }}>Activity Timeline</p>
            <div className="space-y-2">
              {activities.filter(a => a.contactName === selectedContact.name).slice(0, 5).map(act => (
                <div key={act.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                  <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: CRM_ACTIVITY_TYPES[act.type].bg }}>
                    {act.type === 'call' && <Phone size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                    {act.type === 'email' && <Mail size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                    {act.type === 'meeting' && <Users size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                    {act.type === 'task' && <CheckCircle size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                    {act.type === 'note' && <FileText size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: theme.text.primary }}>{act.subject}</p>
                    <p className="text-xs" style={{ color: theme.text.secondary }}>{act.dueDate}</p>
                  </div>
                </div>
              ))}
              {activities.filter(a => a.contactName === selectedContact.name).length === 0 && (
                <p className="text-xs py-2" style={{ color: theme.text.secondary }}>No activities recorded</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============ ACTIVITIES VIEW ============
  const renderActivities = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
        {[
          { label: 'Scheduled', count: activities.filter(a => a.status === 'scheduled').length, color: '#3B82F6', bg: '#EFF6FF' },
          { label: 'Completed', count: activities.filter(a => a.status === 'completed').length, color: '#10B981', bg: '#ECFDF5' },
          { label: 'Overdue', count: activities.filter(a => a.status === 'overdue').length, color: '#EF4444', bg: '#FEF2F2' },
        ].map(item => (
          <div key={item.label} className="p-4 rounded-xl border flex items-center gap-3" style={cardStyle}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.bg }}>
              <span className="text-lg font-bold" style={{ color: item.color }}>{item.count}</span>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{item.label}</p>
              <p className="text-xs" style={{ color: theme.text.secondary }}>activities</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.secondary }} />
          <input type="text" placeholder="Search activities..." value={activitySearch} onChange={e => { setActivitySearch(e.target.value); setActivityPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm" style={inputStyle} />
        </div>
        <select value={activityTypeFilter} onChange={e => { setActivityTypeFilter(e.target.value); setActivityPage(1); }} className={selectClasses} style={inputStyle}>
          <option value="all">All Types</option>
          {Object.entries(CRM_ACTIVITY_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={activityStatusFilter} onChange={e => { setActivityStatusFilter(e.target.value); setActivityPage(1); }} className={selectClasses} style={inputStyle}>
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <button onClick={() => setShowNewActivityDrawer(true)} className={btnOutline} style={{ borderColor: theme.accent.primary, color: theme.accent.primary }}>
          <Plus size={16} /> Add Activity
        </button>
        <button
          onClick={() => {
            const exportData = filteredActivities.map(activity => ({
              Type: CRM_ACTIVITY_TYPES[activity.type]?.label || activity.type,
              Subject: activity.subject,
              'Related To': activity.relatedTo,
              'Assigned To': activity.assignedTo,
              Date: activity.date,
              Status: activity.status.charAt(0).toUpperCase() + activity.status.slice(1),
              Notes: activity.notes || ''
            }));
            exportToCSV(exportData, 'crm_activities');
            addToast({ type: 'success', message: `Exported ${exportData.length} activities to CSV` });
          }}
          className={btnOutline}
          style={{ borderColor: theme.border.primary, color: theme.text.primary }}
        >
          <Download size={16} /> Export
        </button>
      </div>

      {loading ? <TableSkeleton rows={5} cols={6} theme={theme} /> : filteredActivities.length === 0 ? (
        <EmptyState icon={Calendar} title="No activities found" description="Try adjusting your filters" theme={theme} />
      ) : (
        <>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: theme.bg.tertiary }}>
                    {['Type', 'Subject', 'Contact', 'Deal', 'Assigned To', 'Due Date', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-sm font-semibold" style={{ color: theme.text.primary }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedActivities.map(act => (
                    <tr key={act.id} className={`border-t ${act.status === 'overdue' ? '' : ''}`} style={{ borderColor: theme.border.primary, backgroundColor: act.status === 'overdue' ? `${theme.status?.error || '#EF4444'}08` : 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = act.status === 'overdue' ? `${theme.status?.error || '#EF4444'}12` : theme.bg.hover}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = act.status === 'overdue' ? `${theme.status?.error || '#EF4444'}08` : 'transparent'}>
                      <td className="px-4 py-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: CRM_ACTIVITY_TYPES[act.type].bg }}>
                          {act.type === 'call' && <Phone size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                          {act.type === 'email' && <Mail size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                          {act.type === 'meeting' && <Users size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                          {act.type === 'task' && <CheckCircle size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                          {act.type === 'note' && <FileText size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: theme.text.primary }}>{act.subject}</p>
                        <p className="text-xs truncate max-w-xs" style={{ color: theme.text.secondary }}>{act.description}</p>
                      </td>
                      <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{act.contactName || '—'}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: theme.text.secondary }}>{act.dealTitle || '—'}</td>
                      <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{act.assignedTo}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: act.status === 'overdue' ? '#EF4444' : theme.text.secondary }}>
                        {act.status === 'overdue' && <AlertTriangle size={16} className="inline mr-1" />}
                        {act.dueDate}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                          backgroundColor: act.status === 'completed' ? '#ECFDF5' : act.status === 'overdue' ? '#FEF2F2' : '#EFF6FF',
                          color: act.status === 'completed' ? '#10B981' : act.status === 'overdue' ? '#EF4444' : '#3B82F6',
                        }}>
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={activityPage} totalPages={Math.ceil(filteredActivities.length / itemsPerPage)} onPageChange={setActivityPage} />
        </>
      )}
    </div>
  );

  // ============ REPORTS VIEW ============
  const renderReports = () => {
    const conversionFunnel = [
      { stage: 'Leads', count: leads.length, color: '#3B82F6' },
      { stage: 'Qualified', count: leads.filter(l => l.status === 'qualified').length, color: '#8B5CF6' },
      { stage: 'Deals Created', count: deals.length, color: '#F59E0B' },
      { stage: 'Proposals', count: deals.filter(d => ['proposal', 'negotiation', 'closed_won'].includes(d.stage)).length, color: '#F97316' },
      { stage: 'Won', count: deals.filter(d => d.stage === 'closed_won').length, color: '#10B981' },
    ];
    const maxCount = Math.max(...conversionFunnel.map(s => s.count));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Total Pipeline" value={`GH₵ ${(crmMetrics.pipelineValue / 1000).toFixed(0)}K`} icon={DollarSign} loading={loading} />
          <MetricCard title="Avg Deal Size" value={`GH₵ ${Math.round(deals.reduce((s, d) => s + d.value, 0) / deals.length / 1000)}K`} icon={BarChart3} loading={loading} />
          <MetricCard title="Win Rate" value={`${crmMetrics.conversionRate}%`} icon={TrendingUp} loading={loading} />
          <MetricCard title="Active Leads" value={leads.filter(l => l.status !== 'unqualified').length} icon={Target} loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <div className="p-5 rounded-2xl border" style={cardStyle}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Conversion Funnel</h3>
            <div className="space-y-3">
              {conversionFunnel.map((item) => (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: theme.text.secondary }}>{item.stage}</span>
                    <span className="font-medium" style={{ color: theme.text.primary }}>{item.count}</span>
                  </div>
                  <div className="w-full h-6 rounded-lg overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                    <div className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max((item.count / maxCount) * 100, 8)}%`, backgroundColor: item.color }}>
                      <span className="text-xs text-white font-medium">{Math.round((item.count / leads.length) * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Value by Stage */}
          <div className="p-5 rounded-2xl border" style={cardStyle}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Pipeline Value by Stage</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pipelineChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 11 }} tickFormatter={v => `${v / 1000}K`} />
                <YAxis type="category" dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 11 }} width={85} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} formatter={(v) => [`GH₵ ${v.toLocaleString()}`, 'Value']} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {pipelineChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deals Over Time */}
          <div className="p-5 rounded-2xl border" style={cardStyle}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Deals Won vs Lost</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={crmMonthlyData}>
                <defs>
                  <linearGradient id="gradWonR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                <Area type="monotone" dataKey="won" stroke="#10B981" fill="url(#gradWonR)" strokeWidth={2} name="Won" />
                <Area type="monotone" dataKey="lost" stroke="#EF4444" fill="transparent" strokeWidth={2} name="Lost" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Metrics */}
          <div className="p-5 rounded-2xl border" style={cardStyle}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Activity by Type</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activityBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {activityBreakdownData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Team Performance */}
        <div className="p-5 rounded-2xl border" style={cardStyle}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Sales Team Performance</h3>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: theme.bg.tertiary }}>
                  {['Team Member', 'Leads', 'Active Deals', 'Pipeline Value', 'Won Value', 'Activities'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-sm font-semibold" style={{ color: theme.text.primary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['Ama Owusu', 'Daniel Boateng', 'Kwame Asante'].map(name => {
                  const leads = leads.filter(l => l.assignedTo === name).length;
                  const deals = deals.filter(d => d.assignedTo === name && !['closed_won', 'closed_lost'].includes(d.stage));
                  const won = deals.filter(d => d.assignedTo === name && d.stage === 'closed_won');
                  const acts = activities.filter(a => a.assignedTo === name).length;
                  return (
                    <tr key={name} className="border-t" style={{ borderColor: theme.border.primary }}>
                      <td className="px-4 py-3 font-medium" style={{ color: theme.text.primary }}>{name}</td>
                      <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{leads}</td>
                      <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{deals.length}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: theme.text.primary }}>GH₵ {deals.reduce((s, d) => s + d.value, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: '#10B981' }}>GH₵ {won.reduce((s, d) => s + d.value, 0).toLocaleString()}</td>
                      <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{acts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ============ MAIN RENDER ============
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>
            CRM {currentView !== 'Dashboard' ? `· ${currentView}` : ''}
          </h1>
          <p style={{ color: theme.text.secondary }}>
            {currentView === 'Dashboard' && 'Sales pipeline overview and key metrics'}
            {currentView === 'Leads' && `${filteredLeads.length} leads · Manage your sales pipeline`}
            {currentView === 'Pipeline' && `${deals.length} deals across ${Object.keys(CRM_STAGES).length} stages`}
            {currentView === 'Contacts' && `${filteredContacts.length} contacts in your network`}
            {currentView === 'Activities' && `${filteredActivities.length} activities · Track your team's work`}
            {currentView === 'Reports' && 'Analytics and performance metrics'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)} className={btnOutline} style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => addToast({ type: 'info', message: 'Refreshing CRM data...' })} className={btnOutline} style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* View Content */}
      {currentView === 'Dashboard' && renderDashboard()}
      {currentView === 'Leads' && renderLeads()}
      {currentView === 'Pipeline' && renderPipeline()}
      {currentView === 'Contacts' && renderContacts()}
      {currentView === 'Activities' && renderActivities()}
      {currentView === 'Reports' && renderReports()}

      {/* Drawers */}
      <NewLeadDrawer
        isOpen={showNewLeadDrawer}
        onClose={() => setShowNewLeadDrawer(false)}
        onSave={handleSaveLead}
      />
      <NewContactDrawer
        isOpen={showNewContactDrawer}
        onClose={() => setShowNewContactDrawer(false)}
        onSave={handleSaveContact}
      />
      <NewDealDrawer
        isOpen={showNewDealDrawer}
        onClose={() => setShowNewDealDrawer(false)}
        onSave={handleSaveDeal}
      />
      <NewActivityDrawer
        isOpen={showNewActivityDrawer}
        onClose={() => setShowNewActivityDrawer(false)}
        onSave={handleSaveActivity}
      />
    </div>
  );
};
