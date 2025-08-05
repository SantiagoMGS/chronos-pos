Table user {
  id BIGINT [pk, not null]
  email VARCHAR(255) [not null]
  date_creation DATE [not null]
  reset_pin VARCHAR(255)
}

Table user_credential {
  id VARCHAR(255) [pk, not null]
  userId VARCHAR(255) [not null, ref: > user.id]
  password VARCHAR(255) [not null]
  is_active BIGINT [not null, default: true]
}

Table payment_information {
  id VARCHAR(255) [pk, not null]
  status_id BIGINT [not null, ref: > status.id]
  first_name VARCHAR(255) [not null]
  last_name VARCHAR(255) [not null]
  phone_number VARCHAR(255) [not null]
  address VARCHAR(255) [not null]
  description VARCHAR(255) [not null]
}

Table status {
  id BIGINT [pk, not null]
  name VARCHAR(255) [not null]
  description VARCHAR(255) [not null]
}

Table company {
  id VARCHAR(255) [pk, not null]
  name VARCHAR(255) [not null]
  db_name VARCHAR(255) [not null]
  status_id BIGINT [not null, ref: > status.id]
  payment_information_id BIGINT [not null, ref: > payment_information.id]
}

Table user_company {
  user_id VARCHAR(255) [not null, ref: > user.id]
  company_id VARCHAR(255) [not null, ref: > company.id] // Posiblemente deberías revisar esta FK, parece que debería ir a company.id
  is_active BOOLEAN [not null]
}

Table items {
  id VARCHAR(255) [pk, not null]
  name VARCHAR(255) [not null]
  value DECIMAL(8,2) [not null]
  is_active BIGINT [not null]
  enable_taxes  BOOLEAN [not null]
}

Table tax_type {
  id VARCHAR(255) [pk, not null]
  name VARCHAR(255) [not null]
  description VARCHAR(255) [not null]
  is_active BOOLEAN [not null]
}

Table tax_item {
  id VARCHAR(255) [pk, not null]
  percentage VARCHAR(255) [not null]
  including BOOLEAN [not null]
  item_id VARCHAR(255) [not null, ref: > items.id]
  tax_type_id VARCHAR(255) [not null, ref: > tax_type.id]
}

Table invoice {
  id VARCHAR(255) [pk, not null]
  consecutive VARCHAR(255) [not null]
  total DECIMAL(8,2) [not null]
  total_taxes BIGINT [not null]
  outstanding_balance DECIMAL(8,2) [not null]
  amount_paid DECIMAL(8,2) [not null]
  description VARCHAR(255) [not null]
  date DATE [not null]
  shift_id VARCHAR(255) [not null, ref: > shift.id]
  customer_id VARCHAR(255) [not null, ref: > customer.id]
  resolution_id BIGINT [ref: > resolution.id]
}

Table payment_type {
  id BIGINT [pk, not null]
  name VARCHAR(255) [not null]
  description VARCHAR(255) [not null]
  is_active BOOLEAN [not null]
}

Table payment_invoice {
  id BIGINT [pk, not null]
  payment_type_id BIGINT [not null, ref: > payment_type.id]
  invoice_id VARCHAR(255) [not null, ref: > invoice.id]
  value DECIMAL(8,2) [not null]
  date DATE [not null]
}

Table detailed_invoice {
  id BIGINT [pk, not null]
  invoice_id VARCHAR(255) [not null, ref: > invoice.id]
  item_id VARCHAR(255) [not null, ref: > items.id]
  quantity INTEGER [not null]
  item_value DECIMAL(8,2) [not null]
  tax_item_id VARCHAR(255) [not null, ref: > tax_item.id]
  total_value DECIMAL(8,2) [not null]
  total_neto DECIMAL(8,2) [not null]
  total_taxes DECIMAL(8,2) [not null]
}

Table customer {
  id VARCHAR(255) [pk, not null]
  name VARCHAR(255) [not null]
  identification_type_id VARCHAR(255) [not null]
  identification_number VARCHAR(255) [not null]
  email VARCHAR(255) [not null]
  phone VARCHAR(255) [not null]
}

Table shift {
  id VARCHAR(255) [pk, not null]
  initial_cash DECIMAL(8,2) [not null]
  initial_date DATE [not null]
  final_date DATE [not null]
  initial_observation VARCHAR(255) [not null]
  final_observation VARCHAR(255) [not null]
  user_id VARCHAR(255) [not null]
  date DATE [not null]
}

Table detailed_payment_shift {
  id VARCHAR(255) [pk, not null]
  shift_id VARCHAR(255) [not null, ref: > shift.id]
  payment_type_id BIGINT [not null, ref: > payment_type.id]
  value DECIMAL(8,2) [not null]
}

Table resolution {
  id BIGINT [pk, not null]
  prefix VARCHAR(255)
  num_resolution VARCHAR(255)
  init_consecutive BIGINT
  end_consecutive BIGINT
  current_consecutive BIGINT
  init_date DATE
  end_date DATE
  enable_DIAN BOOLEAN
  active BOOLEAN
  eliminate BOOLEAN
}


Ref: "invoice"."id" < "invoice"."customer_id"