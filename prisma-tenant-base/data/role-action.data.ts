import { Prisma } from '../tenant-database-client-types';

export const roleActionData: Prisma.RoleActionCreateInput[] = [
  {
    role: { connect: { name: 'ADMINISTRADOR' } },
    action: { connect: { name: 'CREAR_FACTURA' } },
  },
  {
    role: { connect: { name: 'ADMINISTRADOR' } },
    action: { connect: { name: 'VER_FACTURAS' } },
  },
  {
    role: { connect: { name: 'ADMINISTRADOR' } },
    action: { connect: { name: 'EDITAR_FACTURA' } },
  },
  {
    role: { connect: { name: 'ADMINISTRADOR' } },
    action: { connect: { name: 'ELIMINAR_FACTURA' } },
  },
  {
    role: { connect: { name: 'ADMINISTRADOR' } },
    action: { connect: { name: 'CREAR_PRODUCTO' } },
  },
  {
    role: { connect: { name: 'ADMINISTRADOR' } },
    action: { connect: { name: 'VER_PRODUCTOS' } },
  },
  {
    role: { connect: { name: 'ADMINISTRADOR' } },
    action: { connect: { name: 'EDITAR_PRODUCTO' } },
  },
  {
    role: { connect: { name: 'ADMINISTRADOR' } },
    action: { connect: { name: 'ELIMINAR_PRODUCTO' } },
  },
  {
    role: { connect: { name: 'ADMINISTRADOR' } },
    action: { connect: { name: 'CREAR_CLIENTE' } },
  },
  {
    role: { connect: { name: 'ADMINISTRADOR' } },
    action: { connect: { name: 'VER_CLIENTES' } },
  },
  {
    role: { connect: { name: 'ADMINISTRADOR' } },
    action: { connect: { name: 'EDITAR_CLIENTE' } },
  },
  {
    role: { connect: { name: 'ADMINISTRADOR' } },
    action: { connect: { name: 'ELIMINAR_CLIENTE' } },
  },
];
