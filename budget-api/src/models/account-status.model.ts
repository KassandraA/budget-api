import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseConstants } from './database-constants';
import { Account } from './account.model';

@Entity(DatabaseConstants.accountStatusesTable)
export class AccountStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Account, (account) => account.status)
  accounts: Account[];
}
