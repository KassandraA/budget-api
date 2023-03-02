import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseConstants } from './database-constants';
import { AccountStatus } from './account-status.model';
import { Transaction } from './transaction.model';

@Entity(DatabaseConstants.accountsTable)
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({
    type: String,
    nullable: true
  })
  description?: string | null;

  @Column({
    type: String,
    nullable: true
  })
  currency?: string | null;

  @Column({
    type: String,
    nullable: true
  })
  account_number?: string | null;

  @Column({
    type: String,
    nullable: true
  })
  card_number?: string | null;

  @Column()
  status_id!: number;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions!: Transaction[];

  @ManyToOne(() => AccountStatus, (status) => status.accounts, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'status_id' })
  status!: AccountStatus;
}
