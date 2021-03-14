export interface PaginationDto {
  where: any;
  order: any;
  skip: number;
  take: number;
  total_count: number;
}
