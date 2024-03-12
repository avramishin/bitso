import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { BasicAuthExceptionFilter } from './admins/filters/basic-auth.exception.filter';
import { BasicAuthGuard } from './admins/guards/basic-auth.guard';
import { CurrentAuthToken } from './admins/decorators/current-auth-token.decorator';
import { readFileSync } from 'fs';
import path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseFilters(new BasicAuthExceptionFilter())
  @UseGuards(BasicAuthGuard)
  async adminIndexPage(@CurrentAuthToken() authToken: string) {
    const indexFile = path.resolve(`${__dirname}/../public/index.html`);
    return readFileSync(indexFile)
      .toString()
      .replace('{{AUTH_TOKEN}}', authToken);
  }
}
