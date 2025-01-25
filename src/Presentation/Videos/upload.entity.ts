import { Entity, BaseEntity, Unique, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['videoID'])
export class Video extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  videoID: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  fileBase64: string;

  @Column()
  zipURL: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



