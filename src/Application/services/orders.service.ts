import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersRepository } from '../../Domain/Repositories/order.repository';
import { OrdersDto } from '../../Presentation/orders/dto/order.dto';
import { OrderUpdateDto } from '../../Presentation/orders/dto/order-update.dto';

@Injectable()
export class OrdersService {
    constructor(
      @InjectRepository(OrdersRepository)
      private orderRepository: OrdersRepository,
    ) {}

    async createOrder(createOrderDto: OrdersDto): Promise<any> {
      return this.orderRepository.createOrder(createOrderDto);
    }

    async getById(id: number): Promise<OrdersDto> {
      return this.orderRepository.getOrderById(id);
    }
    
    async update(order: OrderUpdateDto): Promise<any> {
      return this.orderRepository.updateOrder(order);
    }
    
    async delete(id: number): Promise<any> {
      return this.orderRepository.deleteOrder(id);
    }
}
 