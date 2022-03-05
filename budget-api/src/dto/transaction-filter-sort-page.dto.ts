export interface TransactionFilterSortPageDto {
  order_by?: OrderBy;
  message?: StringFilter;
  amount?: NonStringFilter<number>;
  date?: NonStringFilter<Date>;
  tag_names?: string[];
  skip?: number;
  take?: number;
}

export interface OrderBy {
  message?: 'ASC' | 'DESC';
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
