import { Prisma } from '../tenant-database-client-types';

export const userRoleData: Prisma.UserRoleCreateInput[] = [
  {
    userId: '550e8400-e29b-41d4-a716-546655440001',
    role: {
      connect: {
        id: '550e8400-e29b-41d4-a716-446655440500',
      },
    },
  },
];
