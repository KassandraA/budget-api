export class FilterSortPageDto {
  filter: IDictionary;
  order: IDictionary;
  perPage: number;
  pageNumber: number;
}

export interface IDictionary {
  [key: string]: any;
}

export interface TransactionFilter {
  message?: string;
  note_1?: string;
  note_2?: string;
  note_3?: string;
  amount?: number;
  source_id?: number;
}
