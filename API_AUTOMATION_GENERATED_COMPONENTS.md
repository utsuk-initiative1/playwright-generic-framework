# 🔌 API Automation - Generated Components

## Overview

When you select **API Automation** in the CLI or framework setup, the following complete API testing scaffold is automatically generated.

---

## 📁 Directory Structure Generated

```
framework/api/
├── core/                    # Core API framework classes
│   ├── BaseApiClient.ts     # Base HTTP client with retry logic
│   └── AuthProvider.ts      # Authentication providers
├── clients/                 # Domain-specific API clients
│   └── UsersClient.ts       # Example client (Users API)
├── utils/                   # Utility classes
│   ├── ApiAssertions.ts     # Reusable assertion methods
│   ├── ApiHelpers.ts        # Helper utilities
│   └── SchemaValidator.ts  # Schema validation
├── schemas/                 # JSON schemas
│   └── user.json           # Example JSON schema
├── index.ts                 # Centralized exports
└── README.md                # API framework documentation

tests/api/
└── users.spec.ts            # Sample API test file
```

---

## 🔧 Core Components Generated

### 1. **BaseApiClient.ts** - HTTP Client Foundation

**What it provides:**
- ✅ HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- ✅ Automatic retry logic with exponential backoff (1s → 2s → 4s → 8s)
- ✅ Configurable timeout settings
- ✅ Query parameter handling
- ✅ Request/response logging
- ✅ Error handling

**Key Features:**
```typescript
class BaseApiClient {
  // Methods automatically generated:
  - get(url, options?)      // GET request
  - post(url, body, options?)  // POST request
  - put(url, body, options?)   // PUT request
  - patch(url, body, options?) // PATCH request
  - delete(url, options?)      // DELETE request
  
  // Internal methods:
  - requestWithRetry()     // Retry logic with exponential backoff
  - init()                 // Initialize API context
  - dispose()              // Cleanup
}
```

**Retry Logic:**
- Default: 3 retry attempts
- Exponential backoff: 1s, 2s, 4s, 8s (max)
- Automatic retry on failures
- Configurable per request

---

### 2. **AuthProvider.ts** - Authentication Strategies

**What it provides:**
- ✅ **Bearer Token Authentication**
- ✅ **API Key Authentication**
- ✅ **Basic Authentication**
- ✅ Strategy pattern for extensibility

**Generated Classes:**

#### **BearerAuthProvider**
```typescript
// Automatically adds: Authorization: Bearer <token>
const auth = new BearerAuthProvider({
  getToken: () => process.env.API_TOKEN || ''
});
```

#### **ApiKeyAuthProvider**
```typescript
// Automatically adds: x-api-key: <key> (or custom header)
const auth = new ApiKeyAuthProvider({
  headerName: 'x-api-key',  // Optional, defaults to 'x-api-key'
  tokenProvider: { getToken: () => process.env.API_KEY || '' }
});
```

#### **BasicAuthProvider**
```typescript
// Automatically adds: Authorization: Basic <base64>
const auth = new BasicAuthProvider('username', 'password');
```

---

### 3. **UsersClient.ts** - Example Domain Client

**What it provides:**
- ✅ Complete CRUD operations example
- ✅ Query parameter support
- ✅ Extensible pattern for other APIs

**Generated Methods:**
```typescript
class UsersClient extends BaseApiClient {
  async getUser(userId: string)           // GET /users/:id
  async listUsers()                       // GET /users
  async createUser(userData)              // POST /users
  async updateUser(userId, userData)      // PUT /users/:id
  async deleteUser(userId)                // DELETE /users/:id
  async searchUsers(queryParams)          // GET /users?query=params
}
```

**Purpose:** 
- Shows how to extend `BaseApiClient`
- Provides working example
- Demonstrates best practices

---

### 4. **ApiAssertions.ts** - Reusable Assertion Utilities

**What it provides:**
- ✅ Status code validation
- ✅ Success/failure checks
- ✅ JSON structure validation
- ✅ Field existence checks
- ✅ Field value assertions
- ✅ Response time validation
- ✅ Array/object validation

**Generated Methods:**
```typescript
class ApiAssertions {
  static async assertStatus(response, expectedStatus)
  static async assertSuccess(response)
  static async assertJson(response)
  static async assertFieldExists(data, fieldPath)
  static async assertFieldValue(data, fieldPath, expectedValue)
  static async assertResponseTime(response, maxTimeMs)
  static async assertArray(data, minLength?)
  static async assertObject(data)
  static async assertError(response, expectedStatus?)
}
```

**Usage Example:**
```typescript
await ApiAssertions.assertStatus(response, 200);
await ApiAssertions.assertSuccess(response);
const data = await ApiAssertions.assertJson(response);
await ApiAssertions.assertFieldValue(data, 'name', 'John Doe');
```

---

### 5. **ApiHelpers.ts** - Helper Utilities

**What it provides:**
- ✅ Response data extraction
- ✅ Header management
- ✅ Response time calculation
- ✅ Query string building
- ✅ Pagination parsing
- ✅ Async operation polling

**Generated Methods:**
```typescript
class ApiHelpers {
  static async getJson<T>(response): Promise<T>
  static async getText(response): Promise<string>
  static getHeaders(response): Record<string, string>
  static getHeader(response, headerName): string | undefined
  static async getResponseTime(response): Promise<number>
  static isSuccess(response): boolean
  static getStatus(response): number
  static buildQueryString(params): string
  static parsePagination(data): PaginationInfo
  static async waitForCondition(condition, timeout, interval)
}
```

**Usage Example:**
```typescript
const data = await ApiHelpers.getJson(response);
const responseTime = await ApiHelpers.getResponseTime(response);
const query = ApiHelpers.buildQueryString({ page: 1, limit: 10 });
```

---

### 6. **SchemaValidator.ts** - Schema Validation

**What it provides:**
- ✅ JSON Schema validation structure
- ✅ Type checking
- ✅ Required field validation
- ✅ Property validation
- ✅ Extensible for full JSON Schema (Ajv integration)

**Generated Methods:**
```typescript
class SchemaValidator {
  static validateAgainstSchema(schema, data): ValidationResult
  static async validateResponse(response, schema): Promise<ValidationResult>
}
```

**Usage Example:**
```typescript
const result = SchemaValidator.validateAgainstSchema(userSchema, data);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

---

### 7. **user.json** - Example JSON Schema

**What it provides:**
- ✅ Example JSON Schema structure
- ✅ Type definitions
- ✅ Required fields specification
- ✅ Template for other schemas

**Generated Schema:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": ["string", "number"] },
    "name": { "type": "string" },
    "email": { "type": "string" }
  },
  "required": ["id", "name"],
  "additionalProperties": true
}
```

---

### 8. **index.ts** - Centralized Exports

**What it provides:**
- ✅ Single import point for all API utilities
- ✅ Clean imports
- ✅ Better organization

**Generated Exports:**
```typescript
export * from './core/BaseApiClient';
export * from './core/AuthProvider';
export * from './utils/ApiAssertions';
export * from './utils/ApiHelpers';
export * from './utils/SchemaValidator';
```

**Usage:**
```typescript
import { BaseApiClient, BearerAuthProvider, ApiAssertions } from './framework/api';
```

---

### 9. **README.md** - Complete Documentation

**What it provides:**
- ✅ Framework structure overview
- ✅ Usage examples
- ✅ Authentication guide
- ✅ Code samples
- ✅ Best practices

**Includes:**
- Setup instructions
- Code examples for all components
- Authentication examples
- Assertion examples
- Helper utility examples

---

### 10. **users.spec.ts** - Sample Test File

**What it provides:**
- ✅ Complete working test examples
- ✅ Demonstrates all features
- ✅ Best practices
- ✅ Ready-to-run tests

**Generated Test Scenarios:**
```typescript
test.describe('API: Users', () => {
  test('GET /users/:id returns a user')
  test('GET /users returns list of users')
  test('POST /users creates a new user')
  test('GET /users with query parameters')
})
```

**Features Demonstrated:**
- Client initialization
- API calls
- Assertions
- Response validation
- Query parameters
- Error handling

---

## 🎯 What You Get Out of the Box

### **Complete API Testing Framework**
- ✅ **10 files** automatically generated
- ✅ **5 directories** created
- ✅ **3 authentication strategies** ready to use
- ✅ **8+ assertion methods** available
- ✅ **9+ helper utilities** included
- ✅ **1 example client** (UsersClient)
- ✅ **1 sample test file** with 4 test scenarios
- ✅ **Complete documentation** (README.md)

### **Ready-to-Use Features**
- ✅ Retry logic with exponential backoff
- ✅ Multiple authentication methods
- ✅ Comprehensive assertions
- ✅ Schema validation structure
- ✅ Query parameter handling
- ✅ Response time tracking
- ✅ Error handling
- ✅ TypeScript support

---

## 🚀 How It's Generated

### **CLI Command**
```bash
playwright-framework
# Select: API Testing feature
# → All components auto-generated!
```

### **Manual Generation**
```bash
# If using enhanced CLI
node enhanced-cli.js
# Select API automation option
```

### **Generation Process**
1. Creates directory structure
2. Generates all core files
3. Creates example client
4. Generates utility classes
5. Creates sample tests
6. Generates documentation

---

## 📊 Summary of Generated Components

| Component | Files | Purpose |
|-----------|-------|---------|
| **Core** | 2 | BaseApiClient, AuthProvider |
| **Clients** | 1 | Example domain client (UsersClient) |
| **Utils** | 3 | Assertions, Helpers, SchemaValidator |
| **Schemas** | 1 | Example JSON schema |
| **Tests** | 1 | Sample test file |
| **Docs** | 2 | README, index.ts |
| **Total** | **10 files** | Complete API framework |

---

## 💡 Key Benefits

### **1. Zero Setup Time**
- Everything generated automatically
- No manual file creation needed
- Production-ready code

### **2. Consistent Patterns**
- Standardized structure
- Reusable components
- Best practices included

### **3. Extensible**
- Easy to add new clients
- Customizable authentication
- Extendable utilities

### **4. Type-Safe**
- Full TypeScript support
- Type definitions included
- IntelliSense support

### **5. Well-Documented**
- Complete README
- Code examples
- Usage patterns

---

## 🎯 Next Steps After Generation

1. **Customize Clients**
   - Create domain-specific clients (ProductsClient, OrdersClient, etc.)
   - Extend BaseApiClient for your APIs

2. **Add Schemas**
   - Create JSON schemas for your API responses
   - Use SchemaValidator for validation

3. **Write Tests**
   - Use generated sample as template
   - Add your API test scenarios

4. **Configure Authentication**
   - Set up your auth providers
   - Add tokens/keys to environment

5. **Run Tests**
   ```bash
   npm run test:api
   ```

---

## 📝 Example: What Gets Generated

### **Before Generation:**
```
framework/
└── (no API folder)
```

### **After Generation:**
```
framework/api/
├── core/
│   ├── BaseApiClient.ts      ✅ Generated
│   └── AuthProvider.ts       ✅ Generated
├── clients/
│   └── UsersClient.ts        ✅ Generated
├── utils/
│   ├── ApiAssertions.ts     ✅ Generated
│   ├── ApiHelpers.ts         ✅ Generated
│   └── SchemaValidator.ts   ✅ Generated
├── schemas/
│   └── user.json             ✅ Generated
├── index.ts                  ✅ Generated
└── README.md                 ✅ Generated

tests/api/
└── users.spec.ts             ✅ Generated
```

**Total: 10 files + 5 directories = Complete API Framework**

---

## ✅ Summary

**When you select API Automation, you get:**

1. ✅ **BaseApiClient** - HTTP client with retry logic
2. ✅ **3 Auth Providers** - Bearer, API Key, Basic
3. ✅ **Example Client** - UsersClient with CRUD operations
4. ✅ **8+ Assertion Methods** - Comprehensive validation
5. ✅ **9+ Helper Utilities** - Response handling
6. ✅ **Schema Validator** - JSON schema validation structure
7. ✅ **Sample Tests** - 4 working test scenarios
8. ✅ **Complete Documentation** - README with examples
9. ✅ **TypeScript Support** - Full type safety
10. ✅ **Production-Ready Code** - Enterprise-grade quality

**All automatically generated in seconds!** 🚀

