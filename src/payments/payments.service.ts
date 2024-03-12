import { Inject, Injectable } from '@nestjs/common';
import { BaseCrudService } from '../database/base-crud.service';
import { Payment } from './models/payment.model';
import { Knex } from 'knex';

@Injectable()
export class PaymentsService extends BaseCrudService<Payment> {
  constructor(@Inject('db') protected dbMaster: Knex) {
    super(dbMaster, {
      class: Payment,
      pk: ['id'],
      table: 'payments',
    });
  }
}
