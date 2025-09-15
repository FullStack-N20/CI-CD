import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Employe } from '../../employes/entities/employe.entity';

@Entity('factories')
export class Factory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 200 })
  location: string;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Employe, employee => employee.factory)
  employees: Employe[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
