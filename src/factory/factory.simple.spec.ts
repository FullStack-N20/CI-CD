import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { FactoryService } from './factory.service';
import { Factory } from './entities/factory.entity';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';

// Mock repository with basic functionality
const createMockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
});

describe('FactoryService - Database Operations', () => {
  let service: FactoryService;
  let repository: Repository<Factory>;

  const mockFactory: Factory = {
    id: 1,
    name: 'Test Factory',
    location: 'Test Location',
    capacity: 100,
    isActive: true,
    employees: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepo = createMockRepository();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FactoryService,
        {
          provide: getRepositoryToken(Factory),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<FactoryService>(FactoryService);
    repository = module.get<Repository<Factory>>(getRepositoryToken(Factory));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Database Integration Simulation', () => {
    it('should create a factory with database save', async () => {
      const createFactoryDto: CreateFactoryDto = {
        name: 'Test Factory',
        location: 'Test Location',
        capacity: 100,
        isActive: true,
      };

      // Simulate database behavior
      (repository.create as jest.Mock).mockReturnValue(mockFactory);
      (repository.save as jest.Mock).mockResolvedValue(mockFactory);

      const result = await service.create(createFactoryDto);

      expect(repository.create).toHaveBeenCalledWith(createFactoryDto);
      expect(repository.save).toHaveBeenCalledWith(mockFactory);
      expect(result).toEqual(mockFactory);
    });

    it('should find all factories with relations', async () => {
      const factories = [mockFactory];
      (repository.find as jest.Mock).mockResolvedValue(factories);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['employees'],
      });
      expect(result).toEqual(factories);
    });

    it('should find one factory with relations', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockFactory);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['employees'],
      });
      expect(result).toEqual(mockFactory);
    });

    it('should update factory with proper database calls', async () => {
      const updateFactoryDto: UpdateFactoryDto = {
        name: 'Updated Factory',
      };
      const updatedFactory = { ...mockFactory, ...updateFactoryDto };

      (repository.findOne as jest.Mock).mockResolvedValue(mockFactory);
      (repository.save as jest.Mock).mockResolvedValue(updatedFactory);

      const result = await service.update(1, updateFactoryDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['employees'],
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateFactoryDto),
      );
      expect(result).toEqual(updatedFactory);
    });

    it('should remove factory with proper database calls', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockFactory);
      (repository.remove as jest.Mock).mockResolvedValue(mockFactory);

      await service.remove(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['employees'],
      });
      expect(repository.remove).toHaveBeenCalledWith(mockFactory);
    });

    it('should handle database errors properly', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['employees'],
      });
    });
  });
});
