import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Source } from './source.model';

@Entity('source_statuses')
export class SourceStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany((type) => Source, (source) => source.status)
  sources: Source[];
}
