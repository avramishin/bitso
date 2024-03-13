import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentCreatedEvent } from '../payments/events/payment-created.event';
import { PaymentUpdatedEvent } from '../payments/events/payment-updated.event';
import { PaymentsService } from '../payments/payments.service';
import { ExchangesService } from '../exchanges/exchanges.service';
import { HttpService } from '../http/http.service';
import { config } from '../config';

@Injectable()
export class PaymentsProcessor {
  constructor(
    private paymentsService: PaymentsService,
    private exchangesService: ExchangesService,
    private httpService: HttpService,
  ) {}

  @OnEvent(PaymentCreatedEvent.name)
  async onPaymentCreated(event: PaymentCreatedEvent) {
    const exchange = await this.exchangesService.findById(
      event.payment.exchange,
    );

    await this.httpService.request(
      {
        method: 'post',
        url: config.bitso.webhook,
        data: {
          request_id: event.payment.exchange_payment_id,
          exchange: event.payment.exchange,
          currency: event.payment.currency,
          amount: event.payment.amount,
          method_name: event.payment.method_name,
          numeric_ref: event.payment.numeric_ref,
          notes_ref: event.payment.notes_ref,
          rfc: event.payment.rfc,
          clabe: event.payment.clabe,
          bank_name: event.payment.bank_name,
          beneficiary: event.payment.beneficiary,
        },
      },
      {
        source: [
          PaymentsProcessor.name,
          PaymentsProcessor.prototype.onPaymentCreated.name,
        ],
      },
    );

    console.log('PAYMENT_CREATED', event);
  }

  @OnEvent(PaymentUpdatedEvent.name)
  async onPaymentUpdated(event: PaymentUpdatedEvent) {
    console.log('PAYMENT_UPDATED', event);
  }
}
