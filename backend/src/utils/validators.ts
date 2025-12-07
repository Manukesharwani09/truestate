/**
 * Request Validators
 */

// Allowed fields for searching
export const ALLOWED_SEARCH_FIELDS = ['customerName', 'phoneNumber'];

// Allowed fields for sorting
export const ALLOWED_SORT_FIELDS = [
  'date',
  'quantity',
  'customerName',
  'finalAmount',
  'createdAt',
];

// Allowed fields for filtering
export const ALLOWED_FILTER_FIELDS = [
  'customerRegion',
  'gender',
  'age',
  'productCategory',
  'tags',
  'paymentMethod',
  'date',
  'orderStatus',
  'deliveryType',
];

/**
 * Validate sort field
 */
export function validateSortField(field: string): boolean {
  return ALLOWED_SORT_FIELDS.includes(field);
}

/**
 * Validate search fields
 */
export function validateSearchFields(fields: string[]): boolean {
  return fields.every((field) => ALLOWED_SEARCH_FIELDS.includes(field));
}

/**
 * Validate filter fields
 */
export function validateFilterFields(fields: string[]): boolean {
  return fields.every((field) => ALLOWED_FILTER_FIELDS.includes(field));
}
