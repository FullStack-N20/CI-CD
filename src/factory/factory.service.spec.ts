import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { FactoryService } from './factory.service';
import { Factory } from './entities/factory.entity';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';

describe('FactoryService', () => {
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

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FactoryService,
        {
          provide: getRepositoryToken(Factory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FactoryService>(FactoryService);
    repository = module.get<Repository<Factory>>(getRepositoryToken(Factory));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a factory', async () => {
      const createFactoryDto: CreateFactoryDto = {
        name: 'Test Factory',
        location: 'Test Location',
        capacity: 100,
        isActive: true,
      };

      mockRepository.create.mockReturnValue(mockFactory);
      mockRepository.save.mockResolvedValue(mockFactory);

      const result = await service.create(createFactoryDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createFactoryDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockFactory);
      expect(result).toEqual(mockFactory);
    });
  });

  describe('findAll', () => {
    it('should return an array of factories', async () => {
      const factories = [mockFactory];
      mockRepository.find.mockResolvedValue(factories);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['employees'],
      });
      expect(result).toEqual(factories);
    });
  });

  describe('findOne', () => {
    it('should return a factory by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockFactory);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['employees'],
      });
      expect(result).toEqual(mockFactory);
    });

    it('should throw NotFoundException when factory not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['employees'],
      });
    });
  });

  describe('update', () => {
    it('should update a factory', async () => {
      const updateFactoryDto: UpdateFactoryDto = {
        name: 'Updated Factory',
      };
      const updatedFactory = { ...mockFactory, ...updateFactoryDto };

      mockRepository.findOne.mockResolvedValue(mockFactory);
      mockRepository.save.mockResolvedValue(updatedFactory);

      const result = await service.update(1, updateFactoryDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['employees'],
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateFactoryDto),
      );
      expect(result).toEqual(updatedFactory);
    });

    it('should throw NotFoundException when factory not found for update', async () => {
      const updateFactoryDto: UpdateFactoryDto = {
        name: 'Updated Factory',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateFactoryDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a factory', async () => {
      mockRepository.findOne.mockResolvedValue(mockFactory);
      mockRepository.remove.mockResolvedValue(mockFactory);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['employees'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockFactory);
    });

    it('should throw NotFoundException when factory not found for removal', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
