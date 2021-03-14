import { FilterSortPageDto, NonStringFilter, StringFilter } from '../dto/filter-sort-page.dto';
import {
  Equal,
  FindManyOptions,
  FindOperator,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
} from 'typeorm';
import { Transaction } from '../models/transaction.model';
import { DateUtils } from './date.utils';

export class FilterSortPageUtils {
  public static isFilterSortPageDto(obj?: any): obj is FilterSortPageDto {
    return (
      !obj ||
      ((!obj.order_by || typeof obj.order_by === 'object') &&
        (!obj.message || typeof obj.message === 'object') &&
        (!obj.note_1 || typeof obj.note_1 === 'object') &&
        (!obj.note_2 || typeof obj.note_2 === 'object') &&
        (!obj.note_3 || typeof obj.note_3 === 'object') &&
        (!obj.amount || typeof obj.amount === 'object') &&
        (!obj.date || typeof obj.date === 'object') &&
        (!obj.skip || typeof parseInt(obj.skip, 10) === 'number') &&
        (!obj.take || typeof parseInt(obj.take, 10) === 'number'))
    );
  }

  public static mapDtoToTypeorm(query?: FilterSortPageDto): FindManyOptions<Transaction> {
    const monthAgo = new Date(new Date().setDate(new Date().getDate() - 30));

    const options: FindManyOptions<Transaction> = {
      where: {
        ...(query?.amount ? { amount: this.mapNonStringParam(query.amount) } : {}),
        ...(query?.date
          ? { date: this.mapDateParam(query.date) }
          : { date: MoreThanOrEqual(DateUtils.toSQLiteString(monthAgo)) }),
        ...(query?.message ? { message: this.mapStringParam(query.message) } : {}),
        ...(query?.note_1 ? { note_1: this.mapStringParam(query.note_1) } : {}),
        ...(query?.note_2 ? { note_2: this.mapStringParam(query.note_2) } : {}),
        ...(query?.note_3 ? { note_3: this.mapStringParam(query.note_3) } : {}),
      },
      order: {
        ...(query?.order_by?.amount ? { amount: query.order_by.amount } : {}),
        ...(query?.order_by?.note_1 ? { note_1: query.order_by.note_1 } : {}),
        ...(query?.order_by?.note_2 ? { note_2: query.order_by.note_2 } : {}),
        ...(query?.order_by?.note_3 ? { note_3: query.order_by.note_3 } : {}),
        ...(query?.order_by?.message ? { message: query.order_by.message } : {}),
        ...(query?.order_by?.date ? { date: query.order_by.date } : { date: 'DESC' }),
      },
      skip: query?.skip ? +query.skip : 0,
      take: query?.take ? +query.take : 100,
    };

    return options;
  }

  private static mapDateParam(queryParam?: NonStringFilter<Date>): FindOperator<string> {
    if (queryParam?.lte) {
      return LessThanOrEqual(DateUtils.toSQLiteString(queryParam.lte));
    } else if (queryParam?.gte) {
      return MoreThanOrEqual(DateUtils.toSQLiteString(queryParam.gte));
    } else if (queryParam?.equal) {
      return Equal(DateUtils.toSQLiteString(queryParam.equal));
    }
  }

  private static mapNonStringParam<T>(queryParam?: NonStringFilter<T>): FindOperator<T> {
    if (queryParam?.lte) {
      return LessThanOrEqual(queryParam.lte);
    } else if (queryParam?.gte) {
      return MoreThanOrEqual(queryParam.gte);
    } else if (queryParam?.equal) {
      return Equal(queryParam.equal);
    }
  }

  private static mapStringParam(queryParam?: StringFilter): FindOperator<string> {
    if (queryParam?.like) {
      return Like(queryParam.like);
    }
  }
}
