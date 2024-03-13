import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { BaseCrudService } from '../database/base-crud.service';
import { Interval } from '@nestjs/schedule';
import { Parameter } from './models/parameter.model';
import { Knex } from 'knex';

@Injectable()
export class ParametersService
  extends BaseCrudService<Parameter>
  implements OnModuleInit
{
  public localItems: Parameter[] = [];

  constructor(@Inject('db') protected dbMaster: Knex) {
    super(dbMaster, {
      class: Parameter,
      pk: ['name'],
      table: 'parameters',
    });
  }

  async onModuleInit() {
    try {
      await this.loadLocalItems();
    } catch (e) {}
  }

  @Interval(30_000)
  async loadLocalItems() {
    this.localItems = await this.findAll();
  }

  getParameter(name: string) {
    return this.localItems.find((item) => item.name == name)?.value;
  }
}
