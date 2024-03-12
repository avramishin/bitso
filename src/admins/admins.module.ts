import { Global, Module } from '@nestjs/common';
import { AdminsService } from './admins.service';

@Global()
@Module({
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
