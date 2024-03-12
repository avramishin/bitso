const api_key = 'cfda9da8-1c8a-443a-8a33-da676540fa84';
const api_secret = 'WWXKIAYXI6EDJTG0WN0LDRRYQ4TZ4N5MS1KHZTNCHWP';

export const config = {
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
