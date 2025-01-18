import {
    IsDate,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class OrderUpdateDto {
    @IsOptional()
    @IsNumber()
    id: number;
  
    @IsOptional()
    @IsString()
    salesOrderID: string;
    
    @IsOptional()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    orderTracking: string;

    @IsOptional()
    @IsString()
    payments: string;
  }