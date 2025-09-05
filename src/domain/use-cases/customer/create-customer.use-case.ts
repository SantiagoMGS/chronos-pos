import { ConflictException, Injectable } from '@nestjs/common';
import { Customer, DocumentType } from '@domain/entities/customer.entity';
import { CustomerRepository } from '@domain/repositories/customer/customer.repository';

export interface CreateCustomerDto {
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  phoneNumber: string;
}

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(dto: CreateCustomerDto): Promise<Customer> {
    const existing = await this.customerRepository.findByDocument(dto.documentType, dto.documentNumber);
    if (existing) {
      throw new ConflictException('Ya existe un cliente con este tipo y número de documento');
    }

    const data: Omit<Customer, 'id'> = {
      name: dto.name,
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      isActive: true,
    };

    return await this.customerRepository.create(data);
  }
}
