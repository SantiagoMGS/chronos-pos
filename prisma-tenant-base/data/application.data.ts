import { Prisma } from '../tenant-database-client-types';

export const applicationData: Prisma.ApplicationCreateInput[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    name: 'POS',
    icon: 'Logo-Black.png',
    description:
      'POS es un sistema de gestión de ventas que permite a los comercios gestionar sus ventas de manera eficiente.',
    path: 'pos',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    name: 'ADMINISTRACIÓN',
    icon: 'Logo-Black.png',
    description:
      'Sistema de administración general para la gestión de clientes, usuarios y configuraciones del sistema.',
    path: 'admin',
  },
];
