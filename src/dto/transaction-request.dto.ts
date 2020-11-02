import { FilterSortPageDto } from './filter-sort-page.dto';

export class TransactionRequestDto {
  dateFrom: Date;
  dateTo: Date;
  filters: FilterSortPageDto;
}
