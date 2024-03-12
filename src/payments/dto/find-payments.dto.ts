import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { SortDirection } from '../../common/enums/sort-direction.enum';
import { sortTransformer } from '../../common/sort.transformer';

export class FindPaymentsDto {
  @IsOptional()
  filter?: string;

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
