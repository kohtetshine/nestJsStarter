import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { Transporter } from './mail.transporter';

@Module({
  providers: [MailService, Transporter],
  exports: [MailService],
})
export class MailModule {}
