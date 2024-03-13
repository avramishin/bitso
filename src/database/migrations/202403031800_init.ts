import { Knex } from 'knex';
import { PaymentType } from '../../payments/enums/payment-type.enum';
import { Parameter } from '../../parameters/models/parameter.model';

async function up(db: Knex) {
  await db.schema.createTable('payments', (table) => {
    table.increments('id').primary();
    table.string('exchange', 50).notNullable().index();
    table.string('exchange_payment_id', 64).nullable().index();
    table.string('exchange_user_id', 64).nullable().index();
    table.string('bitso_payment_id', 64).nullable().index();
    table.enum('type', Object.keys(PaymentType));
    table.string('status', 15).notNullable();
    table.string('currency', 15).notNullable();
    table.decimal('amount', 26, 12);
    table.string('method_name', 50).nullable();
    table.string('numeric_ref', 255).nullable();
    table.string('notes_ref', 255).nullable();
    table.string('rfc', 255).nullable();
    table.string('clabe', 255).nullable();
    table.string('bank_name', 255).nullable();
    table.string('beneficiary', 255).nullable().index();
    table.integer('version').unsigned().notNullable().defaultTo(0);
    table.dateTime('created_at').notNullable().index();
    table.string('created_by', 100).index();
    table.dateTime('updated_at').notNullable();
    table.string('updated_by', 100).notNullable();
  });

  await db.schema.createTable('parameters', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable().unique();
    table.text('value').nullable();
  });

  await db<Parameter>('parameters').insert([
    {
      name: 'BITSO_WEBHOOK_URL',
      value: '',
    },
    {
      name: 'BITSO_WEBHOOK_SECRET',
      value: '',
    },
  ]);
}

async function down(db: Knex) {}

exports.up = up;
exports.down = down;
