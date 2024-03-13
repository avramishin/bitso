import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateParameterDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  value: string;
}
