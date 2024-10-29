require('dotenv').config({ path: __dirname + '/../.env' });

import { uuidv4 } from './common/uuid-v4';

const api_key = process.env['EXCHANGE_API_KEY'];
const api_secret = process.env['EXCHANGE_API_SECRET'];

export const config = {
  app_id: uuidv4().slice(0, 6),
  db: {
    migrate: true,
    type: 'mysql',
    host: process.env['DATABASE_HOST'] || '',
    user: process.env['DATABASE_USERNAME'] || '',
    password: process.env['DATABASE_PASSWORD'] || '',
    database: process.env['DATABASE_NAME'] || '',
    port: process.env['DATABASE_PORT'] || '3306',
  },

  admins: [
    {
      username: 'admin',
      password: 'showmethemoney',
    },
    {
      username: 'bitso.admin',
      password: 'admin',
    },
    {
      username: 'bitso.admin1',
      password: 'admin1',
    },
  ],

  exchanges: [
    {
      exchange: 'DEV',
      graph_url: 'https://vakotrade.cryptosrvc-dev.com/graphql',
      api_key,
      api_secret,
    },
    {
      exchange: 'NEXUS-UAT',
      graph_url: 'https://vakotrade-nexus-uat.cryptosrvc.com/graphql',
      api_key,
      api_secret,
    },
    {
      exchange: 'DEMO-UAT',
      graphUrl: 'https://vakotrade-demo-uat.cryptosrvc.com/graphql',
      api_key,
      api_secret,
    },
  ],
};
