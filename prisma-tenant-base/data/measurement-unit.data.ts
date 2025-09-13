import { Prisma } from '../tenant-database-client-types';

export const measurementUnitData: Prisma.MeasurementUnitCreateInput[] = [
  { id: '2f1a7b3c-9d4e-4a6b-8c21-1f2e3d4c5b6a', code: '94', name: 'unidad' },
  { id: '6c5b4a3d-2e1f-4c9d-9a87-0b1c2d3e4f50', code: 'KGM', name: 'kilogramo' },
  { id: 'a1b2c3d4-e5f6-4a7b-8c9d-1a2b3c4d5e6f', code: 'LBR', name: 'libra' },
  { id: 'b0c1d2e3-f4a5-4b6c-abcd-1234567890ab', code: 'MLT', name: 'mililitro' },
  { id: 'cdef1234-5678-4abc-8def-0123456789ab', code: 'MTR', name: 'metro' },
  { id: 'd1e2f3a4-b5c6-4d7e-b8c9-0a1b2c3d4e5f', code: 'GLL', name: 'galón' },
];
