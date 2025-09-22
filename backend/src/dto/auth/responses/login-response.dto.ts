import { ApiProperty } from '@nestjs/swagger';
import { UserSummaryDto } from './user-summary.dto';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token!: string;

  @ApiProperty({ type: UserSummaryDto })
  user!: UserSummaryDto;
}
