import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@presentation/controllers/auth/auth.module';
import { ItemModule } from '@presentation/controllers/item/item.module';
import { CommonModule } from '@presentation/controllers/common/common.module';

@Module({
  imports: [AuthModule, ItemModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
