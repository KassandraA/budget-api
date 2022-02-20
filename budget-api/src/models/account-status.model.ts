import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ModelConstants } from './model-constants';
import { Account } from './account.model';

@Entity(ModelConstants.accountStatusesTable)
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
