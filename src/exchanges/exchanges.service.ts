import { Injectable, Inject } from '@nestjs/common';
import { config } from '../config';
import { Exchange } from './models/exchange.model';
import { CacheService } from '../cache/cache.service';
import { CACHE_SERVICE } from '../cache/cache.injection-keys';
import { gql, GraphQLClient } from 'graphql-request';

@Injectable()
export class ExchangesService {
  constructor(@Inject(CACHE_SERVICE) protected cacheManager: CacheService) {}

  async findAll() {
    return config.exchanges as Exchange[];
  }

  async findById(exchange: string) {
    return (await this.findAll()).find((item) => item.exchange == exchange);
  }

  async findUsers(
    exchange: Exchange,
    search?: string,
    limit = 5,
    offset = 0,
  ): Promise<{ user_id: string; email: string }[]> {
    const client = await this.getGraphQLClient(exchange);
    return (
      await client.request<any>(
        gql`
          query ($search: String, $limit: Int, $offset: Int) {
            users(search: $search, pager: { limit: $limit, offset: $offset }) {
              user_id
              email
            }
          }
        `,
        {
          search,
          limit,
          offset,
        },
      )
    ).users;
  }

  async getGraphQLClient(exchange: Exchange) {
    const client = new GraphQLClient(exchange.graph_url);
    const jwt = await this.cacheManager.wrap<string>(
      `exchange-${exchange.exchange}-jwt`,
      async () => {
        console.log('get jwt ' + exchange.exchange);
        return (
          await client.request<any>(
            gql`
              mutation ($serviceApiKey: String!, $serviceApiSecret: String!) {
                service_signin(
                  service_api_key: $serviceApiKey
                  service_api_secret: $serviceApiSecret
                ) {
                  jwt
                }
              }
            `,
            {
              serviceApiKey: exchange.api_key,
              serviceApiSecret: exchange.api_secret,
            },
          )
        ).service_signin.jwt;
      },
      { ttl: 3600 },
    );

    client.setHeader('authorization', `bearer ${jwt}`);
    return client;
  }
}
