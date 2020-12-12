import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.model';

@Entity('tags')
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Transaction, (transaction) => transaction.tags)
  transactions: Transaction[];
}
