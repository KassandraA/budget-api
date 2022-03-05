import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModelConstants } from './model-constants';
import { Account } from './account.model';
import { Tag } from './tag.model';

@Entity(ModelConstants.transactionsTable)
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ nullable: true })
  message?: string;

  @Column()
  amount: number;

  @Column()
  account_id: number;

  @ManyToOne(() => Account, (account) => account.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToMany(() => Tag, (tag) => tag.transactions)
  @JoinTable({
    name: 'transaction_tags',
    joinColumn: { name: 'transaction_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
