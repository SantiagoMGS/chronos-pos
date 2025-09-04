import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { CreateItemUseCase } from '@domain/use-cases/item/create-item.use-case';
import { GetItemUseCase } from '@domain/use-cases/item/get-item.use-case';
import { GetAllItemsUseCase } from '@domain/use-cases/item/get-all-items.use-case';
import { UpdateItemUseCase } from '@domain/use-cases/item/update-item.use-case';
import { DeleteItemUseCase } from '@domain/use-cases/item/delete-item.use-case';
import { ItemDataSourceService } from '@infrastructure/datasource/item/item.datasource.service';
import { ItemRepository } from '@domain/repositories/item/item.repository';
import { TenantPrismaService } from '@core/services/tenant-prisma-client.service';

@Module({
  controllers: [ItemController],
  providers: [
    // Core Services
    TenantPrismaService,
    // Use Cases
    CreateItemUseCase,
    GetItemUseCase,
    GetAllItemsUseCase,
    UpdateItemUseCase,
    DeleteItemUseCase,
    // Repository Implementation
    {
      provide: ItemRepository,
      useClass: ItemDataSourceService,
    },
  ],
  exports: [
    CreateItemUseCase,
    GetItemUseCase,
    GetAllItemsUseCase,
    UpdateItemUseCase,
    DeleteItemUseCase,
    ItemRepository,
  ],
})
export class ItemModule {}
