import knex from 'knex';
import path from 'path';

import { Global, Module } from '@nestjs/common';
import { config } from '../config';
import { waitFor } from '../common/wait-for';
import { mkdirSync, existsSync, writeFileSync } from 'fs';

const dbFile = path.resolve(`${__dirname}/../../storage/db.sqlite`);

if (!existsSync(path.dirname(dbFile))) {
  mkdirSync(path.dirname(dbFile), { recursive: true });
}

if (!existsSync(dbFile)) {
  writeFileSync(dbFile, '');
}

@Global()
@Module({
  providers: [
    {
      provide: 'db',
      useFactory: async () => {
        const instance = knex({
          client: 'better-sqlite3',
          asyncStackTraces: true,
          compileSqlOnError: true,
          useNullAsDefault: true,
          connection: {
            filename: dbFile,
          },
          pool: {
            afterCreate: function (conn, cb) {
              conn.pragma('synchronous = OFF');
              conn.pragma('journal_mode = WAL');
              conn.pragma('foreign_keys = OFF');
              cb();
            },
          },
        });

        if (config.db.migrate) {
          try {
            await instance.migrate.latest({
              directory: __dirname + '/migrations',
              loadExtensions: ['.js'],
            });
          } catch (e) {
            if (
              e.message.match('MigrationLocked') ||
              e.message.match('Migration table is already locked')
            ) {
              console.log('Wait for migrations in other process ...');
              await waitFor(15_000);
              process.exit(0);
            } else {
              throw new Error(e.message);
            }
          }
        }

        return instance;
      },
    },
  ],
  exports: ['db'],
})
export class DatabaseModule {}
