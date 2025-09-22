import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ApiOkResponseWrapped } from './api-response/swagger';
import { HelloResponseDto } from './dto/root/responses/hello-response.dto';
import { HealthResponseDto } from './dto/root/responses/health-response.dto';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponseWrapped(HelloResponseDto)
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOkResponseWrapped(HealthResponseDto)
  health(): { status: string } {
    return { status: 'ok' };
  }
}
