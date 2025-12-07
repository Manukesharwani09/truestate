/**
 * Database Seeder
 * Import CSV data into PostgreSQL
 *
 * Usage: npm run prisma:seed
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface CSVRow {
  'Transaction ID': string;
  'Date': string;
  'Customer ID': string;
  'Customer Name': string;
  'Phone Number': string;
  'Gender': string;
  'Age': string;
  'Customer Region': string;
  'Customer Type': string;
  'Product ID': string;
  'Product Name': string;
  'Brand': string;
  'Product Category': string;
  'Tags': string;
  'Quantity': string;
  'Price per Unit': string;
  'Discount Percentage': string;
  'Total Amount': string;
  'Final Amount': string;
  'Payment Method': string;
  'Order Status': string;
  'Delivery Type': string;
  'Store ID': string;
  'Store Location': string;
  'Salesperson ID': string;
  'Employee Name': string;
}

async function seed() {
  console.log('🌱 Starting database seed...\n');

  const csvPath = path.join(__dirname, '../../data/sales.csv');

  // Check if CSV file exists
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    console.log('\n📝 Instructions:');
    console.log('1. Download the dataset from the provided Google Drive link');
    console.log('2. Place it in backend/data/sales.csv');
    console.log('3. Run this seed command again\n');
    process.exit(1);
  }

  try {
    // Read and parse CSV
    console.log('📖 Reading CSV file...');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    console.log('🔄 Parsing CSV data...');
    const records: CSVRow[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(`✅ Found ${records.length.toLocaleString()} records\n`);

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.sale.deleteMany();
    console.log('✅ Database cleared\n');

    // Insert in batches for better performance
    const BATCH_SIZE = 1000;
    const totalBatches = Math.ceil(records.length / BATCH_SIZE);

    console.log(`📦 Inserting data in ${totalBatches} batches...\n`);

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

      const salesData = batch.map((row) => ({
        customerId: row['Customer ID'],
        customerName: row['Customer Name'],
        phoneNumber: row['Phone Number'],
        gender: row['Gender'],
        age: parseInt(row['Age']),
        customerRegion: row['Customer Region'],
        customerType: row['Customer Type'],
        productId: row['Product ID'],
        productName: row['Product Name'],
        brand: row['Brand'],
        productCategory: row['Product Category'],
        tags: row['Tags'] ? row['Tags'].split(',').map((t) => t.trim()) : [],
        quantity: parseInt(row['Quantity']),
        pricePerUnit: parseFloat(row['Price per Unit']),
        discountPercentage: parseFloat(row['Discount Percentage']),
        totalAmount: parseFloat(row['Total Amount']),
        finalAmount: parseFloat(row['Final Amount']),
        date: new Date(row['Date']),
        paymentMethod: row['Payment Method'],
        orderStatus: row['Order Status'],
        deliveryType: row['Delivery Type'],
        storeId: row['Store ID'],
        storeLocation: row['Store Location'],
        salespersonId: row['Salesperson ID'],
        employeeName: row['Employee Name'],
      }));

      await prisma.sale.createMany({
        data: salesData,
        skipDuplicates: true,
      });

      console.log(`  ✓ Batch ${batchNumber}/${totalBatches} completed (${salesData.length} records)`);
    }

    console.log(`\n✅ Seed completed successfully!`);
    console.log(`📊 Total records inserted: ${records.length.toLocaleString()}\n`);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
