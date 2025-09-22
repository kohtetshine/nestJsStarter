import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'newuser@example.com' })
  email!: string;

  @ApiProperty({ example: 'Jane Doe', nullable: true })
  name!: string | null;

  @ApiProperty({ example: '2025-01-01T12:00:00.000Z' })
  createdAt!: string;
}
