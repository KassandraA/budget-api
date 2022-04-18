import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ModelConstants } from './model-constants';
import { AccountStatus } from './account-status.model';
import { Transaction } from './transaction.model';

@Entity(ModelConstants.accountsTable)
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  currency?: string;

  @Column({ nullable: true })
  account_number?: string;

  @Column({ nullable: true })
  card_number?: string;

  @Column()
  status_id: number;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @ManyToOne(() => AccountStatus, (status) => status.accounts, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'status_id' })
  status: AccountStatus;
}
