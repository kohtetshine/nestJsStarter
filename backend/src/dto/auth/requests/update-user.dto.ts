import { IsEmail, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  userId!: number;

  @ApiProperty({ example: 'updated@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}

