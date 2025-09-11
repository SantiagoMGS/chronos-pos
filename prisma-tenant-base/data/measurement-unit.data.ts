import { Prisma } from '../tenant-database-client-types';

export const measurementUnitData: Prisma.MeasurementUnitCreateInput[] = [
  { id: '00000000-0000-0000-0000-000000000070', code: '94', name: 'unidad' },
  { id: '00000000-0000-0000-0000-000000000414', code: 'KGM', name: 'kilogramo' },
  { id: '00000000-0000-0000-0000-000000000449', code: 'LBR', name: 'libra' },
  { id: '00000000-0000-0000-0000-000000000499', code: 'MLT', name: 'mililitro' },
  { id: '00000000-0000-0000-0000-000000000512', code: 'MTR', name: 'metro' },
  { id: '00000000-0000-0000-0000-000000000874', code: 'GLL', name: 'galón' },
];
