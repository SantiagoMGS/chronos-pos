import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from '@domain/repositories/item/item.repository';
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
      throw new NotFoundException('Item no encontrado');
    }

    if (updateItemDto.code && updateItemDto.code !== existingItem.code) {
      const itemWithSameCode = await this.itemRepository.findByCode(updateItemDto.code);
      if (itemWithSameCode) {
        throw new ConflictException('Ya existe un item con este código');
      }
    }

    return await this.itemRepository.update(id, updateItemDto);
  }
}
