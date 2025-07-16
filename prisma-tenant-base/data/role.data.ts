import { Prisma } from '../tenant-database-client-types';

export const roleData: Prisma.RoleCreateInput[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440500',
    name: 'ADMINISTRADOR',
    description: 'Rol de administrador con acceso completo al sistema',
  },
]; 