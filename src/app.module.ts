import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { TypeOrmExModule } from './database/typeorm-ex.module';
import { OrdersModule } from './Presentation/orders/order.module';
import { OrdersRepository } from './Domain/Repositories/order.repository';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), OrdersModule, TypeOrmExModule.forCustomRepository([OrdersRepository]),ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
