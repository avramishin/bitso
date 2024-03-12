import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentCreatedEvent } from '../payments/events/payment-created.event';
import { PaymentUpdatedEvent } from '../payments/events/payment-updated.event';
import { PaymentsService } from '../payments/payments.service';
import { ExchangesService } from '../exchanges/exchanges.service';

@Injectable()
export class PaymentsProcessor {
  constructor(
    private paymentsService: PaymentsService,
    private exchangesService: ExchangesService,
  ) {}

  @OnEvent(PaymentCreatedEvent.name)
  async onPaymentCreated(event: PaymentCreatedEvent) {
    console.log('PAYMENT_CREATED', event);
  }

  @OnEvent(PaymentUpdatedEvent.name)
  async onPaymentUpdated(event: PaymentUpdatedEvent) {
    console.log('PAYMENT_UPDATED', event);
  }
}
