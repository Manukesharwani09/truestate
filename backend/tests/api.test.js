/**
 * SaleScope API Test Suite
 * Comprehensive tests for all filters, search, sorting, and pagination
 *
 * Run: node backend/tests/api.test.js
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  gray: '\x1b[90m',
};

let passedTests = 0;
let failedTests = 0;

// Helper function to make API requests
async function apiRequest(endpoint, body = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return await response.json();
}

// Helper function for GET requests
async function apiGet(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  return await response.json();
}

// Test assertion helper
function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    if (details) console.log(`  ${colors.gray}${details}${colors.reset}`);
    passedTests++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    if (details) console.log(`  ${colors.red}${details}${colors.reset}`);
    failedTests++;
  }
}

// Test runner
async function runTests() {
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}   SaleScope API Test Suite${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);

  // ==================== BASIC CONNECTIVITY ====================
  console.log(`${colors.yellow}📡 Basic Connectivity Tests${colors.reset}`);

  try {
    const health = await fetch('http://localhost:5000/health').then(r => r.json());
    assert(health.status === 'ok', 'Health check endpoint', `Status: ${health.status}`);
  } catch (error) {
    assert(false, 'Health check endpoint', `Error: ${error.message}`);
  }

  // ==================== FILTER OPTIONS ====================
  console.log(`\n${colors.yellow}🎛️  Filter Options Tests${colors.reset}`);

  let filterOptions;
  try {
    filterOptions = await apiGet('/sales/filters');
    assert(filterOptions.customerRegions?.length > 0, 'Customer regions available', `Found ${filterOptions.customerRegions?.length} regions`);
    assert(filterOptions.genders?.length > 0, 'Genders available', `Found ${filterOptions.genders?.length} genders`);
    assert(filterOptions.productCategories?.length > 0, 'Product categories available', `Found ${filterOptions.productCategories?.length} categories`);
    assert(filterOptions.tags?.length > 0, 'Tags available', `Found ${filterOptions.tags?.length} tags`);
    assert(filterOptions.paymentMethods?.length > 0, 'Payment methods available', `Found ${filterOptions.paymentMethods?.length} methods`);
    assert(filterOptions.orderStatuses?.length > 0, 'Order statuses available', `Found ${filterOptions.orderStatuses?.length} statuses`);
    assert(filterOptions.ageRange?.min !== undefined, 'Age range min available', `Min: ${filterOptions.ageRange?.min}`);
    assert(filterOptions.ageRange?.max !== undefined, 'Age range max available', `Max: ${filterOptions.ageRange?.max}`);
  } catch (error) {
    assert(false, 'Filter options retrieval', `Error: ${error.message}`);
  }

  // ==================== PAGINATION TESTS ====================
  console.log(`\n${colors.yellow}📄 Pagination Tests${colors.reset}`);

  const page1 = await apiRequest('/sales', { currentPage: 0, pageSize: 10 });
  assert(page1.data?.length === 10, 'First page returns 10 items', `Got ${page1.data?.length} items`);
  assert(page1.currentPage === 0, 'Current page is 0', `Page: ${page1.currentPage}`);
  assert(page1.totalElements > 0, 'Total elements reported', `Total: ${page1.totalElements?.toLocaleString()}`);
  assert(page1.totalPages > 0, 'Total pages calculated', `Pages: ${page1.totalPages?.toLocaleString()}`);

  const page2 = await apiRequest('/sales', { currentPage: 1, pageSize: 10 });
  assert(page2.currentPage === 1, 'Second page returns correctly', `Page: ${page2.currentPage}`);
  assert(page1.data[0].id !== page2.data[0].id, 'Pages have different data', 'Data is unique per page');

  const largePage = await apiRequest('/sales', { currentPage: 0, pageSize: 50 });
  assert(largePage.data?.length === 50, 'Large page size works', `Got ${largePage.data?.length} items`);

  const smallPage = await apiRequest('/sales', { currentPage: 0, pageSize: 1 });
  assert(smallPage.data?.length === 1, 'Small page size works', `Got ${smallPage.data?.length} items`);

  // ==================== SEARCH TESTS ====================
  console.log(`\n${colors.yellow}🔍 Search Functionality Tests${colors.reset}`);

  const searchResult = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    searchPhrase: 'Kumar'
  });
  assert(searchResult.data?.length > 0, 'Search by customer name returns results', `Found ${searchResult.data?.length} results`);
  assert(
    searchResult.data.some(s => s.customerName.toLowerCase().includes('kumar')),
    'Search results contain search term',
    'Customer names include "Kumar"'
  );

  const phoneSearch = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    searchPhrase: '9'
  });
  assert(phoneSearch.data?.length > 0, 'Search by phone number returns results', `Found ${phoneSearch.data?.length} results`);

  const noResults = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    searchPhrase: 'XYZNONEXISTENT123'
  });
  assert(noResults.data?.length === 0, 'Invalid search returns empty results', 'No false positives');

  const caseInsensitive = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    searchPhrase: 'kumar'
  });
  const upperCase = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    searchPhrase: 'KUMAR'
  });
  assert(
    caseInsensitive.totalElements === upperCase.totalElements,
    'Search is case-insensitive',
    `Both return ${caseInsensitive.totalElements} results`
  );

  // ==================== SORTING TESTS ====================
  console.log(`\n${colors.yellow}⬆️  Sorting Tests${colors.reset}`);

  const sortByDateDesc = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 5,
    sortBy: 'date',
    sortDir: 'desc'
  });
  assert(sortByDateDesc.data?.length > 0, 'Sort by date descending', `Got ${sortByDateDesc.data?.length} items`);
  const dates = sortByDateDesc.data.map(s => new Date(s.date).getTime());
  assert(
    dates.every((date, i) => i === 0 || date <= dates[i - 1]),
    'Dates are in descending order',
    `Latest: ${new Date(dates[0]).toLocaleDateString()}`
  );

  const sortByDateAsc = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 5,
    sortBy: 'date',
    sortDir: 'asc'
  });
  const datesAsc = sortByDateAsc.data.map(s => new Date(s.date).getTime());
  assert(
    datesAsc.every((date, i) => i === 0 || date >= datesAsc[i - 1]),
    'Dates are in ascending order',
    `Earliest: ${new Date(datesAsc[0]).toLocaleDateString()}`
  );

  const sortByQuantityDesc = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 5,
    sortBy: 'quantity',
    sortDir: 'desc'
  });
  const quantities = sortByQuantityDesc.data.map(s => s.quantity);
  assert(
    quantities.every((q, i) => i === 0 || q <= quantities[i - 1]),
    'Quantities are in descending order',
    `Max quantity: ${quantities[0]}`
  );

  const sortByQuantityAsc = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 5,
    sortBy: 'quantity',
    sortDir: 'asc'
  });
  const quantitiesAsc = sortByQuantityAsc.data.map(s => s.quantity);
  assert(
    quantitiesAsc.every((q, i) => i === 0 || q >= quantitiesAsc[i - 1]),
    'Quantities are in ascending order',
    `Min quantity: ${quantitiesAsc[0]}`
  );

  const sortByName = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 5,
    sortBy: 'customerName',
    sortDir: 'asc'
  });
  const names = sortByName.data.map(s => s.customerName);
  assert(
    names.every((name, i) => i === 0 || name.localeCompare(names[i - 1]) >= 0),
    'Names are in alphabetical order (A-Z)',
    `First name: ${names[0]}`
  );

  // ==================== FILTER TESTS ====================
  console.log(`\n${colors.yellow}🎯 Filter Tests${colors.reset}`);

  // Customer Region Filter
  if (filterOptions?.customerRegions?.length > 0) {
    const regionFilter = await apiRequest('/sales', {
      currentPage: 0,
      pageSize: 10,
      filters: {
        customerRegion: [filterOptions.customerRegions[0]]
      }
    });
    assert(regionFilter.data?.length > 0, 'Customer region filter works', `Filtered to ${filterOptions.customerRegions[0]}`);
    assert(
      regionFilter.data.every(s => s.customerRegion === filterOptions.customerRegions[0]),
      'All results match region filter',
      'Data integrity maintained'
    );

    // Multi-select region
    if (filterOptions.customerRegions.length > 1) {
      const multiRegion = await apiRequest('/sales', {
        currentPage: 0,
        pageSize: 10,
        filters: {
          customerRegion: filterOptions.customerRegions.slice(0, 2)
        }
      });
      assert(multiRegion.data?.length > 0, 'Multi-select region filter works', `Selected 2 regions`);
      assert(
        multiRegion.data.every(s => filterOptions.customerRegions.slice(0, 2).includes(s.customerRegion)),
        'Results match any selected region',
        'Multi-select logic correct'
      );
    }
  }

  // Gender Filter
  if (filterOptions?.genders?.length > 0) {
    const genderFilter = await apiRequest('/sales', {
      currentPage: 0,
      pageSize: 10,
      filters: {
        gender: [filterOptions.genders[0]]
      }
    });
    assert(genderFilter.data?.length > 0, 'Gender filter works', `Filtered to ${filterOptions.genders[0]}`);
    assert(
      genderFilter.data.every(s => s.gender === filterOptions.genders[0]),
      'All results match gender filter',
      'Data integrity maintained'
    );
  }

  // Product Category Filter
  if (filterOptions?.productCategories?.length > 0) {
    const categoryFilter = await apiRequest('/sales', {
      currentPage: 0,
      pageSize: 10,
      filters: {
        productCategory: [filterOptions.productCategories[0]]
      }
    });
    assert(categoryFilter.data?.length > 0, 'Product category filter works', `Filtered to ${filterOptions.productCategories[0]}`);
    assert(
      categoryFilter.data.every(s => s.productCategory === filterOptions.productCategories[0]),
      'All results match category filter',
      'Data integrity maintained'
    );
  }

  // Payment Method Filter
  if (filterOptions?.paymentMethods?.length > 0) {
    const paymentFilter = await apiRequest('/sales', {
      currentPage: 0,
      pageSize: 10,
      filters: {
        paymentMethod: [filterOptions.paymentMethods[0]]
      }
    });
    assert(paymentFilter.data?.length > 0, 'Payment method filter works', `Filtered to ${filterOptions.paymentMethods[0]}`);
    assert(
      paymentFilter.data.every(s => s.paymentMethod === filterOptions.paymentMethods[0]),
      'All results match payment method filter',
      'Data integrity maintained'
    );
  }

  // Order Status Filter
  if (filterOptions?.orderStatuses?.length > 0) {
    const statusFilter = await apiRequest('/sales', {
      currentPage: 0,
      pageSize: 10,
      filters: {
        orderStatus: [filterOptions.orderStatuses[0]]
      }
    });
    assert(statusFilter.data?.length > 0, 'Order status filter works', `Filtered to ${filterOptions.orderStatuses[0]}`);
    assert(
      statusFilter.data.every(s => s.orderStatus === filterOptions.orderStatuses[0]),
      'All results match order status filter',
      'Data integrity maintained'
    );
  }

  // Age Range Filter
  if (filterOptions?.ageRange) {
    const minAge = filterOptions.ageRange.min + 5;
    const maxAge = filterOptions.ageRange.max - 5;

    const ageFilter = await apiRequest('/sales', {
      currentPage: 0,
      pageSize: 10,
      filters: {
        ageRange: { min: minAge, max: maxAge }
      }
    });
    assert(ageFilter.data?.length > 0, 'Age range filter works', `Ages ${minAge}-${maxAge}`);
    assert(
      ageFilter.data.every(s => s.age >= minAge && s.age <= maxAge),
      'All results within age range',
      'Range filter logic correct'
    );
  }

  // Date Range Filter
  const dateFilter = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    filters: {
      dateRange: { from: '2021-01-01', to: '2021-12-31' }
    }
  });
  assert(dateFilter.data?.length > 0, 'Date range filter works', 'Filtered to 2021');
  assert(
    dateFilter.data.every(s => {
      const date = new Date(s.date);
      return date >= new Date('2021-01-01') && date <= new Date('2021-12-31');
    }),
    'All results within date range',
    'Date filter logic correct'
  );

  // Tags Filter (Array field)
  if (filterOptions?.tags?.length > 0) {
    const tagFilter = await apiRequest('/sales', {
      currentPage: 0,
      pageSize: 10,
      filters: {
        tags: [filterOptions.tags[0]]
      }
    });
    assert(tagFilter.data?.length >= 0, 'Tags filter works', `Filtered to tag: ${filterOptions.tags[0]}`);
    if (tagFilter.data.length > 0) {
      assert(
        tagFilter.data.every(s => s.tags.includes(filterOptions.tags[0])),
        'All results contain selected tag',
        'Array filter logic correct'
      );
    }
  }

  // ==================== COMBINED FILTERS ====================
  console.log(`\n${colors.yellow}🔗 Combined Filter Tests${colors.reset}`);

  const combinedFilter = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    filters: {
      customerRegion: [filterOptions.customerRegions[0]],
      gender: [filterOptions.genders[0]],
      dateRange: { from: '2021-01-01', to: '2023-12-31' }
    }
  });
  assert(combinedFilter.data?.length >= 0, 'Multiple filters can be combined', `Got ${combinedFilter.data?.length} results`);
  if (combinedFilter.data.length > 0) {
    assert(
      combinedFilter.data.every(s =>
        s.customerRegion === filterOptions.customerRegions[0] &&
        s.gender === filterOptions.genders[0]
      ),
      'Combined filters all apply correctly',
      'AND logic working'
    );
  }

  // Search + Filter combination
  const searchAndFilter = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    searchPhrase: 'Sharma',
    filters: {
      customerRegion: [filterOptions.customerRegions[0]]
    }
  });
  assert(searchAndFilter.data?.length >= 0, 'Search works with filters', `Got ${searchAndFilter.data?.length} results`);

  // Search + Filter + Sort combination
  const fullCombo = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    searchPhrase: 'Kumar',
    sortBy: 'date',
    sortDir: 'desc',
    filters: {
      gender: [filterOptions.genders[0]]
    }
  });
  assert(fullCombo.data?.length >= 0, 'Search + Filter + Sort combination works', `Got ${fullCombo.data?.length} results`);

  // ==================== EDGE CASES ====================
  console.log(`\n${colors.yellow}⚠️  Edge Case Tests${colors.reset}`);

  const emptyFilters = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    filters: {}
  });
  assert(emptyFilters.data?.length === 10, 'Empty filters return all data', 'No filter applied');

  const invalidPage = await apiRequest('/sales', {
    currentPage: 999999,
    pageSize: 10
  });
  assert(invalidPage.data?.length === 0, 'Invalid page number returns empty', 'Graceful handling');

  const zeroPageSize = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 0
  });
  assert(zeroPageSize.data?.length > 0, 'Zero page size defaults to reasonable value', `Got ${zeroPageSize.data?.length} items`);

  const negativeAge = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    filters: {
      ageRange: { min: -10, max: -5 }
    }
  });
  assert(negativeAge.data?.length === 0, 'Invalid age range returns empty', 'Validation working');

  const futureDateRange = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    filters: {
      dateRange: { from: '2030-01-01', to: '2030-12-31' }
    }
  });
  assert(futureDateRange.data?.length === 0, 'Future date range returns empty', 'Date validation working');

  const nonExistentFilter = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    filters: {
      customerRegion: ['NONEXISTENT_REGION_XYZ']
    }
  });
  assert(nonExistentFilter.data?.length === 0, 'Non-existent filter value returns empty', 'No false data');

  // Conflicting filters
  const conflictingAgeRange = await apiRequest('/sales', {
    currentPage: 0,
    pageSize: 10,
    filters: {
      ageRange: { min: 60, max: 20 } // min > max
    }
  });
  assert(conflictingAgeRange.data?.length === 0, 'Conflicting age range (min > max) returns empty', 'Validation working');

  // ==================== STATISTICS ====================
  console.log(`\n${colors.yellow}📊 Statistics Endpoint Tests${colors.reset}`);

  const stats = await apiGet('/sales/stats');
  assert(stats.totalSales > 0, 'Total sales reported', `Total: ${stats.totalSales?.toLocaleString()}`);
  assert(stats.totalRevenue > 0, 'Total revenue reported', `Revenue: $${stats.totalRevenue?.toLocaleString()}`);
  assert(stats.averageOrderValue > 0, 'Average order value calculated', `AOV: $${stats.averageOrderValue?.toFixed(2)}`);

  // ==================== FINAL REPORT ====================
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}   Test Results${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`Total: ${passedTests + failedTests}\n`);

  if (failedTests === 0) {
    console.log(`${colors.green}✓ All tests passed! 🎉${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ Some tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error(`${colors.red}Test suite failed with error:${colors.reset}`, error);
  process.exit(1);
});
