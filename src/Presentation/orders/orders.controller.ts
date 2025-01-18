import { Controller, Post, Body, NotFoundException, Get, Delete, Patch, Param} from '@nestjs/common';
import { OrdersDto } from './dto/order.dto';
import { OrderUpdateDto } from './dto/order-update.dto';
import { OrdersService } from '../../Application/services/orders.service';
import { AwsSqsService } from '../../Application/services/sqs.service';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Pedidos')
@Controller('orders')
export class OrdersController {

    private readonly AWS_SQS_QUEUE_URL_PAYMENT_INBOUND = this.configService.get<string>('AWS_SQS_QUEUE_URL_PAYMENT_INBOUND');

    constructor(private ordersService: OrdersService,
                 private awsSqsService: AwsSqsService,
                 private readonly configService: ConfigService) {}

    @Post()
    async create(@Body() orderDto: OrdersDto){

        const queueUrl = this.AWS_SQS_QUEUE_URL_PAYMENT_INBOUND

        try{
            const order = await this.ordersService.createOrder(orderDto);

            const body = {
                salesOrderID: order.salesOrderID,
                customerID: order.customerID,
                orderID: order.id,
                amount: order.amount,
                items: order.orderItens
              };

            await this.awsSqsService.sendMessage(queueUrl, body)

            return order;
        
        } catch (err) {
            throw new NotFoundException(err?.message ?? 'Order could not be created');
        }
      }

    @Get(':id')
    async getByID(@Param('id') id: number) {
        try {
        const order = await this.ordersService.getById(Number(id));
        return order;
        } catch (err) {
        throw new NotFoundException(err?.message ?? 'Order could not be list');
        }
    }

    @Patch()
    async update(@Body() dto: OrderUpdateDto) {
        try {
        const order = await this.ordersService.update(dto);
        return order;
        } catch (err) {
        throw new NotFoundException(err?.message ?? 'Order could not be updated');
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        try {
        const products = await this.ordersService.delete(Number(id));
        return products;
        } catch (err) {
        throw new NotFoundException(err?.message ?? 'Order could not be deleted');
        }
    }
}
