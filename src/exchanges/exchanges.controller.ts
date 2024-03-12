import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { BasicAuthGuard } from '../admins/guards/basic-auth.guard';
import { FindExchangeUsersDto } from './dto/find-exchange-users.dto';

@Controller()
export class ExchangesController {
  constructor(private exchangesService: ExchangesService) {}

  @Get('v1/exchanges')
  @UseGuards(BasicAuthGuard)
  async getExchanges() {
    const exchanges = await this.exchangesService.findAll();
    return {
      items: exchanges,
      total: exchanges.length,
    };
  }

  @Get('v1/exchanges/users')
  @UseGuards(BasicAuthGuard)
  async getExchangeUsers(@Query() dto: FindExchangeUsersDto) {
    const exchange = await this.exchangesService.findById(dto.exchange);
    const users = await this.exchangesService.findUsers(
      exchange,
      dto.query,
      10,
      0,
    );
    return {
      items: users,
      total: users.length,
    };
  }
}
