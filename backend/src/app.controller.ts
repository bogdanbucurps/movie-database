import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProduces } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Ping the API' })
  @ApiProduces('text/plain')
  @ApiOkResponse({ description: 'API is running' })
  ping(): string {
    return this.appService.ping();
  }
}
