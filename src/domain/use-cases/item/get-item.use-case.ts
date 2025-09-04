import { Injectable } from '@nestjs/common';
import { ItemRepository } from '@domain/repositories/item/item.repository';
import { Item } from '@domain/entities/item.entity';

@Injectable()
export class GetItemUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(id: string): Promise<Item | null> {
    return await this.itemRepository.findById(id);
  }
}
