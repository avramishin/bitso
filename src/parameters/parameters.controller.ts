import { Controller, Get, UseGuards, Query, Patch, Body } from '@nestjs/common';
import { BasicAuthGuard } from '../admins/guards/basic-auth.guard';
import { FindParametersDto } from './dto/find-parameters.dto';
import { ParametersService } from './parameters.service';
import { SortDirection } from '../common/enums/sort-direction.enum';
import { plainToInstance } from 'class-transformer';
import { Parameter } from './models/parameter.model';
import { UpdateParameterDto } from './dto/update-parameter.dto';

@Controller()
export class ParametersController {
  constructor(private parametersService: ParametersService) {}

  @Get('v1/parameters')
  @UseGuards(BasicAuthGuard)
  async findParameters(@Query() dto: FindParametersDto) {
    const query = this.parametersService.queryBuilder();

    if (dto.filter) {
      query.where((query) => {
        query
          .where(`name`, 'like', `%${dto.filter}%`)
          .orWhere(`value`, 'like', `%${dto.filter}%`);
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
      items: plainToInstance(Parameter, await query),
    };
  }

  @Patch('v1/parameters')
  @UseGuards(BasicAuthGuard)
  async updateParameter(@Body() dto: UpdateParameterDto) {
    const parameter = await this.parametersService.findOneOrFail({
      name: dto.name,
    });
    parameter.value = dto.value;
    await this.parametersService.updateOne(parameter);
    await this.parametersService.loadLocalItems();
    return parameter;
  }
}
