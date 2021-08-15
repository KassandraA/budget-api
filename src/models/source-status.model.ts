import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ModelConstants } from './model-constants';
import { Source } from './source.model';

@Entity(ModelConstants.sourceStatusesTable)
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
