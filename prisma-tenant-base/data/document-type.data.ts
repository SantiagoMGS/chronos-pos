import { Prisma } from '../tenant-database-client-types';

export const documentTypeData: Prisma.DocumentTypeCreateInput[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440601',
    name: 'Cédula de Ciudadanía',
    code: 'CC',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440602',
    name: 'Tarjeta de Identidad',
    code: 'TI',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440603',
    name: 'Cédula de Extranjería',
    code: 'CE',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440604',
    name: 'Número de Identificación Tributaria',
    code: 'NIT',
  },
]; 