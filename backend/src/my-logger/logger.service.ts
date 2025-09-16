import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLogger extends ConsoleLogger implements LoggerService {}

