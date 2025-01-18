import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersRepository } from '../../Domain/Repositories/order.repository';
import { OrdersService } from '../../Application/services/orders.service';
import { OrdersController } from './orders.controller';
import { AwsSqsService } from '../../Application/services/sqs.service'
import { SqsConsumerService } from '../../Application/services/consumer.service'
@Module({
    imports: [TypeOrmModule.forFeature([OrdersRepository])],
    providers: [ 
                { provide: OrdersRepository, useClass: OrdersRepository }, 
                OrdersService, 
                AwsSqsService,
                SqsConsumerService,
            ],
    controllers: [OrdersController],
})

export class OrdersModule {}
