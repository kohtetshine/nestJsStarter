import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { SendNotificationDto } from '../dto/notification/requests/send-notification.dto';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly firebaseApp?: admin.app.App;

  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    if (projectId && privateKey && clientEmail) {
      const adminConfig: admin.ServiceAccount = {
        projectId,
        privateKey,
        clientEmail,
      } as admin.ServiceAccount;
      if (!admin.apps.length) {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(adminConfig),
        });
      } else {
        this.firebaseApp = admin.app();
      }
      this.logger.log('Firebase Admin initialized for push notifications.');
    } else {
      this.logger.warn(
        'Firebase Admin env vars not set; push notifications are disabled.',
      );
    }
  }

  async sendNotification(dto: SendNotificationDto) {
    try {
      const promises: Promise<any>[] = [];

      if (dto.email) {
        const emailPromise = this.mailService.sendMail({
          from: dto.email.from,
          to: dto.email.to,
          subject: dto.email.subject,
          text: dto.email.text,
          templatePath: dto.email.templatePath,
          templateData: dto.email.templateData,
        });
        promises.push(emailPromise);
      }

      if (dto.push) {
        if (!this.firebaseApp) {
          this.logger.warn('Push requested but Firebase is not configured.');
          throw new Error('Push notification not configured on server');
        }
        const push = dto.push;
        push.deviceTokens.forEach((deviceToken) => {
          const message: admin.messaging.Message = {
            token: deviceToken,
            notification: {
              title: push.title,
              body: push.message,
              imageUrl: push.image,
            },
          };

          const pushPromise = (this.firebaseApp as admin.app.App)
            .messaging()
            .send(message)
            .then((response) => {
              this.logger.debug(
                `Successfully sent push notification: ${response}`,
              );
              return response;
            })
            .catch((error) => {
              this.logger.error('Error sending push notification:', error);
              throw error;
            });

          promises.push(pushPromise);
        });
      }

      const results = await Promise.allSettled(promises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          this.logger.debug(
            `Notification ${index + 1} sent successfully:`,
            (result as PromiseFulfilledResult<any>).value,
          );
        } else {
          this.logger.error(
            `Notification ${index + 1} failed:`,
            (result as PromiseRejectedResult).reason,
          );
        }
      });

      return {
        message: 'Notifications processed',
        results: results.map((result) => ({
          status: result.status,
          ...(result.status === 'fulfilled'
            ? { value: (result as PromiseFulfilledResult<any>).value }
            : { error: (result as PromiseRejectedResult).reason }),
        })),
      };
    } catch (error) {
      this.logger.error('Error in sendNotification:', error);
      throw error;
    }
  }

  async testPushNotification(deviceToken: string) {
    try {
      if (!this.firebaseApp) {
        throw new Error('Push notification not configured on server');
      }
      const message: admin.messaging.Message = {
        token: deviceToken,
        notification: {
          title: 'Test Notification',
          body: 'This is a test push notification',
        },
      };

      const response = await this.firebaseApp.messaging().send(message);
      this.logger.debug(`Successfully sent test notification: ${response}`);

      return {
        message: 'Test notification sent successfully',
        messageId: response,
      };
    } catch (error) {
      this.logger.error('Error sending test notification:', error);
      throw error;
    }
  }
}
