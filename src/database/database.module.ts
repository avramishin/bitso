import knex, { Knex } from 'knex';
import path from 'path';

import { Global, Module } from '@nestjs/common';
import { config } from '../config';
import { waitFor } from '../common/wait-for';
import { mkdirSync, existsSync, writeFileSync } from 'fs';

@Global()
@Module({
  providers: [
    {
      provide: 'db',
      useFactory: async () => {
        let instance: Knex;

        if (config.db.type == 'mysql') {
          instance = knex({
            client: 'mysql2',
            asyncStackTraces: true,
            compileSqlOnError: true,
            connection: {
              host: config.db.host,
              user: config.db.user,
              password: config.db.password,
              database: config.db.database,
              port: parseInt(config.db.port),
              decimalNumbers: true,
            },
          });
        } else {
          const dbFile = path.resolve(`${__dirname}/../../storage/db.sqlite`);

          if (!existsSync(path.dirname(dbFile))) {
            mkdirSync(path.dirname(dbFile), { recursive: true });
          }

          if (!existsSync(dbFile)) {
            writeFileSync(dbFile, '');
          }

          instance = knex({
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
        }

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
