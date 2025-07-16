import { Prisma } from '../principal-database-client-types';
import * as bcrypt from 'bcrypt';

export const userData: Prisma.UserCreateInput[] = [
  {
    id: '550e8400-e29b-41d4-a716-546655440001',
    email: 'admin@chronosoft.com',
    userCredentials: {
      create: {
        hashedPassword: bcrypt.hashSync('Chronosoft2025', 10),
      },
    },
    userCompanies: {
      create: {
        companyId: '550e8400-e29b-41d4-a716-446655440001',
      },
    },
  },
];
