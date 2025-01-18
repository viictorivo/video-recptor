import { Repository } from 'typeorm';
import { Order } from '../../Presentation/orders/order.entity';
import { OrdersDto } from '../../Presentation/orders/dto/order.dto';
import { OrderUpdateDto } from '../../Presentation/orders/dto/order-update.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { randomUUID } from 'crypto';

@CustomRepository(Order)
export class OrdersRepository extends Repository<Order>  {
    
    async deleteOrder(id: number): Promise<void> {
      try {
        const order = await this.getOrderById(id);
        await Order.remove(order);
      } catch (error){
        console.log(error)
        throw new InternalServerErrorException(
          'Erro ao deletar pedido no banco de dados',
        );
      }
    }

    async updateOrder(order: OrderUpdateDto): Promise<any> {
      const { id, salesOrderID, amount, orderTracking, payments } = order;
      console.log("orderUpdate", order)

      try {
        let orderUpdate = await this.getOrderById(id);

        console.log("order", order)

        orderUpdate.payments = payments
        orderUpdate.orderTracking = orderTracking

        const updateOrder = await Order.update(orderUpdate.salesOrderID, orderUpdate)
        return updateOrder
 
      } catch (error){
        console.log(error)
        throw new InternalServerErrorException(
          'Erro ao atualizar o  pedido no banco de dados',
        );
      }
    }


    async getOrderById(id: number): Promise<any> {

      try {
        const order = await Order.findOne({ where: { id : id } });
        return order
      } catch (error){
        console.log(error)
        throw new InternalServerErrorException(
          'Erro ao consultar pedido no banco de dados',
        );
      }

    }

    async createOrder(
        createUserDto: OrdersDto,
      ): Promise<any> {
        const { amount, customer, customerID, orderItens, orderTracking, payments } = createUserDto;
        const id = Math.floor(Math.random() * 10);

        let order = new Order();
        order.id = id;
        order.amount = amount;
        order.customer = customer;
        order.customerID = customerID;
        order.orderItens = orderItens;
        order.orderTracking = orderTracking;
        order.payments = payments;

        try {
          await order.save();
          return order;
        } catch (error) {
          throw new InternalServerErrorException(
              'Erro ao salvar o usuário no banco de dados',
            );
        }
      }
}