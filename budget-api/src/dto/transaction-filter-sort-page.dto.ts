export interface TransactionFilterSortPageDto {
  orderBy?: OrderBy;
  message?: StringFilter;
  transactor?: StringFilter;
  amount?: NonStringFilter<number>;
  date?: NonStringFilter<Date>;
  tagNames?: string[];
  accountNames?: string[];
  skip?: number;
  take?: number;
}

export interface OrderBy {
  message?: 'ASC' | 'DESC';
  transactor?: 'ASC' | 'DESC';
  amount?: 'ASC' | 'DESC';
  date?: 'ASC' | 'DESC';
  accountName?: 'ASC' | 'DESC';
}

export interface StringFilter {
  like: string;
}

export interface NonStringFilter<T> {
  equal?: T;
  lte?: T;
  gte?: T;
}
