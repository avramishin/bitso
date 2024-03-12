import { Payment } from '../models/payment.model';

export class PaymentUpdatedEvent {
  constructor(public payment: Payment) {}
}
