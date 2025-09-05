import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from '@domain/repositories/item/item.repository';
import { DOMAIN_MESSAGE } from '@shared/constants/domain-message';
import { Item } from '@domain/entities/item.entity';

@Injectable()
export class DeleteItemUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(id: string): Promise<Item | void> {
    const existingItem = await this.itemRepository.findById(id);
    if (!existingItem) {
      throw new NotFoundException(DOMAIN_MESSAGE.ITEM.NOT_FOUND);
    }

    return await this.itemRepository.softDelete(id);
  }
}
