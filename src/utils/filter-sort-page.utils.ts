import { FilterSortPageDto, NonStringFilter, StringFilter } from '../dto/filter-sort-page.dto';
import {
  Between,
  Equal,
  FindConditions,
  FindManyOptions,
  FindOperator,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Raw,
} from 'typeorm';
import { Transaction } from '../models/transaction.model';
import { DateUtils } from './date.utils';

// export declare type FilterSortPageUtilsType<T> = {
//     [P in keyof T]?: T[P] extends never ? FindConditions<T[P]> | FindOperator<FindConditions<T[P]>> : FindConditions<T[P]> | FindOperator<FindConditions<T[P]>>;
// };

export class FilterSortPageUtils {
  public static mapDtoToTypeorm(query?: FilterSortPageDto): FindManyOptions<Transaction> {
    const monthAgo = new Date(new Date().setDate(new Date().getDate() - 30));

    const options: FindManyOptions<Transaction> = {
      where: {
        ...(query?.amount ? { amount: this.mapNonStringParam(query.amount) } : {}),
        ...(query?.date
          ? { date: this.mapNonStringParam(query.date) }
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
        ...(query?.order_by?.date ? { date: query.order_by.date } : { date: 'DESC' }),
        ...(query?.order_by?.message ? { message: query.order_by.message } : {}),
      },
      // skip: 0,
      // take: 100,
    };

    return options;
  }

  private static mapNonStringParam<T>(queryParam?: NonStringFilter<T>): FindOperator<T> {
    if (queryParam?.lte) {
      return LessThanOrEqual(queryParam.lte);
    } else if (queryParam?.gte) {
      return MoreThanOrEqual(queryParam.gte);
    } else if (queryParam?.equal) {
      return Equal(queryParam.equal);
    }
    // else if (queryParam?.between) {
    //   return Between(queryParam.between[0], queryParam.between[1]);
    // }
  }

  private static mapStringParam(queryParam?: StringFilter): FindOperator<string> {
    if (queryParam?.like) {
      return Like(queryParam.like);
    }
  }
}
