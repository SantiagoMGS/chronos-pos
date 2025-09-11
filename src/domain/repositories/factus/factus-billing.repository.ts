export abstract class FactusBillingRepository {
  abstract validateBill<T = any>(payload: unknown, accessToken: string): Promise<T>;
}
