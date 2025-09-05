import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Customer, DocumentType } from '@domain/entities/customer.entity';
import { CustomerRepository } from '@domain/repositories/customer/customer.repository';

export interface UpdateCustomerDto {
  name?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const existing = await this.customerRepository.findById(id);
    if (!existing) throw new NotFoundException('Cliente no encontrado');

    if (
      (dto.documentType && dto.documentType !== existing.documentType) ||
      (dto.documentNumber && dto.documentNumber !== existing.documentNumber)
    ) {
      const duplicate = await this.customerRepository.findByDocument(
        dto.documentType ?? existing.documentType,
        dto.documentNumber ?? existing.documentNumber,
      );
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException('Ya existe un cliente con este tipo y número de documento');
      }
    }

    return await this.customerRepository.update(id, dto);
  }
}
