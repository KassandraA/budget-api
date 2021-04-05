import { FilterSortPageDto, NonStringFilter, StringFilter } from '../dto/filter-sort-page.dto';
import {
  Equal,
  FindManyOptions,
  FindOperator,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  SelectQueryBuilder,
} from 'typeorm';
import { Transaction } from '../models/transaction.model';
import { DateUtils } from './date.utils';
import { ModelConstants } from '../models/model-constants';

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
        (!obj.tag_ids || typeof obj.tag_ids === 'object') &&
        (!obj.skip || typeof parseInt(obj.skip, 10) === 'number') &&
        (!obj.take || typeof parseInt(obj.take, 10) === 'number'))
    );
  }

  public static preFill(query?: FilterSortPageDto): FilterSortPageDto {
    const monthAgo = new Date(new Date().setDate(new Date().getDate() - 30));

    const options: FilterSortPageDto = {
      ...(query?.message ? { message: query.message } : {}),
      ...(query?.note_1 ? { note_1: query.note_1 } : {}),
      ...(query?.note_2 ? { note_2: query.note_2 } : {}),
      ...(query?.note_3 ? { note_3: query.note_3 } : {}),
      ...(query?.amount ? { amount: query.amount } : {}),
      ...(query?.date ? { date: query.date } : { date: { gte: monthAgo } }),
      ...(query?.tag_ids ? { tag_ids: query.tag_ids } : {}),

      ...(query?.order_by
        ? {
            order_by: {
              ...(query.order_by.amount ? { amount: query.order_by.amount } : {}),
              ...(query.order_by.note_1 ? { note_1: query.order_by.note_1 } : {}),
              ...(query.order_by.note_2 ? { note_2: query.order_by.note_2 } : {}),
              ...(query.order_by.note_3 ? { note_3: query.order_by.note_3 } : {}),
              ...(query.order_by.message ? { message: query.order_by.message } : {}),
              ...(query.order_by.date ? { date: query.order_by.date } : { date: 'DESC' }),
            },
          }
        : { order_by: { date: 'DESC' } }),

      skip: query?.skip ? +query.skip : 0,
      take: query?.take ? +query.take : 100,
    };

    return options;
  }

  public static mapDtoToTypeorm(query?: FilterSortPageDto): FindManyOptions<Transaction> {
    const queryFiltered = (sqb: SelectQueryBuilder<Transaction>) => {
      sqb = sqb.where({
        ...(query?.message ? { message: this.mapStringParam(query.message) } : {}),
        ...(query?.note_1 ? { note_1: this.mapStringParam(query.note_1) } : {}),
        ...(query?.note_2 ? { note_2: this.mapStringParam(query.note_2) } : {}),
        ...(query?.note_3 ? { note_3: this.mapStringParam(query.note_3) } : {}),
        ...(query?.amount ? { amount: this.mapNonStringParam(query.amount) } : {}),
        ...(query?.date ? { date: this.mapDateParam(query.date) } : {}),
      });
      if (query?.tag_ids) {
        sqb.andWhere(`${ModelConstants.tagsTable}.id IN (:...tagIds)`, { tagIds: query.tag_ids });
      }
    };

    const options: FindManyOptions<Transaction> = {
      join: {
        alias: ModelConstants.transactionsTable,
        leftJoin: { tags: `${ModelConstants.transactionsTable}.tags` },
      },
      relations: [ModelConstants.tagsTable],
      where: queryFiltered,
      order: {
        ...(query?.order_by?.amount ? { amount: query.order_by.amount } : {}),
        ...(query?.order_by?.note_1 ? { note_1: query.order_by.note_1 } : {}),
        ...(query?.order_by?.note_2 ? { note_2: query.order_by.note_2 } : {}),
        ...(query?.order_by?.note_3 ? { note_3: query.order_by.note_3 } : {}),
        ...(query?.order_by?.message ? { message: query.order_by.message } : {}),
        ...(query?.order_by?.date ? { date: query.order_by.date } : {}),
      },
      skip: query?.skip ? query.skip : 0,
      take: query?.take ? query.take : 100,
    };

    return options;
  }

  // todo: date lte && gte ...
  public static mapDateParam(queryParam?: NonStringFilter<Date>): FindOperator<string> {
    if (queryParam?.lte) {
      return LessThanOrEqual(DateUtils.toSQLiteString(queryParam.lte));
    } else if (queryParam?.gte) {
      return MoreThanOrEqual(DateUtils.toSQLiteString(queryParam.gte));
    } else if (queryParam?.equal) {
      return Equal(DateUtils.toSQLiteString(queryParam.equal));
    }
  }

  public static mapNonStringParam<T>(queryParam?: NonStringFilter<T>): FindOperator<T> {
    if (queryParam?.lte) {
      return LessThanOrEqual(queryParam.lte);
    } else if (queryParam?.gte) {
      return MoreThanOrEqual(queryParam.gte);
    } else if (queryParam?.equal) {
      return Equal(queryParam.equal);
    }
  }

  public static mapStringParam(queryParam?: StringFilter): FindOperator<string> {
    if (queryParam?.like) {
      return Like(`%${queryParam.like}%`);
    }
  }

  // private static queryBuilderDateParam(
  //   qb: SelectQueryBuilder<Transaction>,
  //   param: NonStringFilter<Date>,
  //   key: string
  // ): SelectQueryBuilder<Transaction> {
  //   if (param?.equal) {
  //     return qb.where(`transactions.${key} = :date`, {
  //       date: DateUtils.toSQLiteString(param.equal),
  //     });
  //   } else if (param?.gte && param?.lte) {
  //     const dates = {
  //       lte: DateUtils.toSQLiteString(param.lte),
  //       gte: DateUtils.toSQLiteString(param.gte),
  //     };

  //     return dates.gte < dates.lte ? qb.where(`transactions.${key} BETWEEN :gte AND :lte`, dates) : qb
  //           .where(`transactions.${key} <= :lte`, { lte: dates.lte })
  //           .orWhere(`transactions.${key} >= :gte`, { gte: dates.gte });
  //   } else if (param?.gte) {
  //     return qb.where(`transactions.${key} >= :date`, {
  //       date: DateUtils.toSQLiteString(param.gte),
  //     });
  //   } else if (param?.lte) {
  //     return qb.where(`transactions.${key} <= :date`, {
  //       date: DateUtils.toSQLiteString(param.lte),
  //     });
  //   }
  // }
}
