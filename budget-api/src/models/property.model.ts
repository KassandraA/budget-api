import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ModelConstants } from './model-constants';
import { Transaction } from './transaction.model';

@Entity(ModelConstants.propertiesTable)
export class Property extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  value?: string

  @Column()
  transaction_id: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.properties, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'transaction_id'})
  transaction: Transaction;
}