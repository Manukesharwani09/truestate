/**
 * Frontend Type Definitions
 */

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  gender: string;
  age: number;
  customerRegion: string;
  customerType: string;
  productId: string;
  productName: string;
  brand: string;
  productCategory: string;
  tags: string[];
  quantity: number;
  pricePerUnit: number;
  discountPercentage: number;
  totalAmount: number;
  finalAmount: number;
  date: string;
  paymentMethod: string;
  orderStatus: string;
  deliveryType: string;
  storeId: string;
  storeLocation: string;
  salespersonId: string;
  employeeName: string;
}

export interface SalesResponse {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  sortBy?: string;
  sortDir?: SortDirection;
  searchPhrase?: string;
  data: Sale[];
}

export interface Filters {
  customerRegion: string[];
  gender: string;
  ageRange: { min: number; max: number };
  productCategory: string[];
  tags: string[];
  paymentMethod: string[];
  dateRange: { from: string; to: string };
  orderStatus: string[];
}

export interface FilterOptions {
  customerRegions: string[];
  genders: string[];
  productCategories: string[];
  paymentMethods: string[];
  orderStatuses: string[];
  deliveryTypes: string[];
  tags: string[];
  ageRange: { min: number; max: number };
}

export interface Stats {
  totalUnitsSold: number;
  totalAmount: number;
  totalRevenue: number;
  totalDiscount: number;
  totalSalesRecords: number;
  recordsWithAmount: number;
  recordsWithDiscount: number;
}
