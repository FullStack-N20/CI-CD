import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Factory } from '../src/factory/entities/factory.entity';
import { Employe } from '../src/employes/entities/employe.entity';

describe('Factory and Employee (e2e)', () => {
  let app: INestApplication;
  let factoryId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Factory, Employe],
          synchronize: true,
          logging: false,
        }),
        AppModule,
      ],
    })
      .overrideModule(AppModule)
      .useModule(
        Test.createTestingModule({
          imports: [
            TypeOrmModule.forRoot({
              type: 'sqlite',
              database: ':memory:',
              entities: [Factory, Employe],
              synchronize: true,
              logging: false,
            }),
          ],
        }).compile(),
      )
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Factory CRUD (e2e)', () => {
    it('/factory (POST) - should create a factory', () => {
      const createFactoryDto = {
        name: 'E2E Test Factory',
        location: 'E2E Test Location',
        capacity: 100,
        isActive: true,
      };

      return request(app.getHttpServer())
        .post('/factory')
        .send(createFactoryDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createFactoryDto.name);
          expect(res.body.location).toBe(createFactoryDto.location);
          expect(res.body.capacity).toBe(createFactoryDto.capacity);
          expect(res.body.isActive).toBe(createFactoryDto.isActive);
          factoryId = res.body.id;
        });
    });

    it('/factory (POST) - should validate factory data', () => {
      const invalidFactoryDto = {
        name: '', // Invalid: too short
        location: 'X', // Invalid: too short
        capacity: -10, // Invalid: negative
      };

      return request(app.getHttpServer())
        .post('/factory')
        .send(invalidFactoryDto)
        .expect(400);
    });

    it('/factory (GET) - should get all factories', () => {
      return request(app.getHttpServer())
        .get('/factory')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/factory/:id (GET) - should get factory by id', () => {
      return request(app.getHttpServer())
        .get(`/factory/${factoryId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(factoryId);
          expect(res.body.name).toBe('E2E Test Factory');
        });
    });

    it('/factory/:id (GET) - should return 404 for non-existent factory', () => {
      return request(app.getHttpServer())
        .get('/factory/999')
        .expect(404);
    });

    it('/factory/:id (PATCH) - should update factory', () => {
      const updateFactoryDto = {
        name: 'Updated E2E Factory',
        capacity: 150,
      };

      return request(app.getHttpServer())
        .patch(`/factory/${factoryId}`)
        .send(updateFactoryDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateFactoryDto.name);
          expect(res.body.capacity).toBe(updateFactoryDto.capacity);
          expect(res.body.location).toBe('E2E Test Location'); // Should remain unchanged
        });
    });
  });

  describe('Employee CRUD (e2e)', () => {
    let employeeId: number;

    it('/employes (POST) - should create an employee', () => {
      const createEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe.e2e@example.com',
        position: 'Developer',
        salary: 50000,
        factoryId: factoryId,
      };

      return request(app.getHttpServer())
        .post('/employes')
        .send(createEmployeeDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.firstName).toBe(createEmployeeDto.firstName);
          expect(res.body.lastName).toBe(createEmployeeDto.lastName);
          expect(res.body.email).toBe(createEmployeeDto.email);
          expect(res.body.position).toBe(createEmployeeDto.position);
          expect(res.body.salary).toBe(createEmployeeDto.salary);
          expect(res.body.factoryId).toBe(factoryId);
          employeeId = res.body.id;
        });
    });

    it('/employes (POST) - should validate employee data', () => {
      const invalidEmployeeDto = {
        firstName: 'A', // Invalid: too short
        lastName: '', // Invalid: empty
        email: 'invalid-email', // Invalid: not email format
        position: 'X', // Invalid: too short
        salary: -1000, // Invalid: negative
        factoryId: 'not-a-number', // Invalid: not a number
      };

      return request(app.getHttpServer())
        .post('/employes')
        .send(invalidEmployeeDto)
        .expect(400);
    });

    it('/employes (GET) - should get all employees', () => {
      return request(app.getHttpServer())
        .get('/employes')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/employes/factory/:factoryId (GET) - should get employees by factory', () => {
      return request(app.getHttpServer())
        .get(`/employes/factory/${factoryId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.every(emp => emp.factoryId === factoryId)).toBe(true);
        });
    });

    it('/employes/:id (GET) - should get employee by id', () => {
      return request(app.getHttpServer())
        .get(`/employes/${employeeId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(employeeId);
          expect(res.body.firstName).toBe('John');
          expect(res.body.factory).toBeDefined();
          expect(res.body.factory.id).toBe(factoryId);
        });
    });

    it('/employes/:id (GET) - should return 404 for non-existent employee', () => {
      return request(app.getHttpServer())
        .get('/employes/999')
        .expect(404);
    });

    it('/employes/:id (PATCH) - should update employee', () => {
      const updateEmployeeDto = {
        firstName: 'Jane',
        salary: 55000,
      };

      return request(app.getHttpServer())
        .patch(`/employes/${employeeId}`)
        .send(updateEmployeeDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.firstName).toBe(updateEmployeeDto.firstName);
          expect(res.body.salary).toBe(updateEmployeeDto.salary);
          expect(res.body.lastName).toBe('Doe'); // Should remain unchanged
        });
    });

    it('/employes/:id (DELETE) - should delete employee', () => {
      return request(app.getHttpServer())
        .delete(`/employes/${employeeId}`)
        .expect(200);
    });

    it('/employes/:id (GET) - should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/employes/${employeeId}`)
        .expect(404);
    });
  });

  describe('Factory CASCADE deletion (e2e)', () => {
    it('/factory/:id (DELETE) - should delete factory and cascade to employees', () => {
      return request(app.getHttpServer())
        .delete(`/factory/${factoryId}`)
        .expect(200);
    });

    it('/factory/:id (GET) - should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/factory/${factoryId}`)
        .expect(404);
    });
  });
});
