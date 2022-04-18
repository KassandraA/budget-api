export interface TransactionFilterSortPageDto {
  order_by?: OrderBy;
  message?: StringFilter;
  transactor?: StringFilter;
  amount?: NonStringFilter<number>;
  date?: NonStringFilter<Date>;
  tag_names?: string[];
  account_names?: string[];
  skip?: number;
  take?: number;
}

export interface OrderBy {
  message?: 'ASC' | 'DESC';
  transactor?: 'ASC' | 'DESC';
  amount?: 'ASC' | 'DESC';
  date?: 'ASC' | 'DESC';
  account_name?: 'ASC' | 'DESC';
}

export interface StringFilter {
  like: string;
}

export interface NonStringFilter<T> {
  equal?: T;
  lte?: T;
  gte?: T;
}
