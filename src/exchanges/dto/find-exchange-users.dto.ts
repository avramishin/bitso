import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { SortDirection } from '../../common/enums/sort-direction.enum';
import { sortTransformer } from '../../common/sort.transformer';

export class FindExchangeUsersDto {
  @IsOptional()
  query?: string;

  @IsNotEmpty()
  exchange: string;

  @IsOptional()
  @IsNotEmpty()
  start: number;

  @IsOptional()
  @IsNotEmpty()
  limit: number;

  @IsOptional()
  @IsNotEmpty()
  @Transform(sortTransformer)
  sort?: {
    property: string;
    direction: SortDirection;
  };
}
