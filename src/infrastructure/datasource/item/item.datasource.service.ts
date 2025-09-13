import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '@core/services/tenant-prisma-client.service';
import { ItemRepository } from '@domain/repositories/item/item.repository';
import { Item, ItemType } from '@domain/entities/item.entity';
import { IPaginatedData, IPaginationOptions } from '@shared/types/pagination';
import { normalizePagination, toPaginatedData } from '@shared/utils/pagination';

@Injectable()
export class ItemDataSourceService implements ItemRepository {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async create(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
    const createdItem = await this.tenantPrisma.client.item.create({
      data: {
        name: item.name,
        code: item.code,
        price: item.price,
        description: item.description,
        isActive: item.isActive,
        itemType: item.itemType,
        measurementUnitId: item.measurementUnitId,
      },
    });

    return {
      ...createdItem,
      price: Number(createdItem.price),
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
      price: Number(item.price),
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
      price: Number((item as any).price),
      itemType: item.itemType as ItemType,
    };
  }

  async findAll(): Promise<Item[]> {
    const items = await this.tenantPrisma.client.item.findMany({
      orderBy: { name: 'asc' },
    });

    return items.map((item) => ({
      ...item,
      price: Number(item.price),
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
      price: Number(item.price),
      itemType: item.itemType as ItemType,
    }));
  }

  async findPaginated(options: IPaginationOptions): Promise<IPaginatedData<Item>> {
    const { page, limit, skip } = normalizePagination(options.page, options.limit);

    const where: Record<string, unknown> = {};
    if (!options.withDeleted) {
      where.isActive = true;
    }

    const [items, total] = await this.tenantPrisma.client.$transaction([
      this.tenantPrisma.client.item.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.tenantPrisma.client.item.count({ where }),
    ]);

    const mappedItems: Item[] = items.map((item) => ({
      ...item,
      price: Number(item.price),
      itemType: item.itemType as ItemType,
    }));

    return toPaginatedData(mappedItems, page, limit, total);
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
      price: Number(updatedItem.price),
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
      price: Number(updatedItem.price),
      itemType: updatedItem.itemType as ItemType,
    };
  }
}
