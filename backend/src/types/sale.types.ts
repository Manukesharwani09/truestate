/**
 * Sale Entity Types
 */

export interface SaleDTO {
  id: string;

  // Customer Fields
  customerId: string;
  customerName: string;
  phoneNumber: string;
  gender: string;
  age: number;
  customerRegion: string;
  customerType: string;

  // Product Fields
  productId: string;
  productName: string;
  brand: string;
  productCategory: string;
  tags: string[];

  // Sales Fields
  quantity: number;
  pricePerUnit: number;
  discountPercentage: number;
  totalAmount: number;
  finalAmount: number;

  // Operational Fields
  date: Date;
  paymentMethod: string;
  orderStatus: string;
  deliveryType: string;
  storeId: string;
  storeLocation: string;
  salespersonId: string;
  employeeName: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleFilters {
  customerRegion?: string[];
  gender?: string[];
  ageRange?: { min?: number; max?: number };
  productCategory?: string[];
  tags?: string[];
  paymentMethod?: string[];
  dateRange?: { from?: string; to?: string };
  orderStatus?: string[];
}
