import { IsString } from 'class-validator';

export class TestPushNotificationDto {
  @IsString()
  deviceToken!: string;
}

