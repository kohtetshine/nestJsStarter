export class EmailNotificationDto {
  from!: string;
  to!: string;
  subject!: string;
  text?: string;
  templatePath?: string;
  templateData?: Record<string, any>;
}

