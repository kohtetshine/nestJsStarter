import { EmailNotificationDto } from './email-notification.dto';
import { PushNotificationDto } from './push-notification.dto';

export class SendNotificationDto {
  email?: EmailNotificationDto;
  push?: PushNotificationDto;
}

