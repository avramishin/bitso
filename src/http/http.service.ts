import axios, { AxiosRequestConfig } from 'axios';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { ExecutionTimer } from '../common/execution-timer';
import { config as globalConfig } from '../config';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class HttpService {
  private axios = axios.create();

  constructor(private logsService: LogsService) {}

  async request<T>(config: AxiosRequestConfig, meta: any = {}) {
    const eventPrefix = meta.source || 'HttpService';
    const requestId = uuid().slice(0, 6);
    const timer = new ExecutionTimer();

    this.logsService.register(`${eventPrefix}.HttpRequest`, {
      appId: globalConfig.app_id,
      requestId,
      meta,
      request: config,
    });

    if (!config.timeout) {
      config.timeout = 15000;
    }

    try {
      const response = await this.axios(config);
      this.logsService.register(`${eventPrefix}.HttpResponse`, {
        appId: globalConfig.app_id,
        requestId,
        meta,
        response: response.data,
        timeTaken: timer.diff(),
      });
      return response.data as T;
    } catch (e) {
      const message = e.response?.data?.message || `HTTP: ${e.message}`;
      this.logsService.register(`${eventPrefix}.HttpError`, {
        appId: globalConfig.app_id,
        requestId,
        config,
        meta,
        message,
        status: e.response?.status,
        response: e.response?.data || 'NO_DATA',
        timeTaken: timer.diff(),
      });
      throw new Error(message);
    }
  }
}
