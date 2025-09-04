import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '@core/services/tenant-prisma-client.service';
import { ItemRepository } from '@domain/repositories/item/item.repository';
import { Item, ItemType } from '@domain/entities/item.entity';

@Injectable()
export class ItemDataSourceService implements ItemRepository {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async create(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
    const createdItem = await this.tenantPrisma.client.item.create({
      data: {
        name: item.name,
        code: item.code,
        description: item.description,
        isActive: item.isActive,
        itemType: item.itemType,
      },
    });

    return {
      ...createdItem,
      itemType: createdItem.itemType as ItemType,
    };
  }

  async findById(id: string): Promise<Item | null> {
    const item = await this.tenantPrisma.client.item.findUnique({
      where: { id },
    });

    if (!item) {
      return null;
    }

    return {
      ...item,
      itemType: item.itemType as ItemType,
    };
  }

  async findByCode(code: string): Promise<Item | null> {
    const item = await this.tenantPrisma.client.item.findUnique({
      where: { code },
    });

    if (!item) {
      return null;
    }

    return {
      ...item,
      itemType: item.itemType as ItemType,
    };
  }

  async findAll(): Promise<Item[]> {
    const items = await this.tenantPrisma.client.item.findMany({
      orderBy: { name: 'asc' },
    });

    return items.map((item) => ({
      ...item,
      itemType: item.itemType as ItemType,
    }));
  }

  async findActive(): Promise<Item[]> {
    const items = await this.tenantPrisma.client.item.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return items.map((item) => ({
      ...item,
      itemType: item.itemType as ItemType,
    }));
  }

  async update(id: string, item: Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Item> {
    const updatedItem = await this.tenantPrisma.client.item.update({
      where: { id },
      data: {
        ...item,
      },
    });

    return {
      ...updatedItem,
      itemType: updatedItem.itemType as ItemType,
    };
  }

  async delete(id: string): Promise<void> {
    await this.tenantPrisma.client.item.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<Item> {
    const updatedItem = await this.tenantPrisma.client.item.update({
      where: { id },
      data: { isActive: false },
    });

    return {
      ...updatedItem,
      itemType: updatedItem.itemType as ItemType,
    };
  }
}
