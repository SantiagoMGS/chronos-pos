export enum ItemType {
  PRODUCTO = 'PRODUCTO',
  SERVICIO = 'SERVICIO',
}

export type Item = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  itemType: ItemType;
  createdAt?: Date;
  updatedAt?: Date;
};
