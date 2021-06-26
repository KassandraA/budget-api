import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ModelConstants } from './model-constants';
import { Transaction } from './transaction.model';

@Entity(ModelConstants.tagsTable)
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Transaction, (transaction) => transaction.tags)
  transactions: Transaction[];
}
