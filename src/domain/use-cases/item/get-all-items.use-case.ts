import { Injectable } from '@nestjs/common';
import { ItemRepository } from '@domain/repositories/item/item.repository';
import { Item } from '@domain/entities/item.entity';

@Injectable()
export class GetAllItemsUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(activeOnly: boolean = false): Promise<Item[]> {
    if (activeOnly) {
      return await this.itemRepository.findActive();
    }
    return await this.itemRepository.findAll();
  }
}
