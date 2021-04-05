import { FilterSortPageDto, NonStringFilter, StringFilter } from '../dto/filter-sort-page.dto';
import { SelectQueryBuilder } from 'typeorm';
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

  // roleRepository.find({
  //   join: { alias: 'roles', innerJoin: { users: 'roles.users' } },
  //   where: qb => {
  //     qb.where({ // Filter Role fields
  //       a: 1,
  //       b: 2
  //     }).andWhere('users.name = :userName', { userName: 'John Doe' }); // Filter related field
  //   }
  // });

  // public static mapDtoToTypeorm(query?: FilterSortPageDto) {
  //   getConnection()
  //     .createQueryBuilder()
  //     .where('user.id = :id', { id: 1 })
  //     .getMany();
  // }

  // public static mapDtoToTypeorm(query?: FilterSortPageDto): FindManyOptions<Transaction> {
  public static mapDtoToTypeorm(
    query?: FilterSortPageDto,
    sqb?: SelectQueryBuilder<Transaction>
  ): SelectQueryBuilder<Transaction> {
    this.queryBuilderDateParam(sqb, query?.date, 'date');
    this.queryBuilderStringParam(sqb, query?.message, 'message');
    this.queryBuilderStringParam(sqb, query?.note_1, 'note_1');
    this.queryBuilderStringParam(sqb, query?.note_2, 'note_2');
    this.queryBuilderStringParam(sqb, query?.note_3, 'note_3');
    this.queryBuilderNonStringParam(sqb, query?.amount, 'amount');

    // const f = (qb: SelectQueryBuilder<Transaction>) => {
    // sqb.where({
    // ...(query?.tag_ids ? { tag_ids: query.tag_ids } : {}),
    // ...(query?.tag_ids ? { tags: query.tag_ids } : {}),
    // ...(query?.tag_ids ? { tags: q.where({ tag_ids: query.tag_ids }).andWhere({}) } : {}),
    // });

    // if (query?.tag_ids) {
    //   qb = qb
    //     .leftJoinAndSelect('tags', 'tag')
    //     .where('tag.id IN (:...tagIds)', { tagIds: query.tag_ids });
    // }

    return sqb;

    // const options: FindManyOptions<Transaction> = {
    //   where: f,
    //   order: {
    //     ...(query?.order_by?.amount ? { amount: query.order_by.amount } : {}),
    //     ...(query?.order_by?.note_1 ? { note_1: query.order_by.note_1 } : {}),
    //     ...(query?.order_by?.note_2 ? { note_2: query.order_by.note_2 } : {}),
    //     ...(query?.order_by?.note_3 ? { note_3: query.order_by.note_3 } : {}),
    //     ...(query?.order_by?.message ? { message: query.order_by.message } : {}),
    //     ...(query?.order_by?.date ? { date: query.order_by.date } : {}),
    //   },
    //   skip: query?.skip ? query.skip : 0,
    //   take: query?.take ? query.take : 100,
    // };
  }

  private static queryBuilderDateParam(
    qb: SelectQueryBuilder<Transaction>,
    param: NonStringFilter<Date>,
    key: string
  ): SelectQueryBuilder<Transaction> {
    if (param?.equal) {
      return qb.where(`transactions.${key} = :date`, {
        date: DateUtils.toSQLiteString(param.equal),
      });
    } else if (param?.gte && param?.lte) {
      const dates = {
        lte: DateUtils.toSQLiteString(param.lte),
        gte: DateUtils.toSQLiteString(param.gte),
      };

      return dates.gte < dates.lte
        ? qb.where(`transactions.${key} BETWEEN :gte AND :lte`, dates)
        : qb
            .where(`transactions.${key} <= :lte`, { lte: dates.lte })
            .orWhere(`transactions.${key} >= :gte`, { gte: dates.gte });
    } else if (param?.gte) {
      return qb.where(`transactions.${key} >= :date`, {
        date: DateUtils.toSQLiteString(param.gte),
      });
    } else if (param?.lte) {
      return qb.where(`transactions.${key} <= :date`, {
        date: DateUtils.toSQLiteString(param.lte),
      });
    }
  }

  private static queryBuilderStringParam(
    qb: SelectQueryBuilder<Transaction>,
    param: StringFilter,
    key: string
  ): SelectQueryBuilder<Transaction> {
    if (param?.like) {
      const obj: { [key: string]: string } = {};
      obj[key] = `%${param.like}%`;
      return qb.andWhere(`transactions.${key} like :${key}`, obj);
    }
  }

  private static queryBuilderNonStringParam<T>(
    qb: SelectQueryBuilder<Transaction>,
    param: NonStringFilter<T>,
    key: string
  ): SelectQueryBuilder<Transaction> {
    const obj: { [key: string]: T } = {};
    if (param?.lte) {
      obj[key] = param.lte;
      return qb.andWhere(`transactions.${key} <= :${key}`, obj);
    } else if (param?.gte) {
      obj[key] = param.gte;
      return qb.andWhere(`transactions.${key} >= :${key}`, obj);
    } else if (param?.equal) {
      obj[key] = param.equal;
      return qb.andWhere(`transactions.${key} = :${key}`, obj);
    }
  }
}
