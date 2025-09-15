// Set default test database environment variables
process.env.DATABASE_TYPE = 'postgres';
process.env.DATABASE_HOST = 'localhost';
process.env.DATABASE_PORT = '5432';
process.env.DATABASE_USERNAME = 'postgres';
process.env.DATABASE_PASSWORD = 'postgres';
process.env.DATABASE_NAME = 'test_db';
process.env.NODE_ENV = 'test';

// Increase timeout for database operations
jest.setTimeout(30000);
