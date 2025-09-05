import { ConflictException, Injectable } from '@nestjs/common';
import { ItemRepository } from '@domain/repositories/item/item.repository';
import { Item, ItemType } from '@domain/entities/item.entity';

export interface CreateItemDto {
  name: string;
  code: string;
  description?: string;
  itemType: ItemType;
}

@Injectable()
export class CreateItemUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(createItemDto: CreateItemDto): Promise<Item> {
    // Verificar si ya existe un item con el mismo código
    const existingItem = await this.itemRepository.findByCode(createItemDto.code);
    if (existingItem) {
      throw new ConflictException('Ya existe un item con este código');
    }

    const itemData = {
      name: createItemDto.name,
      code: createItemDto.code,
      description: createItemDto.description || null,
      isActive: true,
      itemType: createItemDto.itemType,
    };

    return await this.itemRepository.create(itemData);
  }
}
