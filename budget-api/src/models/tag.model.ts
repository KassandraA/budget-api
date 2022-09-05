import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseConstants } from './database-constants';
import { Transaction } from './transaction.model';

@Entity(DatabaseConstants.tagsTable)
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Transaction, (transaction) => transaction.tags)
  transactions: Transaction[];
}
