import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BasicAuthException } from '../exceptions/basic-auth.exception';
import { AdminsService } from '../admins.service';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private adminsService: AdminsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request = context.switchToHttp().getRequest();

    const authToken = (request.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(authToken, 'base64')
      .toString()
      .split(':');

    const admins = await this.adminsService.findAll();

    for (const admin of admins) {
      if (admin.username == username && admin.password == password) {
        request.current_admin = admin;
        request.current_auth_token = authToken;
        return true;
      }
    }

    throw new BasicAuthException('Authorization required');
  }
}
