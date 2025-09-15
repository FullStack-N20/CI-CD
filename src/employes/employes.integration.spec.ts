import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployesService } from './employes.service';
import { Employe } from './entities/employe.entity';
import { Factory } from '../factory/entities/factory.entity';

describe('EmployesService Integration', () => {
  let service: EmployesService;
  let employeeRepository: Repository<Employe>;
  let factoryRepository: Repository<Factory>;
  let module: TestingModule;
  let testFactory: Factory;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Factory, Employe],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([Employe, Factory]),
      ],
      providers: [EmployesService],
    }).compile();

    service = module.get<EmployesService>(EmployesService);
    employeeRepository = module.get<Repository<Employe>>(getRepositoryToken(Employe));
    factoryRepository = module.get<Repository<Factory>>(getRepositoryToken(Factory));
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await employeeRepository.clear();
    await factoryRepository.clear();
    
    // Create a test factory for employee relationships
    testFactory = await factoryRepository.save({
      name: 'Test Factory',
      location: 'Test Location',
      capacity: 100,
      isActive: true,
    });
  });

  describe('create', () => {
    it('should create and save an employee to database', async () => {
      const createEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        position: 'Developer',
        salary: 50000,
        factoryId: testFactory.id,
      };

      const result = await service.create(createEmployeeDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.firstName).toBe(createEmployeeDto.firstName);
      expect(result.lastName).toBe(createEmployeeDto.lastName);
      expect(result.email).toBe(createEmployeeDto.email);
      expect(result.position).toBe(createEmployeeDto.position);
      expect(result.salary).toBe(createEmployeeDto.salary);
      expect(result.factoryId).toBe(testFactory.id);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();

      // Verify it was saved to database
      const saved = await employeeRepository.findOne({ where: { id: result.id } });
      expect(saved).toBeDefined();
      expect(saved.email).toBe(createEmployeeDto.email);
    });
  });

  describe('findAll', () => {
    it('should return all employees from database', async () => {
      // Create test data
      const employee1 = await service.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        position: 'Developer',
        salary: 50000,
        factoryId: testFactory.id,
      });

      const employee2 = await service.create({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        position: 'Manager',
        salary: 60000,
        factoryId: testFactory.id,
      });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result.map(e => e.id)).toContain(employee1.id);
      expect(result.map(e => e.id)).toContain(employee2.id);
    });
  });

  describe('findOne', () => {
    it('should return a specific employee from database', async () => {
      const created = await service.create({
        firstName: 'Test',
        lastName: 'Employee',
        email: 'test@example.com',
        position: 'Tester',
        salary: 45000,
        factoryId: testFactory.id,
      });

      const result = await service.findOne(created.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.firstName).toBe('Test');
      expect(result.factory).toBeDefined();
      expect(result.factory.id).toBe(testFactory.id);
    });

    it('should throw NotFoundException for non-existent employee', async () => {
      await expect(service.findOne(999)).rejects.toThrow('Employee with ID 999 not found');
    });
  });

  describe('findByFactory', () => {
    it('should return employees for a specific factory', async () => {
      // Create another factory
      const anotherFactory = await factoryRepository.save({
        name: 'Another Factory',
        location: 'Another Location',
        capacity: 50,
        isActive: true,
      });

      // Create employees for different factories
      await service.create({
        firstName: 'Factory1',
        lastName: 'Employee1',
        email: 'f1e1@example.com',
        position: 'Worker',
        salary: 40000,
        factoryId: testFactory.id,
      });

      await service.create({
        firstName: 'Factory1',
        lastName: 'Employee2',
        email: 'f1e2@example.com',
        position: 'Worker',
        salary: 41000,
        factoryId: testFactory.id,
      });

      await service.create({
        firstName: 'Factory2',
        lastName: 'Employee1',
        email: 'f2e1@example.com',
        position: 'Worker',
        salary: 42000,
        factoryId: anotherFactory.id,
      });

      const result = await service.findByFactory(testFactory.id);

      expect(result).toHaveLength(2);
      expect(result.every(e => e.factoryId === testFactory.id)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update employee in database', async () => {
      const created = await service.create({
        firstName: 'Original',
        lastName: 'Name',
        email: 'original@example.com',
        position: 'Developer',
        salary: 50000,
        factoryId: testFactory.id,
      });

      const updateDto = {
        firstName: 'Updated',
        salary: 55000,
      };

      const result = await service.update(created.id, updateDto);

      expect(result.firstName).toBe('Updated');
      expect(result.salary).toBe(55000);
      expect(result.lastName).toBe('Name'); // Should remain unchanged

      // Verify update was persisted
      const updated = await employeeRepository.findOne({ where: { id: created.id } });
      expect(updated.firstName).toBe('Updated');
      expect(updated.salary).toBe(55000);
    });
  });

  describe('remove', () => {
    it('should remove employee from database', async () => {
      const created = await service.create({
        firstName: 'To Be',
        lastName: 'Deleted',
        email: 'delete@example.com',
        position: 'Temp',
        salary: 30000,
        factoryId: testFactory.id,
      });

      await service.remove(created.id);

      // Verify it was removed
      const deleted = await employeeRepository.findOne({ where: { id: created.id } });
      expect(deleted).toBeNull();
    });
  });
});
