import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { DatabaseConstants } from './database-constants';
import { Account } from './account.model';
import { Tag } from './tag.model';
import { Property } from './property.model';

@Entity(DatabaseConstants.transactionsTable)
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;

  @Column({
    type: String,
    nullable: true
  })
  message?: string | null;

  @Column()
  transactor!: string;

  @Column()
  amount!: number;

  @Column()
  account_id!: number;

  @ManyToOne(() => Account, (account) => account.transactions, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'account_id' })
  account!: Account;

  @ManyToMany(() => Tag, (tag) => tag.transactions)
  @JoinTable({
    name: 'transaction_tags',
    joinColumn: { name: 'transaction_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags!: Tag[];

  @OneToMany(() => Property, (property) => property.transaction, {
    cascade: true
  })
  properties!: Property[];
}
