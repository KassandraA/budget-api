import { TransactionFilterSortPageDto, NonStringFilter, StringFilter, KeyValueType } from '../dto/transaction-filter-sort-page.dto';
import {
  Between,
  Equal,
  FindOperator,
  FindOperatorType,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
  SelectQueryBuilder
} from 'typeorm';
import { Transaction } from '../models/transaction.model';
import { DateUtils } from './date.utils';
import { ModelConstants } from '../models/model-constants';
import { DatabaseConstants } from '../models/database-constants';

export class TransactionTypeormUtils {
  public static isFilterSortPageDto(obj?: KeyValueType): obj is TransactionFilterSortPageDto {
    return (
      !obj ||
      ((!obj.orderBy || typeof obj.orderBy === 'object') &&
        (!obj.message || typeof obj.message === 'object') &&
        (!obj.transactor || typeof obj.transactor === 'object') &&
        (!obj.amount || typeof obj.amount === 'object') &&
        (!obj.date || typeof obj.date === 'object') &&
        (!obj.tagNames || typeof obj.tagNames === 'object') &&
        (!obj.accountNames || typeof obj.accountNames === 'object') &&
        (!obj.skip || typeof parseInt(obj.skip as string, 10) === 'number') &&
        (!obj.take || typeof parseInt(obj.take as string, 10) === 'number'))
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
      ...(query?.tagNames ? { tagNames: query.tagNames } : {}),
      ...(query?.accountNames ? { accountNames: query.accountNames } : {}),

      ...(query?.orderBy
        ? {
            orderBy: {
              ...(query.orderBy.amount ? { amount: query.orderBy.amount } : {}),
              ...(query.orderBy.accountName ? { accountName: query.orderBy.accountName } : {}),
              ...(query.orderBy.transactor ? { transactor: query.orderBy.transactor } : {}),
              ...(query.orderBy.message ? { message: query.orderBy.message } : {}),
              ...(query.orderBy.date ? { date: query.orderBy.date } : {})
            }
          }
        : { orderBy: { date: 'DESC' } }),

      skip: query?.skip ? +query.skip : 0,
      take: query?.take ? +query.take : 100
    };

    return options;
  }

  public static getQueryBuilder(
    query?: TransactionFilterSortPageDto
  ): SelectQueryBuilder<Transaction> {
    const builder = Transaction.createQueryBuilder(DatabaseConstants.transactionsTable);
    builder
      .leftJoinAndSelect(
        `${DatabaseConstants.transactionsTable}.${ModelConstants.transactionTagsProperty}`,
        ModelConstants.transactionTagsProperty
      )
      .leftJoinAndSelect(
        `${DatabaseConstants.transactionsTable}.${ModelConstants.transactionAccountProperty}`,
        ModelConstants.transactionAccountProperty
      )
      .leftJoinAndSelect(
        `${DatabaseConstants.transactionsTable}.${ModelConstants.transactionPropertiesProperty}`,
        ModelConstants.transactionPropertiesProperty
      );
    builder.where({
      ...(query?.message ? { message: this.mapStringParam(query.message) } : {}),
      ...(query?.transactor ? { transactor: this.mapStringParam(query.transactor) } : {}),
      ...(query?.amount ? { amount: this.mapNonStringParam(query.amount) } : {}),
      ...(query?.date ? { date: this.mapDateParam(query.date) } : {})
    });
    if (query?.tagNames) {
      builder.andWhere(`tags.name IN (:...tagNames)`, { tagNames: query.tagNames });
    }
    if (query?.accountNames) {
      builder.andWhere(`account.name IN (:...accountNames)`, { accountNames: query.accountNames });
    }

    builder.orderBy({
      ...(query?.orderBy?.amount ? { 'transactions.amount': query.orderBy.amount } : {}),
      ...(query?.orderBy?.transactor ? { 'transactions.transactor': query.orderBy.transactor } : {}),
      ...(query?.orderBy?.message ? { 'transactions.message': query.orderBy.message } : {}),
      ...(query?.orderBy?.date ? { 'transactions.date': query.orderBy.date } : {}),
      ...(query?.orderBy?.accountName ? { 'account.name': query.orderBy.accountName } : {})
    });

    builder.skip(query?.skip ? query.skip : 0)
    builder.take(query?.take ? query.take : 100)

    return builder;
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
    } else {
      return new FindOperator({} as FindOperatorType, '');
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
    } else {
      return new FindOperator({} as FindOperatorType, {} as T);
    }
  }

  public static mapStringParam(queryParam?: StringFilter): FindOperator<string> {
    if (queryParam?.like) {
      return Like(`%${queryParam.like}%`);
    } else {
      return new FindOperator({} as FindOperatorType, '');
    }
  }
}
