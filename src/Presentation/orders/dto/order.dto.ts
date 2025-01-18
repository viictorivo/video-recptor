import {
    IsDate,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
import {Type} from 'class-transformer';
  
  export class OrdersDto {
    @IsOptional()
    @IsNumber()
    id: number;
  
    @IsOptional()
    @IsDate()
    createdAt: Date;
  
    @IsOptional()
    @IsDate()
    updatedAt: Date;
  
    @IsOptional()
    @IsString()
    salesOrderID: string;
    
    @IsOptional()
    @IsNumber()
    amount: number;

    @IsOptional()
    @Type(() => Object)
    orderItens: Array<{
      title: string,
      quantity: number,
      unit_price: number,
      sku_number: string,
      category: string,
      unit_measure: string,
      total_amount: number
    }>;
    
    @IsOptional()
    @IsNumber()
    customerID: number;

    @IsOptional()
    @IsString()
    customer: string;

    @IsOptional()
    @IsString()
    orderTracking: string;

    @IsOptional()
    @IsString()
    payments: string;
  }
  