import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from '@domain/repositories/item/item.repository';
import { DOMAIN_MESSAGE } from '@shared/constants/domain-message';
import { Item, ItemType } from '@domain/entities/item.entity';

export interface UpdateItemDto {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
  itemType?: ItemType;
}

@Injectable()
export class UpdateItemUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const existingItem = await this.itemRepository.findById(id);
    if (!existingItem) {
      throw new NotFoundException(DOMAIN_MESSAGE.ITEM.NOT_FOUND);
    }

    if (updateItemDto.code && updateItemDto.code !== existingItem.code) {
      const itemWithSameCode = await this.itemRepository.findByCode(updateItemDto.code);
      if (itemWithSameCode) {
        throw new ConflictException(DOMAIN_MESSAGE.ITEM.CODE_CONFLICT);
      }
    }

    return await this.itemRepository.update(id, updateItemDto);
  }
}
