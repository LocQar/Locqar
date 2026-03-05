import React, { useState } from 'react';
import { Download, Plus, Search, X, Eye, CheckCircle2, RefreshCw, MapPin, Grid3X3, ArrowUpRight, ArrowDownRight, UserCheck, User, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Checkbox, EmptyState, TableSkeleton, Pagination } from '../components/ui';
import { StatusBadge, DeliveryMethodBadge } from '../components/ui/Badge';
import { hasPermission, DELIVERY_METHODS } from '../constants';
import { terminalsData, getTerminalAddress, getLockerAddress } from '../constants/mockData';

export const PackagesPage = ({
  currentUser,
  loading,
  activeSubMenu,
  filteredPackages,
  paginatedPackages,
  packageSearch,
  setPackageSearch,
  packageFilter,
  setPackageFilter,
  methodFilter,
  setMethodFilter,
  packageSort,
  setPackageSort,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalPages,
  selectedItems,
  toggleSelectAll,
  toggleSelectItem,
  setShowExport,
  setShowNewPackage,
  setSelectedPackage,
  setReassignPackage,
  setAssignCourierPackage,
  onMarkDelivered,
  onDeletePackage,
  addToast,
}) => {
  const { theme } = useTheme();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Packages</h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'All Packages'} • {filteredPackages.length} packages</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Download size={16} /> Export
          </button>
          {hasPermission(currentUser.role, 'packages.receive') && (
            <button onClick={() => setShowNewPackage(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
              <Plus size={18} /> Add Package
            </button>
          )}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Total</p>
          <p className="text-2xl font-bold mt-1" style={{ color: theme.text.primary }}>{filteredPackages.length}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>In Locker</p>
          <p className="text-2xl font-bold mt-1" style={{ color: theme.text.primary }}>{filteredPackages.filter(p => p.status === 'delivered_to_locker').length}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>In Transit</p>
          <p className="text-2xl font-bold mt-1" style={{ color: theme.text.primary }}>{filteredPackages.filter(p => p.status.startsWith('in_transit')).length}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Pending</p>
          <p className="text-2xl font-bold mt-1" style={{ color: theme.text.primary }}>{filteredPackages.filter(p => ['pending', 'at_warehouse', 'at_dropbox'].includes(p.status)).length}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Total Value</p>
          <p className="text-2xl font-bold mt-1" style={{ color: theme.accent.primary }}>GH₵ {filteredPackages.reduce((sum, p) => sum + p.value, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
        <Search size={18} style={{ color: theme.icon.muted }} />
        <input
          type="text"
          value={packageSearch}
          onChange={e => { setPackageSearch(e.target.value); setCurrentPage(1); }}
          placeholder="Search by waybill, customer, phone, destination..."
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: theme.text.primary }}
        />
        {packageSearch && <button onClick={() => { setPackageSearch(''); setCurrentPage(1); }} className="p-1 rounded" style={{ color: theme.text.muted }}><X size={16} /></button>}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {[['all', 'All'], ['locker', 'In Locker'], ['pending_pickup', 'Pending Pickup'], ['transit', 'In Transit'], ['expired', 'Expired']].map(([k, l]) => (
            <button key={k} onClick={() => { setPackageFilter(k); setCurrentPage(1); }} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: packageFilter === k ? theme.accent.light : 'transparent', color: packageFilter === k ? theme.accent.primary : theme.text.muted, border: packageFilter === k ? `1px solid ${theme.accent.border}` : '1px solid transparent' }}>{l}</button>
          ))}
        </div>
        <div className="h-6 w-px hidden md:block" style={{ backgroundColor: theme.border.primary }} />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm" style={{ color: theme.text.muted }}>Method:</span>
          {[['all', 'All'], ...Object.entries(DELIVERY_METHODS).map(([k, v]) => [k, v.label])].map(([k, l]) => (
            <button key={k} onClick={() => { setMethodFilter(k); setCurrentPage(1); }} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: methodFilter === k ? (DELIVERY_METHODS[k]?.color || theme.accent.primary) + '15' : 'transparent', color: methodFilter === k ? DELIVERY_METHODS[k]?.color || theme.accent.primary : theme.text.muted }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
        {loading ? <TableSkeleton rows={pageSize} cols={7} theme={theme} /> : filteredPackages.length === 0 ? (
          <EmptyState icon={Plus} title="No packages found" description="There are no packages matching your current filters. Try adjusting your search criteria." action="Add New Package" theme={theme} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <th className="text-left p-4 w-10">
                      <Checkbox checked={selectedItems.length === paginatedPackages.length && paginatedPackages.length > 0} onChange={toggleSelectAll} theme={theme} />
                    </th>
                    {[
                      { label: 'Package', field: 'waybill', cls: '' },
                      { label: 'Customer', field: 'customer', cls: 'hidden md:table-cell' },
                      { label: 'Method', field: null, cls: 'hidden lg:table-cell' },
                      { label: 'Destination', field: 'destination', cls: 'hidden md:table-cell' },
                      { label: 'Status', field: 'status', cls: '' },
                      { label: 'Courier', field: null, cls: 'hidden lg:table-cell' },
                      { label: 'Value', field: 'value', cls: 'hidden lg:table-cell' },
                    ].map(col => (
                      <th key={col.label} className={`text-left p-4 text-xs font-semibold uppercase ${col.cls}`} style={{ color: theme.text.muted }}>
                        {col.field ? (
                          <button onClick={() => setPackageSort(prev => ({ field: col.field, dir: prev.field === col.field && prev.dir === 'asc' ? 'desc' : 'asc' }))} className="flex items-center gap-1 hover:opacity-80">
                            {col.label}
                            {packageSort.field === col.field && (
                              packageSort.dir === 'asc' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />
                            )}
                          </button>
                        ) : col.label}
                      </th>
                    ))}
                    <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPackages.map(pkg => (
                    <tr key={pkg.id} className="cursor-pointer hover:bg-white/5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <Checkbox checked={selectedItems.includes(pkg.id)} onChange={() => toggleSelectItem(pkg.id)} theme={theme} />
                      </td>
                      <td className="p-4" onClick={() => setSelectedPackage(pkg)}>
                        <p className="font-mono font-medium" style={{ color: theme.text.primary }}>{pkg.waybill}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.product}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell" onClick={() => setSelectedPackage(pkg)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>{pkg.customer.charAt(0)}</div>
                          <div>
                            <p className="text-sm" style={{ color: theme.text.primary }}>{pkg.customer}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell" onClick={() => setSelectedPackage(pkg)}><DeliveryMethodBadge method={pkg.deliveryMethod} /></td>
                      <td className="p-4 hidden md:table-cell" onClick={() => setSelectedPackage(pkg)}>
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: theme.icon.muted }} />
                          <div>
                            <p className="text-sm" style={{ color: theme.text.primary }}>{pkg.destination}</p>
                            {pkg.locker !== '-' && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Grid3X3 size={12} style={{ color: theme.accent.primary }} />
                                <span className="text-xs font-mono font-medium" style={{ color: theme.accent.primary }}>{pkg.locker}</span>
                                {(() => { const t = terminalsData.find(t => t.name === pkg.destination); return t ? <span className="text-xs font-mono" style={{ color: theme.text.muted }}>({getLockerAddress(pkg.locker, pkg.destination)})</span> : null; })()}
                              </div>
                            )}
                            {pkg.locker === '-' && (() => { const t = terminalsData.find(t => t.name === pkg.destination); return t ? <p className="text-xs font-mono mt-0.5" style={{ color: theme.text.muted }}>{getTerminalAddress(t)}</p> : null; })()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4" onClick={() => setSelectedPackage(pkg)}><StatusBadge status={pkg.status} /></td>
                      <td className="p-4 hidden lg:table-cell" onClick={e => e.stopPropagation()}>
                        {pkg.courier ? (
                          <button
                            onClick={() => setAssignCourierPackage(pkg)}
                            className="flex items-center gap-1.5 group"
                            title="Reassign courier"
                          >
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: `${theme.accent.primary}20`, color: theme.accent.primary }}>
                              {pkg.courier.name.charAt(0)}
                            </div>
                            <span className="text-sm group-hover:underline" style={{ color: theme.text.primary }}>{pkg.courier.name}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setAssignCourierPackage(pkg)}
                            className="flex items-center gap-1.5 text-xs rounded-lg px-2 py-1 border"
                            style={{ borderColor: theme.border.primary, color: theme.text.muted }}
                            title="Assign courier"
                          >
                            <User size={12} /> Assign
                          </button>
                        )}
                      </td>
                      <td className="p-4 hidden lg:table-cell" onClick={() => setSelectedPackage(pkg)}>
                        <span className="text-sm" style={{ color: theme.text.primary }}>GH₵ {pkg.value}</span>
                        {pkg.cod && <span className="ml-2 text-xs text-amber-500">COD</span>}
                      </td>
                      <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedPackage(pkg)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="View"><Eye size={15} /></button>
                          {hasPermission(currentUser.role, 'packages.update') && (
                            <>
                              <button onClick={() => onMarkDelivered(pkg)} className="p-1.5 rounded-lg hover:bg-white/5 text-emerald-500" title="Mark Delivered"><CheckCircle2 size={15} /></button>
                              <button onClick={() => setReassignPackage(pkg)} className="p-1.5 rounded-lg hover:bg-white/5 text-amber-500" title="Reassign"><RefreshCw size={15} /></button>
                              <button onClick={() => setAssignCourierPackage(pkg)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.accent.primary }} title="Assign Courier"><UserCheck size={15} /></button>
                            </>
                          )}
                          {hasPermission(currentUser.role, 'packages.delete') && (
                            <button onClick={() => setDeleteConfirm(pkg)} className="p-1.5 rounded-lg hover:bg-white/5 text-red-400" title="Delete"><Trash2 size={15} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} totalItems={filteredPackages.length} theme={theme} />
          </>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-sm rounded-2xl border p-6 space-y-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg" style={{ color: theme.text.primary }}>Delete Package?</h3>
            <p className="text-sm" style={{ color: theme.text.muted }}>
              Remove <span className="font-mono font-semibold" style={{ color: theme.text.primary }}>{deleteConfirm.waybill}</span> permanently? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
              <button onClick={() => { onDeletePackage(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: '#D48E8A', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
