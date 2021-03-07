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

export class FilterSortPageDtoValidator {
  public static isValidFilterSortPageDto(obj?: any): obj is FilterSortPageDto {
    return (
      !obj ||
      ((!obj.order_by || typeof obj.order_by === 'object') &&
        (!obj.message || typeof obj.message === 'object') &&
        (!obj.note_1 || typeof obj.note_1 === 'object') &&
        (!obj.note_2 || typeof obj.note_2 === 'object') &&
        (!obj.note_3 || typeof obj.note_3 === 'object') &&
        (!obj.amount || typeof obj.amount === 'object') &&
        (!obj.date || typeof obj.date === 'object') &&
        (!obj.perPage || typeof obj.perPage === 'number') &&
        (!obj.pageNumber || typeof obj.pageNumber === 'number'))
    );
  }
}
// function isFilterSortPageDto(obj: any): obj is FilterSortPageDto {
//   return !obj?.order_by || typeof obj.order_by === 'object[]';
// }

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

// export enum SortDirection {
//   ASC = 'ASC',
//   DESC = 'DESC',
// }
