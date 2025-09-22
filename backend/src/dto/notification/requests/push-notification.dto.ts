export class PushNotificationDto {
  deviceTokens!: string[];
  title!: string;
  message!: string;
  image?: string;
}

