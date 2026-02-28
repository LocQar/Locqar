export const ROLES = {
  SUPER_ADMIN: {
    id: 'super_admin',
    name: 'Super Admin',
    level: 100,
    color: '#7EA8C9',
    permissions: ['*']
  },
  ADMIN: {
    id: 'admin',
    name: 'Administrator',
    level: 80,
    color: '#D4AA5A',
    permissions: ['dashboard.*', 'packages.*', 'lockers.*', 'dropbox.*', 'terminals.*', 'customers.*', 'staff.*', 'reports.*', 'dispatch.*', 'accounting.*']
  },
  MANAGER: {
    id: 'manager',
    name: 'Branch Manager',
    level: 60,
    color: '#81C995',
    permissions: ['dashboard.view', 'packages.*', 'dropbox.*', 'lockers.*', 'terminals.view', 'customers.*', 'staff.view', 'reports.view', 'dispatch.*']
  },
  AGENT: {
    id: 'agent',
    name: 'Field Agent',
    level: 40,
    color: '#B5A0D1',
    permissions: ['dashboard.view', 'packages.view', 'packages.scan', 'packages.receive', 'dropbox.view', 'dropbox.collect', 'lockers.view', 'lockers.open', 'dispatch.view']
  },
  SUPPORT: {
    id: 'support',
    name: 'Support',
    level: 30,
    color: '#D48E8A',
    permissions: ['dashboard.view', 'packages.view', 'packages.track', 'customers.*', 'tickets.*']
  },
  VIEWER: {
    id: 'viewer',
    name: 'View Only',
    level: 10,
    color: '#A8A29E',
    permissions: ['dashboard.view', 'packages.view', 'lockers.view']
  },
};

export const resolveRole = (userRole, customRoles = []) => {
  if (ROLES[userRole]) return ROLES[userRole];
  return customRoles.find(r => r.key === userRole) || null;
};

export const hasPermission = (userRole, permission, customRoles = []) => {
  const role = resolveRole(userRole, customRoles);
  if (!role) return false;
  if (role.permissions.includes('*')) return true;
  if (role.permissions.includes(permission)) return true;
  const [module] = permission.split('.');
  return role.permissions.includes(`${module}.*`);
};
