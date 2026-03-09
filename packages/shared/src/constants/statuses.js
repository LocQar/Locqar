// ============ WINNSEN API CONSTANTS ============
export const WAYBILL_API_STATUSES = {
  11: { code: 11, label: 'Courier Dropped Off', phase: 'dropoff' },
  12: { code: 12, label: 'User Dropped Off', phase: 'dropoff' },
  13: { code: 13, label: 'In Locker', phase: 'stored' },
  20: { code: 20, label: 'Picked Up (Normal)', phase: 'pickup' },
  21: { code: 21, label: 'Picked Up (Overtime)', phase: 'pickup' },
  22: { code: 22, label: 'Courier Picked Up', phase: 'pickup' },
  30: { code: 30, label: 'Expired - Returned', phase: 'expired' },
  31: { code: 31, label: 'Expired - Courier Retrieved', phase: 'expired' },
  32: { code: 32, label: 'Expired - Admin Retrieved', phase: 'expired' },
  99: { code: 99, label: 'Cancelled', phase: 'cancelled' },
};

export const COURIER_STATUSES = {
  1: { code: 1, label: 'Active', color: '#81C995' },
  0: { code: 0, label: 'Disabled', color: '#A8A29E' },
};

// ============ PACKAGE STATUSES ============
// Lifecycle: pending → at_warehouse/at_dropbox → assigned → accepted →
//            in_transit_to_locker → delivered_to_locker → picked_up
//            in_transit_to_home → delivered_to_home
//            recalled (courier returned package before delivery)
export const PACKAGE_STATUSES = {
  pending: { label: 'Pending', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  at_warehouse: { label: 'At Warehouse', color: '#B5A0D1', bg: 'rgba(181, 160, 209, 0.07)' },
  at_dropbox: { label: 'At Dropbox', color: '#B5A0D1', bg: 'rgba(181, 160, 209, 0.07)' },
  assigned: { label: 'Assigned', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  accepted: { label: 'Accepted', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  in_transit_to_locker: { label: 'Transit \u2192 Locker', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  in_transit_to_home: { label: 'Transit \u2192 Home', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  delivered_to_locker: { label: 'In Locker', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  delivered_to_home: { label: 'Delivered', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  picked_up: { label: 'Picked Up', color: '#A8A29E', bg: 'rgba(168, 162, 158, 0.07)' },
  recalled: { label: 'Recalled', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
  expired: { label: 'Expired', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
};

export const ALL_STATUSES = {
  ...PACKAGE_STATUSES,
  available: { label: 'Available', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  occupied: { label: 'Occupied', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  reserved: { label: 'Reserved', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  maintenance: { label: 'Maintenance', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
  active: { label: 'Active', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  inactive: { label: 'Inactive', color: '#A8A29E', bg: 'rgba(168, 162, 158, 0.07)' },
  offline: { label: 'Offline', color: '#A8A29E', bg: 'rgba(168, 162, 158, 0.07)' },
  online: { label: 'Online', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  on_delivery: { label: 'On Delivery', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  open: { label: 'Open', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
  in_progress: { label: 'In Progress', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  completed: { label: 'Completed', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  paid: { label: 'Paid', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  overdue: { label: 'Overdue', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
  full: { label: 'Full', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  individual: { label: 'Individual', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  b2b: { label: 'B2B Partner', color: '#B5A0D1', bg: 'rgba(181, 160, 209, 0.07)' },
  high: { label: 'High', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
  medium: { label: 'Medium', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  low: { label: 'Low', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  failed: { label: 'Failed', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
  refunded: { label: 'Refunded', color: '#A8A29E', bg: 'rgba(168, 162, 158, 0.07)' },
  suspended: { label: 'Suspended', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  connected: { label: 'Connected', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  disconnected: { label: 'Disconnected', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
  enabled: { label: 'Enabled', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  disabled: { label: 'Disabled', color: '#A8A29E', bg: 'rgba(168, 162, 158, 0.07)' },
  door_open: { label: 'Open', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  door_closed: { label: 'Closed', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
};
