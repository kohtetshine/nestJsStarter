import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TestPushNotificationDto } from '../dto/notification/requests/test-push-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('healthcheck')
  async testPushNotification(@Body() dto: TestPushNotificationDto) {
    return this.notificationService.testPushNotification(dto.deviceToken);
  }
}
