import { Prisma } from '../tenant-database-client-types';

export const userInfoData: Prisma.UserInfoCreateInput[] = [
  {
    userId: '550e8400-e29b-41d4-a716-546655440001',
    name: 'Chronosoft Admin',
    documentNumber: '1234567890',
    documentType: {
      connect: {
        code: 'CC',
      },
    },
  },
];
