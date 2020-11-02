import { FilterSortPageDto } from '../dto/filter-sort-page.dto';

export class FilterSortPage {
  static getJson(filterSortPage: FilterSortPageDto) {
    return {
      where: this.mapFilters(filterSortPage.filter),
      order: filterSortPage.order,
    };
  }

  static mapFilters(filter: any) {
    const keys = Object.keys(filter);
    return keys.map((key) => {
      if (key) {
        return {
          [key]: filter[key],
        };
      }
    });
  }
}
