import { Injectable } from '@nestjs/common';
import { ItemRepository } from '@domain/repositories/item/item.repository';
import { Item } from '@domain/entities/item.entity';
import { IPaginatedData, IPaginationOptions } from '@shared/types/pagination';

@Injectable()
export class GetAllItemsUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(options: IPaginationOptions): Promise<IPaginatedData<Item>> {
    return await this.itemRepository.findPaginated(options);
  }
}
