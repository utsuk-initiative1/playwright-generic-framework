# 🔄 API Comparison Testing Guide

## Overview

This guide explains how to use the API automation framework for **PHP vs Node.js API comparison testing** during migration.

---

## 🎯 What It Does

The API comparison testing framework allows you to:

1. ✅ **Compare API Responses** - Status codes, bodies, headers
2. ✅ **Validate Identical Behavior** - Ensure Node.js matches PHP
3. ✅ **Detect Differences** - Detailed reports of mismatches
4. ✅ **Parallel Testing** - Test both APIs simultaneously

---

## 📋 Requirements Coverage

### ✅ 1. API Response Matching

- **HTTP Status Codes** - Must match exactly
- **Response Body Structure** - Deep comparison of JSON
- **Response Headers** - Configurable header comparison
- **Field Values** - Exact or tolerance-based comparison

### ✅ 2. Internal API Calls Matching

*Note: This requires additional instrumentation in your APIs to capture internal calls. The framework can be extended to support this.*

### ✅ 3. SQL Query Matching

*Note: This requires database query logging/monitoring. The framework can be extended to support this.*

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd Playwright/Graphql
npm install
```

### Step 2: Set Environment Variables

Create a `.env` file:

```bash
# PHP API endpoint
PHP_API_BASE_URL=https://php-api.example.com

# Node.js API endpoint
NODE_API_BASE_URL=https://node-api.example.com

# Optional: Authentication tokens
PHP_API_TOKEN=your-php-token
NODE_API_TOKEN=your-node-token
```

### Step 3: Run Comparison Tests

```bash
# Run all comparison tests
npx playwright test tests/api/api-comparison.spec.ts

# Run specific test
npx playwright test tests/api/postman-app-bootstrap.spec.ts

# Run with UI
npx playwright test tests/api/api-comparison.spec.ts --ui
```

---

## 📝 Example: Postman App Bootstrap API

### The API Endpoint

```
GET /api/users/:userId/app_bootstrap
```

### Test Implementation

```typescript
import { DualApiClient } from '../../framework/api/core/DualApiClient';
import { ApiComparisonUtils } from '../../framework/api/utils/ApiComparisonUtils';

test('App Bootstrap API Comparison', async () => {
  const dualClient = new DualApiClient({
    phpBaseURL: 'https://god.postman.co',
    nodeBaseURL: 'https://node-api.postman.co',
  });
  
  await dualClient.init();

  const { php, node } = await dualClient.getBoth(
    '/api/users/42755007/app_bootstrap',
    {
      query: {
        freecollab: 'true',
        app_version: '11.74.2-251203-0111',
        app_target: 'electron',
        populate_groups: 'false',
      },
    }
  );

  // Compare responses
  await ApiComparisonUtils.assertResponsesMatch(php, node, {
    ignoreHeaders: ['date', 'x-request-id'],
    normalizeTimestamps: true,
  });
});
```

---

## 🔧 Configuration Options

### ComparisonOptions

```typescript
interface ComparisonOptions {
  ignoreHeaders?: string[];        // Headers to ignore
  ignoreFields?: string[];         // Fields to ignore in body
  tolerance?: number;              // Numeric comparison tolerance
  deepCompare?: boolean;            // Deep object comparison
  compareOrder?: boolean;           // Compare array order
  normalizeTimestamps?: boolean;   // Normalize timestamp fields
  timestampFields?: string[];      // Fields that are timestamps
}
```

### Example Configuration

```typescript
const options: ComparisonOptions = {
  ignoreHeaders: [
    'date',
    'x-request-id',
    'x-response-time',
    'server',
  ],
  ignoreFields: [
    'requestId',
    'serverTimestamp',
  ],
  normalizeTimestamps: true,
  timestampFields: [
    'created_at',
    'updated_at',
    'timestamp',
  ],
  tolerance: 0.01, // For numeric comparisons
  deepCompare: true,
  compareOrder: false, // Arrays might be in different order
};
```

---

## 📊 Comparison Report

The framework generates detailed comparison reports:

```
================================================================================
API COMPARISON REPORT
================================================================================

PHP Endpoint: https://php-api.example.com/api/users/1
Node Endpoint: https://node-api.example.com/api/users/1
Comparison Status: ❌ MISMATCH

❌ Found 3 difference(s):

Breakdown by type:
  - status: 1
  - field_value: 2

First 5 differences:
  1. [status] status: Status codes don't match: PHP=200, Node=404
  2. [field_value] name: Value mismatch: PHP="John", Node="Jane"
  3. [field_value] age: Numeric value mismatch: PHP=30, Node=31
```

---

## 🎯 Test Patterns

### Pattern 1: Basic Comparison

```typescript
test('Basic API Comparison', async () => {
  const { php, node } = await dualClient.getBoth('/api/endpoint');
  await ApiComparisonUtils.assertResponsesMatch(php, node);
});
```

### Pattern 2: With Query Parameters

```typescript
test('API with Query Params', async () => {
  const { php, node } = await dualClient.getBoth('/api/users', {
    query: { page: 1, limit: 10 },
  });
  await ApiComparisonUtils.assertResponsesMatch(php, node);
});
```

### Pattern 3: POST Request

```typescript
test('POST Request Comparison', async () => {
  const { php, node } = await dualClient.postBoth('/api/users', {
    name: 'Test User',
    email: 'test@example.com',
  });
  await ApiComparisonUtils.assertResponsesMatch(php, node, {
    ignoreHeaders: ['location'], // Location header might differ
  });
});
```

### Pattern 4: Custom Comparison

```typescript
test('Custom Comparison', async () => {
  const { php, node } = await dualClient.getBoth('/api/endpoint');
  
  const result = await ApiComparisonUtils.compareResponses(php, node, {
    ignoreHeaders: ['date'],
    normalizeTimestamps: true,
  });
  
  if (!result.match) {
    console.log('Differences:', result.differences);
    // Custom handling
  }
});
```

---

## 🔍 What Gets Compared

### ✅ Status Codes
- Exact match required
- Both must return same HTTP status

### ✅ Headers
- Configurable comparison
- Can ignore specific headers
- Case-insensitive matching

### ✅ Response Body
- Deep JSON comparison
- Recursive object/array comparison
- Field-by-field validation
- Nested path tracking

### ✅ Field Values
- Exact matching for strings
- Tolerance-based for numbers
- Type checking
- Null/undefined handling

### ✅ Arrays
- Length comparison
- Item-by-item comparison
- Optional order comparison

---

## 📈 Advanced Features

### 1. Timestamp Normalization

```typescript
await ApiComparisonUtils.assertResponsesMatch(php, node, {
  normalizeTimestamps: true,
  timestampFields: ['created_at', 'updated_at'],
});
```

### 2. Numeric Tolerance

```typescript
await ApiComparisonUtils.assertResponsesMatch(php, node, {
  tolerance: 0.01, // Allow 0.01 difference in numbers
});
```

### 3. Ignore Specific Fields

```typescript
await ApiComparisonUtils.assertResponsesMatch(php, node, {
  ignoreFields: ['requestId', 'serverTimestamp'],
});
```

### 4. Detailed Reports

```typescript
const report = await ApiComparisonUtils.getComparisonReport(php, node);
console.log(report);
```

---

## 🛠️ Extending for Internal API Calls

To track internal API calls, you'll need to:

1. **Instrument your APIs** to log internal calls
2. **Capture request/response data** for internal calls
3. **Extend the framework** to compare internal call logs

Example extension:

```typescript
interface InternalCall {
  endpoint: string;
  method: string;
  requestBody?: unknown;
  responseStatus: number;
  responseBody?: unknown;
}

// Compare internal calls
function compareInternalCalls(
  phpCalls: InternalCall[],
  nodeCalls: InternalCall[]
): ComparisonResult {
  // Implementation
}
```

---

## 🗄️ Extending for SQL Query Matching

To track SQL queries, you'll need to:

1. **Enable query logging** in both PHP and Node.js
2. **Capture SQL queries** with parameters
3. **Extend the framework** to compare query logs

Example extension:

```typescript
interface SqlQuery {
  query: string;
  parameters: unknown[];
  timestamp: number;
}

// Compare SQL queries
function compareSqlQueries(
  phpQueries: SqlQuery[],
  nodeQueries: SqlQuery[]
): ComparisonResult {
  // Implementation
}
```

---

## 📝 Best Practices

### 1. **Ignore Dynamic Headers**
```typescript
ignoreHeaders: ['date', 'x-request-id', 'x-response-time']
```

### 2. **Normalize Timestamps**
```typescript
normalizeTimestamps: true,
timestampFields: ['created_at', 'updated_at']
```

### 3. **Handle Array Order**
```typescript
compareOrder: false // If order doesn't matter
```

### 4. **Use Tolerance for Numbers**
```typescript
tolerance: 0.01 // For floating point comparisons
```

### 5. **Log Detailed Reports**
```typescript
const report = await ApiComparisonUtils.getComparisonReport(php, node);
console.log(report);
```

---

## 🚨 Troubleshooting

### Issue: Tests fail due to timestamp differences

**Solution:**
```typescript
normalizeTimestamps: true,
timestampFields: ['created_at', 'updated_at']
```

### Issue: Headers don't match

**Solution:**
```typescript
ignoreHeaders: ['date', 'x-request-id', 'server']
```

### Issue: Arrays in different order

**Solution:**
```typescript
compareOrder: false
```

### Issue: Numeric precision differences

**Solution:**
```typescript
tolerance: 0.01
```

---

## 📊 Test Results

### Success Example

```
✅ SUCCESS: PHP and Node.js responses match!
```

### Failure Example

```
❌ MISMATCH: Found differences between PHP and Node.js responses

Total differences: 3

Differences by type:
  - status: 1
  - field_value: 2

1. [STATUS] status: Status codes don't match: PHP=200, Node=404
2. [FIELD_VALUE] name: Value mismatch: PHP="John", Node="Jane"
3. [FIELD_VALUE] age: Numeric value mismatch: PHP=30, Node=31
```

---

## 🎯 Summary

✅ **Response Matching** - Fully supported  
✅ **Header Comparison** - Configurable  
✅ **Body Comparison** - Deep comparison  
✅ **Field Validation** - Comprehensive  
✅ **Detailed Reports** - Full visibility  
🔄 **Internal API Calls** - Can be extended  
🔄 **SQL Query Matching** - Can be extended  

---

## 📞 Next Steps

1. **Set up environment variables** for your API endpoints
2. **Run the example test** for app_bootstrap API
3. **Customize comparison options** for your specific needs
4. **Extend the framework** for internal calls and SQL queries if needed
5. **Integrate into CI/CD** for continuous comparison testing

---

**Ready to test your API migration!** 🚀

