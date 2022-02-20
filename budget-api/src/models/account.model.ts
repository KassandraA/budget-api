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
  note_1?: string; // todo account number

  @Column({ nullable: true })
  note_2?: string; // todo card no

  @Column()
  status_id: number;

  @OneToMany((type) => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @ManyToOne((type) => AccountStatus, (status) => status.accounts, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'status_id' })
  status: AccountStatus;
}
