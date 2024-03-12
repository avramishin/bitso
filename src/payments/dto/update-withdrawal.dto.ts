import { PartialType } from '@nestjs/mapped-types';
import { CreateWithdrawalDto } from './create-withdrawal.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateWithdrawalDto extends PartialType(CreateWithdrawalDto) {
  @IsNotEmpty()
  id: number;
}
