import { Prisma } from '../tenant-database-client-types';

export const actionData: Prisma.ActionCreateInput[] = [
  // Acciones para Facturación
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    name: 'CREAR_FACTURA',
    description: 'Crear nueva factura',
    resource: {
      connect: {
        name: 'Facturación',
      },
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440102',
    name: 'VER_FACTURAS',
    description: 'Ver facturas',
    resource: {
      connect: {
        name: 'Facturación',
      },
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440103',
    name: 'EDITAR_FACTURA',
    description: 'Editar factura',
    resource: {
      connect: {
        name: 'Facturación',
      },
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440104',
    name: 'ELIMINAR_FACTURA',
    description: 'Eliminar factura',
    resource: {
      connect: {
        name: 'Facturación',
      },
    },
  },

  // Acciones para Productos
  {
    id: '550e8400-e29b-41d4-a716-446655440105',
    name: 'CREAR_PRODUCTO',
    description: 'Crear nuevo producto',
    resource: {
      connect: {
        name: 'Productos',
      },
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440106',
    name: 'VER_PRODUCTOS',
    description: 'Ver productos',
    resource: {
      connect: {
        name: 'Productos',
      },
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440107',
    name: 'EDITAR_PRODUCTO',
    description: 'Editar producto',
    resource: {
      connect: {
        name: 'Productos',
      },
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440108',
    name: 'ELIMINAR_PRODUCTO',
    description: 'Eliminar producto',
    resource: {
      connect: {
        name: 'Productos',
      },
    },
  },

  // Acciones para Clientes
  {
    id: '550e8400-e29b-41d4-a716-446655440109',
    name: 'CREAR_CLIENTE',
    description: 'Crear nuevo cliente',
    resource: {
      connect: {
        name: 'Clientes',
      },
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440110',
    name: 'VER_CLIENTES',
    description: 'Ver clientes',
    resource: {
      connect: {
        name: 'Clientes',
      },
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440111',
    name: 'EDITAR_CLIENTE',
    description: 'Editar cliente',
    resource: {
      connect: {
        name: 'Clientes',
      },
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440112',
    name: 'ELIMINAR_CLIENTE',
    description: 'Eliminar cliente',
    resource: {
      connect: {
        name: 'Clientes',
      },
    },
  },
];
