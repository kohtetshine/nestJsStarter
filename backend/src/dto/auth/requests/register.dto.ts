import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

