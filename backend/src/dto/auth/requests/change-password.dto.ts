import { IsString, MinLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ChangePasswordDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  userId!: number;

  @ApiProperty({ example: 'newSecret123' })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}

