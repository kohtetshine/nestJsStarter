import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'John Doe', nullable: true })
  name!: string | null;
}
