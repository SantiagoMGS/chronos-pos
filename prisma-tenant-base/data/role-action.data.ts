import { Prisma } from '../tenant-database-client-types';

export const roleActionData: Prisma.RoleActionCreateInput[] = [
  // Asignar todas las acciones al rol de administrador
  {
    role: { connect: { id: '550e8400-e29b-41d4-a716-446655440500' } },
    action: { connect: { id: '550e8400-e29b-41d4-a716-446655440101' } },
  },
  {
    role: { connect: { id: '550e8400-e29b-41d4-a716-446655440500' } },
    action: { connect: { id: '550e8400-e29b-41d4-a716-446655440102' } },
  },
  {
    role: { connect: { id: '550e8400-e29b-41d4-a716-446655440500' } },
    action: { connect: { id: '550e8400-e29b-41d4-a716-446655440103' } },
  },
  {
    role: { connect: { id: '550e8400-e29b-41d4-a716-446655440500' } },
    action: { connect: { id: '550e8400-e29b-41d4-a716-446655440104' } },
  },
  {
    role: { connect: { id: '550e8400-e29b-41d4-a716-446655440500' } },
    action: { connect: { id: '550e8400-e29b-41d4-a716-446655440105' } },
  },
  {
    role: { connect: { id: '550e8400-e29b-41d4-a716-446655440500' } },
    action: { connect: { id: '550e8400-e29b-41d4-a716-446655440106' } },
  },
  {
    role: { connect: { id: '550e8400-e29b-41d4-a716-446655440500' } },
    action: { connect: { id: '550e8400-e29b-41d4-a716-446655440107' } },
  },
  {
    role: { connect: { id: '550e8400-e29b-41d4-a716-446655440500' } },
    action: { connect: { id: '550e8400-e29b-41d4-a716-446655440108' } },
  },
  {
    role: { connect: { id: '550e8400-e29b-41d4-a716-446655440500' } },
    action: { connect: { id: '550e8400-e29b-41d4-a716-446655440109' } },
  },
  {
    role: { connect: { id: '550e8400-e29b-41d4-a716-446655440500' } },
    action: { connect: { id: '550e8400-e29b-41d4-a716-446655440110' } },
  },
  {
    role: { connect: { id: '550e8400-e29b-41d4-a716-446655440500' } },
    action: { connect: { id: '550e8400-e29b-41d4-a716-446655440111' } },
  },
  {
    role: { connect: { id: '550e8400-e29b-41d4-a716-446655440500' } },
    action: { connect: { id: '550e8400-e29b-41d4-a716-446655440112' } },
  },
];
