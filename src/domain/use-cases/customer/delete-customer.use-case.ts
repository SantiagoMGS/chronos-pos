import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from '@domain/entities/customer.entity';
import { DOMAIN_MESSAGE } from '@shared/constants/domain-message';
import { CustomerRepository } from '@domain/repositories/customer/customer.repository';

@Injectable()
export class DeleteCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string): Promise<Customer> {
    const existing = await this.customerRepository.findById(id);
    if (!existing) throw new NotFoundException(DOMAIN_MESSAGE.CUSTOMER.NOT_FOUND);
    return await this.customerRepository.softDelete(id);
  }
}
