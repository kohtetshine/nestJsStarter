import { ApiProperty } from '@nestjs/swagger';

export class ExampleRequestDto {
  @ApiProperty({ example: 'john@example.com' })
  email!: string;
}

