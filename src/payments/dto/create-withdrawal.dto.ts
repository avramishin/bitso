import { IsNotEmpty, IsEmail, IsIn, IsOptional } from 'class-validator';

export class CreateWithdrawalDto {
  @IsNotEmpty()
  exchange: string;

  @IsOptional()
  exchange_payment_id: string;

  @IsNotEmpty()
  exchange_user_id: string;

  @IsOptional()
  bitso_payment_id: string;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  method_name: string;

  @IsOptional()
  numeric_ref: string;

  @IsOptional()
  notes_ref: string;

  @IsNotEmpty()
  rfc: string;

  @IsNotEmpty()
  clabe: string;

  @IsNotEmpty()
  bank_name: string;

  @IsNotEmpty()
  beneficiary: string;
}
