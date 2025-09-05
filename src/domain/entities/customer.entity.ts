export enum DocumentType {
  CEDULA_DE_CIUDADANIA = 'CEDULA_DE_CIUDADANIA',
  TARJETA_DE_IDENTIDAD = 'TARJETA_DE_IDENTIDAD',
  CEDULA_DE_EXTRANJERIA = 'CEDULA_DE_EXTRANJERIA',
  NIT = 'NIT',
}

export type Customer = {
  id: string;
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
};
