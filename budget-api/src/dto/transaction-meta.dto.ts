import { Transaction } from 'src/models/transaction.model';
import { TransactionFilterSortPageDto } from './transaction-filter-sort-page.dto';

export interface TransactionResponse {
  data: Transaction[];
  meta: TransactionMetaDto;
}

interface TransactionMetaDto extends TransactionFilterSortPageDto {
  total_count: number;
}
