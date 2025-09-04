import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@presentation/controllers/auth/auth.module';
import { ItemModule } from '@presentation/controllers/item/item.module';

@Module({
  imports: [AuthModule, ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
