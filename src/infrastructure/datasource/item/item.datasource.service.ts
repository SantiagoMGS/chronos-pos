import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '@core/services/tenant-prisma-client.service';
import { ItemRepository } from '@domain/repositories/item/item.repository';
import { Item, ItemType } from '@domain/entities/item.entity';
import { IPaginatedData, IPaginationOptions } from '@shared/types/pagination';
import { normalizePagination, toPaginatedData } from '@shared/utils/pagination';
import { Prisma } from '@prisma-tenant-base/tenant-database-client-types';

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
      include: { measurementUnit: { select: { id: true, name: true } } },
    });

    if (!item) {
      return null;
    }

    return {
      ...item,
      price: Number(item.price),
      itemType: item.itemType as ItemType,
      measurementUnit: item.measurementUnit,
    } as unknown as Item;
  }

  async findByCode(code: string): Promise<Item | null> {
    const item = await this.tenantPrisma.client.item.findUnique({
      where: { code },
      include: { measurementUnit: { select: { id: true, name: true } } },
    });

    if (!item) {
      return null;
    }

    return {
      ...item,
      price: Number((item as any).price),
      itemType: item.itemType as ItemType,
      measurementUnit: item.measurementUnit,
    } as unknown as Item;
  }

  async findPaginated(options: IPaginationOptions): Promise<IPaginatedData<Item>> {
    const { page, limit, skip } = normalizePagination(options.page, options.limit);

    const where: Prisma.ItemWhereInput = options.withDeleted ? {} : { isActive: true };

    const [items, total] = await this.tenantPrisma.client.$transaction([
      this.tenantPrisma.client.item.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: { measurementUnit: { select: { id: true, name: true } } },
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
