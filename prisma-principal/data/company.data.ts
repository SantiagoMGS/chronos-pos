import { Prisma } from '../principal-database-client-types';

export const companyData: Prisma.CompanyCreateInput[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Chronosoft',
    dbName: 'chronosoft',
    status: {
      connect: {
        name: 'ACTIVE',
      },
    },
    companyBranding: {
      create: {
        logo: 'https://www.chronosoft.com/wp-content/uploads/2023/01/Borealis-Logo-Black.png',
        primaryColor: '#9a6de7',
        secondaryColor: '#000000',
        tertiaryColor: '#148744',
      },
    },
  },
];
