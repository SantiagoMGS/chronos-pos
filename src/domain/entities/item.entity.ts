export enum ItemType {
  PRODUCTO = 'PRODUCTO',
  SERVICIO = 'SERVICIO',
}

export type Item = {
  id: string;
  name: string;
  code: string;
  price: number;
  description: string | null;
  isActive: boolean;
  itemType: ItemType;
  measurementUnitId: string;
  createdAt?: Date;
  updatedAt?: Date;
};
