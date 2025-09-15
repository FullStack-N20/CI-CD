import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import { Factory } from './entities/factory.entity';

@Injectable()
export class FactoryService {
  constructor(
    @InjectRepository(Factory)
    private readonly factoryRepository: Repository<Factory>,
  ) {}

  async create(createFactoryDto: CreateFactoryDto): Promise<Factory> {
    const factory = this.factoryRepository.create(createFactoryDto);
    return await this.factoryRepository.save(factory);
  }

  async findAll(): Promise<Factory[]> {
    return await this.factoryRepository.find({
      relations: ['employees'],
    });
  }

  async findOne(id: number): Promise<Factory> {
    const factory = await this.factoryRepository.findOne({
      where: { id },
      relations: ['employees'],
    });

    if (!factory) {
      throw new NotFoundException(`Factory with ID ${id} not found`);
    }

    return factory;
  }

  async update(id: number, updateFactoryDto: UpdateFactoryDto): Promise<Factory> {
    const factory = await this.findOne(id);
    Object.assign(factory, updateFactoryDto);
    return await this.factoryRepository.save(factory);
  }

  async remove(id: number): Promise<void> {
    const factory = await this.findOne(id);
    await this.factoryRepository.remove(factory);
  }
}
