import { Injectable } from '@nestjs/common';
import { Customer } from '@domain/entities/customer.entity';
import { CustomerRepository } from '@domain/repositories/customer/customer.repository';
import { IPaginatedData, IPaginationOptions } from '@shared/types/pagination';

@Injectable()
export class GetAllCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(options: IPaginationOptions): Promise<IPaginatedData<Customer>> {
    return await this.customerRepository.findPaginated(options);
  }
}
