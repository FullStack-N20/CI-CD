# Factory and Employee CRUD System

## Summary

I have successfully created a complete Factory and Employee CRUD system with TypeORM, including:

### Entities Created:
1. **Factory Entity** (4-5 fields):
   - id (Primary Key)
   - name (string, max 100 chars)
   - location (string, max 200 chars)
   - capacity (integer, minimum 0)
   - isActive (boolean, default true)
   - employees (One-to-Many relationship)
   - createdAt/updatedAt (timestamps)

2. **Employee Entity** (5 fields):
   - id (Primary Key)
   - firstName (string, max 100 chars)
   - lastName (string, max 100 chars)
   - email (string, max 150 chars, unique)
   - position (string, max 50 chars)
   - salary (decimal, precision 10, scale 2)
   - factoryId (foreign key)
   - factory (Many-to-One relationship)
   - createdAt/updatedAt (timestamps)

### Features Implemented:
- Complete CRUD operations for both entities
- TypeORM integration with SQLite database
- Data validation using class-validator
- Relationships between Factory and Employee
- Cascade deletion (deleting factory removes employees)

### Testing Suite:
1. **Unit Tests**: Complete unit tests for both services with mocked repositories
2. **Integration Tests**: Database integration tests using in-memory SQLite
3. **E2E Tests**: Full end-to-end API testing

### API Endpoints:

#### Factory:
- `POST /factory` - Create factory
- `GET /factory` - Get all factories
- `GET /factory/:id` - Get factory by ID
- `PATCH /factory/:id` - Update factory
- `DELETE /factory/:id` - Delete factory

#### Employee:
- `POST /employes` - Create employee
- `GET /employes` - Get all employees
- `GET /employes/:id` - Get employee by ID
- `GET /employes/factory/:factoryId` - Get employees by factory
- `PATCH /employes/:id` - Update employee
- `DELETE /employes/:id` - Delete employee

### To Run Tests:

```bash
# Unit tests
npm test

# Integration tests
npm test -- --testPathPattern=integration

# E2E tests
npm run test:e2e

# All tests with coverage
npm run test:cov
```

### To Start Application:

```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev
```

The application will create a SQLite database file and automatically sync the schema.
