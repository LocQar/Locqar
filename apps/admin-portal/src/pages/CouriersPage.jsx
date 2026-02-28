import React, { useState, useMemo } from 'react';
import { Search, Users2, UserCheck, UserX, QrCode, CreditCard, Phone, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { COURIER_STATUSES } from '../constants';
import { couriersData } from '../constants/mockData';

export const CouriersPage = ({ addToast }) => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [couriers, setCouriers] = useState(couriersData);

  const filteredCouriers = useMemo(() => {
    return couriers.filter(c => {
      const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.cardNo.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || String(c.status) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [couriers, search, statusFilter]);

  const totalCouriers = couriers.length;
  const activeCouriers = couriers.filter(c => c.status === 1).length;
  const disabledCouriers = couriers.filter(c => c.status === 0).length;

  const handleToggleStatus = (courierId) => {
    setCouriers(prev => prev.map(c => {
      if (c.id === courierId) {
        const newStatus = c.status === 1 ? 0 : 1;
        addToast?.({ type: 'success', message: `Courier ${c.name} ${newStatus === 1 ? 'enabled' : 'disabled'}` });
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Couriers</h1>
          <p style={{ color: theme.text.muted }}>Manage courier accounts for terminal access</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ['Total Couriers', totalCouriers, Users2, null],
          ['Active', activeCouriers, UserCheck, '#81C995'],
          ['Disabled', disabledCouriers, UserX, '#A8A29E'],
        ].map(([label, value, Icon, color]) => (
          <div key={label} className="p-5 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex justify-between">
              <div>
                <p className="text-sm" style={{ color: theme.text.muted }}>{label}</p>
                <p className="text-3xl font-bold mt-1" style={{ color: color || theme.text.primary }}>{value}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${color || theme.accent.primary}15` }}>
                <Icon size={24} style={{ color: color || theme.accent.primary }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, or card..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
          {[['all', 'All'], ['1', 'Active'], ['0', 'Disabled']].map(([val, label]) => (
            <button key={val} onClick={() => setStatusFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: statusFilter === val ? theme.accent.primary : 'transparent', color: statusFilter === val ? theme.accent.contrast : theme.text.muted }}>{label}</button>
          ))}
        </div>
      </div>

      <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredCouriers.length} of {totalCouriers} couriers</p>

      {/* Couriers Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Name</th>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Phone</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Card No</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>QR Code</th>
                <th className="text-right p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCouriers.map(courier => {
                const statusInfo = COURIER_STATUSES[courier.status];
                return (
                  <tr key={courier.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${statusInfo?.color || '#A8A29E'}20`, color: statusInfo?.color || '#A8A29E' }}>
                          {courier.name.charAt(0)}
                        </div>
                        <span className="font-medium" style={{ color: theme.text.primary }}>{courier.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${statusInfo?.color}15`, color: statusInfo?.color }}>
                        {statusInfo?.label}
                      </span>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Phone size={14} style={{ color: theme.icon.muted }} />
                        <span className="text-sm font-mono" style={{ color: theme.text.secondary }}>{courier.phone}</span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <CreditCard size={14} style={{ color: theme.icon.muted }} />
                        <span className="text-sm font-mono" style={{ color: theme.text.secondary }}>{courier.cardNo}</span>
                      </div>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <QrCode size={14} style={{ color: theme.icon.muted }} />
                        <span className="text-sm font-mono" style={{ color: theme.text.secondary }}>{courier.qrCode}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleStatus(courier.id)}
                        className="p-2 rounded-lg hover:bg-white/5 inline-flex items-center gap-1"
                        style={{ color: courier.status === 1 ? '#81C995' : '#A8A29E' }}
                        title={courier.status === 1 ? 'Disable courier' : 'Enable courier'}
                      >
                        {courier.status === 1 ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredCouriers.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-sm" style={{ color: theme.text.muted }}>No couriers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
