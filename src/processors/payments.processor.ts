import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentCreatedEvent } from '../payments/events/payment-created.event';
import { PaymentUpdatedEvent } from '../payments/events/payment-updated.event';
import { ExchangesService } from '../exchanges/exchanges.service';
import { HttpService } from '../http/http.service';
import { ParametersService } from '../parameters/parameters.service';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class PaymentsProcessor {
  constructor(
    private logsService: LogsService,
    private exchangesService: ExchangesService,
    private parametersService: ParametersService,
    private httpService: HttpService,
  ) {}

  @OnEvent(PaymentCreatedEvent.name)
  async onPaymentCreated(event: PaymentCreatedEvent) {
    const exchange = await this.exchangesService.findById(
      event.payment.exchange,
    );

    try {
      await this.httpService.request(
        {
          method: 'post',
          url: this.parametersService.getParameter('BITSO_WEBHOOK_URL'),
          headers: {
            'x-webhook-secret': this.parametersService.getParameter(
              'BITSO_WEBHOOK_SECRET',
            ),
          },
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
    } catch (e) {
      this.logsService.register(e.message);
    }

    this.logsService.register('PAYMENT_CREATED', event);
  }

  @OnEvent(PaymentUpdatedEvent.name)
  async onPaymentUpdated(event: PaymentUpdatedEvent) {
    this.logsService.register('PAYMENT_CREATED', event);
  }
}
