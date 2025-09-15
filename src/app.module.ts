import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FactoryModule } from './factory/factory.module';
import { EmployesModule } from './employes/employes.module';
import { Factory } from './factory/entities/factory.entity';
import { Employe } from './employes/entities/employe.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'database.postgres',
      entities: [Factory, Employe],
      synchronize: true, // Only for development
      logging: true,
    }),
    FactoryModule,
    EmployesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
