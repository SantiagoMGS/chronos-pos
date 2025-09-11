import { Injectable } from '@nestjs/common';
import { FactusBillingRepository } from '@domain/repositories/factus/factus-billing.repository';
import axios from 'axios';
import { envs } from '@core/config/envs';

@Injectable()
export class FactusBillingDataSourceService implements FactusBillingRepository {
  async validateBill<T = any>(payload: unknown, accessToken: string): Promise<T> {
    const url = `${envs.factusBaseUrl}/v1/bills/validate`;
    const { data } = await axios.post<T>(url, payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 20000,
    });
    return data;
  }
}
