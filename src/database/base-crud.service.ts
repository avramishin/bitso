import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Knex } from 'knex';

export class BaseCrudService<Model> {
  constructor(
    protected dbMaster: Knex,
    protected CRUD: {
      table: string;
      pk: string[];
      class: ClassConstructor<Model>;
    },
  ) {}

  getPk() {
    return this.CRUD.pk;
  }

  getTableName() {
    return this.CRUD.table;
  }

  queryBuilder() {
    return this.dbMaster<Model>(this.CRUD.table);
  }

  async createOne(record: Model, trx?: Knex.Transaction) {
    const query = this.queryBuilder();
    if (trx) {
      query.transacting(trx);
    }
    return await query.insert(record as any);
  }

  async createMany(records: Model[], trx?: Knex.Transaction) {
    const query = this.queryBuilder();
    let createResults = [];
    if (trx) {
      query.transacting(trx);
    }

    if (records.length > 0) {
      createResults = await query.insert(records as any);
    }

    return createResults;
  }

  async deleteOne(record: Partial<Model>, trx?: Knex.Transaction) {
    const query = this.queryBuilder();
    if (trx) {
      query.transacting(trx);
    }

    this.CRUD.pk.forEach((key) => {
      if (!record[key]) {
        throw new Error(
          [
            'DELETE_ONE_PRIMARY_KEY_REQUIRED',
            this.CRUD.table,
            key,
            JSON.stringify(record),
          ].join('-'),
        );
      } else {
        query.where(key, record[key]);
      }
    });

    return await query.delete();
  }

  async updateOne(record: Partial<Model>, trx?: Knex.Transaction) {
    const query = this.queryBuilder();

    if (trx) {
      query.transacting(trx);
    }

    this.CRUD.pk.forEach((key) => {
      if (!record[key]) {
        throw new Error(
          [
            'UPDATE_ONE_PRIMARY_KEY_REQUIRED',
            this.CRUD.table,
            key,
            JSON.stringify(record),
          ].join('-'),
        );
      } else {
        query.where(key, record[key]);
      }
    });

    return await query.update(record as any);
  }

  async findAll() {
    return plainToInstance(this.CRUD.class, await this.queryBuilder());
  }

  async findMany(args: Partial<Model>) {
    return plainToInstance(
      this.CRUD.class,
      await this.queryBuilder().where(args),
    );
  }

  async findOneOrFail(args: Partial<Model>) {
    const record = await this.findOne(args);
    if (!record) {
      throw new Error(
        ['FIND_ONE_FAILED', this.CRUD.table, JSON.stringify(args)].join('-'),
      );
    }
    return record;
  }

  async findOne(args: Partial<Model>) {
    return plainToInstance(
      this.CRUD.class,
      await this.queryBuilder().where(args).first(),
    );
  }
}
