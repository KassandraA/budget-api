import { TransactionFilterSortPageDto } from './transaction-filter-sort-page.dto';

export interface TransactionMetaDto extends TransactionFilterSortPageDto {
  total_count: number;
}
