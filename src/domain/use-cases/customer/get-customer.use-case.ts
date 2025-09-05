import { Injectable } from '@nestjs/common';
import { Customer } from '@domain/entities/customer.entity';
import { CustomerRepository } from '@domain/repositories/customer/customer.repository';

@Injectable()
export class GetCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string): Promise<Customer | null> {
    return await this.customerRepository.findById(id);
  }
}
