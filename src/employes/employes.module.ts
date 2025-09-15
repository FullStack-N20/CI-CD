import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployesService } from './employes.service';
import { EmployesController } from './employes.controller';
import { Employe } from './entities/employe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employe])],
  controllers: [EmployesController],
  providers: [EmployesService],
  exports: [EmployesService],
})
export class EmployesModule {}
