import { Injectable } from '@nestjs/common';
import { config } from '../config';
import { Admin } from './models/admin.model';

@Injectable()
export class AdminsService {
  async findAll() {
    return config.admins as Admin[];
  }
}
