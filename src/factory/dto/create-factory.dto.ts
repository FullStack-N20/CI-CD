import { IsString, IsNumber, IsBoolean, IsOptional, MinLength, MaxLength, Min } from 'class-validator';

export class CreateFactoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  location: string;

  @IsNumber()
  @Min(0)
  capacity: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
