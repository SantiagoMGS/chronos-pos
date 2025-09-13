import { Item } from '@domain/entities/item.entity';
import { IPaginatedData, IPaginationOptions } from '@shared/types/pagination';

export abstract class ItemRepository {
  abstract create(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item>;
  abstract findById(id: string): Promise<Item | null>;
  abstract findByCode(code: string): Promise<Item | null>;
  abstract findPaginated(options: IPaginationOptions): Promise<IPaginatedData<Item>>;
  abstract update(id: string, item: Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Item>;
  abstract softDelete(id: string): Promise<Item>;
}
