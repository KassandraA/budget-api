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
import { Source } from './source.model';
import { Tag } from './tag.model';

@Entity(ModelConstants.transactionsTable)
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ nullable: true })
  message?: string;

  @Column({ nullable: true })
  note_1?: string;

  @Column({ nullable: true })
  note_2?: string;

  @Column({ nullable: true })
  note_3?: string;

  @Column()
  amount: number;

  @Column()
  source_id: number;

  @ManyToOne((type) => Source, (source) => source.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'source_id' })
  source: Source;

  @ManyToMany(() => Tag, (tag) => tag.transactions)
  @JoinTable({
    name: 'transaction_tags',
    joinColumn: { name: 'transaction_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
