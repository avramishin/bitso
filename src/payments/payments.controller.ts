import {
  Controller,
  Get,
  Body,
  Post,
  Patch,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { SortDirection } from '../common/enums/sort-direction.enum';
import { Payment } from './models/payment.model';
import { plainToInstance } from 'class-transformer';
import { FindPaymentsDto } from './dto/find-payments.dto';
import { BasicAuthGuard } from '../admins/guards/basic-auth.guard';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { CurrentAdmin } from '../admins/decorators/current-admin.decorator';
import { Admin } from '../admins/models/admin.model';
import { PaymentType } from './enums/payment-type.enum';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentCreatedEvent } from './events/payment-created.event';
import { PaymentUpdatedEvent } from './events/payment-updated.event';

@Controller()
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post('v1/payments/withdrawal')
  @UseGuards(BasicAuthGuard)
  async createWithdrawal(
    @CurrentAdmin() admin: Admin,
    @Body() dto: CreateWithdrawalDto,
  ) {
    const result = await this.paymentsService.createOne({
      ...dto,
      id: null,
      created_at: new Date().toISOString(),
      created_by: admin.username,
      updated_at: new Date().toISOString(),
      updated_by: admin.username,
      status: 'new',
      type: PaymentType.withdrawal,
    } as Payment);

    const payment = await this.paymentsService.findOneOrFail({
      id: result[0],
    });

    await this.eventEmitter.emitAsync(
      PaymentCreatedEvent.name,
      new PaymentCreatedEvent(payment),
    );

    return payment;
  }

  @Patch('v1/payments/withdrawal')
  @UseGuards(BasicAuthGuard)
  async updateWithdrawal(
    @CurrentAdmin() admin: Admin,
    @Body() dto: UpdateWithdrawalDto,
  ) {
    let payment = await this.paymentsService.findOneOrFail({
      id: dto.id,
    });

    const affectedRows = await this.paymentsService
      .queryBuilder()
      .update({
        ...dto,
        updated_at: new Date().toISOString(),
        updated_by: admin.username,
        version: payment.version + 1,
      })
      .where({
        id: dto.id,
        version: payment.version,
      });

    if (!affectedRows) {
      throw new BadRequestException('Payment was not updated!');
    }

    payment = await this.paymentsService.findOneOrFail({
      id: dto.id,
    });

    await this.eventEmitter.emitAsync(
      PaymentUpdatedEvent.name,
      new PaymentUpdatedEvent(payment),
    );

    return payment;
  }

  @Get('v1/payments')
  @UseGuards(BasicAuthGuard)
  async findPayments(@Query() dto: FindPaymentsDto) {
    const query = this.paymentsService.queryBuilder();

    if (dto.filter) {
      query.where((query) => {
        query
          .where(`exchange_user_id`, 'like', `%${dto.filter}%`)
          .orWhere(`bank_name`, 'like', `%${dto.filter}%`)
          .orWhere(`beneficiary`, 'like', `%${dto.filter}%`)
          .orWhere(`exchange_user_id`, 'like', `%${dto.filter}%`)
          .orWhere(`bitso_payment_id`, 'like', `%${dto.filter}%`)
          .orWhere(`rfc`, 'like', `%${dto.filter}%`)
          .orWhere(`clabe`, 'like', `%${dto.filter}%`)
          .orWhere(`notes_ref`, 'like', `%${dto.filter}%`)
          .orWhere(`numeric_ref`, 'like', `%${dto.filter}%`);
      });
    }

    const queryCount = query.clone().count('id as CNT').first();

    query
      .limit(dto.limit || 30)
      .offset(dto.start || 0)
      .orderBy(
        `${dto.sort?.property || 'id'}`,
        dto.sort?.direction || SortDirection.DESC,
      );

    return {
      total: ((await queryCount) as any).CNT,
      items: plainToInstance(Payment, await query),
    };
  }
}
