export class FilterSortPageDto {
  orderBy: Map<string, SortDirection> | undefined;
  filter: TransactionFilter | undefined;
  perPage: number | undefined;
  pageNumber: number | undefined;
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IDictionary<T> {
  [key: string]: T;
}

export interface TransactionFilter {
  message?: string;
  note_1?: string;
  note_2?: string;
  note_3?: string;
  amount?: number;
  source_id?: number;
}
