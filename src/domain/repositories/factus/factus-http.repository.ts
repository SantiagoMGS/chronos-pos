export abstract class FactusHttpRepository {
  abstract get<T = any>(fullUrl: string, accessToken: string): Promise<T>;
}


