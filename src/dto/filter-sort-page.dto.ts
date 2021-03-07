export interface FilterSortPageDto {
  order_by?: OrderBy;
  message?: StringFilter;
  note_1?: StringFilter;
  note_2?: StringFilter;
  note_3?: StringFilter;
  amount?: NonStringFilter<number>;
  date?: NonStringFilter<Date>;
  perPage?: number;
  pageNumber?: number;
}

export interface OrderBy {
  message?: 'ASC' | 'DESC';
  note_1?: 'ASC' | 'DESC';
  note_2?: 'ASC' | 'DESC';
  note_3?: 'ASC' | 'DESC';
  amount?: 'ASC' | 'DESC';
  date?: 'ASC' | 'DESC';
}

export interface StringFilter {
  like: string;
}
export interface NonStringFilter<T> {
  equal?: T;
  lte?: T;
  gte?: T;
}
