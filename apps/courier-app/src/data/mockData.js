export const driver = {
  name: 'Kwame Asante', id: 'DRV-4821', avatar: '\u{1F468}\u{1F3FE}\u200D\u2708\uFE0F',
  rating: 4.92, deliveries: 1847, onTime: 98.2,
  todayEarn: 127.5, weekEarn: 892, monthEarn: 3460,
  joined: 'Mar 2023', vehicle: 'Toyota Hiace', plate: 'GR 4821-24',
};

export const lockersData = [
  { id: 'LOC-001', name: 'Accra Mall', addr: 'Tetteh Quarshie, Accra', dist: '2.3 km', eta: '8 min', avail: { S: 8, M: 5, L: 3, XL: 2 }, bat: 98, lat: 5.6220, lng: -0.1735, distKm: 2.3, hours: '6AM\u201310PM', status: 'online' },
  { id: 'LOC-002', name: 'Achimota Mall', addr: 'Mile 7, Achimota', dist: '6.1 km', eta: '18 min', avail: { S: 12, M: 8, L: 4, XL: 1 }, bat: 87, lat: 5.6150, lng: -0.2280, distKm: 6.1, hours: '7AM\u20139PM', status: 'online' },
  { id: 'LOC-003', name: 'West Hills Mall', addr: 'Weija Junction, Accra', dist: '14.2 km', eta: '35 min', avail: { S: 6, M: 4, L: 2, XL: 3 }, bat: 72, lat: 5.5770, lng: -0.3030, distKm: 14.2, hours: '8AM\u20138PM', status: 'online' },
];

export const availableBlocks = [
  { id: 'BLK-001', time: '6:00 AM \u2013 10:00 AM', type: '4 hr', area: 'Accra Central', pay: 'GH\u20B5 85', stops: 8, dist: '22 km', surge: false },
  { id: 'BLK-002', time: '10:30 AM \u2013 2:30 PM', type: '4 hr', area: 'Achimota / Legon', pay: 'GH\u20B5 92', stops: 10, dist: '28 km', surge: false },
  { id: 'BLK-003', time: '11:00 AM \u2013 3:00 PM', type: '4 hr', area: 'East Legon / Airport', pay: 'GH\u20B5 105', stops: 12, dist: '35 km', surge: true },
  { id: 'BLK-004', time: '3:00 PM \u2013 7:00 PM', type: '4 hr', area: 'Tema / Spintex', pay: 'GH\u20B5 78', stops: 7, dist: '19 km', surge: false },
  { id: 'BLK-005', time: '5:00 PM \u2013 9:00 PM', type: '4 hr', area: 'Accra Mall Area', pay: 'GH\u20B5 110', stops: 14, dist: '18 km', surge: true },
];

export const notifsData = [
  { id: 1, type: 'urgent', title: 'Urgent Package', body: 'LQ-8847292 requires priority delivery.', time: '2m ago', read: false },
  { id: 2, type: 'info', title: 'Route Optimized', body: 'Saved 12 minutes on your route.', time: '15m ago', read: false },
  { id: 3, type: 'success', title: 'Weekly Bonus!', body: 'GH\u20B5 25 bonus for 50+ deliveries.', time: '1h ago', read: true },
];

export const tasksData = [
  { id: 'TSK-001', trk: 'LQ-8847301', sz: 'M', tab: 'assigned', locker: 'Accra Mall', addr: 'Tetteh Quarshie, Accra', weight: '1.5 kg', pri: 'urgent', eta: '10:30 AM', sender: 'Kofi Mensah', receiver: 'Ama Serwaa', phone: '+233 24 111 2222' },
  { id: 'TSK-002', trk: 'LQ-8847302', sz: 'S', tab: 'assigned', locker: 'Accra Mall', addr: 'Tetteh Quarshie, Accra', weight: '0.3 kg', pri: 'sameDay', eta: '10:30 AM', sender: 'Yaw Boateng', receiver: 'Efua Adjei', phone: '+233 20 333 4444' },
  { id: 'TSK-003', trk: 'LQ-8847303', sz: 'L', tab: 'assigned', locker: 'Accra Mall', addr: 'Tetteh Quarshie, Accra', weight: '4.2 kg', pri: 'normal', eta: '10:30 AM', sender: 'Kwesi Appiah', receiver: 'Akua Donkor', phone: '+233 55 666 7777', ageRestricted: true },
  { id: 'TSK-004', trk: 'LQ-8847304', sz: 'M', tab: 'assigned', locker: 'Achimota Mall', addr: 'Mile 7, Achimota', weight: '2.0 kg', pri: 'urgent', eta: '11:15 AM', sender: 'Nana Osei', receiver: 'Abena Pokua', phone: '+233 24 555 8888', highValue: true },
  { id: 'TSK-005', trk: 'LQ-8847305', sz: 'S', tab: 'assigned', locker: 'Achimota Mall', addr: 'Mile 7, Achimota', weight: '0.7 kg', pri: 'timeSensitive', priDeadline: '11:45 AM', eta: '11:15 AM', sender: 'Joe Addo', receiver: 'Sika Mensah', phone: '+233 20 999 0000' },
  { id: 'TSK-006', trk: 'LQ-8847306', sz: 'XL', tab: 'assigned', locker: 'West Hills Mall', addr: 'Weija Junction, Accra', weight: '7.2 kg', pri: 'normal', eta: '12:00 PM', sender: 'Kwame Nkrumah', receiver: 'Esi Asante', phone: '+233 50 111 3333' },
  { id: 'TSK-007', trk: 'LQ-8847307', sz: 'M', tab: 'accepted', locker: 'Accra Mall', addr: 'Tetteh Quarshie, Accra', weight: '1.9 kg', pri: 'normal', eta: '10:30 AM', sender: 'Fiifi Coleman', receiver: 'Adjoa Baah', phone: '+233 24 222 5555', acceptedAt: '10:12 AM' },
  { id: 'TSK-008', trk: 'LQ-8847308', sz: 'S', tab: 'inTransit', locker: 'West Hills Mall', addr: 'Weija Junction, Accra', weight: '0.5 kg', pri: 'urgent', eta: '12:00 PM', sender: 'Prince Tagoe', receiver: 'Dede Ayew', phone: '+233 55 444 6666', acceptedAt: '10:05 AM', inTransitAt: '10:20 AM' },
  { id: 'TSK-009', trk: 'LQ-8847309', sz: 'L', tab: 'deposited', locker: 'Accra Mall', addr: 'Tetteh Quarshie, Accra', weight: '3.5 kg', pri: 'normal', eta: '9:00 AM', sender: 'Obed Asamoah', receiver: 'Mansa Keita', phone: '+233 20 777 8888', acceptedAt: '9:15 AM', inTransitAt: '9:25 AM', depositedAt: '9:42 AM' },
  { id: 'TSK-010', trk: 'LQ-8847310', sz: 'S', tab: 'deposited', locker: 'Achimota Mall', addr: 'Mile 7, Achimota', weight: '0.4 kg', pri: 'normal', eta: '9:30 AM', sender: 'Gifty Lamptey', receiver: 'Kofi Annan', phone: '+233 24 000 1111', acceptedAt: '9:35 AM', inTransitAt: '9:45 AM', depositedAt: '10:05 AM' },
  { id: 'TSK-011', trk: 'LQ-8847311', sz: 'M', tab: 'recall', locker: 'Accra Mall', addr: 'Tetteh Quarshie, Accra', weight: '1.5 kg', pri: 'urgent', eta: '10:30 AM', sender: 'Ama Mensah', receiver: 'Yaw Asante', phone: '+233 24 333 5555', reason: 'Customer requested cancellation', recallType: 'customerCancel', recallStatus: 'pendingPickup' },
  { id: 'TSK-012', trk: 'LQ-8847312', sz: 'S', tab: 'recall', locker: 'West Hills Mall', addr: 'Weija Junction, Accra', weight: '0.3 kg', pri: 'normal', eta: '12:00 PM', sender: 'Kweku Baah', receiver: 'Efua Nyarko', phone: '+233 55 888 9999', reason: 'Wrong delivery address', recallType: 'wrongAddress', recallStatus: 'pendingPickup' },
];
