import { Prisma } from '../principal-database-client-types';

export const statusData: Prisma.StatusCreateInput[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'ACTIVE',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'INACTIVE',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'SUSPENDED',
  },
];
