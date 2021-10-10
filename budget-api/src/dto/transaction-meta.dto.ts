import { FilterSortPageDto } from './filter-sort-page.dto';

export interface TransactionMetaDto extends FilterSortPageDto {
  total_count: number;
}
