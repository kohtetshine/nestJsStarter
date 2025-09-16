import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    description: 'Hello message',
    schema: {
      type: 'object',
      properties: { message: { type: 'string', example: 'Hello from NestJS!' } },
    },
  })
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOkResponse({
    description: 'Health status',
    schema: {
      type: 'object',
      properties: { status: { type: 'string', example: 'ok' } },
    },
  })
  health(): { status: string } {
    return { status: 'ok' };
  }
}
