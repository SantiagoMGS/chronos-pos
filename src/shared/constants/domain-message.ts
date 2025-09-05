export const DOMAIN_MESSAGE = {
  ITEM: {
    NOT_FOUND: 'Item no encontrado',
    CODE_CONFLICT: 'Ya existe un item con este código',
    DELETED_OK: 'Item eliminado correctamente',
    UPDATED_OK: 'Item actualizado correctamente',
    CREATED_OK: 'Item creado correctamente',
  },
  CUSTOMER: {
    NOT_FOUND: 'Cliente no encontrado',
    DOC_CONFLICT: 'Ya existe un cliente con este tipo y número de documento',
    DELETED_OK: 'Cliente eliminado correctamente',
    UPDATED_OK: 'Cliente actualizado correctamente',
    CREATED_OK: 'Cliente creado correctamente',
  },
} as const;
