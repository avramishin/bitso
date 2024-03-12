import { Payment } from '../models/payment.model';

export class PaymentCreatedEvent {
  constructor(public payment: Payment) {}
}
