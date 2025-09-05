import { Customer } from '@domain/entities/customer.entity';
import { IPaginatedData, IPaginationOptions } from '@shared/types/pagination';

export abstract class CustomerRepository {
  abstract create(customer: Omit<Customer, 'id'>): Promise<Customer>;
  abstract findById(id: string): Promise<Customer | null>;
  abstract findByDocument(documentType: Customer['documentType'], documentNumber: string): Promise<Customer | null>;
  abstract findAll(): Promise<Customer[]>;
  abstract findActive(): Promise<Customer[]>;
  abstract findPaginated(options: IPaginationOptions): Promise<IPaginatedData<Customer>>;
  abstract update(id: string, customer: Partial<Omit<Customer, 'id'>>): Promise<Customer>;
  abstract delete(id: string): Promise<void>;
  abstract softDelete(id: string): Promise<Customer>;
}
