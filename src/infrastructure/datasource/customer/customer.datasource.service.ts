import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '@core/services/tenant-prisma-client.service';
import { CustomerRepository } from '@domain/repositories/customer/customer.repository';
import { Customer, DocumentType } from '@domain/entities/customer.entity';
import { IPaginatedData, IPaginationOptions } from '@shared/types/pagination';
import { normalizePagination, toPaginatedData } from '@shared/utils/pagination';

@Injectable()
export class CustomerDataSourceService implements CustomerRepository {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async create(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const created = await this.tenantPrisma.client.customer.create({
      data: {
        name: customer.name,
        documentType: customer.documentType as unknown as any,
        documentNumber: customer.documentNumber,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        isActive: customer.isActive,
      },
    });

    return { ...created, documentType: created.documentType as unknown as DocumentType };
  }

  async findById(id: string): Promise<Customer | null> {
    const found = await this.tenantPrisma.client.customer.findUnique({ where: { id } });
    if (!found) return null;
    return { ...found, documentType: found.documentType as unknown as DocumentType };
  }

  async findByDocument(documentType: Customer['documentType'], documentNumber: string): Promise<Customer | null> {
    const found = await this.tenantPrisma.client.customer.findFirst({
      where: { documentType: documentType as unknown as any, documentNumber },
    });
    if (!found) return null;
    return { ...found, documentType: found.documentType as unknown as DocumentType };
  }

  async findAll(): Promise<Customer[]> {
    const rows = await this.tenantPrisma.client.customer.findMany({ orderBy: { name: 'asc' } });
    return rows.map((r) => ({ ...r, documentType: r.documentType as unknown as DocumentType }));
  }

  async findActive(): Promise<Customer[]> {
    const rows = await this.tenantPrisma.client.customer.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return rows.map((r) => ({ ...r, documentType: r.documentType as unknown as DocumentType }));
  }

  async findPaginated(options: IPaginationOptions): Promise<IPaginatedData<Customer>> {
    const { page, limit, skip } = normalizePagination(options.page, options.limit);

    const where: Record<string, unknown> = {};
    if (!options.withDeleted) where.isActive = true;

    const [rows, total] = await this.tenantPrisma.client.$transaction([
      this.tenantPrisma.client.customer.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
      this.tenantPrisma.client.customer.count({ where }),
    ]);

    const items: Customer[] = rows.map((r) => ({ ...r, documentType: r.documentType as unknown as DocumentType }));
    return toPaginatedData(items, page, limit, total);
  }

  async update(id: string, customer: Partial<Omit<Customer, 'id'>>): Promise<Customer> {
    const updated = await this.tenantPrisma.client.customer.update({
      where: { id },
      data: { ...customer, documentType: customer.documentType as unknown as any },
    });
    return { ...updated, documentType: updated.documentType as unknown as DocumentType };
  }

  async delete(id: string): Promise<void> {
    await this.tenantPrisma.client.customer.delete({ where: { id } });
  }

  async softDelete(id: string): Promise<Customer> {
    const updated = await this.tenantPrisma.client.customer.update({ where: { id }, data: { isActive: false } });
    return { ...updated, documentType: updated.documentType as unknown as DocumentType };
  }
}
