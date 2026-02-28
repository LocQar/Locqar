import React, { useMemo, useState, useCallback } from "react";
import {
  Download,
  RefreshCw,
  Package,
  Grid3X3,
  Truck,
  Clock,
  DollarSign,
  Scan,
  Plus,
  Route,
  Home,
  AlertTriangle,
  Users,
  MapPin,
  LayoutDashboard
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { useTheme } from "../contexts/ThemeContext";
import { MetricCard, QuickAction, TableSkeleton } from "../components/ui";
import { StatusPieChart } from "../components/charts";
import { DELIVERY_METHODS, hasPermission } from "../constants";
import {
  packagesData,
  terminalData,
  hourlyData,
  notifications,
} from "../constants/mockData";

import { OperationsMap } from "../components/operations/OperationsMap";

export const DashboardPage = ({
  currentUser,
  metrics,
  loading,
  setLoading,
  setShowExport,
  setShowScanModal,
  setShowNewPackage,
  setShowDispatchDrawer,
  setActiveMenu,
  setActiveSubMenu,
  addToast,
}) => {
  const { theme } = useTheme();
  const [showMap, setShowMap] = React.useState(false);

  const statusDistribution = useMemo(
    () => [
      {
        name: "In Locker",
        value: packagesData.filter((p) => p.status === "delivered_to_locker")
          .length,
      },
      {
        name: "In Transit",
        value: packagesData.filter((p) => p.status.includes("transit")).length,
      },
      {
        name: "Pending",
        value: packagesData.filter((p) => p.status === "pending").length,
      },
      {
        name: "Expired",
        value: packagesData.filter((p) => p.status === "expired").length,
      },
      {
        name: "Other",
        value: packagesData.filter(
          (p) =>
            !["delivered_to_locker", "pending", "expired"].includes(p.status) &&
            !p.status.includes("transit"),
        ).length,
      },
    ],
    [],
  );

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const greetingEmoji = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return '☀️';
    if (h < 18) return '👋';
    return '🌙';
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold"
            style={{ color: theme.text.primary }}
          >
            {greeting}, {currentUser.name.split(" ")[0]} {greetingEmoji}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>
            Here's your network overview for today.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{
              backgroundColor: showMap ? theme.accent.primary : 'transparent',
              color: showMap ? theme.accent.contrast : theme.text.secondary,
              border: `1px solid ${showMap ? theme.accent.primary : theme.border.primary} `
            }}
          >
            {showMap ? <LayoutDashboard size={16} /> : <MapPin size={16} />}
            {showMap ? 'List View' : 'Live Map'}
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm"
            style={{
              borderColor: theme.border.primary,
              color: theme.text.secondary,
            }}
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1000);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm"
            style={{
              borderColor: theme.border.primary,
              color: theme.text.secondary,
            }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {showMap && (
        <div className="animate-in fade-in zoom-in duration-300">
          <OperationsMap />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard
          title="Total Packages"
          value={metrics.totalPackages.toLocaleString()}
          change="12.5%"
          changeType="up"
          icon={Package}
          theme={theme}
          loading={loading}
        />
        <MetricCard
          title="In Lockers"
          value={metrics.inLockers.toLocaleString()}
          change="8.2%"
          changeType="up"
          icon={Grid3X3}
          subtitle="Awaiting pickup"
          theme={theme}
          loading={loading}
        />
        <MetricCard
          title="In Transit"
          value={metrics.inTransit.toLocaleString()}
          icon={Truck}
          theme={theme}
          loading={loading}
        />
        <MetricCard
          title="Pending Pickup"
          value={metrics.pendingPickup.toLocaleString()}
          change="5.1%"
          changeType="down"
          icon={Clock}
          theme={theme}
          loading={loading}
        />
        <MetricCard
          title="Revenue"
          value={`GH₵ ${(metrics.revenue / 1000).toFixed(1)} K`}
          change="18.7%"
          changeType="up"
          icon={DollarSign}
          theme={theme}
          loading={loading}
        />
      </div>

      <div
        className="p-4 rounded-2xl border"
        style={{
          backgroundColor: theme.bg.card,
          borderColor: theme.border.primary,
        }}
      >
        <h3
          className="text-sm font-semibold mb-4"
          style={{ color: theme.text.muted }}
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          <QuickAction
            icon={Scan}
            label="Scan"
            theme={theme}
            disabled={!hasPermission(currentUser.role, "packages.scan")}
            onClick={() => setShowScanModal(true)}
          />
          <QuickAction
            icon={Plus}
            label="New Package"
            theme={theme}
            disabled={!hasPermission(currentUser.role, "packages.receive")}
            onClick={() => setShowNewPackage(true)}
          />
          <QuickAction
            icon={Truck}
            label="Dispatch"
            theme={theme}
            disabled={!hasPermission(currentUser.role, "packages.dispatch")}
            onClick={() => setShowDispatchDrawer(true)}
            badge="12"
          />
          <QuickAction
            icon={Route}
            label="Route Plan"
            theme={theme}
            disabled={!hasPermission(currentUser.role, "packages.dispatch")}
            onClick={() => {
              setActiveMenu("dispatch");
              setActiveSubMenu("Route Planning");
            }}
          />
          <QuickAction
            icon={Home}
            label="Home Delivery"
            theme={theme}
            disabled={!hasPermission(currentUser.role, "packages.dispatch")}
            onClick={() =>
              addToast({ type: "info", message: "Home delivery queue" })
            }
          />
          <QuickAction
            icon={AlertTriangle}
            label="Report Issue"
            theme={theme}
            onClick={() =>
              addToast({ type: "warning", message: "Issue report form" })
            }
          />
          <QuickAction
            icon={Grid3X3}
            label="Lockers"
            theme={theme}
            onClick={() => setActiveMenu("lockers")}
          />
          <QuickAction
            icon={Users}
            label="Customers"
            theme={theme}
            onClick={() => setActiveMenu("customers")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(DELIVERY_METHODS).map((m) => {
          const count = packagesData.filter(
            (p) => p.deliveryMethod === m.id,
          ).length;
          return (
            <div
              key={m.id}
              className="p-4 rounded-xl border flex items-center gap-4 transition-all duration-200"
              style={{
                backgroundColor: theme.bg.card,
                borderColor: theme.border.primary,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = theme.border.focus;
                e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.12)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = theme.border.primary;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                className="p-3 rounded-xl shrink-0"
                style={{
                  backgroundColor: theme.bg.tertiary,
                  border: `1px solid ${theme.border.secondary}`,
                }}
              >
                <m.icon size={22} style={{ color: theme.text.primary }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-snug" style={{ color: theme.text.primary }}>
                  {m.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>Active route</p>
              </div>
              <p className="text-2xl font-bold tabular-nums" style={{ color: theme.text.primary }}>
                {count}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 p-5 rounded-2xl border"
          style={{
            backgroundColor: theme.bg.card,
            borderColor: theme.border.primary,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>
              Terminal Performance
            </h3>
            <div className="flex gap-2">
              {[
                { label: "Accra", color: theme.chart.blue },
                { label: "Achimota", color: theme.chart.teal },
                { label: "Kotoka", color: theme.chart.green },
              ].map((l) => (
                <span
                  key={l.label}
                  className="flex items-center gap-1 text-xs"
                  style={{ color: theme.text.muted }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          {loading ? (
            <TableSkeleton rows={3} cols={1} theme={theme} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={terminalData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={theme.chart.blue}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={theme.chart.blue}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.border.primary}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: theme.text.muted, fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: theme.text.muted, fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.bg.card,
                    border: `1px solid ${theme.border.primary} `,
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: theme.text.primary }}
                  itemStyle={{ color: theme.text.secondary }}
                />
                <Area
                  type="monotone"
                  dataKey="accra"
                  stroke={theme.chart.blue}
                  fill="url(#grad)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="achimota"
                  stroke={theme.chart.teal}
                  fill="transparent"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="kotoka"
                  stroke={theme.chart.green}
                  fill="transparent"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div
          className="p-5 rounded-2xl border"
          style={{
            backgroundColor: theme.bg.card,
            borderColor: theme.border.primary,
          }}
        >
          <h3
            className="font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Package Status
          </h3>
          {loading ? (
            <TableSkeleton rows={3} cols={1} theme={theme} />
          ) : (
            <>
              <StatusPieChart data={statusDistribution} theme={theme} />
              <div className="space-y-2 mt-4">
                {statusDistribution.map((s, i) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between"
                  >
                    <span
                      className="flex items-center gap-2 text-sm"
                      style={{ color: theme.text.secondary }}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: theme.chart.series[i],
                        }}
                      />
                      {s.name}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: theme.text.primary }}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="p-5 rounded-2xl border"
          style={{
            backgroundColor: theme.bg.card,
            borderColor: theme.border.primary,
          }}
        >
          <h3
            className="font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Peak Hours
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={hourlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.border.primary}
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.text.muted, fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.text.muted, fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.bg.card,
                  border: `1px solid ${theme.border.primary} `,
                  borderRadius: 12,
                }}
              />
              <Bar
                dataKey="packages"
                fill={theme.chart.blue}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          className="p-5 rounded-2xl border"
          style={{
            backgroundColor: theme.bg.card,
            borderColor: theme.border.primary,
          }}
        >
          <h3
            className="font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Recent Activity
          </h3>
          <div className="space-y-0">
            {notifications.slice(0, 5).map((n, idx, arr) => {
              const dotColor =
                n.type === 'error' ? theme.status.error
                  : n.type === 'warning' ? theme.status.warning
                    : n.type === 'success' ? theme.status.success
                      : theme.status.info;
              return (
                <div key={n.id} className="flex gap-3 relative">
                  {/* Connector line */}
                  {idx < arr.length - 1 && (
                    <div
                      className="absolute left-[7px] top-5 bottom-0 w-px"
                      style={{ backgroundColor: theme.border.primary }}
                    />
                  )}
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 mt-1.5 ring-2 relative z-10"
                    style={{
                      backgroundColor: dotColor,
                      ringColor: theme.bg.card,
                      boxShadow: `0 0 0 2px ${theme.bg.card}`,
                    }}
                  />
                  <div className="pb-3">
                    <p className="text-sm leading-snug" style={{ color: theme.text.primary }}>
                      {n.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                      {n.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
