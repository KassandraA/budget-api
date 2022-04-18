import { TransactionFilterSortPageDto, NonStringFilter, StringFilter } from '../dto/transaction-filter-sort-page.dto';
import {
  Between,
  Equal,
  FindManyOptions,
  FindOperator,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
  SelectQueryBuilder,
} from 'typeorm';
import { Transaction } from '../models/transaction.model';
import { DateUtils } from './date.utils';
import { ModelConstants } from '../models/model-constants';

export class TransactionTypeormUtils {
  public static isFilterSortPageDto(obj?: any): obj is TransactionFilterSortPageDto {
    return (
      !obj ||
      ((!obj.order_by || typeof obj.order_by === 'object') &&
        (!obj.message || typeof obj.message === 'object') &&
        (!obj.transactor || typeof obj.transactor === 'object') &&
        (!obj.amount || typeof obj.amount === 'object') &&
        (!obj.date || typeof obj.date === 'object') &&
        (!obj.tag_names || typeof obj.tag_names === 'object') &&
        (!obj.account_names || typeof obj.account_names === 'object') &&
        (!obj.skip || typeof parseInt(obj.skip, 10) === 'number') &&
        (!obj.take || typeof parseInt(obj.take, 10) === 'number'))
    );
  }

  public static preFill(query?: TransactionFilterSortPageDto): TransactionFilterSortPageDto {
    const d = new Date();
    const monthAgo = d.setDate(d.getDate() - 30);

    const options: TransactionFilterSortPageDto = {
      ...(query?.message ? { message: query.message } : {}),
      ...(query?.transactor ? { transactor: query.transactor } : {}),
      ...(query?.amount ? { amount: query.amount } : {}),
      ...(query?.date ? { date: query.date } : { date: { gte: new Date(monthAgo) } }),
      ...(query?.tag_names ? { tag_names: query.tag_names } : {}),
      ...(query?.account_names ? { account_names: query.account_names } : {}),

      ...(query?.order_by
        ? {
            order_by: {
              ...(query.order_by.amount ? { amount: query.order_by.amount } : {}),
              ...(query.order_by.transactor ? { transactor: query.order_by.transactor } : {}),
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

  public static findMany(query?: TransactionFilterSortPageDto): FindManyOptions<Transaction> {
    const queryFilters = (sqb: SelectQueryBuilder<Transaction>) => {
      sqb = sqb.where({
        ...(query?.message ? { message: this.mapStringParam(query.message) } : {}),
        ...(query?.transactor ? { transactor: this.mapStringParam(query.transactor) } : {}),
        ...(query?.amount ? { amount: this.mapNonStringParam(query.amount) } : {}),
        ...(query?.date ? { date: this.mapDateParam(query.date) } : {}),
      });
      if (query?.tag_names) {
        sqb.andWhere(`tags.name IN (:...tagNames)`, { tagNames: query.tag_names });
      }
      if (query?.account_names) {
        sqb.andWhere(`account.name IN (:...accountNames)`, { accountNames: query.account_names });
      }
    };

    const options: FindManyOptions<Transaction> = {
      join: {
        alias: ModelConstants.transactionsTable,
        leftJoinAndSelect: {
          tags: `${ModelConstants.transactionsTable}.tags`,
          account: `${ModelConstants.transactionsTable}.account`
        },
      },
      where: queryFilters,
      order: {
        ...(query?.order_by?.amount ? { amount: query.order_by.amount } : {}),
        ...(query?.order_by?.transactor ? { transactor: query.order_by.transactor } : {}),
        ...(query?.order_by?.message ? { message: query.order_by.message } : {}),
        ...(query?.order_by?.date ? { date: query.order_by.date } : {}),
      },
      skip: query?.skip ? query.skip : 0,
      take: query?.take ? query.take : 100,
    };

    return options;
  }

  public static mapDateParam(param?: NonStringFilter<Date>): FindOperator<string> {
    if (param?.equal) {
      return Equal(DateUtils.toSQLiteString(param.equal));
    } else if (param?.gte && param?.lte) {
      return param.gte < param.lte
        ? Between(DateUtils.toSQLiteString(param.gte), DateUtils.toSQLiteString(param.lte))
        : Not(Between(DateUtils.toSQLiteString(param.lte), DateUtils.toSQLiteString(param.gte)));
    } else if (param?.gte) {
      return MoreThanOrEqual(DateUtils.toSQLiteString(param.gte));
    } else if (param?.lte) {
      return LessThanOrEqual(DateUtils.toSQLiteString(param.lte));
    }
  }

  public static mapNonStringParam<T>(param?: NonStringFilter<T>): FindOperator<T> {
    if (param?.equal) {
      return Equal(param.equal);
    } else if (param?.gte && param?.lte) {
      return param.gte < param.lte
        ? Between(param.gte, param.lte)
        : Not(Between(param.lte, param.gte));
    } else if (param?.gte) {
      return MoreThanOrEqual(param.gte);
    } else if (param?.lte) {
      return LessThanOrEqual(param.lte);
    }
  }

  public static mapStringParam(queryParam?: StringFilter): FindOperator<string> {
    if (queryParam?.like) {
      return Like(`%${queryParam.like}%`);
    }
  }
}
