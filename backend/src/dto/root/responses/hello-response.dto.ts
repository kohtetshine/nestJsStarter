import { ApiProperty } from '@nestjs/swagger';

export class HelloResponseDto {
  @ApiProperty({ example: 'Hello from NestJS!' })
  message!: string;
}
