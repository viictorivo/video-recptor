import {
    BaseEntity,
    Entity,
    Unique,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  @Unique(['salesOrderID'])
  export class Order extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    salesOrderID: string;
  
    @Column({ nullable: false, type: 'varchar', length: 200 })
    id: number;
  
    @Column({ nullable: false })
    amount: number;
  
    @Column({ nullable: false, type: 'varchar', length: 20 })
    customer: string;
  
    @Column({ nullable: false })
    customerID: number;
  
    @Column({type: 'jsonb', nullable: false})
    orderItens?: object[];
  
    @Column({ nullable: false, type: 'varchar', length: 20 })
    orderTracking: string;
  
    @Column({ nullable: false, type: 'varchar', length: 20 })
    payments: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }