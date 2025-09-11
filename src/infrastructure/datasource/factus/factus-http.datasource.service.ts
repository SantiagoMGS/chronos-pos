import { Injectable } from '@nestjs/common';
import { FactusHttpRepository } from '@domain/repositories/factus/factus-http.repository';
import axios from 'axios';

@Injectable()
export class FactusHttpDataSourceService implements FactusHttpRepository {
  async get<T = any>(fullUrl: string, accessToken: string): Promise<T> {
    const { data } = await axios.get<T>(fullUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 15000,
    });
    return data;
  }
}
