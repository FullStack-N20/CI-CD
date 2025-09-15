import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EmployesService } from './employes.service';
import { Employe } from './entities/employe.entity';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';

describe('EmployesService', () => {
  let service: EmployesService;
  let repository: Repository<Employe>;

  const mockEmployee: Employe = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    position: 'Developer',
    salary: 50000,
    factoryId: 1,
    factory: null,
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
        EmployesService,
        {
          provide: getRepositoryToken(Employe),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EmployesService>(EmployesService);
    repository = module.get<Repository<Employe>>(getRepositoryToken(Employe));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an employee', async () => {
      const createEmployeeDto: CreateEmployeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        position: 'Developer',
        salary: 50000,
        factoryId: 1,
      };

      mockRepository.create.mockReturnValue(mockEmployee);
      mockRepository.save.mockResolvedValue(mockEmployee);

      const result = await service.create(createEmployeeDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createEmployeeDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockEmployee);
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      const employees = [mockEmployee];
      mockRepository.find.mockResolvedValue(employees);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['factory'],
      });
      expect(result).toEqual(employees);
    });
  });

  describe('findOne', () => {
    it('should return an employee by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmployee);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['factory'],
      });
      expect(result).toEqual(mockEmployee);
    });

    it('should throw NotFoundException when employee not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['factory'],
      });
    });
  });

  describe('findByFactory', () => {
    it('should return employees by factory ID', async () => {
      const employees = [mockEmployee];
      mockRepository.find.mockResolvedValue(employees);

      const result = await service.findByFactory(1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { factoryId: 1 },
        relations: ['factory'],
      });
      expect(result).toEqual(employees);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const updateEmployeeDto: UpdateEmployeDto = {
        firstName: 'Jane',
        salary: 55000,
      };
      const updatedEmployee = { ...mockEmployee, ...updateEmployeeDto };

      mockRepository.findOne.mockResolvedValue(mockEmployee);
      mockRepository.save.mockResolvedValue(updatedEmployee);

      const result = await service.update(1, updateEmployeeDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['factory'],
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateEmployeeDto),
      );
      expect(result).toEqual(updatedEmployee);
    });

    it('should throw NotFoundException when employee not found for update', async () => {
      const updateEmployeeDto: UpdateEmployeDto = {
        firstName: 'Jane',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateEmployeeDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmployee);
      mockRepository.remove.mockResolvedValue(mockEmployee);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['factory'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockEmployee);
    });

    it('should throw NotFoundException when employee not found for removal', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
