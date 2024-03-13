import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminsModule } from './admins/admins.module';
import { ExchangesModule } from './exchanges/exchanges.module';
import { CacheModule } from './cache/cache.module';
import { isCacheableValue } from './common/is-cacheable-value';
import { PaymentsProcessor } from './processors/payments.processor';
import { LogsModule } from './logs/logs.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: __dirname + '/../public',
      renderPath: '/',
    }),
    EventEmitterModule.forRoot({
      maxListeners: 100,
      verboseMemoryLeak: true,
      ignoreErrors: true,
    }),
    ScheduleModule.forRoot(),
    CacheModule.forRoot({
      isCacheableValue,
    }),
    DatabaseModule,
    PaymentsModule,
    AdminsModule,
    ExchangesModule,
    LogsModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, PaymentsProcessor],
})
export class AppModule {}
