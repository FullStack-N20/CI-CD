import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { Employe } from './entities/employe.entity';

@Injectable()
export class EmployesService {
  constructor(
    @InjectRepository(Employe)
    private readonly employeeRepository: Repository<Employe>,
  ) {}

  async create(createEmployeDto: CreateEmployeDto): Promise<Employe> {
    const employee = this.employeeRepository.create(createEmployeDto);
    return await this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employe[]> {
    return await this.employeeRepository.find({
      relations: ['factory'],
    });
  }

  async findOne(id: number): Promise<Employe> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['factory'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async findByFactory(factoryId: number): Promise<Employe[]> {
    return await this.employeeRepository.find({
      where: { factoryId },
      relations: ['factory'],
    });
  }

  async update(id: number, updateEmployeDto: UpdateEmployeDto): Promise<Employe> {
    const employee = await this.findOne(id);
    Object.assign(employee, updateEmployeDto);
    return await this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }
}
