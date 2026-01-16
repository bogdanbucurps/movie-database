import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { config } from '@config';

import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: config.tmdb.baseUrl,
      headers: {
        Authorization: `Bearer ${config.tmdb.token}`,
      },
    }),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
