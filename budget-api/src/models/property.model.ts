import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseConstants } from './database-constants';
import { Transaction } from './transaction.model';

@Entity(DatabaseConstants.propertiesTable)
export class Property extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({
    type: String,
    nullable: true
  })
  value?: string | null;

  @Column()
  transaction_id!: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.properties, {
    orphanedRowAction: 'delete'
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction!: Transaction;
}