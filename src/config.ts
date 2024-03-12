const api_key = 'cfda9da8-1c8a-443a-8a33-da676540fa84';
const api_secret = 'WWXKIAYXI6EDJTG0WN0LDRRYQ4TZ4N5MS1KHZTNCHWP';

export const config = {
  db: {
    migrate: true,
    type: 'mysql',
    host:
      process.env['DATABASE_HOST'] ||
      'vakotrade.cxgliye7pvfd.us-east-1.rds.amazonaws.com',
    user: process.env['DATABASE_USERNAME'] || 'bitso',
    password: process.env['DATABASE_PASSWORD'] || 'La6no5N2',
    database: process.env['DATABASE_NAME'] || 'bitso',
    port: process.env['DATABASE_PORT'] || '3306',
  },

  admins: [
    {
      username: 'admin',
      password: 'showmethemoney',
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
