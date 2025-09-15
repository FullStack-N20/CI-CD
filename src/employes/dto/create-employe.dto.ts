import { IsString, IsNumber, IsEmail, MinLength, MaxLength, IsPositive } from 'class-validator'

export class CreateEmployeDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  position: string;

  @IsNumber()
  @IsPositive()
  salary: number;

  @IsNumber()
  @IsPositive()
  factoryId: number;
}
