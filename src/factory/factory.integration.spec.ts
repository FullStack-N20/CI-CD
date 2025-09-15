import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FactoryService } from './factory.service';
import { Factory } from './entities/factory.entity';
import { Employe } from '../employes/entities/employe.entity';

describe('FactoryService Integration', () => {
  let service: FactoryService;
  let repository: Repository<Factory>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT) || 5432,
          username: process.env.DATABASE_USERNAME || 'postgres',
          password: process.env.DATABASE_PASSWORD || 'postgres',
          database: process.env.DATABASE_NAME || 'test_db',
          entities: [Factory, Employe],
          synchronize: true,
          logging: false,
          dropSchema: true, // Clean database for each test run
        }),
        TypeOrmModule.forFeature([Factory]),
      ],
      providers: [FactoryService],
    }).compile();

    service = module.get<FactoryService>(FactoryService);
    repository = module.get<Repository<Factory>>(getRepositoryToken(Factory));
  }, 30000);

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  beforeEach(async () => {
    await repository.clear();
  });

  describe('create', () => {
    it('should create and save a factory to database', async () => {
      const createFactoryDto = {
        name: 'Integration Test Factory',
        location: 'Test City',
        capacity: 200,
        isActive: true,
      };

      const result = await service.create(createFactoryDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(createFactoryDto.name);
      expect(result.location).toBe(createFactoryDto.location);
      expect(result.capacity).toBe(createFactoryDto.capacity);
      expect(result.isActive).toBe(createFactoryDto.isActive);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();

      // Verify it was saved to database
      const saved = await repository.findOne({ where: { id: result.id } });
      expect(saved).toBeDefined();
      expect(saved.name).toBe(createFactoryDto.name);
    });
  });

  describe('findAll', () => {
    it('should return all factories from database', async () => {
      // Create test data
      const factory1 = await service.create({
        name: 'Factory 1',
        location: 'Location 1',
        capacity: 100,
        isActive: true,
      });

      const factory2 = await service.create({
        name: 'Factory 2',
        location: 'Location 2',
        capacity: 150,
        isActive: false,
      });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result.map(f => f.id)).toContain(factory1.id);
      expect(result.map(f => f.id)).toContain(factory2.id);
    });
  });

  describe('findOne', () => {
    it('should return a specific factory from database', async () => {
      const created = await service.create({
        name: 'Test Factory',
        location: 'Test Location',
        capacity: 100,
        isActive: true,
      });

      const result = await service.findOne(created.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.name).toBe('Test Factory');
    });

    it('should throw NotFoundException for non-existent factory', async () => {
      await expect(service.findOne(999)).rejects.toThrow('Factory with ID 999 not found');
    });
  });

  describe('update', () => {
    it('should update factory in database', async () => {
      const created = await service.create({
        name: 'Original Factory',
        location: 'Original Location',
        capacity: 100,
        isActive: true,
      });

      const updateDto = {
        name: 'Updated Factory',
        capacity: 200,
      };

      const result = await service.update(created.id, updateDto);

      expect(result.name).toBe('Updated Factory');
      expect(result.capacity).toBe(200);
      expect(result.location).toBe('Original Location'); // Should remain unchanged

      // Verify update was persisted
      const updated = await repository.findOne({ where: { id: created.id } });
      expect(updated.name).toBe('Updated Factory');
      expect(updated.capacity).toBe(200);
    });
  });

  describe('remove', () => {
    it('should remove factory from database', async () => {
      const created = await service.create({
        name: 'To Be Deleted',
        location: 'Test Location',
        capacity: 100,
        isActive: true,
      });

      await service.remove(created.id);

      // Verify it was removed
      const deleted = await repository.findOne({ where: { id: created.id } });
      expect(deleted).toBeNull();
    });
  });
});
