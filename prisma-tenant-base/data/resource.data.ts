import { Prisma } from '../tenant-database-client-types';

export const resourceData: Prisma.ResourceCreateInput[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440021',
    name: 'Facturación',
    icon: 'fa-cart-shopping',
    path: '/sales',
    application: {
      connect: {
        name: 'POS',
      },
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440022',
    name: 'Productos',
    icon: 'fa-box',
    path: '/products',
    application: {
      connect: {
        name: 'ADMINISTRACIÓN',
      },
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440023',
    name: 'Clientes',
    icon: 'fa-user',
    path: '/clients',
    application: {
      connect: {
        name: 'ADMINISTRACIÓN',
      },
    },
  },
];

export const childrenResource: Prisma.ResourceCreateInput[] = [];
