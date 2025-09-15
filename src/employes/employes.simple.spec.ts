import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EmployesService } from './employes.service';
import { Employe } from './entities/employe.entity';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';

// Mock repository with basic functionality
const createMockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
});

describe('EmployesService - Database Operations', () => {
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

  beforeEach(async () => {
    const mockRepo = createMockRepository();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployesService,
        {
          provide: getRepositoryToken(Employe),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<EmployesService>(EmployesService);
    repository = module.get<Repository<Employe>>(getRepositoryToken(Employe));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Database Integration Simulation', () => {
    it('should create an employee with database save', async () => {
      const createEmployeeDto: CreateEmployeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        position: 'Developer',
        salary: 50000,
        factoryId: 1,
      };

      // Simulate database behavior
      (repository.create as jest.Mock).mockReturnValue(mockEmployee);
      (repository.save as jest.Mock).mockResolvedValue(mockEmployee);

      const result = await service.create(createEmployeeDto);

      expect(repository.create).toHaveBeenCalledWith(createEmployeeDto);
      expect(repository.save).toHaveBeenCalledWith(mockEmployee);
      expect(result).toEqual(mockEmployee);
    });

    it('should find all employees with factory relations', async () => {
      const employees = [mockEmployee];
      (repository.find as jest.Mock).mockResolvedValue(employees);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['factory'],
      });
      expect(result).toEqual(employees);
    });

    it('should find employees by factory ID', async () => {
      const employees = [mockEmployee];
      (repository.find as jest.Mock).mockResolvedValue(employees);

      const result = await service.findByFactory(1);

      expect(repository.find).toHaveBeenCalledWith({
        where: { factoryId: 1 },
        relations: ['factory'],
      });
      expect(result).toEqual(employees);
    });

    it('should find one employee with factory relation', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockEmployee);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['factory'],
      });
      expect(result).toEqual(mockEmployee);
    });

    it('should update employee with proper database calls', async () => {
      const updateEmployeeDto: UpdateEmployeDto = {
        firstName: 'Jane',
        salary: 55000,
      };
      const updatedEmployee = { ...mockEmployee, ...updateEmployeeDto };

      (repository.findOne as jest.Mock).mockResolvedValue(mockEmployee);
      (repository.save as jest.Mock).mockResolvedValue(updatedEmployee);

      const result = await service.update(1, updateEmployeeDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['factory'],
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateEmployeeDto),
      );
      expect(result).toEqual(updatedEmployee);
    });

    it('should remove employee with proper database calls', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockEmployee);
      (repository.remove as jest.Mock).mockResolvedValue(mockEmployee);

      await service.remove(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['factory'],
      });
      expect(repository.remove).toHaveBeenCalledWith(mockEmployee);
    });

    it('should handle database errors properly', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['factory'],
      });
    });
  });
});
