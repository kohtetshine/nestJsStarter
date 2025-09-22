import { IsEmail, IsString, MinLength, IsOptional, IsNumber, IsIn, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'newuser@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @MinLength(6)
  confirmPassword!: string;
}

export class GetUsersDto {
  @ApiProperty({ example: 10, description: 'Number of users per page', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ example: 1, description: 'Page number (1-based)', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ example: 'ASC', description: 'Order direction', enum: ['ASC', 'DESC'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: string = 'ASC';
}
