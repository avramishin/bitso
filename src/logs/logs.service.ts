import { Injectable } from '@nestjs/common';

@Injectable()
export class LogsService {
  register(event: string, incomingPayload?: any) {
    console.log(JSON.stringify({ event, incomingPayload }, null, 2));
  }
}
