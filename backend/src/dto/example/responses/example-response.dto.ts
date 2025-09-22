import { ApiProperty } from '@nestjs/swagger';

export class ExampleResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'john@example.com' })
  email!: string;
}
