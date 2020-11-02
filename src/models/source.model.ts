import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SourceStatus } from './source-status.model';
import { Transaction } from './transaction.model';

@Entity('sources')
export class Source extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string | null;

  @Column({ nullable: true })
  currency?: string;

  @Column({ nullable: true })
  note_1?: string;

  @Column({ nullable: true })
  note_2?: string;

  @Column()
  status_id: number;

  @OneToMany((type) => Transaction, (transaction) => transaction.source)
  transactions: Transaction[];

  @ManyToOne((type) => SourceStatus, (status) => status.sources, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'status_id' })
  status: SourceStatus;
}
